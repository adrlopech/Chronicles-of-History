# Branding: The Chronicles of History

Channel: YouTube / TikTok `@chroniclesofhistorytv`. Promise: *real stories, drawn alive; a new one every day.*
The brand follows the sister channel's formula (a bold emblem that glows, a deep gradient, sparkles, glass tiles, a two-tone wordmark and a monospaced tagline), turned into brown and gold, with a character as the emblem.

## The mark: a character, The Chronicler
The channel's emblem is a mascot: **The Chronicler**, a kindly white-bearded scribe with a gold laurel wreath, a brown cloak with a gold clasp, a scroll in one hand and a quill in the other. He sits in a round badge (gold double ring, rays of gold leaf over brown leather). His face follows the language of the people in the videos (big round eyes with a highlight, rosy cheeks, a smile), only larger.
Source: `remotion_studio/src/brand/Brand.tsx` (`Seal` is the badge, `Cosmos` the ground; `simple` is the flat gold watermark). The badge also closes every video (outro scene) and is the avatar.

## Wordmark
**The Chronicles** in cream Playfair Display 900, **of History** in gold Playfair Display italic 700 (a roman and an italic in two tones, like "Silicon *Verdict*"), a short gold-to-bronze rule, then the tagline in Space Grotesk, spaced capitals: `TRUE STORIES / DRAWN ALIVE / ONE EVERY DAY` in cream at 66%.

## Palette: brown and gold
Brown leather, bronze and gold leaf on a dark ground; cream for text.
| Role | Colour |
|---|---|
| Dark ground | `#100904` to `#24150A` |
| Warm brown (gradient sides, the badge) | `#442812`, `#3C2410`, `#6A4220` |
| Cloak | `#9A6335`, `#6E4224`, `#40230F` |
| Gold foil | highlight `#FFF1BF`, mid `#F0C25E`, low `#B9822A`, deep `#6B430A` |
| Cream (text, parchment) | `#FFF4D8`, `#F4E6C8` |
| Ember (the gem on the clasp, the quill nib, small accents) | `#FF7A55` |

Each era of a video keeps its own accent pair (`looks.ts`); the brand colours are the constant.

## Assets (`assets/brand/`, made by `node scripts/make_brand_assets.mjs`)
| File | Size | Where |
|---|---|---|
| `avatar.png` | 800 x 800 | YouTube and TikTok profile picture (both crop it to a circle; the badge is already round) |
| `youtube_banner.png` | 2560 x 1440 | YouTube channel art. Badge, wordmark and tagline sit in the 1546 x 423 safe box every device shows; the gold-edged glass tiles (a column, a sword, a ship, a scroll, a castle, a pyramid, an hourglass, a compass, a quill) and the sparkles are the atmosphere |
| `watermark.png` | 300 x 300, transparent | YouTube Studio > Customization > Branding > Video watermark (the Chronicler's head in plain gold inside the ring) |

Covers (thumbnails) are posters made by `scripts/render_cover.mjs` with the same gold foil, the era typeface and the series plate (`Cover.tsx`).

## Rules
- The Chronicler is never recoloured, stretched or placed on a light background; keep his badge whole (ring included).
- Gold is for the ring, titles and years; the glass tiles carry gold engravings. Everything else is cream or soft cream-brown on the dark brown gradient.
- Glass tiles carry the same engravings the videos use (`icons.tsx`), never emoji.
- Official handles: `@chroniclesofhistorytv` on both platforms. Never the Silicon Verdict channels.
