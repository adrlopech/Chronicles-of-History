import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { IconName } from './types';
import { clamp, EASE_OUT } from './ink';

/** Engravings: simple line drawings (100x100) that draw themselves stroke by stroke, like a copper plate being inked. */
const gear = (): string => {
  const cx = 50, cy = 50, teeth = 10, ro = 40, ri = 31;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const w = Math.PI / teeth / 2.1;
    const p = (r: number, aa: number) => `${(cx + Math.cos(aa) * r).toFixed(1)} ${(cy + Math.sin(aa) * r).toFixed(1)}`;
    d += `${i ? 'L' : 'M'}${p(ri, a - w * 1.4)} L${p(ro, a - w)} L${p(ro, a + w)} L${p(ri, a + w * 1.4)} `;
  }
  return `${d}Z M50 36a14 14 0 1 0 0.1 0Z`;
};
const sun = (): string => {
  let d = 'M50 34a16 16 0 1 0 0.1 0Z';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = 24, r2 = i % 2 ? 36 : 44;
    d += ` M${(50 + Math.cos(a) * r1).toFixed(1)} ${(50 + Math.sin(a) * r1).toFixed(1)} L${(50 + Math.cos(a) * r2).toFixed(1)} ${(50 + Math.sin(a) * r2).toFixed(1)}`;
  }
  return d;
};

const ICON_PATHS: Record<IconName, string[]> = {
  column: ['M22 16h56v9H22z', 'M30 25h40v6H30z', 'M36 31v46 M44 31v46 M52 31v46 M60 31v46', 'M30 77h40v6H30z', 'M22 83h56v9H22z'],
  laurel: ['M32 86C12 66 10 38 30 14', 'M68 86C88 66 90 38 70 14', 'M20 66q-10-3-12-12q10 0 12 12z', 'M14 48q-9-5-9-14q10 2 9 14z', 'M18 30q-6-8-3-16q9 5 3 16z', 'M80 66q10-3 12-12q-10 0-12 12z', 'M86 48q9-5 9-14q-10 2-9 14z', 'M82 30q6-8 3-16q-9 5-3 16z', 'M50 70v18'],
  sword: ['M50 6L57 62H43z', 'M50 12V58', 'M26 62h48v7H26z', 'M46 69h8v18h-8z', 'M50 87m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0'],
  ship: ['M12 66H88L75 84H25z', 'M50 16V66', 'M50 20Q80 40 50 62z', 'M50 28Q24 42 50 60', 'M50 16l15 5-15 5', 'M8 92q10-7 21 0t21 0t21 0t21 0'],
  crown: ['M18 72L13 32L35 52L50 24L65 52L87 32L82 72z', 'M18 80h64', 'M13 32m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M50 24m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M87 32m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M36 60v12 M50 52v20 M64 60v12'],
  scroll: ['M28 22H76V72Q76 80 68 80H32Q24 80 24 72V28Q24 20 32 20', 'M24 28Q16 28 16 34Q16 40 24 40', 'M76 72Q84 72 84 66Q84 60 76 60', 'M36 36h30 M36 46h30 M36 56h30 M36 66h18'],
  hourglass: ['M28 12h44 M28 88h44', 'M32 12C32 40 50 43 50 50C50 57 32 60 32 88', 'M68 12C68 40 50 43 50 50C50 57 68 60 68 88', 'M40 82h20 M44 74h12'],
  castle: ['M16 88V46h68v42', 'M16 46v-9h9v9 M34 46v-9h9v9 M57 46v-9h9v9 M75 46v-9h9v9', 'M40 88V68a10 10 0 0 1 20 0v20', 'M50 37V16l14 5-14 5', 'M26 62v10 M74 62v10'],
  quill: ['M80 10C52 16 30 44 25 82C48 74 72 54 80 10z', 'M80 10L34 70', 'M25 82L17 94', 'M52 40l-9-3 M44 52l-10-2 M60 28l-8-4'],
  key: ['M30 34m-15 0a15 15 0 1 0 30 0a15 15 0 1 0-30 0', 'M30 34m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0', 'M41 45L84 88', 'M70 74l9-9 M78 82l9-9'],
  coin: ['M50 50m-36 0a36 36 0 1 0 72 0a36 36 0 1 0-72 0', 'M50 50m-28 0a28 28 0 1 0 56 0a28 28 0 1 0-56 0', 'M50 30V70', 'M40 41h14q9 0 9 9t-9 9H38'],
  compass: ['M50 50m-38 0a38 38 0 1 0 76 0a38 38 0 1 0-76 0', 'M50 8L57 43L92 50L57 57L50 92L43 57L8 50L43 43z', 'M50 50m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M50 2V10 M50 90v8 M2 50h8 M90 50h8'],
  pyramid: ['M8 84L50 16L92 84z', 'M22 62H78 M35 40H65', 'M50 16V84', 'M8 92H92'],
  book: ['M14 24Q34 16 50 28Q66 16 86 24V78Q66 70 50 82Q34 70 14 78z', 'M50 28V82', 'M24 38q12-3 20 2 M24 50q12-3 20 2 M56 40q8-5 20-2 M56 52q8-5 20-2'],
  gear: [gear()],
  sun: [sun()],
};

export const ICON_NAMES = Object.keys(ICON_PATHS) as IconName[];

const KEYWORDS: [RegExp, IconName][] = [
  [/\b(rome|roman|greek|greece|athens|sparta|temple|senate|republic)\b/i, 'column'],
  [/\b(egypt|pharaoh|pyramid|tomb|nile|sphinx)\b/i, 'pyramid'],
  [/\b(sword|battle|war|army|armies|soldier|legion|siege|invasion|fought|conquer\w*)\b/i, 'sword'],
  [/\b(ship|sail\w*|fleet|navy|armada|ocean|voyage|pirate|sea|explor\w*|columbus|magellan)\b/i, 'ship'],
  [/\b(king|queen|emperor|empress|crown|throne|dynasty|monarch\w*|royal|caesar|reign\w*)\b/i, 'crown'],
  [/\b(law|decree|treaty|letter|edict|manuscript|document|signed|charter)\b/i, 'scroll'],
  [/\b(time|years?|centur\w*|decades?|ages?|ancient|last)\b/i, 'hourglass'],
  [/\b(castle|fortress|wall|knight|medieval|crusade\w*|viking)\b/i, 'castle'],
  [/\b(write|wrote|written|poet|author|philosopher|scribe|diary)\b/i, 'quill'],
  [/\b(secret|hidden|lost|mystery|vault|forbidden)\b/i, 'key'],
  [/\b(gold|money|coin|tax\w*|trade|wealth|rich|bank|treasure)\b/i, 'coin'],
  [/\b(map|route|journey|silk road|border|territory|continent)\b/i, 'compass'],
  [/\b(book|library|school|knowledge|science|learn\w*|invent\w*)\b/i, 'book'],
  [/\b(machine|factory|steam|engine|industrial|railway|train)\b/i, 'gear'],
  [/\b(sun|empire|glory|golden|dawn)\b/i, 'sun'],
];
export const pickIcon = (text: string, seed: number): IconName => {
  for (const [re, name] of KEYWORDS) if (re.test(text)) return name;
  return ICON_NAMES[seed % ICON_NAMES.length];
};

/** An engraving that draws itself between frames `at` and `at + len`. */
export const Engraving: React.FC<{ name: IconName; size: number; color: string; accent: string; at?: number; len?: number; thick?: number; opacity?: number }> = ({ name, size, color, accent, at = 0, len = 46, thick = 2.4, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const paths = ICON_PATHS[name] ?? ICON_PATHS.column;
  const p = interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: EASE_OUT });
  const fill = interpolate(frame, [at + len * 0.7, at + len + 14], [0, 0.14], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, overflow: 'visible' }}>
      {paths.map((d, i) => {
        const seg = interpolate(p, [i / paths.length * 0.6, i / paths.length * 0.6 + 0.4], [0, 1], clamp);
        return <path key={i} d={d} pathLength={1} fill={i === 0 ? accent : 'none'} fillOpacity={i === 0 ? fill : 0} stroke={i === 0 ? accent : color} strokeWidth={thick} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - seg} />;
      })}
    </svg>
  );
};
