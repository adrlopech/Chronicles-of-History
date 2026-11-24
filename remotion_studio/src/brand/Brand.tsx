import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Aqueduct, Cathedral, Colosseum, Fortress, GreatWall, JapaneseCastle, Library, Monastery, Mosque, Obelisk, Observatory, Pagoda, Palace, Sphinx, Stonehenge, TriumphalArch, Village, Ziggurat, ClockTower } from '../chronicle/art/structures2';
import { Duomo } from '../chronicle/art/structures3';
import { Gate, Lighthouse, Pyramids, Temple, Tents, Tower, Windmill } from '../chronicle/art/things';
import { Caravan } from '../chronicle/art/people';
import { Colors, mix } from '../chronicle/art/palette';
import { CINZEL_DECO, CORMORANT } from '../chronicle/fonts';
import { Corners } from '../chronicle/ink';
import { Engraving } from '../chronicle/icons';

/**
 * The brand of The Chronicles of History, in the spirit of the sister channel's: a bold emblem that glows, on a deep gradient with sparkles and a fine grid, glass tiles around it,
 * a two-tone wordmark (cream roman + gold italic) and a monospaced tagline. The emblem is THE CHRONICLER, a character; the colours are brown leather, bronze and gold leaf.
 */
export const GOLD = { hi: '#FFF1BF', mid: '#F0C25E', lo: '#B9822A', deep: '#6B430A' };
export const OBSIDIAN = '#0A0710';
/** The brown and gold of the brand: leather, bronze and gold leaf. */
export const DUSK = { top: '#3A2210', mid: '#B9822A', low: '#F0C25E' };
export const EMBER = '#FF7A55';
export const PARCHMENT = '#F4E6C8';

const SK = { base: '#E3B282', shade: '#C98E5C', blush: '#E98A6E' };
const CLOAK = { hi: '#9A6335', mid: '#6E4224', lo: '#40230F' };

/** The mascot, THE CHRONICLER: a kindly white-bearded scribe with a laurel wreath, a brown cloak with a gold clasp, a scroll in one hand and a quill in the other. A badge of 800 x 800;
 *  `simple` is the flat one-colour version for the watermark (head, beard, wreath and ring). The face follows the drawing language of the people in the videos, only larger. */
export const Seal: React.FC<{ id?: string; simple?: boolean }> = ({ id = 's', simple = false }) => {
  const laurel = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const ang = Math.PI * (1.06 + t * 0.88);
    return { x: 400 + Math.cos(ang) * 168, y: 322 + Math.sin(ang) * 170, rot: (ang * 180) / Math.PI + 90, k: i };
  });
  if (simple) {
    return (
      <svg viewBox="0 0 800 800" width="100%" height="100%">
        <defs><linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GOLD.hi} /><stop offset="1" stopColor={GOLD.lo} /></linearGradient></defs>
        <circle cx={400} cy={400} r={372} fill="none" stroke={`url(#${id}-g)`} strokeWidth={36} />
        <ellipse cx={400} cy={330} rx={150} ry={165} fill={`url(#${id}-g)`} />
        <path d="M255 360 Q250 540 330 600 Q400 640 470 600 Q550 540 545 360 Q500 430 400 435 Q300 430 255 360Z" fill={`url(#${id}-g)`} />
        <path d="M70 700 Q120 600 240 585 Q400 560 560 585 Q680 600 730 700 Q640 760 400 770 Q160 760 70 700Z" fill={`url(#${id}-g)`} />
        {laurel.map((l) => <ellipse key={l.k} cx={l.x} cy={l.y} rx={11} ry={30} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill="#14091c" />)}
        <circle cx={346} cy={322} r={16} fill="#14091c" /><circle cx={454} cy={322} r={16} fill="#14091c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#6a4220" /><stop offset="0.55" stopColor="#3a2210" /><stop offset="1" stopColor="#1a0f07" /></radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={GOLD.mid} stopOpacity="0.55" /><stop offset="1" stopColor={GOLD.mid} stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-cloak`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={CLOAK.hi} /><stop offset="0.5" stopColor={CLOAK.mid} /><stop offset="1" stopColor={CLOAK.lo} /></linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GOLD.hi} /><stop offset="0.5" stopColor={GOLD.mid} /><stop offset="1" stopColor={GOLD.lo} /></linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={GOLD.hi} /><stop offset="0.5" stopColor={GOLD.lo} /><stop offset="1" stopColor={GOLD.mid} /></linearGradient>
        <linearGradient id={`${id}-beard`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf8f0" /><stop offset="1" stopColor="#d9d3c4" /></linearGradient>
        <clipPath id={`${id}-clip`}><circle cx={400} cy={400} r={380} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width={800} height={800} fill={`url(#${id}-bg)`} />
        {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2, d = a + 0.12; return <path key={i} d={`M400 330 L${400 + Math.cos(a) * 560} ${330 + Math.sin(a) * 560} L${400 + Math.cos(d) * 560} ${330 + Math.sin(d) * 560}Z`} fill={GOLD.mid} opacity={0.11} />; })}
        <circle cx={400} cy={330} r={290} fill={`url(#${id}-halo)`} />
        {/* the cloak, the tunic, the clasp */}
        <path d="M40 840 V720 Q70 610 230 574 Q320 552 400 566 Q480 552 570 574 Q730 610 760 720 V840Z" fill={`url(#${id}-cloak)`} />
        <path d="M236 640 Q290 720 262 830 M564 640 Q510 720 538 830 M330 600 Q300 700 316 830 M470 600 Q500 700 484 830" stroke={CLOAK.lo} strokeWidth={9} fill="none" opacity={0.55} strokeLinecap="round" />
        <path d="M322 568 L400 664 L478 568Z" fill={PARCHMENT} stroke="#bba575" strokeWidth={3} />
        <path d="M322 568 L400 664 L478 568" fill="none" stroke={`url(#${id}-gold)`} strokeWidth={9} strokeLinejoin="round" />
        <circle cx={400} cy={684} r={26} fill={`url(#${id}-gold)`} stroke={GOLD.deep} strokeWidth={4} /><circle cx={400} cy={684} r={11} fill={EMBER} stroke="#8a2a1a" strokeWidth={2} />
        {/* neck, hair, ears, head */}
        <ellipse cx={400} cy={540} rx={64} ry={52} fill={SK.shade} />
        <ellipse cx={400} cy={296} rx={186} ry={186} fill="#ece7dc" />
        {[[246, 330, 40, 52], [554, 330, 40, 52], [262, 250, 36, 44], [538, 250, 36, 44]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#f4f0e6" stroke="#cbc4b2" strokeWidth={3} />)}
        <ellipse cx={252} cy={360} rx={22} ry={34} fill={SK.base} stroke={SK.shade} strokeWidth={4} /><ellipse cx={548} cy={360} rx={22} ry={34} fill={SK.base} stroke={SK.shade} strokeWidth={4} />
        <ellipse cx={400} cy={338} rx={150} ry={166} fill={SK.base} stroke={SK.shade} strokeWidth={4} />
        <ellipse cx={400} cy={226} rx={110} ry={34} fill="#f6f2e8" opacity={0.9} />
        {/* the beard and mustache */}
        <path d="M256 372 Q244 548 328 604 Q400 646 472 604 Q556 548 544 372 Q500 440 400 444 Q300 440 256 372Z" fill={`url(#${id}-beard)`} stroke="#bdb6a4" strokeWidth={4} strokeLinejoin="round" />
        <path d="M330 520 Q340 580 356 600 M400 540 V626 M470 520 Q460 580 444 600 M300 470 Q300 520 316 550 M500 470 Q500 520 484 550" stroke="#c9c2b0" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M400 452 Q420 504 470 500" stroke="none" fill="none" />
        <path d="M338 418 Q366 394 400 416 Q434 394 462 418 Q440 452 400 440 Q360 452 338 418Z" fill="#f6f2e8" stroke="#bdb6a4" strokeWidth={4} strokeLinejoin="round" />
        <path d="M376 452 Q400 478 424 452" stroke="#7a2c2c" strokeWidth={9} fill="none" strokeLinecap="round" />
        <ellipse cx={400} cy={462} rx={20} ry={9} fill="#5a1f1f" opacity={0.85} />
        {/* the face */}
        <ellipse cx={400} cy={372} rx={25} ry={30} fill={SK.base} stroke={SK.shade} strokeWidth={4} /><path d="M388 392 Q400 402 412 392" stroke={SK.shade} strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle cx={316} cy={398} r={26} fill={SK.blush} opacity={0.3} /><circle cx={484} cy={398} r={26} fill={SK.blush} opacity={0.3} />
        {[336, 464].map((x) => (
          <g key={x}><ellipse cx={x} cy={326} rx={30} ry={25} fill="#fffaf0" stroke="#7a5a3a" strokeWidth={3} /><circle cx={x + (x < 400 ? 4 : -4)} cy={330} r={14} fill="#4a2c14" /><circle cx={x + (x < 400 ? 4 : -4)} cy={330} r={6.5} fill="#140a05" /><circle cx={x + (x < 400 ? 9 : -1)} cy={323} r={5} fill="#fff" /></g>
        ))}
        <path d="M296 286 Q340 252 380 282 Q336 276 296 296Z" fill="#f4f0e6" stroke="#bdb6a4" strokeWidth={4} strokeLinejoin="round" /><path d="M504 286 Q460 252 420 282 Q464 276 504 296Z" fill="#f4f0e6" stroke="#bdb6a4" strokeWidth={4} strokeLinejoin="round" />
        {/* the laurel */}
        {laurel.map((l) => <ellipse key={l.k} cx={l.x} cy={l.y} rx={14} ry={35} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill={`url(#${id}-gold)`} stroke={GOLD.deep} strokeWidth={3} />)}
        <path d="M244 296 Q400 84 556 296" stroke={GOLD.lo} strokeWidth={6} fill="none" opacity={0.7} />
        {/* the scroll and its hand, the quill and its hand */}
        <g transform="translate(48 -14)">
        <g transform="rotate(-14 210 640)">
          <rect x={120} y={604} width={200} height={72} rx={34} fill={PARCHMENT} stroke="#bba575" strokeWidth={4} />
          <ellipse cx={128} cy={640} rx={26} ry={38} fill="#ead8aa" stroke="#bba575" strokeWidth={4} /><ellipse cx={128} cy={640} rx={11} ry={18} fill="none" stroke="#bba575" strokeWidth={3} />
          <path d="M170 628 H292 M170 644 H280 M170 660 H292" stroke="#6a4a2a" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          <circle cx={296} cy={640} r={20} fill="#b3202a" stroke="#6a0f16" strokeWidth={3} />
        </g>
        <circle cx={232} cy={668} r={36} fill={SK.base} stroke={SK.shade} strokeWidth={4} />
        </g>
        <g transform="translate(-50 6)">
        <path d="M584 626 Q640 480 726 288" stroke="#f4e6c8" strokeWidth={9} strokeLinecap="round" fill="none" />
        <path d="M726 288 Q790 380 668 520 Q700 430 726 288Z" fill={PARCHMENT} stroke="#bba575" strokeWidth={4} strokeLinejoin="round" />
        <path d="M726 288 Q752 356 706 424" stroke="#bba575" strokeWidth={3} fill="none" />
        <circle cx={582} cy={640} r={37} fill={SK.base} stroke={SK.shade} strokeWidth={4} />
        <path d="M722 262 l8 18 l-8 18 l-8 -18z" fill={GOLD.hi} />
        </g>
      </g>
      <circle cx={400} cy={400} r={380} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={22} />
      <circle cx={400} cy={400} r={354} fill="none" stroke={GOLD.lo} strokeWidth={3} opacity={0.8} />
    </svg>
  );
};

/** A four-point sparkle. */
const sparkle = (x: number, y: number, r: number) => `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`;

/** The ground of the brand: a deep gradient (indigo to obsidian to amber), a fine grid and gold and cream sparkles. */
export const Cosmos: React.FC<{ w: number; h: number; wide?: boolean }> = ({ w, h, wide }) => {
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const n = wide ? 46 : 22;
  return (
    <AbsoluteFill style={{ background: wide ? 'linear-gradient(100deg, #442812 0%, #24150a 30%, #100904 60%, #3c2410 100%)' : 'linear-gradient(135deg, #4a2c14 0%, #1c1008 55%, #3a2410 100%)' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 45% at 50% 112%, rgba(240,194,94,0.30) 0%, rgba(185,130,42,0.12) 45%, transparent 75%)' }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: `${wide ? 64 : 50}px ${wide ? 64 : 50}px` }} />
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: n }, (_, i) => {
          const x = rnd() * w, y = rnd() * h, r = (wide ? 9 : 7) + rnd() * (wide ? 26 : 22);
          const gold = rnd() > 0.55;
          return <path key={i} d={sparkle(x, y, r)} fill={gold ? GOLD.mid : '#FFF0D0'} opacity={0.25 + rnd() * 0.55} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Avatar: React.FC = () => (
  <AbsoluteFill>
    <Cosmos w={800} h={800} />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 800, height: 800 }}><Seal id="av" /></div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** The monogram alone on a transparent ground, for the YouTube video watermark. */
export const Watermark: React.FC = () => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 300, height: 300 }}><Seal id="wm" simple /></div></AbsoluteFill>
);

/** The palette the monuments are drawn in for the banner: sepia, leather and bronze, with gold light. */
const sepia = (): Colors => ({
  night: false, skyTop: '#2a170a', skyMid: '#8a5a2a', skyBottom: '#f0c25e', sun: '#fff1c8',
  far: '#9a6a3a', mid: '#6a4424', near: '#44281a', fore: '#26160c', shadow: '#1a0f07', light: '#e7c98c',
  accent: '#a8442a', accent2: '#8a5a2a', gold: '#f0c25e', skin: '#d9a877', water: '#6a4424', water2: '#8a5a2a', glow: '#ffd27a',
});

type Layer = 'far' | 'mid' | 'near';
/** The skyline: three rows of monuments, hazy far ones behind, so that the horizon is full from edge to edge. */
const SKYLINE: { C: React.FC<any>; x: number; s: number; layer: Layer }[] = [
  // far, in the haze
  { C: Ziggurat, x: 300, s: 0.9, layer: 'far' }, { C: Mosque, x: 620, s: 0.85, layer: 'far' }, { C: Palace, x: 930, s: 0.8, layer: 'far' }, { C: Fortress, x: 1240, s: 0.8, layer: 'far' },
  { C: Monastery, x: 1560, s: 0.75, layer: 'far' }, { C: JapaneseCastle, x: 1860, s: 0.9, layer: 'far' }, { C: Gate, x: 2150, s: 0.7, layer: 'far' }, { C: Tower, x: 2440, s: 1.0, layer: 'far' },
  { C: Pyramids, x: 470, s: 1.0, layer: 'far' }, { C: GreatWall, x: 1550, s: 1.0, layer: 'far' }, { C: Aqueduct, x: 1010, s: 0.85, layer: 'far' },
  // middle row
  { C: Stonehenge, x: 140, s: 0.8, layer: 'mid' }, { C: Sphinx, x: 440, s: 0.85, layer: 'mid' }, { C: TriumphalArch, x: 800, s: 0.8, layer: 'mid' }, { C: Library, x: 1110, s: 0.75, layer: 'mid' },
  { C: ClockTower, x: 1430, s: 0.7, layer: 'mid' }, { C: Duomo, x: 1760, s: 0.5, layer: 'mid' }, { C: Observatory, x: 2040, s: 0.85, layer: 'mid' }, { C: Village, x: 2330, s: 0.85, layer: 'mid' },
  // near row
  { C: Obelisk, x: 64, s: 1.7, layer: 'near' }, { C: Temple, x: 700, s: 1.0, layer: 'near' }, { C: Tents, x: 1010, s: 0.75, layer: 'near' }, { C: Colosseum, x: 1230, s: 0.78, layer: 'near' },
  { C: Cathedral, x: 1700, s: 0.85, layer: 'near' }, { C: Windmill, x: 1960, s: 0.62, layer: 'near' }, { C: Lighthouse, x: 2200, s: 0.8, layer: 'near' }, { C: Pagoda, x: 2420, s: 1.45, layer: 'near' },
];
const LAYER = { far: { y: 1236, k: 1.15, o: 0.58 }, mid: { y: 1284, k: 1.3, o: 0.8 }, near: { y: 1322, k: 1.4, o: 1 } } as const;


const YT_PATH = 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z';
const TT_PATH = 'M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z';

/** A sheet of torn paper: a rectangle whose four edges wander and bite, with a few deep tears. Deterministic. */
const torn = (x0: number, y0: number, x1: number, y1: number, seed: number, amp: number): string => {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const edge = (ax: number, ay: number, bx: number, by: number, bite: number) => {
    const n = Math.max(8, Math.round(Math.hypot(bx - ax, by - ay) / 26));
    const nx = -(by - ay) / Math.hypot(bx - ax, by - ay), ny = (bx - ax) / Math.hypot(bx - ax, by - ay);
    const pts: string[] = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const deep = rnd() < 0.14 ? 2.6 : 1;
      const o = (rnd() - 0.45) * amp * deep * bite + Math.sin(t * 9 + seed) * amp * 0.35;
      pts.push(`L${(ax + (bx - ax) * t + nx * o).toFixed(1)} ${(ay + (by - ay) * t + ny * o).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  return `M${x0} ${y0} ${edge(x0, y0, x1, y0, 1)} ${edge(x1, y0, x1, y1, 1.3)} ${edge(x1, y1, x0, y1, 1)} ${edge(x0, y1, x0, y0, 1.3)}Z`;
};
const TORN = torn(262, 30, 1416, 404, 11, 17);
const TORN_BACK = torn(276, 42, 1432, 416, 5, 22);

/** The YouTube channel art (2560 x 1440): an illuminated panorama of history. Monuments of every age stand in a row under a gold sun, in sepia and bronze; the title is inked on a parchment scroll held at the centre
 *  with the Chronicler's badge. Badge, scroll and tagline sit in the 1546 x 423 box phones show. */
export const Banner: React.FC = () => {
  const c = sepia();
  
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1c1008 0%, #4a2c12 34%, #a8702e 62%, #f0c25e 82%, #ffe6a8 100%)' }}>
      {/* the sun and its rays */}
      <svg width={2560} height={1440} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="sunc" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff6d6" /><stop offset="0.55" stopColor="#ffdc88" /><stop offset="1" stopColor="#f0c25e" stopOpacity="0.0" /></radialGradient>
          <radialGradient id="vig" cx="50%" cy="48%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#0b0603" stopOpacity="0.75" /></radialGradient>
        </defs>
        {Array.from({ length: 28 }, (_, i) => { const a = Math.PI * (1.04 + (i / 27) * 0.92), d = a + 0.03; return <path key={i} d={`M1280 1010 L${1280 + Math.cos(a) * 1900} ${1010 + Math.sin(a) * 1900} L${1280 + Math.cos(d) * 1900} ${1010 + Math.sin(d) * 1900}Z`} fill="#fff1c8" opacity={0.1} />; })}
        <circle cx={1280} cy={1010} r={460} fill="url(#sunc)" opacity={0.75} />
        <circle cx={1280} cy={1010} r={250} fill="#fff1c8" opacity={0.95} />
      </svg>
      {/* the monuments, far then near */}
      <svg width={2560} height={1440} viewBox="0 0 2560 1440" style={{ position: 'absolute', inset: 0 }}>
        {(['far', 'mid', 'near'] as const).map((layer) => {
          const col: Colors = layer === 'far' ? { ...c, near: c.far, mid: mix(c.far, '#f0c25e', 0.2), light: '#f1d79a', fore: c.mid } : layer === 'mid' ? { ...c, near: mix(c.mid, c.far, 0.4), mid: c.far, light: '#ecd08c', fore: c.near } : c;
          return (
            <g key={layer} opacity={LAYER[layer].o}>
              {SKYLINE.filter((m) => m.layer === layer).map((m, i) => (
                <g key={i} transform={`translate(${m.x} ${LAYER[layer].y}) scale(${m.s * LAYER[layer].k})`}><m.C c={col} t={0} seed={i + 1} /></g>
              ))}
            </g>
          );
        })}
        <path d="M0 1320 Q640 1296 1280 1316 T2560 1308 V1440 H0Z" fill="#1c1008" />
        <path d="M0 1338 Q640 1314 1280 1334 T2560 1326" stroke="#f0c25e" strokeWidth={3} fill="none" opacity={0.5} />
        <rect width={2560} height={1440} fill="url(#vig)" />
      </svg>
      {/* a flock of birds, long clouds and a caravan: the small stories of the panorama */}
      <svg width={2560} height={1440} viewBox="0 0 2560 1440" style={{ position: 'absolute', inset: 0 }}>
        {[[520, 300, 1.7], [650, 240, 1.3], [750, 330, 1.1], [1800, 400, 1.5], [1930, 340, 1.1], [2020, 430, 0.9]].map(([x, y, s], i) => (
          <path key={i} d={`M${x - 26 * s} ${y} Q${x - 12 * s} ${y - 16 * s} ${x} ${y + 2 * s} Q${x + 12 * s} ${y - 16 * s} ${x + 26 * s} ${y}`} stroke="#2a170a" strokeWidth={5 * s} fill="none" strokeLinecap="round" opacity={0.8} />
        ))}
        {[[360, 690, 340, 26], [2000, 650, 380, 24], [1500, 590, 260, 18], [820, 600, 220, 16]].map(([x, y, w, h], i) => <ellipse key={i} cx={x} cy={y} rx={w} ry={h} fill="#fff1c8" opacity={0.2} />)}
        <g transform="translate(900 1330) scale(0.78)"><Caravan c={{ ...c, near: c.fore, mid: c.fore, far: c.fore, light: c.fore, accent: c.fore, accent2: c.fore }} t={0.3} seed={2} dir={1} /></g>
      </svg>
      {/* an aged-paper grain over everything */}
      <AbsoluteFill style={{ opacity: 0.1, mixBlendMode: 'multiply', backgroundImage: 'repeating-radial-gradient(circle at 23% 31%, #3a2210 0 1px, transparent 1px 3px)' }} />
      {/* the double gold frame with its corner brackets */}
      <div style={{ position: 'absolute', left: 34, top: 34, right: 34, bottom: 34, border: `5px solid ${GOLD.mid}`, boxShadow: `inset 0 0 0 10px #1c1008, inset 0 0 0 13px ${GOLD.lo}`, borderRadius: 6 }} />
      <div style={{ position: 'absolute', inset: 0 }}><Corners color={GOLD.hi} size={110} inset={46} weight={7} /></div>
      {[[1280, 34], [1280, 1406]].map(([x, y], i) => <div key={i} style={{ position: 'absolute', left: x - 170, top: y - 14, width: 340, height: 28, display: 'flex', alignItems: 'center', gap: 14, background: '#1c1008' }}><div style={{ flex: 1, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD.mid})` }} /><div style={{ width: 16, height: 16, background: GOLD.hi, transform: 'rotate(45deg)' }} /><div style={{ flex: 1, height: 3, background: `linear-gradient(270deg, transparent, ${GOLD.mid})` }} /></div>)}
      {/* two scraps torn from the same sheet as the title scroll, either side of it: inside the band tablets show (x 352 to 2207), just outside the phone band */}
      {[{ x: 430, side: 'left', rot: -3, seed: 23 }, { x: 2130, side: 'right', rot: 3, seed: 41 }].map((pl) => {
        const shape = torn(10, 12, 158, 356, pl.seed, 11);
        const back = torn(14, 18, 162, 364, pl.seed + 7, 14);
        const id = `scrap${pl.side}`;
        return (
          <div key={pl.side} style={{ position: 'absolute', left: pl.x - 84, top: 530, width: 168, height: 376, transform: `rotate(${pl.rot}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.55))' }}>
            <svg width={168} height={376} viewBox="0 0 168 376" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <clipPath id={`${id}-c`}><path d={shape} /></clipPath>
                <linearGradient id={`${id}-p`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8edcf" /><stop offset="0.55" stopColor="#ecd6a0" /><stop offset="1" stopColor="#dcbf82" /></linearGradient>
                <filter id={`${id}-f`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
              </defs>
              <path d={back} fill="#bd9a5a" stroke="#7a5428" strokeWidth={2.5} />
              <path d={shape} fill={`url(#${id}-p)`} stroke="#8a6230" strokeWidth={3} strokeLinejoin="round" />
              <g clipPath={`url(#${id}-c)`}>
                <path d={shape} fill="none" stroke="#7a4e1e" strokeWidth={26} opacity={0.4} filter={`url(#${id}-f)`} />
                <ellipse cx={84} cy={90} rx={70} ry={50} fill="#a8742e" opacity={0.16} /><ellipse cx={90} cy={300} rx={60} ry={44} fill="#a8742e" opacity={0.18} />
                <path d="M20 190 l18 8 l-6 14 M150 120 l-16 10 l8 14" stroke="#6a4420" strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
              </g>
            </svg>
            <div style={{ position: 'absolute', left: 12, top: 18, width: 144, height: 336, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
              {pl.side === 'left' ? (
                <>
                  <Engraving name="hourglass" size={70} color="#4a2e14" accent="#8a5a2a" at={0} len={1} thick={4.6} />
                  <div style={{ width: 70, height: 3, background: 'linear-gradient(90deg, transparent, #8a5a2a, transparent)' }} />
                  <div style={{ fontFamily: CINZEL_DECO, fontWeight: 900, fontSize: 27, lineHeight: 1.12, color: '#3a2210', whiteSpace: 'nowrap' }}>A NEW<br />STORY<br />EVERY<br />DAY</div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: CINZEL_DECO, fontWeight: 900, fontSize: 26, lineHeight: 1.1, color: '#3a2210' }}>FIND<br />US ON</div>
                  <div style={{ width: 70, height: 3, background: 'linear-gradient(90deg, transparent, #8a5a2a, transparent)' }} />
                  <svg width={74} height={74} viewBox="0 0 24 24"><path fill="#3a2210" d={YT_PATH} /></svg>
                  <svg width={64} height={64} viewBox="0 0 24 24"><path fill="#3a2210" d={TT_PATH} /></svg>
                </>
              )}
            </div>
          </div>
        );
      })}
      {/* the phone box: YouTube shows phones only the centre 1546 x 423 of the art, so the badge and the scroll are centred in it and scaled to stay clear of its edges */}
      <div style={{ position: 'absolute', left: 507, top: 508, width: 1546, height: 423, transform: 'translateX(103px) translateY(-6px) scale(0.85)', transformOrigin: '670px 211px' }}>
        <svg width={1546} height={423} viewBox="0 0 1546 423" style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.55))' }}>
          <defs>
            <linearGradient id="parch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8edcf" /><stop offset="0.55" stopColor="#ecd6a0" /><stop offset="1" stopColor="#dcbf82" /></linearGradient>
            <radialGradient id="stain1" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#a8742e" stopOpacity="0.34" /><stop offset="1" stopColor="#a8742e" stopOpacity="0" /></radialGradient>
            <filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="7" /></filter>
            <clipPath id="torn"><path d={TORN} /></clipPath>
          </defs>
          {/* a second, darker sheet peeks out behind the first */}
          <path d={TORN_BACK} fill="#bd9a5a" stroke="#7a5428" strokeWidth={3} />
          <path d={TORN} fill="url(#parch)" stroke="#8a6230" strokeWidth={3.5} strokeLinejoin="round" />
          <g clipPath="url(#torn)">
            {/* burnt, stained edges and old stains */}
            <path d={TORN} fill="none" stroke="#7a4e1e" strokeWidth={34} opacity={0.38} filter="url(#soft)" />
            <ellipse cx={560} cy={120} rx={190} ry={90} fill="url(#stain1)" /><ellipse cx={1180} cy={330} rx={220} ry={80} fill="url(#stain1)" /><ellipse cx={900} cy={60} rx={140} ry={50} fill="url(#stain1)" /><ellipse cx={420} cy={340} rx={120} ry={60} fill="url(#stain1)" />
            {/* the folds of the sheet */}
            <rect x={560} y={0} width={36} height={430} fill="#7a4e1e" opacity={0.06} /><rect x={1060} y={0} width={30} height={430} fill="#7a4e1e" opacity={0.07} />
            <path d="M578 20 V410 M1075 20 V410" stroke="#8a6230" strokeWidth={1.5} opacity={0.35} />
            {/* hairline cracks */}
            <path d="M330 120 l24 14 l-10 20 l22 18 M1330 90 l-26 18 l12 22 M1290 380 l-22 -16 l10 -20" stroke="#6a4420" strokeWidth={2.2} fill="none" opacity={0.5} strokeLinecap="round" />
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 292, top: 34, width: 1090, height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: CINZEL_DECO, fontWeight: 900, fontSize: 92, lineHeight: 1.06, textAlign: 'center', color: '#3a2210', letterSpacing: 1, whiteSpace: 'nowrap', textShadow: '0 2px 0 rgba(255,244,216,0.7)' }}>THE CHRONICLES<br />OF HISTORY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
            <div style={{ width: 120, height: 3, background: 'linear-gradient(90deg, transparent, #8a5a2a)' }} /><div style={{ width: 14, height: 14, background: '#a8442a', transform: 'rotate(45deg)' }} /><div style={{ width: 120, height: 3, background: 'linear-gradient(270deg, transparent, #8a5a2a)' }} />
          </div>
          <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontStyle: 'italic', fontSize: 48, color: '#5a3a1c', marginTop: 8, whiteSpace: 'nowrap' }}>True stories, drawn alive. A new one every day.</div>
        </div>
        <div style={{ position: 'absolute', left: -92, top: 4, width: 420, height: 420, filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.6))' }}><Seal id="bn" /></div>
      </div>
    </AbsoluteFill>
  );
};
