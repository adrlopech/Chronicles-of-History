import React from 'react';
import { hash, rng } from '../ink';

/** Shared drawing helpers for the vector illustrations. Everything is a function of time `t` (seconds), so it can be animated by frame. */
export const W = 1600; // the virtual canvas is wider than the 1080 px window so the camera can pan and the layers can slide at different speeds
export const H = 1920;
export const GY = 700; // the ground line (the horizon of land scenes)

export interface Drawn { t: number; seed: number; dir?: 1 | -1 }

/** A ridge line across the whole canvas, filled down to the bottom: hills, dunes, mountains. `peaky` makes sharp mountains, otherwise smooth rolling lines. */
export const ridge = (seed: number, y: number, amp: number, freq: number, peaky = false, bottom = H): string => {
  const r = rng(seed);
  const n = Math.round(W / freq) + 2;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push([i * freq - freq / 2, y - r() * amp + (peaky ? 0 : (i % 2 ? amp * 0.15 : 0))]);
  if (peaky) return `M-40 ${bottom} ` + pts.map(([x, py]) => `L${x.toFixed(0)} ${py.toFixed(0)}`).join(' ') + ` L${W + 40} ${bottom}Z`;
  let d = `M-40 ${bottom} L${pts[0][0].toFixed(0)} ${pts[0][1].toFixed(0)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` C${(x0 + freq / 2).toFixed(0)} ${y0.toFixed(0)} ${(x1 - freq / 2).toFixed(0)} ${y1.toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}`;
  }
  return d + ` L${W + 40} ${bottom}Z`;
};

/** A travelling sine wave as a path: water. */
export const wave = (y: number, amp: number, len: number, t: number, speed: number, x0 = -40, x1 = W + 40, close = false): string => {
  let d = '';
  for (let x = x0; x <= x1; x += 20) d += `${x === x0 ? 'M' : 'L'}${x} ${(y + Math.sin((x / len) * Math.PI * 2 + t * speed) * amp).toFixed(1)} `;
  return close ? `${d} L${x1} ${H} L${x0} ${H}Z` : d;
};

/** A cloth that waves in the wind: a flag, a banner, a sail edge. Drawn from the pole at the origin, `len` px long and `h` px tall. */
export const Cloth: React.FC<{ len: number; h: number; t: number; seed?: number; fill: string; stroke?: string; speed?: number }> = ({ len, h, t, seed = 0, fill, stroke, speed = 5 }) => {
  const N = 14;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * len;
    const w = Math.sin(t * speed + i * 0.6 + seed) * (h * 0.22) * (i / N);
    top.push(`${x.toFixed(1)} ${(w).toFixed(1)}`);
    bot.push(`${x.toFixed(1)} ${(w + h * (1 - 0.18 * (i / N))).toFixed(1)}`);
  }
  return <path d={`M${top.join(' L')} L${bot.reverse().join(' L')}Z`} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} strokeLinejoin="round" />;
};

export const seedOf = (s: string) => hash(s);
export const tri = (x: number, y: number, w: number, h: number) => `M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y}Z`;
export const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y} h${w} v${h} h${-w}Z`;
