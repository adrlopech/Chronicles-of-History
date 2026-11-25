import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { clamp, hash } from '../ink';
import { Look } from '../looks';
import { Diorama } from './Diorama';
import { Action, ArtShot, Camera, PEOPLE } from './vocab';

/**
 * The illustrations of a whole video as ONE film, not a slideshow of separate pictures. Every shot of every scene is laid on a single track:
 * - a shot starts where the narration moves on (the boundary is snapped to the start of a caption phrase), so the picture changes with the words;
 * - consecutive shots in the same place and light share the same set (hills, clouds, walls do not jump) and are joined by a short dissolve, like a cut inside one scene of a film;
 * - a change of place is a wipe or an iris; the film only fades to the backdrop around scenes that have no picture (flash, map, outro);
 * - each shot gets a camera (wide, medium, close, push, pull, follow), written in the script or chosen here from the story: a new place opens wide, emotion goes close, movement is followed.
 */
export interface FilmShot { shot: ArtShot; start: number; end: number; camera: Camera; set: number; same: boolean; seed: number; open: boolean; close: boolean }

const MOVING = new Set<Action>(['walk', 'run', 'carry', 'push', 'sneak', 'dance']);
const FEELING = new Set<Action>(['shout', 'plead', 'think', 'cower', 'fall', 'pray', 'surrender', 'threaten', 'drink', 'write', 'read', 'kneel', 'bow', 'watch', 'lift']);
const HUMANS = new Set<string>([...PEOPLE, 'soldiers', 'king', 'crowd', 'scholar', 'monk', 'farmer', 'merchant']);

/** The camera a shot gets when the script does not say: the grammar of a film. */
export const autoCamera = (shot: ArtShot, prev: FilmShot | undefined, i: number): Camera => {
  const person = HUMANS.has(shot.subjects[0]);
  if (!person) return prev && prev.camera === 'wide' ? 'push' : 'wide';
  if (i === 0) return 'push';
  const newPlace = !prev || prev.shot.place !== shot.place || prev.shot.time !== shot.time;
  const feeling = !!shot.action && FEELING.has(shot.action);
  // emotion wins: in a new place the camera starts on the group and moves in (the place is seen first), in the same place it is already close
  if (feeling) return newPlace || prev?.camera === 'close' ? 'push' : 'close';
  if (shot.action && MOVING.has(shot.action)) return 'follow';
  if (newPlace) return prev?.camera === 'wide' ? 'pull' : 'wide';
  return prev?.camera === 'medium' ? 'push' : 'medium';
};

/** Lays the shots of all scenes on one track. `phrases` are the frames where caption phrases start (the pauses of the narration). */
export const buildFilm = (scenes: { art?: ArtShot[]; durationInFrames: number; text: string }[], starts: number[], phrases: number[]): FilmShot[] => {
  const out: FilmShot[] = [];
  scenes.forEach((sc, si) => {
    const shots = sc.art ?? [];
    if (!shots.length) return;
    const s0 = starts[si];
    const e0 = s0 + sc.durationInFrames;
    const cuts = [s0];
    for (let k = 1; k < shots.length; k++) {
      const ideal = s0 + (sc.durationInFrames * k) / shots.length;
      const lo = cuts[k - 1] + 36, hi = e0 - 36 * (shots.length - k); // every shot keeps at least 1.2 s
      const near = phrases.filter((p) => p >= lo && p <= hi).sort((a, b) => Math.abs(a - ideal) - Math.abs(b - ideal))[0];
      cuts.push(Math.round(near ?? Math.min(hi, Math.max(lo, ideal))));
    }
    shots.forEach((shot, k) => {
      const prev = out[out.length - 1];
      const start = cuts[k];
      const touching = !!prev && prev.end === start;
      const same = touching && prev.shot.place === shot.place && prev.shot.time === shot.time;
      const camera: Camera = shot.camera ?? autoCamera(shot, touching ? prev : undefined, out.length);
      out.push({ shot, start, end: k + 1 < shots.length ? cuts[k + 1] : e0, camera, set: same ? prev.set : hash(`${shot.place}${shot.time}${si}`) % 1000, same, seed: hash(`${sc.text}${si}${k}`) % 997, open: !touching, close: false });
    });
  });
  out.forEach((f, i) => { f.close = !(out[i + 1] && out[i + 1].start === f.end); });
  return out;
};

const MIX = 10; // frames of a dissolve inside one place
const WIPE = 16; // frames of a wipe or an iris to a new place
const FADE = 14; // frames of the fade to and from the backdrop

/** Plays the film: at most two shots at once, the newer one entering over the older. */
export const ArtFilm: React.FC<{ film: FilmShot[]; look: Look }> = ({ film, look }) => {
  const frame = useCurrentFrame();
  const live = film.map((f, i) => ({ f, i })).filter(({ f }) => frame >= f.start - 1 && frame < f.end + (f.close ? FADE : WIPE + 1));
  if (!live.length) return null;
  return (
    <AbsoluteFill>
      {live.map(({ f, i }) => {
        const since = frame - f.start;
        const tr = f.same ? MIX : WIPE;
        const p = interpolate(since, [0, f.open ? FADE : tr], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const out = f.close ? interpolate(frame, [f.end, f.end + FADE], [1, 0], clamp) : 1;
        let style: React.CSSProperties = { opacity: out };
        if (f.open) style = { opacity: p * out };
        else if (f.same) style = { opacity: p };
        else if (p < 1) style = i % 2 ? { clipPath: `inset(0 0 0 ${(1 - p) * 100}%)` } : { clipPath: `circle(${p * 140}% at 50% 38%)` };
        return (
          <AbsoluteFill key={i} style={style}>
            <Diorama shot={f.shot} frame={since} dur={f.end - f.start + tr} look={look} seed={f.seed} set={f.set} camera={f.camera} />
            {!f.open && !f.same && p > 0 && p < 1 && i % 2 === 1 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(1 - p) * 100}%`, width: 6, background: look.accent2, opacity: 0.9 }} />}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(17,12,8,0.3) 0%, rgba(17,12,8,0) 16%, rgba(17,12,8,0) 58%, rgba(17,12,8,0.55) 80%, rgba(17,12,8,0.72) 100%)' }} />
    </AbsoluteFill>
  );
};
