import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Diorama } from './art/Diorama';
import { ArtShot, kindOf } from './art/vocab';
import { Corners, TEXT_SCALE, TornLabel, fit, foilText } from './ink';
import { LookCtx, modernLook, themedLook } from './looks';
import { CHANNEL, MotionGraphicProps } from './types';

/**
 * The COVER of a video: a poster, not a screenshot. It has no subtitles. The hero of the story is drawn large and lit like a film still (light rays, vignette, grain), the title is set in
 * the era's own typeface as gold foil over a dark scrim, a strip of torn paper carries the hook, and a plate names the series. Rendered as a still by scripts/render_cover.mjs.
 */
const DRAMATIC = ['cheer', 'shout', 'point', 'lift', 'wave', 'stab', 'slash', 'salute', 'plead', 'threaten', 'surrender', 'throw', 'shoot', 'dance'];

/** The shot the poster is built on: the best-looking one of the video. A person facing us (or in profile) doing something dramatic wins; backs and landscapes lose.
 *  `rank` 0 gives the best shot, 1 the second best (the two cover styles). */
const pickShot = (scenes: MotionGraphicProps['scenes'], rank: number): ArtShot | undefined => {
  const all = scenes.flatMap((s, si) => (s.art ?? []).map((sh, k) => ({ sh, order: si * 4 + k })));
  const score = (sh: ArtShot) => {
    const people = sh.subjects.some((x) => kindOf(x) === 'actor' && !['ship', 'fleet', 'galley', 'train', 'tank', 'plane', 'cavalry', 'caravan', 'elephants', 'wagon', 'junk', 'lander', 'satellite'].includes(x));
    if (!people) return 0;
    return 2 + (sh.view === 'back' ? -3 : sh.view === 'front' ? 3 : 1) + (sh.action && DRAMATIC.includes(sh.action) ? 2 : sh.action ? 1 : 0);
  };
  const ranked = [...all].sort((p, q) => score(q.sh) - score(p.sh) || p.order - q.order);
  return (ranked[Math.min(rank, ranked.length - 1)] ?? ranked[0])?.sh;
};

export const Cover: React.FC<MotionGraphicProps & { coverScene?: number }> = ({ scenes, title, series, look: lookName, theme, coverScene = 0 }) => {
  const era = themedLook(lookName, theme);
  const look = modernLook(era);
  const shot = pickShot(scenes, coverScene > 0 ? 1 : 0);
  const date = scenes.find((s) => s.type === 'date');
  const hook = scenes[0]?.accentText || scenes[0]?.text || '';
  const when = date ? `${date.kicker ? date.kicker.split(',')[0] + '  ·  ' : ''}${date.value ?? date.text} ${date.unit ?? ''}`.trim() : era.era;
  const W = 940;
  const tSize = fit(title.toUpperCase(), 215 / TEXT_SCALE, W, 3, look.k * 1.05, 96 / TEXT_SCALE);
  const hSize = fit(hook, 82 / TEXT_SCALE, W, 2, 0.5, 50 / TEXT_SCALE);
  const plate = 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)';
  return (
    <LookCtx.Provider value={look}>
        <AbsoluteFill style={{ background: look.paper2 }}>
          {shot && (
            <AbsoluteFill style={{ transform: 'scale(1.06) translateY(2%)', transformOrigin: '50% 45%' }}>
              <Diorama shot={shot} frame={58} dur={150} look={era} seed={7} />
            </AbsoluteFill>
          )}
          {/* light: a halo behind the hero and slow rays */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 36% at 50% 38%, ${look.accent2}30 0%, transparent 70%)`, mixBlendMode: 'screen' }} />
          <AbsoluteFill style={{ background: `repeating-conic-gradient(from 200deg at 50% 30%, ${look.accent2}26 0deg 5deg, transparent 5deg 17deg)`, mixBlendMode: 'screen', opacity: 0.3, maskImage: 'radial-gradient(ellipse 80% 55% at 50% 35%, #000 0%, transparent 72%)' }} />
          {/* scrims for the type, a vignette and grain */}
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(8,5,3,0.78) 0%, rgba(8,5,3,0) 17%, rgba(8,5,3,0) 40%, rgba(8,5,3,0.78) 66%, rgba(8,5,3,0.96) 100%)' }} />
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(0,0,0,0.6) 100%)' }} />
          <AbsoluteFill style={{ opacity: 0.12, mixBlendMode: 'overlay', backgroundImage: 'repeating-radial-gradient(circle at 17% 23%, #fff 0 1px, transparent 1px 3px)' }} />

          {/* the series plate */}
          <div style={{ position: 'absolute', top: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ clipPath: plate, background: look.accent2, padding: 4 }}>
              <div style={{ clipPath: plate, background: 'rgba(14,8,7,0.9)', padding: '14px 44px', display: 'flex', alignItems: 'center', gap: 22 }}>
                <div style={{ width: 14, height: 14, background: look.accent, transform: 'rotate(45deg)' }} />
                <span style={{ fontFamily: look.head, fontWeight: look.weight, fontSize: 44, letterSpacing: 8, color: '#FFF4D8', textTransform: 'uppercase' }}>{series ?? look.era}</span>
                <div style={{ width: 14, height: 14, background: look.accent, transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>

          {/* when and where, then the title in gold foil, then the hook on torn paper */}
          <div style={{ position: 'absolute', left: 70, right: 70, bottom: 250, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: 880, marginBottom: 14 }}>
              <div style={{ height: 3, flex: 1, background: `linear-gradient(90deg, transparent, ${look.accent2})` }} />
              <span style={{ fontFamily: look.date, fontWeight: look.weight, fontSize: 42, letterSpacing: 7, color: look.accent2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{when}</span>
              <div style={{ height: 3, flex: 1, background: `linear-gradient(270deg, transparent, ${look.accent2})` }} />
            </div>
            <div style={{ fontFamily: look.head, fontWeight: look.weight, fontSize: tSize, lineHeight: 0.98, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, WebkitTextStroke: `${Math.round(tSize / 11)}px #100b07`, paintOrder: 'stroke fill', ...foilText, transform: 'rotate(-1.5deg)' }}>{title}</div>
            {hook && (
              <div style={{ marginTop: 34 }}>
                <TornLabel color={look.accent} seed={4} at={0} tilt={1.5}>
                  <span style={{ fontFamily: look.head, fontWeight: look.weight, fontSize: hSize, textTransform: 'uppercase', letterSpacing: 2, color: '#1b1208' }}>{hook}</span>
                </TornLabel>
              </div>
            )}
          </div>

          {/* the channel at the foot */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
            <div style={{ height: 3, width: 150, background: `linear-gradient(90deg, transparent, ${look.accent2})` }} />
            <span style={{ fontFamily: look.body, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: '#FFF4D8', opacity: 0.92 }}>{CHANNEL.toUpperCase()}</span>
            <div style={{ height: 3, width: 150, background: `linear-gradient(270deg, transparent, ${look.accent2})` }} />
          </div>
          <Corners color={look.accent2} size={70} inset={30} weight={6} />
        </AbsoluteFill>
    </LookCtx.Provider>
  );
};
