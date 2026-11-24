# Branding: The Chronicles of History

Channel: YouTube / TikTok `@chroniclesofhistorytv`. Promise: *real stories, drawn alive; a new one every day.*
The brand is a character in a round badge (like the sister channel's bold emblem) set in brown and gold, and the banner is an illuminated panorama of history on parchment.

## The mark: a character, The Chronicler
The channel's emblem is a mascot: **The Chronicler**, a kindly white-bearded scribe with a gold laurel wreath, a brown cloak with a gold clasp, a scroll in one hand and a quill in the other. He sits in a round badge (gold double ring, rays of gold leaf over brown leather). His face follows the language of the people in the videos (big round eyes with a highlight, rosy cheeks, a smile), only larger.
Source: `remotion_studio/src/brand/Brand.tsx` (`Seal` is the badge, `Cosmos` the ground; `simple` is the flat gold watermark). The badge also closes every video (outro scene) and is the avatar.

## Wordmark
**THE CHRONICLES OF HISTORY** in Cinzel Decorative 900, dark brown ink on a parchment scroll, with a gold-brown rule and the tagline *True stories, drawn alive. A new one every day.* in Cormorant italic. On dark grounds the same words are set cream (Playfair Display 900) with **of History** in gold italic.

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
| `youtube_banner.png` | 2560 x 1440 | YouTube channel art: an **illuminated panorama of history**. Sepia sky with gold rays and a low sun; monuments of every age in a row (an obelisk, the pyramids, a Greek temple, an aqueduct, the Colosseum, the Great Wall, a cathedral, a windmill, a pagoda, a castle); a double gold frame with corner brackets; the Chronicler's badge and the title on a parchment scroll at the centre. Badge, scroll and tagline sit in the 1546 x 423 box every device shows |
| `watermark.png` | 300 x 300, transparent | YouTube Studio > Customization > Branding > Video watermark (the Chronicler's head in plain gold inside the ring) |

Covers (thumbnails) are posters made by `scripts/render_cover.mjs` with the same gold foil, the era typeface and the series plate (`Cover.tsx`).

## Rules
- The Chronicler is never recoloured, stretched or placed on a light background; keep his badge whole (ring included).
- Gold is for the ring, titles and years; the glass tiles carry gold engravings. Everything else is cream or soft cream-brown on the dark brown gradient.
- The banner looks historical, not technological: parchment, ink, sepia and monuments; no grids, sparkles, glass tiles or monospaced type.
- Official handles: `@chroniclesofhistorytv` on both platforms. Never the Silicon Verdict channels.
