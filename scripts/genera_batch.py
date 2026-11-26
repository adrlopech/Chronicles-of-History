#!/usr/bin/env python3
"""The `genera` command: 2 Motion videos (The Chronicles of History) picked from the channel's own numbers, rendered, and scheduled for TOMORROW at the best hours.

  python scripts/genera_batch.py --plan            # only show the plan (formats, hours, why) and stop
  python scripts/genera_batch.py                   # plan + render 2 + schedule them on YouTube + prepare the TikTok copies
  python scripts/genera_batch.py --date 2026-11-12 # another day (UTC date)

What it does
 1. Formats: scores every format with the YouTube Analytics numbers (average % viewed 60 %, engaged views 40 %, views-weighted, joined with
    shorts_history); formats with no data yet count as "unknown" and keep their FORMAT_WEIGHTS prior. The batch is 2 DIFFERENT formats:
    the best proven one and 1 exploration (the format with the fewest published videos). No data at all = explorations.
    A bigger --count keeps the same mix: half proven, one exploration, the rest weighted draws.
 2. Hours (UTC): data/batches/log.json remembers the slot of every scheduled video; once a slot has 2+ videos with views, slots are ranked by average views.
    Until then the default slots below are used (English-speaking audience: US late morning and US end of the working day / EU evening).
 3. Renders each video with the normal Motion pipeline (export only), uploads it to YouTube as private + publishAt (scripts/upload_existing.py) and writes
    data/batches/latest.json: title, joined hashtags, TikTok caption, a <10 MB copy for the TikTok upload and the slot in UTC and in Madrid time.
 TikTok has no API here: the assistant finishes it in TikTok Studio (see .claude/commands/genera.md): upload the copy, caption + each hashtag picked from the dropdown,
 "Programación" at the slot (TikTok Studio shows GMT+0 Lisbon = UTC).
"""
import argparse
import json
import os
import random
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional
from zoneinfo import ZoneInfo

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

DEFAULT_SLOTS_UTC = ["16:00", "22:00"]  # 11 am / 5 pm New York; 5 pm / 11 pm Madrid (winter). Two videos a day since 2026-11-26 (was four)
LOG = BASE_DIR / "data" / "batches" / "log.json"
LATEST = BASE_DIR / "data" / "batches" / "latest.json"
SMALL_DIR = BASE_DIR / "output" / "tiktok_small"
FORMAT_ALIASES: Dict[str, str] = {}
MADRID = ZoneInfo("Europe/Madrid")  # UTC+1 in winter, UTC+2 in summer


def format_stats() -> Dict[str, Dict[str, float]]:
    """format -> {videos, views, score} from YouTube Analytics; {} when analytics are unavailable."""
    try:
        from scripts.report_retention import build, early_groups, groups
        rep = build(90, 10 ** 9)  # no retention curves needed here
    except Exception as exc:  # token missing, offline...
        print(f"  (analytics unavailable: {exc}; using the format weights)")
        return {}
    out: Dict[str, Dict[str, float]] = {}
    for g in groups([r for r in rep["videos"]], "format"):
        name = FORMAT_ALIASES.get(g["name"], g["name"])
        score = 0.6 * min(g["avg"], 100.0) + 0.4 * g["engaged"]  # replayed loops pass 100 %: capped so one loop does not win
        prev = out.setdefault(name, {"videos": 0, "views": 0, "score": 0.0})
        tot = prev["views"] + g["views"]
        prev["score"] = (prev["score"] * prev["views"] + score * g["views"]) / tot if tot else score
        prev["videos"] += g["videos"]
        prev["views"] = tot
    for g in early_groups(rep["videos"], "format"):  # the fair comparison: views in each video's first 3 days, whatever its age
        name = FORMAT_ALIASES.get(g["name"], g["name"])
        prev = out.setdefault(name, {"videos": 0, "views": 0, "score": 0.0})
        n0, e0 = prev.get("early_videos", 0), prev.get("early_per_video", 0.0)
        prev["early_videos"] = n0 + g["videos"]
        prev["early_per_video"] = (e0 * n0 + g["early_per_video"] * g["videos"]) / prev["early_videos"]
    return out


def pick_formats(stats: Dict[str, Dict[str, float]], rng: random.Random, n: int = 2, avoid: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    from services.motion_generator import FORMAT_WEIGHTS, FORMATS
    pool = [f for f in FORMATS if f in FORMAT_WEIGHTS and f not in (avoid or [])]
    chosen: List[Dict[str, Any]] = []

    def add(fmt: str, why: str) -> None:
        if fmt not in [c["format"] for c in chosen]:
            chosen.append({"format": fmt, "why": why})

    proven = sorted([f for f in pool if stats.get(f, {}).get("videos", 0) >= 1 and stats[f]["views"] >= 100], key=lambda f: (-stats[f].get("early_per_video", 0.0), -stats[f]["score"]))
    for f in proven[:n // 2]:  # 2 videos: 1 proven; 4 videos: 2 proven
        early = f", {stats[f]['early_per_video']:.0f} views per video in 3 days (n={stats[f]['early_videos']})" if stats[f].get("early_videos") else ""
        add(f, f"proven: {stats[f]['score']:.0f} points over {stats[f]['videos']} video(s), {stats[f]['views']:.0f} views{early}")
    explore = sorted(pool, key=lambda f: (stats.get(f, {}).get("videos", 0), -FORMAT_WEIGHTS.get(f, 1)))
    for f in explore:
        if len(chosen) >= n // 2 + 1:  # then one exploration
            break
        add(f, f"exploration: only {stats.get(f, {}).get('videos', 0):.0f} published")
    rest = [f for f in pool if f not in [c["format"] for c in chosen]]
    while len(chosen) < n and rest:
        f = rng.choices(rest, weights=[FORMAT_WEIGHTS.get(x, 1) for x in rest])[0]
        add(f, "weighted draw")
        rest.remove(f)
    return chosen[:n]


def ranked_slots() -> List[str]:
    """Default slots, re-ordered by the average views of past videos in each slot once there are 2+ samples per slot."""
    if not LOG.is_file():
        return DEFAULT_SLOTS_UTC
    try:
        from services import yt_analytics as ya
        views = {v["video_id"]: v["views"] for v in ya.videos()}
    except Exception:
        return DEFAULT_SLOTS_UTC
    per: Dict[str, List[int]] = {}
    for e in json.loads(LOG.read_text()):
        if e.get("video_id") in views:
            per.setdefault(e["slot"], []).append(views[e["video_id"]])
    known = {s: sum(v) / len(v) for s, v in per.items() if len(v) >= 2}
    if len(known) < 2:
        return DEFAULT_SLOTS_UTC
    return sorted(set(DEFAULT_SLOTS_UTC) | set(known), key=lambda s: -known.get(s, 0))[:len(DEFAULT_SLOTS_UTC)]


def small_copy(src: str, dst: Path) -> Path:
    """<10 MB copy for the TikTok upload tool (it caps one call at 10 MB)."""
    from services.voice import get_ffmpeg_bin
    dst.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg = get_ffmpeg_bin()
    p = subprocess.run([ffmpeg, "-hide_banner", "-i", src], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr)
    secs = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) if m else 75.0
    kbps = int(8.0 * 8192 / secs) - 96  # 8 MB target
    subprocess.run([ffmpeg, "-loglevel", "error", "-y", "-i", src, "-c:v", "libx264", "-b:v", f"{kbps}k", "-maxrate", f"{kbps + 100}k", "-bufsize", f"{2 * kbps}k", "-c:a", "aac", "-b:a", "96k", str(dst)], check=True)
    return dst


def tiktok_caption(title: str) -> Dict[str, Any]:
    tags = re.findall(r"#([A-Za-z0-9]+)", re.sub(r"#\d+", "", title))
    text = re.sub(r"#(\d+)", r"\1", title)  # "#1" would turn into a hashtag in the TikTok box: write "1"
    text = re.sub(r"\s*#\w+", "", text).strip()
    return {"caption": text, "hashtags": ["#" + t for t in tags]}


def prepare(p: Dict[str, Any]) -> Any:
    """First half of a video of the plan (script, narration): a chosen subject with its own source text, a hand-written script or a data-picked format."""
    from services.motion_pipeline import prepare_motion_video
    if p.get("script"):  # a hand-written MotionProject (JSON), checked by the same validator as generated ones
        from services.motion_generator import MotionProject, make_validator
        script = MotionProject.model_validate_json((BASE_DIR / p["script"]).read_text(encoding="utf-8"))
        facts = (BASE_DIR / p["source"]).read_text(encoding="utf-8") if p.get("source") else None
        problems = make_validator(facts=facts, fmt=None if p["format"] == "classic" else p["format"], retention=True)(script)
        if problems:
            raise ValueError(f"the script {p['script']} does not pass the validator: {problems}")
        return prepare_motion_video(topic=script.topic, fmt="auto" if p["format"] == "classic" else p["format"], source_text=facts, script=script)
    if p.get("topic"):
        source = (BASE_DIR / p["source"]).read_text(encoding="utf-8") if p.get("source") else None
        return prepare_motion_video(topic=p["topic"], fmt="auto" if p["format"] == "classic" else p["format"], source_text=source)
    return prepare_motion_video(fmt=p["format"])


FALLBACK_ORDER = ["mystery", "turning", "whatif", "duel", "lies", "journey", "portrait", "dayinlife"]  # the order of the first test wave; reorder it once the channel's numbers say which formats win


def choose_fallback(plan: List[Dict[str, Any]], failed: str, stock: Dict[str, int]) -> List[str]:
    """Formats that can take over a slot whose script could not be made: the banked ones (stock > 0) that are not already in the plan, best first."""
    taken = {p["format"] for p in plan} - {failed}
    return [f for f in FALLBACK_ORDER if stock.get(f, 0) > 0 and f not in taken and f != failed]


def prepare_with_fallback(p: Dict[str, Any], plan: List[Dict[str, Any]]) -> Any:
    """`prepare`, and if the script cannot be made (every LLM saturated, validators rejecting everything) the slot is filled with a banked script of another format
    instead of being lost. The plan item is updated so the manifest and the hour log show the format that was really made."""
    from services.motion_pipeline import prepare_motion_video
    from services.story_bank import ready_by_format
    try:
        return prepare(p)
    except Exception as exc:
        if p.get("script"):  # a hand-written script does not depend on any model: its problem is its own
            raise
        original = p["format"]
        print(f"  {original}: script not possible ({str(exc)[:160]}). Looking for a banked script to fill the slot...")
        for fmt in choose_fallback(plan, original, ready_by_format("motion")):
            try:
                prep = prepare_motion_video(fmt=fmt, bank_only=True)
            except Exception as bank_exc:  # the bank was emptied meanwhile, or the script failed in voice
                print(f"  banked {fmt} failed: {str(bank_exc)[:120]}")
                continue
            p["format"], p["why"] = fmt, f"fallback for {original} (no script available): banked {fmt}"
            print(f"  slot filled with a banked {fmt} script")
            return prep
        raise


def can_prefetch(p: Dict[str, Any]) -> bool:
    """The next video can be prepared while this one renders (script and voice need no CPU-heavy work)."""
    from services.motion_generator import FORMATS
    return p["format"] in FORMATS


def run_plan(plan: List[Dict[str, Any]], prepare_fn: Callable, finish_fn: Callable, publish_fn: Callable, public_first: bool = False, can_prefetch_fn: Callable = can_prefetch) -> None:
    """Produces the videos of the plan in order. Three stages overlap: while video N renders (finish_fn), video N+1 is prepared (script, voice: prepare_fn) and video N-1 is uploaded (publish_fn).
    A video that fails in any stage is reported and skipped; the others carry on."""
    with ThreadPoolExecutor(max_workers=1) as preparer, ThreadPoolExecutor(max_workers=1) as uploader:
        prepared: Dict[int, Any] = {}

        def kick(i: int) -> None:
            if i < len(plan) and i not in prepared:
                prepared[i] = preparer.submit(prepare_fn, plan[i])

        uploads = []
        kick(0)
        for i, p in enumerate(plan):
            print(f"\n== {p['format']} ==")
            try:
                prep = prepared[i].result()
                if i + 1 < len(plan) and can_prefetch_fn(plan[i + 1]):
                    kick(i + 1)
                res = finish_fn(prep)
            except Exception as exc:  # one failed script must not lose the videos already uploaded: carry on with the next
                print(f"  FAILED (nothing uploaded for this slot): {str(exc)[:300]}")
                kick(i + 1)
                continue
            uploads.append(uploader.submit(publish_fn, p, res, public_first and p is plan[0]))
            kick(i + 1)
        for u in uploads:
            try:
                u.result()
            except Exception as exc:  # one failed upload must not hide the others or skip the final report
                print(f"  upload step FAILED: {str(exc)[:300]}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--plan", action="store_true", help="show the plan and stop")
    ap.add_argument("--date", help="UTC date to publish on (default: tomorrow)")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--public-first", action="store_true", help="the first video of the plan (its slot already passed) is uploaded PUBLIC right away instead of scheduled")
    ap.add_argument("--avoid", default="", help="comma-separated formats to leave out (e.g. the ones of the previous day)")
    ap.add_argument("--count", type=int, default=len(DEFAULT_SLOTS_UTC), choices=range(1, len(DEFAULT_SLOTS_UTC) + 1), metavar=f"1-{len(DEFAULT_SLOTS_UTC)}",
                    help=f"how many videos to make (default {len(DEFAULT_SLOTS_UTC)}, one per slot); fewer take the best-ranked slots")
    ap.add_argument("--skip-youtube", action="store_true", help="render and prepare the TikTok copies only: no YouTube upload (for example while the channel has no token yet)")
    ap.add_argument("--out", default=None, help="where to write the batch manifest (default data/batches/latest.json)")
    ap.add_argument("--topics", default=None, help="JSON file with the videos to make instead of the data-picked formats: [{format, topic, source (path to a text file), why}]; "
                                                  "format 'classic' = the classic explainer. Slots are assigned in file order (first = best slot)")
    args = ap.parse_args()

    day = datetime.strptime(args.date, "%Y-%m-%d").date() if args.date else (datetime.now(timezone.utc) + timedelta(days=1)).date()
    print("Reading the channel's numbers...")
    if args.topics:
        picks = json.loads(Path(args.topics).read_text(encoding="utf-8"))
    else:
        stats = format_stats()
        picks = pick_formats(stats, random.Random(args.seed), n=args.count, avoid=[x for x in args.avoid.split(",") if x])
    slots = ranked_slots()
    plan = []
    for pick, slot in zip(picks, slots):  # the best formats take the best-ranked slots (a topics file may pin a slot with "slot": "HH:MM")
        slot = pick.get("slot", slot)
        when = datetime.strptime(f"{day} {slot}", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
        plan.append({**pick, "slot": slot, "publish_at": when.strftime("%Y-%m-%dT%H:%M:00Z"), "madrid": when.astimezone(MADRID).strftime("%H:%M")})
    plan.sort(key=lambda p: p["slot"])
    print(f"\nPlan for {day} (UTC; Madrid = {datetime.combine(day, datetime.min.time(), MADRID).strftime('UTC%z')[:-2]}):")
    for p in plan:
        print(f"  {p['slot']} UTC / {p['madrid']} Madrid  {p['format']:<10} {p['why']}")
    if args.plan:
        return 0

    from scripts.health_check import FAIL, run as health
    from services.notify import notify
    blockers = [f"{n}: {d}" for st, n, d in health() if st == FAIL and not (args.skip_youtube and n.startswith("YouTube"))]
    if blockers:  # a batch that cannot finish (dead token, no voice credits) is better stopped now than 15 minutes in
        print("Health check failed:", *blockers, sep="\n  - ")
        notify("Chronicles: batch not started", "; ".join(blockers)[:200])
        return 1
    from services.motion_pipeline import finish_motion_video
    done: List[Dict[str, Any]] = []
    out = Path(args.out) if args.out else LATEST
    out.parent.mkdir(parents=True, exist_ok=True)
    LOG.parent.mkdir(parents=True, exist_ok=True)

    def publish(p: Dict[str, Any], res: Dict[str, Any], now: bool) -> None:
        """Uploads one finished video to YouTube, makes its TikTok copy and saves the manifest. Runs in a worker thread while the next video renders."""
        video = res["youtube_video"]
        if res.get("qa_failures"):  # an objective failure (under the minute, no audio, wrong size): the video stays local, the slot stays empty
            print(f"  NOT uploaded, QA failed: {'; '.join(res['qa_failures'])}")
            return
        m = None
        if not args.skip_youtube:
            flags = ["--privacy", "public"] if now else ["--publish-at", p["publish_at"]]  # a slot that already passed: public now, no publishAt
            up = subprocess.run([sys.executable, str(BASE_DIR / "scripts" / "upload_existing.py"), video, *flags], cwd=BASE_DIR, capture_output=True, text=True, env={**os.environ, "PYTHONPATH": str(BASE_DIR)})
            m = re.search(r"youtu\.be/([\w-]+)", up.stdout)
        if not m and not args.skip_youtube:
            print("  YouTube upload failed:", (up.stdout + up.stderr)[-300:])
        small = small_copy(res["tiktok_video"], SMALL_DIR / f"{Path(video).parent.name[:40].replace(' ', '_')}.mp4")
        entry = {**p, **({"public_now": True} if now else {}), "title": res["title"], **tiktok_caption(res["title"]), "video": video, "tiktok_copy": str(small), "cover": res.get("tiktok_cover") or None, "cover_style": res.get("cover_style"), "video_id": m[1] if m else None}
        done.append(entry)
        print(f"  {res['title']}\n  YouTube: {m[0] if m else 'skipped' if args.skip_youtube else 'FAILED'}  | TikTok copy: {small}")
        out.write_text(json.dumps(done, ensure_ascii=False, indent=1))  # saved after every video
        if entry["video_id"]:
            log = json.loads(LOG.read_text()) if LOG.is_file() else []
            LOG.write_text(json.dumps(log + [{"video_id": entry["video_id"], "slot": entry["slot"], "format": entry["format"], "cover_style": entry.get("cover_style"), "date": str(day), **({"family": entry["family"]} if entry.get("family") else {})}], indent=1))

    run_plan(plan, lambda item: prepare_with_fallback(item, plan), lambda prep: finish_motion_video(prep, export_only=True), publish, args.public_first)
    failed = len(plan) - sum(1 for d in done if d.get("video_id") or args.skip_youtube)  # an entry without a video id is a failed upload
    notify("Chronicles: batch " + ("finished" if not failed else "finished with gaps"), f"{len(done)} of {len(plan)} videos scheduled on YouTube for {day}" + (" - rerun the failed ones" if failed else " - TikTok is next"))
    print(f"\nYouTube is scheduled ({len(done)} of {len(plan)}{'; rerun the failed ones with --topics and a pinned slot' if failed else ''}). TikTok: finish in TikTok Studio from {out} (caption, hashtags picked from the dropdown, Programación at each slot).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
