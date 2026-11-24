import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { clamp, EASE_OUT, hash } from '../ink';
import { Look } from '../looks';
import { Diorama } from './Diorama';
import { ArtShot } from './vocab';

/** The illustration behind a scene: its shots one after another (a new picture whenever the narration moves on), joined by a wipe or an iris, each drifting under its own camera. */
export const ArtStage: React.FC<{ shots: ArtShot[]; dur: number; look: Look; seed: string }> = ({ shots, dur, look, seed }) => {
  const frame = useCurrentFrame();
  const n = shots.length;
  const len = dur / n;
  const s0 = hash(seed) % 997;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {shots.map((shot, k) => {
        const start = k * len;
        if (frame < start - 1 || frame > start + len + 14) return null;
        const p = k === 0 ? 1 : interpolate(frame, [start, start + 14], [0, 1], { ...clamp, easing: EASE_OUT });
        const style: React.CSSProperties = k === 0 ? {} : k % 2 ? { clipPath: `inset(0 0 0 ${(1 - p) * 100}%)` } : { clipPath: `circle(${p * 140}% at 50% 40%)` };
        return (
          <AbsoluteFill key={k} style={style}>
            <Diorama shot={shot} frame={frame - start + k * 40} dur={len + 20} look={look} seed={s0 + k * 13} />
            {k > 0 && p < 1 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: k % 2 ? `${(1 - p) * 100}%` : 0, width: 6, background: look.accent2, opacity: k % 2 ? 0.9 : 0 }} />}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(17,12,8,0.3) 0%, rgba(17,12,8,0) 16%, rgba(17,12,8,0) 58%, rgba(17,12,8,0.55) 80%, rgba(17,12,8,0.72) 100%)' }} />
    </AbsoluteFill>
  );
};
