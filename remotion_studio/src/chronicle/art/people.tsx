import React from 'react';
import { Colors, mix } from './palette';
import { Cloth, Drawn } from './draw';

type Hat = 'none' | 'helmet' | 'crown' | 'hood' | 'cap' | 'turban';
type Hold = 'none' | 'spear' | 'sword' | 'torch' | 'scroll' | 'shield' | 'tool' | 'sack';
interface PersonProps extends Drawn {
  c: Colors; hat?: Hat; robe?: string; body?: string; cloak?: string; hold?: Hold; walk?: boolean; cheer?: boolean; scale?: number; face?: boolean;
}

/** One standing or walking figure, 110 px tall with its feet at the origin. Legs swing when it walks, the cloak and the flame move, arms rise when it cheers. */
export const Person: React.FC<PersonProps> = ({ c, t, seed, hat = 'none', robe, body, cloak, hold = 'none', walk = false, cheer = false, scale = 1, face = true }) => {
  const p = t * 7 + seed;
  const sw = walk ? Math.sin(p) : 0;
  const bob = walk ? -Math.abs(Math.sin(p)) * 4 : -Math.sin(t * 2 + seed) * 1.2 - (cheer ? Math.abs(Math.sin(t * 6 + seed)) * 10 : 0);
  const cloth = body ?? c.mid;
  const skin = face ? c.skin : cloth;
  const handX = 15 + sw * 7;
  const handY = -60 + Math.cos(p) * (walk ? 3 : 0);
  const armUp = cheer ? Math.sin(t * 8 + seed) * 8 : 0;
  const ol = mix(c.shadow, cloth, 0.35);
  const blink = Math.sin(t * 1.3 + seed * 5) > 0.97 ? 0.2 : 1;
  const talk = Math.max(0, Math.sin(t * 9 + seed)) * 2.2;
  const bearded = Math.floor(seed * 10) % 3 === 0 && hat !== 'crown' ? true : hat === 'crown' || hat === 'turban' ? seed % 2 > 1 : false;
  const hair = [c.shadow, mix(c.shadow, c.gold, 0.4), mix(c.shadow, c.light, 0.45)][Math.floor(seed * 7) % 3];
  const farX = -6 - sw * 6;
  const farY = -58 - Math.cos(p) * (walk ? 3 : 0) + (cheer ? armUp * -2 : 0);
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx={0} cy={1} rx={robe ? 22 : 17} ry={3.5} fill={c.shadow} opacity={0.28} />
      <g transform={`translate(0 ${bob})`}>
        {cloak && <path d={`M-12 -84 L12 -84 L${26 + sw * 3} -8 L${-26 + sw * 3} -8Z`} fill={cloak} stroke={ol} strokeWidth={1.2} transform={`translate(${-10 - sw * 3} 0)`} opacity={0.96} />}
        {/* far arm, behind the body */}
        <path d={`M-7 -80 L${farX} ${farY}`} stroke={mix(cloth, c.shadow, 0.3)} strokeWidth={6} strokeLinecap="round" />
        <circle cx={farX} cy={farY} r={3.6} fill={mix(c.skin, c.shadow, 0.2)} />
        {robe ? (
          <>
            <path d={`M-12 -84 Q-16 -40 ${-21 + sw * 2} 0 L${21 + sw * 2} 0 Q15 -40 12 -84Z`} fill={robe} stroke={ol} strokeWidth={1.3} />
            <path d={`M0 -80 L${2 + sw} -2`} stroke={mix(robe, c.shadow, 0.3)} strokeWidth={1.5} />
            <path d="M-13 -58 L13 -58" stroke={c.gold} strokeWidth={3} opacity={0.85} />
          </>
        ) : (
          <>
            <path d={`M-3 -48 L${-sw * 18} -3`} stroke={mix(cloth, c.shadow, 0.3)} strokeWidth={9} strokeLinecap="round" />
            <path d={`M3 -48 L${sw * 18} -3`} stroke={cloth} strokeWidth={9} strokeLinecap="round" />
            <ellipse cx={-sw * 18 + 3} cy={-1} rx={8} ry={3.4} fill={c.shadow} />
            <ellipse cx={sw * 18 + 3} cy={-1} rx={8} ry={3.4} fill={c.shadow} />
            <path d="M-13 -86 Q-14 -66 -11 -44 L11 -44 Q14 -66 13 -86 Q0 -92 -13 -86Z" fill={cloth} stroke={ol} strokeWidth={1.3} />
            <rect x={-11} y={-52} width={22} height={5} fill={c.shadow} opacity={0.5} />
            <rect x={-3} y={-53} width={6} height={7} rx={1.5} fill={c.gold} />
          </>
        )}
        {hold === 'shield' && <g transform={`translate(-15 -62)`}><circle r={19} fill={c.accent2} stroke={c.shadow} strokeWidth={2.5} /><circle r={6} fill={c.gold} /></g>}
        {/* near arm, hand and what it holds */}
        <path d={`M8 -80 L${handX} ${handY - armUp * 2}`} stroke={cloth} strokeWidth={7.5} strokeLinecap="round" />
        <g transform={`translate(${handX} ${handY - armUp * 2})`}>
          {hold === 'spear' && <><path d="M0 70 L0 -88" stroke={c.shadow} strokeWidth={3.5} /><path d="M-6 -86 L0 -108 L6 -86Z" fill={c.light} stroke={c.shadow} strokeWidth={1.5} /></>}
          {hold === 'sword' && <><path d="M0 4 L-6 -46" stroke={c.light} strokeWidth={5} strokeLinecap="round" /><path d="M-9 -2 L7 -4" stroke={c.gold} strokeWidth={4} /></>}
          {hold === 'tool' && <><path d="M0 40 L-6 -56" stroke={c.shadow} strokeWidth={4} /><path d="M-6 -56 L-26 -50" stroke={c.light} strokeWidth={5} /></>}
          {hold === 'scroll' && <rect x={-7} y={-14} width={14} height={22} rx={3} fill={c.light} stroke={c.shadow} strokeWidth={1.5} transform="rotate(-18)" />}
          {hold === 'sack' && <path d="M-12 8 Q-16 -14 -4 -20 Q8 -22 14 -6 Q16 8 8 10Z" fill={mix(c.light, c.shadow, 0.35)} stroke={c.shadow} strokeWidth={1.5} />}
          {hold === 'torch' && <><path d="M0 8 L0 -32" stroke={c.shadow} strokeWidth={4} /><path d={`M0 -32 Q${-9 + Math.sin(t * 14 + seed) * 3} -48 0 -64 Q${9 + Math.sin(t * 12 + seed) * 3} -48 0 -32Z`} fill={c.glow} /></>}
          <circle r={4.2} fill={c.skin} stroke={ol} strokeWidth={0.8} />
        </g>
        {cheer && <><path d={`M-8 -80 L${-18} ${-100 + armUp}`} stroke={cloth} strokeWidth={6.5} strokeLinecap="round" /><circle cx={-18} cy={-100 + armUp} r={4} fill={c.skin} /></>}
        {/* neck, head and face */}
        <rect x={-4} y={-92} width={8} height={9} fill={skin} />
        {face && hat !== 'hood' && <path d="M-12 -99 Q-13 -112 0 -111 Q10 -110 11 -102 Q4 -108 -4 -104 Z" fill={hair} />}
        <circle cx={0} cy={-98} r={11} fill={skin} stroke={face ? ol : 'none'} strokeWidth={0.9} />
        {face && (
          <>
            {hat !== 'hood' && hat !== 'helmet' && <path d="M-11 -100 Q-12 -111 0 -110 Q9 -110 11 -102 Q6 -106 1 -105 Q-6 -105 -11 -100Z" fill={hair} />}
            {bearded && <path d="M-9 -95 Q-8 -83 2 -83 Q10 -84 9 -96 Q4 -90 -2 -92 Q-6 -92 -9 -95Z" fill={hair} />}
            <path d="M0 -105.5 L7 -106.5" stroke={hair} strokeWidth={1.5} strokeLinecap="round" />
            <ellipse cx={4} cy={-101} rx={2.6} ry={2.4 * blink} fill="#f4ecd8" />
            <circle cx={5} cy={-101} r={1.4 * blink} fill={c.shadow} />
            <path d="M8 -99 L11 -97 L8 -96" stroke={mix(c.skin, c.shadow, 0.45)} strokeWidth={1} fill="none" strokeLinecap="round" />
            <path d={`M2 -93.5 Q5 ${-93 + talk * 0.4} 8 -94`} stroke={bearded ? c.light : c.shadow} strokeWidth={1.1} fill="none" strokeLinecap="round" />
            <circle cx={5} cy={-96} r={2.4} fill="#ff8a7a" opacity={0.18} />
          </>
        )}
        {hat === 'helmet' && <><path d="M-12 -98 A12 12 0 0 1 12 -98Z" fill={c.light} stroke={c.shadow} strokeWidth={1.5} /><path d="M-12 -98 L12 -98" stroke={c.shadow} strokeWidth={2} /><path d={`M0 -110 Q${6 + Math.sin(t * 5 + seed) * 2} -122 14 -112`} stroke={c.accent} strokeWidth={5} fill="none" strokeLinecap="round" /></>}
        {hat === 'crown' && <path d="M-11 -106 L-12 -120 L-5 -112 L0 -122 L5 -112 L12 -120 L11 -106Z" fill={c.gold} stroke={c.shadow} strokeWidth={1.2} />}
        {hat === 'hood' && <path d="M-14 -88 Q-15 -116 0 -115 Q15 -114 14 -88 Q8 -96 4 -100 L-6 -100Z" fill={robe ?? cloth} />}
        {hat === 'cap' && <ellipse cx={0} cy={-106} rx={13} ry={5} fill={c.accent2} />}
        {hat === 'turban' && <ellipse cx={0} cy={-105} rx={13} ry={9} fill={c.light} stroke={c.shadow} strokeWidth={1.2} />}
      </g>
    </g>
  );
};

/** A row of marching soldiers with a banner-bearer: the army of a thousand stories. */
export const Soldiers: React.FC<Drawn & { c: Colors; n?: number }> = ({ c, t, seed, dir, n = 6 }) => {
  const slots = Array.from({ length: n }, (_, i) => ({ x: -((i % 3) * 52) - Math.floor(i / 3) * 24, y: -Math.floor(i / 3) * 16 - (i % 2) * 5 }));
  return (
    <g transform={`scale(${dir} 1)`}>
      {slots.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <Person c={c} t={t} seed={seed + i * 0.35} hat="helmet" hold={i % 3 === 1 ? 'sword' : 'spear'} body={i % 2 ? c.near : c.mid} cloak={i === 0 ? c.accent : undefined} walk />
          {i === 0 && <g transform="translate(18 -98)"><path d="M0 0 L0 -110" stroke={c.shadow} strokeWidth={3.5} /><g transform="translate(0 -108)"><Cloth len={54} h={36} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>}
        </g>
      ))}
    </g>
  );
};

export const Horse: React.FC<Drawn & { c: Colors; rider?: boolean; gallop?: boolean; coat?: string }> = ({ c, t, seed, rider = true, gallop = true, coat }) => {
  const g = gallop ? t * 9 + seed : 0;
  const body = coat ?? c.near;
  const bob = gallop ? -Math.abs(Math.sin(g)) * 6 : 0;
  const leg = (x: number, ph: number) => {
    const a = gallop ? Math.sin(g + ph) * 0.7 : 0.05 * ph;
    return <path d={`M${x} -48 L${x + Math.sin(a) * 30} -26 L${x + Math.sin(a) * 40} 0`} stroke={body} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  };
  return (
    <g>
      {leg(-34, 0)}{leg(-26, 2.4)}{leg(30, 1.2)}{leg(38, 3.6)}
      <g transform={`translate(0 ${bob})`}>
        <ellipse cx={0} cy={-58} rx={48} ry={21} fill={body} />
        <path d="M30 -64 L52 -102 L66 -98 L62 -84 L74 -78 L72 -68 L52 -62Z" fill={body} />
        <path d={`M-46 -66 Q${-66 + Math.sin(t * 6 + seed) * 6} -56 -62 -30`} stroke={body} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d={`M44 -98 Q50 -112 38 -108`} stroke={c.shadow} strokeWidth={4} fill="none" />
        {rider && (
          <g transform="translate(-4 -70) scale(0.9)">
            <Person c={c} t={t} seed={seed} hat="helmet" hold="spear" cloak={c.accent} body={c.mid} />
          </g>
        )}
      </g>
    </g>
  );
};

export const Cavalry: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-i * 110} ${-i * 14 + (i % 2) * 8}) scale(${1 - i * 0.06})`}>
        <Horse c={c} t={t} seed={seed + i * 1.7} coat={i % 2 ? c.mid : c.near} />
      </g>
    ))}
  </g>
);

export const King: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <g transform="translate(-70 0)"><Person c={c} t={t} seed={seed + 1} hat="helmet" hold="spear" body={c.mid} scale={0.9} /></g>
    <g transform="translate(70 0)"><Person c={c} t={t} seed={seed + 2} hat="helmet" hold="spear" body={c.mid} scale={0.9} /></g>
    <Person c={c} t={t} seed={seed} hat="crown" cloak={c.accent} robe={c.accent2} scale={1.18} />
  </g>
);

export const Crowd: React.FC<Drawn & { c: Colors; n?: number }> = ({ c, t, seed, n = 11 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const row = i % 3;
      const x = (i - n / 2) * 30 + (row - 1) * 9;
      return (
        <g key={i} transform={`translate(${x} ${-row * 12}) scale(${0.78 + row * 0.1})`}>
          <Person c={c} t={t} seed={seed + i * 0.9} body={[c.mid, c.near, c.accent2, c.far][i % 4]} hat={i % 4 === 0 ? 'cap' : i % 5 === 0 ? 'hood' : 'none'} cheer={i % 2 === 0} face={false} />
        </g>
      );
    })}
  </g>
);

const Camel: React.FC<Drawn & { c: Colors; load?: boolean }> = ({ c, t, seed, load = true }) => {
  const g = t * 5 + seed;
  const leg = (x: number, ph: number) => <path d={`M${x} -50 L${x + Math.sin(g + ph) * 14} -24 L${x + Math.sin(g + ph) * 20} 0`} stroke={c.near} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  return (
    <g transform={`translate(0 ${-Math.abs(Math.sin(g)) * 2})`}>
      {leg(-30, 0)}{leg(-20, 3)}{leg(24, 1.6)}{leg(34, 4.6)}
      <ellipse cx={0} cy={-60} rx={42} ry={19} fill={c.near} />
      <path d="M-14 -72 Q-6 -100 4 -74Z" fill={c.near} />
      <path d="M22 -66 Q36 -86 34 -118" stroke={c.near} strokeWidth={11} fill="none" strokeLinecap="round" />
      <ellipse cx={42} cy={-120} rx={14} ry={8} fill={c.near} />
      {load && <path d="M-26 -74 L-26 -92 L12 -92 L12 -74Z" fill={c.accent2} stroke={c.shadow} strokeWidth={2} />}
    </g>
  );
};

export const Caravan: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-i * 120} ${-i * 6})`}><Camel c={c} t={t} seed={seed + i * 1.3} load={i !== 1} /></g>)}
    <g transform="translate(112 0)"><Person c={c} t={t} seed={seed + 4} hat="turban" robe={c.accent} walk hold="tool" /></g>
  </g>
);

export const Scholar: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}><Person c={c} t={t} seed={seed} hat="cap" robe={c.accent2} hold="scroll" scale={1.1} /></g>
);
export const Monk: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="hood" robe={mix(c.near, c.accent2, 0.35)} scale={1.1} />
    <Person c={c} t={t} seed={seed + 3} hat="hood" robe={mix(c.mid, c.accent2, 0.3)} scale={0.95} />
  </g>
);
export const Farmer: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="cap" hold="tool" body={c.accent2} walk scale={1.05} />
    <g transform="translate(-60 0)"><Person c={c} t={t} seed={seed + 2} hat="cap" hold="sack" body={c.mid} walk face={false} scale={0.9} /></g>
  </g>
);
export const Merchant: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="turban" robe={c.accent} hold="sack" scale={1.1} />
    <g transform="translate(-64 0)"><path d="M-30 0 L-30 -30 Q0 -44 30 -30 L30 0Z" fill={c.accent2} stroke={c.shadow} strokeWidth={2} /><path d="M-22 -30 L-22 -4 M0 -36 L0 -4 M22 -30 L22 -4" stroke={c.shadow} strokeWidth={2} /></g>
  </g>
);

const Elephant: React.FC<Drawn & { c: Colors }> = ({ c, t, seed }) => {
  const g = t * 3 + seed;
  const leg = (x: number, ph: number) => <path d={`M${x} -70 L${x + Math.sin(g + ph) * 8} -30 L${x + Math.sin(g + ph) * 10} 0`} stroke={c.near} strokeWidth={22} strokeLinecap="round" fill="none" />;
  const sway = Math.sin(t * 2.2 + seed) * 10;
  return (
    <g transform={`translate(0 ${-Math.abs(Math.sin(g)) * 2.5})`}>
      {leg(-46, 0)}{leg(-24, 3)}{leg(32, 1.5)}{leg(54, 4.5)}
      <ellipse cx={0} cy={-98} rx={78} ry={52} fill={c.near} />
      <ellipse cx={74} cy={-118} rx={36} ry={34} fill={c.near} />
      <ellipse cx={60} cy={-112} rx={20} ry={30} fill={mix(c.near, c.mid, 0.4)} />
      <path d={`M98 -108 Q${120 + sway} -70 ${104 + sway * 1.4} -34`} stroke={c.near} strokeWidth={17} fill="none" strokeLinecap="round" />
      <path d="M92 -96 Q116 -88 122 -108" stroke={c.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M-76 -108 Q-96 ${-90 + sway} -84 -58`} stroke={c.near} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-34 -146 L-34 -166 L34 -166 L34 -146Z" fill={c.accent} stroke={c.shadow} strokeWidth={2} />
      <g transform="translate(0 -166) scale(0.6)"><Person c={c} t={t} seed={seed} hat="helmet" hold="spear" body={c.mid} face={false} /></g>
    </g>
  );
};

export const Elephants: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    {[0, 1].map((i) => <g key={i} transform={`translate(${-i * 190} ${-i * 12}) scale(${1 - i * 0.12})`}><Elephant c={c} t={t} seed={seed + i * 2} /></g>)}
  </g>
);
