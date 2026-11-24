import React from 'react';
import { Colors, mix } from './palette';
import { Cloth, Drawn, rect, tri, wave } from './draw';
import { Person } from './people';

type P = Drawn & { c: Colors };

// ---------------------------------------------------------------------------------------------------------------------------------------------------------- effects
export const Smoke: React.FC<P & { puffs?: number; height?: number; color?: string }> = ({ c, t, seed, puffs = 9, height = 260, color }) => (
  <g>
    {Array.from({ length: puffs }, (_, i) => {
      const ph = (((t * 0.35 + i / puffs + seed * 0.13) % 1) + 1) % 1;
      return <circle key={i} cx={Math.sin(ph * 6 + i) * 14 * ph + ph * 30} cy={-ph * height} r={12 + ph * 34} fill={color ?? mix(c.far, c.shadow, 0.3)} opacity={0.62 * (1 - ph)} />;
    })}
  </g>
);

export const Fire: React.FC<P & { size?: number }> = ({ c, t, seed, size = 1 }) => {
  const f = (k: number, w: number, h: number, col: string, ph: number) => {
    const fl = 1 + Math.sin(t * 13 + ph + seed) * 0.12;
    const sx = Math.sin(t * 9 + ph) * 5;
    return <path d={`M${-w} 0 Q${-w * 0.9 + sx} ${-h * 0.5 * fl} ${sx} ${-h * fl} Q${w * 0.9 + sx} ${-h * 0.5 * fl} ${w} 0Z`} fill={col} key={k} />;
  };
  return (
    <g transform={`scale(${size})`}>
      <ellipse cx={0} cy={4} rx={70} ry={14} fill={c.glow} opacity={0.22 + Math.sin(t * 11) * 0.05} />
      {f(0, 46, 120, '#c8321f', 0)}{f(1, 34, 96, c.glow, 1.6)}{f(2, 20, 62, '#ffe08a', 3.1)}
      {Array.from({ length: 6 }, (_, i) => {
        const ph = (((t * 0.8 + i / 6 + seed) % 1) + 1) % 1;
        return <circle key={i} cx={Math.sin(i * 2.3 + t) * 30} cy={-30 - ph * 150} r={2.4} fill="#ffd27a" opacity={1 - ph} />;
      })}
      <path d="M-50 4 L50 -6 M-44 -6 L46 6" stroke={c.shadow} strokeWidth={9} strokeLinecap="round" />
    </g>
  );
};

export const Birds: React.FC<P> = ({ c, t, seed }) => (
  <g>
    {Array.from({ length: 7 }, (_, i) => {
      const x = (i % 4) * 56 - (i > 3 ? 28 : 0) + Math.sin(t * 0.7 + i) * 8;
      const y = Math.floor(i / 4) * 44 + Math.sin(t * 1.4 + i * 2) * 8;
      const fl = Math.sin(t * 10 + i * 1.7 + seed) * 10;
      return <path key={i} d={`M${x - 20} ${y - fl} Q${x - 8} ${y - fl * 0.2 - 6} ${x} ${y} Q${x + 8} ${y - fl * 0.2 - 6} ${x + 20} ${y - fl}`} stroke={c.night ? c.light : c.shadow} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

export const Comet: React.FC<P> = ({ c, t }) => {
  const k = Math.sin(t * 0.6) * 10;
  return (
    <g transform={`rotate(-24) translate(${k} 0)`}>
      <path d="M0 0 L-420 -26 L-420 26Z" fill="url(#cometTail)" opacity={0.75} />
      <circle r={36} fill={c.sun} opacity={0.3} />
      <circle r={20} fill={c.sun} />
      <circle r={9} fill="#ffffff" />
      <defs><linearGradient id="cometTail" x1="1" x2="0"><stop offset="0" stopColor={c.sun} stopOpacity={0.9} /><stop offset="1" stopColor={c.sun} stopOpacity={0} /></linearGradient></defs>
    </g>
  );
};

export const Eclipse: React.FC<P> = ({ c, t }) => {
  const slide = Math.sin(t * 0.5) * 6;
  return (
    <g>
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const l = 70 + (i % 3) * 24 + Math.sin(t * 3 + i) * 6;
        return <path key={i} d={`M${Math.cos(a) * 62} ${Math.sin(a) * 62} L${Math.cos(a) * l} ${Math.sin(a) * l}`} stroke={c.sun} strokeWidth={3} opacity={0.7} />;
      })}
      <circle r={64} fill={c.sun} opacity={0.4} />
      <circle r={58} fill="#0a0a12" transform={`translate(${slide} 0)`} />
      <circle r={61} fill="none" stroke={c.sun} strokeWidth={3} opacity={0.9} />
    </g>
  );
};

export const Volcano: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-250 0 L-60 -230 L-30 -240 L30 -240 L60 -230 L250 0Z" fill={c.mid} />
    <path d="M-60 -230 L-30 -240 L30 -240 L60 -230 L40 -216 L-40 -216Z" fill={c.glow} opacity={0.9 + Math.sin(t * 6) * 0.1} />
    <path d={`M-10 -216 Q${-30 + Math.sin(t * 2) * 6} -120 -70 -20 M12 -216 Q40 -130 ${80 + Math.sin(t * 2 + 1) * 6} -10`} stroke={c.glow} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.85} />
    <g transform="translate(0 -230)"><Smoke c={c} t={t} seed={seed} puffs={12} height={420} color={mix(c.far, c.shadow, 0.45)} /></g>
  </g>
);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------- vehicles
export const Ship: React.FC<P & { sails?: number }> = ({ c, t, seed }) => {
  const roll = Math.sin(t * 1.7 + seed) * 2.4;
  const bil = Math.sin(t * 2.2 + seed) * 8;
  return (
    <g transform={`translate(0 ${Math.sin(t * 1.7 + seed + 1) * 3}) rotate(${roll} 0 0)`}>
      <path d="M-100 -28 L104 -28 L84 12 L-80 12Z" fill={c.near} />
      <path d="M-100 -28 L-118 -50 L-92 -28Z M104 -28 L124 -44 L98 -28Z" fill={c.near} />
      <path d="M-86 -16 L88 -16" stroke={c.gold} strokeWidth={3} />
      <path d="M-20 -28 L-20 -230 M52 -28 L52 -170" stroke={c.shadow} strokeWidth={5} />
      <path d={`M-20 -222 Q${52 + bil} -150 -20 -70Z`} fill={c.light} stroke={c.shadow} strokeWidth={2.5} />
      <path d={`M52 -164 Q${100 + bil} -118 52 -66Z`} fill={mix(c.light, c.accent, 0.25)} stroke={c.shadow} strokeWidth={2.5} />
      <g transform="translate(-20 -230)"><Cloth len={42} h={26} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g>
      <path d={wave(14, 3, 60, t, 3, -120, 130)} stroke={c.light} strokeWidth={3} fill="none" opacity={0.7} />
    </g>
  );
};

export const Fleet: React.FC<P> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    {[{ x: 0, y: 0, s: 1 }, { x: -230, y: -22, s: 0.78 }, { x: 210, y: -34, s: 0.62 }].map((q, i) => (
      <g key={i} transform={`translate(${q.x} ${q.y}) scale(${q.s})`}><Ship c={c} t={t} seed={seed + i * 2.3} dir={1} /></g>
    ))}
  </g>
);

export const Galley: React.FC<P> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <g transform={`translate(0 ${Math.sin(t * 1.5 + seed) * 2})`}>
      <path d="M-130 -22 L120 -22 L150 -34 L132 4 L-110 4Z" fill={c.near} />
      <path d="M-130 -22 L-146 -48 L-118 -22Z" fill={c.near} />
      <path d="M-86 -22 L-86 -140 M-86 -136 L18 -136 L18 -60 L-86 -60Z" stroke={c.shadow} strokeWidth={4} fill={c.light} />
      <path d="M-76 -136 L-76 -60 M-52 -136 L-52 -60 M-28 -136 L-28 -60 M-4 -136 L-4 -60" stroke={c.accent} strokeWidth={6} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = Math.sin(t * 3 + i * 0.35) * 0.45;
        return <path key={i} d={`M${-104 + i * 30} -8 L${-104 + i * 30 - Math.sin(a) * 36} ${Math.cos(a) * 36}`} stroke={c.shadow} strokeWidth={4} strokeLinecap="round" />;
      })}
      <path d={wave(10, 3, 50, t, 4, -150, 160)} stroke={c.light} strokeWidth={3} fill="none" opacity={0.75} />
    </g>
  </g>
);

const Wheel: React.FC<{ r: number; t: number; speed: number; c: Colors }> = ({ r, t, speed, c }) => (
  <g>
    <circle r={r} fill={c.fore} stroke={c.shadow} strokeWidth={3} />
    <g transform={`rotate(${t * speed})`}>{[0, 60, 120].map((a) => <path key={a} d={`M${-r * 0.85} 0 L${r * 0.85} 0`} stroke={c.light} strokeWidth={2.5} transform={`rotate(${a})`} />)}</g>
    <circle r={r * 0.18} fill={c.light} />
  </g>
);

export const Train: React.FC<P> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <path d="M-300 -4 L190 -4" stroke={c.shadow} strokeWidth={5} />
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${-190 - i * 150} 0)`}>
        <rect x={-62} y={-86} width={124} height={68} rx={4} fill={i ? c.accent2 : c.accent} stroke={c.shadow} strokeWidth={3} />
        {[-36, 0, 36].map((x) => <rect key={x} x={x - 9} y={-72} width={18} height={20} fill={c.night ? c.glow : c.light} />)}
        <g transform="translate(-34 -4)"><Wheel r={13} t={t} speed={420} c={c} /></g><g transform="translate(34 -4)"><Wheel r={13} t={t} speed={420} c={c} /></g>
      </g>
    ))}
    <rect x={-110} y={-100} width={86} height={80} rx={4} fill={c.near} stroke={c.shadow} strokeWidth={3} />
    <rect x={-100} y={-90} width={30} height={30} fill={c.night ? c.glow : c.light} />
    <rect x={-24} y={-86} width={150} height={52} rx={26} fill={c.fore} stroke={c.shadow} strokeWidth={3} />
    <path d="M70 -138 L70 -84 L96 -84 L102 -138 Z" fill={c.fore} />
    <path d="M118 -34 L156 -4 L118 -4Z" fill={c.accent} />
    <g transform="translate(83 -138)"><Smoke c={c} t={t} seed={seed} puffs={10} height={280} color={mix(c.light, c.far, 0.5)} /></g>
    {[-70, -30, 40, 96].map((x, i) => <g key={x} transform={`translate(${x} -14)`}><Wheel r={i === 1 ? 26 : 20} t={t} speed={300} c={c} /></g>)}
  </g>
);

export const Tank: React.FC<P> = ({ c, t, seed, dir }) => {
  const shot = ((t * 0.5 + seed * 0.1) % 1);
  const recoil = shot < 0.08 ? -10 * (1 - shot / 0.08) : 0;
  return (
    <g transform={`scale(${dir} 1)`}>
      <g transform={`translate(0 ${Math.sin(t * 14 + seed) * 1.5})`}>
        <path d="M-96 -28 L96 -28 L112 -60 L-80 -60Z" fill={c.near} stroke={c.shadow} strokeWidth={3} />
        <path d="M-40 -60 L50 -60 L40 -92 L-28 -92Z" fill={c.mid} stroke={c.shadow} strokeWidth={3} />
        <rect x={40 + recoil} y={-82} width={104} height={9} fill={c.shadow} />
        {shot < 0.12 && <circle cx={150} cy={-78} r={24 * (1 - shot / 0.12) + 6} fill={c.glow} opacity={0.9} />}
        <rect x={-110} y={-30} width={226} height={30} rx={15} fill={c.fore} stroke={c.shadow} strokeWidth={3} />
        {[-82, -44, -6, 32, 70, 100].map((x) => <g key={x} transform={`translate(${x} -15)`}><Wheel r={11} t={t} speed={-260} c={c} /></g>)}
      </g>
    </g>
  );
};

export const Plane: React.FC<P> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1) rotate(${Math.sin(t * 1.2 + seed) * 4})`}>
    <ellipse cx={0} cy={0} rx={74} ry={15} fill={c.near} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-70 -6 L-112 -34 L-92 -6Z" fill={c.mid} stroke={c.shadow} strokeWidth={2.5} />
    <rect x={-34} y={-34} width={70} height={9} rx={3} fill={c.accent2} stroke={c.shadow} strokeWidth={2.5} />
    <rect x={-34} y={16} width={70} height={9} rx={3} fill={c.accent2} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-20 -26 L-20 18 M24 -26 L24 18" stroke={c.shadow} strokeWidth={3} />
    <circle cx={30} cy={-6} r={8} fill={c.light} />
    <g transform="translate(76 0)"><ellipse rx={4} ry={Math.abs(Math.sin(t * 40)) * 30 + 6} fill={c.light} opacity={0.7} /></g>
  </g>
);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------- structures
const lit = (c: Colors) => (c.night ? c.glow : mix(c.light, c.shadow, 0.5));
const Battlements: React.FC<{ x: number; y: number; w: number; fill: string }> = ({ x, y, w, fill }) => (
  <g fill={fill}>{Array.from({ length: Math.floor(w / 22) }, (_, i) => <rect key={i} x={x + i * 22} y={y - 12} width={12} height={12} />)}</g>
);

export const Castle: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-170, -150, 340, 150)} fill={c.near} />
    <Battlements x={-170} y={-150} w={340} fill={c.near} />
    <path d={rect(-60, -250, 120, 100)} fill={c.mid} /><Battlements x={-60} y={-250} w={120} fill={c.mid} />
    {[-210, 210].map((x) => (
      <g key={x}>
        <path d={rect(x - 34, -210, 68, 210)} fill={c.near} />
        <path d={tri(x, -210, 96, 74)} fill={c.accent2} />
        <path d={rect(x - 5, -170, 10, 26)} fill={lit(c)} />
      </g>
    ))}
    <path d="M-30 0 L-30 -64 A30 30 0 0 1 30 -64 L30 0Z" fill={c.fore} />
    {[-110, -70, 70, 110].map((x) => <path key={x} d={rect(x - 5, -112, 10, 30)} fill={lit(c)} />)}
    <path d={rect(-4, -200, 8, 40)} fill={lit(c)} />
    <g transform="translate(0 -250)"><path d="M0 0 L0 -64" stroke={c.shadow} strokeWidth={4} /><g transform="translate(0 -64)"><Cloth len={46} h={30} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>
  </g>
);

export const Temple: React.FC<P> = ({ c }) => (
  <g>
    {[0, 1, 2].map((i) => <path key={i} d={rect(-190 + i * 14, -i * 14 - 14, 380 - i * 28, 14)} fill={mix(c.light, c.shadow, 0.28 + i * 0.05)} />)}
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i}>
        <path d={rect(-156 + i * 52, -190, 28, 148)} fill={c.light} stroke={c.shadow} strokeWidth={2} />
        <path d={`M${-146 + i * 52} -188 v146 M${-136 + i * 52} -188 v146`} stroke={mix(c.light, c.shadow, 0.45)} strokeWidth={2} />
        <path d={rect(-162 + i * 52, -204, 40, 14)} fill={mix(c.light, c.shadow, 0.15)} stroke={c.shadow} strokeWidth={2} />
      </g>
    ))}
    <path d={rect(-176, -222, 352, 18)} fill={c.accent2} />
    <path d="M-186 -222 L0 -310 L186 -222Z" fill={c.light} stroke={c.shadow} strokeWidth={3} />
    <path d="M-120 -230 L0 -288 L120 -230Z" fill={mix(c.light, c.accent, 0.35)} />
  </g>
);

export const Pyramids: React.FC<P> = ({ c }) => (
  <g>
    {[{ x: 120, s: 0.62 }, { x: -140, s: 0.45 }, { x: 0, s: 1 }].map((p, i) => (
      <g key={i} transform={`translate(${p.x} ${i === 0 ? -6 : 0}) scale(${p.s})`}>
        <path d="M-210 0 L0 -240 L210 0Z" fill={mix(c.light, c.skyBottom, 0.2)} />
        <path d="M0 -240 L210 0 L40 0 L0 -60Z" fill={mix(c.light, c.shadow, 0.38)} />
        {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M${-210 * (1 - k)} ${-240 * k} L${210 * (1 - k)} ${-240 * k}`} stroke={mix(c.light, c.shadow, 0.3)} strokeWidth={2} opacity={0.6} />)}
      </g>
    ))}
  </g>
);

export const Tower: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-44 0 L-34 -300 L34 -300 L44 0Z" fill={c.near} />
    <path d="M-44 -300 L44 -300 L44 -318 L-44 -318Z" fill={c.mid} /><Battlements x={-44} y={-318} w={88} fill={c.mid} />
    <path d={rect(-7, -240, 14, 34)} fill={lit(c)} /><path d={rect(-7, -170, 14, 34)} fill={lit(c)} />
    <g transform="translate(0 -318)"><path d="M0 0 L0 -58" stroke={c.shadow} strokeWidth={4} /><g transform="translate(0 -58)"><Cloth len={42} h={26} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>
  </g>
);

export const Gate: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-300, -130, 600, 130)} fill={c.mid} /><Battlements x={-300} y={-130} w={600} fill={c.mid} />
    {[-210, 210].map((x) => <g key={x}><path d={rect(x - 44, -230, 88, 230)} fill={c.near} /><Battlements x={x - 44} y={-230} w={88} fill={c.near} /><path d={rect(x - 6, -180, 12, 30)} fill={lit(c)} /></g>)}
    <path d="M-60 0 L-60 -90 A60 60 0 0 1 60 -90 L60 0Z" fill={c.fore} />
    <path d="M-44 0 V-96 M-22 0 V-112 M0 0 V-118 M22 0 V-112 M44 0 V-96" stroke={c.shadow} strokeWidth={4} opacity={0.8} />
  </g>
);

export const Windmill: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-48 0 L-26 -190 L26 -190 L48 0Z" fill={c.near} />
    <path d="M-34 -190 L0 -236 L34 -190Z" fill={c.accent2} />
    <path d={rect(-9, -60, 18, 60)} fill={c.fore} />
    <g transform={`translate(0 -190) rotate(${t * 38 + seed * 20})`}>
      {[0, 90, 180, 270].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M0 0 L0 -150" stroke={c.shadow} strokeWidth={5} /><path d="M6 -28 L38 -30 L38 -138 L6 -138Z" fill={c.light} stroke={c.shadow} strokeWidth={2} opacity={0.95} /></g>)}
      <circle r={9} fill={c.shadow} />
    </g>
  </g>
);

export const Factory: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-190 0 L-190 -110 L-150 -150 L-150 -110 L-110 -150 L-110 -110 L-70 -150 L-70 -110 L190 -110 L190 0Z" fill={c.near} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-170 + i * 52} y={-84} width={22} height={32} fill={c.night ? c.glow : mix(c.near, c.light, 0.35)} />)}
    {[-130, 50, 130].map((x, i) => (
      <g key={x} transform={`translate(${x} -110)`}>
        <path d={`M-14 0 L-10 -${150 + i * 28} L10 -${150 + i * 28} L14 0Z`} fill={c.mid} />
        <path d={`M-12 -${150 + i * 28} h24`} stroke={c.accent} strokeWidth={6} />
        <g transform={`translate(0 -${150 + i * 28})`}><Smoke c={c} t={t} seed={seed + i * 1.7} puffs={9} height={300} color={mix(c.far, c.shadow, 0.4)} /></g>
      </g>
    ))}
  </g>
);

export const Lighthouse: React.FC<P> = ({ c, t }) => {
  const beam = (Math.sin(t * 1.3) + 1) / 2;
  return (
    <g>
      <path d="M-34 0 L-20 -250 L20 -250 L34 0Z" fill={c.light} stroke={c.shadow} strokeWidth={2.5} />
      <path d="M-30 -60 L30 -60 L27 -100 L-27 -100Z M-24 -160 L24 -160 L21 -200 L-21 -200Z" fill={c.accent} />
      <path d={rect(-26, -278, 52, 28)} fill={c.glow} opacity={0.9} />
      <path d="M-32 -250 L32 -250 L0 -320Z" fill={c.shadow} />
      <path d="M0 -264 L420 -330 L420 -200Z" fill={c.glow} opacity={0.12 + beam * 0.3} />
      <path d="M0 -264 L-420 -200 L-420 -330Z" fill={c.glow} opacity={0.12 + (1 - beam) * 0.3} />
    </g>
  );
};

export const Tents: React.FC<P> = ({ c, t, seed }) => (
  <g>
    {[{ x: -130, s: 0.8 }, { x: 110, s: 0.9 }, { x: -10, s: 1.15 }].map((q, i) => (
      <g key={i} transform={`translate(${q.x} ${i === 2 ? 14 : 0}) scale(${q.s})`}>
        <path d="M-90 0 L0 -110 L90 0Z" fill={i % 2 ? c.light : mix(c.light, c.accent, 0.3)} stroke={c.shadow} strokeWidth={3} />
        <path d="M0 -110 L-24 0 L24 0Z" fill={c.shadow} opacity={0.85} />
        {i === 2 && <g transform="translate(0 -110)"><path d="M0 0 L0 -50" stroke={c.shadow} strokeWidth={4} /><g transform="translate(0 -50)"><Cloth len={40} h={24} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>}
      </g>
    ))}
  </g>
);

export const Bridge: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-330 -90 L330 -90 L330 -66 L-330 -66Z" fill={c.near} />
    {[-220, 0, 220].map((x) => <path key={x} d={`M${x - 100} -66 L${x - 100} 0 L${x + 100} 0 L${x + 100} -66 A100 70 0 0 0 ${x - 100} -66Z`} fill={c.near} />)}
    {[-110, 110].map((x) => <path key={x} d={rect(x - 14, -66, 28, 66)} fill={c.mid} />)}
    <path d={wave(-2, 3, 70, t, 2.5, -330, 330)} stroke={c.light} strokeWidth={3} fill="none" opacity={0.6} />
  </g>
);

export const Ruins: React.FC<P> = ({ c }) => (
  <g>
    {[{ x: -130, h: 170 }, { x: -60, h: 100 }, { x: 40, h: 200 }, { x: 120, h: 60 }].map((q, i) => (
      <g key={i}><path d={`M${q.x - 15} 0 L${q.x - 15} ${-q.h} L${q.x - 4} ${-q.h - 12} L${q.x + 6} ${-q.h + 6} L${q.x + 15} ${-q.h - 4} L${q.x + 15} 0Z`} fill={c.light} stroke={c.shadow} strokeWidth={2} /><path d={`M${q.x - 5} ${-q.h + 14} V0`} stroke={mix(c.light, c.shadow, 0.4)} strokeWidth={2} /></g>
    ))}
    <path d="M-30 0 L-10 -18 L60 -12 L84 0Z" fill={mix(c.light, c.shadow, 0.3)} />
    <path d="M150 0 L150 -86 A44 44 0 0 1 238 -86 L238 0 L226 0 L226 -84 A32 32 0 0 0 162 -84 L162 0Z" fill={c.mid} />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------- props
export const Scroll: React.FC<P> = ({ c, t }) => (
  <g transform={`rotate(${-6 + Math.sin(t * 1.1) * 1.5})`}>
    <path d="M-70 -92 Q-70 -104 -58 -104 L58 -104 Q70 -104 70 -92 L70 -8 Q70 4 58 4 L-58 4 Q-70 4 -70 -8Z" fill={c.light} stroke={c.shadow} strokeWidth={3} />
    {[-80, -64, -48, -32, -18].map((y, i) => <path key={y} d={`M${-50} ${y} L${i % 2 ? 36 : 50} ${y}`} stroke={c.shadow} strokeWidth={4} opacity={0.5} strokeLinecap="round" />)}
    <ellipse cx={-70} cy={-50} rx={11} ry={56} fill={mix(c.light, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={3} />
    <ellipse cx={70} cy={-50} rx={11} ry={56} fill={mix(c.light, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={3} />
    <circle cx={34} cy={-26} r={12} fill={c.accent} />
  </g>
);

export const Crown: React.FC<P> = ({ c, t }) => (
  <g>
    <ellipse cx={0} cy={-30} rx={86} ry={26} fill={c.glow} opacity={0.18 + Math.sin(t * 2) * 0.05} />
    <path d="M-60 -20 L-70 -96 L-32 -62 L0 -110 L32 -62 L70 -96 L60 -20Z" fill={c.gold} stroke={c.shadow} strokeWidth={3} />
    <path d="M-62 -20 H62 V0 H-62Z" fill={mix(c.gold, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={3} />
    {[-30, 0, 30].map((x, i) => <circle key={x} cx={x} cy={-10} r={6} fill={[c.accent, '#3b82c4', c.accent][i]} />)}
    {[0.2, 0.9, 1.7].map((p, i) => <path key={i} d={`M${-50 + i * 50} ${-80 + i * 10} l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4Z`} fill="#fff" opacity={0.5 + Math.sin(t * 4 + p * 3) * 0.5} />)}
  </g>
);

export const Sword: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-5 0 L-13 -220 L0 -250 L13 -220 L5 0Z" fill={c.light} stroke={c.shadow} strokeWidth={3} />
    <path d="M0 -10 L0 -236" stroke={mix(c.light, c.shadow, 0.4)} strokeWidth={3} />
    <path d="M-48 -4 L48 -4 L48 8 L-48 8Z" fill={c.gold} stroke={c.shadow} strokeWidth={3} />
    <path d="M-6 8 L-6 70 L6 70 L6 8Z" fill={c.accent2} stroke={c.shadow} strokeWidth={3} />
    <circle cx={0} cy={80} r={11} fill={c.gold} stroke={c.shadow} strokeWidth={3} />
    <path d={`M${-8 + Math.sin(t * 2) * 4} -170 l4 -14 l4 14 l14 4 l-14 4 l-4 14 l-4 -14 l-14 -4Z`} fill="#fff" opacity={0.5 + Math.sin(t * 5) * 0.4} />
  </g>
);

export const Chest: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-80 0 L-80 -60 L80 -60 L80 0Z" fill={mix(c.accent2, c.shadow, 0.4)} stroke={c.shadow} strokeWidth={3} />
    <path d="M-80 -60 Q0 -110 80 -60 L80 -70 Q0 -120 -80 -70Z" fill={mix(c.accent2, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={3} />
    <path d="M-80 -60 L-80 -20 M80 -60 L80 -20 M0 -60 L0 0" stroke={c.gold} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={-60 + i * 11 + (i % 2) * 4} cy={-74 - (i % 3) * 6} rx={9} ry={5} fill={c.gold} stroke={c.shadow} strokeWidth={1.5} />)}
    {[0.4, 1.9, 3.2].map((p, i) => <path key={i} d={`M${-40 + i * 40} ${-96 - i * 4} l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3Z`} fill="#fff" opacity={0.5 + Math.sin(t * 4 + p * 4) * 0.5} />)}
  </g>
);

export const Torch: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-6 0 L-3 -150 L3 -150 L6 0Z" fill={c.shadow} />
    <path d="M-14 -150 L14 -150 L8 -170 L-8 -170Z" fill={c.accent2} stroke={c.shadow} strokeWidth={2} />
    <g transform="translate(0 -168)"><Fire c={c} t={t} seed={seed} dir={1} size={0.55} /></g>
  </g>
);

export const Banner: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M0 0 L0 -300" stroke={c.shadow} strokeWidth={7} />
    <circle cx={0} cy={-304} r={9} fill={c.gold} />
    <g transform="translate(0 -290)"><Cloth len={170} h={110} t={t} seed={seed} fill={c.accent} stroke={c.shadow} speed={4} /></g>
    <g transform="translate(0 -290)"><path d="M0 52 L170 52" stroke={c.gold} strokeWidth={4} opacity={0.0} /></g>
  </g>
);

export const Throne: React.FC<P> = ({ c, t, seed }) => (
  <g>
    {[0, 1, 2].map((i) => <path key={i} d={rect(-120 + i * 14, -i * 14 - 14, 240 - i * 28, 14)} fill={mix(c.accent, c.shadow, 0.35 + i * 0.1)} />)}
    <path d="M-52 -42 L-52 -230 Q0 -270 52 -230 L52 -42Z" fill={c.accent2} stroke={c.shadow} strokeWidth={3} />
    <path d="M-62 -42 L62 -42 L62 -90 L-62 -90Z" fill={c.accent} stroke={c.shadow} strokeWidth={3} />
    <path d="M-52 -230 Q0 -270 52 -230" stroke={c.gold} strokeWidth={6} fill="none" />
    <circle cx={0} cy={-200} r={14} fill={c.gold} opacity={0.9} />
    <g transform="translate(-72 -42)"><path d="M0 0 L0 -120" stroke={c.shadow} strokeWidth={5} /><g transform="translate(0 -118)"><Cloth len={26} h={36} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>
  </g>
);

export const MapTable: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-140 -110 L140 -110 L170 -70 L-170 -70Z" fill={c.light} stroke={c.shadow} strokeWidth={3} />
    <path d="M-110 -100 Q-60 -90 -20 -102 T70 -96 M-80 -86 Q-30 -78 30 -88" stroke={c.shadow} strokeWidth={3} fill="none" opacity={0.55} />
    <path d="M-60 -98 L40 -84" stroke={c.accent} strokeWidth={4} strokeDasharray="8 7" />
    <circle cx={-60} cy={-98} r={6} fill={c.accent} /><circle cx={40} cy={-84} r={6} fill={c.accent} />
    <path d="M-170 -70 L170 -70 L170 -56 L-170 -56Z M-150 -56 L-150 0 M150 -56 L150 0" stroke={c.shadow} strokeWidth={8} fill={mix(c.accent2, c.shadow, 0.5)} />
    <g transform="translate(120 -110)"><path d="M-6 0 L-6 -30 L6 -30 L6 0Z" fill={c.light} stroke={c.shadow} strokeWidth={2} /><path d={`M0 -30 Q${-6 + Math.sin(t * 12) * 2} -44 0 -56 Q${6 + Math.sin(t * 10) * 2} -44 0 -30Z`} fill={c.glow} /></g>
  </g>
);

export const Cannon: React.FC<P> = ({ c, t, seed, dir }) => {
  const shot = ((t * 0.45 + seed * 0.1) % 1);
  const recoil = shot < 0.1 ? -14 * (1 - shot / 0.1) : 0;
  return (
    <g transform={`scale(${dir} 1)`}>
      <g transform={`translate(${recoil} 0)`}>
        <path d="M-70 -64 L80 -78 L80 -52 L-70 -42Z" fill={c.fore} stroke={c.shadow} strokeWidth={3} transform="rotate(-8 0 -60)" />
        <circle cx={-70} cy={-52} r={13} fill={c.fore} />
      </g>
      <path d="M-60 -36 L40 -36 L56 -8 L-76 -8Z" fill={mix(c.accent2, c.shadow, 0.4)} stroke={c.shadow} strokeWidth={3} />
      <g transform="translate(-6 -4)"><circle r={30} fill={mix(c.accent2, c.shadow, 0.45)} stroke={c.shadow} strokeWidth={4} /><g transform={`rotate(${t * 0})`}>{[0, 45, 90, 135].map((a) => <path key={a} d="M-30 0 L30 0" stroke={c.shadow} strokeWidth={3} transform={`rotate(${a})`} />)}</g></g>
      {shot < 0.18 && <g transform="translate(96 -82)"><circle r={34 * (1 - shot / 0.18) + 8} fill={c.glow} opacity={0.95} /><circle r={16 * (1 - shot / 0.18)} fill="#fff" /></g>}
      {shot >= 0.04 && <g transform="translate(96 -82)"><Smoke c={c} t={t} seed={seed} puffs={6} height={90} color={mix(c.light, c.far, 0.5)} /></g>}
    </g>
  );
};

export { Person };
