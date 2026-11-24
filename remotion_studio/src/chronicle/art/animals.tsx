import React from 'react';
import { Colors, mix } from './palette';
import { Drawn } from './draw';
import { Elephant } from './people';

type P = Drawn & { c: Colors };

/** A four-legged animal described by a handful of numbers: the body is drawn once, legs swing, the head, ears, horns, mane and tail follow the spec. Facing right, feet at the origin. */
interface Q {
  rx: number; ry: number; leg: number; lw: number; col: string; col2?: string;
  neck?: number; hr: number; snout: number; ear: 'point' | 'round' | 'long' | 'floppy' | 'tall' | 'none';
  horns?: 'bull' | 'curve' | 'goat' | 'antler'; tail: 'thin' | 'bushy' | 'tuft' | 'curl' | 'stub';
  mane?: boolean | 'neck'; fang?: boolean; shaggy?: boolean; stripes?: boolean; wool?: boolean; spots?: boolean; tusks?: boolean; beard?: boolean; speed: number; tip?: string; hump?: boolean; spotCol: (c: Colors) => string;
}

const Quad: React.FC<P & { q: Q }> = ({ c, t, seed, q }) => {
  const g = t * q.speed + seed;
  const dk = mix(q.col, c.shadow, 0.35);
  const ol = mix(q.col, c.shadow, 0.55);
  const by = -(q.leg + q.ry * 0.7);
  const neck = q.neck ?? 0;
  const hx = q.rx * 0.82 + q.hr * 0.4, hy = by - q.ry * 0.5 - neck;
  const bob = -Math.abs(Math.sin(g)) * 2.2;
  const leg = (x: number, ph: number, col: string) => {
    const a = Math.sin(g + ph) * 0.55;
    const kx = x + Math.sin(a) * q.leg * 0.5;
    return <path d={`M${x} ${by + q.ry * 0.3} L${kx} ${-q.leg * 0.45} L${x + Math.sin(a) * q.leg * 0.7} -2`} stroke={col} strokeWidth={q.lw} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  };
  const tw = Math.sin(t * 5 + seed) * 6;
  const eye = <circle cx={hx + q.hr * 0.25} cy={hy - q.hr * 0.15} r={Math.max(1.6, q.hr * 0.12)} fill="#1c1410" />;
  return (
    <g>
      <ellipse cx={0} cy={1} rx={q.rx * 1.05} ry={4} fill={c.shadow} opacity={0.28} />
      {leg(-q.rx * 0.68, 0, dk)}{leg(-q.rx * 0.48, 3.1, dk)}{leg(q.rx * 0.5, 1.6, q.col)}{leg(q.rx * 0.68, 4.7, q.col)}
      <g transform={`translate(0 ${bob})`}>
        {/* tail */}
        {q.tail === 'thin' && <path d={`M${-q.rx * 0.95} ${by - 2} Q${-q.rx * 1.35} ${by - 22 + tw} ${-q.rx * 1.2} ${by - 36}`} stroke={q.col} strokeWidth={q.lw * 0.45} fill="none" strokeLinecap="round" />}
        {q.tail === 'bushy' && <path d={`M${-q.rx * 0.9} ${by - 2} Q${-q.rx * 1.6} ${by - 6 + tw} ${-q.rx * 1.5} ${by + 22} Q${-q.rx * 1.1} ${by + 10} ${-q.rx * 0.9} ${by + 6}Z`} fill={q.col} stroke={ol} strokeWidth={1} />}
        {q.tail === 'tuft' && <><path d={`M${-q.rx * 0.95} ${by - 2} Q${-q.rx * 1.2} ${by + 10 + tw} ${-q.rx * 1.15} ${by + q.leg * 0.8}`} stroke={q.col} strokeWidth={q.lw * 0.4} fill="none" strokeLinecap="round" /><ellipse cx={-q.rx * 1.15} cy={by + q.leg * 0.85} rx={q.lw * 0.5} ry={q.lw * 0.9} fill={dk} /></>}
        {q.tail === 'curl' && <path d={`M${-q.rx * 0.95} ${by - 4} q-10 -6 -8 -16 q4 -6 8 0`} stroke={q.col} strokeWidth={3.4} fill="none" strokeLinecap="round" />}
        {q.tail === 'stub' && <circle cx={-q.rx * 0.97} cy={by - 4} r={q.lw * 0.5} fill={q.tip ?? q.col} />}
        {/* body */}
        {q.wool ? (
          <g fill={q.col} stroke={ol} strokeWidth={1}>{[[-0.5, 0], [-0.1, -0.5], [0.4, -0.2], [0.6, 0.3], [-0.2, 0.5], [-0.6, 0.4], [0.1, 0.1]].map(([x, y], i) => <circle key={i} cx={x * q.rx} cy={by + y * q.ry} r={q.ry * 0.85} />)}</g>
        ) : (
          <>
            <ellipse cx={0} cy={by} rx={q.rx} ry={q.ry} fill={q.col} stroke={ol} strokeWidth={1.2} />
            <ellipse cx={0} cy={by + q.ry * 0.45} rx={q.rx * 0.8} ry={q.ry * 0.5} fill={q.col2 ?? mix(q.col, c.light, 0.3)} opacity={0.8} />
            {q.hump && <ellipse cx={q.rx * 0.4} cy={by - q.ry * 0.75} rx={q.rx * 0.3} ry={q.ry * 0.5} fill={q.col} stroke={ol} strokeWidth={1} />}
          </>
        )}
        {q.stripes && Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-q.rx * 0.7 + i * q.rx * 0.23} ${by - q.ry * 0.9} q4 ${q.ry * 0.9} -3 ${q.ry * 1.7}`} stroke="#241810" strokeWidth={3.4} fill="none" strokeLinecap="round" />)}
        {q.spots && [[-0.5, -0.3, 0.38], [0.1, 0.2, 0.34], [0.5, -0.4, 0.28], [-0.1, -0.5, 0.25]].map(([x, y, r], i) => <ellipse key={i} cx={x * q.rx} cy={by + y * q.ry} rx={q.ry * r * 1.6} ry={q.ry * r * 1.2} fill={q.spotCol(c)} />)}
        {/* neck and head */}
        <path d={`M${q.rx * 0.5} ${by - q.ry * 0.3} L${hx - q.hr * 0.2} ${hy + q.hr * 0.3}`} stroke={q.col} strokeWidth={q.hr * (neck ? 1.1 : 1.8)} strokeLinecap="round" />
        {q.mane === 'neck' && <path d={`M${q.rx * 0.4} ${by - q.ry * 0.9} Q${q.rx * 0.7} ${(by + hy) / 2 - q.hr} ${hx - q.hr * 0.6} ${hy - q.hr * 0.9}`} stroke={mix('#2a1c12', c.mid, 0.2)} strokeWidth={9} fill="none" strokeLinecap="round" />}
        {q.mane === true && <g fill={mix('#8a5a20', c.mid, 0.2)}>{Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * Math.PI * 2; return <circle key={i} cx={hx - 4 + Math.cos(a) * q.hr * 1.05} cy={hy + Math.sin(a) * q.hr * 1.05} r={q.hr * 0.55} />; })}</g>}
        {q.ear === 'long' && <path d={`M${hx - q.hr * 0.3} ${hy - q.hr * 0.7} Q${hx - q.hr * 1.6} ${hy - q.hr * 0.4} ${hx - q.hr * 1.5} ${hy + q.hr * 0.2} Q${hx - q.hr * 0.8} ${hy - q.hr * 0.1} ${hx - q.hr * 0.2} ${hy - q.hr * 0.3}Z`} fill={dk} />}
        {q.horns === 'antler' && <g stroke={mix('#8a6a3a', c.mid, 0.2)} strokeWidth={3.2} fill="none" strokeLinecap="round">{[0, 1].map((k) => <path key={k} d={`M${hx - 4 + k * 6} ${hy - q.hr * 0.8} l${-4 + k * 8} -22 l-8 -10 M${hx - 4 + k * 6 + (-4 + k * 8)} ${hy - q.hr * 0.8 - 22} l8 -12 M${hx - 4 + k * 6 + (-4 + k * 8)} ${hy - q.hr * 0.8 - 12} l10 -4`} />)}</g>}
        <ellipse cx={hx} cy={hy} rx={q.hr} ry={q.hr * 0.9} fill={q.col} stroke={ol} strokeWidth={1.2} />
        <path d={`M${hx + q.hr * 0.4} ${hy - q.hr * 0.3} L${hx + q.hr * 0.4 + q.snout} ${hy + q.hr * 0.1} L${hx + q.hr * 0.4 + q.snout * 0.9} ${hy + q.hr * 0.6} L${hx} ${hy + q.hr * 0.7}Z`} fill={q.col2 ?? mix(q.col, c.light, 0.25)} stroke={ol} strokeWidth={1} />
        <circle cx={hx + q.hr * 0.4 + q.snout - 1} cy={hy + q.hr * 0.05} r={Math.max(1.6, q.hr * 0.16)} fill="#1c1410" />
        {eye}
        {q.fang && <path d={`M${hx + q.hr * 0.4 + q.snout * 0.55} ${hy + q.hr * 0.45} l1 16 l4 -15`} fill="#f4efe0" stroke={ol} strokeWidth={0.8} />}
        {q.shaggy && Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-q.rx * 0.8 + i * q.rx * 0.2} ${by + q.ry * 0.8} l${(i % 2 ? 1 : -1) * 3} ${10 + (i % 3) * 3}`} stroke={dk} strokeWidth={3.4} strokeLinecap="round" />)}
        {q.tusks && <path d={`M${hx + q.hr * 0.4 + q.snout * 0.6} ${hy + q.hr * 0.55} q4 -10 10 -12`} stroke="#f1e8d0" strokeWidth={3.2} fill="none" strokeLinecap="round" />}
        {q.beard && <path d={`M${hx + q.hr * 0.3} ${hy + q.hr * 0.7} l2 14 l5 -12`} fill={mix(q.col, c.light, 0.4)} stroke={ol} strokeWidth={0.8} />}
        {q.ear === 'point' && <path d={`M${hx - q.hr * 0.5} ${hy - q.hr * 0.6} L${hx - q.hr * 0.3} ${hy - q.hr * 1.7} L${hx + q.hr * 0.25} ${hy - q.hr * 0.7}Z`} fill={q.col} stroke={ol} strokeWidth={1} />}
        {q.ear === 'tall' && <path d={`M${hx - q.hr * 0.5} ${hy - q.hr * 0.6} L${hx - q.hr * 0.7} ${hy - q.hr * 2.4} L${hx + q.hr * 0.1} ${hy - q.hr * 0.7}Z`} fill={q.col} stroke={ol} strokeWidth={1} />}
        {q.ear === 'round' && <circle cx={hx - q.hr * 0.35} cy={hy - q.hr * 0.85} r={q.hr * 0.38} fill={q.col} stroke={ol} strokeWidth={1} />}
        {q.ear === 'floppy' && <path d={`M${hx - q.hr * 0.5} ${hy - q.hr * 0.7} Q${hx - q.hr * 1.2} ${hy - q.hr * 0.2} ${hx - q.hr * 0.7} ${hy + q.hr * 0.5} Q${hx - q.hr * 0.2} ${hy} ${hx - q.hr * 0.1} ${hy - q.hr * 0.6}Z`} fill={dk} stroke={ol} strokeWidth={1} />}
        {q.horns === 'bull' && <path d={`M${hx - 4} ${hy - q.hr * 0.8} Q${hx - 22} ${hy - q.hr * 1.2} ${hx - 14} ${hy - q.hr * 2}`} stroke="#efe6cf" strokeWidth={5} fill="none" strokeLinecap="round" />}
        {q.horns === 'curve' && <path d={`M${hx - 2} ${hy - q.hr * 0.8} Q${hx + 10} ${hy - q.hr * 1.6} ${hx + 2} ${hy - q.hr * 2}`} stroke="#efe6cf" strokeWidth={4} fill="none" strokeLinecap="round" />}
        {q.horns === 'goat' && <path d={`M${hx - 2} ${hy - q.hr * 0.8} Q${hx - 16} ${hy - q.hr * 1.8} ${hx - 26} ${hy - q.hr * 1.4}`} stroke={mix('#cfc3a6', c.mid, 0.2)} strokeWidth={4} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};
const mk = (build: (c: Colors) => Q): React.FC<P> => ({ c, t, seed, dir }) => <Quad c={c} t={t} seed={seed} dir={dir} q={build(c)} />;
const B = (hex: string, c: Colors, k = 0.25) => mix(hex, c.mid, k);
const S = (extra: Partial<Q>): Q => ({ spotCol: (cc: Colors) => mix('#241810', cc.mid, 0.2), rx: 30, ry: 14, leg: 26, lw: 6, col: '#888', hr: 11, snout: 12, ear: 'point', tail: 'thin', speed: 6, ...extra });

export const Dog = mk((c) => S({ rx: 30, ry: 14, leg: 26, lw: 6, col: B('#b98a54', c), hr: 11, snout: 12, ear: 'floppy', tail: 'thin', speed: 9 }));
export const Wolf = mk((c) => S({ rx: 38, ry: 16, leg: 34, lw: 6.5, col: B('#7d8288', c), col2: B('#ccc7c4', c), hr: 12, snout: 17, ear: 'point', tail: 'bushy', speed: 8 }));
export const Fox = mk((c) => S({ rx: 28, ry: 12, leg: 24, lw: 5, col: B('#cf6a2a', c), col2: B('#f2e6d2', c), hr: 10, snout: 14, ear: 'point', tail: 'bushy', speed: 9 }));
export const Lion = mk((c) => S({ rx: 50, ry: 23, leg: 36, lw: 10, col: B('#c99a52', c), col2: B('#e6cf9a', c), hr: 14, snout: 11, ear: 'round', tail: 'tuft', mane: true, speed: 5 }));
export const Tiger = mk((c) => S({ rx: 52, ry: 22, leg: 36, lw: 10, col: B('#d9812e', c), col2: B('#f2e6d2', c), hr: 14, snout: 11, ear: 'round', tail: 'thin', stripes: true, speed: 5.5 }));
export const Bear = mk((c) => S({ rx: 54, ry: 32, leg: 30, lw: 14, col: B('#5b3d28', c), col2: B('#8a6a4c', c), hr: 15, snout: 12, ear: 'round', tail: 'stub', speed: 3.6 }));
export const Deer = mk((c) => S({ rx: 38, ry: 15, leg: 50, lw: 5, col: B('#a0703c', c), col2: B('#e8d4b0', c), neck: 32, hr: 10, snout: 13, ear: 'long', horns: 'antler', tail: 'stub', tip: '#f5efe2', spots: true, speed: 6 }));
export const Boar = mk((c) => S({ rx: 42, ry: 21, leg: 24, lw: 8.5, col: B('#4a3a30', c), col2: B('#6e5a4a', c), hr: 13, snout: 14, ear: 'point', tail: 'curl', tusks: true, speed: 7 }));
export const Pig = mk((c) => S({ rx: 38, ry: 22, leg: 18, lw: 8, col: B('#e8aaa0', c, 0.15), col2: B('#f5c8c0', c, 0.15), hr: 13, snout: 9, ear: 'floppy', tail: 'curl', speed: 6 }));
export const Cow = mk((c) => S({ rx: 54, ry: 25, leg: 36, lw: 9.5, col: B('#f0ece2', c, 0.15), col2: B('#e8c8b8', c), hr: 14, snout: 12, ear: 'long', horns: 'curve', tail: 'tuft', spots: true, speed: 4.2 }));
export const Ox = mk((c) => S({ rx: 56, ry: 27, leg: 36, lw: 10.5, col: B('#6a4a32', c), col2: B('#8a6a4c', c), hr: 15, snout: 12, ear: 'long', horns: 'bull', tail: 'tuft', hump: true, speed: 3.8 }));
export const Sheep = mk((c) => S({ rx: 36, ry: 20, leg: 24, lw: 5, col: B('#f2efe6', c, 0.15), hr: 9, snout: 8, ear: 'floppy', tail: 'stub', wool: true, speed: 6 }));
export const Goat = mk((c) => S({ rx: 32, ry: 15, leg: 32, lw: 5, col: B('#b8b0a0', c), col2: B('#e8e2d2', c), hr: 10, snout: 11, ear: 'long', horns: 'goat', tail: 'stub', beard: true, speed: 7 }));
export const Donkey = mk((c) => S({ rx: 42, ry: 18, leg: 42, lw: 7, col: B('#8d8a86', c), col2: B('#d8d2c4', c), hr: 12, snout: 16, ear: 'tall', tail: 'tuft', speed: 5.5 }));

export const Rat: React.FC<P> = ({ c, t, seed }) => {
  const g = t * 12 + seed;
  const col = mix('#6e625a', c.mid, 0.25);
  return (
    <g>
      <path d={`M-20 -10 Q-46 ${-4 + Math.sin(g) * 8} -64 ${-16 + Math.sin(g * 0.7) * 10}`} stroke={mix(col, '#d8a8a0', 0.5)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {[-12, 8].map((x, i) => <path key={i} d={`M${x} -8 l${Math.sin(g + i * 3) * 5} 8`} stroke={col} strokeWidth={3.4} strokeLinecap="round" />)}
      <ellipse cx={0} cy={-16} rx={22} ry={11} fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1} />
      <path d="M16 -22 L34 -14 L18 -8Z" fill={col} /><circle cx={34} cy={-14} r={2.4} fill="#e8a4a0" /><circle cx={22} cy={-17} r={1.7} fill="#1c1410" /><circle cx={14} cy={-26} r={5} fill={mix(col, '#d8a8a0', 0.4)} />
      <path d="M34 -14 l12 -3 M34 -13 l12 2" stroke={c.light} strokeWidth={0.8} />
    </g>
  );
};
export const Eagle: React.FC<P> = ({ c, t, seed }) => {
  const f = Math.sin(t * 5 + seed) * 0.5;
  const col = mix('#5a4030', c.mid, 0.25);
  const wing = (s: number) => <path d={`M0 -10 Q${s * 50} ${-40 - f * 60} ${s * 120} ${-20 - f * 90} Q${s * 90} ${-8 - f * 40} ${s * 56} ${6} Q${s * 28} 6 0 4Z`} fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1.2} />;
  return (
    <g transform={`translate(0 ${-210 + Math.sin(t * 1.6 + seed) * 14})`}>
      {wing(-1)}{wing(1)}
      <path d="M-30 4 L-12 -4 L18 -4 L22 8 L-14 10Z" fill={col} /><path d="M-30 4 L-52 10 L-48 -2Z" fill={mix(col, '#f2efe6', 0.5)} />
      <circle cx={26} cy={-2} r={9} fill="#f0ece2" stroke={mix(col, c.shadow, 0.4)} strokeWidth={1} /><path d="M32 -2 L46 4 L33 7Z" fill={c.gold} stroke={c.shadow} strokeWidth={0.8} /><circle cx={28} cy={-4} r={1.8} fill="#1c1410" />
    </g>
  );
};
export const Raven: React.FC<P> = ({ c, t, seed }) => {
  const f = Math.sin(t * 8 + seed) * 0.6;
  const col = mix('#241e1a', c.mid, 0.2);
  return (
    <g transform={`translate(0 ${-150 + Math.sin(t * 2 + seed) * 12})`}>
      {[-1, 1].map((s) => <path key={s} d={`M0 -6 Q${s * 26} ${-26 - f * 32} ${s * 62} ${-8 - f * 40} Q${s * 40} 0 ${s * 20} 4 Z`} fill={col} stroke={mix(col, '#a0816a', 0.3)} strokeWidth={0.8} />)}
      <ellipse cx={0} cy={0} rx={22} ry={8} fill={col} /><path d="M-20 0 L-38 6 L-34 -3Z" fill={col} /><circle cx={22} cy={-3} r={7} fill={col} /><path d="M27 -3 L40 1 L27 4Z" fill="#3a3532" /><circle cx={24} cy={-5} r={1.5} fill="#e8e0d0" />
    </g>
  );
};
export const Snake: React.FC<P> = ({ c, t, seed }) => {
  const col = mix('#7d6d3a', c.mid, 0.25);
  const pts = Array.from({ length: 26 }, (_, i) => [i * 8 - 90, -10 + Math.sin(i * 0.55 - t * 4 + seed) * 12 * (0.4 + i / 40)] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const [hx, hy] = pts[pts.length - 1];
  return (
    <g>
      <path d={d} stroke={mix(col, c.shadow, 0.5)} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={col} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={mix(col, c.gold, 0.6)} strokeWidth={4} fill="none" strokeDasharray="5 9" strokeLinecap="round" />
      <ellipse cx={hx + 4} cy={hy - 2} rx={11} ry={8} fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1} /><circle cx={hx + 8} cy={hy - 5} r={2} fill="#f2e08a" /><path d={`M${hx + 15} ${hy - 1} l12 ${Math.sin(t * 14) * 2} l-4 -4 M${hx + 27} ${hy - 1} l-4 4`} stroke="#c0322a" strokeWidth={1.4} fill="none" />
    </g>
  );
};
export const Crocodile: React.FC<P> = ({ c, t, seed }) => {
  const col = mix('#6a5f3a', c.mid, 0.25);
  const jaw = 4 + Math.max(0, Math.sin(t * 2 + seed)) * 14;
  return (
    <g>
      {[-52, -30, 34, 54].map((x, i) => <path key={i} d={`M${x} -12 l${i % 2 ? 6 : -6} 12`} stroke={mix(col, c.shadow, 0.3)} strokeWidth={7} strokeLinecap="round" />)}
      <path d={`M-150 -6 Q-110 ${-14 + Math.sin(t * 2) * 6} -70 -20 L60 -26 L70 -8 L-70 -4Z`} fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1.3} />
      <path d={`M60 -26 L140 -${18 + jaw * 0.3} L140 -${12 + jaw * 0.3} L66 -10Z`} fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1.2} />
      <path d={`M66 -10 L138 ${-10 + jaw} L138 ${-4 + jaw} L62 0Z`} fill={mix(col, c.light, 0.15)} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1.2} />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-90 + i * 14} ${-22 - Math.sin(i) * 0.5} l4 -8 l4 8`} fill={mix(col, c.shadow, 0.3)} />)}
      <circle cx={70} cy={-30} r={5} fill="#e8d870" stroke={c.shadow} strokeWidth={1} /><circle cx={71} cy={-30} r={1.8} fill="#1c1410" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${72 + i * 11} ${-16 + (i % 2 ? 0 : jaw * 0.4)} l3 5 l3 -5`} fill="#f4efe0" />)}
    </g>
  );
};
export const Whale: React.FC<P> = ({ c, t, seed }) => {
  const col = mix('#78553b', c.mid, 0.3);
  const rise = Math.sin(t * 0.9 + seed) * 10;
  return (
    <g transform={`translate(0 ${rise})`}>
      <path d={`M-180 -20 Q-150 ${-50 + Math.sin(t * 1.4) * 14} -200 ${-86 + Math.sin(t * 1.4) * 22} Q-170 -60 -140 -48 Q-210 -76 -230 ${-70 + Math.sin(t * 1.4) * 14} Q-196 -30 -180 -20Z`} fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1.4} />
      <path d="M-180 -20 Q-90 -150 60 -110 Q170 -80 190 -20 Q60 20 -180 -20Z" fill={col} stroke={mix(col, c.shadow, 0.5)} strokeWidth={1.5} />
      <path d="M-100 -22 Q40 12 184 -24 Q60 -2 -100 -22Z" fill={mix(col, c.light, 0.55)} /><path d="M20 -40 q18 8 30 -2 M50 -34 q16 6 26 -2" stroke={mix(col, c.light, 0.5)} strokeWidth={2} fill="none" />
      <circle cx={140} cy={-60} r={5} fill="#f0ece2" /><circle cx={141} cy={-60} r={2.2} fill="#1c1410" />
      <path d={`M10 -112 Q10 ${-150 - Math.sin(t * 2) * 8} -6 -170 M10 -112 Q10 ${-150 - Math.sin(t * 2) * 8} 26 -170`} stroke={mix(c.light, c.water, 0.4)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M60 -26 Q80 20 100 14 Q96 -8 84 -24Z" fill={mix(col, c.shadow, 0.2)} />
    </g>
  );
};

export const Sabertooth = mk((c) => S({ rx: 50, ry: 23, leg: 32, lw: 11, col: B('#b98a54', c), col2: B('#e6cf9a', c), hr: 14, snout: 11, ear: 'round', tail: 'stub', fang: true, stripes: false, speed: 5 }));
export const Bison = mk((c) => S({ rx: 58, ry: 30, leg: 34, lw: 11, col: B('#4a3326', c), col2: B('#6b4c36', c), hr: 17, snout: 10, ear: 'round', horns: 'curve', tail: 'tuft', hump: true, shaggy: true, speed: 3.6 }));
export const Horse = mk((c) => S({ rx: 46, ry: 20, leg: 50, lw: 7, col: B('#8a5a34', c), col2: B('#b9895a', c), neck: 26, hr: 12, snout: 18, ear: 'point', tail: 'bushy', mane: 'neck', speed: 7 }));
export const Camel = mk((c) => S({ rx: 46, ry: 22, leg: 52, lw: 7, col: B('#c19a62', c), col2: B('#e2c796', c), neck: 40, hr: 11, snout: 14, ear: 'round', tail: 'tuft', hump: true, speed: 4.4 }));
export const Mammoth: React.FC<P> = ({ c, t, seed }) => {
  const fur = mix('#5a3d28', c.mid, 0.25);
  return (
    <g>
      <Elephant c={{ ...c, near: fur, mid: mix(fur, c.light, 0.15), light: c.light }} t={t} seed={seed} rider={false} />
      <path d="M120 -86 Q150 -52 128 -20 Q112 -6 98 -22" stroke="#efe6cf" strokeWidth={9} fill="none" strokeLinecap="round" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-70 + i * 16} -60 q${i % 2 ? 3 : -3} 22 ${i % 2 ? 2 : -2} 52`} stroke={mix(fur, c.shadow, 0.4)} strokeWidth={5} strokeLinecap="round" fill="none" />)}
      <path d="M-30 -150 Q10 -176 60 -156 Q40 -146 10 -144 Q-14 -140 -30 -150Z" fill={mix(fur, c.shadow, 0.3)} />
    </g>
  );
};

export const NEW_ANIMALS = { dog: Dog, wolf: Wolf, fox: Fox, lion: Lion, tiger: Tiger, bear: Bear, deer: Deer, boar: Boar, pig: Pig, cow: Cow, ox: Ox, sheep: Sheep, goat: Goat, donkey: Donkey, rat: Rat, eagle: Eagle, raven: Raven, snake: Snake, crocodile: Crocodile, whale: Whale, mammoth: Mammoth, sabertooth: Sabertooth, bison: Bison, horse: Horse, camel: Camel } as const;
