import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { Captions, chunkCaptions, fallbackCaptions } from './captions';
import { Corners, clamp, EASE_OUT, InkWords, fit } from './ink';
import { Look, LookCtx, lookFor, modernLook, themedLook, useLook } from './looks';
import { ModernBackdrop } from './paper';
import { ArtFilm, buildFilm } from './art/Stage';
import { ArtCtx, Callout, Chapter, DateScene, Flash, ImageScene, Ledger, ListScene, MapScene, Outro, Quote, Statement, Timeline, Verdict, Versus } from './scenes';
import { HEIGHT, MotionGraphicProps, MotionScene, OVERLAP, SAFE_BOTTOM, SAFE_TOP, WIDTH, totalFrames } from './types';

export { totalFrames };

const SCENES: Record<string, React.FC<{ scene: MotionScene }>> = {
  statement: Statement, chapter: Chapter, date: DateScene, timeline: Timeline, map: MapScene, quote: Quote, ledger: Ledger, versus: Versus, list: ListScene, verdict: Verdict, image: ImageScene, flash: Flash, outro: Outro,
};
/** Scene names of the old tech engine that a script may still use, drawn with the closest history scene. */
const ALIAS: Record<string, string> = {
  bigText: 'statement', textWithAccent: 'statement', card: 'statement', headline: 'statement', counter: 'ledger', progressBar: 'ledger', curve: 'ledger', codeBlock: 'quote', footage: 'image', tier: 'list', rank: 'list', quiz: 'list', split: 'versus', units: 'ledger', ui: 'statement',
};
const sceneFor = (t: string) => SCENES[t] ?? SCENES[ALIAS[t] ?? 'statement'];

type Entrance = 'rise' | 'ink' | 'slide' | 'fade';
const ENTRANCES: Entrance[] = ['rise', 'ink', 'slide', 'fade'];
const enter = (kind: Entrance, p: number): React.CSSProperties => {
  switch (kind) {
    case 'rise': return { opacity: p, transform: `translateY(${(1 - p) * 70}px)` };
    case 'slide': return { opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 150}px)` };
    case 'ink': return { clipPath: `circle(${p * 150}% at 50% 52%)`, opacity: Math.min(1, p * 3) };
    default: return { opacity: p };
  }
};

const SceneShell: React.FC<{ scene: MotionScene; index: number; last: boolean; children: React.ReactNode }> = ({ scene, index, last, children }) => {
  const frame = useCurrentFrame();
  const pin = interpolate(frame, [0, OVERLAP], [0, 1], { ...clamp, easing: EASE_OUT });
  const pout = interpolate(frame, [scene.durationInFrames, scene.durationInFrames + OVERLAP], [0, 1], clamp);
  const kind = index === 0 ? 'fade' : ENTRANCES[(index * 7 + scene.type.length) % ENTRANCES.length];
  const style: React.CSSProperties = !last && pout > 0 ? { opacity: 1 - pout, transform: `translateY(${-pout * 24}px)` } : index === 0 ? {} : enter(kind, pin);
  return (
    <ArtCtx.Provider value={!!scene.art?.length}>
      <AbsoluteFill style={style}>
        {children}
        <Callout scene={scene} />
      </AbsoluteFill>
    </ArtCtx.Provider>
  );
};

/** The chronology rail: a thin ruled line down the left edge with a diamond per scene; the part already told is inked in. */
const Rail: React.FC<{ starts: number[]; scenes: MotionScene[]; total: number }> = ({ starts, scenes, total }) => {
  const frame = useCurrentFrame();
  const look = useLook();
  const top = SAFE_TOP + 50;
  const bottom = HEIGHT - SAFE_BOTTOM - 200;
  const h = bottom - top;
  const prog = Math.min(1, frame / Math.max(1, total));
  return (
    <div style={{ position: 'absolute', left: 30, top, width: 4, height: h, background: 'rgba(255,255,255,0.22)', borderRadius: 2 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: h * prog, background: look.accent, borderRadius: 2 }} />
      {starts.map((s, i) => {
        const y = (s / Math.max(1, total)) * h;
        const done = frame >= s;
        return <div key={i} style={{ position: 'absolute', left: -7, top: y - 9, width: 18, height: 18, transform: 'rotate(45deg)', background: done ? look.accent : '#24170d', border: `3px solid ${done ? look.accent : 'rgba(255,255,255,0.5)'}` }} />;
      })}
    </div>
  );
};
const EraCtx = React.createContext<Look>(lookFor(undefined));

/** The last moments fade to the hook line, so the loop that restarts the video feels continuous. */
const LoopTease: React.FC<{ scene: MotionScene; total: number }> = ({ scene, total }) => {
  const frame = useCurrentFrame();
  const look = useLook();
  const p = interpolate(frame, [total - 26, total - 4], [0, 1], clamp);
  if (p <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity: p, background: 'radial-gradient(ellipse 85% 60% at 50% 50%, #0b1226F5 0%, #050814EE 100%)', alignItems: 'center', justifyContent: 'center', padding: 90 }}>
      <InkWords text={scene.text} size={fit(scene.text, 120, 900, 4, look.k, 56)} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={0} stagger={0} />
    </AbsoluteFill>
  );
};

export const MotionGraphic: React.FC<MotionGraphicProps> = ({ scenes, title, look: lookName, theme, captions }) => {
  if (!scenes?.length) throw new Error('MotionGraphic needs at least one scene');
  const frame = useCurrentFrame();
  const era = themedLook(lookName, theme);
  const look = modernLook(era);
  const chunks = useMemo(() => chunkCaptions(captions?.length ? captions : fallbackCaptions(scenes)), [captions, scenes]);
  const { starts, total } = useMemo(() => {
    let at = 0;
    const s: number[] = [];
    scenes.forEach((sc) => { s.push(at); at += sc.durationInFrames; });
    return { starts: s, total: at };
  }, [scenes]);
  // the pictures of every scene play as one film under the text (art/Stage.tsx), cut where the narration moves on
  const film = useMemo(() => buildFilm(scenes, starts, chunks.map((c) => c.s)), [scenes, starts, chunks]);
  const flash = (() => {
    for (let i = 0; i < scenes.length; i++) if (frame >= starts[i] && frame < starts[i] + scenes[i].durationInFrames) return scenes[i].type === 'flash';
    return false;
  })();
  return (
    <EraCtx.Provider value={era}>
      <LookCtx.Provider value={look}>
        <AbsoluteFill style={{ width: WIDTH, height: HEIGHT }} data-title={title}>
          <ModernBackdrop look={look} frame={frame} />
          <ArtFilm film={film} look={era} />
          {scenes.map((scene, i) => {
            const C = sceneFor(scene.type);
            const last = i === scenes.length - 1;
            return (
              <Sequence key={i} from={starts[i]} durationInFrames={scene.durationInFrames + (last ? 0 : OVERLAP)} layout="none">
                <SceneShell scene={scene} index={i} last={last}><C scene={scene} /></SceneShell>
              </Sequence>
            );
          })}
          {!flash && <Rail starts={starts} scenes={scenes} total={total} />}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><Corners color={look.accent2} size={64} inset={26} weight={5} /></div>
          <Captions chunks={chunks} />
          <LoopTease scene={scenes[0]} total={total} />
        </AbsoluteFill>
      </LookCtx.Provider>
    </EraCtx.Provider>
  );
};
