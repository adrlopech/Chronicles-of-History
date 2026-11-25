import { createContext, useContext } from 'react';
import { ERA_ACCENTS, THEMES, Sky } from './palette';
import { BASKERVILLE, BASKERVILLE_ITALIC, CARDO, CARDO_ITALIC, CINZEL, CORMORANT, ELITE, FELL, FELL_ITALIC, GARAMOND, GARAMOND_ITALIC, MARCELLUS, PLAYFAIR, PLAYFAIR_ITALIC, SPACE, ANTON, BEBAS, ABRIL, OSWALD, MARKER, CINZEL_DECO, SHIPPORI, RYE, ORBITRON } from './fonts';

/**
 * A LOOK is an ERA: the paper, the ink, the typefaces and the frame of one period of history. The pipeline picks one per video (services/looks.py) from the topic.
 * Light looks are printed on aged paper; dark looks are drawn on charts, in vaults and at night.
 */
export type FrameStyle = 'double' | 'single' | 'corners';

export interface Look {
  name: string;
  era: string; // what the look is for, shown in the docs
  dark: boolean;
  paper: string; // centre of the sheet
  paper2: string; // edges of the sheet
  ink: string; // text and line colour
  muted: string; // secondary text and faint lines
  accent: string; // the rubric: accent words, underlines, the stamp
  accent2: string; // the gilt: rules, frames, secondary marks
  head: string; // headline typeface
  italic: string; // accent words
  body: string; // body and captions
  date: string; // years and figures
  caps: boolean; // headlines in capitals
  k: number; // average glyph width of the headline face (fraction of its size), used to fit text
  frame: FrameStyle;
  grain: number; // strength of the paper grain
  weight: number; // headline weight
  sky?: Record<'dawn' | 'day' | 'dusk' | 'night', Sky>; // set by a colour theme: the sepia skies of the pictures
  themed?: boolean; // a colour theme replaced the era's own accents
}

export const LOOKS: Record<string, Look> = {
  // Greece, Rome, Egypt: terracotta and ochre on warm stone, Roman capitals
  antiquity: { name: 'antiquity', era: 'Antiquity', dark: false, paper: '#EBD9B4', paper2: '#C7A474', ink: '#2B1A10', muted: '#7A6244', accent: '#B5482A', accent2: '#B98A2E', head: CINZEL, italic: CORMORANT, body: CORMORANT, date: CINZEL, caps: true, k: 0.74, frame: 'double', grain: 0.5, weight: 800 },
  // the Middle Ages: vellum, iron-gall ink, a rubricated red
  manuscript: { name: 'manuscript', era: 'Middle Ages', dark: false, paper: '#F0E4C6', paper2: '#D2BB8C', ink: '#36271c', muted: '#6D6450', accent: '#A3201D', accent2: '#C29A3F', head: FELL, italic: FELL_ITALIC, body: GARAMOND, date: FELL, caps: false, k: 0.5, frame: 'corners', grain: 0.55, weight: 400 },
  // exploration and the age of sail: a dark sea chart with brass
  seachart: { name: 'seachart', era: 'Age of Sail', dark: true, paper: '#3c301b', paper2: '#1d160b', ink: '#F0E6C8', muted: '#b5af9d', accent: '#E3BC5C', accent2: '#b0986f', head: MARCELLUS, italic: GARAMOND_ITALIC, body: CORMORANT, date: CINZEL, caps: true, k: 0.68, frame: 'single', grain: 0.4, weight: 400 },
  // kings, revolutions, dynasties: black-red lacquer with gold leaf
  empire: { name: 'empire', era: 'Empires and monarchies', dark: true, paper: '#2A1013', paper2: '#0B0506', ink: '#F6E9D2', muted: '#B59E86', accent: '#D8AE4E', accent2: '#A82234', head: PLAYFAIR, italic: PLAYFAIR_ITALIC, body: GARAMOND, date: PLAYFAIR, caps: false, k: 0.56, frame: 'double', grain: 0.35, weight: 900 },
  // the 18th-19th centuries: newsprint, iron, a printer's red
  industrial: { name: 'industrial', era: 'Industrial age', dark: false, paper: '#DDD3BC', paper2: '#B5A98E', ink: '#1E1B18', muted: '#6E665A', accent: '#B03A2E', accent2: '#4A4640', head: BASKERVILLE, italic: BASKERVILLE_ITALIC, body: BASKERVILLE, date: ELITE, caps: false, k: 0.58, frame: 'single', grain: 0.7, weight: 700 },
  // the world wars and the Cold War: olive-black, typewriter, a signal mustard
  wartime: { name: 'wartime', era: '20th century conflicts', dark: true, paper: '#2b281d', paper2: '#11100b', ink: '#EAE5D0', muted: '#A6A68F', accent: '#DDB53B', accent2: '#8B2E1F', head: ELITE, italic: CARDO_ITALIC, body: CARDO, date: ELITE, caps: true, k: 0.64, frame: 'corners', grain: 0.65, weight: 400 },
  // the Stone Age: charcoal, red ochre and bone, a hand-drawn marker
  prehistory: { name: 'prehistory', era: 'Prehistory', dark: true, paper: '#33261c', paper2: '#120c08', ink: '#F1E4CC', muted: '#B39C80', accent: '#D6552B', accent2: '#E8C27A', head: MARKER, italic: CARDO_ITALIC, body: CARDO, date: MARKER, caps: true, k: 0.62, frame: 'single', grain: 0.8, weight: 400 },
  // the Renaissance: fresco plaster, terracotta and ultramarine, carved capitals
  renaissance: { name: 'renaissance', era: 'Renaissance', dark: false, paper: '#EFDFC2', paper2: '#CDAE80', ink: '#442f1f', muted: '#76684F', accent: '#B6452C', accent2: '#9d653a', head: CINZEL_DECO, italic: CORMORANT, body: CORMORANT, date: CINZEL_DECO, caps: true, k: 0.8, frame: 'double', grain: 0.45, weight: 900 },
  // dynasties and shoguns of East Asia: black lacquer, vermilion, jade and gold
  orient: { name: 'orient', era: 'Dynasties of the East', dark: true, paper: '#1E1A1A', paper2: '#080606', ink: '#F4EAD2', muted: '#B7A78C', accent: '#E0482F', accent2: '#b5904f', head: SHIPPORI, italic: SHIPPORI, body: CORMORANT, date: SHIPPORI, caps: false, k: 0.8, frame: 'single', grain: 0.4, weight: 800 },
  // the American West and the 19th-century frontier: sun-bleached sepia, wanted-poster slab type
  frontier: { name: 'frontier', era: 'The Frontier', dark: false, paper: '#E7D3A8', paper2: '#BE9B62', ink: '#2A1C10', muted: '#7C6240', accent: '#A9331F', accent2: '#5B4A2E', head: RYE, italic: BASKERVILLE_ITALIC, body: BASKERVILLE, date: RYE, caps: true, k: 0.72, frame: 'double', grain: 0.7, weight: 400 },
  // the space age and the modern world: deep navy, signal orange and cyan, technical type
  spaceage: { name: 'spaceage', era: 'Space age and modern times', dark: true, paper: '#301f12', paper2: '#140d07', ink: '#f8f1ec', muted: '#c2ab9a', accent: '#FF7A2F', accent2: '#c8a66c', head: ORBITRON, italic: SPACE, body: SPACE, date: ORBITRON, caps: true, k: 0.84, frame: 'corners', grain: 0.3, weight: 900 },
};

export const lookFor = (name?: string): Look => LOOKS[name ?? ''] ?? LOOKS.manuscript;
export const LookCtx = createContext<Look>(LOOKS.manuscript);
export const useLook = () => useContext(LookCtx);

/** The on-screen style of every video: modern and graphic. The drawing is the hero, so type is white and bold on a dark scrim, one bright accent per era, no paper. The era look still sets the picture's colours and these accents. */
const BRIGHT = ERA_ACCENTS;
const HEAD: Record<string, { font: string; weight: number; k: number }> = {
  antiquity: { font: CINZEL, weight: 800, k: 0.8 },
  manuscript: { font: PLAYFAIR, weight: 900, k: 0.74 },
  seachart: { font: ABRIL, weight: 400, k: 0.7 },
  empire: { font: PLAYFAIR, weight: 900, k: 0.74 },
  industrial: { font: ANTON, weight: 400, k: 0.52 },
  wartime: { font: BEBAS, weight: 400, k: 0.46 },
  prehistory: { font: MARKER, weight: 400, k: 0.62 },
  renaissance: { font: CINZEL_DECO, weight: 900, k: 0.82 },
  orient: { font: SHIPPORI, weight: 800, k: 0.84 },
  frontier: { font: RYE, weight: 400, k: 0.74 },
  spaceage: { font: ORBITRON, weight: 900, k: 0.86 },
};
/** Deep, era-tinted dark used for panels and backgrounds (never pure black). */
/** Dresses an era look in a colour theme (palette.ts): same typefaces, frames and era, different warm colours. `gilded` or an unknown name leaves the era as it is. */
export const applyTheme = (look: Look, themeName?: string): Look => {
  const th = THEMES[themeName ?? ''];
  if (!th || !th.paper) return look;
  return { ...look, paper: th.paper, paper2: th.paper2, accent: th.accent, accent2: th.accent2, sky: th.sky, themed: true };
};
export const themedLook = (lookName?: string, themeName?: string): Look => applyTheme(lookFor(lookName), themeName);

const deep = (look: Look, t: number) => {
  const h = look.paper2.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const f = (x: number) => Math.round(x * (1 - t)).toString(16).padStart(2, '0');
  return `#${f(r)}${f(g)}${f(b)}`;
};
export const modernLook = (look: Look): Look => {
  const hd = HEAD[look.name] ?? HEAD.manuscript;
  return {
    ...look,
    dark: true,
    paper: deep(look, 0.78),
    paper2: deep(look, 0.9),
    ink: '#FFF8EA',
    muted: 'rgba(255,248,234,0.74)',
    ...(look.themed ? { accent: look.accent, accent2: look.accent2 } : BRIGHT[look.name] ?? BRIGHT.manuscript),
    head: hd.font,
    italic: PLAYFAIR_ITALIC,
    body: OSWALD,
    date: hd.font,
    caps: true,
    k: hd.k,
    weight: hd.weight,
    frame: 'single',
  };
};
