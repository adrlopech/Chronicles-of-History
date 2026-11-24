import { createContext, useContext } from 'react';
import { BASKERVILLE, BASKERVILLE_ITALIC, CARDO, CARDO_ITALIC, CINZEL, CORMORANT, ELITE, FELL, FELL_ITALIC, GARAMOND, GARAMOND_ITALIC, MANROPE, MARCELLUS, PLAYFAIR, PLAYFAIR_ITALIC, SORA, SPACE, ANTON, BEBAS, ABRIL, OSWALD } from './fonts';

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
}

export const LOOKS: Record<string, Look> = {
  // Greece, Rome, Egypt: terracotta and ochre on warm stone, Roman capitals
  antiquity: { name: 'antiquity', era: 'Antiquity', dark: false, paper: '#EBD9B4', paper2: '#C7A474', ink: '#2B1A10', muted: '#7A6244', accent: '#B5482A', accent2: '#B98A2E', head: CINZEL, italic: CORMORANT, body: CORMORANT, date: CINZEL, caps: true, k: 0.74, frame: 'double', grain: 0.5, weight: 800 },
  // the Middle Ages: vellum, iron-gall ink, a rubricated red
  manuscript: { name: 'manuscript', era: 'Middle Ages', dark: false, paper: '#F0E4C6', paper2: '#D2BB8C', ink: '#1C2336', muted: '#6D6450', accent: '#A3201D', accent2: '#C29A3F', head: FELL, italic: FELL_ITALIC, body: GARAMOND, date: FELL, caps: false, k: 0.5, frame: 'corners', grain: 0.55, weight: 400 },
  // exploration and the age of sail: a dark sea chart with brass
  seachart: { name: 'seachart', era: 'Age of Sail', dark: true, paper: '#1B3C38', paper2: '#0A1E1D', ink: '#F0E6C8', muted: '#9DB5A8', accent: '#E3BC5C', accent2: '#6FB0A4', head: MARCELLUS, italic: GARAMOND_ITALIC, body: CORMORANT, date: CINZEL, caps: true, k: 0.68, frame: 'single', grain: 0.4, weight: 400 },
  // kings, revolutions, dynasties: black-red lacquer with gold leaf
  empire: { name: 'empire', era: 'Empires and monarchies', dark: true, paper: '#2A1013', paper2: '#0B0506', ink: '#F6E9D2', muted: '#B59E86', accent: '#D8AE4E', accent2: '#A82234', head: PLAYFAIR, italic: PLAYFAIR_ITALIC, body: GARAMOND, date: PLAYFAIR, caps: false, k: 0.56, frame: 'double', grain: 0.35, weight: 900 },
  // the 18th-19th centuries: newsprint, iron, a printer's red
  industrial: { name: 'industrial', era: 'Industrial age', dark: false, paper: '#DDD3BC', paper2: '#B5A98E', ink: '#1E1B18', muted: '#6E665A', accent: '#B03A2E', accent2: '#4A4640', head: BASKERVILLE, italic: BASKERVILLE_ITALIC, body: BASKERVILLE, date: ELITE, caps: false, k: 0.58, frame: 'single', grain: 0.7, weight: 700 },
  // the world wars and the Cold War: olive-black, typewriter, a signal mustard
  wartime: { name: 'wartime', era: '20th century conflicts', dark: true, paper: '#262B1D', paper2: '#0E110B', ink: '#EAE5D0', muted: '#A6A68F', accent: '#DDB53B', accent2: '#8B2E1F', head: ELITE, italic: CARDO_ITALIC, body: CARDO, date: ELITE, caps: true, k: 0.64, frame: 'corners', grain: 0.65, weight: 400 },
};

export const LOOK_NAMES = Object.keys(LOOKS);
export const lookFor = (name?: string): Look => LOOKS[name ?? ''] ?? LOOKS.manuscript;
export const LookCtx = createContext<Look>(LOOKS.manuscript);
export const useLook = () => useContext(LookCtx);

/** The on-screen style of every video: modern and graphic. The drawing is the hero, so type is white and bold on a dark scrim, one bright accent per era, no paper. The era look still sets the picture's colours and these accents. */
const BRIGHT: Record<string, { accent: string; accent2: string }> = {
  antiquity: { accent: '#FF8A5B', accent2: '#FFC857' },
  manuscript: { accent: '#FF5A6E', accent2: '#6EC1FF' },
  seachart: { accent: '#FFD166', accent2: '#5CE1C6' },
  empire: { accent: '#FFC857', accent2: '#FF5C8A' },
  industrial: { accent: '#FF6B5B', accent2: '#9AB0C4' },
  wartime: { accent: '#FFD23F', accent2: '#FF7A3D' },
};
const HEAD: Record<string, { font: string; weight: number; k: number }> = {
  antiquity: { font: CINZEL, weight: 800, k: 0.8 },
  manuscript: { font: PLAYFAIR, weight: 900, k: 0.74 },
  seachart: { font: ABRIL, weight: 400, k: 0.7 },
  empire: { font: PLAYFAIR, weight: 900, k: 0.74 },
  industrial: { font: ANTON, weight: 400, k: 0.52 },
  wartime: { font: BEBAS, weight: 400, k: 0.46 },
};
/** Deep, era-tinted dark used for panels and backgrounds (never pure black). */
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
    ...(BRIGHT[look.name] ?? BRIGHT.manuscript),
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
