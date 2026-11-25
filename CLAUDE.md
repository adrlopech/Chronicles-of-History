# Chronicle: assistant instructions

Automatic studio of vertical history videos (Motion Graphics, 62-90 s, English) for the channel **The Chronicles of History**: YouTube `@chroniclesofhistorytv` and TikTok `@chroniclesofhistorytv` (both handles were free on 2026-11-24; the channel still has to be created).
Sibling of `Silicon Verdict` (`../Silicon Verdict`): same Remotion engine and pipeline, **its own brand, channels, tokens and data**. Never publish from here to the Silicon Verdict channels.

## Regla fija: paleta

Todo el proyecto es **marrón y dorado, con aire histórico** (nada de azules, verdes ni morados: eso es de Silicon Verdict). La paleta oficial está en `guide/palette.md` y en `remotion_studio/src/chronicle/palette.ts`; `tests/test_palette.py` falla si algún color del código no es cálido. Un color nuevo se añade a la paleta y a la guía a la vez.

## Regla fija: minuto mínimo

Ningún vídeo dura menos de **1 minuto** (monetización; y es la norma del canal). Una sola constante, `FLOOR_SECONDS = 61` en `services/motion_generator.py`, la aplican el validador de guiones, el estirado de la voz (objetivo 62 s) y el QA final antes de subir. Si un vídeo sale por debajo, no se publica: se alarga el guion o se rehace. Los guiones hechos a mano también pasan el validador (`scripts/write_era_scripts.py`).

## Status

The visual style is new (an illustrated archive with eleven era looks (antiquity, manuscript, seachart, empire, industrial, wartime, prehistory, renaissance, orient, frontier, spaceage): `guide/motion-engine.md`). The eight history formats (`guide/formats.md`: mystery, dayinlife, turning, lies, whatif, duel, journey, portrait) and their generator, validators and prompts are new; the tech formats, games, prices and news are gone. The whole of `guide/` now describes this channel (`guide/README.md` is the index) and the brand assets are done (`guide/branding.md`, `node scripts/make_brand_assets.mjs`). Next steps, in order:

1. ~~Brand assets~~ done: Chronicler mascot, avatar, YouTube banner and watermark in `assets/brand/` (`node scripts/make_brand_assets.mjs`, rules in `guide/branding.md`). Still to do by hand: upload them to the YouTube and TikTok profiles.
2. Illustrations are animated vector art drawn in code (`remotion_studio/src/chronicle/art/`): grow the kit (more subjects, places, characters) by adding to `art/vocab.ts` AND `services/motion_generator.py`. No photographs and no AI images, by decision. The `image` scene is unused.
3. First test wave: bank 2-3 scripts per format (`scripts/refill_story_bank.py`), publish, and read the numbers with `scripts/report_retention.py` to set `FORMAT_WEIGHTS`.
4. New YouTube OAuth for the new channel (`scripts/authenticate_yt.py`), new `tokens/`. Ask the operator each time.
5. Pilot: 10 videos, 2-3 weeks, compare retention with Silicon Verdict (`scripts/report_retention.py`).

## Setup notes

- `.venv` and `remotion_studio/node_modules` are symlinks to the Silicon Verdict ones (saves about 2 GB). Updating dependencies there affects both projects. To make this repo standalone: delete the symlinks, then `python -m venv .venv && .venv/bin/pip install -r requirements.txt` and `cd remotion_studio && npm install`.
- Secrets (`.env`, `client_secrets.json`, `token.json`, `tokens/`) are gitignored and must be created for this project.
- Facts in history scripts must be verifiable; no invented dates or quotes.
- Commit and push straight to `main`, no branches.

Commands: `.venv/bin/python main.py --motion-format <format>`, `scripts/genera_batch.py`, `scripts/refill_story_bank.py`, `scripts/render_silent_preview.py`; `python main.py help` lists them. Every upload passes two checks in `services/youtube.py`: the one-minute floor and the channel (`YOUTUBE_CHANNEL_ID`, the Chronicles channel; a Silicon Verdict token is always refused).
