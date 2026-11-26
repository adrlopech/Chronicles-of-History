# Daily workflow: `genera`

`genera` makes **two videos of two different formats** a day (four until 2026-11-26) and schedules them on YouTube and TikTok at the best hours. It is the normal way to publish.
In a chat with Claude Code the word `genera` (or `/genera`) runs the whole flow without questions: the operator has authorized publishing.
The steps the assistant follows are in `.claude/commands/genera.md`; this page explains what each step does and how to do it by hand.

## 1. Plan

```bash
PYTHONPATH=. .venv/bin/python scripts/genera_batch.py --plan                   # tomorrow
PYTHONPATH=. .venv/bin/python scripts/genera_batch.py --plan --date 2026-11-17 # a given UTC date (use today's date to publish today)
```

The plan shows two rows: hour in UTC and Madrid, format and why it was chosen.

**How formats are chosen** (see [Analytics](analytics.md)): the best proven format (score = 60 % average percentage viewed + 40 % engaged views, with at least 100 views)
and one exploration (the format with the fewest published videos), from the eight formats of [Formats](formats.md).
While the channel has no numbers (or no token) both are explorations. `--count 1` makes a single video in the best slot. Pass `--avoid mystery,duel` to leave out the formats of the previous day.

**How hours are chosen:** the default slots are 16:00 and 22:00 UTC (17:00 and 23:00 in Madrid in winter, one hour later in summer; the plan computes it for the batch's date).
`data/batches/log.json` remembers the slot of every scheduled video; once two or more slots have at least two videos with views, slots are ranked by average views and the best two are used.
The best formats get the best slots.

## 2. Produce and schedule on YouTube

```bash
PYTHONPATH=. .venv/bin/python scripts/genera_batch.py --date 2026-11-17 > /tmp/genera.log 2>&1
```

It first runs the health check (`scripts/health_check.py`: token, voice credits, Gemini, bank, disk) and stops if something would make the batch fail.
Then it takes five to ten minutes and nothing needs watching. For every slot it renders the video with the normal pipeline (export only), uploads it to YouTube as **private with `publishAt`**
(YouTube publishes it at that time), sets the cover as the thumbnail, makes a copy under 10 MB for TikTok, and appends the entry to `data/batches/latest.json`:
title, TikTok caption, hashtags, TikTok copy, cover, slot and YouTube id. The manifest is saved after every video, so a crash loses nothing.
A video that fails the [QA gate](pipeline.md#6-qa-gate) (for example under 61 s) is **not uploaded**: the slot stays empty and the log says `NOT uploaded, QA failed`.

Options: `--seed`, `--avoid`, `--out FILE` (manifest path), `--topics FILE` (see below), `--public-first` (the first video of the plan, whose slot has already passed, is uploaded public right away instead of scheduled; its TikTok copy is published with "Ahora").

### When a slot fails

The LLM layer sometimes cannot give a script that passes the validators (Gemini 503 or 504, validator rejections). **The batch fills such a slot by itself**: it takes a banked script of a format that is
not already in the plan (`FALLBACK_ORDER` in `scripts/genera_batch.py`: mystery, turning, whatif, duel, lies, journey, portrait, dayinlife; reorder it once the numbers say which formats win) and prints `slot filled with a banked <format> script`; the manifest and `data/batches/log.json` record the format that was really made. Keep the bank stocked
(`scripts/refill_story_bank.py`, `count_ready` in `services/story_bank.py`): a slot is only lost when no banked script is left. A hand-written script is never replaced.
If a slot is still lost (`FAILED (nothing uploaded for this slot)`), fill the gap with a topics file:

```json
[
  {"format": "turning", "why": "hand-written script", "slot": "16:00", "script": "data/scripts/caesar_rubicon.json"},
  {"format": "portrait", "topic": "Leonardo da Vinci", "source": "data/topics/da_vinci.txt", "slot": "22:00"}
]
```

```bash
PYTHONPATH=. .venv/bin/python scripts/genera_batch.py --date 2026-11-17 --topics /tmp/retry.json --out data/batches/retry.json
```

Each entry takes `format` (`classic` = a free-form history with no format), optionally `slot` (UTC `HH:MM`), `topic` and `source` (a text file the script must be grounded on), or `script`
(a hand-written `MotionProject` JSON from `data/scripts/`, checked by the same validator). A hand-written script is the surest way to fill a slot: it needs no model.
YouTube can also refuse uploads for a daily limit (`uploadLimitExceeded`); `scripts/retry_youtube_uploads.py <manifest>` sends the missing ones again a day later.

## 3. Verify YouTube

Every video must be `private` with the right `publishAt`:

```bash
PYTHONPATH=. .venv/bin/python - <<'EOF'
from services.youtube import youtube_service
y = youtube_service.get_authenticated_client()
for v in y.videos().list(part="status,snippet", id="ID1,ID2").execute()["items"]:
    print(v["id"], v["status"]["privacyStatus"], v["status"].get("publishAt"), v["snippet"]["title"][:50])
EOF
```

## 4. Schedule on TikTok

TikTok has no API access here, so the assistant drives TikTok Studio in the browser with Claude in Chrome, one entry of `data/batches/latest.json` at a time:
upload `tiktok_copy`, write `caption`, pick every hashtag from the dropdown, upload `cover`, choose "Programación" and the hour, press "Programar".
The exact clicks and the traps are in [Publishing](publishing.md#tiktok-studio-step-by-step). Finally check `tiktokstudio/content`: both must appear with their hour.

## 5. Report

A table with video, format, Madrid hour and YouTube link, and a note of anything that could not be checked. If another video is already scheduled for the same hour, move the new one.

## Fixed rules

- Hashtags are a single joined word (`#ancientrome`, never `#ancient rome`).
- Videos last at least 61 seconds (`FLOOR_SECONDS`; monetisation). A shorter one is never published: lengthen the script or remake it.
- Official channels: YouTube and TikTok `@chroniclesofhistorytv`. Never publish to the Silicon Verdict channels (`@SiliconVerdictHQ`, `@siliconverdict`).
- Code changes go straight to `main` (commit and push, no feature branches).

## Other daily tasks

| Task | Command |
|---|---|
| One video by hand | `.venv/bin/python main.py --motion-format <format> --export-only` (omit `--export-only` to upload as well) |
| Upload a rendered video | `.venv/bin/python scripts/upload_existing.py "<video.mp4>" [--privacy private --publish-at 2026-11-17T13:00:00Z]` |
| Render hand-written scripts with voice | `PYTHONPATH=. .venv/bin/python scripts/render_hand_script.py caesar_rubicon roanoke_colony` (files under `output/`, nothing uploaded) |
| Top up the story bank | `.venv/bin/python scripts/refill_story_bank.py [--format <format> --target 8]` |
| Clean generated output (`limpieza`) | `.venv/bin/python scripts/cleanup.py` (`--dry-run` to preview) |
| Retention report | `.venv/bin/python scripts/report_retention.py` |
| Add new videos to the web portal | `.venv/bin/python scripts/update_site_videos.py` then `python3 scripts/build_portal.py` ([Web portal](portal.md)) |
| Renew the YouTube token (only after `invalid_grant`) | see [Publishing](publishing.md#youtube-oauth) |

`limpieza` empties `output/tiktok/`, `output/tiktok_small/`, `output/youtube/` and `temp/`; it keeps `data/`, `assets/`, `.env`, credentials and logs. Nothing deletes `output/tiktok/` automatically, because
the TikTok copies wait there for manual upload until you ask.
