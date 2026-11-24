# The Chronicles of History

<p align="center">
  <strong>Automated vertical-video studio for narrated, hand-drawn history shorts</strong><br>
  Python • Remotion • ElevenLabs (+ local voice backup) • Gemini • YouTube Shorts &amp; TikTok
</p>

<p align="center">
  <a href="https://adrlopech.github.io/Chronicles-of-History/">Web Portal</a> •
  <a href="https://adrlopech.github.io/Chronicles-of-History/terms.html">Terms of Service</a> •
  <a href="https://adrlopech.github.io/Chronicles-of-History/privacy.html">Privacy Policy</a> •
  <a href="https://www.tiktok.com/@chroniclesofhistorytv">TikTok</a> •
  <a href="https://www.youtube.com/@chroniclesofhistorytv">YouTube</a>
</p>

---

## What it is

The production pipeline behind the official **@chroniclesofhistorytv** channels (a sibling of [Silicon Verdict](https://github.com/adrlopech/Silicon-Verdict), built on the same engine).
One command picks a format and a topic, writes a structured script with an LLM, fact-checks it, narrates it, renders a 1080×1920 video with Remotion (62-90 s, English, always subtitled),
mixes the sound, runs a quality gate and uploads it. A poster-style cover comes with every video. Single-owner automation: no public accounts, no multi-tenant service.

```
format + topic ─► script ─► validators ─► fact-check ─► voice ─► Remotion render ─► sound mix ─► QA gate ─► cover ─► YouTube / TikTok
```

## Content

Eight story formats, each with its own scenes, prompt rules and validator (one-minute floor enforced for all):

| Format | Series | What it is |
|---|---|---|
| `mystery` | Unsolved | One unsolved or disputed mystery: what we know, two theories, what is missing |
| `dayinlife` | A Day In | The day of an ordinary person at a precise place and year |
| `turning` | Turning Point | The decision or moment that changed history |
| `lies` | History Lies | Popular beliefs stamped myth, fact or partly |
| `whatif` | What If History | A counterfactual built on a documented hinge |
| `duel` | History Duel | Two real contenders, round by round |
| `journey` | The Route | An expedition drawn on a treasure-style map of real coastlines |
| `portrait` | Life in Dates | One life told through its key dates |

Details: [guide/formats.md](guide/formats.md).

**Look and colour.** Eleven era looks (antiquity, manuscript, seachart, empire, industrial, wartime, prehistory, renaissance, orient, frontier, spaceage) and seven warm colour themes
(gilded, sepia, ember, regal, bronze, ivory, smoke) that rotate between videos. Everything stays inside the official brown-and-gold palette ([guide/palette.md](guide/palette.md)): never blue, green or purple.

**Art.** Everything is drawn by code from a closed vocabulary: 127 historical characters (front, side and back views, 37 actions), 25 animals, 71 structures, props and weather, filtered by era.

## Quick start

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd remotion_studio && npm install && cd ..
cp .env.example .env        # Gemini and ElevenLabs keys; YouTube credentials for publishing
.venv/bin/python scripts/authenticate_yt.py
.venv/bin/python main.py --motion-format turning --export-only   # a first video, nothing uploaded
```

## Everyday commands

```bash
PYTHONPATH=. .venv/bin/python scripts/genera_batch.py --plan     # plan videos (add --date YYYY-MM-DD)
PYTHONPATH=. .venv/bin/python scripts/genera_batch.py            # produce and schedule them on YouTube
.venv/bin/python main.py --motion-format any                     # one video of a weighted random format
.venv/bin/python scripts/upload_existing.py "<video.mp4>"        # upload a rendered video
.venv/bin/python scripts/report_retention.py                     # real YouTube retention by video, format and look
.venv/bin/python scripts/cleanup.py                              # wipe generated output
.venv/bin/python main.py help                                    # command reference
```

## Documentation

Everything lives in [`guide/`](guide/README.md): quick start, daily workflow, formats, pipeline, motion engine, palette, branding, voice, publishing, analytics and development.
Instructions for the AI assistant that operates the repository: [`CLAUDE.md`](CLAUDE.md).

## Development

```bash
.venv/bin/python -m pytest && .venv/bin/ruff check .
cd remotion_studio && npx tsc --noEmit -p .
python3 docs/check_portal.py
```

GitHub Actions (`.github/workflows/ci.yml`) runs lint, tests, the TypeScript check and the portal link check on every push.

## Privacy & platform compliance

The project follows the **Google API Services User Data Policy** (YouTube API Services) and the TikTok terms.

* **No visitor or viewer data is collected**: the portal sets no cookies, uses no analytics and loads nothing from third parties.
* **Local credentials**: API keys and OAuth tokens live in git-ignored local files.
* **API use**: the YouTube APIs are used only for the channel's own videos and statistics.

Full documents: [Terms of Service](https://adrlopech.github.io/Chronicles-of-History/terms.html) • [Privacy Policy](https://adrlopech.github.io/Chronicles-of-History/privacy.html)

## Fair use and accuracy notice

Stories are told for education and commentary; names of real people and places are used for that purpose. Illustrations are stylised and not historical photographs. Maps use public-domain
[Natural Earth](https://www.naturalearthdata.com/) data. Scripts are AI-assisted and fact-checked automatically; if you find an error, [open an issue](https://github.com/adrlopech/Chronicles-of-History/issues).

## Official links

* **Web Portal**: <https://adrlopech.github.io/Chronicles-of-History/>
* **YouTube**: [@chroniclesofhistorytv](https://www.youtube.com/@chroniclesofhistorytv)
* **TikTok**: [@chroniclesofhistorytv](https://www.tiktok.com/@chroniclesofhistorytv)

---

<p align="center">
  <sub>&copy; 2026 The Chronicles of History. All rights reserved.</sub>
</p>
