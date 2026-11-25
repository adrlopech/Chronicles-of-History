"""Updates the web portal's video list (docs/data/videos.json) from the channel's public RSS feed.

Run after publishing new videos:  python3 scripts/update_site_videos.py && python3 scripts/build_portal.py
For every video of the feed it keeps: YouTube id, series, number, subtitle, era (from the history database or the topic's words) and the date. The cover comes from output/youtube/<title>/*.png
(resized to docs/assets/recent/<id>.jpg); a video whose cover is already published keeps it. Videos stay in the file after they leave the feed's last 15 entries.
"""
import json
import re
import sqlite3
import sys
import requests
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
OUT = ROOT / "docs" / "data" / "videos.json"
CHANNEL_ID = "UCgD3S0sVUW-HWYm9b8PiRRA"  # @chroniclesofhistorytv
FEED = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def parse_title(title: str):
    """Both title shapes -> ('Unsolved', 1, 'Did Jesse James Fake His Death?'):
    'Did Jesse James Fake His Death? | Unsolved #1 #history' (the current one, hook first) and 'Unsolved #1: Did Jesse James Fake His Death? #history' (the first videos)."""
    t = re.sub(r"\s+#[A-Za-z]\w*", "", title).strip()
    m = re.match(r"^(.*?)\s*\|\s*(.+?)\s*#(\d+)$", t)
    if m:
        return m.group(2), int(m.group(3)), m.group(1)
    m = re.match(r"^(.*?)\s*#(\d+):\s*(.*)$", t)
    return (m.group(1), int(m.group(2)), m.group(3)) if m else ("", 0, t)


def look_of(title: str, subtitle: str) -> str:
    try:
        con = sqlite3.connect(ROOT / "data" / "history.db")
        for (preset, t) in con.execute("SELECT preset, title FROM shorts_history WHERE preset LIKE 'remotion_motion:%'"):
            if norm(t) == norm(title):
                return preset.split(":")[1]
    except Exception:
        pass
    from services.looks import era_look

    return era_look(subtitle) or "manuscript"


def cover_for(series: str, subtitle: str, vid: str):
    from PIL import Image

    want = norm(series + subtitle)
    for d in sorted((ROOT / "output" / "youtube").glob("*"), reverse=True):
        if norm(d.name) == want:
            pngs = sorted(d.glob("*.png"))
            if pngs:
                im = Image.open(pngs[-1]).convert("RGB")
                im = im.resize((540, int(im.height * 540 / im.width)), Image.LANCZOS)
                dest = ROOT / "docs" / "assets" / "recent" / f"{vid}.jpg"
                dest.parent.mkdir(parents=True, exist_ok=True)
                im.save(dest, quality=82, optimize=True)
                return f"assets/recent/{vid}.jpg"
    return None


def main() -> None:
    xml = requests.get(FEED, timeout=30).text
    known = {v["id"]: v for v in json.loads(OUT.read_text())} if OUT.exists() else {}
    for m in re.finditer(r"<entry>.*?<yt:videoId>(.*?)</yt:videoId>.*?<title>(.*?)</title>.*?<published>(.*?)</published>", xml, re.S):
        vid, title, published = m.groups()
        title = title.replace("&amp;", "&").replace("&#39;", "'").replace("&quot;", '"')
        series, n, sub = parse_title(title)
        old = known.get(vid, {})
        known[vid] = {
            "id": vid, "series": series, "number": n, "title": sub, "look": old.get("look") or look_of(title, sub), "published": published,
            "cover": old.get("cover") or cover_for(series, sub, vid),
        }
    videos = sorted(known.values(), key=lambda v: v["published"], reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(videos, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(videos)} videos -> {OUT.relative_to(ROOT)}; without cover: {[v['id'] for v in videos if not v['cover']]}")


if __name__ == "__main__":
    main()
