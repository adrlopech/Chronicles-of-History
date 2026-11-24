import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Costumed } from '../chronicle/art/costumes';
import { makeColors } from '../chronicle/art/palette';
import { PersonKind } from '../chronicle/art/vocab';
import { CINZEL_DECO, CORMORANT } from '../chronicle/fonts';
import { LOOKS } from '../chronicle/looks';

/** The brand of The Chronicles of History: a gold arch, the window into the past, with a traveller looking at a temple under a rising sun. Used for the avatar, the banner, the watermark and the outro. */
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

/** The mark: an ARCH, the window into the past. Inside it a traveller stands on a hill and looks at a temple under a rising sun. It is drawn in an 800 x 800 box. `simple` is the one-colour version for the watermark. */
export const Seal: React.FC<{ id?: string; simple?: boolean }> = ({ id = 's', simple = false }) => {
  const arch = 'M150 742 V382 A250 250 0 0 1 650 382 V742Z';
  const inner = 'M176 742 V382 A224 224 0 0 1 624 382 V742Z';
  if (simple) {
    return (
      <svg viewBox="0 0 800 800" width="100%" height="100%">
        <Defs id={id} />
        <path d={arch} fill="none" stroke={`url(#${id}-gold)`} strokeWidth={34} strokeLinejoin="round" />
        <circle cx={400} cy={560} r={96} fill={`url(#${id}-gold)`} />
        <path d="M176 650 Q400 612 624 650" stroke={`url(#${id}-gold)`} strokeWidth={30} fill="none" />
      </svg>
    );
  }
  const stars = [[300, 190, 5], [470, 150, 4], [520, 250, 3], [250, 300, 3], [400, 230, 4]];
  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#241347" /><stop offset="0.45" stopColor="#b8347f" /><stop offset="0.8" stopColor="#ff8a4a" /><stop offset="1" stopColor="#ffc26a" /></linearGradient>
        <clipPath id={`${id}-clip`}><path d={inner} /></clipPath>
      </defs>
      <g transform="translate(400 400) scale(0.9) translate(-400 -400)" filter={`url(#${id}-glow)`}>
        <path d={arch} fill={`url(#${id}-ring)`} />
        <path d={inner} fill={`url(#${id}-sky)`} />
        <g clipPath={`url(#${id}-clip)`}>
          {stars.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff6d8" opacity={0.85} />)}
          <circle cx={400} cy={560} r={196} fill="#ffe2a0" opacity={0.16} />
          <circle cx={400} cy={560} r={132} fill="#ffe9b4" opacity={0.28} />
          <circle cx={400} cy={560} r={98} fill="#fff1c8" />
          {/* the temple, far away */}
          <g fill="#2a1233" opacity={0.92}>
            <path d="M470 626 H624 V644 H470Z" />
            {[486, 514, 542, 570, 598].map((x) => <rect key={x} x={x - 5} y={570} width={10} height={58} />)}
            <path d="M462 574 L547 536 L632 574Z" />
          </g>
          {/* hills and the road */}
          <path d="M176 742 V664 Q300 618 430 640 Q540 654 624 626 V742Z" fill="#150a1c" />
          <path d="M310 742 Q380 700 440 664 Q470 650 500 646" stroke="#ffcf8a" strokeWidth={14} fill="none" opacity={0.5} strokeLinecap="round" />
          {/* the traveller, seen from behind, a staff in hand */}
          <g transform="translate(300 690)" fill="#0b0511" stroke="#0b0511">
            <circle cx={0} cy={-128} r={17} stroke="none" />
            <path d="M-18 -108 Q0 -120 18 -108 L30 -18 L-30 -18Z" stroke="none" />
            <path d="M-14 -18 L-18 28 M14 -18 L20 28" strokeWidth={13} strokeLinecap="round" fill="none" />
            <path d="M24 -100 L70 -140 M70 -150 V30" strokeWidth={6} strokeLinecap="round" fill="none" />
          </g>
        </g>
        <path d={inner} fill="none" stroke={GOLD.deep} strokeWidth={4} opacity={0.7} />
        <path d="M110 756 H690" stroke={`url(#${id}-ring)`} strokeWidth={26} strokeLinecap="round" />
        {/* keystone */}
        <path d="M370 142 L430 142 L418 98 L382 98Z" fill={`url(#${id}-gold)`} stroke={GOLD.deep} strokeWidth={3} />
        <path d="M400 62 l12 14 l-12 14 l-12 -14z" fill={EMBER} />
      </g>
    </svg>
  );
};

export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '96%', height: '96%', transform: 'scale(1.08) translateY(-3%)' }}><Seal id="av" /></div>
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
      <div style={{ width: 400, height: 400, flex: '0 0 auto', filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.7))' }}><Seal id="bn" /></div>
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
