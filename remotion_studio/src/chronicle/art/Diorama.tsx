import React from 'react';
import { Colors, makeColors, mix } from './palette';
import { GY, H, W } from './draw';
import { Look } from '../looks';
import { Backdrop } from './places';
import { Cavalry, Caravan, Crowd, Elephants, Farmer, King, Merchant, Monk, Scholar, Soldiers } from './people';
import { Banner, Birds, Bridge, Cannon, Castle, Chest, Comet, Crown, Eclipse, Factory, Fire, Fleet, Galley, Gate, Lighthouse, MapTable, Plane, Ruins, Scroll, Ship, Smoke, Sword, Tank, Temple, Tents, Throne, Torch, Tower, Train, Volcano, Windmill, Pyramids } from './things';
import { ArtShot, Subject, kindOf } from './vocab';
import { hash, rng } from '../ink';

type Dr = { c: Colors; t: number; seed: number; dir: 1 | -1 };
const DRAW: Record<Subject, React.FC<Dr>> = {
  castle: Castle, temple: Temple, pyramids: Pyramids, tower: Tower, gate: Gate, windmill: Windmill, factory: Factory, lighthouse: Lighthouse, tents: Tents, bridge: Bridge, ruins: Ruins,
  soldiers: Soldiers, cavalry: Cavalry, king: King, crowd: Crowd, caravan: Caravan, scholar: Scholar, monk: Monk, farmer: Farmer, merchant: Merchant,
  ship: Ship, fleet: Fleet, galley: Galley, elephants: Elephants, train: Train, tank: Tank, plane: Plane,
  scroll: Scroll, crown: Crown, sword: Sword, chest: Chest, torch: Torch, banner: Banner, throne: Throne, map: MapTable, cannon: Cannon,
  fire: Fire, smoke: Smoke, birds: Birds, comet: Comet, eclipse: Eclipse, volcano: Volcano,
};
const SPEED: Partial<Record<Subject, number>> = { soldiers: 46, cavalry: 150, caravan: 38, elephants: 30, ship: 26, fleet: 22, galley: 34, train: 190, tank: 80, plane: 230, farmer: 20 };
const WATER = new Set(['ship', 'fleet', 'galley']);

const DEPTH = { far: { y: GY + 36, s: 0.62, f: 0.6 }, mid: { y: GY + 120, s: 1, f: 0.85 }, near: { y: GY + 230, s: 1.4, f: 1.1 }, fore: { y: GY + 270, s: 1.3, f: 1.3 } } as const;

const Weather: React.FC<{ kind: string; t: number; c: Colors }> = ({ kind, t, c }) => {
  if (kind === 'clear') return null;
  const r = rng(7);
  const drops = kind === 'rain' || kind === 'storm' ? 90 : kind === 'snow' ? 70 : 0;
  const flash = kind === 'storm' ? Math.max(0, Math.sin(t * 1.9) * 3 - 2.4) : 0;
  return (
    <g>
      {kind === 'smoke' && <rect width={1080} height={1000} fill={mix(c.skyMid, c.shadow, 0.5)} opacity={0.32} />}
      {Array.from({ length: drops }, (_, i) => {
        const sp = kind === 'snow' ? 90 + r() * 60 : 700 + r() * 400;
        const x0 = r() * 1200;
        const y = ((r() * H + t * sp) % (H + 60)) - 30;
        const x = x0 + (kind === 'snow' ? Math.sin(t * 1.5 + i) * 24 : y * -0.18);
        return kind === 'snow' ? <circle key={i} cx={x} cy={y} r={2 + r() * 3} fill="#fff" opacity={0.85} /> : <path key={i} d={`M${x} ${y} l-5 22`} stroke={mix(c.light, c.skyMid, 0.3)} strokeWidth={2} opacity={0.6} />;
      })}
      {kind === 'storm' && <g><path d="M700 0 L650 160 L690 160 L630 340 L720 150 L680 150Z" fill="#fff" opacity={flash > 0 ? 0.95 : 0} /><rect width={1080} height={H} fill="#fff" opacity={flash * 0.35} /></g>}
    </g>
  );
};

interface Slot { x: number; d: keyof typeof DEPTH; s: number }

/** One shot: the place, the subjects laid out in depth, the camera sliding across the layers, the weather over everything. Pure function of `frame`. */
export const Diorama: React.FC<{ shot: ArtShot; frame: number; dur: number; look: Look; seed: number }> = ({ shot, frame, dur, look, seed: seed0 }) => {
  const seed = (seed0 + hash(shot.subjects.join())) % 1000;
  const t = frame / 30;
  const c = makeColors(look, shot.time, shot.weather ?? 'clear');
  const prog = frame / Math.max(1, dur);
  const dirCam = seed % 2 ? 1 : -1;
  const cam = dirCam * (prog * 2 - 1) * 0.9;
  const zoom = 1 + 0.07 * prog;
  const subj = shot.subjects;
  const structures = subj.filter((s) => kindOf(s) === 'structure');
  const actors = subj.filter((s) => kindOf(s) === 'actor');
  const props = subj.filter((s) => kindOf(s) === 'prop');
  const effects = subj.filter((s) => kindOf(s) === 'effect');
  const place = shot.place;
  const sS: Slot[] = [{ x: 1020, d: 'far', s: 1.5 }, { x: 470, d: 'far', s: 1.1 }];
  const aS: Slot[] = structures.length ? [{ x: 700, d: 'mid', s: 1.2 }, { x: 420, d: 'near', s: 1.1 }, { x: 1120, d: 'near', s: 1.0 }] : [{ x: 800, d: 'mid', s: 1.4 }, { x: 480, d: 'near', s: 1.15 }, { x: 1130, d: 'far', s: 0.9 }];
  const pS: Slot[] = [{ x: 340, d: 'fore', s: 1.1 }, { x: 1250, d: 'fore', s: 1.0 }];
  const items: { z: number; key: string; node: React.ReactNode }[] = [];
  const put = (sj: Subject, slot: Slot, k: number, travel: boolean) => {
    const D = DEPTH[slot.d];
    const C = DRAW[sj];
    const dir: 1 | -1 = (seed + k) % 3 === 0 ? -1 : 1;
    const sp = travel ? SPEED[sj] ?? 0 : 0;
    const x = slot.x + dir * sp * (t - dur / 60) * (sp > 100 ? 1 : 0.6);
    let y = D.y;
    if (WATER.has(sj)) y = GY + (place === 'sea' || place === 'coast' ? 150 : 110);
    if (sj === 'plane') y = GY - 170 + Math.sin(t) * 12;
    const lx = -260 + cam * 200 * D.f;
    items.push({ z: y + (slot.d === 'far' ? -500 : 0), key: `${sj}${k}`, node: <g transform={`translate(${x + lx} ${y}) scale(${slot.s * D.s})`}><C c={c} t={t} seed={seed + k * 3} dir={dir} /></g> });
  };
  structures.slice(0, 2).forEach((sj, i) => put(sj, sS[i], i, false));
  actors.slice(0, 3).forEach((sj, i) => put(sj, aS[i], 10 + i, true));
  props.slice(0, 2).forEach((sj, i) => put(sj, pS[i], 20 + i, false));
  effects.forEach((sj, i) => {
    const lx = -260 + cam * 200 * 0.5;
    const C = DRAW[sj];
    const pos: Record<string, [number, number, number]> = { fire: [760, GY + 190, 1.5], smoke: [560, GY + 40, 1], birds: [650, GY - 190, 1.1], comet: [820, GY - 170, 1], eclipse: [800, GY - 190, 1.2], volcano: [1040, GY + 40, 1.5] };
    const [x, y, s] = pos[sj];
    items.push({ z: sj === 'fire' ? y + 100 : y - 600, key: `fx${i}`, node: <g transform={`translate(${x + lx} ${y}) scale(${s})`}><C c={c} t={t} seed={seed + i} dir={1} /></g> });
  });
  items.sort((a, b) => a.z - b.z);
  return (
    <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{ display: 'block' }}>
      <g transform={`translate(540 ${GY}) scale(${zoom}) translate(-540 ${-GY})`}>
        <Backdrop place={place} time={shot.time} c={c} t={t} seed={seed} cam={cam} />
        {items.map((it) => <g key={it.key}>{it.node}</g>)}
        <Weather kind={shot.weather ?? (place === 'snow' ? 'snow' : 'clear')} t={t} c={c} />
      </g>
      <rect width={1080} height={H} fill={c.night ? '#05070f' : c.shadow} opacity={c.night ? 0.12 : 0.06} />
    </svg>
  );
};
export const WIDTH_UNUSED = W;
