import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Costumed } from '../chronicle/art/costumes';
import { makeColors } from '../chronicle/art/palette';
import { PersonKind } from '../chronicle/art/vocab';
import { CINZEL_DECO, CORMORANT } from '../chronicle/fonts';
import { LOOKS } from '../chronicle/looks';

/** The brand of The Chronicles of History: a gold seal with a ring of twelve diamonds (the hours, the eras) around a gold C, on obsidian. Used for the avatar, the banner and the watermark. */
export const GOLD = { hi: '#FFF1BF', mid: '#F0C25E', lo: '#B9822A', deep: '#6B430A' };
export const OBSIDIAN = '#0A0710';
export const EMBER = '#FF7A55';
export const PARCHMENT = '#F4E6C8';

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={GOLD.hi} /><stop offset="0.45" stopColor={GOLD.mid} /><stop offset="1" stopColor={GOLD.lo} />
    </linearGradient>
    <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={GOLD.hi} /><stop offset="0.5" stopColor={GOLD.lo} /><stop offset="1" stopColor={GOLD.mid} />
    </linearGradient>
    <radialGradient id={`${id}-disc`} cx="50%" cy="42%" r="62%">
      <stop offset="0" stopColor="#2a1a2e" /><stop offset="0.7" stopColor="#120b16" /><stop offset="1" stopColor="#070409" />
    </radialGradient>
    <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
  </defs>
);

/** The seal itself, drawn in a 800 x 800 box. */
export const Seal: React.FC<{ id?: string; simple?: boolean }> = ({ id = 's', simple = false }) => {
  const diamonds = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%">
      <Defs id={id} />
      <circle cx={400} cy={400} r={392} fill={`url(#${id}-disc)`} />
      {/* rays behind the letter */}
      {!simple && Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2, b = a + 0.1;
        return <path key={i} d={`M400 400 L${400 + Math.cos(a) * 330} ${400 + Math.sin(a) * 330} L${400 + Math.cos(b) * 330} ${400 + Math.sin(b) * 330}Z`} fill={GOLD.mid} opacity={0.07} />;
      })}
      <circle cx={400} cy={400} r={380} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={18} />
      <circle cx={400} cy={400} r={346} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={5} />
      {!simple && diamonds.map((a, i) => (
        <path key={i} d={`M${400 + Math.cos(a) * 363} ${400 + Math.sin(a) * 363 - 14} l11 14 l-11 14 l-11 -14z`} transform={`rotate(${(a * 180) / Math.PI + 90} ${400 + Math.cos(a) * 363} ${400 + Math.sin(a) * 363})`} fill={`url(#${id}-gold)`} stroke={GOLD.deep} strokeWidth={2} />
      ))}
      <circle cx={400} cy={400} r={298} fill="none" stroke={GOLD.lo} strokeWidth={2.5} opacity={0.7} />
      <text x={400} y={536} textAnchor="middle" fontFamily={CINZEL_DECO} fontWeight={900} fontSize={440} fill={GOLD.deep} stroke={GOLD.deep} strokeWidth={14} strokeLinejoin="round" transform="translate(0 10)" opacity={0.9}>C</text>
      <text x={400} y={536} textAnchor="middle" fontFamily={CINZEL_DECO} fontWeight={900} fontSize={440} fill={`url(#${id}-gold)`} stroke="#2a1606" strokeWidth={6} strokeLinejoin="round" paintOrder="stroke fill" filter={simple ? undefined : `url(#${id}-glow)`}>C</text>
      {!simple && <path d="M330 590 H470" stroke={`url(#${id}-ring)`} strokeWidth={5} />}
      {!simple && <path d="M400 580 l12 12 l-12 12 l-12 -12z" fill={EMBER} />}
    </svg>
  );
};

export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '96%', height: '96%' }}><Seal id="av" /></div>
  </AbsoluteFill>
);

/** The seal alone on a transparent ground, for the YouTube video watermark. */
export const Watermark: React.FC = () => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '100%', height: '100%' }}><Seal id="wm" simple /></div></AbsoluteFill>
);

const LINEUP: { who: PersonKind; look: keyof typeof LOOKS }[] = [
  { who: 'caveman', look: 'prehistory' }, { who: 'pharaoh', look: 'antiquity' }, { who: 'legionary', look: 'antiquity' }, { who: 'viking', look: 'manuscript' }, { who: 'knight', look: 'manuscript' },
  { who: 'samurai', look: 'orient' }, { who: 'renaissance_artist', look: 'renaissance' }, { who: 'conquistador', look: 'seachart' }, { who: 'pirate', look: 'seachart' }, { who: 'redcoat', look: 'empire' },
  { who: 'miner', look: 'industrial' }, { who: 'cowboy', look: 'frontier' }, { who: 'ww2_soldier', look: 'wartime' }, { who: 'astronaut', look: 'spaceage' },
];

/** The YouTube channel art (2560 x 1440). Everything that matters sits in the 1546 x 423 box at the centre, which every device shows; the rest is the atmosphere: rays, and the eras walking by. */
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 90% at 50% 45%, #2b1a2e 0%, ${OBSIDIAN} 68%)` }}>
    <AbsoluteFill style={{ background: `repeating-conic-gradient(from 180deg at 50% 38%, ${GOLD.mid}1c 0deg 4deg, transparent 4deg 14deg)`, maskImage: 'radial-gradient(ellipse 60% 70% at 50% 40%, #000 0%, transparent 75%)' }} />
    {/* the eras, walking along the bottom edge */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: `linear-gradient(0deg, #05030a 0%, ${OBSIDIAN}00 100%)` }} />
    <svg viewBox="0 0 2560 1440" width={2560} height={1440} style={{ position: 'absolute', inset: 0 }}>
      <path d="M0 1362 H2560" stroke={GOLD.lo} strokeWidth={3} opacity={0.6} />
      {LINEUP.map((p, i) => {
        const c = makeColors(LOOKS[p.look], 'dusk');
        const x = 120 + i * (2320 / (LINEUP.length - 1));
        return <g key={i} transform={`translate(${x} 1360)`}><Costumed c={{ ...c, shadow: '#05030a' }} t={1.2 + i * 0.37} seed={0.21 + i * 0.13} who={p.who} scale={2.7} view={i % 2 ? 'side' : 'front'} /></g>;
      })}
    </svg>
    {/* the safe box */}
    <div style={{ position: 'absolute', left: 507, top: 508, width: 1546, height: 423, display: 'flex', alignItems: 'center', gap: 44 }}>
      <div style={{ width: 340, height: 340, flex: '0 0 auto', filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.7))' }}><Seal id="bn" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: CINZEL_DECO, fontWeight: 900, fontSize: 112, lineHeight: 1.0, letterSpacing: 3, color: GOLD.mid, textShadow: `0 3px 0 ${GOLD.hi}, 0 7px 0 ${GOLD.lo}, 0 11px 0 ${GOLD.deep}, 0 22px 30px rgba(0,0,0,0.85)` }}>THE CHRONICLES<br />OF HISTORY</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, background: EMBER, transform: 'rotate(45deg)' }} />
          <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 46, letterSpacing: 3, color: PARCHMENT }}>Real stories, drawn alive. A new one every day.</div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
