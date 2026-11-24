/** Data contract of the MotionGraphic composition (The Chronicles of History). Everything on screen comes from these props. */
export type SceneType =
  | 'statement' | 'chapter' | 'date' | 'timeline' | 'map' | 'quote' | 'ledger' | 'versus' | 'list' | 'verdict' | 'image' | 'flash' | 'outro'
  // legacy names the pipeline may still send; they are drawn with the closest history scene (see ALIAS in Chronicle.tsx)
  | 'bigText' | 'textWithAccent' | 'card' | 'headline' | 'counter' | 'progressBar' | 'curve' | 'codeBlock' | 'footage' | 'tier' | 'rank' | 'quiz' | 'split' | 'units' | 'ui';

import type { ArtShot } from './art/vocab';

export type IconName =
  | 'column' | 'laurel' | 'sword' | 'ship' | 'crown' | 'scroll' | 'hourglass' | 'castle' | 'quill' | 'key' | 'coin' | 'compass' | 'pyramid' | 'book' | 'gear' | 'sun';

export interface MotionScene {
  type: SceneType;
  text: string; // main line. date: the year ("476"); chapter: the chapter title; map: the title above the map
  accentText?: string; // the accent phrase, italic in rubric colour with a hand-drawn underline. date: the event line; chapter: the subtitle; quote: the attribution
  kicker?: string; // small capitals label. date / map / image: the place or caption plate
  value?: number; // ledger: the figure counted up (avoid decimals). date: the year as a number. chapter: the chapter number
  unit?: string; // ledger: suffix after the figure ("soldiers"). date: the era marker ("AD", "BC")
  items?: string[]; // timeline: up to 5 "year|label"; map: up to 5 "Place|x|y" (x, y in 0-100); list: 2-4 short lines; outro: the two vote options
  left?: string; // versus: left contender
  right?: string;
  leftValue?: number;
  rightValue?: number;
  winner?: 'left' | 'right' | 'none';
  verdict?: 'myth' | 'fact' | 'partly' | 'buy' | 'wait' | 'skip';
  art?: ArtShot[]; // 1-2 vector illustration shots drawn behind the scene (see art/vocab.ts); the picture changes from shot to shot as the narration moves on
  icon?: IconName; // the engraving drawn on a statement scene (picked from the words when empty)
  mediaSrc?: string; // image scene: a file in the public folder (an engraving or a public-domain photograph)
  callout?: string; // a short marginal note (a figure, a name) that appears mid-scene
  calloutCue?: number; // seconds after the scene starts at which the narrator says it
  accentCue?: number; // seconds after the scene starts at which the narrator says the accent phrase: its underline is drawn then
  light?: boolean; // ignored (looks decide light or dark); kept so older scripts still validate
  cursor?: string; // ignored
  transition?: string; // ignored (entrances are picked per scene)
  narration?: string; // spoken line (used by the pipeline for the voice; not drawn)
  durationInFrames: number;
}

export interface MotionTheme {
  accent?: string;
  accent2?: string;
  background?: string;
  text?: string;
}

export interface CaptionWord {
  w: string;
  s: number; // first frame of the word in the whole video
  e: number;
}

export interface MotionGraphicProps {
  title: string;
  series?: string;
  theme?: string; // the colour theme (palette.ts THEMES): gilded, sepia, ember, regal, bronze, ivory or smoke
  look?: string; // an era look (looks.ts): antiquity, manuscript, seachart, empire, industrial, wartime
  captions?: CaptionWord[];
  scenes: MotionScene[];
}

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
/** Shorts / TikTok cover the top ~12% and the bottom ~20% with their own interface: nothing important lives there. */
export const SAFE_TOP = Math.round(HEIGHT * 0.12);
export const SAFE_BOTTOM = Math.round(HEIGHT * 0.2);
export const CAPTION_SPACE = 250;
export const OVERLAP = 12; // frames a scene stays under the next one while they cross
export const CHANNEL = '@chroniclesofhistorytv';
export const totalFrames = (scenes: MotionScene[]) => scenes.reduce((a, s) => a + s.durationInFrames, 0);
