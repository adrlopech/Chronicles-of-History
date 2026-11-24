# Motion engine (The Chronicles of History)

The video is one Remotion composition, `MotionGraphic` (`remotion_studio/src/chronicle/`), driven only by JSON props: `title`, `look`, `captions` and `scenes`.
It is always 1080x1920 (9:16) at 30 fps. The top 12 % and bottom 20 % stay free for the Shorts / TikTok interface, and a 250 px caption strip sits above the bottom one (`SAFE_TOP`, `SAFE_BOTTOM`, `CAPTION_SPACE` in `types.ts`).

**Concept: an illustrated archive.** Everything is printed on one sheet of aged paper (grain, fibres, stains, burnt edges, a ruled frame, drifting dust). Words soak in like ink, accent phrases are underlined by a hand-drawn stroke
that is drawn when the narrator says them, icons are engravings that draw themselves, facts are stamped, the end is sealed with wax. The camera moves only the sheet, never the text. A thin **chronology rail** on the left edge fills as the story advances.

## Looks = eras

A look is one period of history: paper, ink, accent ("rubric"), gilt, typefaces and frame (`looks.ts`). `services/looks.py` picks it from the topic's words (`ERA_KEYWORDS`), otherwise it rotates.

| Look | Era | Feel |
|---|---|---|
| `antiquity` | Greece, Rome, Egypt | terracotta on warm stone, Roman capitals (Cinzel), double frame |
| `manuscript` | Middle Ages | vellum, iron-gall ink, rubric red (IM Fell English), corner brackets |
| `seachart` | Age of Sail, exploration | dark sea chart, brass accent (Marcellus) |
| `empire` | Kings, revolutions, dynasties | black-red lacquer, gold (Playfair Display) |
| `industrial` | 18th-19th centuries | newsprint, iron, printer's red (Libre Baskerville, typewriter years) |
| `wartime` | World wars, Cold War | olive-black, typewriter (Special Elite), mustard |

## Scenes

| Type | Use |
|---|---|
| `statement` | Headline + accent phrase (underlined) + an engraving (`icon`, or picked from the words). The default |
| `chapter` | Roman numeral (`value`), title, subtitle |
| `date` | A year (`value` or `text`) scrubbing forward, `unit` "AD"/"BC", `kicker` place, `accentText` the event |
| `timeline` | Up to 5 `"year\|label"` items down a drawn spine |
| `map` | Up to 5 `"Place\|x\|y"` (0-100): invented coastlines, sea hatching, compass, a route inked place to place |
| `quote` | A quotation, `accentText` the author. Only real, attributable quotes |
| `ledger` | A figure counted up on an account-book page (`value`, `unit`). **Avoid decimals** (rounded) |
| `versus` | Two banners unfurling to their figures (`left`/`right`/`leftValue`/`rightValue`), crown on the winner |
| `list` | 2-4 lines on numbered roundels |
| `verdict` | A rubber stamp: `myth`, `fact` or `partly` |
| `image` | An engraving or public-domain photograph (`mediaSrc` in the public folder) in a mounted frame, sepia-toned; without a file it draws an engraving |
| `flash` | A one-word punch |
| `outro` | Always last: wax seal, closing line, two-option vote (`items`), the handle |

Common fields: `kicker`, `callout` + `calloutCue` (a marginal note that pops up when the narrator says it), `accentCue`, `narration`, `durationInFrames` (60-150).
Names of the old tech engine (`bigText`, `textWithAccent`, `counter`, `footage`...) still render, as the closest history scene (`ALIAS` in `Chronicle.tsx`).

## Illustrations: animated vector art

Behind every scene (except `flash`, `map` and `outro`) an animated vector picture is drawn, and it **changes shot by shot as the narration moves on** (1-2 shots per scene, joined by a wipe or an iris). Nothing is a photograph or an AI image:
everything is SVG drawn in code (`src/chronicle/art/`), so it is free, always on-style and moves.

- A **shot** = `place` (desert, sea, coast, plains, mountains, forest, snow, city, plaza, interior, battlefield) + `time` (dawn, day, dusk, night) + optional `weather` (clear, rain, snow, storm, smoke) + 1-4 `subjects` (the first is the hero).
  The script writer picks them from the closed lists in `art/vocab.ts` (212 subjects: 61 structures, 16 generic actors, **100 historical characters**, **20 animals**, 9 props and 6 effects; the first 42 are: castle, temple, pyramids, soldiers, cavalry, king, crowd, caravan, elephants, ship, fleet, galley, train, tank, plane, sword, crown, scroll, fire, volcano, comet, eclipse...).
  `services/motion_generator.py` repeats the lists; a test keeps both identical.
- **A hundred characters, twenty animals, fifty more structures.** The 100 `PEOPLE` (pharaoh, legionary, viking, samurai, conquistador, redcoat, miner, nurse, astronaut...) are costumes of the single `Person` figure (`art/costumes.tsx`: hat, robe or tunic, cloak, armour, held thing, skin, beard or long hair); leaders stand alone, everybody else comes with two companions.
  The 20 `ANIMALS` live in `art/animals.tsx` (a parametric four-legged builder plus bird, snake, crocodile, rat and whale) and the 50 new structures in `art/structures2.tsx` (ziggurat to rocket). Each has an era list in `ERA_ONLY` of `motion_generator.py`; `fix_art_for_era` drops what did not exist in the video's era (no samurai in Rome, no skyscraper before 1880).
  Hats are in `art/hats.tsx` (43) and held things in `art/items.tsx` (28).
- **People can act.** A shot may also carry `action` (what the people in it are doing) and `view` (`front`, `side` or `back`). The 37 actions are in `ACTIONS` of `art/vocab.ts`: stand walk run sit point wave cheer
  kneel bow pray salute slash stab fall lie crouch carry push dig hammer write read think shout plead threaten shrug lift throw shoot drink dance sneak surrender cower lean watch. They apply to soldiers, king, crowd, scholar, monk, farmer and merchant;
  without a view the action picks the natural one (profile for fighting, digging, walking...). The faces change too (eyes closed or wide, brows angry or sad, mouth flat, open or shouting). `Person` in `people.tsx` draws them all.
- `Diorama.tsx` lays the subjects out in depth (far, mid, near, foreground), slides the layers at different speeds with the camera (parallax), moves marching armies, ships and trains across the shot and adds weather.
  `places.tsx` draws the sky, sun or moon, stars, clouds and the layered ground of each place; `people.tsx` and `things.tsx` draw and animate the subjects (legs that walk, sails that billow, oars, flags, smoke, flames, a cannon that fires).
  `palette.ts` grades a time-of-day sky toward the era's colours and makes silhouettes darker toward the viewer.
- **On-screen design: a documentary title sequence.** The picture fills the whole frame (zoomed in, heroes large) and the words are secondary: a bold capitals headline as a lower third, the key phrase on a strip of torn paper stuck onto the picture
  (`TornLabel`), years and figures in solid gold lettering with a stamped relief, data scenes (timeline, map, versus, list, quote) in dark "dossier" panels with ornamental gold corners, gold corner marks around the frame, a chronology rail, and bold capital
  captions whose spoken word glows. Each era has its own headline typeface (`modernLook` in `looks.ts`: Cinzel, Playfair Display, Abril Fatface, Anton, Bebas Neue) and a bright accent pair.
- **Subtitles are always on.** The bold captions never disappear: a line stays until the next starts, they show from frame 0, they also appear over `flash` scenes, and when a render has no voice timing they are built from each scene's narration (`fallbackCaptions` in `captions.tsx`). Only the very last line fades out after the end.
- **Atmosphere** (`Atmosphere` in `Diorama.tsx`): haze at the horizon, a bloom around the sun, rays of light, rising embers near fire and battle, a vignette and film grain. `fix_art_for_era` removes anachronisms (no tank in ancient Rome) once the look is known.

## Files

| File | What it holds |
|---|---|
| `Chronicle.tsx` | The composition: scene sequencing, entrances (rise, ink iris, slide, fade), chronology rail, loop tease |
| `scenes.tsx` | Every scene and the callout |
| `ink.tsx` | Ink words, hand-drawn underline, ornament, kicker, wax seal, stamp, text fitting, seeded random |
| `icons.tsx` | The 16 engravings (used when a scene has no picture) and the keyword picker |
| `art/` | The vector illustration kit: `vocab.ts`, `palette.ts`, `draw.tsx`, `places.tsx`, `people.tsx`, `things.tsx`, `Diorama.tsx`, `Stage.tsx` |
| `paper.tsx` | The sheet: backdrop, frame, dust |
| `looks.ts`, `fonts.ts`, `types.ts`, `captions.tsx` | Eras, Google Fonts, the props contract, word-by-word captions |

Preview and tweak: `cd remotion_studio && npx remotion studio`, open **MotionGraphic** (the sample is `chronicle/sample.json`). Type-check: `npx tsc --noEmit -p .`
