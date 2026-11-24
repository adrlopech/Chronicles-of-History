# Branding: The Chronicles of History

Channel: YouTube / TikTok `@chroniclesofhistorytv`. Promise: *real stories, drawn alive; a new one every day.*
The brand follows the sister channel's formula (a bold cut monogram that glows, a deep gradient, sparkles, glass tiles, a two-tone wordmark and a monospaced tagline), turned to gold.

## The mark
The monogram **CH**: two heavy, chamfered, slanted letters in gold foil, sliced twice by thin blade cuts, with a relief under them and a warm glow. It stands on a deep gradient (indigo to obsidian to amber) with a fine grid and gold and cream sparkles.
Source: `remotion_studio/src/brand/Brand.tsx` (`Seal` is the monogram, `Cosmos` the ground; `simple` is the flat watermark). The monogram also closes every video (outro scene).

## Wordmark
**The Chronicles** in white Playfair Display 900, **of History** in gold Playfair Display italic 700 (a roman and an italic in two tones, like "Silicon *Verdict*"), a short ember rule, then the tagline in Space Grotesk, spaced capitals: `TRUE STORIES / DRAWN ALIVE / ONE EVERY DAY`.

## Palette
| Role | Colour |
|---|---|
| Obsidian | `#0A0710` |
| Gold foil (monogram, accents) | highlight `#FFF1BF`, mid `#F0C25E`, low `#B9822A`, deep `#6B430A` |
| Indigo (the cool side of the gradient) | `#1B1550` |
| Amber (the warm side) | `#2A1608` to `#3A1D08` |
| Ember (the single hot accent: the rule under the wordmark) | `#FF7A55` |

Each era of a video keeps its own accent pair (`looks.ts`); the brand colours are the constant.

## Assets (`assets/brand/`, made by `node scripts/make_brand_assets.mjs`)
| File | Size | Where |
|---|---|---|
| `avatar.png` | 800 x 800 | YouTube and TikTok profile picture (both crop it to a circle; the monogram stays inside) |
| `youtube_banner.png` | 2560 x 1440 | YouTube channel art. Monogram, wordmark and tagline sit in the 1546 x 423 safe box every device shows; the glass tiles (a column, a sword, a ship, a scroll, a castle, a pyramid, an hourglass, a compass, a quill) and the sparkles are the atmosphere |
| `watermark.png` | 300 x 300, transparent | YouTube Studio > Customization > Branding > Video watermark (the flat gold monogram) |

Covers (thumbnails) are posters made by `scripts/render_cover.mjs` with the same gold foil, the era typeface and the series plate (`Cover.tsx`).

## Rules
- The monogram is never recoloured, stretched or placed on a light background.
- Gold is for the monogram, titles and years; ember only for the small rule. Everything else is white or soft grey on the dark gradient.
- Glass tiles carry the same engravings the videos use (`icons.tsx`), never emoji.
- Official handles: `@chroniclesofhistorytv` on both platforms. Never the Silicon Verdict channels.
