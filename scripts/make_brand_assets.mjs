#!/usr/bin/env node
// Renders the channel brand assets of The Chronicles of History into assets/brand/: avatar (YouTube and TikTok profile picture), YouTube banner, video watermark.
// usage: node scripts/make_brand_assets.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const base = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(base, 'remotion_studio');
const require = createRequire(join(root, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { selectComposition, renderStill } = require('@remotion/renderer');

const out = join(base, 'assets', 'brand');
mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: join(root, 'src', 'index.ts'), publicDir: mkdtempSync(join(tmpdir(), 'brand-public-')) });
for (const [id, file] of [['BrandAvatar', 'avatar.png'], ['BrandBanner', 'youtube_banner.png'], ['BrandWatermark', 'watermark.png']]) {
  const composition = await selectComposition({ serveUrl, id });
  await renderStill({ composition, serveUrl, output: join(out, file), frame: 0, imageFormat: 'png' });
  console.log(`[brand] ${file}`);
}
