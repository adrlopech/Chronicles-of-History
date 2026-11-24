import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { Look } from './looks';
import { rng, hash } from './ink';
import { HEIGHT, WIDTH } from './types';

/** The sheet everything is printed on: paper with grain and fibres, stains, burnt edges, a ruled frame and drifting dust. Only the sheet moves (slow camera); text never does. */
const Frame: React.FC<{ look: Look }> = ({ look }) => {
  const c = look.accent2;
  const sq = (x: number, y: number) => <rect key={`${x}${y}`} x={x - 8} y={y - 8} width={16} height={16} transform={`rotate(45 ${x} ${y})`} fill={look.paper} stroke={c} strokeWidth={2.5} />;
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: 'absolute', inset: 0, opacity: 0.8 }}>
      {look.frame === 'double' && (
        <>
          <rect x={40} y={40} width={WIDTH - 80} height={HEIGHT - 80} fill="none" stroke={c} strokeWidth={5} />
          <rect x={56} y={56} width={WIDTH - 112} height={HEIGHT - 112} fill="none" stroke={c} strokeWidth={1.4} />
          {[[40, 40], [WIDTH - 40, 40], [40, HEIGHT - 40], [WIDTH - 40, HEIGHT - 40]].map(([x, y]) => sq(x, y))}
        </>
      )}
      {look.frame === 'single' && (
        <>
          <rect x={46} y={46} width={WIDTH - 92} height={HEIGHT - 92} fill="none" stroke={c} strokeWidth={2.4} />
          <rect x={46} y={46} width={WIDTH - 92} height={HEIGHT - 92} fill="none" stroke={c} strokeWidth={9} strokeOpacity={0.18} />
        </>
      )}
      {look.frame === 'corners' && (
        <>
          {[[1, 1], [-1, 1], [1, -1], [-1, -1]].map(([sx, sy]) => {
            const x = sx > 0 ? 48 : WIDTH - 48;
            const y = sy > 0 ? 48 : HEIGHT - 48;
            return <path key={`${sx}${sy}`} d={`M${x} ${y + sy * 150} V${y} H${x + sx * 150} M${x + sx * 22} ${y + sy * 120} V${y + sy * 22} H${x + sx * 120}`} fill="none" stroke={c} strokeWidth={3} />;
          })}
          {[[48, 48], [WIDTH - 48, 48], [48, HEIGHT - 48], [WIDTH - 48, HEIGHT - 48]].map(([x, y]) => sq(x, y))}
        </>
      )}
    </svg>
  );
};

const Dust: React.FC<{ look: Look; frame: number }> = ({ look, frame }) => {
  const specks = useMemo(() => {
    const r = rng(hash(look.name) + 11);
    return Array.from({ length: 22 }, () => ({ x: r() * WIDTH, y: r() * HEIGHT, s: 1.5 + r() * 3, v: 0.25 + r() * 0.7, o: 0.15 + r() * 0.3, w: r() * 6 }));
  }, [look.name]);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: 'absolute', inset: 0 }}>
      {specks.map((d, i) => {
        const y = (((d.y - frame * d.v) % HEIGHT) + HEIGHT) % HEIGHT;
        const x = d.x + Math.sin(frame / 40 + d.w) * 14;
        return <circle key={i} cx={x} cy={y} r={d.s} fill={look.dark ? '#FFE9B8' : look.ink} opacity={d.o * (look.dark ? 0.7 : 0.45)} />;
      })}
    </svg>
  );
};

export const Backdrop: React.FC<{ look: Look; frame: number; total: number }> = ({ look, frame, total }) => {
  const p = frame / Math.max(1, total);
  const stains = useMemo(() => {
    const r = rng(hash(look.name) + 3);
    return Array.from({ length: 8 }, () => ({ x: r() * 100, y: r() * 100, s: 260 + r() * 420, o: 0.07 + r() * 0.12 }));
  }, [look.name]);
  const stain = look.dark ? '255,230,170' : '92,56,22';
  const grainRgb = look.dark ? '0.85 0.75 0.55' : '0.30 0.20 0.08';
  const flick = 0.92 + 0.08 * Math.sin(frame * 1.9);
  const [r1, g1, b1] = grainRgb.split(' ');
  return (
    <AbsoluteFill style={{ background: look.paper2 }}>
      <AbsoluteFill style={{ transform: `scale(${1.02 + 0.05 * p}) rotate(${(p - 0.5) * 0.7}deg)` }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 88% 72% at 50% 44%, ${look.paper} 0%, ${look.paper2} 100%)` }} />
        {stains.map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s * 0.8, marginLeft: -s.s / 2, marginTop: -s.s * 0.4, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(${stain},${s.o}), transparent)` }} />
        ))}
        <svg width={WIDTH / 2} height={HEIGHT / 2} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: 'scale(2)', mixBlendMode: look.dark ? 'screen' : 'multiply', opacity: look.grain * flick }}>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={4} stitchTiles="stitch" />
            <feColorMatrix values={`0 0 0 0 ${r1}  0 0 0 0 ${g1}  0 0 0 0 ${b1}  0 0 0 1.1 -0.12`} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        <svg width={WIDTH / 2} height={HEIGHT / 2} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: 'scale(2)', mixBlendMode: look.dark ? 'screen' : 'multiply', opacity: look.grain * 0.2 }}>
          <filter id="fibre" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed={9} />
            <feColorMatrix values={`0 0 0 0 ${r1}  0 0 0 0 ${g1}  0 0 0 0 ${b1}  0 0 0 1.4 -0.35`} />
          </filter>
          <rect width="100%" height="100%" filter="url(#fibre)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: look.dark ? 'inset 0 0 300px 40px rgba(0,0,0,0.75)' : 'inset 0 0 260px 30px rgba(70,38,10,0.55)' }} />
      <Frame look={look} />
      <Dust look={look} frame={frame} />
    </AbsoluteFill>
  );
};

/** The background behind scenes that have no picture of their own: a deep gradient in the era's colours with slow drifting light. */
export const ModernBackdrop: React.FC<{ look: Look; frame: number }> = ({ look, frame }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 80% at 50% 20%, ${look.accent2}55 0%, transparent 60%), linear-gradient(180deg, #0f1b3d 0%, #0b1226 55%, #050814 100%)` }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: 'absolute', left: `${20 + i * 30 + Math.sin(frame / 90 + i) * 6}%`, top: `${25 + i * 18 + Math.cos(frame / 110 + i) * 5}%`, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(closest-side, ${i % 2 ? look.accent : look.accent2}33, transparent)`, transform: 'translate(-50%, -50%)' }} />
    ))}
  </AbsoluteFill>
);
