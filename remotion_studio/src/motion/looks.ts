import { createContext, useContext } from 'react';
import { BASKERVILLE, CINZEL, CORMORANT, FRAUNCES, GARAMOND, MARCELLUS, PLAYFAIR, SANS, SPECTRAL } from './fonts';
import { MotionScene } from './types';
import { TransitionName } from './transitions';
import type { Reveal } from './anim';

/**
 * A LOOK is the visual identity of one video: palette, background, headline typeface, alignment, HUD, camera, transitions and caption style.
 * Every look is WARM and historical (gold, bronze, parchment, crimson, deep teal, royal purple), so the channel is recognisable
 * but two videos in a row never look alike. The pipeline picks one per video (services/looks.py) and passes its name in the props.
 */
export type BgStyle = 'glow' | 'aurora' | 'mesh' | 'orbs' | 'dots' | 'blueprint' | 'mono' | 'stripes' | 'bokeh' | 'circuit' | 'waves' | 'spotlight' | 'rain';
export type HudStyle = 'mono' | 'story' | 'brackets' | 'ticks';
export type CameraStyle = 'drift' | 'push' | 'orbit' | 'handheld' | 'still';
export type CaptionStyle = 'pill' | 'plain' | 'underline' | 'mono' | 'oneword' | 'twotone' | 'wordpill' | 'karaoke' | 'box' | 'bounce';
export type ParticleStyle = 'dots' | 'squares' | 'none';
export type DecorStyle = 'none' | 'number' | 'ring' | 'dimension' | 'bars' | 'arcs';

export interface Look {
  name: string;
  accent: string;
  accent2: string;
  background: string;
  text: string;
  light: boolean;
  bg: BgStyle;
  floorGrid: boolean; // the perspective grid scrolling at the bottom
  particles: ParticleStyle;
  hud: HudStyle;
  align: 'center' | 'left';
  upper: boolean; // headlines in capitals
  sans: string; // headline typeface
  camera: CameraStyle;
  transitions: TransitionName[];
  captions: CaptionStyle;
  scale: number; // headline size multiplier: bolder looks set the type bigger so the frame is filled
  decor: DecorStyle; // a design element that fills the empty lower part of text scenes
}

export const LOOKS: Record<string, Look> = {
  // deep black-blue with an electric cyan glow: the original channel look
  codex: { name: 'codex', accent: '#E9B949', accent2: '#B7791F', background: '#120C07', text: '#FFF6E5', light: false, bg: 'glow', floorGrid: true, particles: 'dots', hud: 'mono', align: 'center', upper: false, sans: PLAYFAIR, camera: 'drift',
    transitions: ['pushLeft', 'zoomThrough', 'iris', 'glitch', 'pushUp', 'blinds', 'whip', 'flip', 'wipe', 'zoomOut', 'diagonal', 'spin', 'fade'], captions: 'pill', scale: 1.0, decor: 'none' },
  // sky blue over a moving aurora of navy and royal blue
  mariner: { name: 'mariner', accent: '#5FD1C4', accent2: '#1F7A8C', background: '#06141A', text: '#F2FBFA', light: false, bg: 'aurora', floorGrid: false, particles: 'dots', hud: 'story', align: 'center', upper: false, sans: CORMORANT, camera: 'push',
    transitions: ['zoomThrough', 'pushUp', 'fade', 'iris', 'zoomOut'], captions: 'wordpill', scale: 1.04, decor: 'none' },
  // periwinkle and indigo: the bluest end of violet, nothing purple
  royal: { name: 'royal', accent: '#F2C94C', accent2: '#6B3FA0', background: '#120A24', text: '#FBF7FF', light: false, bg: 'aurora', floorGrid: false, particles: 'squares', hud: 'ticks', align: 'left', upper: false, sans: CINZEL, camera: 'orbit',
    transitions: ['whip', 'flip', 'spin', 'diagonal', 'pushLeft'], captions: 'underline', scale: 1.1, decor: 'ring' },
  // modern and bold: a saturated cobalt gradient mesh with soft light blobs and film grain, big rounded type
  lapis: { name: 'lapis', accent: '#F4D58D', accent2: '#2E5AAC', background: '#0B1B3F', text: '#FFFFFF', light: false, bg: 'mesh', floorGrid: false, particles: 'squares', hud: 'brackets', align: 'left', upper: false, sans: FRAUNCES, camera: 'handheld',
    transitions: ['whip', 'diagonal', 'zoomThrough', 'pushLeft', 'blinds'], captions: 'oneword', scale: 1.2, decor: 'number' },
  // modern and calm: frosted glass spheres drifting over midnight blue
  marble: { name: 'marble', accent: '#E8DCC4', accent2: '#9C8F7A', background: '#14130F', text: '#F7F3EA', light: false, bg: 'orbs', floorGrid: false, particles: 'dots', hud: 'story', align: 'center', upper: false, sans: SPECTRAL, camera: 'drift',
    transitions: ['fade', 'zoomOut', 'iris', 'pushUp', 'zoomThrough'], captions: 'twotone', scale: 1.06, decor: 'none' },
  // a light look: blue ink on a pale blue sheet
  parchment: { name: 'parchment', accent: '#8B3A1E', accent2: '#C28A2C', background: '#F1E4C8', text: '#2A1B0E', light: true, bg: 'dots', floorGrid: false, particles: 'none', hud: 'story', align: 'left', upper: false, sans: GARAMOND, camera: 'still',
    transitions: ['fade', 'pushLeft', 'wipe', 'zoomOut', 'pushUp'], captions: 'pill', scale: 1.12, decor: 'number' },
  // blue-tinted monochrome: icy white on deep blue-black
  ivory: { name: 'ivory', accent: '#F5EAD0', accent2: '#A89A7C', background: '#0E0D0B', text: '#FAF5E8', light: false, bg: 'mono', floorGrid: false, particles: 'none', hud: 'mono', align: 'center', upper: false, sans: SANS, camera: 'still',
    transitions: ['fade', 'wipe', 'pushLeft', 'iris'], captions: 'plain', scale: 1.0, decor: 'none' },
  // a technical drawing: white lines on blueprint blue
  cartograph: { name: 'cartograph', accent: '#E9D9A6', accent2: '#C9A24B', background: '#123B3A', text: '#F4EFD8', light: false, bg: 'blueprint', floorGrid: false, particles: 'none', hud: 'ticks', align: 'left', upper: true, sans: MARCELLUS, camera: 'drift',
    transitions: ['wipe', 'blinds', 'pushLeft', 'diagonal', 'fade'], captions: 'mono', scale: 1.06, decor: 'dimension' },
  // NEW (Nov 2026): six more blues, each with its own background, typeface, caption style and decor
  // neon sign: diagonal light stripes sweeping over near-black blue, capitals
  crimson: { name: 'crimson', accent: '#FFB347', accent2: '#B3202A', background: '#1A0608', text: '#FFF3E8', light: false, bg: 'stripes', floorGrid: false, particles: 'squares', hud: 'brackets', align: 'center', upper: true, sans: PLAYFAIR, camera: 'handheld',
    transitions: ['whip', 'pushDown', 'shutter', 'glitch', 'diagonal', 'cornerIris'], captions: 'bounce', scale: 1.08, decor: 'bars' },
  // midnight bokeh: out-of-focus lights drifting, soft and cinematic
  nocturne: { name: 'nocturne', accent: '#D9C7A0', accent2: '#4A3B7A', background: '#090812', text: '#F6F1FF', light: false, bg: 'bokeh', floorGrid: false, particles: 'dots', hud: 'story', align: 'left', upper: false, sans: CORMORANT, camera: 'push',
    transitions: ['fade', 'curtain', 'zoomOut', 'cornerIris', 'pushDown'], captions: 'karaoke', scale: 1.1, decor: 'arcs' },
  // steel circuit board: traces and travelling pulses on gunmetal blue
  bronze: { name: 'bronze', accent: '#D69A4A', accent2: '#7A5230', background: '#110C08', text: '#F7EBDD', light: false, bg: 'circuit', floorGrid: false, particles: 'none', hud: 'ticks', align: 'left', upper: true, sans: BASKERVILLE, camera: 'drift',
    transitions: ['shutter', 'wipe', 'pushLeft', 'curtain', 'blinds'], captions: 'box', scale: 1.04, decor: 'bars' },
  // electric: rolling waves of saturated blue light
  ember: { name: 'ember', accent: '#FF8A3D', accent2: '#D1432A', background: '#170805', text: '#FFF1E6', light: false, bg: 'waves', floorGrid: false, particles: 'dots', hud: 'mono', align: 'center', upper: false, sans: CINZEL, camera: 'orbit',
    transitions: ['zoomThrough', 'curtain', 'spin', 'pushDown', 'iris', 'whip'], captions: 'wordpill', scale: 1.12, decor: 'arcs' },
  // frost: a cold spotlight cone from above on dark slate blue
  dusk: { name: 'dusk', accent: '#F2B8A0', accent2: '#8C5A6E', background: '#1A1018', text: '#FFF5F0', light: false, bg: 'spotlight', floorGrid: false, particles: 'none', hud: 'brackets', align: 'center', upper: false, sans: FRAUNCES, camera: 'still',
    transitions: ['fade', 'curtain', 'iris', 'cornerIris', 'zoomOut'], captions: 'box', scale: 1.06, decor: 'none' },
  // deep sea: vertical streaks of cyan light falling through dark water
  oasis: { name: 'oasis', accent: '#E4C76B', accent2: '#2F6F5E', background: '#08150F', text: '#F6F8EE', light: false, bg: 'rain', floorGrid: false, particles: 'dots', hud: 'mono', align: 'left', upper: false, sans: MARCELLUS, camera: 'push',
    transitions: ['pushUp', 'shutter', 'zoomThrough', 'pushDown', 'glitch'], captions: 'karaoke', scale: 1.08, decor: 'bars' },
};

export const LOOK_NAMES = Object.keys(LOOKS);
export const lookFor = (name?: string): Look => LOOKS[name ?? ''] ?? LOOKS.codex;

export const LookCtx = createContext<Look>(LOOKS.codex);
export const useLook = () => useContext(LookCtx);

/** The scene being drawn (for the cues the pipeline sets on it) and how much room the caption strip takes from its bottom. */
export const SceneCtx = createContext<{ scene: MotionScene | null; captionSpace: number; reveal?: Reveal }>({ scene: null, captionSpace: 0 });
export const useSceneCtx = () => useContext(SceneCtx);

/** Scenes that are built to fill the frame: no caption strip over them. */
export const NO_CAPTION = new Set(['tier', 'ui', 'footage', 'flash']);
export const CAPTION_SPACE = 170;
/** The caption strip sits this many px lower than the bottom of the scene's content area, so a caption never touches a text or an object (the scene is also faded out above it). */
export const CAPTION_DROP = 56;
