import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { Look, useLook } from './looks';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** Seeded random numbers: the same title always draws the same stains, coastlines and seals. */
export const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** A closed curve through the points (Catmull-Rom turned into cubic curves): coastlines and wax. */
export const smoothClosed = (p: [number, number][]): string => {
  const n = p.length;
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
};

export const ROMAN = (n: number): string => {
  const t: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let v = Math.max(1, Math.round(n));
  for (const [x, s] of t) while (v >= x) { out += s; v -= x; }
  return out;
};

/** The largest size (at most `size`) at which `text` fits `width` px in `maxLines` lines; `k` is the glyph width as a fraction of the size. */
/** The on-screen words stay small so the story the drawings tell is what the eye follows: every size is scaled by this factor. */
export const TEXT_SCALE = 0.72;

export const fit = (text: string, size: number, width: number, maxLines: number, k: number, min = 36): number => {
  const words = text.split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));
  let s = Math.min(size, width / (longest * k));
  for (let i = 0; i < 40 && s > min; i++) {
    const cpl = Math.max(1, Math.floor(width / (s * k)));
    let lines = 1;
    let cur = 0;
    for (const w of words) {
      const l = w.length + (cur ? 1 : 0);
      if (cur + l > cpl) { lines++; cur = w.length; } else cur += l;
    }
    if (lines <= maxLines) break;
    s *= 0.93;
  }
  return Math.round(Math.max(min, s) * TEXT_SCALE);
};
export const lines = (text: string, size: number, width: number, k: number): number => {
  const cpl = Math.max(1, Math.floor(width / (size * k)));
  let n = 1;
  let cur = 0;
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const l = w.length + (cur ? 1 : 0);
    if (cur + l > cpl) { n++; cur = w.length; } else cur += l;
  }
  return n;
};

/** Words that soak into the page like ink: each fades and sharpens in turn. */
export const InkWords: React.FC<{
  text: string; size: number; color: string; font: string; weight?: number; delay?: number; stagger?: number; align?: 'left' | 'center'; caps?: boolean; ls?: number; lh?: number; style?: React.CSSProperties;
}> = ({ text, size, color, font, weight = 700, delay = 0, stagger = 3, align = 'center', caps = false, ls = 0, lh = 1.08, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: lh, color, textAlign: align, textTransform: caps ? 'uppercase' : 'none', letterSpacing: ls, width: '100%', ...style }}>
      {words.map((w, i) => {
        const p = interpolate(frame, [delay + i * stagger, delay + i * stagger + 11], [0, 1], { ...clamp, easing: EASE_OUT });
        return (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', opacity: p, filter: `blur(${(1 - p) * 9}px)`, transform: `translateY(${(1 - p) * 16}px)` }}>{w}</span>
        );
      })}
    </div>
  );
};

/** A hand-drawn stroke that draws itself from `at` over `len` frames. */
export const Underline: React.FC<{ width: number; at: number; len?: number; color: string; thick?: number; double?: boolean }> = ({ width, at, len = 16, color, thick = 6, double = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: EASE_OUT });
  const w = Math.max(40, width);
  const d1 = `M4 12 Q ${w * 0.18} 4 ${w * 0.38} 11 T ${w * 0.78} 10 T ${w - 4} 9`;
  const d2 = `M10 22 Q ${w * 0.3} 17 ${w * 0.55} 21 T ${w - 14} 20`;
  return (
    <svg width={w} height={28} viewBox={`0 0 ${w} 28`} style={{ display: 'block', overflow: 'visible' }}>
      <path d={d1} pathLength={1} fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - p} />
      {double && <path d={d2} pathLength={1} fill="none" stroke={color} strokeWidth={thick * 0.55} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - interpolate(p, [0.4, 1], [0, 1], clamp)} />}
    </svg>
  );
};

/** A rule with a diamond in the middle, drawn from the centre outwards. */
export const Ornament: React.FC<{ width?: number; at?: number; color?: string; gap?: number }> = ({ width = 520, at = 0, color, gap = 22 }) => {
  const frame = useCurrentFrame();
  const look = useLook();
  const c = color ?? look.accent2;
  const p = interpolate(frame, [at, at + 22], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap, width, opacity: p }}>
      <div style={{ height: 3, flex: 1, background: `linear-gradient(90deg, transparent, ${c})`, transform: `scaleX(${p})`, transformOrigin: 'right' }} />
      <div style={{ width: 20, height: 20, background: c, transform: `rotate(45deg) scale(${p})` }} />
      <div style={{ height: 3, flex: 1, background: `linear-gradient(270deg, transparent, ${c})`, transform: `scaleX(${p})`, transformOrigin: 'left' }} />
    </div>
  );
};

/** Small tracked capitals with a rule on each side. */
export const Kicker: React.FC<{ text: string; at?: number; color?: string }> = ({ text, at = 0, color }) => {
  const frame = useCurrentFrame();
  const look = useLook();
  const c = color ?? look.accent;
  const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE_OUT });
  const size = fit(text, 40, 820, 1, 0.74, 30); // never under 30 px: the kicker names the place and must read on a phone
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <div style={{ width: 70 * p, height: 3, background: look.accent2 }} />
      <div style={{ fontFamily: look.date, fontWeight: 600, fontSize: size, letterSpacing: size * 0.2, color: c, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{text}</div>
      <div style={{ width: 70 * p, height: 3, background: look.accent2 }} />
    </div>
  );
};

/** A wax seal: irregular red wax, a pressed ring and a letter. */
export const Seal: React.FC<{ size: number; label: string; at?: number; color?: string; look?: Look }> = ({ size, label, at = 0, color = '#8E1B22' }) => {
  const frame = useCurrentFrame();
  const look = useLook();
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const r = size / 2;
  const rand = rng(hash(label) + 7);
  const pts: [number, number][] = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    const rr = r * (0.9 + rand() * 0.1);
    return [r + Math.cos(a) * rr, r + Math.sin(a) * rr];
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: `scale(${0.3 + 0.7 * p}) rotate(${(1 - p) * -25}deg)`, opacity: Math.min(1, p * 2), filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))' }}>
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#C2343D" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#5A0E14" />
        </radialGradient>
      </defs>
      <path d={smoothClosed(pts)} fill="url(#wax)" />
      <circle cx={r} cy={r} r={r * 0.68} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={size * 0.025} />
      <circle cx={r} cy={r} r={r * 0.62} fill="none" stroke="rgba(255,200,190,0.28)" strokeWidth={size * 0.012} />
      <text x={r} y={r + size * 0.17} textAnchor="middle" fontFamily={look.head} fontWeight={800} fontSize={size * 0.5} fill="rgba(70,6,12,0.85)" stroke="rgba(255,190,180,0.3)" strokeWidth={1.2}>{label}</text>
    </svg>
  );
};

/** A rubber stamp that slams down: bordered capitals, slightly crooked, with ink spread. */
export const Stamp: React.FC<{ text: string; color: string; size: number; at?: number; tilt?: number }> = ({ text, color, size, at = 0, tilt = -7 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 7], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const settle = interpolate(frame, [at + 7, at + 18], [0, 1], { ...clamp, easing: EASE_OUT });
  const look = useLook();
  const s = 2.1 - 1.1 * p + 0.04 * (1 - settle);
  const shake = frame >= at + 7 && frame < at + 18 ? Math.sin((frame - at) * 5) * 5 * (1 - settle) : 0;
  return (
    <div style={{ opacity: Math.min(1, p * 1.6), transform: `translateX(${shake}px) rotate(${tilt}deg) scale(${s})`, border: `${size * 0.07}px solid ${color}`, outline: `${size * 0.025}px solid ${color}`, outlineOffset: size * 0.06, padding: `${size * 0.1}px ${size * 0.34}px`, color, fontFamily: look.head, fontWeight: look.weight, fontSize: size, letterSpacing: size * 0.08, textTransform: 'uppercase', textShadow: `0 0 ${3 + 6 * (1 - settle)}px ${color}`, filter: 'contrast(1.1)', mixBlendMode: look.dark ? 'normal' : 'multiply' }}>
      {text}
    </div>
  );
};

/** Gold-foil lettering: a metallic gradient clipped to the glyphs with a stamped shadow. */
export const foilText: React.CSSProperties = {
  color: '#FFE08A',
  textShadow: '0 2px 0 #FFF4C8, 0 5px 0 #D9A021, 0 8px 0 #A06A0E, 0 11px 0 #6B430A, 0 22px 34px rgba(0,0,0,0.8)',
};

/** A strip of torn paper stuck onto the picture: rough edges, a slight tilt, a drop shadow. It carries the key phrase of a scene. */
export const TornLabel: React.FC<{ children: React.ReactNode; color: string; ink?: string; seed?: number; at?: number; tilt?: number; style?: React.CSSProperties }> = ({ children, color, ink = '#1b1208', seed = 3, at = 0, tilt = -2, style }) => {
  const frame = useCurrentFrame();
  const r = rng(seed * 977 + 5);
  const pts: string[] = [];
  for (let x = 0; x <= 100; x += 3.4) pts.push(`${x}% ${(r() * 9).toFixed(1)}%`);
  for (let y = 12; y <= 88; y += 11) pts.push(`${(100 - r() * 2.4).toFixed(1)}% ${y}%`);
  for (let x = 100; x >= 0; x -= 3.4) pts.push(`${x}% ${(100 - r() * 11).toFixed(1)}%`);
  for (let y = 88; y >= 12; y -= 11) pts.push(`${(r() * 2.4).toFixed(1)}% ${y}%`);
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <div style={{ filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.6))', transform: `rotate(${tilt}deg) translateX(${(1 - p) * -90}px) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2.5), ...style }}>
      <div style={{ clipPath: `polygon(${pts.join(', ')})`, background: `linear-gradient(172deg, ${color} 0%, ${color} 55%, ${color}E0 100%)`, color: ink, padding: '14px 44px 18px', textShadow: 'none', display: 'inline-block' }}>{children}</div>
    </div>
  );
};

/** Four ornamental corner brackets for panels and the whole frame. */
export const Corners: React.FC<{ color: string; size?: number; inset?: number; weight?: number }> = ({ color, size = 40, inset = 10, weight = 4 }) => (
  <>
    {([[0, 0, 0], [1, 0, 90], [1, 1, 180], [0, 1, 270]] as const).map(([rx, ry, rot], i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 40 40" style={{ position: 'absolute', [rx ? 'right' : 'left']: inset, [ry ? 'bottom' : 'top']: inset, transform: `rotate(${rot}deg)` }}>
        <path d="M2 38 V2 H38" fill="none" stroke={color} strokeWidth={weight} /><path d="M10 38 V10 H38" fill="none" stroke={color} strokeWidth={weight / 2.5} opacity={0.7} /><rect x={0} y={0} width={9} height={9} transform="rotate(45 4.5 4.5)" fill={color} />
      </svg>
    ))}
  </>
);
