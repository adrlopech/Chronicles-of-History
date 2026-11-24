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

/** Captions for a video that arrives without voice timing (the Studio preview, a render with no narration yet): each scene's narration, or its own text, spread over the scene at a natural pace. */
export const fallbackCaptions = (scenes: { type: string; text?: string; accentText?: string; narration?: string; durationInFrames: number }[]): CaptionWord[] => {
  const out: CaptionWord[] = [];
  let at = 0;
  for (const sc of scenes) {
    const line = (sc.narration || [sc.text, sc.accentText].filter(Boolean).join('. ')).trim();
    const toks = line.split(/\s+/).filter(Boolean);
    if (toks.length) {
      const span = Math.max(30, sc.durationInFrames - 20);
      const step = span / toks.length;
      toks.forEach((w, i) => out.push({ w, s: Math.round(at + 10 + i * step), e: Math.round(at + 10 + (i + 1) * step) - 1 }));
    }
    at += sc.durationInFrames;
  }
  return out;
};

export const Captions: React.FC<{ chunks: Chunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const look = useLook();
  if (!chunks.length) return null;
  // Subtitles are always on: a line stays until the next one starts (the first shows from frame 0), and only the very last one fades out.
  let chunk: Chunk = chunks[0];
  for (const c of chunks) if (frame >= c.s - 2) chunk = c;
  const isLast = chunk === chunks[chunks.length - 1];
  const pop = spring({ frame: Math.max(0, frame - chunk.s), fps, config: { damping: 15, stiffness: 220, mass: 0.6 } });
  const fade = isLast ? interpolate(frame, [chunk.e + 20, chunk.e + 30], [1, 0], clamp) : 1;
  const edge = '#050814';
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, bottom: SAFE_BOTTOM + 8, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px', opacity: fade, transform: `translateY(${(1 - pop) * 18}px) scale(${0.94 + 0.06 * pop})` }}>
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
