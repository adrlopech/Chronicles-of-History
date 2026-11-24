# Official palette: The Chronicles of History

One rule: **everything is brown or gold, with a historical air.** Parchment, leather, bronze, ochre, sepia, iron-gall ink, a brick or oxblood red for warmth, and gold leaf. There is **no blue, green or purple anywhere** in the project (video design, illustrations, covers, brand, banner): this is what separates the channel from Silicon Verdict's blue-and-cyan. `tests/test_palette.py` reads every colour in the source and fails on one that is not warm. The single source in code is `remotion_studio/src/chronicle/palette.ts`.

## Golds
| Name | Hex | Use |
|---|---|---|
| Gold leaf | `#FFE08A` | the lettering of years and figures (the foil), highlights |
| Gold | `#F0C25E` | the brand's main colour: monogram ring, frames, the spoken word in the captions |
| Deep gold | `#B9822A` | shadows of gold, rules, the lower edge of foil |
| Bronze | `#8A5A2A` | secondary rules, the map's inked meridians |
| Gold shadow | `#6B430A` | the relief under gold lettering |

## Parchment and paper
| Name | Hex | Use |
|---|---|---|
| Vellum | `#F4E6C8` | the scroll of the banner, light panels |
| Parchment | `#E6D3A0` | land on the maps, paper |
| Tea | `#D2B074` | the sea of the treasure maps, aged paper |
| Sepia | `#A8742E` | stains, old ink washes |

## Browns
| Name | Hex | Use |
|---|---|---|
| Leather | `#9A6335` | the Chronicler's cloak (light), book covers |
| Umber | `#6E4224` | cloak (mid), wood |
| Chocolate | `#40230F` | cloak (shadow), dark panels |
| Cocoa | `#2A170A` | the ground of dark panels and the banner |
| Obsidian | `#100B07` | the darkest ground (frames, outlines of gold lettering) |
| Ink | `#3B2411` | iron-gall ink: text on parchment, coastlines |

## Warm accents
| Name | Hex | Use |
|---|---|---|
| Ember | `#FF7A55` | the one hot accent: the gem of the clasp, small marks |
| Copper | `#C8642A` | the second warm accent, copper roofs |
| Brick | `#A8442A` | terracotta, the legion's red |
| Oxblood | `#6B2D2A` | deep red-brown, cloaks and banners |
| Rust | `#8E2A1C` | the X of the treasure map, the trail |

## Text
| Name | Hex | Use |
|---|---|---|
| Cream | `#FFF4D8` | text on dark grounds (titles, captions) |

## The sky at each hour (art, `SKIES` in `palette.ts`)
Sepia skies, so the pictures stay inside the palette: **dawn** amber (`#6B3A24` to `#FFD9A0`), **day** pale gold (`#B8884A` to `#F6E6BC`), **dusk** copper (`#3E1E14` to `#F2A04A`), **night** brown (`#0E0804` to `#4A3020`).

## The accent pair of each era (`ERA_ACCENTS`)
Every era keeps its own bright accent and gilt, all warm: antiquity `#FF8A55`/`#FFC857`, manuscript `#E8603A`/`#E8B650`, seachart `#F0A24A`/`#D9A441`, empire `#F2B04C`/`#D4743C`, industrial `#E8734A`/`#C9A66B`, wartime `#F2B53D`/`#C9823A`, prehistory `#E4693A`/`#F0C27A`, renaissance `#E8744C`/`#E6B85C`, orient `#E85A38`/`#E0A84A`, frontier `#E8643F`/`#F0BE5A`, spaceage `#F28A3D`/`#F0C060`. The corner brackets, rules and frames of the videos use the era's gilt (`accent2`): gold or copper, never blue.

## Characters' clothes
Earthy and historical: brick, oxblood, bronze, olive-gold, umber, parchment, dark leather, pewter. Blue, green and purple dyes are remapped to those families (blue to umber, green to olive-gold, teal to bronze, purple to oxblood).

## Rules
- A new colour is added to `palette.ts` and to this page together, and must pass `tests/test_palette.py` (brown, gold, red-brown or a neutral).
- Neutrals (cream, greys with almost no colour, near-black) are allowed for text and shadows.
- Gold is for titles, years, frames and the brand; ember and copper only as small accents; everything else is brown and parchment.
