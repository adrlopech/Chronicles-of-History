# Chronicle: assistant instructions

Automatic studio of vertical history videos (Motion Graphics, 62-90 s, English) for the channel **The Chronicles of History**: YouTube `@chroniclesofhistorytv` and TikTok `@chroniclesofhistorytv` (both handles were free on 2026-11-24; the channel still has to be created).
Sibling of `Silicon Verdict` (`../Silicon Verdict`): same Remotion engine and pipeline, **its own brand, channels, tokens and data**. Never publish from here to the Silicon Verdict channels.

## Status

The visual style is new (an illustrated archive with six era looks: `guide/motion-engine.md`). The eight history formats (`guide/formats.md`: mystery, dayinlife, turning, lies, whatif, duel, journey, portrait) and their generator, validators and prompts are new; the tech formats, games, prices and news are gone. The rest of `guide/` and the brand assets are still the tech channel's. Next steps, in order:

1. Brand assets for the channels (logo, cover, avatar): `scripts/make_brand_assets.py` still draws Silicon Verdict's.
2. Illustrations are animated vector art drawn in code (`remotion_studio/src/chronicle/art/`): grow the kit (more subjects, places, characters) by adding to `art/vocab.ts` AND `services/motion_generator.py`. No photographs and no AI images, by decision. The `image` scene is unused.
3. First test wave: bank 2-3 scripts per format (`scripts/refill_story_bank.py`), publish, and read the numbers with `scripts/report_retention.py` to set `FORMAT_WEIGHTS`.
4. New YouTube OAuth for the new channel (`scripts/authenticate_yt.py`), new `tokens/`. Ask the operator each time.
5. Pilot: 10 videos, 2-3 weeks, compare retention with Silicon Verdict (`scripts/report_retention.py`).

## Setup notes

- `.venv` and `remotion_studio/node_modules` are symlinks to the Silicon Verdict ones (saves about 2 GB). Updating dependencies there affects both projects. To make this repo standalone: delete the symlinks, then `python -m venv .venv && .venv/bin/pip install -r requirements.txt` and `cd remotion_studio && npm install`.
- Secrets (`.env`, `client_secrets.json`, `token.json`, `tokens/`) are gitignored and must be created for this project.
- Facts in history scripts must be verifiable; no invented dates or quotes.
- Commit and push straight to `main`, no branches.

Commands: `.venv/bin/python main.py --motion-format <format>`, `scripts/genera_batch.py`, `scripts/refill_story_bank.py`, `scripts/render_silent_preview.py`; `python main.py help` lists them. The old guides in `guide/` still describe Silicon Verdict except `formats.md` and `motion-engine.md`.
