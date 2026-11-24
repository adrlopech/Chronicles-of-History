#!/usr/bin/env node
// Renders the COVER of a Motion video: a designed poster (the `Cover` composition: hero drawing, era-typeface title in gold foil, torn-paper hook, series plate), never a screenshot and never with subtitles. 1080x1920 PNG.
// usage: node scripts/render_cover.mjs <props.json> <out.png> [publicDir] [frame] [sceneIndex]
// sceneIndex (default 0) picks the scene whose first drawing becomes the hero of the poster. The frame argument is kept for compatibility and ignored.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'remotion_studio');
const require = createRequire(join(root, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { selectComposition, renderStill } = require('@remotion/renderer');

const [propsPath, outPath, publicArg, frameArg, sceneArg] = process.argv.slice(2);
if (!propsPath || !outPath) {
  console.error('usage: node scripts/render_cover.mjs <props.json> <out.png> [publicDir] [frame]');
  process.exit(2);
}
const props = JSON.parse(readFileSync(propsPath, 'utf8'));
const sceneIndex = Math.min(sceneArg ? Number(sceneArg) : 0, props.scenes.length - 1);
const inputProps = { ...props, captions: [], coverScene: sceneIndex };
const publicDir = publicArg ? resolve(publicArg) : mkdtempSync(join(tmpdir(), 'cover-public-'));
const serveUrl = await bundle({ entryPoint: join(root, 'src', 'index.ts'), publicDir });
const composition = await selectComposition({ serveUrl, id: 'Cover', inputProps });
await renderStill({ composition, serveUrl, inputProps, frame: 30, output: resolve(outPath), imageFormat: 'png' });
console.log(`[cover] done: ${resolve(outPath)} (poster, hero from scene ${sceneIndex + 1})`);
