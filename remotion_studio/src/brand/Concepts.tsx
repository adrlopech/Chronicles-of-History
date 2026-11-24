import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CINZEL_DECO, CORMORANT } from '../chronicle/fonts';
import { EMBER, GOLD, OBSIDIAN, PARCHMENT } from './Brand';

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GOLD.hi} /><stop offset="0.5" stopColor={GOLD.mid} /><stop offset="1" stopColor={GOLD.lo} /></linearGradient>
    <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1650" /><stop offset="0.5" stopColor="#c4388c" /><stop offset="1" stopColor="#ff9a4a" /></linearGradient>
    <radialGradient id={`${id}wax`} cx="38%" cy="32%" r="80%"><stop offset="0" stopColor="#c23a3a" /><stop offset="0.55" stopColor="#8e1f26" /><stop offset="1" stopColor="#4d0f17" /></radialGradient>
    <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.55" /></filter>
  </defs>
);

/** Concept A: an Ionic volute, the scroll of a Greek column capital, which is also a C. */
export const ConceptVolute: React.FC = () => {
  const pts: string[] = [];
  const cx = 400, cy = 372;
  for (let i = 0; i <= 260; i++) {
    const a = (i / 260) * Math.PI * 2 * 2.35 + 0.4;
    const r = 34 + (i / 260) * 205;
    pts.push(`${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`);
  }
  const d = 'M' + pts.join(' L');
  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%">
      <Defs id="a" />
      <rect width={800} height={800} fill={OBSIDIAN} />
      <rect x={30} y={30} width={740} height={740} rx={90} fill="none" stroke={`url(#ag)`} strokeWidth={10} />
      <g filter="url(#ash)">
        <path d={d} fill="none" stroke={`url(#ag)`} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={cx} cy={cy} r={20} fill={OBSIDIAN} stroke={`url(#ag)`} strokeWidth={8} />
        <rect x={150} y={140} width={500} height={34} rx={6} fill="url(#ag)" />
        <rect x={190} y={174} width={420} height={16} fill={GOLD.lo} />
        <rect x={250} y={640} width={300} height={38} rx={6} fill="url(#ag)" />
        {[320, 400, 480].map((x) => <rect key={x} x={x - 14} y={560} width={28} height={80} fill="url(#ag)" opacity={0.9} />)}
      </g>
      <path d="M400 720 l14 14 l-14 14 l-14 -14z" fill={EMBER} />
    </svg>
  );
};

/** Concept B: an arch, a window into history: the sun rising over a temple, and a traveller walking toward it. */
export const ConceptArch: React.FC = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Defs id="b" />
    <rect width={800} height={800} fill={OBSIDIAN} />
    <g filter="url(#bsh)">
      <path d="M150 740 V380 A250 250 0 0 1 650 380 V740Z" fill="url(#bsky)" />
      <clipPath id="bclip"><path d="M150 740 V380 A250 250 0 0 1 650 380 V740Z" /></clipPath>
      <g clipPath="url(#bclip)">
        <circle cx={400} cy={560} r={118} fill="#ffe2a0" opacity={0.95} />
        <circle cx={400} cy={560} r={170} fill="#ffe2a0" opacity={0.18} />
        {/* temple */}
        <path d="M250 640 H550 V660 H250Z M270 640 V560 M310 640 V560 M350 640 V560 M450 640 V560 M490 640 V560 M530 640 V560" stroke="#1b0f1f" strokeWidth={14} />
        <path d="M244 566 L400 506 L556 566Z" fill="#1b0f1f" />
        <path d="M150 740 V650 Q400 612 650 650 V740Z" fill="#0b0610" />
        {/* the traveller */}
        <g transform="translate(330 668)" fill="#0b0610"><circle cx={0} cy={-62} r={11} /><path d="M-11 -50 L11 -50 L15 -12 L-15 -12Z" /><path d="M-9 -12 L-14 18 M9 -12 L16 18" stroke="#0b0610" strokeWidth={9} strokeLinecap="round" /><path d="M14 -46 L40 -78" stroke="#0b0610" strokeWidth={5} /></g>
      </g>
      <path d="M150 740 V380 A250 250 0 0 1 650 380 V740Z" fill="none" stroke="url(#bg)" strokeWidth={22} />
      <path d="M118 760 H682" stroke="url(#bg)" strokeWidth={22} strokeLinecap="round" />
      <path d="M400 118 l34 -26 v-30 h-68 v30z" fill="url(#bg)" transform="translate(0 40)" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${400 + Math.cos(Math.PI * (1.12 + i * 0.19)) * 290} ${380 + Math.sin(Math.PI * (1.12 + i * 0.19)) * 290} l9 12 l-9 12 l-9 -12z`} fill="url(#bg)" />)}
    </g>
  </svg>
);

/** Concept C: a wax seal in deep red with the CH monogram, the seal of a chronicle. */
export const ConceptWax: React.FC = () => {
  const n = 18;
  const edge = Array.from({ length: n * 4 }, (_, i) => {
    const a = (i / (n * 4)) * Math.PI * 2;
    const r = 335 + Math.sin(a * n) * 14 + Math.sin(a * 5 + 1) * 10;
    return `${400 + Math.cos(a) * r} ${410 + Math.sin(a) * r}`;
  });
  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%">
      <Defs id="c" />
      <rect width={800} height={800} fill={OBSIDIAN} />
      <g filter="url(#csh)">
        <path d={'M' + edge.join(' L') + 'Z'} fill="url(#cwax)" />
        <circle cx={400} cy={410} r={268} fill="none" stroke="#3a0a10" strokeWidth={10} opacity={0.7} />
        <circle cx={400} cy={410} r={262} fill="none" stroke="#e05a5a" strokeWidth={3} opacity={0.5} />
        <circle cx={400} cy={410} r={244} fill="#7d1a22" opacity={0.55} />
        <text x={400} y={470} textAnchor="middle" fontFamily={CINZEL_DECO} fontWeight={900} fontSize={300} fill="#2a0408" opacity={0.85} transform="translate(5 8)">CH</text>
        <text x={400} y={470} textAnchor="middle" fontFamily={CINZEL_DECO} fontWeight={900} fontSize={300} fill="url(#cg)" stroke="#5a1018" strokeWidth={3} paintOrder="stroke fill">CH</text>
        <path d="M290 540 H510" stroke="url(#cg)" strokeWidth={5} />
        <path d="M400 530 l10 10 l-10 10 l-10 -10z" fill={PARCHMENT} />
        {Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return <circle key={i} cx={400 + Math.cos(a) * 292} cy={410 + Math.sin(a) * 292} r={5} fill="#d6a05a" opacity={0.75} />; })}
      </g>
    </svg>
  );
};

export const ConceptSheet: React.FC = () => (
  <AbsoluteFill style={{ background: '#05030a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 40 }}>
    {[['A  ·  Ionic volute', <ConceptVolute key="a" />], ['B  ·  Arch to the past', <ConceptArch key="b" />], ['C  ·  Wax seal CH', <ConceptWax key="c" />]].map(([name, node], i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 640, height: 640, borderRadius: '50%', overflow: 'hidden' }}>{node}</div>
        <div style={{ width: 150, height: 150, borderRadius: '50%', overflow: 'hidden' }}>{node}</div>
        <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 40, color: PARCHMENT }}>{name}</div>
      </div>
    ))}
  </AbsoluteFill>
);
