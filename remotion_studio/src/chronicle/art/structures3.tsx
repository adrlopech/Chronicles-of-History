import React from 'react';
import { Colors, mix } from './palette';
import { Cloth, Drawn, rect, tri } from './draw';
import { Smoke } from './things';

type P = Drawn & { c: Colors };
const lit = (c: Colors) => (c.night ? c.glow : mix(c.light, c.shadow, 0.5));
const arch = (x: number, y: number, w: number, h: number) => `M${x} ${y} v${-(h - w / 2)} a${w / 2} ${w / 2} 0 0 1 ${w} 0 v${h - w / 2}Z`;
const stone = (c: Colors, k = 0) => mix(c.light, c.shadow, 0.3 + k * 0.08);
const wood = (c: Colors, k = 0) => mix(c.near, c.shadow, 0.25 + k * 0.1);

// ------------------------------------------------------------------------------------------------------------------------------------------------ prehistory, renaissance, the East
export const Cave: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-300 0 Q-260 -190 -80 -230 Q60 -270 200 -200 Q310 -140 320 0Z" fill={mix(c.mid, c.near, 0.4)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-110 0 Q-120 -120 -40 -150 Q40 -170 100 -130 Q130 -100 120 0Z" fill="#120a07" />
    <ellipse cx={0} cy={-10} rx={70} ry={16} fill={c.glow} opacity={0.2 + Math.sin(t * 9) * 0.05} />
    <path d="M-40 -90 q10 -30 22 0 M-30 -90 v-24 M-10 -80 l16 -30 M20 -84 q14 -40 36 -4 M30 -84 v-34 M50 -70 l12 -26" stroke={c.accent} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
    {[[-230, -36, 30], [-190, -22, 20], [210, -30, 26], [250, -16, 18]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill={mix(c.near, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={1.5} />)}
  </g>
);
export const Menhir: React.FC<P> = ({ c }) => (
  <g>
    {[[-120, 150, 40, -4], [-30, 210, 52, 2], [70, 170, 44, -2], [160, 120, 36, 3]].map(([x, h, w, a], i) => (
      <path key={i} d={`M${x - w / 2} 0 L${x - w * 0.4 + a} ${-h * 0.6} L${x - w * 0.15 + a} ${-h} L${x + w * 0.3 + a} ${-h * 0.92} L${x + w * 0.42} ${-h * 0.5} L${x + w / 2} 0Z`} fill={mix(c.mid, c.light, 0.3 + i * 0.05)} stroke={c.shadow} strokeWidth={2.4} />
    ))}
    <path d="M-150 0 H200" stroke={c.shadow} strokeWidth={3} opacity={0.4} />
  </g>
);
export const Duomo: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-170, -150, 340, 150)} fill={mix('#e8d4b8', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={arch(-150 + i * 46, -6, 28, 80)} fill={c.fore} opacity={0.82} />)}
    <path d={rect(-70, -190, 140, 44)} fill={mix('#e8d4b8', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-76 -190 Q0 -330 76 -190Z" fill={mix(c.accent, c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    {[-40, -14, 14, 40].map((x) => <path key={x} d={`M${x} -194 Q${x * 0.9} -276 0 -300`} stroke={c.light} strokeWidth={4} fill="none" opacity={0.8} />)}
    <path d={rect(-14, -330, 28, 34)} fill={mix('#e8d4b8', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2} /><path d="M-18 -330 Q0 -366 18 -330Z" fill={c.accent} stroke={c.shadow} strokeWidth={1.6} /><path d="M0 -358 v-20 M-6 -370 h12" stroke={c.gold} strokeWidth={3} />
    <g transform="translate(250 0)"><path d={rect(-24, -280, 48, 280)} fill={mix('#e8d4b8', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} /><path d="M-28 -280 L0 -330 L28 -280Z" fill={c.accent} stroke={c.shadow} strokeWidth={2} />{[-60, -140, -220].map((y) => <path key={y} d={arch(-8, y, 16, 34)} fill={lit(c)} />)}</g>
  </g>
);
export const Pavilion: React.FC<P> = ({ c, t }) => (
  <g>
    <path d={rect(-110, -16, 220, 16)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2} />
    {[-86, -30, 30, 86].map((x) => <path key={x} d={rect(x - 7, -126, 14, 110)} fill={mix('#c13a2a', c.mid, 0.25)} stroke={c.shadow} strokeWidth={1.6} />)}
    <path d="M-150 -118 Q-100 -118 -92 -150 L0 -200 L92 -150 Q100 -118 150 -118 Q70 -128 0 -168 Q-70 -128 -150 -118Z" fill={mix('#6a542f', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2} />
    <path d="M-150 -118 Q-100 -112 -60 -126 L60 -126 Q100 -112 150 -118" stroke={c.gold} strokeWidth={3} fill="none" />
    <path d="M0 -200 v-22" stroke={c.gold} strokeWidth={4} />
    <path d="M-170 6 q22 -8 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" stroke={c.water2} strokeWidth={3} fill="none" opacity={0.6 + Math.sin(t) * 0.1} />
  </g>
);
export const Dojo: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-150, -80, 300, 80)} fill={mix('#d9c6a0', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={rect(-136 + i * 56, -70, 48, 66)} fill={mix('#f2eadb', c.light, 0.3)} stroke={c.shadow} strokeWidth={1.6} />)}
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-112 + i * 56} -70 V-4 M${-136 + i * 56} -38 H${-88 + i * 56}`} stroke={wood(c, 2)} strokeWidth={1.4} />)}
    <path d="M-190 -78 Q-120 -80 -96 -128 L96 -128 Q120 -80 190 -78 Q100 -92 0 -102 Q-100 -92 -190 -78Z" fill={mix('#50443a', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.2} />
    <path d="M-150 -80 H150" stroke={wood(c, 2)} strokeWidth={5} />
  </g>
);

// ------------------------------------------------------------------------------------------------------------------------------------------------ the frontier and the space age
export const Saloon: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-130, -150, 260, 150)} fill={mix('#9a6a40', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-140 -150 L-140 -190 L-70 -190 L-70 -210 L70 -210 L70 -190 L140 -190 L140 -150Z" fill={mix('#9a6a40', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(-70, -202, 140, 34)} fill={c.light} stroke={c.shadow} strokeWidth={2} /><path d="M-52 -192 h104 M-44 -180 h88" stroke={c.accent} strokeWidth={5} strokeLinecap="round" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-124 + i * 22} -150 V0`} stroke={c.shadow} strokeWidth={1.2} opacity={0.35} />)}
    {[-100, 70].map((x) => <path key={x} d={rect(x, -112, 32, 40)} fill={lit(c)} stroke={c.shadow} strokeWidth={2} />)}
    <path d={rect(-140, -70, 280, 10)} fill={wood(c, 2)} /><path d="M-136 -60 V0 M136 -60 V0 M-30 -60 V0 M30 -60 V0" stroke={wood(c, 2)} strokeWidth={6} />
    <path d={rect(-26, -62, 52, 62)} fill="#150f0c" /><path d={`M-24 -58 L${-2 + Math.sin(t * 2 + seed) * 3} -58 L${-2 + Math.sin(t * 2 + seed) * 3} -22 L-24 -22Z M24 -58 L${2 + Math.sin(t * 2 + seed) * 3} -58 L${2 + Math.sin(t * 2 + seed) * 3} -22 L24 -22Z`} fill={wood(c, 1)} stroke={c.shadow} strokeWidth={1.6} />
  </g>
);
export const GeneralStore: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-120, -120, 240, 120)} fill={mix('#b78a5c', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-132 -120 L-110 -150 L110 -150 L132 -120Z" fill={wood(c, 1)} stroke={c.shadow} strokeWidth={2} />
    <path d={rect(-70, -140, 140, 22)} fill={c.light} stroke={c.shadow} strokeWidth={1.6} /><path d="M-56 -129 h112" stroke={c.accent} strokeWidth={5} strokeLinecap="round" />
    <path d={rect(-110, -96, 70, 52)} fill={lit(c)} stroke={c.shadow} strokeWidth={2} /><path d={rect(-24, -90, 40, 90)} fill={c.fore} /><path d={rect(40, -96, 70, 52)} fill={lit(c)} stroke={c.shadow} strokeWidth={2} />
    {[[-96, 0], [-70, 0], [86, 0]].map(([x], i) => <g key={i}><path d={`M${x - 11} 0 V-30 Q${x} -34 ${x + 11} -30 V0Z`} fill={wood(c, i)} stroke={c.shadow} strokeWidth={1.4} /><path d={`M${x - 11} -20 H${x + 11} M${x - 11} -8 H${x + 11}`} stroke={c.shadow} strokeWidth={1.2} /></g>)}
  </g>
);
export const WaterTower: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-60 -150 L-72 0 M60 -150 L72 0 M-20 -150 L-24 0 M20 -150 L24 0 M-66 -100 H66 M-70 -50 H70 M-60 -150 L24 -50 M60 -150 L-24 -50" stroke={wood(c, 2)} strokeWidth={6} fill="none" />
    <path d={rect(-70, -250, 140, 100)} fill={wood(c, 1)} stroke={c.shadow} strokeWidth={2.5} />
    {[-48, -24, 0, 24, 48].map((x) => <path key={x} d={`M${x} -250 V-150`} stroke={c.shadow} strokeWidth={1.4} opacity={0.5} />)}
    {[-228, -196, -166].map((y) => <path key={y} d={`M-70 ${y} H70`} stroke={c.shadow} strokeWidth={4} />)}
    <path d="M-78 -250 L0 -300 L78 -250Z" fill={mix(c.near, c.shadow, 0.3)} stroke={c.shadow} strokeWidth={2.4} />
    <path d="M30 -150 v70 q0 12 14 12" stroke={c.shadow} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);
export const RadarDish: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-40 0 L-10 -150 L10 -150 L40 0Z" fill={mix(c.light, c.shadow, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-50 0 H50" stroke={c.shadow} strokeWidth={6} />
    <g transform={`translate(0 -160) rotate(${-40 + Math.sin(t * 0.7) * 22})`}>
      <path d="M-110 -10 Q0 80 110 -10 Q0 40 -110 -10Z" fill={mix(c.light, '#ffffff', 0.15)} stroke={c.shadow} strokeWidth={2.4} />
      <path d="M0 22 L0 -80" stroke={c.shadow} strokeWidth={4} /><circle cx={0} cy={-84} r={7} fill={c.accent} stroke={c.shadow} strokeWidth={1.6} />
      <path d="M-100 -6 Q0 62 100 -6" stroke={c.shadow} strokeWidth={1.4} fill="none" opacity={0.5} />
    </g>
  </g>
);
export const CoolingTower: React.FC<P> = ({ c, t, seed }) => (
  <g>
    {[[-90, 1], [100, 0.85]].map(([x, s], i) => (
      <g key={i} transform={`translate(${x} 0) scale(${s})`}>
        <path d="M-78 0 Q-52 -120 -44 -170 Q-40 -230 -56 -290 L56 -290 Q40 -230 44 -170 Q52 -120 78 0Z" fill={mix('#c9c6bc', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
        <path d="M-60 -250 Q0 -240 60 -250 M-48 -200 Q0 -192 48 -200 M-52 -120 Q0 -112 52 -120" stroke={c.shadow} strokeWidth={1.4} fill="none" opacity={0.35} />
        <g transform="translate(0 -290)"><Smoke c={c} t={t} seed={seed + i} puffs={8} height={170} color={mix('#ffffff', c.far, 0.35)} /></g>
      </g>
    ))}
    <path d={rect(-190, -26, 80, 26)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} /><path d={rect(150, -40, 60, 40)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} />
  </g>
);

// ------------------------------------------------------------------------------------------------------------------------------------------------ vehicles
export const Wagon: React.FC<P> = ({ c, t, seed }) => {
  const r = t * 40 + seed * 20;
  const wheel = (x: number, rad: number) => (
    <g transform={`translate(${x} ${-rad})`}><circle r={rad} fill="none" stroke={wood(c, 2)} strokeWidth={5} /><g transform={`rotate(${r})`}>{[0, 45, 90, 135].map((a) => <path key={a} d={`M0 ${-rad} V${rad}`} stroke={wood(c, 2)} strokeWidth={3} transform={`rotate(${a})`} />)}</g><circle r={5} fill={wood(c, 2)} /></g>
  );
  return (
    <g>
      <path d={rect(-80, -52, 160, 14)} fill={wood(c)} stroke={c.shadow} strokeWidth={2} />
      <path d="M-84 -50 Q-84 -140 0 -150 Q84 -140 84 -50Z" fill={mix('#f1ead8', c.light, 0.3)} stroke={c.shadow} strokeWidth={2.2} />
      {[-50, -20, 10, 40].map((x) => <path key={x} d={`M${x} -148 Q${x * 1.1} -100 ${x * 1.05} -52`} stroke={c.shadow} strokeWidth={1.2} opacity={0.35} fill="none" />)}
      <path d="M84 -50 L120 -44 L124 -40" stroke={wood(c, 2)} strokeWidth={6} fill="none" strokeLinecap="round" />
      {wheel(-48, 30)}{wheel(52, 34)}
    </g>
  );
};
export const Junk: React.FC<P> = ({ c, t, seed }) => {
  const sway = Math.sin(t * 1.1 + seed) * 2;
  return (
    <g transform={`rotate(${sway} 0 0)`}>
      <path d="M-170 -34 L-130 6 L120 6 L180 -44 L160 -50 L-150 -50Z" fill={mix('#7a3a22', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
      <path d="M-150 -50 L160 -50" stroke={c.gold} strokeWidth={3} />
      <path d="M-30 -50 V-300 M-110 -50 V-220 M70 -50 V-230" stroke={wood(c, 2)} strokeWidth={6} />
      {[[-30, -300, 150, 250], [-110, -220, 80, 170], [70, -230, 100, 180]].map(([x, y, w, h], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d={`M0 0 Q${w * 0.7 + Math.sin(t * 1.5 + i) * 6} ${h * 0.4} ${w * 0.6} ${h}`} stroke="none" fill="none" />
          <path d={`M4 0 L${w * 0.7} ${4} L${w * 0.66 + Math.sin(t * 1.6 + i) * 4} ${h} L4 ${h}Z`} fill={mix('#c8442a', c.mid, 0.25)} stroke={c.shadow} strokeWidth={1.8} />
          {Array.from({ length: Math.floor(h / 28) }, (_, k) => <path key={k} d={`M4 ${(k + 1) * 28} L${w * 0.68} ${(k + 1) * 28}`} stroke={wood(c, 2)} strokeWidth={2.4} />)}
        </g>
      ))}
      <path d="M180 -44 Q210 -60 214 -90" stroke={c.shadow} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};
export const Lander: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-60 -70 L-100 0 M60 -70 L100 0 M-30 -70 L-40 -10 M30 -70 L40 -10" stroke={mix(c.light, c.shadow, 0.3)} strokeWidth={6} strokeLinecap="round" />
    {[-104, 104, -42, 42].map((x) => <ellipse key={x} cx={x} cy={-2} rx={15} ry={5} fill={mix(c.light, c.shadow, 0.35)} stroke={c.shadow} strokeWidth={1.4} />)}
    <path d="M-64 -70 L-48 -150 L48 -150 L64 -70Z" fill={mix('#d6a93f', c.mid, 0.2)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-40 -150 L-30 -196 Q0 -216 30 -196 L40 -150Z" fill={mix('#e8e4d6', c.light, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-16 -178 Q0 -190 16 -178 L12 -162 L-12 -162Z" fill={c.skyMid} stroke={c.shadow} strokeWidth={1.6} />
    <path d="M-20 -70 L-12 -50 L12 -50 L20 -70Z" fill={mix(c.shadow, c.light, 0.2)} /><path d={`M${-8} ${-50} Q0 ${-38 + Math.sin(t * 18) * 3} 8 -50`} fill={c.glow} opacity={0.0} />
    <path d="M0 -216 v-26" stroke={c.shadow} strokeWidth={3} /><circle cx={0} cy={-244} r={5} fill={c.accent} />
  </g>
);
export const Satellite: React.FC<P> = ({ c, t, seed }) => (
  <g transform={`translate(0 ${-250 + Math.sin(t * 0.8 + seed) * 12}) rotate(${Math.sin(t * 0.5 + seed) * 10})`}>
    {[-1, 1].map((s) => <g key={s}><path d={`M${s * 18} -4 H${s * 40}`} stroke={c.shadow} strokeWidth={3} /><path d={`M${s * 40} -22 H${s * 150} V22 H${s * 40}Z`} fill={mix('#764c2b', c.mid, 0.2)} stroke={c.shadow} strokeWidth={2.2} />{[1, 2, 3, 4].map((k) => <path key={k} d={`M${s * (40 + k * 22)} -22 V22`} stroke={mix(c.light, '#ffffff', 0.2)} strokeWidth={1.2} opacity={0.7} />)}<path d={`M${s * 40} 0 H${s * 150}`} stroke={mix(c.light, '#ffffff', 0.2)} strokeWidth={1.2} opacity={0.7} /></g>)}
    <path d={rect(-20, -22, 40, 44)} fill={mix('#d6a93f', c.mid, 0.2)} stroke={c.shadow} strokeWidth={2.4} />
    <path d="M0 -22 V-46" stroke={c.shadow} strokeWidth={2.4} /><path d="M-14 -46 Q0 -60 14 -46Z" fill={c.light} stroke={c.shadow} strokeWidth={1.6} /><circle cx={0} cy={-8} r={6} fill={c.accent} />
  </g>
);

export const STRUCTURES3 = { cave: Cave, menhir: Menhir, duomo: Duomo, pavilion: Pavilion, dojo: Dojo, saloon: Saloon, general_store: GeneralStore, water_tower: WaterTower, radar_dish: RadarDish, cooling_tower: CoolingTower } as const;
export const VEHICLES3 = { wagon: Wagon, junk: Junk, lander: Lander, satellite: Satellite } as const;
void Cloth;
void tri;
