import React from 'react';
import landData from './land.json';

/**
 * A real map: the Natural Earth 1:50m coastline (land.json, simplified to 26,000 points) drawn in the style of an old sea chart. The view is fitted to the places of the scene
 * from their real latitude and longitude, so a Mediterranean story shows the Mediterranean and an Atlantic crossing shows the Atlantic. Nothing here is random.
 */
interface Ring { h: number; p: number[] }
const RINGS = landData as Ring[];
const BOX = RINGS.map((r) => {
  let x0 = 999, x1 = -999, y0 = 999, y1 = -999;
  for (let i = 0; i < r.p.length; i += 2) { x0 = Math.min(x0, r.p[i]); x1 = Math.max(x1, r.p[i]); y0 = Math.min(y0, r.p[i + 1]); y1 = Math.max(y1, r.p[i + 1]); }
  return { x0, x1, y0, y1 };
});

export interface GeoPlace { name: string; lat: number; lon: number }
export interface View { lon0: number; lat0: number; k: number; kx: number; w: number; h: number; west: number; east: number; south: number; north: number }

/** Parses the "Place|lat|lon" items of a map scene. */
export const parsePlaces = (items: string[] = []): GeoPlace[] =>
  items.slice(0, 5).map((it) => {
    const [name, a, b] = it.split('|');
    return { name: (name ?? '').trim(), lat: Math.max(-85, Math.min(85, parseFloat(a) || 0)), lon: Math.max(-180, Math.min(180, parseFloat(b) || 0)) };
  });

/** The view that frames the places with room around them (never tighter than a region, never a blank sea). */
export const fitView = (places: GeoPlace[], w: number, h: number): View => {
  const lats = places.map((p) => p.lat), lons = places.map((p) => p.lon);
  let south = Math.min(...lats), north = Math.max(...lats), west = Math.min(...lons), east = Math.max(...lons);
  const latMid = (south + north) / 2;
  const cosv = Math.max(0.25, Math.cos((latMid * Math.PI) / 180));
  let dLat = Math.max(north - south, 8), dLon = Math.max(east - west, 12);
  dLat *= 1.55; dLon *= 1.45;
  // match the aspect of the frame: degrees of longitude are shorter by cos(lat)
  if ((dLon * cosv) / dLat > w / h) dLat = (dLon * cosv * h) / w; else dLon = (dLat * w) / (h * cosv);
  const lon0 = (west + east) / 2, lat0 = (south + north) / 2;
  const k = h / dLat; // pixels per degree of latitude
  const kx = k * cosv; // pixels per degree of longitude
  return { lon0, lat0, k, kx, w, h, west: lon0 - dLon / 2, east: lon0 + dLon / 2, south: lat0 - dLat / 2, north: lat0 + dLat / 2 };
};

export const project = (v: View, lon: number, lat: number): [number, number] => [v.w / 2 + (lon - v.lon0) * v.kx, v.h / 2 - (lat - v.lat0) * v.k];

/** The coastline of the land inside the view as one SVG path (holes such as the Caspian cut out by even-odd filling). */
export const landPath = (v: View): string => {
  const pad = 2;
  let d = '';
  RINGS.forEach((r, i) => {
    const b = BOX[i];
    if (b.x1 < v.west - pad || b.x0 > v.east + pad || b.y1 < v.south - pad || b.y0 > v.north + pad) return;
    for (let j = 0; j < r.p.length; j += 2) {
      const [x, y] = project(v, r.p[j], r.p[j + 1]);
      d += `${j ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += 'Z';
  });
  return d;
};

/** Catmull-Rom through the points: the smooth route a ship or an army would draw on a chart. */
export const smoothRoute = (pts: [number, number][]): string => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

const nice = (span: number) => (span > 90 ? 30 : span > 45 ? 15 : span > 22 ? 10 : span > 10 ? 5 : 2);
const deg = (n: number, pos: string, neg: string) => `${Math.abs(n)}°${n >= 0 ? pos : neg}`;

/** True when a point is on land (even-odd over every ring, so lakes and the Caspian count as water). */
export const isLand = (lon: number, lat: number): boolean => {
  let inside = false;
  RINGS.forEach((r, k) => {
    const b = BOX[k];
    if (lon < b.x0 || lon > b.x1 || lat < b.y0 || lat > b.y1) return;
    let c = false;
    for (let i = 0, j = r.p.length - 2; i < r.p.length; j = i, i += 2) {
      const xi = r.p[i], yi = r.p[i + 1], xj = r.p[j], yj = r.p[j + 1];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
    }
    if (c) inside = !inside;
  });
  return inside;
};

export interface AtlasStyle { sea: string; land: string; ink: string; ink2: string; stain: string }
/** A treasure map: tea-stained parchment, iron-gall ink, the sea a shade darker than the land. */
export const atlasStyle = (): AtlasStyle => ({ sea: '#d2b074', land: '#ecd8a2', ink: '#3b2411', ink2: '#6b4521', stain: '#8a5a24' });

const lcg = (seed: number) => { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

/** A torn, burnt edge: the rectangle with a jittered border. */
export const tornEdge = (w: number, h: number, seed: number): string => {
  const r = lcg(seed);
  const pts: [number, number][] = [];
  const j = () => 4 + r() * 13;
  for (let x = 0; x <= w; x += 11 + r() * 12) pts.push([x, j()]);
  for (let y = 0; y <= h; y += 11 + r() * 12) pts.push([w - j(), y]);
  for (let x = w; x >= 0; x -= 11 + r() * 12) pts.push([x, h - j()]);
  for (let y = h; y >= 0; y -= 11 + r() * 12) pts.push([j(), y]);
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
};

const Ship: React.FC<{ x: number; y: number; s: number; flip?: boolean; ink: string }> = ({ x, y, s, flip, ink }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-26 0 Q-20 14 0 14 Q22 14 28 0Z" fill={ink} opacity={0.85} />
    <path d="M0 0 V-46 M-14 -4 V-38 M14 -4 V-34" />
    <path d="M0 -44 Q22 -38 20 -14 L0 -12Z M-14 -36 Q-30 -28 -26 -10 L-14 -8Z M14 -32 Q28 -26 24 -10 L14 -8Z" fill="#f3e4b8" />
    <path d="M0 -46 l12 4 l-12 4" fill="#8e2a1c" stroke="#8e2a1c" />
    <path d="M-34 18 q8 -6 16 0 t16 0 t16 0 t16 0" opacity={0.6} />
  </g>
);

const Serpent: React.FC<{ x: number; y: number; s: number; ink: string }> = ({ x, y, s, ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round">
    <path d="M-70 18 q10 -34 28 -4 q10 16 20 -8 q10 -32 28 -2 q10 18 18 -6" />
    <path d="M-70 18 q-14 -6 -18 6 M-88 24 l-8 -4 M-88 24 l-8 8" />
    <path d="M42 -22 q-4 -22 14 -26 q16 -2 16 10 l-6 2 q-2 -8 -8 -6 q-6 4 -2 14" />
    <circle cx={60} cy={-44} r={2} fill={ink} />
    <path d="M-86 22 q6 8 14 6 M-60 24 q6 8 14 6" opacity={0.7} />
    <path d="M-90 34 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" opacity={0.5} />
  </g>
);

const Mountain: React.FC<{ x: number; y: number; s: number; ink: string }> = ({ x, y, s, ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={ink} strokeWidth={1.8} strokeLinejoin="round">
    <path d="M-16 0 L0 -26 L16 0 M0 -26 L5 -10 L-4 -4 M-16 0 L-8 -8" /><path d="M2 -20 L8 -10 M6 -14 L12 -4" opacity={0.7} />
  </g>
);

const Palm: React.FC<{ x: number; y: number; s: number; ink: string }> = ({ x, y, s, ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={ink} strokeWidth={1.8} strokeLinecap="round">
    <path d="M0 0 Q3 -14 -2 -28" /><path d="M-2 -28 q-12 -4 -18 6 M-2 -28 q10 -8 20 0 M-2 -28 q-4 -12 -14 -14 M-2 -28 q6 -12 16 -12 M-2 -28 q-2 -6 -2 -10" />
  </g>
);

/** The treasure map itself, without the route and the labels (those animate in MapScene): paper, stains, coast, ornaments, folds and burnt edges. */
export const Chart: React.FC<{ v: View; s: AtlasStyle; id: string; places: { x: number; y: number }[]; seed: number }> = ({ v, s, id, places, seed }) => {
  const d = React.useMemo(() => landPath(v), [v]);
  const edge = React.useMemo(() => tornEdge(v.w, v.h, seed + 7), [v, seed]);
  const step = nice(v.east - v.west);
  const lons: number[] = [], lats: number[] = [];
  for (let x = Math.ceil(v.west / step) * step; x <= v.east; x += step) lons.push(x);
  for (let y = Math.ceil(v.south / step) * step; y <= v.north; y += step) lats.push(y);
  const km = (111 * (v.h / v.k)) / 5;
  const nk = [50, 100, 200, 250, 500, 1000, 2000].reduce((best, n) => (Math.abs(n - km) < Math.abs(best - km) ? n : best), 500);
  const barW = (nk / 111) * v.k;
  // ornaments: mountains and palms on land, ships and a sea serpent in open water, all clear of the places and of each other
  const orn = React.useMemo(() => {
    const r = lcg(seed + 31);
    const taken: [number, number][] = places.map((p) => [p.x, p.y]);
    const free = (x: number, y: number, rad: number) => x > 40 && x < v.w - 40 && y > 50 && y < v.h - 70 && taken.every(([a, b]) => Math.hypot(a - x, b - y) > rad);
    const land: { x: number; y: number; k: number; palm: boolean }[] = [], sea: { x: number; y: number; k: number }[] = [];
    for (let n = 0; n < 900 && (land.length < 16 || sea.length < 3); n++) {
      const x = 40 + r() * (v.w - 80), y = 50 + r() * (v.h - 120);
      const lon = v.lon0 + (x - v.w / 2) / v.kx, lat = v.lat0 - (y - v.h / 2) / v.k;
      const onLand = isLand(lon, lat);
      if (onLand && land.length < 16 && free(x, y, 60)) { land.push({ x, y, k: land.length, palm: Math.abs(lat) < 33 && land.length % 2 === 0 }); taken.push([x, y]); }
      if (!onLand && sea.length < 3 && free(x, y, 150) && isLand(lon + 3, lat) === false && isLand(lon - 3, lat) === false) { sea.push({ x, y, k: sea.length }); taken.push([x, y]); }
    }
    return { land, sea };
  }, [v, seed, places]);
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}><path d={edge} /></clipPath>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed={seed % 50} /><feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.07  0 0 0 0.55 -0.12" /></filter>
        <filter id={`${id}-stain`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed={(seed % 40) + 3} /><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.26  0 0 0 0 0.08  0 0 0 1.5 -0.55" /></filter>
        <filter id={`${id}-wobble`} x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="t" /><feDisplacementMap in="SourceGraphic" in2="t" scale="5" /></filter>
        <filter id={`${id}-blur`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9" /></filter>
        <radialGradient id={`${id}-vig`} cx="50%" cy="50%" r="72%"><stop offset="0.45" stopColor="#5a3510" stopOpacity="0" /><stop offset="1" stopColor="#3a1f08" stopOpacity="0.7" /></radialGradient>
        <pattern id={`${id}-wave`} width="26" height="14" patternUnits="userSpaceOnUse"><path d="M0 8 q6.5 -6 13 0 t13 0" fill="none" stroke={s.ink2} strokeWidth="1.2" opacity="0.3" /></pattern>
        <pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 0 V6" stroke={s.stain} strokeWidth="0.8" opacity="0.16" /></pattern>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width={v.w} height={v.h} fill={s.sea} />
        <rect width={v.w} height={v.h} fill={`url(#${id}-wave)`} />
        <rect width={v.w} height={v.h} filter={`url(#${id}-stain)`} opacity={0.55} />
        {/* the graticule, drawn in a thin brown line with its degrees */}
        {lons.map((x) => { const px = project(v, x, v.lat0)[0]; return <g key={`m${x}`}><line x1={px} y1={0} x2={px} y2={v.h} stroke={s.ink2} strokeWidth={1} strokeDasharray="2 9" opacity={0.5} /><text x={px + 5} y={v.h - 26} fontFamily="IM Fell English, serif" fontStyle="italic" fontSize={18} fill={s.ink2} opacity={0.85}>{deg(Math.round(x), 'E', 'W')}</text></g>; })}
        {lats.map((y) => { const py = project(v, v.lon0, y)[1]; return <g key={`p${y}`}><line x1={0} y1={py} x2={v.w} y2={py} stroke={s.ink2} strokeWidth={1} strokeDasharray="2 9" opacity={0.5} /><text x={22} y={py - 6} fontFamily="IM Fell English, serif" fontStyle="italic" fontSize={18} fill={s.ink2} opacity={0.85}>{deg(Math.round(y), 'N', 'S')}</text></g>; })}
        <g filter={`url(#${id}-wobble)`}>
          {/* old water lines: dotted rings of shoal around the coast */}
          {[30, 18, 8].map((w, i) => <path key={w} d={d} fill="none" stroke={s.ink2} strokeWidth={w} strokeDasharray={i === 2 ? '1 7' : i === 1 ? '1 9' : '1 12'} strokeLinecap="round" opacity={0.28} fillRule="evenodd" />)}
          <path d={d} fill="#2a1606" opacity={0.3} transform="translate(4 6)" fillRule="evenodd" />
          <path d={d} fill={s.land} fillRule="evenodd" />
          <path d={d} fill={`url(#${id}-hatch)`} fillRule="evenodd" />
          <path d={d} fill="none" stroke={s.ink} strokeWidth={2.6} strokeLinejoin="round" fillRule="evenodd" />
        </g>
        {orn.land.map((o) => (o.palm ? <Palm key={`l${o.k}`} x={o.x} y={o.y} s={1.15} ink={s.ink} /> : <Mountain key={`l${o.k}`} x={o.x} y={o.y} s={0.9 + (o.k % 4) * 0.12} ink={s.ink} />))}
        {orn.sea.map((o) => (o.k === 0 ? <Serpent key={`s${o.k}`} x={o.x} y={o.y} s={0.95} ink={s.ink} /> : <Ship key={`s${o.k}`} x={o.x} y={o.y} s={0.9} flip={o.k === 2} ink={s.ink} />))}
        <g transform={`translate(${v.w - barW - 44} ${v.h - 44})`} fontFamily="IM Fell English, serif" fontStyle="italic" fontSize={20} fill={s.ink}>
          <path d={`M0 0 H${barW} M0 -7 V7 M${barW / 2} -4 V4 M${barW} -7 V7`} stroke={s.ink} strokeWidth={2.4} fill="none" />
          <text x={barW / 2} y={-14} textAnchor="middle">{nk} km</text>
        </g>
        {/* folds, grain, burnt edges */}
        <path d={`M${v.w / 3} 0 V${v.h}`} stroke="#3a1f08" strokeWidth={3} opacity={0.16} /><path d={`M${v.w / 3 + 4} 0 V${v.h}`} stroke="#fff3cf" strokeWidth={3} opacity={0.2} />
        <path d={`M${(v.w * 2) / 3} 0 V${v.h}`} stroke="#3a1f08" strokeWidth={3} opacity={0.14} /><path d={`M${(v.w * 2) / 3 + 4} 0 V${v.h}`} stroke="#fff3cf" strokeWidth={3} opacity={0.18} />
        <path d={`M0 ${v.h / 2} H${v.w}`} stroke="#3a1f08" strokeWidth={3} opacity={0.14} /><path d={`M0 ${v.h / 2 + 4} H${v.w}`} stroke="#fff3cf" strokeWidth={3} opacity={0.16} />
        <rect width={v.w} height={v.h} filter={`url(#${id}-grain)`} opacity={0.5} />
        <rect width={v.w} height={v.h} fill={`url(#${id}-vig)`} />
        <path d={edge} fill="none" stroke="#2a1204" strokeWidth={34} opacity={0.55} filter={`url(#${id}-blur)`} />
      </g>
      <path d={edge} fill="none" stroke="#2a1204" strokeWidth={2.5} opacity={0.8} />
    </g>
  );
};

/** A compass rose of sixteen points, inked. */
export const CompassRose: React.FC<{ x: number; y: number; r: number; ink: string; ink2: string }> = ({ x, y, r, ink, ink2 }) => (
  <g transform={`translate(${x} ${y})`} stroke={ink} strokeLinejoin="round">
    <circle r={r * 0.78} fill="none" strokeWidth={2} opacity={0.8} /><circle r={r * 0.66} fill="none" strokeWidth={1} opacity={0.6} />
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i * Math.PI) / 8, len = i % 4 === 0 ? r : i % 2 === 0 ? r * 0.74 : r * 0.52, w = i % 4 === 0 ? 0.13 : 0.09;
      const p = (rr: number, aa: number) => `${(Math.sin(aa) * rr).toFixed(1)} ${(-Math.cos(aa) * rr).toFixed(1)}`;
      return <path key={i} d={`M0 0 L${p(len * 0.28, a - w * 3)} L${p(len, a)} L${p(len * 0.28, a + w * 3)}Z`} fill={i % 4 === 0 ? ink : i % 2 === 0 ? ink2 : '#ecd8a2'} strokeWidth={1.3} />;
    })}
    <text y={-r - 8} textAnchor="middle" fontFamily="IM Fell English, serif" fontSize={r * 0.34} fill={ink} stroke="none">N</text>
  </g>
);

/** Label positions that do not overlap each other nor leave the frame: tries right, left, above and below of each marker. */
export const placeLabels = (items: { name: string; x: number; y: number; size: number }[], w: number, h: number) => {
  const boxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
  const hit = (b: { x0: number; y0: number; x1: number; y1: number }) => boxes.some((o) => b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
  return items.map((it) => {
    const tw = it.name.length * it.size * 0.74 + 16, th = it.size + 8;
    const cands = [
      { dx: 22, dy: -16, anchor: 'start' as const, b: { x0: it.x + 18, y0: it.y - 16 - th, x1: it.x + 18 + tw, y1: it.y - 12 } },
      { dx: -22, dy: -16, anchor: 'end' as const, b: { x0: it.x - 18 - tw, y0: it.y - 16 - th, x1: it.x - 18, y1: it.y - 12 } },
      { dx: 22, dy: 36, anchor: 'start' as const, b: { x0: it.x + 18, y0: it.y + 36 - th, x1: it.x + 18 + tw, y1: it.y + 40 } },
      { dx: -22, dy: 36, anchor: 'end' as const, b: { x0: it.x - 18 - tw, y0: it.y + 36 - th, x1: it.x - 18, y1: it.y + 40 } },
    ];
    const inside = (b: { x0: number; y0: number; x1: number; y1: number }) => b.x0 > 6 && b.x1 < w - 6 && b.y0 > 6 && b.y1 < h - 6;
    const pick = cands.find((c) => inside(c.b) && !hit(c.b)) ?? cands.find((c) => inside(c.b)) ?? cands[0];
    boxes.push(pick.b);
    return { dx: pick.dx, dy: pick.dy, anchor: pick.anchor };
  });
};
