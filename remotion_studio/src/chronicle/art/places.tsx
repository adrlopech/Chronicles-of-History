import React from 'react';
import { Colors, mix } from './palette';
import { GY, H, W, rect, ridge, tri, wave } from './draw';
import { rng } from '../ink';
import { Place, TimeOfDay } from './vocab';

interface BackProps { place: Place; time: TimeOfDay; c: Colors; t: number; seed: number; cam: number; era?: string }

/** Where the sun or the moon sits in the world (before the shot's zoom). High in the sky by day and night, so it never sits behind the heads of the people (they reach about GY - 230); low on the horizon at dawn and dusk. */
export const sunWorld = (time: TimeOfDay, seed: number, cam: number): [number, number] => [640 + ((seed % 5) - 2) * 90 + cam * 30, time === 'day' ? GY - 380 : time === 'night' ? GY - 360 : GY - 50];

/** The room of an interior shot, by era: round arches only where they belong (Rome, the Renaissance, palaces); timber halls, cave rock, paper screens or panelled walls elsewhere. */
const interiorKind = (era?: string): 'arches' | 'timber' | 'cave' | 'shoji' | 'panel' =>
  era === 'prehistory' ? 'cave' : era === 'orient' ? 'shoji' : era === 'industrial' || era === 'wartime' || era === 'spaceage' ? 'panel' : era === 'antiquity' || era === 'renaissance' || era === 'empire' ? 'arches' : 'timber';
const shift = (cam: number, f: number) => `translate(${-260 + cam * 200 * f} 0)`;

const Trees: React.FC<{ seed: number; y: number; size: number; fill: string; n: number; t: number; pine?: boolean }> = ({ seed, y, size, fill, n, t, pine = true }) => {
  const r = rng(seed);
  return (
    <g fill={fill}>
      {Array.from({ length: n }, (_, i) => {
        const x = (i / n) * W + r() * 60;
        const s = size * (0.7 + r() * 0.6);
        const sway = Math.sin(t * 1.3 + i) * 2;
        return pine ? (
          <g key={i} transform={`translate(${x} ${y + r() * 14}) skewX(${sway})`}>
            <path d={tri(0, 0, s * 0.5, s * 0.55)} /><path d={tri(0, -s * 0.28, s * 0.42, s * 0.5)} /><path d={tri(0, -s * 0.5, s * 0.3, s * 0.45)} />
          </g>
        ) : (
          <g key={i} transform={`translate(${x} ${y})`}><rect x={-4} y={-s * 0.4} width={8} height={s * 0.4} /><circle cy={-s * 0.62} r={s * 0.34} /><circle cx={-s * 0.2} cy={-s * 0.48} r={s * 0.24} /><circle cx={s * 0.2} cy={-s * 0.5} r={s * 0.26} /></g>
        );
      })}
    </g>
  );
};

const Skyline: React.FC<{ seed: number; y: number; fill: string; c: Colors; tall: number; lights?: boolean }> = ({ seed, y, fill, c, tall, lights }) => {
  const r = rng(seed);
  let x = -20;
  const out: React.ReactNode[] = [];
  while (x < W + 40) {
    const w = 50 + r() * 90;
    const h = tall * (0.3 + r() * 0.7);
    const kind = r();
    out.push(
      <g key={x} transform={`translate(${x} ${y})`}>
        <path d={rect(0, -h, w, h)} fill={fill} />
        {kind < 0.4 ? <path d={tri(w / 2, -h, w + 10, 36 + r() * 30)} fill={fill} /> : kind < 0.65 ? <path d={`M0 ${-h} A${w / 2} ${w / 2} 0 0 1 ${w} ${-h}Z`} fill={fill} /> : null}
        {lights && Array.from({ length: Math.floor(h / 46) }, (_, k) => r() > 0.5 && <rect key={k} x={w * 0.3} y={-h + 14 + k * 46} width={12} height={18} fill={c.glow} opacity={0.9} />)}
      </g>,
    );
    x += w + r() * 8;
  }
  return <g>{out}</g>;
};

const Stars: React.FC<{ t: number; seed: number }> = ({ t, seed }) => {
  const r = rng(seed + 9);
  return <g>{Array.from({ length: 70 }, (_, i) => <circle key={i} cx={r() * 1080} cy={r() * GY} r={0.8 + r() * 1.9} fill="#fff" opacity={0.35 + 0.65 * Math.abs(Math.sin(t * (0.8 + r() * 2) + i))} />)}</g>;
};

const Clouds: React.FC<{ c: Colors; t: number; seed: number; cam: number }> = ({ c, t, seed, cam }) => {
  const r = rng(seed + 4);
  return (
    <g transform={shift(cam, 0.3)} opacity={c.night ? 0.25 : 0.6} fill={mix(c.skyBottom, '#ffffff', c.night ? 0.05 : 0.45)}>
      {Array.from({ length: 6 }, (_, i) => {
        const x = (((r() * W + t * (8 + i * 2)) % (W + 400)) + W + 400) % (W + 400) - 200;
        const y = GY - 230 + r() * 130;
        const s = 0.7 + r() * 0.9;
        return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={90} ry={26} /><ellipse cx={-40} cy={-16} rx={46} ry={26} /><ellipse cx={30} cy={-22} rx={56} ry={30} /></g>;
      })}
    </g>
  );
};

/** Sky, sun or moon, clouds and the layered ground of one place. Each layer slides at its own speed with the camera (parallax). */
export const Backdrop: React.FC<BackProps> = ({ place, time, c, t, seed, cam, era }) => {
  const indoor = place === 'interior';
  const room = interiorKind(era);
  const sunY = sunWorld(time, seed, 0)[1];
  const sunX = 640 + ((seed % 5) - 2) * 90;
  const horizon = place === 'sea' || place === 'coast';
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.skyTop} /><stop offset="0.5" stopColor={c.skyMid} /><stop offset="1" stopColor={c.skyBottom} /></linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.water2} /><stop offset="1" stopColor={c.water} /></linearGradient>
      </defs>
      <rect width={1080} height={H} fill="url(#sky)" />
      {!indoor && c.night && <Stars t={t} seed={seed} />}
      {!indoor && (
        <g transform={shift(cam, 0.15)}>
          <circle cx={sunX + 260} cy={sunY} r={c.night ? 62 : 96} fill={c.sun} opacity={0.18} />
          <circle cx={sunX + 260} cy={sunY} r={c.night ? 40 : 62} fill={c.sun} />
          {c.night && <circle cx={sunX + 282} cy={sunY - 8} r={34} fill={c.skyTop} opacity={0.35} />}
        </g>
      )}
      {!indoor && <Clouds c={c} t={t} seed={seed} cam={cam} />}

      {(place === 'plains' || place === 'battlefield' || place === 'forest') && (
        <>
          <g transform={shift(cam, 0.5)}><path d={ridge(seed + 1, GY - 70, 70, 280)} fill={c.far} /></g>
          {place === 'forest' && <g transform={shift(cam, 0.6)}><Trees seed={seed + 2} y={GY - 20} size={150} fill={c.far} n={20} t={t} /></g>}
          <g transform={shift(cam, 0.75)}><path d={ridge(seed + 3, GY - 6, 48, 300)} fill={c.mid} /></g>
          {place === 'forest' && <g transform={shift(cam, 0.85)}><Trees seed={seed + 5} y={GY + 90} size={230} fill={c.mid} n={14} t={t} pine={seed % 2 === 0} /></g>}
          <g transform={shift(cam, 1)}><path d={ridge(seed + 4, GY + 80, 40, 240)} fill={c.near} /></g>
          <g transform={shift(cam, 1.25)}><path d={ridge(seed + 6, GY + 260, 50, 200)} fill={c.fore} />{place === 'forest' && <Trees seed={seed + 7} y={GY + 330} size={380} fill={c.fore} n={7} t={t} pine={seed % 2 === 0} />}</g>
        </>
      )}
      {place === 'battlefield' && (
        <g transform={shift(cam, 0.6)}>
          {[260, 760, 1180].map((x, i) => <g key={x} transform={`translate(${x} ${GY - 10})`}><path d={`M-4 0 Q${-26 + Math.sin(t * 8 + i) * 4} -60 0 -100 Q${26} -60 4 0Z`} fill={c.glow} opacity={0.85} /><g transform="translate(0 -60)"><circle r={40 + i * 8} fill={mix(c.far, c.shadow, 0.5)} opacity={0.5} cy={-80} /></g></g>)}
          <path d={Array.from({ length: 60 }, (_, i) => `M${100 + i * 22} ${GY - 6} l0 -34 l-4 -10 l8 0`).join(' ')} stroke={c.far} strokeWidth={2.5} fill="none" />
        </g>
      )}
      {place === 'mountains' && (
        <>
          <g transform={shift(cam, 0.45)}><path d={ridge(seed + 1, GY - 130, 360, 230, true)} fill={c.far} /><path d={ridge(seed + 8, GY - 150, 300, 330, true)} fill={mix(c.far, '#ffffff', 0.35)} opacity={0.55} /></g>
          <g transform={shift(cam, 0.7)}><path d={ridge(seed + 2, GY - 40, 240, 260, true)} fill={c.mid} /></g>
          <g transform={shift(cam, 0.95)}><path d={ridge(seed + 3, GY + 60, 110, 300)} fill={c.near} /><Trees seed={seed + 3} y={GY + 90} size={120} fill={c.near} n={16} t={t} /></g>
          <g transform={shift(cam, 1.25)}><path d={ridge(seed + 4, GY + 260, 70, 220, true)} fill={c.fore} /></g>
        </>
      )}
      {place === 'snow' && (
        <>
          <g transform={shift(cam, 0.45)}><path d={ridge(seed + 1, GY - 110, 300, 240, true)} fill={mix(c.far, '#ffffff', 0.4)} /></g>
          <g transform={shift(cam, 0.7)}><Trees seed={seed + 2} y={GY} size={170} fill={mix(c.mid, '#ffffff', 0.15)} n={18} t={t} /><path d={ridge(seed + 3, GY + 10, 36, 300)} fill={mix(c.light, c.skyBottom, 0.3)} /></g>
          <g transform={shift(cam, 1)}><path d={ridge(seed + 4, GY + 90, 40, 260)} fill={mix(c.light, c.skyBottom, 0.15)} /><Trees seed={seed + 5} y={GY + 130} size={250} fill={c.near} n={9} t={t} /></g>
          <g transform={shift(cam, 1.25)}><path d={ridge(seed + 6, GY + 270, 50, 200)} fill={mix(c.light, c.shadow, 0.1)} /></g>
        </>
      )}
      {place === 'desert' && (
        <>
          <g transform={shift(cam, 0.5)}><path d={ridge(seed + 1, GY - 40, 60, 460)} fill={mix(c.far, c.accent, 0.12)} /></g>
          <g transform={shift(cam, 0.75)}><path d={ridge(seed + 2, GY + 20, 70, 520)} fill={mix(c.mid, c.accent, 0.15)} /></g>
          <g transform={shift(cam, 1)}><path d={ridge(seed + 3, GY + 100, 80, 560)} fill={mix(c.near, c.accent, 0.12)} /></g>
          <g transform={shift(cam, 1.25)}><path d={ridge(seed + 4, GY + 250, 90, 520)} fill={mix(c.fore, c.accent, 0.1)} /></g>
        </>
      )}
      {horizon && (
        <>
          <g transform={shift(cam, 0.4)}>{place === 'coast' ? null : <path d={ridge(seed + 1, GY - 6, 24, 320)} fill={c.far} />}</g>
          <rect y={GY} width={1080} height={H - GY} fill="url(#sea)" />
          <g transform={shift(cam, 0.3)}><rect x={sunX + 230} y={GY} width={60} height={420} fill={c.sun} opacity={0.18} /></g>
          {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={shift(cam, 0.4 + i * 0.18)}><path d={wave(GY + 30 + i * 66, 3 + i * 1.6, 110 + i * 40, t, 1.4 + i * 0.4)} stroke={c.light} strokeWidth={2 + i * 0.5} fill="none" opacity={0.25 + i * 0.07} /></g>)}
          {place === 'coast' && (
            <g transform={shift(cam, 0.9)}><path d={ridge(seed + 2, GY - 150, 90, 340)} fill={c.mid} transform="translate(560 0)" /><path d={ridge(seed + 3, GY + 20, 70, 300)} fill={c.near} transform="translate(640 60)" /><path d={`M${1000} ${GY + 400} L${W + 60} ${GY + 400} L${W + 60} ${H} L1000 ${H}Z`} fill={c.fore} /></g>
          )}
          <g transform={shift(cam, 1.25)}><path d={wave(GY + 420, 7, 180, t, 1.2, -40, W + 40, true)} fill={c.fore} opacity={0.9} /></g>
        </>
      )}
      {place === 'city' && (
        <>
          <g transform={shift(cam, 0.5)}><Skyline seed={seed + 1} y={GY + 20} fill={c.far} c={c} tall={300} /></g>
          <g transform={shift(cam, 0.75)}><Skyline seed={seed + 2} y={GY + 90} fill={c.mid} c={c} tall={280} lights={c.night} /></g>
          <g transform={shift(cam, 1)}><Skyline seed={seed + 3} y={GY + 190} fill={c.near} c={c} tall={300} lights={c.night} /><path d={rect(-40, GY + 190, W + 80, 400)} fill={c.near} /></g>
          <g transform={shift(cam, 1.25)}><path d={ridge(seed + 4, GY + 330, 30, 300)} fill={c.fore} /></g>
        </>
      )}
      {place === 'plaza' && (
        <>
          <g transform={shift(cam, 0.55)}><Skyline seed={seed + 1} y={GY - 10} fill={c.far} c={c} tall={200} /></g>
          <g transform={shift(cam, 0.8)}>
            <path d={rect(-40, GY - 130, W + 80, 130)} fill={c.mid} />
            {Array.from({ length: 22 }, (_, i) => <path key={i} d={rect(i * 78 - 10, GY - 130, 22, 130)} fill={mix(c.mid, c.light, 0.35)} />)}
            <path d={rect(-40, GY - 150, W + 80, 20)} fill={c.near} />
          </g>
          <g transform={shift(cam, 1)}>
            {[0, 1, 2, 3].map((i) => <path key={i} d={rect(-40 + i * 18, GY + 10 + i * 40, W + 80 - i * 36, 40)} fill={mix(c.near, c.light, 0.12 + i * 0.08)} />)}
            <path d={rect(-40, GY + 170, W + 80, 700)} fill={mix(c.near, c.light, 0.5)} />
            {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 160 - 40} ${GY + 170} L${i * 160 - 140 + (i % 2) * 40} ${H}`} stroke={c.shadow} strokeWidth={2} opacity={0.2} />)}
          </g>
          <g transform={shift(cam, 1.25)}><path d={ridge(seed + 4, GY + 380, 20, 260)} fill={c.fore} /></g>
        </>
      )}
      {indoor && (
        <>
          <rect width={1080} height={H} fill={mix(c.skyMid, c.shadow, 0.55)} />
          {room === 'arches' && (
            <>
            <g transform={shift(cam, 0.5)}>
              {Array.from({ length: 7 }, (_, i) => (
                <g key={i} transform={`translate(${i * 250 - 40} 0)`}>
                  <path d={`M0 ${GY} V${GY - 380} A110 110 0 0 1 220 ${GY - 380} V${GY}Z`} fill={mix(c.skyBottom, c.shadow, 0.55)} />
                  <path d={`M30 ${GY} V${GY - 360} A80 80 0 0 1 190 ${GY - 360} V${GY}Z`} fill={c.night ? mix(c.skyTop, '#000', 0.4) : mix(c.skyBottom, '#ffffff', 0.25)} opacity={0.9} />
                  <path d={`M80 ${GY - 330} L${240 + i * 12} ${GY + 330} L${60 + i * 12} ${GY + 330}Z`} fill={c.glow} opacity={c.night ? 0.07 : 0.14} />
                </g>
              ))}
            </g>
            <g transform={shift(cam, 0.8)}>{[160, 560, 960, 1360].map((x, i) => <path key={x} d={rect(x - 26, GY - 420, 52, 430)} fill={mix(c.near, c.light, 0.15)} stroke={c.shadow} strokeWidth={3} />)}</g>
            </>
          )}
          {room === 'timber' && (
            <g transform={shift(cam, 0.6)}>
              {Array.from({ length: 22 }, (_, i) => <path key={i} d={rect(i * 80 - 40, GY - 520, 78, 520)} fill={mix(mix(c.near, c.accent2, 0.2), c.light, 0.06 + (i % 3) * 0.04)} stroke={c.shadow} strokeWidth={2} opacity={0.95} />)}
              {[GY - 470, GY - 250].map((y) => <path key={y} d={rect(-40, y, W + 80, 34)} fill={mix(c.shadow, c.accent2, 0.25)} />)}
              {[200, 700, 1200].map((x) => <path key={x} d={rect(x - 22, GY - 520, 44, 520)} fill={mix(c.shadow, c.accent2, 0.3)} />)}
              {[450, 950].map((x) => <g key={x}><path d={rect(x - 70, GY - 400, 140, 110)} fill={c.night ? mix(c.skyTop, '#000', 0.4) : mix(c.skyBottom, '#ffffff', 0.2)} stroke={c.shadow} strokeWidth={6} /><path d={`M${x} ${GY - 400} V${GY - 290} M${x - 70} ${GY - 345} H${x + 70}`} stroke={c.shadow} strokeWidth={5} /></g>)}
            </g>
          )}
          {room === 'cave' && (
            <g transform={shift(cam, 0.6)}>
              <path d={`M-40 ${GY} L-40 ${GY - 560} ${Array.from({ length: 9 }, (_, i) => `Q${i * 210 + 60} ${GY - 640 + ((seed + i * 37) % 90)} ${i * 210 + 170} ${GY - 590 + ((seed * 3 + i * 53) % 80)}`).join(' ')} L${W + 40} ${GY}Z`} fill={mix(c.near, c.shadow, 0.35)} />
              {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={120 + i * 270} cy={GY - 330 + ((seed + i * 41) % 120)} rx={110 + (i % 3) * 30} ry={70} fill={mix(c.mid, c.light, 0.12)} opacity={0.35} />)}
              <path d={`M-40 ${GY - 30} Q${W / 2} ${GY - 120} ${W + 40} ${GY - 30}`} stroke={c.shadow} strokeWidth={4} fill="none" opacity={0.4} />
            </g>
          )}
          {room === 'shoji' && (
            <g transform={shift(cam, 0.6)}>
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i} transform={`translate(${i * 220 - 40} ${GY - 470})`}>
                  <path d={rect(0, 0, 210, 470)} fill={mix(c.light, c.skyBottom, 0.25)} stroke={mix(c.shadow, c.accent2, 0.2)} strokeWidth={10} />
                  {[1, 2].map((k) => <path key={k} d={`M${k * 70} 0 V470`} stroke={mix(c.shadow, c.accent2, 0.2)} strokeWidth={4} />)}
                  {[1, 2, 3, 4].map((k) => <path key={k} d={`M0 ${k * 94} H210`} stroke={mix(c.shadow, c.accent2, 0.2)} strokeWidth={4} />)}
                </g>
              ))}
              <path d={rect(-40, GY - 520, W + 80, 50)} fill={mix(c.shadow, c.accent, 0.15)} />
            </g>
          )}
          {room === 'panel' && (
            <g transform={shift(cam, 0.6)}>
              <path d={rect(-40, GY - 560, W + 80, 560)} fill={mix(c.mid, c.light, 0.1)} />
              {[60, 460, 860, 1260].map((x) => <g key={x}><path d={rect(x, GY - 470, 220, 300)} fill={c.night ? mix(c.skyTop, '#000', 0.4) : mix(c.skyBottom, '#ffffff', 0.25)} stroke={c.shadow} strokeWidth={8} /><path d={`M${x + 110} ${GY - 470} V${GY - 170} M${x} ${GY - 320} H${x + 220}`} stroke={c.shadow} strokeWidth={6} /></g>)}
              <path d={rect(-40, GY - 130, W + 80, 130)} fill={mix(c.near, c.accent2, 0.25)} />
              <path d={`M-40 ${GY - 130} H${W + 40}`} stroke={c.shadow} strokeWidth={5} />
            </g>
          )}
          <g transform={shift(cam, 1)}>
            <path d={`M-40 ${GY} L${W + 40} ${GY} L${W + 40} ${H} L-40 ${H}Z`} fill={mix(c.near, c.accent2, 0.18)} />
            {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 130 - 40} ${GY} L${i * 260 - 1000} ${H}`} stroke={c.shadow} strokeWidth={2} opacity={0.18} />)}
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-40 ${GY + 30 + i * i * 28} H${W + 40}`} stroke={c.shadow} strokeWidth={2} opacity={0.18} />)}
          </g>
        </>
      )}
    </g>
  );
};
