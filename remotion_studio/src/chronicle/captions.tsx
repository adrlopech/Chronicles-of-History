import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp } from './ink';
import { useLook } from './looks';
import { CaptionWord, SAFE_BOTTOM } from './types';

/** Word-by-word captions: a few words at a time, the spoken word in the rubric colour with an ink underline. They sit just above the platform's bottom bar. */
export type Chunk = { words: CaptionWord[]; s: number; e: number };

export const chunkCaptions = (words: CaptionWord[], maxWords = 4, maxChars = 24): Chunk[] => {
  const out: Chunk[] = [];
  let cur: CaptionWord[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    cur = [];
  };
  for (const w0 of words) {
    const w = { ...w0, w: w0.w.replace(/\*/g, '') };
    if (!w.w) continue;
    const len = cur.map((x) => x.w).join(' ').length + w.w.length + 1;
    if (cur.length >= maxWords || (cur.length && len > maxChars)) flush();
    cur.push(w);
    if (/[.!?;:]$/.test(w.w) || (/,$/.test(w.w) && cur.length >= 2)) flush();
  }
  flush();
  return out;
};

export const Captions: React.FC<{ chunks: Chunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const look = useLook();
  if (!chunks.length) return null;
  let chunk: Chunk | undefined;
  for (const c of chunks) if (frame >= c.s - 2 && frame <= c.e + 10) chunk = c;
  if (!chunk) return null;
  const pop = spring({ frame: frame - chunk.s, fps, config: { damping: 15, stiffness: 220, mass: 0.6 } });
  const fade = interpolate(frame, [chunk.e + 4, chunk.e + 10], [1, 0], clamp);
  const edge = '#050814';
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, bottom: SAFE_BOTTOM + 36, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px', opacity: fade, transform: `translateY(${(1 - pop) * 18}px) scale(${0.94 + 0.06 * pop})` }}>
      {chunk.words.map((w, i) => {
        const on = frame >= w.s - 1 && frame <= w.e + 2;
        return (
          <span key={i} style={{ position: 'relative', fontFamily: look.body, fontWeight: 700, fontSize: 78, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: 2, color: on ? look.accent : '#FFF8EA', transform: on ? 'scale(1.08)' : 'none', WebkitTextStroke: `9px ${edge}`, paintOrder: 'stroke fill', textShadow: on ? `0 0 28px ${look.accent}, 0 6px 0 rgba(0,0,0,0.6)` : '0 6px 0 rgba(0,0,0,0.6), 0 10px 24px rgba(0,0,0,0.7)' }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
