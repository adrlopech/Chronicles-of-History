import React from 'react';
import { Colors, mix } from './palette';
import { Cloth } from './draw';

export type Item =
  | 'none' | 'spear' | 'sword' | 'torch' | 'scroll' | 'shield' | 'tool' | 'sack'
  | 'cup' | 'trophy' | 'shovel' | 'hammer' | 'quill' | 'stone'
  | 'club' | 'staff' | 'bow' | 'crossbow' | 'axe' | 'pistol' | 'rifle' | 'lantern' | 'book' | 'cane' | 'whip' | 'bag' | 'banner' | 'katana'
  | 'pickaxe' | 'laptop' | 'placard' | 'flask' | 'fan' | 'mic';
/** What a person can hold in the hand (the shield is drawn on the arm by `Person`). */
export type Hold = Item;

/** Drawn with the hand at the origin; long things point up (-y), guns point forward (+x). */
export const ItemShape: React.FC<{ item: Item; c: Colors; t: number; seed: number }> = ({ item, c, t, seed }) => {
  const wood = mix(c.near, c.shadow, 0.3);
  const steel = mix(c.light, c.shadow, 0.15);
  switch (item) {
    case 'spear': return <><path d="M0 70 L0 -88" stroke={c.shadow} strokeWidth={3.5} /><path d="M-6 -86 L0 -108 L6 -86Z" fill={c.light} stroke={c.shadow} strokeWidth={1.5} /></>;
    case 'sword': return <><path d="M0 4 L-6 -46" stroke={c.light} strokeWidth={5} strokeLinecap="round" /><path d="M-9 -2 L7 -4" stroke={c.gold} strokeWidth={4} /></>;
    case 'tool': return <><path d="M0 40 L-6 -56" stroke={c.shadow} strokeWidth={4} /><path d="M-6 -56 L-26 -50" stroke={c.light} strokeWidth={5} /></>;
    case 'scroll': return <rect x={-7} y={-14} width={14} height={22} rx={3} fill={c.light} stroke={c.shadow} strokeWidth={1.5} transform="rotate(-18)" />;
    case 'sack': return <path d="M-12 8 Q-16 -14 -4 -20 Q8 -22 14 -6 Q16 8 8 10Z" fill={mix(c.light, c.shadow, 0.35)} stroke={c.shadow} strokeWidth={1.5} />;
    case 'torch': return <><path d="M0 8 L0 -32" stroke={c.shadow} strokeWidth={4} /><path d={`M0 -32 Q${-9 + Math.sin(t * 14 + seed) * 3} -48 0 -64 Q${9 + Math.sin(t * 12 + seed) * 3} -48 0 -32Z`} fill={c.glow} /></>;
    case 'cup': return <g transform="rotate(-25)"><path d="M-6 -12 L6 -12 L4 2 L-4 2Z" fill={c.gold} stroke={c.shadow} strokeWidth={1.2} /><path d="M-2 2 L-2 6 L2 6 L2 2" fill={c.gold} /></g>;
    case 'trophy': return <g transform="translate(0 -14) scale(1.7)"><path d="M-7 -12 L7 -12 Q6 2 0 3 Q-6 2 -7 -12Z" fill={c.gold} stroke={c.shadow} strokeWidth={1} /><path d="M0 3 L0 8 M-4 9 L4 9" stroke={c.shadow} strokeWidth={2} /><path d="M-7 -10 Q-12 -8 -7 -3 M7 -10 Q12 -8 7 -3" stroke={c.gold} strokeWidth={1.6} fill="none" /></g>;
    case 'shovel': return <><path d="M0 -8 L16 56" stroke={wood} strokeWidth={4} strokeLinecap="round" /><path d="M10 52 L28 56 L22 70 L6 64Z" fill={c.light} stroke={c.shadow} strokeWidth={1.4} /></>;
    case 'hammer': return <><path d="M0 8 L0 -34" stroke={wood} strokeWidth={4.5} strokeLinecap="round" /><rect x={-12} y={-46} width={24} height={13} rx={2.5} fill={c.light} stroke={c.shadow} strokeWidth={1.4} /></>;
    case 'quill': return <><path d="M0 4 L10 -22" stroke={c.light} strokeWidth={2.5} strokeLinecap="round" /><path d="M10 -22 Q22 -34 16 -14Z" fill={c.light} stroke={c.shadow} strokeWidth={0.8} /></>;
    case 'stone': return <circle cx={0} cy={-5} r={5} fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={1} />;
    case 'club': return <><path d="M0 10 L0 -34" stroke={wood} strokeWidth={5} strokeLinecap="round" /><ellipse cx={0} cy={-38} rx={8} ry={12} fill={wood} stroke={c.shadow} strokeWidth={1.2} /><path d="M-4 -44 l3 3 M3 -36 l-3 3" stroke={c.shadow} strokeWidth={1.2} /></>;
    case 'staff': return <><path d="M0 62 L0 -76" stroke={wood} strokeWidth={3.8} strokeLinecap="round" /><path d="M0 -76 Q14 -86 10 -68" stroke={c.gold} strokeWidth={3.4} fill="none" strokeLinecap="round" /></>;
    case 'bow': return <><path d="M0 -40 Q-22 0 0 40" stroke={wood} strokeWidth={4} fill="none" strokeLinecap="round" /><path d="M0 -40 L0 40" stroke={c.light} strokeWidth={0.9} opacity={0.8} /></>;
    case 'crossbow': return <><path d="M-6 0 L26 0" stroke={wood} strokeWidth={5} strokeLinecap="round" /><path d="M16 -14 Q24 0 16 14" stroke={wood} strokeWidth={3.6} fill="none" strokeLinecap="round" /><path d="M16 -14 L16 14" stroke={c.light} strokeWidth={0.9} /></>;
    case 'axe': return <><path d="M0 12 L0 -42" stroke={wood} strokeWidth={4.2} strokeLinecap="round" /><path d="M0 -40 Q18 -48 16 -26 Q8 -30 0 -26Z" fill={steel} stroke={c.shadow} strokeWidth={1.3} /></>;
    case 'pistol': return <><path d="M0 0 L20 -2" stroke={c.shadow} strokeWidth={4.4} strokeLinecap="round" /><path d="M0 0 L-4 10" stroke={wood} strokeWidth={4.6} strokeLinecap="round" /></>;
    case 'rifle': return <><path d="M0 40 L0 -70" stroke={wood} strokeWidth={3.6} strokeLinecap="round" /><path d="M0 -20 L0 -70" stroke={c.shadow} strokeWidth={2.6} /><path d="M0 -70 L0 -90" stroke={steel} strokeWidth={1.8} /><path d="M-3 36 L3 24" stroke={c.shadow} strokeWidth={3} /></>;
    case 'lantern': return <><path d="M0 0 L0 -8" stroke={c.shadow} strokeWidth={1.6} /><rect x={-6} y={-8 + 2} width={12} height={16} rx={2} fill={c.glow} opacity={0.9} stroke={c.shadow} strokeWidth={1.4} /><path d="M-6 -2 h12 M0 -6 v14" stroke={c.shadow} strokeWidth={1} /><circle cx={0} cy={4} r={12} fill={c.glow} opacity={0.18} /></>;
    case 'book': return <g transform="rotate(-10)"><rect x={-8} y={-16} width={16} height={22} rx={1.5} fill={mix(c.accent2, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={1.2} /><path d="M-5 -16 L-5 6" stroke={c.gold} strokeWidth={1.2} /></g>;
    case 'cane': return <><path d="M0 40 L0 -26" stroke={wood} strokeWidth={3} strokeLinecap="round" /><circle cx={0} cy={-28} r={4} fill={c.gold} stroke={c.shadow} strokeWidth={1} /></>;
    case 'whip': return <path d={`M0 0 Q18 -12 ${14 + Math.sin(t * 8 + seed) * 6} -34 Q4 -42 22 -52`} stroke={wood} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
    case 'bag': return <><path d="M-10 4 Q-12 -10 0 -12 Q12 -10 10 4Z" fill={mix(c.near, c.light, 0.2)} stroke={c.shadow} strokeWidth={1.3} /><path d="M-4 -11 Q0 -17 4 -11" stroke={c.shadow} strokeWidth={1.4} fill="none" /></>;
    case 'banner': return <><path d="M0 50 L0 -100" stroke={c.shadow} strokeWidth={3.4} /><circle cx={0} cy={-103} r={4.4} fill={c.gold} /><g transform="translate(0 -96)"><Cloth len={46} h={30} t={t} seed={seed} fill={c.accent} stroke={c.shadow} /></g></>;
    case 'katana': return <><path d="M0 6 Q-6 -20 -2 -50" stroke={steel} strokeWidth={3.6} fill="none" strokeLinecap="round" /><path d="M-6 -2 L6 -4" stroke={c.shadow} strokeWidth={3} strokeLinecap="round" /></>;
    case 'pickaxe': return <><path d="M0 24 L0 -40" stroke={wood} strokeWidth={4.2} strokeLinecap="round" /><path d="M-24 -34 Q0 -50 24 -34 Q0 -44 -24 -34Z" fill={steel} stroke={c.shadow} strokeWidth={1.4} /></>;
    case 'laptop': return <g transform="rotate(-8)"><path d="M-12 -2 L12 -2 L10 -14 L-10 -14Z" fill={mix(c.light, c.shadow, 0.3)} stroke={c.shadow} strokeWidth={1.2} /><rect x={-9} y={-12.5} width={18} height={9} fill={c.glow} opacity={0.7} /><path d="M-14 -2 H14 L12 3 H-12Z" fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={1} /></g>;
    case 'placard': return <><path d="M0 40 L0 -52" stroke={wood} strokeWidth={3.4} /><rect x={-24} y={-90} width={48} height={40} rx={2} fill={c.light} stroke={c.shadow} strokeWidth={1.6} /><path d="M-16 -80 h32 M-16 -70 h24 M-16 -60 h30" stroke={c.accent} strokeWidth={3.4} strokeLinecap="round" /></>;
    case 'flask': return <><path d="M-3 -4 L-3 -16 L3 -16 L3 -4 L10 10 Q10 14 0 14 Q-10 14 -10 10Z" fill={mix(c.glow, c.light, 0.3)} stroke={c.shadow} strokeWidth={1.3} opacity={0.95} /><path d="M-8 6 H8" stroke={c.shadow} strokeWidth={1} opacity={0.6} /><circle cx={2} cy={9} r={2} fill="#ffffff" opacity={0.6} /></>;
    case 'fan': return <g transform="rotate(-20)"><path d="M0 4 L-22 -22 Q0 -34 22 -22Z" fill={c.accent} stroke={c.shadow} strokeWidth={1.3} />{[-14, -7, 0, 7, 14].map((x) => <path key={x} d={`M0 4 L${x * 1.5} ${-26 + Math.abs(x) * 0.4}`} stroke={c.gold} strokeWidth={0.9} />)}</g>;
    case 'mic': return <><path d="M0 12 L0 -12" stroke={c.shadow} strokeWidth={3.4} strokeLinecap="round" /><ellipse cx={0} cy={-18} rx={6} ry={7.5} fill={mix(c.light, c.shadow, 0.35)} stroke={c.shadow} strokeWidth={1.3} /><path d="M-6 -18 H6" stroke={c.shadow} strokeWidth={0.9} /></>;
    default: return null;
  }
};
