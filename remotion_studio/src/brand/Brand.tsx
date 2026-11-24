import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Engraving } from '../chronicle/icons';
import { PLAYFAIR, PLAYFAIR_ITALIC, SPACE } from '../chronicle/fonts';
import { IconName } from '../chronicle/types';

/**
 * The brand of The Chronicles of History, in the spirit of the sister channel's: a bold, cut monogram that glows, on a deep gradient with sparkles and a fine grid, glass tiles around it,
 * a two-tone wordmark (white roman + gold italic) and a monospaced tagline. The monogram is CH: two heavy chamfered letters, slanted, gold, sliced twice like a blade through parchment.
 */
export const GOLD = { hi: '#FFF1BF', mid: '#F0C25E', lo: '#B9822A', deep: '#6B430A' };
export const OBSIDIAN = '#0A0710';
/** The dusk of the videos: the sky colours the pictures use at the end of the day. */
export const DUSK = { top: '#2A1260', mid: '#C4388C', low: '#FF8A55' };
export const EMBER = '#FF7A55';
export const PARCHMENT = '#F4E6C8';

const C_PATH = 'M50 0 H215 V72 H125 L100 95 V205 L125 228 H215 V300 H50 L0 250 V50Z';
const H_PATH = 'M250 0 H325 V118 H405 V0 H480 V300 H405 V182 H325 V300 H250Z';

/** The monogram alone, transparent ground, in an 800 x 800 box. `simple` is the flat one-colour version. */
export const Seal: React.FC<{ id?: string; simple?: boolean }> = ({ id = 's', simple = false }) => (
  <svg viewBox="0 0 800 800" width="100%" height="100%" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor={GOLD.hi} /><stop offset="0.3" stopColor={GOLD.mid} /><stop offset="0.62" stopColor={DUSK.low} /><stop offset="1" stopColor="#D2457A" />
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="0"><stop offset="0.7" stopColor="#ffffff" stopOpacity="0" /><stop offset="1" stopColor="#ffffff" stopOpacity="0.55" /></linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.32" /><stop offset="0.45" stopColor="#fff" stopOpacity="0.04" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <clipPath id={`${id}-clip`}><path d={C_PATH} /><path d={H_PATH} /></clipPath>
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={simple ? 0 : 16} result="b" />
        <feColorMatrix in="b" type="matrix" values="1 0 0 0 0.35  0 1 0 0 0.2  0 0 1 0 0  0 0 0 1.1 0" result="c" />
        <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g transform="translate(400 400) scale(1.22) skewX(-10) translate(-240 -150)" filter={`url(#${id}-glow)`}>
      <g transform="translate(7 9)" fill="#4a0f2a" opacity={simple ? 0 : 0.9}><path d={C_PATH} /><path d={H_PATH} /></g>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={-20} y={-20} width={540} height={340} fill={`url(#${id}-g)`} />
        {!simple && <rect x={-20} y={-20} width={540} height={340} fill={`url(#${id}-gloss)`} />}
        {!simple && <rect x={-20} y={-20} width={540} height={340} fill={`url(#${id}-edge)`} />}
        {/* the cuts widen toward the bottom, like the stripes of a setting sun */}
        <path d="M-30 166 L520 150" stroke="#14091c" strokeWidth={5} />
        <path d="M-30 199 L520 183" stroke="#14091c" strokeWidth={9} />
        <path d="M-30 238 L520 222" stroke="#14091c" strokeWidth={14} />
      </g>
    </g>
  </svg>
);

/** A four-point sparkle. */
const sparkle = (x: number, y: number, r: number) => `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`;

/** The ground of the brand: a deep gradient (indigo to obsidian to amber), a fine grid and gold and cream sparkles. */
export const Cosmos: React.FC<{ w: number; h: number; wide?: boolean }> = ({ w, h, wide }) => {
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const n = wide ? 46 : 22;
  return (
    <AbsoluteFill style={{ background: wide ? 'linear-gradient(100deg, #2a1038 0%, #170a22 30%, #0a0710 60%, #2a1208 100%)' : 'linear-gradient(135deg, #2e1140 0%, #0f0818 55%, #3a1608 100%)' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 45% at 50% 112%, rgba(255,122,85,0.38) 0%, rgba(196,56,140,0.14) 45%, transparent 75%)' }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: `${wide ? 64 : 50}px ${wide ? 64 : 50}px` }} />
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: n }, (_, i) => {
          const x = rnd() * w, y = rnd() * h, r = (wide ? 9 : 7) + rnd() * (wide ? 26 : 22);
          const gold = rnd() > 0.55;
          return <path key={i} d={sparkle(x, y, r)} fill={gold ? GOLD.mid : '#FFE9D2'} opacity={0.25 + rnd() * 0.55} />;
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
    <div style={{ position: 'absolute', left: 1250, top: 120, width: 1500, height: 1250, opacity: 0.07, transform: 'rotate(-6deg)' }}><Seal id="ghost" simple /></div>
    <div style={{ position: 'absolute', left: 300, top: 230, fontFamily: SPACE, fontWeight: 500, fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.45)' }}>CH // 01  HISTORY · MYSTERY · TURNING POINTS</div>
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
        <div style={{ marginTop: 14, fontFamily: SPACE, fontWeight: 500, fontSize: 34, letterSpacing: 8, color: 'rgba(255,244,216,0.66)' }}>TRUE STORIES / DRAWN ALIVE / ONE EVERY DAY</div>
      </div>
    </div>
  </AbsoluteFill>
);
