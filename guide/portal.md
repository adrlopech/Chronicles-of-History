# Web portal

The public site (GitHub Pages, folder `docs/`): home with the story fan and the library, press kit, privacy policy, terms, 404. No cookies, no analytics, nothing loaded from other hosts.

| Task | Command |
|---|---|
| Add new videos to the site (reads the channel's public RSS feed, copies each cover to `docs/assets/recent/<id>.jpg`, keeps `docs/data/videos.json`) | `.venv/bin/python scripts/update_site_videos.py` |
| Rebuild every page (CSS, JS, sitemap) | `python3 scripts/build_portal.py` |
| Check internal links and anchors | `python3 docs/check_portal.py` |
| Redraw the era pictures and the treasure map (art engine; each picture is framed by `VIEWBOX` in the script) | `cd remotion_studio && NODE_PATH=$PWD/node_modules node_modules/.bin/esbuild ../scripts/web_art.tsx --bundle --platform=node --outfile=/tmp/web_art.cjs && node /tmp/web_art.cjs ../docs/assets` |

After a publishing session: `update_site_videos.py`, `build_portal.py`, commit and push to `main`; Pages deploys in about a minute.

- **Text:** all in English, in `scripts/build_portal.py`.
- **Library:** `docs/data/videos.json` drives the story fan (newest five), the featured card and the filterable shelf (by era and by series). Each card links to the video on YouTube.
- **Press kit:** `docs/presskit.html`; brand files in `docs/assets/brand/` (copy from `assets/brand/` when the brand changes and rebuild the ZIP).

- **Fresh files for visitors:** `site.css` and `site.js` are linked with a fingerprint of their content (`site.css?v=...`), so a browser that cached the old file fetches the new one after each build.
- **Numbers of the workshop** (characters, animals, structures, actions) are counted from `remotion_studio/src/chronicle/art/vocab.ts` at build time: they follow the engine.
- **Preview locally:** `python3 -m http.server 8765 --directory docs` (or the `portal` entry of `.claude/launch.json`).
