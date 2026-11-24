# Chronicle: assistant instructions

Automatic studio of vertical history videos (Motion Graphics, 62-90 s, English) for a new channel (name and handles still to be decided).
Sibling of `Silicon Verdict` (`../Silicon Verdict`): same Remotion engine and pipeline, **its own brand, channels, tokens and data**. Never publish from here to the Silicon Verdict channels.

## Status

Scaffold only. The code is a copy of the tracked files of Silicon Verdict and still carries tech-channel pieces. Next steps, in order:

1. Pick the channel name and handles; replace the brand (colours in `remotion_studio/src/motion/types.ts` and `looks.ts`, text in `scripts/make_brand_assets.py`).
2. Rewrite the generator prompts and validators in `services/motion_generator.py` for history (hook, 3-5 verified facts, closer; no prices, no games, no tech news).
3. Remove what history does not use: `services/prices.py`, `game_*`, `tech_news.py`, price/game scripts and their tests.
4. New YouTube OAuth for the new channel (`scripts/authenticate_yt.py`), new `tokens/`. Ask the operator each time.
5. Pilot: 10 videos, 2-3 weeks, compare retention with Silicon Verdict (`scripts/report_retention.py`).

## Setup notes

- `.venv` and `remotion_studio/node_modules` are symlinks to the Silicon Verdict ones (saves about 2 GB). Updating dependencies there affects both projects. To make this repo standalone: delete the symlinks, then `python -m venv .venv && .venv/bin/pip install -r requirements.txt` and `cd remotion_studio && npm install`.
- Secrets (`.env`, `client_secrets.json`, `token.json`, `tokens/`) are gitignored and must be created for this project.
- Facts in history scripts must be verifiable; no invented dates or quotes.
- Commit and push straight to `main`, no branches.

Commands and formats are the same as in Silicon Verdict; see `guide/`.
