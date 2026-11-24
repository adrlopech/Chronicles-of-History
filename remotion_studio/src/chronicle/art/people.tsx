import React from 'react';
import { Colors, mix } from './palette';
import { Cloth, Drawn } from './draw';

type Hat = 'none' | 'helmet' | 'crown' | 'hood' | 'cap' | 'turban';
type Hold = 'none' | 'spear' | 'sword' | 'torch' | 'scroll' | 'shield' | 'tool' | 'sack';
export type View = 'front' | 'side' | 'back';
export type Pose = 'stand' | 'walk' | 'run' | 'sit' | 'ride' | 'point' | 'wave' | 'cheer';
interface PersonProps extends Drawn {
  c: Colors; hat?: Hat; robe?: string; body?: string; cloak?: string; hold?: Hold; walk?: boolean; cheer?: boolean; scale?: number; face?: boolean;
  /** Which way it is turned: toward us, in profile (facing right, mirrored by the parent) or away from us. Walkers default to profile. */
  view?: View;
  pose?: Pose;
  /** Sitting figures get a little stool unless this is false. */
  stool?: boolean;
}

/** One figure in the flat storybook style, 112 px tall with its feet at the origin. It can face us, turn to the side or show its back, and it can stand, walk, run, sit, ride, point, wave or cheer. It breathes, blinks and talks; cloaks and flames move. */
export const Person: React.FC<PersonProps> = ({ c, t, seed, hat = 'none', robe, body, cloak, hold = 'none', walk = false, cheer = false, scale = 1, face = true, view, pose, stool = true }) => {
  const P: Pose = pose ?? (cheer ? 'cheer' : walk ? 'walk' : 'stand');
  const moving = P === 'walk' || P === 'run';
  const V: View = view ?? (moving || P === 'ride' ? 'side' : 'front');
  const p = t * (P === 'run' ? 11 : 7) + seed;
  const sw = moving ? Math.sin(p) : 0;
  const sitting = P === 'sit' || P === 'ride';
  const drop = sitting ? 26 : 0;
  const cheering = P === 'cheer';
  const bob = moving ? -Math.abs(Math.sin(p)) * (P === 'run' ? 6 : 4) : -Math.sin(t * 2 + seed) * 1.2 - (cheering ? Math.abs(Math.sin(t * 6 + seed)) * 10 : 0);
  const cloth = body ?? c.mid;
  const dark = mix(cloth, c.shadow, 0.35);
  const ol = mix(c.shadow, cloth, 0.3);
  const k = Math.floor(seed * 13) % 4;
  const skin = mix(c.skin, k % 2 ? c.shadow : c.light, [0, 0.14, 0.08, 0.2][k] * 0.8);
  const skinD = mix(skin, c.shadow, 0.3);
  const hair = [mix(c.shadow, '#000000', 0.4), mix(c.shadow, c.gold, 0.35), mix(c.shadow, c.light, 0.5), mix(c.shadow, c.accent, 0.3)][(k + 1) % 4];
  const beard = (k === 0 || k === 3) && hat !== 'crown' ? true : hat === 'crown';
  const blink = Math.sin(t * 1.3 + seed * 5) > 0.97 ? 0.15 : 1;
  const talk = Math.max(0, Math.sin(t * 9 + seed * 3)) * (moving ? 0 : 1);
  const lift = cheering ? Math.abs(Math.sin(t * 8 + seed)) : 0;
  const HY = -92;
  const side = V === 'side', back = V === 'back';
  const sh = side ? 3 : 13; // shoulder offset
  // arms: where the hands are
  let nearX = side ? 6 - sw * 12 : 21 + sw * 6, nearY = -52 + Math.cos(p) * (moving ? 3 : 0);
  let farX = side ? -6 + sw * 12 : -21 - sw * 6, farY = -52 - Math.cos(p) * (moving ? 3 : 0);
  if (hold !== 'none' && hold !== 'shield' && side) { nearX = 15; nearY = -60; }
  if (cheering) { nearX = side ? 12 : 21; nearY = -92 - lift * 18; farX = side ? 6 : -21; farY = -94 - (1 - lift) * 12; }
  if (P === 'point') { nearX = side ? 30 : back ? 26 : 30; nearY = -84; }
  if (P === 'wave') { nearX = (side ? 12 : 24) + Math.sin(t * 9 + seed) * 5; nearY = -100; }
  if (sitting) { nearX = side ? 16 : 17; nearY = -50 + 0; farX = side ? 10 : -17; farY = -50; }
  const sleeve = (x1: number, y1: number, x2: number, y2: number, col: string) => <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={col} strokeWidth={side ? 7.5 : 8.5} strokeLinecap="round" />;
  const hand = (x: number, y: number) => <circle cx={x} cy={y} r={4.4} fill={skin} stroke={skinD} strokeWidth={0.8} />;
  const boot = mix(c.shadow, '#000000', 0.3);
  const rb = sitting ? -26 : 0; // robe hem
  const hx = side ? 2 : 0; // head centre x
  const eyeY = HY;
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx={side ? 2 : 0} cy={1} rx={robe ? 23 : 18} ry={3.6} fill={c.shadow} opacity={0.3} />
      {/* legs and seat (not lowered) */}
      {!robe && !sitting && (side ? (
        <>
          <path d={`M-1 -44 L${-sw * 12 - 1} -22 L${-sw * 15 - 2} -4`} stroke={dark} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <ellipse cx={-sw * 15 + 3} cy={-1.5} rx={9} ry={3.8} fill={boot} />
          <path d={`M1 -44 L${sw * 12 + 1} -22 L${sw * 15 + 2} -4`} stroke={cloth} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <ellipse cx={sw * 15 + 7} cy={-1.5} rx={9} ry={3.8} fill={boot} />
        </>
      ) : (
        <>
          <path d={`M-5 -44 L${-sw * 8 - 6} -4`} stroke={dark} strokeWidth={10} strokeLinecap="round" />
          <path d={`M5 -44 L${sw * 8 + 6} -4`} stroke={cloth} strokeWidth={10} strokeLinecap="round" />
          <ellipse cx={-sw * 8 - 7} cy={-1.5} rx={8} ry={3.6} fill={boot} />
          <ellipse cx={sw * 8 + 7} cy={-1.5} rx={8} ry={3.6} fill={boot} />
        </>
      ))}
      {sitting && P === 'sit' && stool && <g><rect x={-18} y={-22} width={36} height={7} rx={2} fill={mix(c.near, c.shadow, 0.2)} stroke={ol} strokeWidth={1} /><path d="M-13 -15 L-15 0 M13 -15 L15 0" stroke={ol} strokeWidth={3.5} strokeLinecap="round" /></g>}
      {sitting && (side ? (
        <>
          <path d="M-2 -20 L20 -22 L21 -4" stroke={dark} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <ellipse cx={26} cy={-1.5} rx={9} ry={3.8} fill={boot} />
          <path d="M2 -20 L23 -18 L25 -4" stroke={cloth} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M-6 -20 L-11 -6" stroke={dark} strokeWidth={10} strokeLinecap="round" />
          <path d="M6 -20 L11 -6" stroke={cloth} strokeWidth={10} strokeLinecap="round" />
          <ellipse cx={-11} cy={-2} rx={8} ry={4} fill={boot} />
          <ellipse cx={11} cy={-2} rx={8} ry={4} fill={boot} />
        </>
      ))}
      <g transform={`translate(0 ${bob + drop}) rotate(${P === 'run' ? 6 : 0})`}>
        {cloak && !back && <path d={`M${side ? -10 : -14} -78 Q-22 -40 ${-28 + sw * 3} -6 L${side ? 6 : 28} ${-6} Q${side ? 2 : 22} -40 ${side ? 6 : 14} -78Z`} fill={cloak} stroke={ol} strokeWidth={1.3} />}
        {/* far arm */}
        {sleeve(-sh, -74, farX, farY, dark)}
        {hand(farX, farY)}
        {robe ? (
          <>
            <path d={side ? `M-10 -78 Q-14 -38 ${-17 + sw * 2} ${rb} L${19 + sw * 2} ${rb} Q12 -38 10 -78 Q0 -83 -10 -78Z` : `M-14 -78 Q-18 -38 ${-23 + sw * 2} ${rb} L${23 + sw * 2} ${rb} Q18 -38 14 -78 Q0 -84 -14 -78Z`} fill={robe} stroke={ol} strokeWidth={1.4} />
            {!back && <path d={`M${side ? 4 : 0} -74 L${sw * 2 + (side ? 4 : 0)} ${rb + 2}`} stroke={mix(robe, c.shadow, 0.3)} strokeWidth={1.6} />}
            <path d={side ? 'M-11 -56 Q0 -50 11 -56 L11 -50 Q0 -44 -11 -50Z' : 'M-15 -56 Q0 -50 15 -56 L15 -50 Q0 -44 -15 -50Z'} fill={c.gold} stroke={ol} strokeWidth={0.8} />
            {!back && !side && <path d="M-5 -78 L0 -68 L5 -78Z" fill={mix(skin, robe, 0.3)} />}
            {sitting && <><ellipse cx={side ? 8 : -9} cy={-2 - drop} rx={9} ry={3.8} fill={boot} /><ellipse cx={side ? 20 : 9} cy={-2 - drop} rx={9} ry={3.8} fill={boot} /></>}
          </>
        ) : (
          <>
            <path d={side ? 'M-9 -78 Q-11 -60 -9 -42 L9 -42 Q11 -60 9 -78 Q0 -83 -9 -78Z' : 'M-14 -78 Q-17 -60 -14 -42 L14 -42 Q17 -60 14 -78 Q0 -84 -14 -78Z'} fill={cloth} stroke={ol} strokeWidth={1.4} />
            {!back && !side && <path d="M-6 -80 L0 -68 L6 -80Z" fill={skin} />}
            <rect x={side ? -10 : -14} y={-52} width={side ? 20 : 28} height={6} fill={c.shadow} opacity={0.55} />
            {!back && <rect x={side ? 2 : -4.5} y={-53} width={9} height={8} rx={2} fill={c.gold} stroke={ol} strokeWidth={0.8} />}
          </>
        )}
        {cloak && back && <path d={`M-14 -80 Q-22 -40 ${-28 + sw * 3} -6 L${28 + sw * 3} -6 Q22 -40 14 -80Z`} fill={cloak} stroke={ol} strokeWidth={1.3} />}
        {hold === 'shield' && !back && <g transform={`translate(${side ? 8 : -22} -50)`}><circle r={19} fill={c.accent2} stroke={c.shadow} strokeWidth={2.5} /><circle r={6} fill={c.gold} /></g>}
        {/* near arm and what it holds */}
        {sleeve(sh, -74, nearX, nearY, cloth)}
        <g transform={`translate(${nearX} ${nearY})`}>
          {hold === 'spear' && <><path d="M0 70 L0 -88" stroke={c.shadow} strokeWidth={3.5} /><path d="M-6 -86 L0 -108 L6 -86Z" fill={c.light} stroke={c.shadow} strokeWidth={1.5} /></>}
          {hold === 'sword' && <><path d="M0 4 L-6 -46" stroke={c.light} strokeWidth={5} strokeLinecap="round" /><path d="M-9 -2 L7 -4" stroke={c.gold} strokeWidth={4} /></>}
          {hold === 'tool' && <><path d="M0 40 L-6 -56" stroke={c.shadow} strokeWidth={4} /><path d="M-6 -56 L-26 -50" stroke={c.light} strokeWidth={5} /></>}
          {hold === 'scroll' && <rect x={-7} y={-14} width={14} height={22} rx={3} fill={c.light} stroke={c.shadow} strokeWidth={1.5} transform="rotate(-18)" />}
          {hold === 'sack' && <path d="M-12 8 Q-16 -14 -4 -20 Q8 -22 14 -6 Q16 8 8 10Z" fill={mix(c.light, c.shadow, 0.35)} stroke={c.shadow} strokeWidth={1.5} />}
          {hold === 'torch' && <><path d="M0 8 L0 -32" stroke={c.shadow} strokeWidth={4} /><path d={`M0 -32 Q${-9 + Math.sin(t * 14 + seed) * 3} -48 0 -64 Q${9 + Math.sin(t * 12 + seed) * 3} -48 0 -32Z`} fill={c.glow} /></>}
          {hand(0, 0)}
        </g>
        {/* neck and head */}
        <rect x={side ? -3 : -5} y={-82} width={10} height={9} fill={skinD} />
        {back ? (
          <>
            <ellipse cx={0} cy={HY} rx={15} ry={16} fill={hair} stroke={mix(hair, '#000000', 0.3)} strokeWidth={1} />
            <ellipse cx={-15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} />
            <ellipse cx={15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} />
            <path d={`M-9 ${HY - 8} Q0 ${HY - 14} 9 ${HY - 8}`} stroke={mix(hair, '#ffffff', 0.15)} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          </>
        ) : side ? (
          <>
            {hat !== 'hood' && <ellipse cx={-6} cy={HY - 2} rx={11} ry={14} fill={hair} />}
            <ellipse cx={hx} cy={HY} rx={13} ry={16} fill={skin} stroke={skinD} strokeWidth={1} />
            <path d={`M12 ${HY - 1} L18 ${HY + 4} L12 ${HY + 6}`} fill={skin} stroke={skinD} strokeWidth={1} strokeLinejoin="round" />
            {hat !== 'hood' && <path d={`M-9 ${HY - 14} Q8 ${HY - 22} 14 ${HY - 6} Q8 ${HY - 11} 2 ${HY - 9} Q-4 ${HY - 5} -9 ${HY + 4}Z`} fill={hair} />}
            {beard && <path d={`M-4 ${HY + 8} Q-2 ${HY + 20} 8 ${HY + 18} Q15 ${HY + 14} 13 ${HY + 8} Q8 ${HY + 11} 4 ${HY + 7} Q0 ${HY + 3} -4 ${HY + 8}Z`} fill={hair} />}
            <ellipse cx={-3} cy={HY + 3} rx={2.6} ry={3.4} fill={skin} stroke={skinD} strokeWidth={0.8} />
            <ellipse cx={7} cy={eyeY} rx={2.4} ry={3 * blink} fill="#fffaf0" />
            <circle cx={8} cy={eyeY + 0.3} r={1.7 * blink} fill="#2a1d18" />
            <circle cx={8.6} cy={eyeY - 0.4} r={0.6} fill="#fff" />
            <path d={`M3 ${HY - 5.5} Q7 ${HY - 8} 11 ${HY - 5.5}`} stroke={hair} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            {cheering || talk > 0.3 ? <ellipse cx={10} cy={HY + 10.5} rx={2.4} ry={1.2 + (cheering ? 2 : talk * 2)} fill="#5a1f1f" /> : <path d={`M6 ${HY + 10} Q10 ${HY + 12.5} 13 ${HY + 9.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} fill="none" strokeLinecap="round" />}
            <circle cx={5} cy={HY + 6} r={2.8} fill="#ff7a6a" opacity={0.22} />
          </>
        ) : (
          <>
            {hat !== 'hood' && <path d={`M-15 ${HY - 2} Q-17 ${HY - 20} 0 ${HY - 19} Q17 ${HY - 20} 15 ${HY - 2} L12 ${HY - 5} Q0 ${HY - 13} -12 ${HY - 5}Z`} fill={hair} />}
            <ellipse cx={-15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} stroke={skinD} strokeWidth={0.8} />
            <ellipse cx={15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} stroke={skinD} strokeWidth={0.8} />
            <ellipse cx={0} cy={HY} rx={15} ry={16} fill={skin} stroke={skinD} strokeWidth={1} />
            {hat !== 'hood' && <path d={`M-15 ${HY - 3} Q-14 ${HY - 17} 0 ${HY - 17} Q14 ${HY - 17} 15 ${HY - 3} Q9 ${HY - 12} 0 ${HY - 11} Q-9 ${HY - 12} -15 ${HY - 3}Z`} fill={hair} />}
            {beard && face && <path d={`M-14 ${HY + 3} Q-13 ${HY + 20} 0 ${HY + 20} Q13 ${HY + 20} 14 ${HY + 3} Q8 ${HY + 8} 0 ${HY + 8} Q-8 ${HY + 8} -14 ${HY + 3}Z`} fill={hair} />}
            <ellipse cx={-5.5} cy={HY} rx={2.3} ry={2.9 * blink} fill="#fffaf0" />
            <ellipse cx={5.5} cy={HY} rx={2.3} ry={2.9 * blink} fill="#fffaf0" />
            <circle cx={-5.2} cy={HY + 0.3} r={1.7 * blink} fill="#2a1d18" />
            <circle cx={5.8} cy={HY + 0.3} r={1.7 * blink} fill="#2a1d18" />
            <circle cx={-4.7} cy={HY - 0.4} r={0.6} fill="#fff" />
            <circle cx={6.3} cy={HY - 0.4} r={0.6} fill="#fff" />
            <path d={`M-9 ${HY - 5.5 - (cheering ? 1.5 : 0)} Q-5.5 ${HY - 7.5} -2.5 ${HY - 5.5}`} stroke={hair} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            <path d={`M2.5 ${HY - 5.5} Q5.5 ${HY - 7.5 - (cheering ? 1.5 : 0)} 9 ${HY - 5.5}`} stroke={hair} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            <path d={`M0 ${HY + 1.5} Q2.6 ${HY + 5.5} -0.6 ${HY + 6}`} stroke={skinD} strokeWidth={1.4} fill="none" strokeLinecap="round" />
            {cheering || talk > 0.3 ? <ellipse cx={0} cy={HY + 10.5} rx={3.4} ry={1.3 + (cheering ? 2.2 : talk * 2)} fill="#5a1f1f" /> : <path d={`M-4 ${HY + 9.5} Q0 ${HY + 13} 4 ${HY + 9.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} fill="none" strokeLinecap="round" />}
            <circle cx={-9} cy={HY + 6} r={2.8} fill="#ff7a6a" opacity={0.22} />
            <circle cx={9} cy={HY + 6} r={2.8} fill="#ff7a6a" opacity={0.22} />
          </>
        )}
        {/* headwear */}
        <g transform={`translate(${side ? 1 : 0} 0)`}>
          {hat === 'helmet' && <><path d={`M-16 ${HY - 3} A16 15 0 0 1 16 ${HY - 3}Z`} fill={c.light} stroke={c.shadow} strokeWidth={1.6} /><path d={`M-16 ${HY - 3} L16 ${HY - 3}`} stroke={c.shadow} strokeWidth={2.4} /><path d={`M0 ${HY - 17} Q${8 + Math.sin(t * 5 + seed) * 2} ${HY - 32} 18 ${HY - 20}`} stroke={c.accent} strokeWidth={6} fill="none" strokeLinecap="round" /></>}
          {hat === 'crown' && <path d={`M-13 ${HY - 14} L-15 ${HY - 31} L-7 ${HY - 22} L0 ${HY - 34} L7 ${HY - 22} L15 ${HY - 31} L13 ${HY - 14}Z`} fill={c.gold} stroke={c.shadow} strokeWidth={1.4} />}
          {hat === 'hood' && <path d={`M-18 ${HY + 18} Q-22 ${HY - 22} 0 ${HY - 21} Q22 ${HY - 22} 18 ${HY + 18} Q15 ${HY + 4} 12 ${HY - 6} Q0 ${HY - 14} -12 ${HY - 6} Q-15 ${HY + 4} -18 ${HY + 18}Z`} fill={robe ?? cloth} stroke={ol} strokeWidth={1.2} />}
          {hat === 'cap' && <path d={`M-16 ${HY - 8} Q-14 ${HY - 24} 0 ${HY - 23} Q14 ${HY - 24} 16 ${HY - 8} Q0 ${HY - 14} -16 ${HY - 8}Z`} fill={c.accent2} stroke={ol} strokeWidth={1.2} />}
          {hat === 'turban' && <><ellipse cx={0} cy={HY - 14} rx={17} ry={11} fill={c.light} stroke={c.shadow} strokeWidth={1.3} /><path d={`M-14 ${HY - 12} Q0 ${HY - 22} 14 ${HY - 12}`} stroke={c.shadow} strokeWidth={1.2} fill="none" />{!back && <circle cx={side ? 8 : 0} cy={HY - 15} r={2.6} fill={c.accent} />}</>}
        </g>
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
          {i === 0 && <g transform="translate(18 -98)"><path d="M0 0 L0 -84" stroke={c.shadow} strokeWidth={3.5} /><g transform="translate(0 -82)"><Cloth len={38} h={25} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></g>}
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
            <Person c={c} t={t} seed={seed} hat="helmet" hold="spear" cloak={c.accent} body={c.mid} pose="ride" stool={false} />
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
    <g transform="translate(-70 0)"><Person c={c} t={t} seed={seed + 1} hat="helmet" hold="spear" body={c.mid} scale={0.9} view="side" /></g>
    <g transform="translate(70 0) scale(-1 1)"><Person c={c} t={t} seed={seed + 2} hat="helmet" hold="spear" body={c.mid} scale={0.9} view="side" /></g>
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
          <Person c={c} t={t} seed={seed + i * 0.9} body={[c.mid, c.near, c.accent2, c.far][i % 4]} hat={i % 4 === 0 ? 'cap' : i % 5 === 0 ? 'hood' : 'none'} pose={i % 2 === 0 ? 'cheer' : i % 3 === 1 ? 'wave' : 'stand'} view={i % 3 === 0 ? 'back' : i % 3 === 1 ? 'front' : 'side'} />
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
    <g transform="translate(-60 0)"><Person c={c} t={t} seed={seed + 3} hat="hood" robe={mix(c.mid, c.accent2, 0.3)} scale={0.95} pose="sit" view="side" /></g>
  </g>
);
export const Farmer: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="cap" hold="tool" body={c.accent2} walk scale={1.05} />
    <g transform="translate(-60 0)"><Person c={c} t={t} seed={seed + 2} hat="cap" hold="sack" body={c.mid} walk view="back" scale={0.9} /></g>
  </g>
);
export const Merchant: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="turban" robe={c.accent} hold="sack" scale={1.1} pose="sit" />
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
      <g transform="translate(0 -166) scale(0.6)"><Person c={c} t={t} seed={seed} hat="helmet" hold="spear" body={c.mid} pose="ride" stool={false} /></g>
    </g>
  );
};

export const Elephants: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir }) => (
  <g transform={`scale(${dir} 1)`}>
    {[0, 1].map((i) => <g key={i} transform={`translate(${-i * 190} ${-i * 12}) scale(${1 - i * 0.12})`}><Elephant c={c} t={t} seed={seed + i * 2} /></g>)}
  </g>
);
