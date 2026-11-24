import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Costumed } from '../chronicle/art/costumes';
import { makeColors } from '../chronicle/art/palette';
import { PersonKind } from '../chronicle/art/vocab';
import { CINZEL_DECO, CORMORANT } from '../chronicle/fonts';
import { LOOKS } from '../chronicle/looks';

/** The brand of The Chronicles of History: an open book of chronicles with a gold sun rising behind it. Used for the avatar, the banner, the watermark and the outro. */
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

/** The mark: an open BOOK OF CHRONICLES. A gold sun rises behind it; on the left page an illuminated gold C opens the first line, on the right page a little window shows the story coming alive
 *  (a traveller walking toward a temple under the same sun); a red ribbon marks the page. Drawn in an 800 x 800 box. `simple` is the one-colour version for the watermark. */
export const Seal: React.FC<{ id?: string; simple?: boolean }> = ({ id = 's', simple = false }) => {
  const rays = Array.from({ length: 19 }, (_, i) => {
    const ang = Math.PI * (1.04 + (i / 18) * 0.92);
    return { a: ang, b: ang + 0.045 };
  });
  if (simple) {
    return (
      <svg viewBox="0 0 800 800" width="100%" height="100%">
        <Defs id={id} />
        <circle cx={400} cy={330} r={120} fill={`url(#${id}-gold)`} />
        <path d="M70 330 Q240 300 400 366 Q560 300 730 330 V610 Q560 570 400 640 Q240 570 70 610Z" fill="none" stroke={`url(#${id}-gold)`} strokeWidth={36} strokeLinejoin="round" />
        <path d="M400 366 V640" stroke={`url(#${id}-gold)`} strokeWidth={26} />
      </svg>
    );
  }
  const left = 'M92 318 Q250 296 400 366 V588 Q250 514 92 540Z';
  const right = 'M708 318 Q550 296 400 366 V588 Q550 514 708 540Z';
  return (
    <svg viewBox="0 0 800 800" width="100%" height="100%">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-page`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f6e9c8" /><stop offset="0.85" stopColor="#ead7a8" /><stop offset="1" stopColor="#cfb682" /></linearGradient>
        <linearGradient id={`${id}-pageR`} x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#f6e9c8" /><stop offset="0.85" stopColor="#ead7a8" /><stop offset="1" stopColor="#cfb682" /></linearGradient>
        <linearGradient id={`${id}-leather`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a02a30" /><stop offset="1" stopColor="#4e0f18" /></linearGradient>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1650" /><stop offset="0.55" stopColor="#c4388c" /><stop offset="1" stopColor="#ff9a4a" /></linearGradient>
        <clipPath id={`${id}-win`}><path d="M470 520 V420 A80 80 0 0 1 630 420 V520Z" /></clipPath>
      </defs>
      <g transform="translate(0 34)">
      {/* the sun and its rays rise behind the book */}
      {rays.map((r, i) => <path key={i} d={`M400 340 L${400 + Math.cos(r.a) * 345} ${340 + Math.sin(r.a) * 345} L${400 + Math.cos(r.b) * 345} ${340 + Math.sin(r.b) * 345}Z`} fill={GOLD.mid} opacity={i % 2 ? 0.2 : 0.34} />)}
      <circle cx={400} cy={340} r={190} fill={GOLD.mid} opacity={0.14} />
      <circle cx={400} cy={338} r={122} fill={`url(#${id}-gold)`} filter={`url(#${id}-glow)`} />
      {/* the cover, with its gold edge */}
      <path d="M62 300 Q250 268 400 340 Q550 268 738 300 V566 Q550 528 400 604 Q250 528 62 566Z" fill={`url(#${id}-leather)`} stroke={`url(#${id}-ring)`} strokeWidth={9} strokeLinejoin="round" />
      <path d="M76 314 Q250 284 400 354 Q550 284 724 314 V552 Q550 514 400 590 Q250 514 76 552Z" fill="none" stroke={GOLD.mid} strokeWidth={2.5} opacity={0.6} />
      {/* the pages: a stack of edges under the two leaves */}
      {[24, 16, 8].map((dy, i) => (
        <g key={i} transform={`translate(0 ${dy})`} opacity={0.5 + i * 0.15}>
          <path d={left} fill="#cdb581" /><path d={right} fill="#cdb581" />
        </g>
      ))}
      <path d={left} fill={`url(#${id}-page)`} stroke="#9a7c46" strokeWidth={3} strokeLinejoin="round" />
      <path d={right} fill={`url(#${id}-pageR)`} stroke="#9a7c46" strokeWidth={3} strokeLinejoin="round" />
      <path d="M400 366 V588" stroke="#8a6c3c" strokeWidth={5} />
      {/* left page: an illuminated initial and lines of script */}
      <text x={126} y={430} fontFamily={CINZEL_DECO} fontWeight={900} fontSize={118} fill={`url(#${id}-gold)`} stroke="#5a3a0a" strokeWidth={2.4} paintOrder="stroke fill">C</text>
      {[[212, 372, 372], [212, 396, 372], [212, 420, 372]].map(([x, y, w], i) => <path key={i} d={`M${x} ${y + 2} Q${x + (w - x) / 2} ${y - 4} ${w} ${y + 4}`} stroke="#4a3418" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.75} />)}
      {[452, 482, 512].map((y, i) => <path key={y} d={`M126 ${y} Q250 ${y - 8 + i * 3} ${i === 2 ? 300 : 376} ${y + 8 + i * 2}`} stroke="#4a3418" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />)}
      {/* right page: a window onto the story */}
      <path d="M470 520 V420 A80 80 0 0 1 630 420 V520Z" fill={`url(#${id}-sky)`} />
      <g clipPath={`url(#${id}-win)`}>
        <circle cx={550} cy={474} r={34} fill="#fff1c8" /><circle cx={550} cy={474} r={52} fill="#ffe2a0" opacity={0.3} />
        <g fill="#2a1233" opacity={0.9}><path d="M574 492 H632 V499 H574Z" />{[580, 592, 604, 616, 626].map((x) => <rect key={x} x={x - 2.5} y={471} width={5} height={23} />)}<path d="M571 473 L603 458 L635 473Z" /></g>
        <path d="M470 520 V496 Q520 484 560 494 Q600 502 630 490 V520Z" fill="#150a1c" />
        <g transform="translate(510 500)" fill="#0b0511" stroke="#0b0511"><circle cx={0} cy={-34} r={6.5} stroke="none" /><path d="M-6 -27 Q0 -31 6 -27 L10 -6 L-10 -6Z" stroke="none" /><path d="M-5 -6 L-6 8 M5 -6 L8 8 M9 -22 L24 -36 M26 -38 V10" strokeWidth={3.4} strokeLinecap="round" fill="none" /></g>
      </g>
      <path d="M470 520 V420 A80 80 0 0 1 630 420 V520Z" fill="none" stroke={`url(#${id}-ring)`} strokeWidth={6} />
      {[[480, 540, 600], [480, 560, 566]].map(([x, y, w], i) => <path key={i} d={`M${x} ${y} Q${(x + w) / 2} ${y - 5} ${w} ${y + 2}`} stroke="#4a3418" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />)}
      {/* the ribbon */}
      <path d="M398 580 H438 V668 L418 650 L398 668Z" fill={EMBER} stroke="#8a2a1a" strokeWidth={3} transform="translate(0 6)" />
      </g>
    </svg>
  );
};

export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: OBSIDIAN, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '96%', height: '96%', transform: 'scale(1.0)' }}><Seal id="av" /></div>
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
