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
  const edge = '#100b07';
  const len = chunk.words.map((w) => w.w).join(' ').length;
  const size = Math.max(38, Math.min(56, Math.floor(860 / (Math.max(8, len) * look.k * 1.08))));
  const rule = look.accent2;
  return (
    <div style={{ position: 'absolute', left: 54, right: 54, bottom: SAFE_BOTTOM + 8, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: fade, transform: `translateY(${(1 - pop) * 16}px)` }}>
      {/* the documentary title rule: two gold lines around a diamond */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: 300, marginBottom: 4, opacity: 0.9 }}>
        <div style={{ height: 3, flex: 1, background: `linear-gradient(90deg, transparent, ${rule})` }} />
        <div style={{ width: 14, height: 14, background: rule, transform: 'rotate(45deg)', boxShadow: `0 0 14px ${rule}` }} />
        <div style={{ height: 3, flex: 1, background: `linear-gradient(270deg, transparent, ${rule})` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 26px', transform: `scale(${0.95 + 0.05 * pop})` }}>
        {chunk.words.map((w, i) => {
          const on = frame >= w.s - 1 && frame <= w.e + 2;
          return (
            <span key={i} style={{ position: 'relative', fontFamily: look.head, fontWeight: look.weight, fontSize: size, lineHeight: 1.12, textTransform: 'uppercase', letterSpacing: 1.5, color: on ? '#FFE08A' : '#FFF8EA', transform: on ? 'scale(1.1)' : 'none', WebkitTextStroke: `${Math.round(size / 8)}px ${edge}`, paintOrder: 'stroke fill', textShadow: on ? '0 3px 0 #D9A021, 0 6px 0 #8a5a0c, 0 0 30px rgba(255,200,90,0.75), 0 12px 22px rgba(0,0,0,0.7)' : '0 5px 0 rgba(0,0,0,0.65), 0 10px 22px rgba(0,0,0,0.75)' }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
