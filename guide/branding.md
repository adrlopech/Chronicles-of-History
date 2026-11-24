# Branding: The Chronicles of History

Channel: YouTube / TikTok `@chroniclesofhistorytv`. Promise: *real stories, drawn alive; a new one every day.*

## The mark
A **gold seal**: a double gold ring, twelve small diamonds around it (the hours, the eras) and a gold **C** in foil on obsidian, with faint rays behind the letter and one ember-coloured diamond under it.
Source: `remotion_studio/src/brand/Brand.tsx` (`Seal`). The same seal closes every video (outro scene) and is the avatar and the watermark.

## Palette
| Role | Colour |
|---|---|
| Obsidian (backgrounds) | `#0A0710` |
| Gold foil (title, ring) | highlight `#FFF1BF`, mid `#F0C25E`, low `#B9822A`, deep `#6B430A` |
| Ember (the single warm accent: diamonds, hooks) | `#FF7A55` |
| Parchment (body text on dark) | `#F4E6C8` |

Each era of a video keeps its own accent pair (`looks.ts`); the brand colours are the constant.

## Type
Brand title: **Cinzel Decorative** 900 in gold foil (stacked relief shadow). Body and taglines: **Cormorant Garamond** 700. In videos, titles use the era's own typeface (see `guide/motion-engine.md`).

## Assets (`assets/brand/`, made by `node scripts/make_brand_assets.mjs`)
| File | Size | Where |
|---|---|---|
| `avatar.png` | 800 x 800 | YouTube and TikTok profile picture (both crop it to a circle: the seal is built for it) |
| `youtube_banner.png` | 2560 x 1440 | YouTube channel art. The title, seal and tagline sit inside the 1546 x 423 safe box every device shows; the line of characters below is the atmosphere (one figure per era) |
| `watermark.png` | 300 x 300, transparent | YouTube Studio > Customization > Branding > Video watermark (simple seal, readable at 150 px) |

Covers (thumbnails) are posters made by `scripts/render_cover.mjs` with the same gold foil, the era typeface and the series plate (`Cover.tsx`).

## Rules
- The seal is never recoloured, stretched or placed on a light background; leave a margin of half its radius around it.
- Gold is for titles, years and the seal; ember is only for small accents. Everything else on screen is cream on dark.
- The line of characters (banner) shows one costume per era and never repeats an era: it is the proof of the promise.
- Official handles: `@chroniclesofhistorytv` on both platforms. Never the Silicon Verdict channels.
