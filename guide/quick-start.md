# Quick start

## Requirements

- macOS on Apple Silicon is the reference machine (an M2 MacBook Air). The local backup voice only runs there; everything else is portable.
- Python 3.11 or newer, Node.js 20, and ffmpeg (the virtual environment ships its own at `.venv/bin/ffmpeg`; it is not on your `PATH`).
- Accounts and keys: Gemini (required), ElevenLabs (required for the main voice), YouTube OAuth client (required to upload). Cloudflare Workers AI is the optional LLM fallback.

## Install

On the reference machine `.venv` and `remotion_studio/node_modules` are symlinks to the Silicon Verdict ones (about 2 GB saved; updating a dependency there changes both projects).
On a fresh machine, or to make this repository standalone, delete those two symlinks and install:

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd remotion_studio && npm install && cd ..
cp .env.example .env
```

Fill `.env`. The variables that matter:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Scripts and fact-check. First choice of the LLM layer |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_MODELS` | Optional fallback provider (Workers AI) |
| `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_1..3` | Narration. Voice 1 is Daniel (unused), 2 is Adam, 3 is Liam ([Voice](voice.md)) |
| `MOTION_VOICE_ROTATION` | `true` rotates the narrator by format, `false` always uses Liam |
| `TTS_BACKEND`, `LOCAL_TTS_FALLBACK` | `elevenlabs` (default) or `local`; whether to use the local clone when ElevenLabs fails |
| `YOUTUBE_TOKEN_PATH`, `YOUTUBE_CLIENT_SECRETS_PATH` | OAuth files. The token is looked up in `data/`, the project root and `tokens/` |
| `YOUTUBE_PRIVACY_STATUS`, `YOUTUBE_CATEGORY_ID` | Default privacy and category (27, Education) |
| `YOUTUBE_CHANNEL_ID` | The only channel uploads may go to (default: the Chronicles channel). A Silicon Verdict token is always refused |

Secrets (`.env`, `client_secrets.json`, `token.json`, `tokens/`) are git-ignored and belong to this project only: never copy them from Silicon Verdict.
Authorize YouTube once (see [Publishing](publishing.md#youtube-oauth)):

```bash
.venv/bin/python scripts/authenticate_yt.py
.venv/bin/python scripts/verify_credentials.py   # probes the API keys without spending credits
```

## Render a first video

Render only, nothing is uploaded:

```bash
.venv/bin/python main.py --motion-format mystery --export-only
```

The result is `output/youtube/<title>/<date-time>.mp4` plus a copy and a `.txt` with metadata in `output/tiktok/<title>/`.

Some more first commands:

```bash
.venv/bin/python main.py help                                   # command reference
.venv/bin/python main.py --motion-format any    # a weighted random format
.venv/bin/python main.py --motion-format turning --topic "Caesar crosses the Rubicon"
.venv/bin/python scripts/render_silent_preview.py data/scripts/caesar_rubicon.json --out /tmp/preview   # silent preview, no voice credits
```

## Preview the design live

```bash
cd remotion_studio && npx remotion studio
```

Open the **MotionGraphic** composition (or **Cover**) and edit its props. Sample props live next to the code: `remotion_studio/src/chronicle/sample.json`.

## Optional: local backup voice

See [Voice](voice.md#local-backup-voice).

## Check that everything works

```bash
.venv/bin/python -m pytest
.venv/bin/ruff check .
cd remotion_studio && npx tsc --noEmit -p .
```

Next: [Daily workflow](daily-workflow.md).
