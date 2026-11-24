import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Engraving } from '../chronicle/icons';
import { PLAYFAIR, PLAYFAIR_ITALIC, SPACE } from '../chronicle/fonts';
import { IconName } from '../chronicle/types';

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

const TILES: { x: number; y: number; r: number; icon: IconName; o: number; s: number }[] = [
  { x: 120, y: 390, r: -9, icon: 'column', o: 1, s: 215 }, { x: 360, y: 700, r: 7, icon: 'scroll', o: 0.85, s: 190 }, { x: 150, y: 1010, r: -5, icon: 'ship', o: 0.6, s: 175 },
  { x: 640, y: 120, r: 8, icon: 'hourglass', o: 0.55, s: 170 }, { x: 1560, y: 150, r: -7, icon: 'compass', o: 0.5, s: 170 },
  { x: 2330, y: 360, r: 8, icon: 'sword', o: 1, s: 230 }, { x: 2140, y: 740, r: -6, icon: 'castle', o: 0.8, s: 190 }, { x: 2380, y: 1020, r: 6, icon: 'pyramid', o: 0.6, s: 180 },
  { x: 1750, y: 1120, r: -8, icon: 'quill', o: 0.5, s: 165 },
];

/** The YouTube channel art (2560 x 1440). Title, monogram and tagline sit in the 1546 x 423 box every device shows; the glass tiles are the atmosphere. */
export const Banner: React.FC = () => (
  <AbsoluteFill>
    <Cosmos w={2560} h={1440} wide />
    <div style={{ position: 'absolute', left: 300, top: 230, fontFamily: SPACE, fontWeight: 500, fontSize: 30, letterSpacing: 6, color: 'rgba(244,226,190,0.5)' }}>THE CHRONICLER  ·  HISTORY · MYSTERY · TURNING POINTS</div>
    {TILES.map((t, i) => (
      <div key={i} style={{ position: 'absolute', left: t.x - t.s / 2, top: t.y - t.s / 2, width: t.s, height: t.s, transform: `rotate(${t.r}deg)`, opacity: t.o, borderRadius: t.s * 0.24, background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))', border: `2px solid ${DUSK.low}66`, boxShadow: `0 18px 40px rgba(0,0,0,0.5), inset 0 0 40px ${DUSK.low}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ filter: `drop-shadow(0 0 14px ${DUSK.low}cc)` }}><Engraving name={t.icon} size={t.s * 0.56} color={GOLD.hi} accent={DUSK.low} at={0} len={1} thick={4.6} /></div>
      </div>
    ))}
    {/* the safe box */}
    <div style={{ position: 'absolute', left: 507, top: 508, width: 1546, height: 423, display: 'flex', alignItems: 'center', gap: 30 }}>
      <div style={{ width: 390, height: 390, flex: '0 0 auto', marginLeft: -20 }}><Seal id="bn" /></div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.98 }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 138, color: '#FFF4D8', letterSpacing: -2 }}>The Chronicles</span>
          <span style={{ fontFamily: PLAYFAIR_ITALIC, fontWeight: 700, fontSize: 138, color: GOLD.mid, textShadow: `0 0 34px ${DUSK.low}77`, marginTop: -4 }}>of History</span>
        </div>
        <div style={{ marginTop: 22, width: 150, height: 5, background: `linear-gradient(90deg, ${DUSK.low}, ${DUSK.mid})` }} />
        <div style={{ marginTop: 14, fontFamily: SPACE, fontWeight: 500, fontSize: 34, letterSpacing: 8, color: 'rgba(244,226,190,0.68)' }}>TRUE STORIES / DRAWN ALIVE / ONE EVERY DAY</div>
      </div>
    </div>
  </AbsoluteFill>
);
