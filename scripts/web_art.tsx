import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, mkdirSync } from 'fs';
import { Diorama } from '../remotion_studio/src/chronicle/art/Diorama';
import { lookFor } from '../remotion_studio/src/chronicle/looks';
import { Chart, CompassRose, atlasStyle, fitView, parsePlaces, placeLabels, project, smoothRoute } from '../remotion_studio/src/chronicle/geo/atlas';

const out = process.argv[2];
mkdirSync(out + '/eras', { recursive: true });

const ERA_SHOTS: Record<string, { look: string; shot: any; seed: number; frame: number }> = {
  prehistory: { look: 'prehistory', seed: 11, frame: 40, shot: { place: 'plains', time: 'dawn', subjects: ['cave', 'mammoth_hunter', 'mammoth', 'fire'], action: 'point' } },
  antiquity: { look: 'antiquity', seed: 12, frame: 40, shot: { place: 'city', time: 'day', subjects: ['colosseum', 'legionary', 'centurion', 'banner'], action: 'salute' } },
  manuscript: { look: 'manuscript', seed: 13, frame: 40, shot: { place: 'plains', time: 'dusk', subjects: ['castle', 'knight', 'crusader', 'banner'], action: 'stand' } },
  orient: { look: 'orient', seed: 14, frame: 40, shot: { place: 'mountains', time: 'dawn', subjects: ['japanese_castle', 'samurai', 'shogun', 'torii'], action: 'stand' } },
  renaissance: { look: 'renaissance', seed: 15, frame: 40, shot: { place: 'city', time: 'day', subjects: ['duomo', 'renaissance_artist', 'astronomer', 'scroll'], action: 'point' } },
  seachart: { look: 'seachart', seed: 16, frame: 40, shot: { place: 'sea', time: 'dusk', subjects: ['lighthouse', 'ship', 'pirate', 'chest'], action: 'point' } },
  empire: { look: 'empire', seed: 17, frame: 40, shot: { place: 'plaza', time: 'day', subjects: ['palace', 'queen', 'musketeer', 'crown'], action: 'stand' } },
  industrial: { look: 'industrial', seed: 18, frame: 40, shot: { place: 'city', time: 'dusk', weather: 'smoke', subjects: ['factory', 'engineer', 'factory_worker', 'train'], action: 'walk' } },
  frontier: { look: 'frontier', seed: 19, frame: 40, shot: { place: 'desert', time: 'day', subjects: ['saloon', 'cowboy', 'frontiersman', 'wagon'], action: 'stand' } },
  wartime: { look: 'wartime', seed: 20, frame: 40, shot: { place: 'battlefield', time: 'dusk', weather: 'smoke', subjects: ['bunker', 'ww2_soldier', 'tank', 'fire'], action: 'run' } },
  spaceage: { look: 'spaceage', seed: 21, frame: 40, shot: { place: 'plains', time: 'night', subjects: ['rocket', 'radar_dish', 'astronaut', 'lander'], action: 'watch' } },
  draw: { look: 'manuscript', seed: 5, frame: 30, shot: { place: 'city', time: 'day', subjects: ['castle', 'knight', 'jester', 'banner'], action: 'cheer' } },
};
/** The frame of each drawing (viewBox, 1280:1000): the people and props with a margin, buildings may be cropped. Measured in a browser from the rendered figures; re-measure when a shot above changes. */
const VIEWBOX: Record<string, string> = {'antiquity': '-377 104 1581 1235', 'draw': '-241 219 1423 1112', 'empire': '-481 85 1606 1255', 'frontier': '-154 144 1389 1085', 'industrial': '-328 246 1221 954', 'manuscript': '-261 248 1386 1083', 'orient': '-158 160 1340 1047', 'prehistory': '-453 -159 1733 1354', 'renaissance': '-447 226 1471 1149', 'seachart': '-434 146 1524 1190', 'spaceage': '-211 182 1297 1013', 'wartime': '-416 31 1486 1161'};
const STYLE = '<style>.it{transform-box:fill-box;transform-origin:50% 100%}.act{animation:b 3.4s ease-in-out infinite;animation-delay:calc(var(--i)*-.8s)}.pr{animation:b 4.2s ease-in-out infinite;animation-delay:calc(var(--i)*-1.1s)}.fx{animation:f .9s ease-in-out infinite alternate}@keyframes b{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-5px) scaleY(1.025) rotate(.5deg)}}@keyframes f{from{transform:scale(1);opacity:.9}to{transform:scale(1.07,1.12);opacity:1}}@media (prefers-reduced-motion:reduce){.it{animation:none!important}}</style>';
// only the people and the buildings (no sky or ground), animated by CSS, framed by VIEWBOX
for (const [name, e] of Object.entries(ERA_SHOTS)) {
  let svg = renderToStaticMarkup(<Diorama bare shot={e.shot} frame={e.frame} dur={150} look={lookFor(e.look)} seed={e.seed} />);
  svg = svg.replace(/<svg width="\d+" height="\d+" viewBox="[^"]*"/, `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1000" viewBox="${VIEWBOX[name]}"`).replace(/>/, '>' + STYLE);
  writeFileSync(`${out}/eras/${name}.svg`, svg);
}

// the treasure map of the real programme: Natural Earth coastlines, treasure-map chart, trail, places, X and compass
const items = ['Veracruz|19.17|-96.13', 'Havana|23.13|-82.38', 'Port Royal|17.94|-76.84', 'Tortuga|20.04|-72.78'];
const MW = 880, MH = 640;
const geo = parsePlaces(items);
const view = fitView(geo, MW, MH);
const places = geo.map((g) => { const [x, y] = project(view, g.lon, g.lat); return { name: g.name, x, y }; });
const labelPos = placeLabels(places.map((p) => ({ ...p, size: 30 })), MW, MH);
const style = atlasStyle();
const route = smoothRoute(places.map((p) => [p.x, p.y] as [number, number]));
const last = places[places.length - 1];
const map = renderToStaticMarkup(
  <svg id="atlasmap" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${MW} ${MH}`} role="img" aria-label="A treasure map of the Caribbean drawn from real coastlines, with a red dashed trail from Veracruz to Tortuga">
    <Chart v={view} s={style} id="atlas" places={places} seed={4242} />
    <defs>
      <mask id="trailmask"><path id="rmask" d={route} fill="none" stroke="#fff" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="0 2" /></mask>
    </defs>
    <path d={route} fill="none" stroke="#2a0a04" strokeWidth={7} strokeLinecap="round" strokeDasharray="13 11" opacity={0.28} transform="translate(2 3)" mask="url(#trailmask)" />
    <path d={route} fill="none" stroke="#9a2a18" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="13 11" mask="url(#trailmask)" />
    {places.map((p, i) => {
      const lp = labelPos[i];
      const isLast = i === places.length - 1;
      return (
        <g key={i} className="pl" data-at={(i / (places.length - 1)).toFixed(2)} transform={`translate(${p.x} ${p.y})`}>
          {!isLast && <><circle r={15} fill="#8e2a1c" opacity={0.18} /><circle r={7.5} fill="#8e2a1c" stroke={style.ink} strokeWidth={2.4} /></>}
          {isLast && <circle r={5} fill={style.ink} />}
          <text x={lp.dx} y={lp.dy} textAnchor={lp.anchor} fontFamily="Georgia, serif" fontStyle="italic" fontSize={30} fill={style.ink} stroke="#f1e0b0" strokeWidth={6} paintOrder="stroke" letterSpacing={0.5}>{p.name}</text>
        </g>
      );
    })}
    <g className="xm" transform={`translate(${last.x} ${last.y}) rotate(-6)`}>
      <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="#2a0a04" strokeWidth={16} strokeLinecap="round" opacity={0.35} transform="translate(2 3)" />
      <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="#a3200f" strokeWidth={11} strokeLinecap="round" />
      <path d="M-23 -24 L22 22" stroke="#d6502f" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </g>
    <CompassRose x={96} y={MH - 120} r={62} ink={style.ink} ink2={style.ink2} />
  </svg>,
).replace(/IM Fell English, serif/g, 'Georgia, serif');
writeFileSync(`${out}/map.svg.txt`, map);
console.log('done', map.length);
