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

Behind every scene (except `flash`, `map` and `outro`) an animated vector picture is drawn, and it **changes shot by shot as the narration moves on** (1-2 shots per scene). Nothing is a photograph or an AI image:
everything is SVG drawn in code (`src/chronicle/art/`), so it is free, always on-style and moves.

- A **shot** = `place` (desert, sea, coast, plains, mountains, forest, snow, city, plaza, interior, battlefield) + `time` (dawn, day, dusk, night) + optional `weather` (clear, rain, snow, storm, smoke) + 1-4 `subjects` (the first is the hero).
  The script writer picks them from the closed lists in `art/vocab.ts` (258 subjects: 71 structures, 20 generic actors and vehicles, **127 historical characters**, **25 animals**, 9 props and 6 effects; the first 42 are: castle, temple, pyramids, soldiers, cavalry, king, crowd, caravan, elephants, ship, fleet, galley, train, tank, plane, sword, crown, scroll, fire, volcano, comet, eclipse...).
  `services/motion_generator.py` repeats the lists; a test keeps both identical.
- **Eleven eras.** The six first looks (antiquity, manuscript, seachart, empire, industrial, wartime) were joined by **prehistory** (Marker lettering, charcoal and ochre), **renaissance** (Cinzel Decorative, fresco and ultramarine), **orient** (Shippori Mincho, black lacquer and vermilion), **frontier** (Rye slab type, sun-bleached sepia) and **spaceage** (Orbitron, deep navy and signal orange). `services/looks.py` picks one from the topic's words (mammoth, Leonardo, samurai, Wild West, Apollo...). Prehistory draws only its own list (`PREHISTORY_OK`) and orient the Eastern and timeless subjects (`ORIENT_OK`); the others obey `ERA_ONLY` (`era_allows` in `motion_generator.py`).
  Assets added for them: 27 characters (neanderthal, shaman, banker, geisha, sheriff, cosmonaut...), 5 animals (mammoth, sabertooth, bison, horse, camel), 10 structures (cave, menhir, duomo, pavilion, dojo, saloon, general_store, water_tower, radar_dish, cooling_tower), 4 vehicles (wagon, junk, lander, satellite), 4 hats and 6 held things.
- **One film, not a slideshow** (`ArtFilm` and `buildFilm` in `art/Stage.tsx`). The shots of every scene play on a single track under the text, so the picture never blinks to the backdrop between scenes (only around `flash`, `map` and `outro`, which have none).
  A shot starts where the narration moves on: its start is snapped to the start of a caption phrase, never shorter than 1.2 s. Consecutive shots in the **same place and light** share the set (the hills, clouds and walls do not jump) and are joined by a 10-frame dissolve, like cuts inside one scene of a film; a new place enters with a wipe or an iris.
- **The first frame is the hook; the last frame is the first again.** The feed starts playing on frame 0, so the first picture is already there (no fade from black) and the first headline and series label are on screen from frame 0 (`FirstCtx` in `scenes.tsx`).
  The last 26 frames fade into the video's own first frame (the same picture, framing and headline: `LoopTease` in `Chronicle.tsx`), so when a Short loops the jump back to the start is invisible; the outro's vote question comes back to the subject of the hook.
- **A visual beat every 2-3 seconds.** A shot longer than 3.5 s (`BEAT_MAX`) is cut into two framings of the same picture at the narration phrase nearest its middle: a wide or medium framing answers with a close-up, a close-up with a pull back (`ANSWER` in `art/Stage.tsx`). The people go on moving across the cut; only the camera changes.
- **A camera per shot** (`camera` in the shot, `CAMERAS` in `art/vocab.ts` and `motion_generator.py`): `wide` (the whole place), `medium` (the group), `close` (the hero's face), `push` (moves in to the face), `pull` (moves back to reveal the place) and `follow` (tracks the hero walking).
  Every move eases in and out. When the script leaves it empty `autoCamera` chooses from the story: the video opens with a push, emotion (shout, plead, think, kneel, write...) goes close or pushes in, movement is followed, a new place opens wide, and two equal framings in a row are avoided. The prompt asks the writer to storyboard: wide, medium, close, pull.
- **People act like actors.** A figure eases from standing into its action in about half a second (the arm rises into the point, the knee bends into the kneel) instead of starting mid-gesture; companions turn to the hero and react a beat later instead of repeating a speech or a blow like a chorus (`HERO_ACTS` in `costumes.tsx`).
  Arms bend at the elbow, robes and tunics have a shadow side and a fold, faces have a shaded cheek and eyelids that drop with anger or effort, the eyes glance around, the mouth follows the syllables, and a fright is a tremble, not a buzz.
- **Character design** (`Person` in `people.tsx`). A face with temples, cheekbones, a jaw and a chin (a real profile in side view: brow, nose, lips), ears, a shaped nose, the simple eyes (white oval, dark pupil, catch-light, soft lid line), tapered brows, four hairstyles (crop, curls, swept, long) and three beards (full, short, long, with a moustache), wrinkles on older faces.
  A torso with rounded shoulders and a waist, sleeves with a cuff, hands with a thumb, leather boots with a sole, a belt with a buckle. The cut of the clothes follows the era (`TUNIC` and `COAT` in `costumes.tsx`): a tunic with a hemmed skirt for antiquity, the Middle Ages and early warriors, tails, lapels and two rows of buttons for officers and gentlemen, trousers for the rest.
  Armour comes from the helmet (`ARMOR_KIND`): Roman plate bands with leather strips and a rectangular scutum, Viking mail, a knight's surcoat with a cross, samurai lamellar, a pharaoh's broad collar, a space suit; round shields are painted with a boss and studs. War helmets stop at the brow so the eyes show.
  To work on the design, render the dev sheet: `cd remotion_studio && npx remotion still CharacterSheet out.png --frame=40` (`art/CharacterSheet.tsx`, twelve characters drawn large).
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
- **Real maps, drawn as a pirate treasure map.** A `map` scene draws the **real coastline** (Natural Earth 1:50m, public domain, simplified to 26,000 points in `src/chronicle/geo/land.json`) on tea-stained, burnt parchment (`Chart` in `geo/atlas.tsx`): a torn edge with burnt rims, stains and paper grain from SVG noise filters, three folds, a hand-wobbled iron-gall coastline with rings of dotted shoals, a lat/lon graticule with degrees in italic, and a scale bar.
  Seeded ornaments are placed only where they belong: mountains and (in the tropics) palm trees on land, sailing ships and a sea serpent in open water, using a point-in-polygon test on the real coast. The route is a dashed red trail revealed place by place and ending in a big red **X**, with a sixteen-point compass rose and place names in IM Fell italic. The view frames itself around the places, so a Mediterranean story shows the Mediterranean and a crossing shows the Atlantic.
  Places are written `Place|lat|lon` with real decimal coordinates (north and east positive). `services/gazetteer.py` knows about 330 places that history keeps returning to and snaps any of them that the script placed more than 2.5 degrees away (`fix_map_places`); the validator rejects the old schematic 0-100 x/y and out-of-range values. Choose the places of ONE region or route: the frame is as wide as they are apart.
- **Story first, words second.** Every on-screen text size is scaled by `TEXT_SCALE` (0.72) in `ink.tsx`, the captions are smaller, the script writer is told to keep `text` to 6 words and `accentText` to 3, and the first person in a shot (the hero) is drawn 30% larger. `story_problems` in `motion_generator.py` makes generated scripts tell the story through people: at least 60% of the shots show a person, 70% of those have an `action`, at least four different actions and one protagonist who appears in three or more shots.
- **Covers are posters.** `scripts/render_cover.mjs` renders the `Cover` composition (`Cover.tsx`), not a screenshot: the best-looking shot of the video (a person facing us, doing something dramatic; backs and landscapes lose) drawn large, a halo and light rays, a dark scrim, the title in the era's typeface as gold foil, a strip of torn paper with the hook, the series plate, the year and place, and the channel at the foot. No subtitles. The two cover styles pick the best and the second-best shot.
- **Subtitles share the video's style:** the era's own headline typeface (Cinzel, Playfair, Abril...), cream capitals with a dark outline, the spoken word in solid gold foil with relief, and the documentary rule (gold lines around a diamond) above each line; the size adapts to the line length.
- **Subtitles are always on.** The bold captions never disappear: a line stays until the next starts, they show from frame 0, they also appear over `flash` scenes, and when a render has no voice timing they are built from each scene's narration (`fallbackCaptions` in `captions.tsx`). Only the very last line fades out after the end.
- **Atmosphere** (`Atmosphere` in `Diorama.tsx`): haze at the horizon (in the world, behind the people), a bloom around the sun (placed through the shot's camera, so it stays on the sun), rays of light, rising embers near fire and battle, a vignette and film grain. `fix_art_for_era` removes anachronisms (no tank in ancient Rome) once the look is known.

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

## Look and theme

The **look** is the era (typefaces, frames, subjects); the **theme** is the colour style (`guide/palette.md`, "Colour themes"). The pipeline picks both (`services/looks.py`, `services/themes.py`) and passes `look` and `theme` in the props.
