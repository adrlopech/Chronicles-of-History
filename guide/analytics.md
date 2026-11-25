# Analytics

## What can be read

| Source | How | What you get |
|---|---|---|
| **YouTube Analytics API** | `services/yt_analytics.py` with the OAuth token | Views, engaged views, average percentage viewed, retention curve (r20 / r50 / r80), traffic sources, per day. Lags one to two days behind: the newest videos show 0 |
| **YouTube Data API** | `videos().list(part="statistics")` | Views, likes, comments right now (no retention) |
| **TikTok Studio** | Browser, `https://www.tiktok.com/tiktokstudio/content` | Views, likes, comments per post (no API here). The list loads lazily: scroll to see older posts |

The token needs `youtube.upload`, `youtube.readonly` and `yt-analytics.readonly`. Publish the Google Cloud app to Production so the token does not expire weekly; see [Publishing](publishing.md#youtube-oauth).

## The retention report

```bash
.venv/bin/python scripts/report_retention.py                       # last 90 days
.venv/bin/python scripts/report_retention.py --days 28 --min-views 300
```

It joins every video with `data/history.db` to know its format and look, prints a summary, one row per video, **averages by format and by look**, traffic sources and the last days,
and writes `notes/analytics_report_<date>.md` and `data/analytics_report.json` (both private). Reading the columns:

- `engaged` = engaged views / views, the closest the API gets to "viewed instead of swiped away".
- `avg%` = average percentage viewed (a replayed loop can pass 100).
- `r20 r50 r80` = audience still watching a fifth, half and four fifths of the way in.
- With fewer than about **10 videos per format or look the averages are noise**, not a result.

## How `genera` uses the numbers

`scripts/genera_batch.py` calls `format_stats()` (from the same report) and scores each format: `0.6 x min(avg%, 100) + 0.4 x engaged%`, weighted by views and joined with `shorts_history`.
A format counts as **proven** with at least one video and 100 views. The batch is the two best proven formats, one exploration and one weighted draw. With no data (token missing, offline) it prints
`analytics unavailable` and falls back to `FORMAT_WEIGHTS`. Slots are re-ordered by average views once two slots have two or more videos each. Details in [Daily workflow](daily-workflow.md#1-plan).

## What the channel has shown so far

Nothing yet: the first videos went up on 2026-11-24, and the YouTube Analytics API lags one to two days. Until each format has about **10 videos**, treat every average as noise.
The first test wave (CLAUDE.md, next steps 3 and 5) is 2-3 banked scripts per format, then a 10-video pilot over 2-3 weeks compared with Silicon Verdict's retention.
Once the numbers exist, set `FORMAT_WEIGHTS` (`services/motion_generator.py`) and `FALLBACK_ORDER` (`scripts/genera_batch.py`) from them, and write the findings here with dates and sample sizes.

## What to compare

Read them with `scripts/report_retention.py`: besides format and look (era) it groups the videos by **title pattern** (the series prefixes "Unsolved", "Turning Point", "History Duel"... and plain "Why / How / What" titles), **publish hour** and **weekday**, with views per video.
Fewer than about ten videos per group is noise, so use the groups to decide what to test next, not to declare winners.

Things that need the account owner (the API token cannot change them): the YouTube channel description and the TikTok bio. Keep them on one niche, the way the brand describes it ([Branding](branding.md)).

## First-three-days numbers and the cover test

- **Same window for every video.** `services/yt_analytics.early_report` reads each public video's views and average view % over its first three days (cached in `data/early_stats.json`, so only new videos cost a call). `report_retention.py` prints them by format, title pattern and cover style, and `genera_batch.py` ranks "proven" formats by views per video in those three days (the plan reason shows `n=`; fewer than ~5 videos is still a hint, not a result).
- **Cover styles.** The cover of each video is style `a` (the cold open, as before) or `b` (the second scene), chosen by a hash of the title, so half of the videos of each format get each. `cover_style` is recorded in `data/batches/log.json`; the report compares both styles. Judge it only after 15+ videos per style. YouTube allows changing a thumbnail later, so a losing style costs nothing to drop.
