import React from 'react';
import { Colors, makeColors, mix } from './palette';
import { GY, H, W } from './draw';
import { Look } from '../looks';
import { Backdrop, sunWorld } from './places';
import { Cavalry, Caravan, Crowd, Elephants, Farmer, King, Merchant, Monk, Scholar, Soldiers } from './people';
import { Banner, Birds, Bridge, Cannon, Castle, Chest, Comet, Crown, Eclipse, Factory, Fire, Fleet, Galley, Gate, Lighthouse, MapTable, Plane, Ruins, Scroll, Ship, Smoke, Sword, Tank, Temple, Tents, Throne, Torch, Tower, Train, Volcano, Windmill, Pyramids } from './things';
import { Action, ArtShot, Subject, View, kindOf, PEOPLE, PersonKind } from './vocab';
import { PersonGroup } from './costumes';
import { NEW_ANIMALS } from './animals';
import { NEW_STRUCTURES } from './structures2';
import { STRUCTURES3, VEHICLES3 } from './structures3';
import { hash, rng } from '../ink';

type Dr = { c: Colors; t: number; seed: number; dir: 1 | -1; act?: Action; view?: View };
const DRAW: Record<string, React.FC<Dr>> = {
  castle: Castle, temple: Temple, pyramids: Pyramids, tower: Tower, gate: Gate, windmill: Windmill, factory: Factory, lighthouse: Lighthouse, tents: Tents, bridge: Bridge, ruins: Ruins,
  soldiers: Soldiers, cavalry: Cavalry, king: King, crowd: Crowd, caravan: Caravan, scholar: Scholar, monk: Monk, farmer: Farmer, merchant: Merchant,
  ship: Ship, fleet: Fleet, galley: Galley, elephants: Elephants, train: Train, tank: Tank, plane: Plane,
  scroll: Scroll, crown: Crown, sword: Sword, chest: Chest, torch: Torch, banner: Banner, throne: Throne, map: MapTable, cannon: Cannon,
  fire: Fire, smoke: Smoke, birds: Birds, comet: Comet, eclipse: Eclipse, volcano: Volcano,
};
const PEOPLE_DRAW = Object.fromEntries(PEOPLE.map((who) => [who, (p: Dr) => <PersonGroup {...p} who={who as PersonKind} />])) as unknown as Record<PersonKind, React.FC<Dr>>;
Object.assign(DRAW, PEOPLE_DRAW, NEW_ANIMALS, NEW_STRUCTURES, STRUCTURES3, VEHICLES3);
const ANIMAL_SPEED = { mammoth: 18, sabertooth: 45, bison: 22, horse: 90, camel: 28, wagon: 30, junk: 22, dog: 70, wolf: 90, fox: 80, deer: 80, lion: 40, tiger: 45, bear: 25, boar: 60, pig: 20, cow: 12, ox: 12, sheep: 16, goat: 20, donkey: 24, rat: 70, snake: 24, crocodile: 10, eagle: 60, raven: 60, whale: 12 } as Record<string, number>;
/** Everyone drawn as a person: the first one in a shot is the hero and is drawn larger, because the pictures tell the story. */
const HUMAN = new Set<string>([...PEOPLE, 'soldiers', 'king', 'crowd', 'scholar', 'monk', 'farmer', 'merchant']);
const MOVES = new Set(['walk', 'run', 'carry', 'push', 'sneak']);
const SPEED: Partial<Record<Subject, number>> = { soldiers: 46, cavalry: 150, caravan: 38, elephants: 30, ship: 26, fleet: 22, galley: 34, train: 190, tank: 80, plane: 230, farmer: 20 };
const WATER = new Set<string>(['ship', 'fleet', 'galley', 'whale', 'junk']);

const DEPTH = { far: { y: GY + 70, s: 1.4, f: 0.6 }, mid: { y: GY + 205, s: 2.3, f: 0.85 }, near: { y: GY + 370, s: 2.9, f: 1.1 }, fore: { y: GY + 480, s: 2.3, f: 1.3 } } as const;

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

/** Light and air over the picture: haze at the horizon, a bloom around the sun, rays of light, embers, a vignette and film grain. */
const Atmosphere: React.FC<{ c: Colors; time: string; place: string; t: number; sx: number; sy: number; embers: boolean; weather: string }> = ({ c, time, place, t, sx, sy, embers, weather }) => {
  const indoor = place === 'interior';
  const rays = !indoor && !c.night && weather !== 'storm' && weather !== 'rain';
  const r = rng(11);
  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="bloom"><stop offset="0" stopColor={c.sun} stopOpacity={c.night ? 0.3 : 0.5} /><stop offset="0.35" stopColor={c.sun} stopOpacity={c.night ? 0.08 : 0.16} /><stop offset="1" stopColor={c.sun} stopOpacity={0} /></radialGradient>
        <radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.62} /></radialGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.skyBottom} stopOpacity={0} /><stop offset="0.5" stopColor={c.skyBottom} stopOpacity={0.4} /><stop offset="1" stopColor={c.skyBottom} stopOpacity={0} /></linearGradient>
        <filter id="grainF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={5} /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.45" /></filter>
      </defs>
      {!indoor && <rect y={GY - 170} width={1080} height={300} fill="url(#haze)" />}
      {!indoor && <circle cx={sx} cy={sy} r={520} fill="url(#bloom)" style={{ mixBlendMode: 'screen' }} />}
      {rays && Array.from({ length: 7 }, (_, i) => {
        const a = 1.15 + i * 0.16 + Math.sin(t * 0.4 + i) * 0.03;
        return <path key={i} d={`M${sx} ${sy} L${sx + Math.cos(a) * 1900 - 90} ${sy + Math.sin(a) * 1900} L${sx + Math.cos(a) * 1900 + 90} ${sy + Math.sin(a) * 1900}Z`} fill={c.sun} opacity={0.045 + 0.03 * Math.sin(t * 0.8 + i * 2)} style={{ mixBlendMode: 'screen' }} />;
      })}
      {embers && Array.from({ length: 34 }, (_, i) => {
        const sp = 60 + r() * 120;
        const x0 = r() * 1080;
        const y = H - (((r() * H + t * sp) % H));
        return <circle key={i} cx={x0 + Math.sin(t * 1.4 + i) * 26} cy={y} r={1.6 + r() * 3.4} fill={i % 3 ? '#ffb347' : '#ff7a3d'} opacity={0.35 + 0.65 * Math.abs(Math.sin(t * 3 + i))} style={{ mixBlendMode: 'screen' }} />;
      })}
      <rect width={1080} height={H} fill="url(#vig)" />
      <g transform="scale(2)" opacity={0.2 + 0.03 * Math.sin(t * 40)} style={{ mixBlendMode: 'overlay' }}><rect width={540} height={H / 2} filter="url(#grainF)" /></g>
    </g>
  );
};

interface Slot { x: number; d: keyof typeof DEPTH; s: number }

/** One shot: the place, the subjects laid out in depth, the camera sliding across the layers, the weather over everything. Pure function of `frame`. */
export const Diorama: React.FC<{ shot: ArtShot; frame: number; dur: number; look: Look; seed: number; bare?: boolean }> = ({ shot, frame, dur, look, seed: seed0, bare }) => {
  const seed = (seed0 + hash(shot.subjects.join())) % 1000;
  const t = frame / 30;
  const c = makeColors(look, shot.time, shot.weather ?? 'clear');
  const prog = frame / Math.max(1, dur);
  const dirCam = seed % 2 ? 1 : -1;
  const cam = dirCam * (prog * 2 - 1) * 0.9;
  const zoom = 1.28 + 0.07 * prog;
  const subj = shot.subjects;
  const structures = subj.filter((s) => kindOf(s) === 'structure');
  const actors = subj.filter((s) => kindOf(s) === 'actor');
  const props = subj.filter((s) => kindOf(s) === 'prop');
  const effects = subj.filter((s) => kindOf(s) === 'effect');
  const place = shot.place;
  const sS: Slot[] = [{ x: 1000, d: 'far', s: 1.45 }, { x: 440, d: 'far', s: 1.0 }];
  const aS: Slot[] = structures.length ? [{ x: 720, d: 'mid', s: 1.1 }, { x: 400, d: 'near', s: 0.9 }, { x: 1140, d: 'near', s: 0.85 }] : [{ x: 800, d: 'mid', s: 1.25 }, { x: 460, d: 'near', s: 1.0 }, { x: 1150, d: 'far', s: 1.0 }];
  const pS: Slot[] = [{ x: 340, d: 'fore', s: 1.1 }, { x: 1250, d: 'fore', s: 1.0 }];
  const items: { z: number; key: string; node: React.ReactNode }[] = [];
  const put = (sj: Subject, slot: Slot, k: number, travel: boolean) => {
    const D = DEPTH[slot.d];
    const C = DRAW[sj];
    const dir: 1 | -1 = (seed + k) % 3 === 0 ? -1 : 1;
    const isPerson = (PEOPLE as readonly string[]).includes(sj);
    const sp = !travel ? 0 : isPerson ? (shot.action && MOVES.has(shot.action) ? 40 : 0) : ANIMAL_SPEED[sj] !== undefined ? ANIMAL_SPEED[sj] : (!shot.action || MOVES.has(shot.action)) ? SPEED[sj] ?? 0 : 0;
    const x = slot.x + dir * sp * (t - dur / 60) * (sp > 100 ? 1 : 0.6);
    let y = D.y;
    if (WATER.has(sj)) y = GY + (place === 'sea' || place === 'coast' ? 300 : 260);
    if (sj === 'plane') y = GY - 230 + Math.sin(t) * 14;
    const lx = -260 + cam * 200 * D.f;
    items.push({ z: y + (slot.d === 'far' ? -500 : 0), key: `${sj}${k}`, node: <g transform={`translate(${x + lx} ${y}) scale(${slot.s * D.s * (HUMAN.has(sj) && k === 10 ? 1.3 : 1)})`}><C c={c} t={t} seed={seed + k * 3} dir={dir} act={shot.action} view={shot.view} /></g> });
  };
  structures.slice(0, 2).forEach((sj, i) => put(sj, sS[i], i, false));
  actors.slice(0, 3).forEach((sj, i) => put(sj, aS[i], 10 + i, true));
  props.slice(0, 2).forEach((sj, i) => put(sj, pS[i], 20 + i, false));
  effects.forEach((sj, i) => {
    const lx = -260 + cam * 200 * 0.5;
    const C = DRAW[sj];
    const pos: Record<string, [number, number, number]> = { fire: [760, GY + 330, 2], smoke: [560, GY + 60, 1.2], birds: [650, GY - 240, 1.3], comet: [820, GY - 220, 1.2], eclipse: [800, GY - 250, 1.4], volcano: [1040, GY + 60, 1.9] };
    const [x, y, s] = pos[sj];
    items.push({ z: sj === 'fire' ? y + 100 : y - 600, key: `fx${i}`, node: <g transform={`translate(${x + lx} ${y}) scale(${s})`}><C c={c} t={t} seed={seed + i} dir={1} /></g> });
  });
  items.sort((a, b) => a.z - b.z);
  // the bloom is drawn over the zoomed picture, so the sun's world position goes through the same zoom (it used to land on the hero's face)
  const [wx, wy] = sunWorld(shot.time, seed, cam);
  const sunScreen = [540 + (wx - 540) * zoom, GY + 150 + (wy - (GY + 150)) * zoom];
  if (bare) {
    // the web portal: only the buildings and the people, no sky, ground or atmosphere; every item is a group the page can animate
    const cls = (key: string) => (key.startsWith('fx') ? 'it fx' : (Number(key.match(/(\d+)$/)?.[1]) >= 20 ? 'it pr' : Number(key.match(/(\d+)$/)?.[1]) >= 10 ? 'it act' : 'it st'));
    return (
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{ display: 'block' }}>
        <g transform={`translate(540 ${GY + 150}) scale(${zoom}) translate(-540 ${-(GY + 150)})`}>
          {items.map((it, n) => <g key={it.key} className={cls(it.key)} style={{ ['--i' as string]: n }}>{it.node}</g>)}
        </g>
      </svg>
    );
  }
  return (
    <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{ display: 'block' }}>
      <g transform={`translate(540 ${GY + 150}) scale(${zoom}) translate(-540 ${-(GY + 150)})`}>
        <Backdrop place={place} time={shot.time} c={c} t={t} seed={seed} cam={cam} era={look.name} />
        {items.map((it) => <g key={it.key}>{it.node}</g>)}
        <Weather kind={shot.weather ?? (place === 'snow' ? 'snow' : 'clear')} t={t} c={c} />
      </g>
      <Atmosphere c={c} time={shot.time} place={place} t={t} sx={sunScreen[0]} sy={sunScreen[1]} embers={subj.includes('fire') || subj.includes('volcano') || subj.includes('cannon') || place === 'battlefield' || shot.weather === 'smoke'} weather={shot.weather ?? 'clear'} />
      <rect width={1080} height={H} fill={c.night ? '#0f0905' : c.shadow} opacity={c.night ? 0.12 : 0.06} />
    </svg>
  );
};
export const WIDTH_UNUSED = W;
