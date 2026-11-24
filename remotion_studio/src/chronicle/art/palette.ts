import { Look } from '../looks';
import { TimeOfDay, Weather } from './vocab';

export const hex = (c: string): [number, number, number] => {
  const h = c.replace('#', '');
  const v = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
/** Linear mix of two #rrggbb colours: t = 0 gives a, t = 1 gives b. */
export const mix = (a: string, b: string, t: number): string => {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const f = (x: number, y: number) => Math.round(x + (y - x) * Math.max(0, Math.min(1, t)));
  return `#${[f(r1, r2), f(g1, g2), f(b1, b2)].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
};

export interface Colors {
  night: boolean;
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  sun: string;
  far: string; // atmospheric perspective: each nearer layer is darker
  mid: string;
  near: string;
  fore: string;
  shadow: string;
  light: string; // lit surfaces: walls, sails, sand
  accent: string; // cloaks and banners that draw the eye
  accent2: string;
  gold: string;
  skin: string;
  water: string;
  water2: string;
  glow: string; // fire and windows
}

const SKY: Record<TimeOfDay, { top: string; mid: string; bottom: string; sun: string }> = {
  dawn: { top: '#4a3aa8', mid: '#e0629a', bottom: '#ffc58a', sun: '#fff0b8' },
  day: { top: '#2f7fe8', mid: '#7fbcf0', bottom: '#d6efff', sun: '#fff7d0' },
  dusk: { top: '#2a1260', mid: '#c4388c', bottom: '#ff9a4a', sun: '#ffc27a' },
  night: { top: '#040820', mid: '#141f5a', bottom: '#2c3f8f', sun: '#f6f1d8' },
};

/** The illustration palette of one shot: a time-of-day sky graded toward the look's own colours, silhouettes that get darker toward the viewer, and the look's accents for cloaks and flags. */
export const makeColors = (look: Look, time: TimeOfDay, weather: Weather = 'clear'): Colors => {
  const sky = SKY[time];
  const grade = (c: string, t = 0.1) => mix(c, look.accent2, t);
  const storm = weather === 'storm' ? 0.55 : weather === 'rain' ? 0.35 : weather === 'smoke' ? 0.3 : weather === 'snow' ? 0.25 : 0;
  const gray = (c: string) => mix(c, '#4d5058', storm);
  const night = time === 'night';
  const skyTop = gray(grade(sky.top));
  const skyMid = gray(grade(sky.mid));
  const skyBottom = gray(grade(sky.bottom));
  const shadow = look.dark ? mix(look.paper2, '#000000', 0.55) : mix(look.ink, '#000000', 0.2);
  const dim = night ? 0.55 : time === 'dusk' ? 0.12 : 0;
  return {
    night,
    skyTop, skyMid, skyBottom,
    sun: sky.sun,
    far: mix(skyBottom, shadow, night ? 0.5 : 0.2),
    mid: mix(skyBottom, shadow, night ? 0.68 : 0.42),
    near: mix(skyBottom, shadow, night ? 0.78 : 0.58),
    fore: mix(skyBottom, shadow, night ? 0.88 : 0.74),
    shadow,
    light: mix(mix(look.paper, '#ffffff', 0.25), shadow, dim),
    accent: mix(look.accent, shadow, night ? 0.35 : 0.05),
    accent2: mix(look.accent2, shadow, night ? 0.3 : 0.05),
    gold: mix('#d9a93f', shadow, night ? 0.35 : 0),
    skin: mix('#d6a77c', shadow, night ? 0.5 : 0.1),
    water: mix(skyMid, shadow, night ? 0.55 : 0.3),
    water2: mix(skyBottom, shadow, night ? 0.4 : 0.12),
    glow: '#ffb347',
  };
};
