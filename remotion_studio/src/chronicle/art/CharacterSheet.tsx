import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { lookFor } from '../looks';
import { makeColors } from './palette';
import { Costumed } from './costumes';
import { Action, PersonKind, View } from './vocab';

/** A design sheet of the characters, large, for working on their look (not used in videos): `npx remotion still CharacterSheet out.png --frame=30`. */
const CAST: [PersonKind, Action, View?][] = [
  ['legionary', 'stand'], ['senator', 'point'], ['viking', 'shout'], ['samurai', 'stand', 'side'],
  ['knight', 'salute'], ['lady', 'wave'], ['pharaoh', 'stand'], ['peasant', 'dig'],
  ['sailor', 'walk'], ['friar', 'pray'], ['cowboy', 'stand'], ['astronaut', 'wave'],
];
export const CharacterSheet: React.FC<{ look?: string }> = ({ look = 'antiquity' }) => {
  const frame = useCurrentFrame();
  const c = makeColors(lookFor(look), 'day');
  return (
    <AbsoluteFill style={{ background: '#e9dcc0' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {CAST.map(([who, act, view], i) => {
          const x = 180 + (i % 3) * 360, y = 560 + Math.floor(i / 3) * 450;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(3.3)`}>
              <Costumed c={c} t={frame / 30} seed={i * 1.7} who={who} act={act} view={view} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
