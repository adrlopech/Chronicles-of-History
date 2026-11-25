# The Chronicles of History: guide

Everything you need to run, understand and change the studio. Start with the first two pages; the rest is reference.

| Page | Read it when you want to... |
|---|---|
| [Quick start](quick-start.md) | install the project, set the keys and render your first video |
| [Daily workflow](daily-workflow.md) | make and schedule the four videos of the day (`genera`), retry a failed slot, clean up |
| [Formats](formats.md) | know what each of the eight history formats is, how to call it and what its validator demands |
| [Pipeline](pipeline.md) | follow a video from topic to upload: scripts, fact-check, voice, render, sound, QA, covers |
| [Motion engine](motion-engine.md) | change how videos look: scenes, the eleven era looks, the illustration kit, captions |
| [Voice](voice.md) | understand narrator rotation, ElevenLabs and the local backup voice |
| [Publishing](publishing.md) | upload to YouTube and TikTok: OAuth, scheduling, covers, hashtags, TikTok Studio steps |
| [Analytics](analytics.md) | read the channel numbers and see how `genera` picks formats and hours |
| [Development](development.md) | run tests and CI, find a file, fix the usual failures |
| [Palette](palette.md) | the brown-and-gold rule and every official colour |
| [Branding](branding.md) | the Chronicler mascot, avatar, banner and watermark |
| [Web portal](portal.md) | the public site: build, library, press kit |

## The studio in one paragraph

One command picks a format and a topic, asks an LLM for a structured script, checks the facts, narrates it with ElevenLabs, renders a 1080x1920 video with
Remotion, mixes the sound, runs a quality gate and uploads it. Videos last 62-90 seconds (never under 61), are always in English and always use the channel palette:
**brown and gold, with a historical air** ([Palette](palette.md)). Everything is told as an **illustrated archive**: parchment, ink and animated vector drawings made in code (no photographs, no AI images).

## Vocabulary

| Term | Meaning |
|---|---|
| **Motion project** | The JSON that describes one video: title, tags, pinned comment and a list of scenes (`MotionProject` in `services/motion_generator.py`) |
| **Scene** | One screen of the video: a type (`statement`, `date`, `timeline`, `map`, `versus`, `verdict`...), its text, and the narration read over it |
| **Format** | A recipe with its own scene types, prompt rules and validator (mystery, turning, duel...). See [Formats](formats.md) |
| **Look** | One of eleven era identities (antiquity, manuscript, seachart, empire, industrial, wartime, prehistory, renaissance, orient, frontier, spaceage), chosen from the topic. All are warm |
| **Theme** | The colour variant of the paper and ink inside the palette (gilded, sepia, bronze...) |
| **Shot** (`art`) | An illustration behind a scene: place, time of day, weather and subjects from a closed vocabulary, checked against the era |
| **Series** | The recurring name and number of a format ("Turning Point #7"), in the title, on the first frame and as a hashtag |
| **Slot** | One of the four publication hours of a `genera` batch: 13:00, 16:00, 19:00, 22:00 UTC (14:00, 17:00, 20:00, 23:00 in Madrid in winter) |
| **Story bank** | SQLite table of ready scripts that the pipeline uses before asking an LLM |
| **Validator** | The code that rejects a script that breaks a rule (length, cold open, open loop, vote, anachronisms...). LLM answers that fail are retried, then fall back to another provider |

## Where things live

```
main.py                    CLI entry point (always produces Motion videos)
services/motion_*.py       script generator, validators, pipeline (voice, render, sound, QA, upload)
services/looks.py          chooses the era look of each video (themes.py: its colour theme)
services/series.py         names and numbers each format ("Turning Point #7")
services/youtube.py        YouTube upload (minute and channel checks) and thumbnails
services/yt_analytics.py   YouTube Analytics reader
remotion_studio/src/chronicle  the video itself (React / Remotion); art/ is the vector illustration kit
scripts/genera_batch.py    the four-videos-a-day command
data/                      databases, manifests, hand-written scripts (private files are git-ignored)
output/                    rendered videos, one folder per title (git-ignored)
docs/                      the public web portal (GitHub Pages), not documentation
notes/                     private research notes (git-ignored)
```
