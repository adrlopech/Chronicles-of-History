import React from 'react';
import { Colors, mix } from './palette';
import { Cloth, Drawn, rect, tri } from './draw';
import { Smoke } from './things';

type P = Drawn & { c: Colors };
const lit = (c: Colors) => (c.night ? c.glow : mix(c.light, c.shadow, 0.5));
/** An arch opening: its left foot at (x, y), `w` wide and `h` tall, round at the top. */
const arch = (x: number, y: number, w: number, h: number) => `M${x} ${y} v${-(h - w / 2)} a${w / 2} ${w / 2} 0 0 1 ${w} 0 v${h - w / 2}Z`;
const stone = (c: Colors, k = 0) => mix(c.light, c.shadow, 0.3 + k * 0.08);
const wood = (c: Colors, k = 0) => mix(c.near, c.shadow, 0.25 + k * 0.1);
const roofCol = (c: Colors) => c.accent2;
const Battle: React.FC<{ x: number; y: number; w: number; fill: string }> = ({ x, y, w, fill }) => <g fill={fill}>{Array.from({ length: Math.floor(w / 20) }, (_, i) => <rect key={i} x={x + i * 20} y={y - 11} width={11} height={11} />)}</g>;

// ------------------------------------------------------------------------------------------------------------------------------------------------ the ancient world
export const Ziggurat: React.FC<P> = ({ c }) => (
  <g>
    {[0, 1, 2, 3].map((i) => <path key={i} d={rect(-190 + i * 36, -(i + 1) * 52, 380 - i * 72, 52)} fill={mix(c.near, c.light, 0.15 + i * 0.12)} stroke={c.shadow} strokeWidth={2} />)}
    <path d="M-16 0 L-8 -208 L8 -208 L16 0Z" fill={mix(c.mid, c.shadow, 0.3)} />
    {[0, 1, 2].map((i) => <path key={i} d={`M-14 ${-i * 52 - 6} h28`} stroke={c.shadow} strokeWidth={2} />)}
    <path d={rect(-30, -246, 60, 38)} fill={c.accent2} stroke={c.shadow} strokeWidth={2} /><path d={rect(-8, -236, 16, 28)} fill={c.fore} />
  </g>
);
export const Colosseum: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-230 0 L-230 -150 Q0 -190 230 -150 L230 0Z" fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    {[0, 1, 2].map((r) => Array.from({ length: 12 - r }, (_, i) => <path key={`${r}${i}`} d={arch(-206 + i * (412 / (12 - r)) + 4, -r * 46 - 6, 20, 30)} fill={c.fore} opacity={0.88} />))}
    <path d="M-230 -150 Q0 -190 230 -150" stroke={c.shadow} strokeWidth={4} fill="none" />
    <path d="M150 -166 L170 -178 L196 -158 L172 -150Z" fill={mix(c.skyMid, c.far, 0.2)} opacity={0.9} />
    <path d="M-230 -2 h460" stroke={c.shadow} strokeWidth={5} />
  </g>
);
export const Aqueduct: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-280, -190, 560, 30)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2} />
    <path d={rect(-280, -160, 560, 70)} fill={stone(c)} stroke={c.shadow} strokeWidth={2} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={arch(-270 + i * 46, -92, 28, 52)} fill={c.fore} opacity={0.85} />)}
    <path d={rect(-280, -90, 560, 90)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={arch(-262 + i * 92, 0, 62, 80)} fill={c.fore} opacity={0.9} />)}
    <path d="M-280 -176 h560" stroke={c.water} strokeWidth={5} opacity={0.8} />
  </g>
);
export const Obelisk: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-38, -22, 76, 22)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} />
    <path d="M-26 -22 L-17 -300 L17 -300 L26 -22Z" fill={mix(c.light, c.shadow, 0.18)} stroke={c.shadow} strokeWidth={2} />
    <path d="M-17 -300 L0 -340 L17 -300Z" fill={c.gold} stroke={c.shadow} strokeWidth={1.5} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-6 ${-60 - i * 28} h12 M-3 ${-68 - i * 28} v8`} stroke={c.shadow} strokeWidth={2} opacity={0.7} />)}
  </g>
);
export const Sphinx: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-150 0 L-150 -50 Q-120 -76 -40 -70 L40 -62 L40 0Z" fill={mix(c.light, c.near, 0.4)} stroke={c.shadow} strokeWidth={2} />
    <path d="M40 -4 L130 -4 L130 -22 L40 -26Z" fill={mix(c.light, c.near, 0.4)} stroke={c.shadow} strokeWidth={2} />
    <path d="M30 -62 Q30 -150 70 -150 Q108 -150 108 -62Z" fill={mix(c.light, c.near, 0.4)} stroke={c.shadow} strokeWidth={2} />
    <path d="M24 -94 Q70 -160 112 -94 L120 -40 L100 -40 L96 -90 L44 -90 L40 -40 L16 -40Z" fill={c.gold} opacity={0.9} stroke={c.shadow} strokeWidth={1.5} />
    <ellipse cx={78} cy={-104} rx={4} ry={3} fill={c.shadow} /><path d="M72 -90 h14" stroke={c.shadow} strokeWidth={2.5} />
  </g>
);
export const GreatWall: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-340 0 L-340 -70 L-200 -110 L-60 -90 L80 -150 L220 -120 L340 -170 L340 0Z" fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-340 -70 L-200 -110 L-60 -90 L80 -150 L220 -120 L340 -170" stroke={c.shadow} strokeWidth={5} fill="none" />
    {[[-200, -110], [80, -150], [340, -170]].map(([x, y]) => <g key={x}><path d={rect(x - 30, y - 70, 60, 70)} fill={stone(c)} stroke={c.shadow} strokeWidth={2} /><Battle x={x - 30} y={y - 70} w={60} fill={stone(c)} /><path d={rect(x - 6, y - 48, 12, 22)} fill={lit(c)} /></g>)}
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-320 + i * 48} ${-40 - i * 5} v-12`} stroke={c.shadow} strokeWidth={2} opacity={0.5} />)}
  </g>
);
export const TriumphalArch: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-150, -190, 300, 190)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(-170, -222, 340, 36)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={arch(-48, 0, 96, 140)} fill={c.fore} /><path d={arch(-132, 0, 36, 90)} fill={c.fore} opacity={0.9} /><path d={arch(96, 0, 36, 90)} fill={c.fore} opacity={0.9} />
    <path d="M-140 -208 h280 M-140 -198 h280" stroke={c.shadow} strokeWidth={2} opacity={0.6} />
    {[-110, -50, 50, 110].map((x) => <path key={x} d={rect(x - 8, -184, 16, 40)} fill={mix(c.light, c.shadow, 0.4)} opacity={0.7} />)}
    <path d="M-30 -222 L-30 -250 L30 -250 L30 -222Z" fill={c.gold} stroke={c.shadow} strokeWidth={2} />
  </g>
);
export const Stonehenge: React.FC<P> = ({ c }) => (
  <g>
    {[[-230, 1], [-110, 0.85], [20, 1], [140, 0.85], [250, 1]].map(([x, s], i) => (
      <g key={i} transform={`translate(${x} 0) scale(${s})`}>
        <path d={rect(-52, -150, 30, 150)} fill={mix(c.mid, c.light, 0.35)} stroke={c.shadow} strokeWidth={2.5} /><path d={rect(22, -150, 30, 150)} fill={mix(c.near, c.light, 0.25)} stroke={c.shadow} strokeWidth={2.5} />
        <path d={rect(-66, -186, 132, 38)} fill={mix(c.mid, c.light, 0.4)} stroke={c.shadow} strokeWidth={2.5} />
      </g>
    ))}
  </g>
);
export const Hut: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-70 0 L-70 -70 L70 -70 L70 0Z" fill={mix(c.near, c.light, 0.2)} stroke={c.shadow} strokeWidth={2} />
    <path d="M-92 -64 L0 -170 L92 -64Z" fill={mix('#b49650', c.mid, 0.4)} stroke={c.shadow} strokeWidth={2} />
    {[-60, -30, 0, 30, 60].map((x) => <path key={x} d={`M${x * 0.6} -168 L${x} -64`} stroke={c.shadow} strokeWidth={1.4} opacity={0.5} />)}
    <path d={arch(-16, 0, 32, 54)} fill={c.fore} /><Smoke c={c} t={t} seed={seed} puffs={5} height={90} color={c.far} />
  </g>
);
export const Palisade: React.FC<P> = ({ c }) => (
  <g>
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${-250 + i * 24} 0 V${-130 - (i % 3) * 10} L${-238 + i * 24} ${-152 - (i % 3) * 10} L${-226 + i * 24} ${-130 - (i % 3) * 10} V0Z`} fill={wood(c, i % 3)} stroke={c.shadow} strokeWidth={1.4} />)}
    <path d={rect(-60, -110, 120, 110)} fill={c.fore} opacity={0.85} /><path d="M-60 -110 H60 M-60 -60 H60" stroke={wood(c, 2)} strokeWidth={6} />
    <path d={rect(-262, -168, 40, 10)} fill={wood(c, 1)} /><path d={rect(222, -168, 40, 10)} fill={wood(c, 1)} />
  </g>
);
export const Harbor: React.FC<P> = ({ c, t }) => (
  <g>
    <path d={rect(-300, -26, 600, 16)} fill={wood(c, 1)} stroke={c.shadow} strokeWidth={2} />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={rect(-290 + i * 56, -10, 10, 56)} fill={wood(c, 2)} />)}
    {[[-190, 40], [-140, 30], [120, 36]].map(([x, s], i) => <path key={i} d={rect(x, -26 - s, s, s)} fill={wood(c)} stroke={c.shadow} strokeWidth={2} />)}
    <path d="M200 -26 V-170 L270 -170" stroke={c.shadow} strokeWidth={8} fill="none" /><path d={`M262 -170 V${-120 + Math.sin(t * 1.5) * 8}`} stroke={c.shadow} strokeWidth={2.5} /><rect x={254} y={-120 + Math.sin(t * 1.5) * 8} width={16} height={16} fill={wood(c)} />
    <path d="M-300 14 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke={c.water2} strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);
export const Market: React.FC<P> = ({ c }) => (
  <g>
    {[-170, 0, 170].map((x, i) => (
      <g key={x}>
        <path d={`M${x - 70} -120 L${x + 70} -120 L${x + 80} -90 L${x - 80} -90Z`} fill={i % 2 ? c.accent : c.light} stroke={c.shadow} strokeWidth={2} />
        {[-60, -30, 0, 30, 60].map((dx, j) => <path key={j} d={`M${x + dx} -120 l${dx > 0 ? 3 : -3} 30`} stroke={i % 2 ? c.light : c.accent} strokeWidth={9} opacity={0.9} />)}
        <path d={`M${x - 64} -90 V0 M${x + 64} -90 V0`} stroke={wood(c, 2)} strokeWidth={5} /><path d={rect(x - 70, -40, 140, 14)} fill={wood(c)} stroke={c.shadow} strokeWidth={2} />
        {[-40, -10, 22, 46].map((dx, j) => <circle key={j} cx={x + dx} cy={-48} r={8} fill={[c.accent, c.gold, c.accent2, c.mid][(i + j) % 4]} stroke={c.shadow} strokeWidth={1} />)}
      </g>
    ))}
  </g>
);
export const Well: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-40 0 L-40 -50 Q0 -62 40 -50 L40 0Z" fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} /><ellipse cx={0} cy={-52} rx={40} ry={9} fill={c.water} stroke={c.shadow} strokeWidth={2} />
    <path d="M-36 -52 V-130 M36 -52 V-130" stroke={wood(c, 2)} strokeWidth={6} /><path d="M-52 -128 L0 -166 L52 -128Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2} />
    <path d="M0 -128 V" stroke="none" /><path d={`M0 -128 V${-70 + Math.sin(t * 1.2) * 4}`} stroke={c.shadow} strokeWidth={1.6} /><rect x={-7} y={-70 + Math.sin(t * 1.2) * 4} width={14} height={13} rx={2} fill={wood(c)} stroke={c.shadow} strokeWidth={1.2} />
  </g>
);
export const Library: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-170, -160, 340, 160)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-190 -160 L0 -230 L190 -160Z" fill={mix(c.light, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={rect(-150 + i * 56, -150, 22, 146)} fill={c.light} stroke={c.shadow} strokeWidth={1.6} />)}
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={arch(-124 + i * 56, -6, 30, 120)} fill={c.fore} opacity={0.0} />)}
    <path d={arch(-26, 0, 52, 90)} fill={c.fore} /><circle cx={0} cy={-190} r={10} fill={lit(c)} stroke={c.shadow} strokeWidth={1.6} />
    {[-110, 110].map((x) => <path key={x} d={rect(x - 22, -126, 44, 50)} fill={lit(c)} opacity={0.8} />)}
  </g>
);
export const Theater: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-250 0 Q-250 -170 0 -170 Q250 -170 250 0Z" fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-230 + i * 38} -${i * 6 + 2} Q0 ${-150 + i * 18} ${230 - i * 38} -${i * 6 + 2}`} stroke={c.shadow} strokeWidth={2} fill="none" opacity={0.6} />)}
    <path d={rect(-110, -96, 220, 96)} fill={mix(c.light, c.shadow, 0.35)} stroke={c.shadow} strokeWidth={2.5} />
    {[-60, 0, 60].map((x) => <path key={x} d={arch(x - 16, 0, 32, 70)} fill={c.fore} opacity={0.9} />)}
    {[-70, -20, 30, 80].map((x, i) => <circle key={i} cx={x} cy={-8} r={6} fill={c.shadow} opacity={0.5} />)}
  </g>
);
export const Adobe: React.FC<P> = ({ c }) => (
  <g>
    {[[-150, 0, 120, 90], [-30, 0, 130, 130], [100, 0, 110, 80], [-90, -90, 80, 70], [-8, -130, 70, 60]].map(([x, y, w, h], i) => (
      <g key={i}><path d={rect(x, y - h, w, h)} fill={mix('#c89a6a', c.mid, 0.35 + (i % 2) * 0.1)} stroke={c.shadow} strokeWidth={2} /><path d={rect(x + w * 0.2, y - h * 0.55, 16, 24)} fill={c.fore} opacity={0.85} /><path d={`M${x + w - 4} ${y - h} v-8 M${x + w - 14} ${y - h} v-6`} stroke={wood(c, 1)} strokeWidth={4} /></g>
    ))}
    <path d="M60 0 L78 -130" stroke={wood(c, 1)} strokeWidth={4} /><path d="M68 -30 h12 M72 -60 h12 M76 -90 h12" stroke={wood(c, 1)} strokeWidth={3} />
  </g>
);
export const Tomb: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-130, -26, 260, 26)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} />
    <path d={rect(-110, -130, 220, 104)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={rect(-100 + i * 36, -124, 14, 92)} fill={c.light} stroke={c.shadow} strokeWidth={1.4} />)}
    {[0, 1, 2, 3].map((i) => <path key={i} d={rect(-118 + i * 14, -130 - (i + 1) * 20, 236 - i * 28, 20)} fill={mix(c.light, c.shadow, 0.25 + i * 0.05)} stroke={c.shadow} strokeWidth={1.6} />)}
    <path d={arch(-18, -26, 36, 66)} fill={c.fore} />
  </g>
);
export const Palace: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-250, -120, 500, 120)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(-70, -190, 140, 190)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-80 -190 Q0 -290 80 -190Z" fill={c.gold} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={rect(-62 + i * 28, -182, 12, 176)} fill={c.light} stroke={c.shadow} strokeWidth={1.4} />)}
    {[-200, -150, -100, 100, 150, 200].map((x) => <path key={x} d={arch(x - 12, -16, 24, 70)} fill={lit(c)} opacity={0.85} />)}
    <path d={arch(-22, 0, 44, 80)} fill={c.fore} />
    {[-250, 250].map((x) => <g key={x} transform={`translate(${x} -120)`}><path d="M0 0 V-60" stroke={c.shadow} strokeWidth={3} /><g transform="translate(0 -60)"><Cloth len={34} h={22} t={t} seed={seed + x} fill={c.accent} stroke={c.shadow} /></g></g>)}
  </g>
);

// ------------------------------------------------------------------------------------------------------------------------------------------------ the middle ages
export const Cathedral: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-110, -160, 220, 160)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    {[-82, 82].map((x) => <g key={x}><path d={rect(x - 34, -250, 68, 250)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2.5} /><path d={tri(x, -250, 80, 130)} fill={roofCol(c)} stroke={c.shadow} strokeWidth={2} /><path d={arch(x - 10, -150, 20, 56)} fill={lit(c)} /></g>)}
    <path d={tri(0, -160, 132, 52)} fill={roofCol(c)} stroke={c.shadow} strokeWidth={2} />
    <circle cx={0} cy={-120} r={26} fill={c.accent} stroke={c.shadow} strokeWidth={3} /><circle cx={0} cy={-120} r={26} fill="none" stroke={c.gold} strokeWidth={1.6} strokeDasharray="4 4" /><path d="M-26 -120 h52 M0 -146 v52" stroke={c.shadow} strokeWidth={2} />
    <path d="M-34 0 L-34 -64 Q0 -104 34 -64 L34 0Z" fill={c.fore} /><path d="M-24 0 V-60 Q0 -86 24 -60 V0" stroke={stone(c, 2)} strokeWidth={4} fill="none" />
  </g>
);
export const Church: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-90, -110, 180, 110)} fill={mix(c.light, c.near, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-100 -110 L0 -170 L100 -110Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(60, -210, 50, 100)} fill={mix(c.light, c.near, 0.3)} stroke={c.shadow} strokeWidth={2.5} /><path d="M52 -210 L85 -280 L118 -210Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M85 -280 v-24 M75 -294 h20" stroke={c.gold} strokeWidth={3.4} />
    <path d={arch(78, -112, 14, 36)} fill={lit(c)} /><path d={arch(-22, 0, 44, 70)} fill={c.fore} />
    {[-66, 40].map((x) => <path key={x} d={arch(x, -40, 22, 54)} fill={lit(c)} opacity={0.85} />)}
  </g>
);
export const Mosque: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-140, -110, 280, 110)} fill={mix(c.light, c.near, 0.25)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-100 -110 Q0 -250 100 -110Z" fill={mix(c.accent2, c.light, 0.3)} stroke={c.shadow} strokeWidth={2.5} /><path d="M0 -204 v-26 M-6 -222 q6 -8 12 0" stroke={c.gold} strokeWidth={3} fill="none" />
    {[-180, 180].map((x) => <g key={x}><path d={rect(x - 13, -250, 26, 250)} fill={mix(c.light, c.near, 0.25)} stroke={c.shadow} strokeWidth={2.2} /><path d={rect(x - 19, -190, 38, 9)} fill={c.light} stroke={c.shadow} strokeWidth={1.4} /><path d="M" stroke="none" /><path d={tri(x, -250, 32, 52)} fill={mix(c.accent2, c.light, 0.3)} stroke={c.shadow} strokeWidth={1.6} /></g>)}
    {[-90, -30, 30, 90].map((x) => <path key={x} d={arch(x - 12, -8, 24, 70)} fill={lit(c)} opacity={0.8} />)}
    <path d={arch(-24, 0, 48, 80)} fill={c.fore} />
  </g>
);
export const Pagoda: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-70, -22, 140, 22)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} />
    {[0, 1, 2, 3, 4].map((i) => {
      const w = 110 - i * 16, y = -22 - i * 52;
      return <g key={i}><path d={rect(-w / 2 + 10, y - 40, w - 20, 40)} fill={mix(c.near, c.accent, 0.25)} stroke={c.shadow} strokeWidth={1.8} /><path d={arch(-8, y - 2, 16, 26)} fill={lit(c)} opacity={0.8} />
        <path d={`M${-w / 2 - 22} ${y - 38} Q${-w / 2 + 6} ${y - 36} 0 ${y - 56} Q${w / 2 - 6} ${y - 36} ${w / 2 + 22} ${y - 38} Q0 ${y - 30} ${-w / 2 - 22} ${y - 38}Z`} fill={roofCol(c)} stroke={c.shadow} strokeWidth={1.8} /></g>;
    })}
    <path d="M0 -282 v-34" stroke={c.gold} strokeWidth={4} /><circle cx={0} cy={-300} r={5} fill={c.gold} />
  </g>
);
export const Monastery: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-230, -90, 460, 90)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-246 -90 L-200 -126 L200 -126 L246 -90Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={arch(-206 + i * 48, 0, 26, 56)} fill={c.fore} opacity={0.82} />)}
    <path d={rect(150, -230, 50, 140)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2.5} /><path d="M142 -230 L175 -290 L208 -230Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.2} />
    <path d={arch(164, -170, 22, 40)} fill={c.fore} /><circle cx={175} cy={-150} r={5} fill={c.gold} />
  </g>
);
export const Longhouse: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-210, -70, 420, 70)} fill={wood(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-240 -64 Q-200 -170 -150 -150 L150 -150 Q200 -170 240 -64 Q0 -92 -240 -64Z" fill={mix('#b49650', c.mid, 0.4)} stroke={c.shadow} strokeWidth={2.5} />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-180 + i * 36} -148 L${-190 + i * 38} -76`} stroke={c.shadow} strokeWidth={1.3} opacity={0.45} />)}
    <path d="M-240 -64 Q-262 -150 -240 -180 Q-232 -160 -226 -150" stroke={wood(c, 2)} strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M240 -64 Q262 -150 240 -180 Q232 -160 226 -150" stroke={wood(c, 2)} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d={arch(-20, 0, 40, 56)} fill={c.fore} /><Smoke c={c} t={t} seed={seed} puffs={5} height={110} color={c.far} />
  </g>
);
export const Fortress: React.FC<P> = ({ c }) => (
  <g>
    <path d={rect(-200, -140, 400, 140)} fill={c.near} stroke={c.shadow} strokeWidth={2.5} /><Battle x={-200} y={-140} w={400} fill={c.near} />
    {[-200, 200].map((x) => <g key={x}><path d={rect(x - 40, -210, 80, 210)} fill={c.mid} stroke={c.shadow} strokeWidth={2.5} /><Battle x={x - 40} y={-210} w={80} fill={c.mid} /><path d={arch(x - 7, -130, 14, 36)} fill={lit(c)} /></g>)}
    <path d={rect(-60, -190, 120, 56)} fill={c.mid} stroke={c.shadow} strokeWidth={2} /><Battle x={-60} y={-190} w={120} fill={c.mid} />
    <path d={arch(-34, 0, 68, 100)} fill={c.fore} /><path d="M-24 0 V-90 M-8 0 V-100 M8 0 V-100 M24 0 V-90" stroke={c.shadow} strokeWidth={3} opacity={0.8} />
  </g>
);
export const SiegeTower: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-60 -34 L-50 -300 L50 -300 L60 -34Z" fill={wood(c)} stroke={c.shadow} strokeWidth={2.5} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M-56 ${-60 - i * 62} L56 ${-60 - i * 62}`} stroke={c.shadow} strokeWidth={4} />)}
    <path d="M-52 -230 L52 -170 M52 -230 L-52 -170 M-56 -110 L56 -60 M56 -110 L-56 -60" stroke={wood(c, 2)} strokeWidth={3} />
    <path d={rect(-46, -300, 92, 18)} fill={wood(c, 1)} stroke={c.shadow} strokeWidth={2} /><Battle x={-46} y={-300} w={92} fill={wood(c, 1)} />
    <path d={rect(60, -270, 70, 10)} fill={wood(c, 2)} stroke={c.shadow} strokeWidth={2} />
    {[-40, 40].map((x) => <g key={x}><circle cx={x} cy={-24} r={24} fill={wood(c, 2)} stroke={c.shadow} strokeWidth={3} /><path d={`M${x - 24} -24 h48 M${x} -48 v48`} stroke={c.shadow} strokeWidth={2.5} /></g>)}
    <path d={rect(-50, -250, 100, 80)} fill={c.accent} opacity={0.55} />
  </g>
);
export const Catapult: React.FC<P> = ({ c, t, seed }) => {
  const k = ((t * 0.5 + seed * 0.1) % 1 + 1) % 1;
  const a = k < 0.7 ? -60 + (k / 0.7) * 10 : -50 + ((k - 0.7) / 0.3) * 120;
  return (
    <g>
      <path d="M-70 -34 L-50 -110 L-30 -34 M30 -34 L50 -110 L70 -34Z" fill="none" stroke={wood(c, 1)} strokeWidth={9} strokeLinejoin="round" />
      <path d={rect(-90, -44, 180, 14)} fill={wood(c)} stroke={c.shadow} strokeWidth={2.5} />
      <g transform={`translate(0 -100) rotate(${a})`}><path d="M-10 0 L140 0" stroke={wood(c, 2)} strokeWidth={9} strokeLinecap="round" /><path d="M120 -4 q14 -20 36 -8 q-4 22 -36 16Z" fill={wood(c, 1)} stroke={c.shadow} strokeWidth={2} /><circle cx={142} cy={-12} r={9} fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={1.5} opacity={k < 0.74 ? 1 : 0} /></g>
      {[-62, 62].map((x) => <g key={x}><circle cx={x} cy={-22} r={22} fill={wood(c, 2)} stroke={c.shadow} strokeWidth={3} /><path d={`M${x - 22} -22 h44 M${x} -44 v44`} stroke={c.shadow} strokeWidth={2} /></g>)}
    </g>
  );
};
export const Trebuchet: React.FC<P> = ({ c, t, seed }) => {
  const k = ((t * 0.4 + seed * 0.1) % 1 + 1) % 1;
  const a = k < 0.6 ? 50 - (k / 0.6) * 20 : 30 - ((k - 0.6) / 0.4) * 160;
  return (
    <g>
      <path d="M-100 0 L-20 -190 L0 -190 M100 0 L20 -190 L0 -190" stroke={wood(c, 1)} strokeWidth={11} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={rect(-120, -16, 240, 16)} fill={wood(c)} stroke={c.shadow} strokeWidth={2.5} />
      <g transform={`translate(0 -190) rotate(${a})`}>
        <path d="M-70 0 L190 0" stroke={wood(c, 2)} strokeWidth={9} strokeLinecap="round" />
        <path d="M-70 0 V50" stroke={c.shadow} strokeWidth={3} /><rect x={-92} y={46} width={44} height={42} rx={3} fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={2.5} />
        <path d="M190 0 Q210 60 170 90" stroke={c.shadow} strokeWidth={2.2} fill="none" /><circle cx={170} cy={92} r={9} fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={1.5} opacity={k < 0.66 ? 1 : 0} />
      </g>
    </g>
  );
};
export const Forge: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-100, -110, 200, 110)} fill={stone(c, 1)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-116 -110 L0 -170 L116 -110Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(50, -230, 28, 130)} fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2} /><g transform="translate(64 -230)"><Smoke c={c} t={t} seed={seed} puffs={7} height={160} /></g>
    <path d={arch(-60, 0, 120, 82)} fill="#201510" />
    <ellipse cx={0} cy={-8} rx={36} ry={10} fill={c.glow} opacity={0.5 + Math.sin(t * 9) * 0.1} /><path d="M-26 -8 Q-8 -52 0 -28 Q10 -60 26 -8Z" fill={c.glow} opacity={0.9} /><path d="M-14 -8 Q0 -34 14 -8Z" fill="#ffe08a" />
    <path d="M-92 0 L-92 -22 L-64 -22 L-64 -30 L-98 -30 L-98 -40 L-50 -40 L-56 -22 L-56 0Z" fill={c.shadow} transform="translate(0 0) scale(0.7) translate(-18 0)" />
  </g>
);
export const Tavern: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-130, -150, 260, 150)} fill={mix(c.light, c.near, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-148 -150 L0 -220 L148 -150Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-130 -150 H130 M-130 -76 H130 M-44 -150 V0 M44 -150 V0 M-130 -150 L-44 -76 M130 -150 L44 -76" stroke={wood(c, 2)} strokeWidth={5} />
    {[[-90, -128], [10, -128], [90, -128], [-90, -50]].map(([x, y], i) => <path key={i} d={rect(x, y, 30, 30)} fill={lit(c)} stroke={c.shadow} strokeWidth={2} />)}
    <path d={arch(-14, 0, 28, 62)} fill={c.fore} />
    <g transform={`translate(138 -110) rotate(${Math.sin(t * 2 + seed) * 5} 0 -10)`}><path d="M0 -10 H34" stroke={c.shadow} strokeWidth={3} /><path d={rect(8, -8, 36, 28)} fill={c.gold} stroke={c.shadow} strokeWidth={2} /><circle cx={26} cy={6} r={7} fill={c.accent} /></g>
    <path d="M60 -150 V-200" stroke={c.shadow} strokeWidth={8} /><g transform="translate(60 -200)"><Smoke c={c} t={t} seed={seed} puffs={5} height={90} color={c.far} /></g>
  </g>
);
export const Village: React.FC<P> = ({ c, t, seed }) => (
  <g>
    {[[-220, 70, 56], [-110, 90, 70], [20, 80, 60], [130, 100, 74], [250, 70, 52]].map(([x, w, h], i) => (
      <g key={i} transform={`translate(${x} ${(i % 2) * -10})`}>
        <path d={rect(-w / 2, -h, w, h)} fill={mix(c.light, c.near, 0.3 + (i % 3) * 0.1)} stroke={c.shadow} strokeWidth={2} />
        <path d={`M${-w / 2 - 12} ${-h} L0 ${-h - 52} L${w / 2 + 12} ${-h}Z`} fill={i % 2 ? roofCol(c) : mix('#b49650', c.mid, 0.4)} stroke={c.shadow} strokeWidth={2} />
        <path d={rect(-8, -34, 16, 34)} fill={c.fore} /><path d={rect(w / 4, -h + 14, 14, 14)} fill={lit(c)} />
        {i % 2 === 0 && <g transform={`translate(${w / 4} ${-h - 36})`}><Smoke c={c} t={t} seed={seed + i} puffs={4} height={80} color={c.far} /></g>}
      </g>
    ))}
  </g>
);
export const Tipi: React.FC<P> = ({ c }) => (
  <g>
    {[[-110, 0.8], [0, 1.1], [110, 0.7]].map(([x, s], i) => (
      <g key={i} transform={`translate(${x} 0) scale(${s})`}>
        <path d="M-80 0 L-6 -210 L6 -210 L80 0Z" fill={mix('#d8c49a', c.mid, 0.3 + i * 0.1)} stroke={c.shadow} strokeWidth={2.5} />
        <path d="M-10 -200 L-30 -240 M10 -200 L34 -240 M0 -204 L2 -246" stroke={wood(c, 2)} strokeWidth={4} />
        <path d="M-38 -70 L38 -70 M-24 -110 L24 -110" stroke={c.accent} strokeWidth={6} /><path d="M0 0 L-16 -70 L16 -70Z" fill={c.fore} />
        {Array.from({ length: 4 }, (_, k) => <path key={k} d={`M${-50 + k * 33} -30 l8 -14 l8 14`} stroke={c.accent2} strokeWidth={3} fill="none" />)}
      </g>
    ))}
  </g>
);
export const Yurt: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-100 0 L-100 -84 L100 -84 L100 0Z" fill={mix('#e8dcc0', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-110 -84 Q0 -190 110 -84Z" fill={mix('#d9c9a4', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-100 -52 H100" stroke={c.accent} strokeWidth={6} />{[-60, -20, 20, 60].map((x) => <path key={x} d={`M${x} -84 L${x * 0.5} -170`} stroke={c.shadow} strokeWidth={1.3} opacity={0.4} />)}
    <path d={arch(-18, 0, 36, 60)} fill={wood(c, 2)} stroke={c.shadow} strokeWidth={2} /><circle cx={0} cy={-176} r={8} fill={c.fore} /><g transform="translate(0 -180)"><Smoke c={c} t={t} seed={seed} puffs={5} height={90} color={c.far} /></g>
  </g>
);
export const Igloo: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-110 0 A110 100 0 0 1 110 0Z" fill={mix('#faf5f2', c.light, 0.4)} stroke={c.shadow} strokeWidth={2.5} />
    {[-70, -35, 0, 35, 70].map((x, i) => <path key={i} d={`M${x} -2 L${x * 0.9} -${96 - Math.abs(x) * 0.6}`} stroke={c.shadow} strokeWidth={1.2} opacity={0.35} />)}
    {[-30, -62, -88].map((y) => <path key={y} d={`M${-Math.sqrt(1 - (y / 100) ** 2) * 108} ${y} Q0 ${y - 8} ${Math.sqrt(1 - (y / 100) ** 2) * 108} ${y}`} stroke={c.shadow} strokeWidth={1.2} opacity={0.35} fill="none" />)}
    <path d="M-110 0 L-110 -34 Q-110 -44 -126 -44 L-170 -44 L-170 0Z" fill={mix('#faf5f2', c.light, 0.4)} stroke={c.shadow} strokeWidth={2.2} /><path d="M-160 0 V-34 Q-140 -42 -120 -34 V0Z" fill={c.fore} />
  </g>
);
export const Torii: React.FC<P> = ({ c }) => (
  <g>
    {[-70, 70].map((x) => <path key={x} d={rect(x - 11, -230, 22, 230)} fill={mix('#c13a2a', c.mid, 0.25)} stroke={c.shadow} strokeWidth={2} />)}
    <path d="M-120 -240 Q0 -216 120 -240 L110 -222 Q0 -202 -110 -222Z" fill={mix('#2a2523', c.shadow, 0.3)} stroke={c.shadow} strokeWidth={2} />
    <path d="M-86 -196 H86 V-178 H-86Z" fill={mix('#c13a2a', c.mid, 0.25)} stroke={c.shadow} strokeWidth={2} /><path d="M0 -218 V-182" stroke={c.shadow} strokeWidth={6} />
  </g>
);
export const JapaneseCastle: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-170 0 L-130 -90 L130 -90 L170 0Z" fill={stone(c, 2)} stroke={c.shadow} strokeWidth={2.5} />
    {[0, 1, 2, 3].map((i) => {
      const w = 220 - i * 46, y = -90 - i * 62;
      return <g key={i}><path d={rect(-w / 2, y - 44, w, 44)} fill={mix('#f2eee2', c.light, 0.3)} stroke={c.shadow} strokeWidth={2} />{[-0.3, 0, 0.3].map((f) => <path key={f} d={rect(w * f - 8, y - 32, 16, 16)} fill={c.fore} opacity={0.8} />)}
        <path d={`M${-w / 2 - 30} ${y - 40} Q${-w / 2 + 10} ${y - 38} 0 ${y - 64} Q${w / 2 - 10} ${y - 38} ${w / 2 + 30} ${y - 40} Q0 ${y - 30} ${-w / 2 - 30} ${y - 40}Z`} fill={mix('#50443a', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2} /></g>;
    })}
    <path d="M-20 -318 q20 -26 40 0" stroke={c.gold} strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

// ------------------------------------------------------------------------------------------------------------------------------------------------ exploration, empire and industry
export const StarFort: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-300 0 L-250 -70 L-150 -70 L-110 -110 L110 -110 L150 -70 L250 -70 L300 0Z" fill={mix(c.near, c.light, 0.15)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-250 -70 L-110 -110 M250 -70 L110 -110" stroke={c.shadow} strokeWidth={3} />
    <path d="M-110 -110 L-70 -140 L70 -140 L110 -110" fill={c.mid} stroke={c.shadow} strokeWidth={2.5} /><Battle x={-70} y={-140} w={140} fill={c.mid} />
    <path d={arch(-26, 0, 52, 66)} fill={c.fore} />
    <g transform="translate(0 -140)"><path d="M0 0 V-68" stroke={c.shadow} strokeWidth={3} /><g transform="translate(0 -68)"><Cloth len={42} h={26} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>
    {[-200, 200].map((x) => <g key={x}><path d={rect(x - 22, -90, 44, 20)} fill={c.shadow} /><path d={`M${x - 18} -88 l${x < 0 ? -34 : 34} -10`} stroke={c.shadow} strokeWidth={7} strokeLinecap="round" /></g>)}
  </g>
);
export const Observatory: React.FC<P> = ({ c, t }) => (
  <g>
    <path d={rect(-80, -150, 160, 150)} fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-90 -150 A90 80 0 0 1 90 -150Z" fill={mix(c.light, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-12 -150 L-6 -228 L6 -228 L12 -150Z" fill={c.fore} /><g transform={`rotate(${-38 + Math.sin(t * 0.3) * 6} 0 -176)`}><path d="M-6 -176 L68 -176" stroke={c.gold} strokeWidth={11} strokeLinecap="round" /><circle cx={68} cy={-176} r={8} fill={c.gold} stroke={c.shadow} strokeWidth={1.5} /></g>
    <path d={arch(-18, 0, 36, 70)} fill={c.fore} /><path d={rect(-64, -110, 20, 26)} fill={lit(c)} /><path d={rect(44, -110, 20, 26)} fill={lit(c)} />
  </g>
);
export const PrintingPress: React.FC<P> = ({ c, t }) => {
  const k = Math.max(0, Math.sin(t * 2)) * 18;
  return (
    <g>
      <path d="M-70 0 V-170 M70 0 V-170 M-70 -170 H70 M-70 -30 H70" stroke={wood(c, 1)} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M0 -170 V${-100 + k}`} stroke={c.shadow} strokeWidth={9} /><path d={`M-36 -190 L36 -190 M0 -190 V-170`} stroke={wood(c, 2)} strokeWidth={8} strokeLinecap="round" /><path d={rect(-52, -100 + k, 104, 14)} fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={2} />
      <path d={rect(-60, -50, 120, 20)} fill={wood(c)} stroke={c.shadow} strokeWidth={2} /><path d={rect(-44, -58, 88, 8)} fill={c.light} stroke={c.shadow} strokeWidth={1.2} />
      {[0, 1, 2].map((i) => <path key={i} d={rect(96 + i * 4, -26 - i * 6, 60, 6)} fill={c.light} stroke={c.shadow} strokeWidth={1.2} />)}
    </g>
  );
};
export const Gallows: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d={rect(-90, -14, 180, 14)} fill={wood(c)} stroke={c.shadow} strokeWidth={2} />
    <path d="M-50 -14 V-220 H50 M-50 -170 L-10 -220" stroke={wood(c, 1)} strokeWidth={11} fill="none" strokeLinejoin="round" />
    <g transform={`rotate(${Math.sin(t * 1.4 + seed) * 4} 28 -216)`}><path d="M28 -216 V-150" stroke={c.shadow} strokeWidth={3} /><ellipse cx={28} cy={-142} rx={9} ry={11} fill="none" stroke={c.shadow} strokeWidth={3} /></g>
  </g>
);
export const Guillotine: React.FC<P> = ({ c, t }) => {
  const k = ((t * 0.5) % 1 + 1) % 1;
  const y = k < 0.8 ? -200 : -200 + ((k - 0.8) / 0.2) * 120;
  return (
    <g>
      <path d={rect(-70, -26, 140, 26)} fill={wood(c)} stroke={c.shadow} strokeWidth={2} />
      <path d="M-44 -26 V-260 M44 -26 V-260 M-56 -260 H56" stroke={wood(c, 1)} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={`M-40 ${y} L40 ${y} L40 ${y + 22} Z`} fill={mix(c.light, c.shadow, 0.1)} stroke={c.shadow} strokeWidth={2} />
      <path d={rect(-30, -58, 60, 12)} fill={wood(c, 2)} stroke={c.shadow} strokeWidth={2} /><path d="M70 -26 L70 -56 L110 -56 L100 -26Z" fill={wood(c, 2)} stroke={c.shadow} strokeWidth={2} />
    </g>
  );
};
export const ClockTower: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-52 0 L-46 -270 L46 -270 L52 0Z" fill={stone(c)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-58 -270 L0 -360 L58 -270Z" fill={roofCol(c)} stroke={c.shadow} strokeWidth={2.5} /><path d="M0 -360 v-24" stroke={c.gold} strokeWidth={3.4} />
    <circle cx={0} cy={-218} r={34} fill={c.light} stroke={c.shadow} strokeWidth={4} />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${Math.sin((i * Math.PI) / 6) * 28} ${-218 - Math.cos((i * Math.PI) / 6) * 28} L${Math.sin((i * Math.PI) / 6) * 32} ${-218 - Math.cos((i * Math.PI) / 6) * 32}`} stroke={c.shadow} strokeWidth={2} />)}
    <path d={`M0 -218 L${Math.sin(t * 0.5) * 22} ${-218 - Math.cos(t * 0.5) * 22}`} stroke={c.shadow} strokeWidth={3.4} strokeLinecap="round" /><path d={`M0 -218 L${Math.sin(t * 0.04) * 15} ${-218 - Math.cos(t * 0.04) * 15}`} stroke={c.shadow} strokeWidth={4.4} strokeLinecap="round" />
    <path d={arch(-14, -80, 28, 56)} fill={lit(c)} opacity={0.85} /><path d={arch(-14, -280, 28, 40)} fill={c.fore} />
  </g>
);
export const Mine: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-280 0 Q-200 -170 0 -190 Q200 -170 280 0Z" fill={mix(c.mid, c.near, 0.4)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-70 0 V-96 H70 V0" fill="#150f0c" stroke={wood(c, 2)} strokeWidth={10} strokeLinejoin="round" /><path d="M-76 -100 H76" stroke={wood(c, 1)} strokeWidth={12} />
    <path d="M-60 0 H-160 M-60 -8 H-160" stroke={c.shadow} strokeWidth={3} />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-70 - i * 18} -12 v12`} stroke={wood(c, 2)} strokeWidth={3} />)}
    <g transform={`translate(${-130 + Math.sin(t * 0.8 + seed) * 10} 0)`}><path d="M-22 -18 L22 -18 L16 -44 L-16 -44Z" fill={wood(c, 2)} stroke={c.shadow} strokeWidth={2} /><circle cx={-12} cy={-6} r={7} fill={c.shadow} /><circle cx={12} cy={-6} r={7} fill={c.shadow} /></g>
    <circle cx={0} cy={-84} r={4} fill={c.glow} /><circle cx={0} cy={-84} r={16} fill={c.glow} opacity={0.2} />
  </g>
);
export const Skyscraper: React.FC<P> = ({ c, t }) => (
  <g>
    <path d={rect(-70, -330, 140, 330)} fill={mix(c.mid, c.near, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(-52, -372, 104, 42)} fill={mix(c.mid, c.near, 0.3)} stroke={c.shadow} strokeWidth={2.5} /><path d={rect(-30, -408, 60, 36)} fill={mix(c.mid, c.near, 0.3)} stroke={c.shadow} strokeWidth={2.5} /><path d="M0 -408 V-460" stroke={c.shadow} strokeWidth={4} />
    <circle cx={0} cy={-462} r={4} fill={Math.sin(t * 4) > 0 ? '#ff4a3a' : c.shadow} />
    {Array.from({ length: 9 }, (_, r) => Array.from({ length: 4 }, (_, k) => <rect key={`${r}${k}`} x={-58 + k * 30} y={-318 + r * 34} width={20} height={20} fill={(r * 7 + k * 3) % 5 < 3 ? lit(c) : c.fore} opacity={0.85} />))}
  </g>
);
export const Derrick: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-60 0 L-10 -300 L10 -300 L60 0 M-48 -80 H48 M-36 -150 H36 M-24 -220 H24 M-60 0 L36 -150 M60 0 L-36 -150 M-48 -80 L24 -220 M48 -80 L-24 -220" stroke={c.shadow} strokeWidth={4} fill="none" />
    <path d="M0 -300 v-26" stroke={c.shadow} strokeWidth={5} />
    <g transform="translate(150 0)"><path d="M-40 0 L-10 -80 L20 0" stroke={c.shadow} strokeWidth={8} fill="none" /><g transform={`rotate(${Math.sin(t * 2) * 12} 0 -80)`}><path d="M-70 -84 L56 -70" stroke={c.shadow} strokeWidth={10} strokeLinecap="round" /><path d="M-70 -84 Q-80 -70 -74 -50" stroke={c.shadow} strokeWidth={4} fill="none" /><rect x={40} y={-84} width={28} height={30} rx={4} fill={c.shadow} /></g></g>
    <path d="M-100 0 H100" stroke={c.shadow} strokeWidth={6} />
  </g>
);
export const Barn: React.FC<P> = ({ c }) => (
  <g>
    <path d="M-140 0 V-110 L-110 -170 L110 -170 L140 -110 V0Z" fill={mix('#a13a2c', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-150 -108 L-110 -176 L110 -176 L150 -108" stroke={c.light} strokeWidth={5} fill="none" opacity={0.85} />
    <path d={rect(-44, -90, 88, 90)} fill={mix(c.light, c.near, 0.2)} stroke={c.light} strokeWidth={4} /><path d="M-44 -90 L44 0 M44 -90 L-44 0" stroke={c.light} strokeWidth={4} /><path d="M0 -90 V0" stroke={c.light} strokeWidth={3} />
    <path d={rect(-20, -150, 40, 28)} fill={c.fore} opacity={0.8} />
    <g transform="translate(190 0)"><path d={rect(-24, -170, 48, 170)} fill={mix(c.light, c.near, 0.4)} stroke={c.shadow} strokeWidth={2.5} /><path d="M-24 -170 A24 24 0 0 1 24 -170Z" fill={mix(c.mid, c.shadow, 0.3)} stroke={c.shadow} strokeWidth={2.5} /><path d="M-24 -120 H24 M-24 -70 H24" stroke={c.shadow} strokeWidth={2} opacity={0.5} /></g>
  </g>
);
export const Telegraph: React.FC<P> = ({ c, t }) => (
  <g>
    {[-170, 170].map((x) => <g key={x}><path d={`M${x} 0 V-250`} stroke={wood(c, 2)} strokeWidth={9} /><path d={`M${x - 36} -236 H${x + 36} M${x - 28} -212 H${x + 28}`} stroke={wood(c, 2)} strokeWidth={7} strokeLinecap="round" />{[-34, -12, 12, 34].map((dx, i) => <circle key={i} cx={x + dx} cy={i % 2 ? -216 : -240} r={4} fill={c.light} stroke={c.shadow} strokeWidth={1} />)}</g>)}
    {[[-34, -240], [-12, -216], [12, -240], [34, -216]].map(([dx, y], i) => <path key={i} d={`M${-170 + dx} ${y} Q0 ${y + 52 + Math.sin(t + i) * 2} ${170 + dx} ${y}`} stroke={c.shadow} strokeWidth={1.8} fill="none" />)}
  </g>
);
// ------------------------------------------------------------------------------------------------------------------------------------------------ the twentieth century
export const Bunker: React.FC<P> = ({ c, t, seed }) => (
  <g>
    <path d="M-160 0 L-160 -50 Q-120 -100 0 -100 Q120 -100 160 -50 L160 0Z" fill={mix('#8d8d86', c.mid, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d={rect(-110, -62, 220, 18)} fill="#14100e" /><path d="M-160 -50 H160" stroke={c.shadow} strokeWidth={2} opacity={0.5} />
    <path d={rect(-24, -40, 48, 40)} fill={c.fore} stroke={c.shadow} strokeWidth={2} />
    <g transform="translate(120 -92)"><path d="M0 0 V-52" stroke={c.shadow} strokeWidth={3} /><g transform="translate(0 -52)"><Cloth len={34} h={22} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>
    <path d="M-220 0 H220" stroke={c.shadow} strokeWidth={3} strokeDasharray="6 10" opacity={0.6} />
  </g>
);
export const RadioTower: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M-50 0 L-5 -380 L5 -380 L50 0 M-40 -80 H40 M-30 -160 H30 M-20 -240 H20 M-12 -310 H12 M-50 0 L30 -160 M50 0 L-30 -160 M-40 -80 L20 -240 M40 -80 L-20 -240" stroke={c.shadow} strokeWidth={4} fill="none" />
    <path d="M0 -380 V-420" stroke={c.shadow} strokeWidth={4} /><circle cx={0} cy={-424} r={5} fill={Math.sin(t * 5) > 0 ? '#ff4a3a' : c.shadow} />
    {[0, 1, 2].map((i) => { const ph = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M${14 + ph * 70} ${-424 - ph * 40} Q${30 + ph * 70} -424 ${14 + ph * 70} ${-424 + ph * 40}`} stroke={c.gold} strokeWidth={2.4} fill="none" opacity={1 - ph} />; })}
  </g>
);
export const Rocket: React.FC<P> = ({ c, t }) => (
  <g>
    <path d="M70 0 V-300 M110 0 V-300 M70 -60 H110 M70 -140 H110 M70 -220 H110 M70 -300 H30" stroke={c.shadow} strokeWidth={4} fill="none" />
    <path d="M-30 -30 L-30 -230 Q-30 -300 0 -340 Q30 -300 30 -230 L30 -30Z" fill={mix('#f0ece0', c.light, 0.3)} stroke={c.shadow} strokeWidth={2.5} />
    <path d="M-30 -30 L-58 0 L-58 -50 L-30 -90 M30 -30 L58 0 L58 -50 L30 -90" fill={c.accent} stroke={c.shadow} strokeWidth={2.2} />
    <circle cx={0} cy={-210} r={14} fill={c.skyMid} stroke={c.shadow} strokeWidth={3} /><path d="M-30 -150 H30" stroke={c.accent} strokeWidth={9} />
    <path d={`M-18 -30 Q0 ${30 + Math.sin(t * 20) * 6} 18 -30Z`} fill={c.glow} opacity={0.9} /><path d={rect(-70, 0, 140, 12)} fill={c.shadow} />
  </g>
);

export const NEW_STRUCTURES = {
  ziggurat: Ziggurat, colosseum: Colosseum, aqueduct: Aqueduct, obelisk: Obelisk, sphinx: Sphinx, great_wall: GreatWall, triumphal_arch: TriumphalArch, stonehenge: Stonehenge, hut: Hut, palisade: Palisade,
  harbor: Harbor, market: Market, well: Well, library: Library, theater: Theater, adobe: Adobe, tomb: Tomb, palace: Palace, cathedral: Cathedral, church: Church,
  mosque: Mosque, pagoda: Pagoda, monastery: Monastery, longhouse: Longhouse, fortress: Fortress, siege_tower: SiegeTower, catapult: Catapult, trebuchet: Trebuchet, forge: Forge, tavern: Tavern,
  village: Village, tipi: Tipi, yurt: Yurt, igloo: Igloo, torii: Torii, japanese_castle: JapaneseCastle, star_fort: StarFort, observatory: Observatory, printing_press: PrintingPress, gallows: Gallows,
  guillotine: Guillotine, clocktower: ClockTower, mine: Mine, skyscraper: Skyscraper, derrick: Derrick, barn: Barn, telegraph: Telegraph, bunker: Bunker, radiotower: RadioTower, rocket: Rocket,
} as const;
