import React from 'react';
import { mix } from '../art/palette';
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

export interface AtlasStyle { sea: string; sea2: string; land: string; ink: string; shoal: string }
export const atlasStyle = (paper: string, ink: string, accent2: string): AtlasStyle => ({
  sea: '#2c6470', sea2: '#16414d', land: '#e6d3a0', ink: mix('#2a170a', ink, 0.05), shoal: '#8fc4c2',
});

/** The chart itself, without the route and the labels (those animate in MapScene). */
export const Chart: React.FC<{ v: View; s: AtlasStyle; id: string }> = ({ v, s, id }) => {
  const d = React.useMemo(() => landPath(v), [v]);
  const step = nice(v.east - v.west);
  const lons: number[] = [], lats: number[] = [];
  for (let x = Math.ceil(v.west / step) * step; x <= v.east; x += step) lons.push(x);
  for (let y = Math.ceil(v.south / step) * step; y <= v.north; y += step) lats.push(y);
  const km = 111 * (v.h / v.k) / 5; // roughly a fifth of the frame height in km
  const nk = [50, 100, 200, 250, 500, 1000, 2000].reduce((best, n) => (Math.abs(n - km) < Math.abs(best - km) ? n : best), 500);
  const barW = (nk / 111) * v.k;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-sea`} cx="50%" cy="48%" r="75%"><stop offset="0" stopColor={s.sea} /><stop offset="1" stopColor={s.sea2} /></radialGradient>
        <pattern id={`${id}-wave`} width="22" height="12" patternUnits="userSpaceOnUse"><path d="M0 7 q5.5 -5 11 0 t11 0" fill="none" stroke={s.shoal} strokeWidth="1.1" opacity="0.4" /></pattern>
        <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0 V7" stroke="#8a6a3a" strokeWidth="0.9" opacity="0.22" /></pattern>
        <clipPath id={`${id}-clip`}><rect width={v.w} height={v.h} /></clipPath>
      </defs>
      <rect width={v.w} height={v.h} fill={`url(#${id}-sea)`} />
      <rect width={v.w} height={v.h} fill={`url(#${id}-wave)`} />
      {lons.map((x) => { const px = project(v, x, v.lat0)[0]; return <g key={`m${x}`}><line x1={px} y1={0} x2={px} y2={v.h} stroke={s.shoal} strokeWidth={1.3} strokeDasharray="2 8" opacity={0.7} /><text x={px + 5} y={v.h - 8} fontFamily="Cormorant Garamond, serif" fontSize={19} fill={s.shoal} opacity={0.9}>{deg(Math.round(x), 'E', 'W')}</text></g>; })}
      {lats.map((y) => { const py = project(v, v.lon0, y)[1]; return <g key={`p${y}`}><line x1={0} y1={py} x2={v.w} y2={py} stroke={s.shoal} strokeWidth={1.3} strokeDasharray="2 8" opacity={0.7} /><text x={8} y={py - 6} fontFamily="Cormorant Garamond, serif" fontSize={19} fill={s.shoal} opacity={0.9}>{deg(Math.round(y), 'N', 'S')}</text></g>; })}
      <g clipPath={`url(#${id}-clip)`}>
        {/* water lines: three rings of shallows around every coast, as engraved on old charts */}
        {[24, 14, 6].map((w, i) => <path key={w} d={d} fill="none" stroke={s.shoal} strokeWidth={w} strokeLinejoin="round" opacity={0.12 + i * 0.1} fillRule="evenodd" />)}
        <path d={d} fill="#000" opacity={0.28} transform="translate(5 7)" fillRule="evenodd" />
        <path d={d} fill={s.land} fillRule="evenodd" />
        <path d={d} fill={`url(#${id}-hatch)`} fillRule="evenodd" />
        <path d={d} fill="none" stroke={s.ink} strokeWidth={2.4} strokeLinejoin="round" fillRule="evenodd" />
      </g>
      <g transform={`translate(${v.w - barW - 40} ${v.h - 34})`} fontFamily="Cormorant Garamond, serif" fontSize={20} fill={s.land}>
        <path d={`M0 0 H${barW} M0 -7 V7 M${barW / 2} -4 V4 M${barW} -7 V7`} stroke={s.land} strokeWidth={2.4} fill="none" />
        <text x={barW / 2} y={-14} textAnchor="middle">{nk} km</text>
      </g>
    </g>
  );
};

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
