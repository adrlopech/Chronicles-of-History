import React from 'react';
import { Colors, mix } from './palette';
import { Cloth, Drawn } from './draw';
import { Action, View } from './vocab';
import { Hat, HatShape } from './hats';
import { Hold, Item, ItemShape } from './items';

export type Pose = Action | 'ride';
type Legs = 'stand' | 'walk' | 'sit' | 'kneel' | 'crouch' | 'wide';
type Eyes = 'open' | 'closed' | 'wide' | 'down' | 'up';
type Mouth = 'smile' | 'flat' | 'sad' | 'open' | 'shout';
interface PersonProps extends Drawn {
  c: Colors; hat?: Hat; robe?: string; body?: string; cloak?: string; hold?: Hold; walk?: boolean; cheer?: boolean; scale?: number; face?: boolean;
  /** Which way it is turned: toward us, in profile (facing right, mirrored by the parent) or away from us. When empty the pose picks the natural one. */
  view?: View;
  /** What it is doing, one of the 37 actions of art/vocab.ts (plus `ride`, set by horses and elephants). */
  pose?: Pose;
  /** Sitting figures get a little stool unless this is false. */
  stool?: boolean;
  /** Costume extras: a breastplate colour, a skin tone (0 light .. 3 dark), a forced beard, long hair, a shield on the far arm, the colour of cloth hats. */
  armor?: string; skin?: number; beard?: boolean; female?: boolean; shield?: boolean; hatColor?: string;
}

type XY = [number, number];
interface Spec {
  legs: Legs; drop: number; bend: number; rot: number; lift: number; amp: number; moving: boolean;
  near: XY; far: XY; item?: Item; itemRot: number; itemDy: number; farItem?: 'paper' | 'bow' | 'book';
  eyes: Eyes; mouth: Mouth; brow: [number, number]; tilt: number; shake: number; extra?: 'arrow' | 'stone';
}
/** The side the pose looks best from when nobody asked for a view. */
const SIDE_POSES: Action[] = ['walk', 'run', 'point', 'kneel', 'bow', 'slash', 'stab', 'fall', 'lie', 'crouch', 'carry', 'push', 'dig', 'hammer', 'write', 'throw', 'shoot', 'drink', 'sneak', 'lean', 'watch'];

/** Poses in which the figure keeps carrying its spear, torch or scroll; in the others both hands are busy or the thing would only get in the way. */
const KEEPS_HOLD: Pose[] = ['stand', 'walk', 'run', 'sit', 'ride', 'point', 'shout', 'watch'];

const NOHAIR: Hat[] = ['hood', 'greathelm', 'nemes', 'wig'];

const specFor = (P: Pose, side: boolean, t: number, seed: number, held: Hold): Spec => {
  const hold: Hold = KEEPS_HOLD.includes(P) ? held : 'none';
  const p0 = t * 7 + seed;
  const f = (a: XY, b: XY): XY => (side ? b : a);
  const o = Math.sin(t * 6 + seed), q = Math.sin(t * 9 + seed), sw = Math.sin(p0);
  const base: Spec = {
    legs: 'stand', drop: 0, bend: 0, rot: 0, lift: 0, amp: 0, moving: false, item: hold === 'none' ? undefined : hold, itemRot: 0, itemDy: 0,
    near: f([21, -52], [6, -52]), far: f([-21, -52], [-6, -52]), eyes: 'open', mouth: 'smile', brow: [0, 0], tilt: 0, shake: 0,
  };
  const m = (x: Partial<Spec>): Spec => ({ ...base, ...x });
  const gripped = hold !== 'none' && hold !== 'shield' && side ? { near: [15, -60] as XY } : {};
  switch (P) {
    case 'walk': return m({ legs: 'walk', moving: true, amp: 1, near: f([21 + sw * 6, -52 + Math.cos(p0) * 3], [6 - sw * 12, -52 + Math.cos(p0) * 3]), far: f([-21 - sw * 6, -52], [-6 + sw * 12, -52]), ...gripped });
    case 'run': return m({ legs: 'walk', moving: true, amp: 1.5, bend: 10, near: f([20 + sw * 8, -60], [10 - sw * 16, -64]), far: f([-20 - sw * 8, -60], [-2 + sw * 16, -64]), mouth: 'open', ...gripped });
    case 'sit': case 'ride': return m({ legs: 'sit', drop: 26, near: f([17, -50], [16, -50]), far: f([-17, -50], [10, -50]) });
    case 'point': return m({ near: f([30, -84 + o * 2], [32, -84 + o * 2]), brow: [0, 0] });
    case 'wave': return m({ near: f([24 + Math.sin(t * 9 + seed) * 5, -100], [12 + Math.sin(t * 9 + seed) * 5, -100]) });
    case 'cheer': { const l = Math.abs(Math.sin(t * 8 + seed)); return m({ near: f([21, -92 - l * 18], [12, -92 - l * 18]), far: f([-21, -94 - (1 - l) * 12], [6, -94 - (1 - l) * 12]), mouth: 'shout', brow: [-1.5, -1.5] }); }
    case 'kneel': return m({ legs: 'kneel', drop: 20, bend: 6, tilt: 6, near: f([19, -48], [14, -44]), far: f([-19, -48], [6, -44]), mouth: 'flat' });
    case 'bow': return m({ bend: 38, near: f([18, -52], [14, -50]), far: f([-18, -52], [4, -50]), eyes: 'closed', mouth: 'flat' });
    case 'pray': return m({ legs: 'kneel', drop: 20, bend: 10, tilt: 8, near: f([4, -60], [10, -60]), far: f([-4, -60], [8, -60]), eyes: 'closed', mouth: 'flat' });
    case 'salute': return m({ near: f([10, -101], [8, -101]), mouth: 'flat', brow: [0, 1] });
    case 'slash': { const w = Math.sin(t * 5 + seed); return m({ legs: 'wide', bend: 6, near: f([20 + w * 8, -88 + w * 16], [10 + w * 16, -86 + w * 18]), far: f([-20, -60], [-8, -60]), item: 'sword', itemRot: 50 + w * 80, mouth: 'shout', brow: [-1.5, 1.8] }); }
    case 'stab': { const w = Math.max(0, Math.sin(t * 4 + seed)); return m({ legs: 'wide', near: f([26 + w * 6, -64], [28 + w * 8, -62]), far: f([-20, -60], [-8, -56]), item: 'sword', itemRot: 88, mouth: 'shout', brow: [-1.5, 1.8] }); }
    case 'fall': return m({ rot: -58, near: f([26, -104], [20, -104]), far: f([-26, -100], [-14, -100]), eyes: 'wide', mouth: 'shout', brow: [1, -2], shake: 1 });
    case 'lie': return m({ rot: 90, lift: -13, eyes: 'closed', mouth: 'flat', near: f([19, -46], [8, -46]), far: f([-19, -46], [-8, -46]) });
    case 'crouch': return m({ legs: 'crouch', drop: 22, bend: 18, near: f([18, -40], [14, -38]), far: f([-18, -40], [8, -38]), mouth: 'flat' });
    case 'carry': return m({ legs: 'walk', moving: true, amp: 1, bend: 8, item: 'sack', itemDy: -12, near: f([12, -90], [4, -92]), far: f([-14, -78], [-4, -80]), mouth: 'flat', brow: [-1, 1] });
    case 'push': return m({ legs: 'walk', moving: true, amp: 0.6, bend: 22, near: f([26, -64], [28, -62]), far: f([22, -60], [24, -62]), mouth: 'flat', brow: [-1, 1.8] });
    case 'dig': { const d = Math.sin(t * 4 + seed); return m({ legs: 'wide', bend: 30, item: 'shovel', near: f([20, -44 + d * 6], [16, -38 + d * 6]), far: f([12, -50], [8, -48 + d * 4]), mouth: 'flat', brow: [-1, 1.5] }); }
    case 'hammer': { const h = Math.sin(t * 5 + seed); return m({ legs: 'wide', near: f([18, -96 + Math.max(0, h) * 34], [16, -96 + Math.max(0, h) * 34]), far: f([-16, -58], [-6, -58]), item: 'hammer', itemRot: -35 + Math.max(0, h) * 105, mouth: 'flat', brow: [-1, 1.5] }); }
    case 'write': return m({ legs: 'sit', drop: 26, bend: 14, near: f([18, -44], [20, -44 + o]), far: f([-12, -44], [12, -42]), item: 'quill', farItem: 'paper', eyes: 'down', mouth: 'flat' });
    case 'read': return m({ bend: 6, near: f([10, -62], [12, -62]), far: f([-10, -62], [8, -62]), farItem: 'book', eyes: 'down', mouth: 'flat' });
    case 'think': return m({ tilt: 8, near: f([8, -84], [10, -82]), far: f([-4, -58], [2, -58]), eyes: 'up', mouth: 'flat', brow: [1, -1.5] });
    case 'shout': return m({ tilt: -8, bend: -4, near: f([14, -90], [14, -90]), mouth: 'shout', brow: [-1, 1.5] });
    case 'plead': return m({ legs: 'kneel', drop: 20, near: f([22, -70], [26, -72]), far: f([-22, -70], [18, -70]), mouth: 'sad', brow: [1.5, -2.2], eyes: 'up' });
    case 'threaten': return m({ near: f([22, -102 + o * 3], [20, -100 + o * 3]), far: f([-16, -58], [-6, -58]), mouth: 'shout', brow: [-1.5, 2], shake: 0.6 });
    case 'shrug': return m({ tilt: 7, near: f([27, -62], [18, -60]), far: f([-27, -62], [10, -60]), mouth: 'flat', lift: 0 });
    case 'lift': return m({ near: f([14, -112], [10, -112]), far: f([-14, -110], [2, -110]), item: hold === 'none' ? 'trophy' : hold, mouth: 'shout', brow: [-1.5, -1.5] });
    case 'throw': return m({ legs: 'wide', bend: -6, near: f([-14 + ease01((t * 2.2 + seed * 0.3) % 1) * 44, -96 + ease01((t * 2.2 + seed * 0.3) % 1) * 16], [-14 + ease01((t * 2.2 + seed * 0.3) % 1) * 44, -96 + ease01((t * 2.2 + seed * 0.3) % 1) * 16]), far: f([-20, -66], [-4, -66]), item: (t * 2.2 + seed * 0.3) % 1 < 0.62 ? 'stone' : undefined, extra: 'stone', mouth: 'shout', brow: [-1, 1.5] });
    case 'shoot': return m({ legs: 'wide', near: f([8, -76], [2, -76]), far: f([30, -76], [30, -76]), farItem: 'bow', extra: 'arrow', mouth: 'flat', brow: [-1, 1.5] });
    case 'drink': return m({ tilt: -10, near: f([10, -88], [11, -86]), far: f([-16, -56], [-6, -56]), item: 'cup', eyes: 'closed' });
    case 'dance': return m({ legs: 'walk', amp: 0.8, moving: true, rot: Math.sin(t * 6 + seed) * 4, tilt: Math.sin(t * 6 + seed) * 8, near: f([26, -96 + o * 10], [14, -96 + o * 10]), far: f([-26, -96 - o * 10], [0, -96 - o * 10]), mouth: 'shout', brow: [-1, -1] });
    case 'sneak': return m({ legs: 'walk', amp: 0.5, moving: true, drop: 8, bend: 22, near: f([16, -48], [16, -46]), far: f([-14, -50], [6, -50]), mouth: 'flat', brow: [-1, 1.5] });
    case 'surrender': return m({ near: f([16, -106], [12, -106]), far: f([-16, -106], [4, -106]), eyes: 'wide', mouth: 'open', brow: [1, -2], shake: 0.6 });
    case 'cower': return m({ legs: 'crouch', drop: 22, bend: 32, near: f([10, -100], [16, -92]), far: f([-10, -100], [8, -92]), eyes: 'closed', mouth: 'sad', brow: [1.5, -2.2], shake: 1.2 });
    case 'lean': return m({ bend: 8, near: f([20, -56], [18, -58]), far: f([-14, -52], [-6, -52]), item: 'spear', itemDy: -14, mouth: 'flat' });
    case 'watch': return m({ bend: 6, tilt: -6, near: f([14, -100], [14, -98]), far: f([-14, -54], [-6, -54]), mouth: 'flat', brow: [-1, 0] });
    default: return base;
  }
};
const ease01 = (x: number) => (x < 0.6 ? (x / 0.6) * 0.25 : 0.25 + ((x - 0.6) / 0.4) * 0.75);

/** One figure in the flat storybook style, 112 px tall with its feet at the origin. It can face us, turn to the side or show its back, and it can do any of the 37 actions of art/vocab.ts: stand, walk, run, sit, kneel, bow, pray, fight, fall, lie, dig, hammer, write, read, think, shout, dance, shoot and more. It breathes, blinks and talks; cloaks and flames move. */
export const Person: React.FC<PersonProps> = ({ c, t, seed, hat = 'none', robe, body, cloak, hold = 'none', walk = false, cheer = false, scale = 1, face = true, view, pose, stool = true, armor, skin: skinIdx, beard: beardProp, female = false, shield = false, hatColor }) => {
  const P: Pose = pose ?? (cheer ? 'cheer' : walk ? 'walk' : 'stand');
  const V: View = view ?? (P === 'ride' || (SIDE_POSES as string[]).includes(P) ? 'side' : 'front');
  const side = V === 'side', back = V === 'back';
  const S = specFor(P, side, t, seed, hold);
  const p = t * (P === 'run' ? 11 : P === 'push' || P === 'sneak' ? 5 : P === 'dance' ? 6 : 7) + seed;
  const sw = S.moving ? Math.sin(p) * S.amp : 0;
  const sitting = S.legs === 'sit';
  const cheering = P === 'cheer' || P === 'lift' || P === 'dance';
  const bob = S.moving ? -Math.abs(Math.sin(p)) * (P === 'run' ? 6 : 4) * Math.min(1, S.amp + 0.3) : -Math.sin(t * 2 + seed) * 1.2 - (cheering ? Math.abs(Math.sin(t * 6 + seed)) * 10 : 0);
  const jit = S.shake ? Math.sin(t * 40 + seed) * S.shake : 0;
  const cloth = body ?? c.mid;
  const dark = mix(cloth, c.shadow, 0.35);
  const ol = mix(c.shadow, cloth, 0.3);
  const k = Math.floor(seed * 13) % 4;
  const tones = [mix(c.skin, c.light, 0.2), c.skin, mix(c.skin, c.shadow, 0.28), mix(c.skin, c.shadow, 0.5)];
  const skin = skinIdx !== undefined ? tones[Math.max(0, Math.min(3, skinIdx))] : mix(c.skin, k % 2 ? c.shadow : c.light, [0, 0.14, 0.08, 0.2][k] * 0.8);
  const skinD = mix(skin, c.shadow, 0.3);
  const hair = [mix(c.shadow, '#000000', 0.4), mix(c.shadow, c.gold, 0.35), mix(c.shadow, c.light, 0.5), mix(c.shadow, c.accent, 0.3)][(k + 1) % 4];
  const beard = female ? false : beardProp ?? ((k === 0 || k === 3) && hat !== 'crown' ? true : hat === 'crown');
  const blinking = Math.sin(t * 1.3 + seed * 5) > 0.97;
  const eyes: Eyes = S.eyes === 'open' && blinking ? 'closed' : S.eyes;
  const talk = Math.max(0, Math.sin(t * 9 + seed * 3)) * (S.moving ? 0 : 1);
  const mouth: Mouth = S.mouth === 'smile' && talk > 0.3 ? 'open' : S.mouth === 'flat' && talk > 0.6 ? 'open' : S.mouth;
  const HY = -92;
  const drop = S.drop;
  const hip = -44 + drop;
  const sh = side ? 3 : 13;
  const [nearX, nearY] = S.near, [farX, farY] = S.far;
  const sleeve = (x1: number, y1: number, x2: number, y2: number, col: string) => <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={col} strokeWidth={side ? 7.5 : 8.5} strokeLinecap="round" />;
  const hand = (x: number, y: number) => <circle cx={x} cy={y} r={4.4} fill={skin} stroke={skinD} strokeWidth={0.8} />;
  const boot = mix(c.shadow, '#000000', 0.3);
  const rb = drop > 0 ? -drop : 0; // robe hem rises with the body so it still ends at the ground
  const hx = side ? 2 : 0;
  const A = S.amp;
  const foot = (x: number, y = -1.5, rx = 8) => <ellipse cx={x} cy={y} rx={rx} ry={3.6} fill={boot} />;
  const L = (d: string, col: string) => <path d={d} stroke={col} strokeWidth={side ? 9 : 10} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  const legs = (() => {
    if (robe) return null;
    switch (S.legs) {
      case 'sit': return side ? (<>{L('M-2 -20 L20 -22 L21 -4', dark)}{foot(26, -1.5, 9)}{L('M2 -20 L23 -18 L25 -4', cloth)}</>) : (<>{L('M-6 -20 L-11 -6', dark)}{L('M6 -20 L11 -6', cloth)}{foot(-11, -2, 8)}{foot(11, -2, 8)}</>);
      case 'kneel': return side ? (<>{L(`M2 ${hip} L16 -22 L16 -4`, dark)}{foot(21, -1.5, 8)}{L(`M-2 ${hip} L2 -4 L-18 -4`, cloth)}{foot(-24, -2, 7)}</>) : (<>{L(`M-5 ${hip} L-9 -5`, dark)}{L(`M5 ${hip} L9 -5`, cloth)}{foot(-11, -2, 8)}{foot(11, -2, 8)}</>);
      case 'crouch': return side ? (<>{L(`M-3 ${hip} L12 -26 L4 -4`, dark)}{foot(9, -1.5, 8)}{L(`M1 ${hip} L16 -26 L10 -4`, cloth)}{foot(15, -1.5, 8)}</>) : (<>{L(`M-5 ${hip} L-16 -22 L-9 -4`, dark)}{L(`M5 ${hip} L16 -22 L9 -4`, cloth)}{foot(-10, -2, 8)}{foot(10, -2, 8)}</>);
      case 'wide': return side ? (<>{L(`M-1 ${hip} L-8 -24 L-18 -4`, dark)}{foot(-14, -1.5, 8)}{L(`M1 ${hip} L14 -26 L18 -4`, cloth)}{foot(23, -1.5, 8)}</>) : (<>{L(`M-5 ${hip} L-15 -4`, dark)}{L(`M5 ${hip} L15 -4`, cloth)}{foot(-17, -1.5, 8)}{foot(17, -1.5, 8)}</>);
      case 'walk': return side ? (<>{L(`M-1 ${hip} L${-sw * 12 - 1} ${hip / 2 - 2} L${-sw * 15 - 2} -4`, dark)}{foot(-sw * 15 + 3, -1.5, 9)}{L(`M1 ${hip} L${sw * 12 + 1} ${hip / 2 - 2} L${sw * 15 + 2} -4`, cloth)}{foot(sw * 15 + 7, -1.5, 9)}</>) : (<>{L(`M-5 ${hip} L${-sw * 8 - 6} -4`, dark)}{L(`M5 ${hip} L${sw * 8 + 6} -4`, cloth)}{foot(-sw * 8 - 7)}{foot(sw * 8 + 7)}</>);
      default: return side ? (<>{L(`M-1 ${hip} L-1 -4`, dark)}{foot(3, -1.5, 9)}{L(`M1 ${hip} L1 -4`, cloth)}{foot(5, -1.5, 9)}</>) : (<>{L(`M-5 ${hip} L-6 -4`, dark)}{L(`M5 ${hip} L6 -4`, cloth)}{foot(-7)}{foot(7)}</>);
    }
  })();
  const seat = S.legs === 'sit' && P !== 'ride' && stool && <g><rect x={-18} y={-22} width={36} height={7} rx={2} fill={mix(c.near, c.shadow, 0.2)} stroke={ol} strokeWidth={1} /><path d="M-13 -15 L-15 0 M13 -15 L15 0" stroke={ol} strokeWidth={3.5} strokeLinecap="round" /></g>;
  // ---- face parts
  const browF = (sx: 1 | -1) => <path d={`M${sx * 9} ${HY - 5.5 + S.brow[0]} Q${sx * 5.5} ${HY - 7.5 + (S.brow[0] + S.brow[1]) / 2} ${sx * 2.5} ${HY - 5.5 + S.brow[1]}`} stroke={hair} strokeWidth={1.6} fill="none" strokeLinecap="round" />;
  const eyeF = (cx: number) => eyes === 'closed' ? <path d={`M${cx - 3} ${HY} Q${cx} ${HY + 2.4} ${cx + 3} ${HY}`} stroke="#2a1d18" strokeWidth={1.4} fill="none" strokeLinecap="round" /> : (
    <>
      <ellipse cx={cx} cy={HY} rx={eyes === 'wide' ? 2.9 : 2.3} ry={eyes === 'wide' ? 3.6 : 2.9} fill="#fffaf0" />
      <circle cx={cx + 0.3} cy={HY + 0.3 + (eyes === 'down' ? 1.2 : eyes === 'up' ? -1.3 : 0)} r={eyes === 'wide' ? 1.4 : 1.7} fill="#2a1d18" />
      <circle cx={cx + 0.8} cy={HY - 0.4 + (eyes === 'down' ? 1.2 : eyes === 'up' ? -1.3 : 0)} r={0.6} fill="#fff" />
    </>
  );
  const mouthF = () => {
    switch (mouth) {
      case 'open': return <ellipse cx={0} cy={HY + 10.5} rx={3} ry={2.4} fill="#5a1f1f" />;
      case 'shout': return <ellipse cx={0} cy={HY + 11} rx={4.4} ry={4} fill="#5a1f1f" />;
      case 'flat': return <path d={`M-3.5 ${HY + 10.5} L3.5 ${HY + 10.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} strokeLinecap="round" />;
      case 'sad': return <path d={`M-4 ${HY + 12.5} Q0 ${HY + 8.5} 4 ${HY + 12.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} fill="none" strokeLinecap="round" />;
      default: return <path d={`M-4 ${HY + 9.5} Q0 ${HY + 13} 4 ${HY + 9.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} fill="none" strokeLinecap="round" />;
    }
  };
  const mouthS = () => {
    switch (mouth) {
      case 'open': return <ellipse cx={10} cy={HY + 10.5} rx={2.2} ry={2.2} fill="#5a1f1f" />;
      case 'shout': return <ellipse cx={10} cy={HY + 11} rx={3} ry={3.8} fill="#5a1f1f" />;
      case 'flat': return <path d={`M7 ${HY + 10.5} L13 ${HY + 10.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} strokeLinecap="round" />;
      case 'sad': return <path d={`M6 ${HY + 12.5} Q10 ${HY + 9} 13 ${HY + 12}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} fill="none" strokeLinecap="round" />;
      default: return <path d={`M6 ${HY + 10} Q10 ${HY + 12.5} 13 ${HY + 9.5}`} stroke={beard ? c.light : '#7a2c2c'} strokeWidth={1.5} fill="none" strokeLinecap="round" />;
    }
  };
  const item = S.item;
  const throwU = (t * 2.2 + seed * 0.3) % 1;
  const mid: XY = [(nearX + farX) / 2, (nearY + farY) / 2];
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx={side ? 2 : 0} cy={1} rx={robe || S.rot ? 23 : 18} ry={3.6} fill={c.shadow} opacity={0.3} />
      <g transform={`translate(${jit} ${S.lift}) rotate(${S.rot})`}>
        {legs}
        {seat}
        <g transform={`translate(0 ${bob + drop}) rotate(${S.bend} 0 -44)`}>
          {cloak && !back && <path d={`M${side ? -10 : -14} -78 Q-22 -40 ${-28 + sw * 3} -6 L${side ? 6 : 28} -6 Q${side ? 2 : 22} -40 ${side ? 6 : 14} -78Z`} fill={cloak} stroke={ol} strokeWidth={1.3} />}
          {female && !back && <path d={side ? `M-4 ${HY - 16} Q-26 ${HY - 6} -18 ${HY + 34} L-1 ${HY + 30}Z` : `M-17 ${HY - 6} Q-22 ${HY + 26} -13 ${HY + 36} L13 ${HY + 36} Q22 ${HY + 26} 17 ${HY - 6}Z`} fill={hair} />}
          {sleeve(-sh, -74, farX, farY, dark)}
          {hand(farX, farY)}
          {robe ? (
            <>
              <path d={side ? `M-10 -78 Q-14 -38 ${-17 + sw * 2} ${rb} L${19 + sw * 2} ${rb} Q12 -38 10 -78 Q0 -83 -10 -78Z` : `M-14 -78 Q-18 -38 ${-23 + sw * 2} ${rb} L${23 + sw * 2} ${rb} Q18 -38 14 -78 Q0 -84 -14 -78Z`} fill={robe} stroke={ol} strokeWidth={1.4} />
              {!back && <path d={`M${side ? 4 : 0} -74 L${sw * 2 + (side ? 4 : 0)} ${rb + 2}`} stroke={mix(robe, c.shadow, 0.3)} strokeWidth={1.6} />}
              <path d={side ? 'M-11 -56 Q0 -50 11 -56 L11 -50 Q0 -44 -11 -50Z' : 'M-15 -56 Q0 -50 15 -56 L15 -50 Q0 -44 -15 -50Z'} fill={c.gold} stroke={ol} strokeWidth={0.8} />
              {!back && !side && <path d="M-5 -78 L0 -68 L5 -78Z" fill={mix(skin, robe, 0.3)} />}
              {drop > 0 && <>{foot(side ? 8 : -9, -2 - drop, 9)}{foot(side ? 20 : 9, -2 - drop, 9)}</>}
            </>
          ) : (
            <>
              <path d={side ? 'M-9 -78 Q-11 -60 -9 -42 L9 -42 Q11 -60 9 -78 Q0 -83 -9 -78Z' : 'M-14 -78 Q-17 -60 -14 -42 L14 -42 Q17 -60 14 -78 Q0 -84 -14 -78Z'} fill={cloth} stroke={ol} strokeWidth={1.4} />
              {!back && !side && <path d="M-6 -80 L0 -68 L6 -80Z" fill={skin} />}
              <rect x={side ? -10 : -14} y={-52} width={side ? 20 : 28} height={6} fill={c.shadow} opacity={0.55} />
              {!back && <rect x={side ? 2 : -4.5} y={-53} width={9} height={8} rx={2} fill={c.gold} stroke={ol} strokeWidth={0.8} />}
            </>
          )}
          {armor && (
            <g>
              <path d={side ? 'M-9 -78 Q-11 -62 -9 -46 L9 -46 Q11 -62 9 -78 Q0 -83 -9 -78Z' : 'M-14 -78 Q-17 -62 -14 -46 L14 -46 Q17 -62 14 -78 Q0 -84 -14 -78Z'} fill={armor} stroke={ol} strokeWidth={1.4} />
              {!back && <path d={side ? 'M-5 -72 Q0 -60 -5 -50' : 'M0 -76 L0 -48 M-9 -66 Q0 -60 9 -66 M-9 -56 Q0 -50 9 -56'} stroke={mix(armor, '#ffffff', 0.45)} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.8} />}
              <circle cx={-sh} cy={-75} r={5.4} fill={armor} stroke={ol} strokeWidth={1.1} />
              <circle cx={sh} cy={-75} r={5.4} fill={armor} stroke={ol} strokeWidth={1.1} />
            </g>
          )}
          {cloak && back && <path d={`M-14 -80 Q-22 -40 ${-28 + sw * 3} -6 L${28 + sw * 3} -6 Q22 -40 14 -80Z`} fill={cloak} stroke={ol} strokeWidth={1.3} />}
          {(hold === 'shield' || shield) && !back && <g transform={`translate(${side ? 8 : -22} -50)`}><circle r={15} fill={mix(c.accent2, c.mid, 0.4)} stroke={c.shadow} strokeWidth={2.5} /><circle r={5} fill={c.gold} /><circle r={11} fill="none" stroke={c.light} strokeWidth={1.4} opacity={0.6} /></g>}
          {/* the far hand's own thing: a bow, a sheet, a book */}
          {S.farItem === 'bow' && <g transform={`translate(${farX} ${farY})`}><path d="M0 -26 Q-14 0 0 26" stroke={mix(c.near, c.shadow, 0.3)} strokeWidth={3.5} fill="none" strokeLinecap="round" /><path d="M0 -26 L0 26" stroke={c.light} strokeWidth={0.8} opacity={0.7} /></g>}
          {S.farItem === 'paper' && <rect x={farX - 9} y={farY - 8} width={18} height={14} rx={1.5} fill={c.light} stroke={c.shadow} strokeWidth={1} transform={`rotate(-12 ${farX} ${farY})`} />}
          {S.farItem === 'book' && <g transform={`translate(${mid[0]} ${mid[1] - 2}) rotate(${side ? -8 : 0})`}><rect x={-12} y={-8} width={24} height={17} rx={1.5} fill={mix(c.accent2, c.shadow, 0.2)} stroke={c.shadow} strokeWidth={1.2} /><path d="M0 -8 L0 9" stroke={c.gold} strokeWidth={1.4} /><rect x={-9} y={-5} width={7} height={11} fill={c.light} opacity={0.85} /><rect x={2} y={-5} width={7} height={11} fill={c.light} opacity={0.85} /></g>}
          {S.extra === 'arrow' && <path d={`M${nearX} ${nearY} L${farX + 4} ${farY}`} stroke={c.light} strokeWidth={1.6} />}
          {sleeve(sh, -74, nearX, nearY, cloth)}
          <g transform={`translate(${nearX} ${nearY})`}>
            <g transform={`translate(0 ${S.itemDy}) rotate(${S.itemRot})`}>
              {item && <ItemShape item={item} c={c} t={t} seed={seed} />}
            </g>
            {hand(0, 0)}
          </g>
          {P === 'throw' && throwU >= 0.62 && <circle cx={nearX + 10 + (throwU - 0.62) * 260} cy={nearY - 8 - (throwU - 0.62) * 70 + Math.pow((throwU - 0.62) * 10, 2) * 4.5} r={5} fill={mix(c.light, c.shadow, 0.5)} stroke={c.shadow} strokeWidth={1} />}
          {/* neck and head */}
          <rect x={side ? -3 : -5} y={-82} width={10} height={9} fill={skinD} />
          <g transform={`rotate(${S.tilt} 0 -80)`}>
            {back ? (
              <>
                <ellipse cx={0} cy={HY} rx={15} ry={16} fill={hair} stroke={mix(hair, '#000000', 0.3)} strokeWidth={1} />
                {female && <path d={`M-16 ${HY - 12} Q-22 ${HY + 28} -11 ${HY + 38} L11 ${HY + 38} Q22 ${HY + 28} 16 ${HY - 12}Z`} fill={hair} stroke={mix(hair, '#000000', 0.3)} strokeWidth={1} />}
                <ellipse cx={-15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} />
                <ellipse cx={15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} />
                <path d={`M-9 ${HY - 8} Q0 ${HY - 14} 9 ${HY - 8}`} stroke={mix(hair, '#ffffff', 0.15)} strokeWidth={1.5} fill="none" strokeLinecap="round" />
              </>
            ) : side ? (
              <>
                {!NOHAIR.includes(hat) && <ellipse cx={-6} cy={HY - 2} rx={11} ry={14} fill={hair} />}
                <ellipse cx={hx} cy={HY} rx={13} ry={16} fill={skin} stroke={skinD} strokeWidth={1} />
                <path d={`M12 ${HY - 1} L18 ${HY + 4} L12 ${HY + 6}`} fill={skin} stroke={skinD} strokeWidth={1} strokeLinejoin="round" />
                {!NOHAIR.includes(hat) && <path d={`M-9 ${HY - 14} Q8 ${HY - 22} 14 ${HY - 6} Q8 ${HY - 11} 2 ${HY - 9} Q-4 ${HY - 5} -9 ${HY + 4}Z`} fill={hair} />}
                {beard && <path d={`M-4 ${HY + 8} Q-2 ${HY + 20} 8 ${HY + 18} Q15 ${HY + 14} 13 ${HY + 8} Q8 ${HY + 11} 4 ${HY + 7} Q0 ${HY + 3} -4 ${HY + 8}Z`} fill={hair} />}
                <ellipse cx={-3} cy={HY + 3} rx={2.6} ry={3.4} fill={skin} stroke={skinD} strokeWidth={0.8} />
                {eyeF(7)}
                <path d={`M3 ${HY - 5.5 + S.brow[1]} Q7 ${HY - 8 + (S.brow[0] + S.brow[1]) / 2} 11 ${HY - 5.5 + S.brow[0]}`} stroke={hair} strokeWidth={1.6} fill="none" strokeLinecap="round" />
                {mouthS()}
                <circle cx={5} cy={HY + 6} r={2.8} fill="#ff7a6a" opacity={0.22} />
              </>
            ) : (
              <>
                {!NOHAIR.includes(hat) && <path d={`M-15 ${HY - 2} Q-17 ${HY - 20} 0 ${HY - 19} Q17 ${HY - 20} 15 ${HY - 2} L12 ${HY - 5} Q0 ${HY - 13} -12 ${HY - 5}Z`} fill={hair} />}
                <ellipse cx={-15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} stroke={skinD} strokeWidth={0.8} />
                <ellipse cx={15} cy={HY + 2} rx={2.8} ry={3.8} fill={skin} stroke={skinD} strokeWidth={0.8} />
                <ellipse cx={0} cy={HY} rx={15} ry={16} fill={skin} stroke={skinD} strokeWidth={1} />
                {!NOHAIR.includes(hat) && <path d={`M-15 ${HY - 3} Q-14 ${HY - 17} 0 ${HY - 17} Q14 ${HY - 17} 15 ${HY - 3} Q9 ${HY - 12} 0 ${HY - 11} Q-9 ${HY - 12} -15 ${HY - 3}Z`} fill={hair} />}
                {beard && face && <path d={`M-14 ${HY + 3} Q-13 ${HY + 20} 0 ${HY + 20} Q13 ${HY + 20} 14 ${HY + 3} Q8 ${HY + 8} 0 ${HY + 8} Q-8 ${HY + 8} -14 ${HY + 3}Z`} fill={hair} />}
                {eyeF(-5.5)}{eyeF(5.5)}
                {browF(-1)}{browF(1)}
                <path d={`M0 ${HY + 1.5} Q2.6 ${HY + 5.5} -0.6 ${HY + 6}`} stroke={skinD} strokeWidth={1.4} fill="none" strokeLinecap="round" />
                {mouthF()}
                <circle cx={-9} cy={HY + 6} r={2.8} fill="#ff7a6a" opacity={0.22} />
                <circle cx={9} cy={HY + 6} r={2.8} fill="#ff7a6a" opacity={0.22} />
              </>
            )}
            <g transform={`translate(${side ? 1 : 0} 0)`}><HatShape hat={hat} c={c} t={t} seed={seed} HY={HY} side={side} back={back} color={hatColor} cloth={robe ?? cloth} /></g>
          </g>
        </g>
      </g>
    </g>
  );
};

/** A row of marching soldiers with a banner-bearer: the army of a thousand stories. */
export const Soldiers: React.FC<Drawn & { c: Colors; n?: number }> = ({ c, t, seed, dir, act, view, n = 6 }) => {
  const slots = Array.from({ length: n }, (_, i) => ({ x: -((i % 3) * 52) - Math.floor(i / 3) * 24, y: -Math.floor(i / 3) * 16 - (i % 2) * 5 }));
  return (
    <g transform={`scale(${dir} 1)`}>
      {slots.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <Person c={c} t={t} seed={seed + i * 0.35} hat="helmet" hold={i % 3 === 1 ? 'sword' : 'spear'} body={i % 2 ? c.near : c.mid} cloak={i === 0 ? c.accent : undefined} pose={act ?? 'walk'} view={view} />
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

export const King: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir, act, view }) => (
  <g transform={`scale(${dir} 1)`}>
    <g transform="translate(-70 0)"><Person c={c} t={t} seed={seed + 1} hat="helmet" hold="spear" body={c.mid} scale={0.9} view="side" /></g>
    <g transform="translate(70 0) scale(-1 1)"><Person c={c} t={t} seed={seed + 2} hat="helmet" hold="spear" body={c.mid} scale={0.9} view="side" /></g>
    <Person c={c} t={t} seed={seed} hat="crown" cloak={c.accent} robe={c.accent2} scale={1.18} pose={act} view={view} />
  </g>
);

export const Crowd: React.FC<Drawn & { c: Colors; n?: number }> = ({ c, t, seed, act, view, n = 11 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const row = i % 3;
      const x = (i - n / 2) * 30 + (row - 1) * 9;
      return (
        <g key={i} transform={`translate(${x} ${-row * 12}) scale(${0.78 + row * 0.1})`}>
          <Person c={c} t={t} seed={seed + i * 0.9} body={[c.mid, c.near, c.accent2, c.far][i % 4]} hat={i % 4 === 0 ? 'cap' : i % 5 === 0 ? 'hood' : 'none'} pose={act ? (i % 4 === 3 ? 'stand' : act) : i % 2 === 0 ? 'cheer' : i % 3 === 1 ? 'wave' : 'stand'} view={view ?? (i % 3 === 0 ? 'back' : i % 3 === 1 ? 'front' : 'side')} />
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

export const Scholar: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir, act, view }) => (
  <g transform={`scale(${dir} 1)`}><Person c={c} t={t} seed={seed} hat="cap" robe={c.accent2} hold="scroll" scale={1.1} pose={act} view={view} /></g>
);
export const Monk: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir, act, view }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="hood" robe={mix(c.near, c.accent2, 0.35)} scale={1.1} pose={act} view={view} />
    <g transform="translate(-60 0)"><Person c={c} t={t} seed={seed + 3} hat="hood" robe={mix(c.mid, c.accent2, 0.3)} scale={0.95} pose="sit" view="side" /></g>
  </g>
);
export const Farmer: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir, act, view }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="cap" hold="tool" body={c.accent2} pose={act ?? 'walk'} view={view} scale={1.05} />
    <g transform="translate(-60 0)"><Person c={c} t={t} seed={seed + 2} hat="cap" hold="sack" body={c.mid} walk view="back" scale={0.9} /></g>
  </g>
);
export const Merchant: React.FC<Drawn & { c: Colors }> = ({ c, t, seed, dir, act, view }) => (
  <g transform={`scale(${dir} 1)`}>
    <Person c={c} t={t} seed={seed} hat="turban" robe={c.accent} hold="sack" scale={1.1} pose={act ?? 'sit'} view={view} />
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
