import React, { createContext, useContext, useMemo } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Engraving, pickIcon } from './icons';
import { Corners, EASE_OUT, InkWords, Kicker, Ornament, ROMAN, Seal, Stamp, TornLabel, Underline, clamp, fit, foilText, hash, lines, rng, smoothClosed } from './ink';
import { useLook } from './looks';
import { CAPTION_SPACE, CHANNEL, FPS, HEIGHT, MotionScene, SAFE_BOTTOM, SAFE_TOP, WIDTH } from './types';

/** Content area: below the platform's top bar, above the caption strip and the platform's bottom bar. */
export const CONTENT_TOP = SAFE_TOP + 40;
export const CONTENT_H = HEIGHT - CONTENT_TOP - SAFE_BOTTOM - CAPTION_SPACE;
const W = 880;

/** True when an illustration is drawn behind the scene: the content then sits on a parchment plate at the bottom and leaves the picture in view. */
export const ArtCtx = createContext(false);

const Page: React.FC<{ children: React.ReactNode; gap?: number; justify?: 'center' | 'flex-start'; card?: boolean }> = ({ children, gap = 26, justify = 'center', card = false }) => {
  const art = useContext(ArtCtx);
  const look = useLook();
  if (!art) return <AbsoluteFill style={{ padding: `${CONTENT_TOP}px 100px ${SAFE_BOTTOM + CAPTION_SPACE}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: justify, gap }}>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{ padding: `${CONTENT_TOP}px 56px ${SAFE_BOTTOM + CAPTION_SPACE - 10}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
      <div style={card ? { width: 968, padding: '28px 36px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.min(gap, 16), position: 'relative', background: `linear-gradient(165deg, ${look.paper}F4, ${look.paper2}F7)`, border: `3px solid ${look.accent2}`, outline: `1.5px solid ${look.accent2}88`, outlineOffset: -14, borderRadius: 6, boxShadow: '0 28px 70px rgba(0,0,0,0.7), inset 0 0 90px rgba(0,0,0,0.5)' } : { width: 968, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.min(gap, 14), textShadow: '0 4px 0 rgba(0,0,0,0.55), 0 8px 30px rgba(0,0,0,0.8)' }}>{card && <Corners color={look.accent2} size={46} inset={7} />}{children}</div>
    </AbsoluteFill>
  );
};

const cueFrame = (s: MotionScene, fallback: number) => (s.accentCue != null ? Math.max(10, Math.round(s.accentCue * FPS)) : fallback);
const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length;

/** The standard headline scene: a headline, an accent phrase with a hand-drawn underline (drawn when the narrator says it) and an engraving. */
export const Statement: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const text = scene.text;
  const acc = scene.accentText ?? '';
  const art = useContext(ArtCtx);
  const headSize = fit(text, art ? 96 : 128, W, 3, look.k, 52);
  const accSize = acc ? fit(acc, Math.round(headSize * 1.06), W, 2, 0.46, 50) : 0;
  const used = lines(text, headSize, W, look.k) * headSize * 1.1 + (acc ? lines(acc, accSize, W, 0.46) * accSize * 1.12 + 40 : 0) + (scene.kicker ? 70 : 0) + 100;
  const iconSize = art ? 0 : Math.max(0, Math.min(380, CONTENT_H - used));
  const icon = scene.icon ?? pickIcon(`${text} ${acc} ${scene.narration ?? ''}`, hash(text));
  const headWords = wordCount(text);
  const at = cueFrame(scene, 26 + headWords * 3);
  const accW = Math.min(W, lines(acc, accSize, W, 0.46) > 1 ? W * 0.8 : acc.length * accSize * 0.44);
  return (
    <Page gap={22}>
      {scene.kicker && <Kicker text={scene.kicker} />}
      <InkWords text={text} size={headSize} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} ls={look.caps ? headSize * 0.02 : -headSize * 0.012} delay={4} />
      {acc && art && (
        <TornLabel color={look.accent} seed={hash(acc)} at={at} tilt={-1.6 + (hash(acc) % 3)}>
          <span style={{ fontFamily: look.head, fontWeight: look.weight, fontSize: Math.round(accSize * 0.86), lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: look.caps ? 2 : 0 }}>{acc}</span>
        </TornLabel>
      )}
      {acc && !art && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <InkWords text={acc} size={accSize} color={look.accent} font={look.italic} weight={400} delay={headWords * 3 + 10} lh={1.1} />
          <Underline width={accW} at={at} color={look.accent} double />
        </div>
      )}
      {iconSize >= 150 && <div style={{ marginTop: 8 }}><Engraving name={icon} size={iconSize} color={look.ink} accent={look.accent2} at={14} opacity={0.82} /></div>}
    </Page>
  );
};

/** A chapter break: a Roman numeral between two rules, the chapter title and a subtitle. */
export const Chapter: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const num = ROMAN(scene.value ?? 1);
  const p = interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: EASE_OUT });
  const nSize = fit(num, 270, W, 1, 0.8, 120);
  const tSize = fit(scene.text, 104, W, 3, look.k, 50);
  return (
    <Page gap={26}>
      <Kicker text={scene.kicker ?? 'Chapter'} />
      <div style={{ fontFamily: look.date, fontWeight: 600, fontSize: nSize, lineHeight: 1, color: look.accent, opacity: p, transform: `scale(${0.85 + 0.15 * p})`, letterSpacing: nSize * 0.04 }}>{num}</div>
      <Ornament width={640} at={8} />
      <InkWords text={scene.text} size={tSize} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={16} />
      {scene.accentText && <InkWords text={scene.accentText} size={fit(scene.accentText, 64, W, 2, 0.46, 40)} color={look.accent} font={look.italic} weight={400} delay={30} />}
    </Page>
  );
};

/** A date stamped into the page: the year scrubs forward like a clock being wound, then lands with a ghost of misregistered ink. */
export const DateScene: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const art = useContext(ArtCtx);
  const frame = useCurrentFrame();
  const year = scene.value ?? parseInt(scene.text, 10);
  const valid = Number.isFinite(year);
  const bc = (scene.unit ?? '').toUpperCase().startsWith('B');
  const t = interpolate(frame, [0, 28], [0, 1], { ...clamp, easing: EASE_OUT });
  const shown = valid ? String(Math.max(0, Math.round(bc ? year + (1 - t) * 90 : year - (1 - t) * 90))) : scene.text;
  const size = fit(String(valid ? year : scene.text), 380, 800, 1, 0.66, 120);
  const ghost = interpolate(frame, [26, 44], [1, 0], clamp);
  const settle = interpolate(frame, [0, 10], [1.18, 1], { ...clamp, easing: EASE_OUT });
  return (
    <Page gap={20}>
      {scene.kicker && <Kicker text={scene.kicker} />}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 14, transform: `scale(${settle})` }}>
        <div style={{ position: 'relative', fontFamily: look.date, fontWeight: look.weight, fontSize: size, lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...(art ? foilText : { color: look.ink }) }}>
          {!art && <div style={{ position: 'absolute', left: 9, top: 9, color: look.accent, opacity: 0.4 * ghost }}>{shown}</div>}
          {shown}
        </div>
        {scene.unit && <div style={{ fontFamily: look.date, fontWeight: 600, fontSize: size * 0.26, color: look.accent, marginTop: size * 0.06, letterSpacing: size * 0.02 }}>{scene.unit.toUpperCase()}</div>}
      </div>
      <Ornament width={680} at={20} />
      {scene.accentText && <InkWords text={scene.accentText} size={fit(scene.accentText, 78, W, 3, 0.46, 44)} color={look.accent} font={look.italic} weight={400} delay={26} lh={1.12} />}
      {scene.text && !valid ? null : scene.accentText ? null : <InkWords text={scene.text} size={60} color={look.ink} font={look.body} delay={20} />}
    </Page>
  );
};

/** A vertical spine drawn down the page with an event at each node. */
export const Timeline: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const rows = (scene.items ?? []).slice(0, 5).map((it) => {
    const [y, ...rest] = it.split('|');
    return { year: y.trim(), label: rest.join('|').trim() };
  });
  const n = Math.max(1, rows.length);
  const rowH = Math.min(176, 880 / n);
  const step = Math.max(14, ((scene.durationInFrames - 60) / n) * 0.8);
  const spine = interpolate(frame, [10, 10 + step * n], [0, 1], { ...clamp, easing: Easing.linear });
  const tSize = fit(scene.text, 70, W, 2, look.k, 40);
  return (
    <Page gap={24} justify="center" card>
      <InkWords text={scene.text} size={tSize} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={2} />
      <div style={{ position: 'relative', width: W, height: rowH * n }}>
        <div style={{ position: 'absolute', left: 290, top: 18, width: 5, height: (rowH * n - 36) * spine, background: `linear-gradient(180deg, ${look.accent2}, ${look.accent})`, borderRadius: 3 }} />
        {rows.map((r, i) => {
          const at = 14 + i * step;
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE_OUT });
          const last = i === n - 1;
          const ySize = fit(r.year, 76, 250, 1, 0.66, 40);
          const lSize = fit(r.label, 56, 570, 2, 0.46, 34);
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: i * rowH, width: W, height: rowH, display: 'flex', alignItems: 'center', opacity: p }}>
              <div style={{ width: 262, textAlign: 'right', fontFamily: look.date, fontWeight: 600, fontSize: ySize, color: last ? look.accent : look.ink, transform: `translateX(${(1 - p) * -30}px)` }}>{r.year}</div>
              <div style={{ width: 66, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', border: `5px solid ${look.accent2}`, background: last ? look.accent : look.paper, transform: `scale(${0.4 + 0.6 * p})`, boxShadow: last ? `0 0 0 ${8 * p}px ${look.accent}33` : 'none' }} />
              </div>
              <div style={{ flex: 1, paddingLeft: 24, fontFamily: look.body, fontWeight: 700, fontSize: lSize, lineHeight: 1.12, color: look.ink, transform: `translateX(${(1 - p) * 40}px)` }}>{r.label}</div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

/** A hand-drawn map: invented coastlines, sea hatching, a graticule, a compass, and a route that is inked from place to place. */
export const MapScene: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const art = useContext(ArtCtx);
  const MW = art ? 840 : 880;
  const MH = art ? 520 : 700;
  const places = (scene.items ?? []).slice(0, 5).map((it) => {
    const [name, x, y] = it.split('|');
    return { name: name.trim(), x: 70 + (Math.min(100, Math.max(0, parseFloat(x) || 50)) / 100) * (MW - 140), y: 70 + (Math.min(100, Math.max(0, parseFloat(y) || 50)) / 100) * (MH - 140) };
  });
  const land = useMemo(() => {
    const r = rng(hash(scene.text) + 5);
    return Array.from({ length: 3 }, (_, b) => {
      const cx = 140 + r() * (MW - 280);
      const cy = 120 + r() * (MH - 240);
      const rad = 120 + r() * 130 + (b === 0 ? 40 : 0);
      const pts: [number, number][] = Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const rr = rad * (0.55 + r() * 0.75);
        return [Math.min(MW - 24, Math.max(24, cx + Math.cos(a) * rr * 1.25)), Math.min(MH - 24, Math.max(24, cy + Math.sin(a) * rr * 0.9))];
      });
      return smoothClosed(pts);
    });
  }, [scene.text]);
  const step = 20;
  const route = places.length > 1 ? places.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ') : '';
  const routeP = interpolate(frame, [18, 18 + step * places.length], [0, 1], clamp);
  const tSize = fit(scene.text, 62, W, 2, look.k, 38);
  const frameIn = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <Page gap={20} card>
      <InkWords text={scene.text} size={tSize} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={2} />
      <div style={{ opacity: frameIn, transform: `scale(${0.96 + 0.04 * frameIn})`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
        <svg width={MW} height={MH} viewBox={`0 0 ${MW} ${MH}`} style={{ display: 'block', background: look.dark ? `${look.paper}` : look.paper, border: `5px double ${look.ink}` }}>
          <defs>
            <pattern id="sea" width="16" height="9" patternUnits="userSpaceOnUse"><path d="M0 5 q4 -4 8 0 t8 0" fill="none" stroke={look.muted} strokeWidth="1.3" opacity="0.5" /></pattern>
          </defs>
          <rect width={MW} height={MH} fill="url(#sea)" />
          {Array.from({ length: 7 }, (_, i) => <line key={`v${i}`} x1={(i + 1) * (MW / 8)} y1={0} x2={(i + 1) * (MW / 8)} y2={MH} stroke={look.muted} strokeWidth={1.2} strokeDasharray="3 9" opacity={0.55} />)}
          {Array.from({ length: 6 }, (_, i) => <line key={`h${i}`} x1={0} y1={(i + 1) * (MH / 7)} x2={MW} y2={(i + 1) * (MH / 7)} stroke={look.muted} strokeWidth={1.2} strokeDasharray="3 9" opacity={0.55} />)}
          {land.map((d, i) => (
            <g key={i}>
              <path d={d} fill={look.paper2} stroke={look.ink} strokeWidth={6} strokeOpacity={0.12} transform="translate(5 6)" />
              <path d={d} fill={look.dark ? look.accent2 : look.paper} fillOpacity={look.dark ? 0.32 : 1} stroke={look.ink} strokeWidth={3} strokeLinejoin="round" />
            </g>
          ))}
          {route && <path d={route} pathLength={1} fill="none" stroke={look.accent} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: `${routeP} 2` }} opacity={0.95} />}
          {places.map((p, i) => {
            const at = 18 + i * step;
            const pop = spring({ frame: frame - at, fps: FPS, config: { damping: 11, stiffness: 190, mass: 0.6 } });
            const right = p.x < MW * 0.58;
            const size = fit(p.name, 38, 280, 1, 0.62, 24);
            return (
              <g key={i} opacity={Math.min(1, pop * 2)} transform={`translate(${p.x} ${p.y}) scale(${pop})`}>
                <circle r={30} fill={look.accent} opacity={0.18} />
                <circle r={13} fill={look.accent} stroke={look.paper} strokeWidth={4} />
                <text x={right ? 26 : -26} y={-18} textAnchor={right ? 'start' : 'end'} fontFamily={look.head} fontWeight={look.weight} fontSize={size} fill={look.ink} stroke={look.paper} strokeWidth={7} paintOrder="stroke" letterSpacing={1}>{look.caps ? p.name.toUpperCase() : p.name}</text>
              </g>
            );
          })}
          <g transform={`translate(${MW - 150} ${MH - 150})`}><foreignObject width={120} height={120}><Engraving name="compass" size={120} color={look.ink} accent={look.accent2} at={6} len={36} thick={2.2} /></foreignObject></g>
        </svg>
      </div>
      {scene.accentText && <InkWords text={scene.accentText} size={fit(scene.accentText, 54, W, 2, 0.46, 34)} color={look.accent} font={look.italic} weight={400} delay={24} />}
    </Page>
  );
};

export const Quote: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const mark = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: EASE_OUT });
  const size = fit(scene.text, 84, W - 30, 7, 0.46, 38);
  return (
    <Page gap={14} card>
      <div style={{ fontFamily: look.head, fontWeight: 900, fontSize: 340, lineHeight: 0.62, height: 150, color: look.accent, opacity: 0.9 * mark, transform: `translateY(${(1 - mark) * 24}px)`, alignSelf: 'flex-start', marginLeft: 6 }}>“</div>
      <InkWords text={scene.text} size={size} color={look.ink} font={look.italic} weight={400} align="left" delay={8} stagger={2} lh={1.18} />
      {scene.accentText && (
        <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, opacity: interpolate(frame, [scene.durationInFrames * 0.35, scene.durationInFrames * 0.35 + 16], [0, 1], clamp) }}>
          <div style={{ width: 80, height: 3, background: look.accent2 }} />
          <div style={{ fontFamily: look.date, fontWeight: 600, fontSize: fit(scene.accentText, 46, 720, 1, 0.74, 28), letterSpacing: 4, color: look.accent, textTransform: 'uppercase' }}>{scene.accentText}</div>
        </div>
      )}
    </Page>
  );
};

/** A figure counted up on an account-book page: ruled lines, a margin rule and a double underline. */
export const Ledger: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const value = Math.round(scene.value ?? 0);
  const t = interpolate(frame, [6, 50], [0, 1], { ...clamp, easing: EASE_OUT });
  const shown = Math.round(value * t).toLocaleString('en-US');
  const size = fit(value.toLocaleString('en-US'), 330, W, 1, 0.64, 110);
  const rules = interpolate(frame, [0, 24], [0, 1], clamp) * (useContext(ArtCtx) ? 0 : 1);
  return (
    <>
      <AbsoluteFill style={{ opacity: 0.42 * rules, backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent 70px, ${look.muted} 70px, ${look.muted} 72px)`, backgroundPosition: `0 ${CONTENT_TOP}px`, WebkitMaskImage: `linear-gradient(180deg, transparent ${CONTENT_TOP - 20}px, #000 ${CONTENT_TOP}px, #000 ${HEIGHT - SAFE_BOTTOM - CAPTION_SPACE}px, transparent ${HEIGHT - SAFE_BOTTOM - CAPTION_SPACE + 20}px)` }} />
      <div style={{ position: 'absolute', left: 120, top: CONTENT_TOP, height: CONTENT_H, width: 3, background: look.accent, opacity: 0.45 * rules }} />
      <Page gap={14}>
        <InkWords text={scene.text} size={fit(scene.text, 70, W, 2, 0.74, 34)} color={look.accent2 === look.accent ? look.ink : look.ink} font={look.date} weight={600} caps ls={4} delay={2} lh={1.15} />
        <div style={{ fontFamily: look.date, fontWeight: look.weight, fontSize: size, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums', opacity: interpolate(frame, [4, 12], [0, 1], clamp), ...(useContext(ArtCtx) ? foilText : { color: look.ink }) }}>{shown}</div>
        <Underline width={Math.min(W, shown.length * size * 0.6 + 40)} at={44} len={14} color={look.accent} thick={6} double />
        {scene.unit && <InkWords text={scene.unit} size={fit(scene.unit, 84, W, 2, 0.46, 40)} color={look.accent} font={look.italic} weight={400} delay={30} />}
        {scene.accentText && <InkWords text={scene.accentText} size={fit(scene.accentText, 62, W, 2, 0.46, 36)} color={look.muted === look.ink ? look.ink : look.ink} font={look.italic} weight={400} delay={38} />}
      </Page>
    </>
  );
};

/** Two heraldic banners that unfurl to the height of their figure. */
export const Versus: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const lv = scene.leftValue ?? 1;
  const rv = scene.rightValue ?? 1;
  const winner = scene.winner ?? (lv === rv ? 'none' : lv > rv ? 'left' : 'right');
  const max = Math.max(lv, rv, 1);
  const MAXH = 400;
  const grow = interpolate(frame, [10, 46], [0, 1], { ...clamp, easing: EASE_OUT });
  const side = (name: string, v: number, win: boolean, key: string) => {
    const h = Math.max(70, (v / max) * MAXH * grow);
    const col = win || winner === 'none' ? look.accent : look.muted;
    const nSize = fit(name, 58, 390, 2, look.k, 30);
    return (
      <div key={key} style={{ width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: MAXH + 380 }}>
        {win && <div style={{ opacity: interpolate(frame, [44, 56], [0, 1], clamp), marginBottom: 4 }}><Engraving name="crown" size={86} color={look.ink} accent={look.accent2} at={42} len={22} /></div>}
        <div style={{ fontFamily: look.date, fontWeight: 600, fontSize: fit(Math.round(v).toLocaleString('en-US'), 100, 420, 1, 0.64, 50), color: win ? look.accent : look.ink, marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>{Math.round(v * grow).toLocaleString('en-US')}</div>
        <svg width={250} height={h} viewBox={`0 0 250 ${h}`} style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.35))' }}>
          <path d={`M0 0 H250 V${h} L125 ${Math.max(0, h - 46)} L0 ${h} Z`} fill={col} />
          <path d={`M14 0 V${Math.max(0, h - 56)} M236 0 V${Math.max(0, h - 56)}`} stroke={look.paper} strokeOpacity={0.55} strokeWidth={3} fill="none" />
        </svg>
        <div style={{ marginTop: 14, fontFamily: look.head, fontWeight: look.weight, fontSize: nSize, lineHeight: 1.05, textAlign: 'center', color: look.ink, textTransform: look.caps ? 'uppercase' : 'none', height: 130 }}>{name}</div>
      </div>
    );
  };
  return (
    <Page gap={24} card>
      <InkWords text={scene.text} size={fit(scene.text, 70, W, 2, look.k, 40)} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={2} />
      <div style={{ display: 'flex', width: W, justifyContent: 'space-between' }}>
        {side(scene.left ?? 'Left', lv, winner === 'left', 'l')}
        {side(scene.right ?? 'Right', rv, winner === 'right', 'r')}
      </div>
    </Page>
  );
};

export const ListScene: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const items = (scene.items ?? []).slice(0, 4);
  const step = Math.max(14, Math.min(28, ((scene.durationInFrames - 50) / Math.max(1, items.length)) * 0.7));
  return (
    <Page gap={26} card>
      <InkWords text={scene.text} size={fit(scene.text, 84, W, 2, look.k, 44)} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: W }}>
        {items.map((it, i) => {
          const at = 16 + i * step;
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE_OUT });
          const s = fit(it, 60, 780, 2, 0.46, 36);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * 50}px)` }}>
              <div style={{ flex: '0 0 auto', width: 108, height: 108, borderRadius: '50%', border: `5px double ${look.accent2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: look.date, fontWeight: 600, fontSize: fit(ROMAN(i + 1), 52, 90, 1, 0.8, 26), color: look.accent }}>{ROMAN(i + 1)}</div>
              <div style={{ flex: 1, borderBottom: `3px solid ${look.accent2}55`, paddingBottom: 14, fontFamily: look.body, fontWeight: 700, fontSize: s, lineHeight: 1.12, color: look.ink }}>{it}</div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

const VERDICTS = {
  myth: { label: 'Myth', dark: '#E0574B', light: '#A3201D' },
  fact: { label: 'Fact', dark: '#5BB58A', light: '#2E6B4F' },
  partly: { label: 'Half true', dark: '#E3BC5C', light: '#A87618' },
} as const;
const VERDICT_ALIAS: Record<string, keyof typeof VERDICTS> = { myth: 'myth', fact: 'fact', partly: 'partly', buy: 'fact', wait: 'partly', skip: 'myth' };

export const Verdict: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const v = VERDICTS[VERDICT_ALIAS[scene.verdict ?? 'partly'] ?? 'partly'];
  const col = look.dark ? v.dark : v.light;
  return (
    <Page gap={52}>
      <Stamp text={v.label} color={col} size={fit(v.label, 190, 700, 1, 0.8, 90)} at={10} />
      <InkWords text={scene.text} size={fit(scene.text, 92, W, 3, look.k, 46)} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={24} />
      {scene.accentText && <InkWords text={scene.accentText} size={fit(scene.accentText, 68, W, 2, 0.46, 38)} color={look.accent} font={look.italic} weight={400} delay={36} />}
    </Page>
  );
};

/** An engraving or a public-domain photograph in a mounted frame, toned like old paper, with a caption plate. */
export const ImageScene: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: EASE_OUT });
  const k = interpolate(frame, [0, scene.durationInFrames], [1.02, 1.16], clamp);
  const FH = CONTENT_H - 200;
  return (
    <Page gap={26}>
      <div style={{ width: 900, height: FH, padding: 18, background: look.paper2, border: `6px double ${look.accent2}`, boxShadow: '0 22px 46px rgba(0,0,0,0.45)', opacity: p, transform: `scale(${0.95 + 0.05 * p}) rotate(${(1 - p) * -1.2}deg)` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: look.paper, border: `2px solid ${look.ink}` }}>
          {scene.mediaSrc ? (
            <Img src={staticFile(scene.mediaSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${k})`, filter: 'sepia(0.7) contrast(1.06) saturate(0.85) brightness(0.96)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Engraving name={scene.icon ?? pickIcon(scene.text, hash(scene.text))} size={Math.min(520, FH - 160)} color={look.ink} accent={look.accent2} at={6} /></div>
          )}
          <AbsoluteFill style={{ boxShadow: 'inset 0 0 120px rgba(40,22,6,0.55)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {scene.kicker && <Kicker text={scene.kicker} at={10} />}
        <InkWords text={scene.text} size={fit(scene.text, 62, W, 2, look.k, 36)} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={12} />
      </div>
    </Page>
  );
};

export const Flash: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const size = fit(scene.text, 280, W, 2, look.k, 90);
  const p = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <Page gap={20}>
      <div style={{ fontFamily: look.head, fontWeight: look.weight, fontSize: size, lineHeight: 1, textAlign: 'center', color: look.ink, textTransform: look.caps ? 'uppercase' : 'none', transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 2) }}>{scene.text}</div>
      <Underline width={Math.min(W, size * 0.5 * Math.min(scene.text.length, 9))} at={8} len={12} color={look.accent} thick={9} double />
    </Page>
  );
};

/** The closing page: a wax seal, a line of text and a two-option vote written on two tablets. */
export const Outro: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  const opts = (scene.items ?? []).slice(0, 2);
  return (
    <Page gap={34}>
      <Seal size={330} label="C" at={4} />
      <InkWords text={scene.text} size={fit(scene.text, 92, W, 3, look.k, 46)} color={look.ink} font={look.head} weight={look.weight} caps={look.caps} delay={14} />
      {scene.accentText && <InkWords text={scene.accentText} size={fit(scene.accentText, 62, W, 2, 0.46, 36)} color={look.accent} font={look.italic} weight={400} delay={24} />}
      {opts.length > 0 && (
        <div style={{ display: 'flex', gap: 28, width: W }}>
          {opts.map((o, i) => {
            const p = interpolate(frame, [30 + i * 10, 44 + i * 10], [0, 1], { ...clamp, easing: EASE_OUT });
            return (
              <div key={i} style={{ flex: 1, padding: '22px 18px', border: `4px double ${look.accent2}`, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 30}px)`, background: look.dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.35)' }}>
                <div style={{ fontFamily: look.date, fontSize: 40, color: look.accent, marginBottom: 6 }}>{ROMAN(i + 1)}</div>
                <div style={{ fontFamily: look.head, fontWeight: look.weight, fontSize: fit(o, 50, 380, 2, look.k, 28), color: look.ink, lineHeight: 1.1, textTransform: look.caps ? 'uppercase' : 'none' }}>{o}</div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ fontFamily: look.date, fontSize: 34, letterSpacing: 5, color: look.muted, opacity: interpolate(frame, [40, 56], [0, 1], clamp) }}>{CHANNEL}</div>
    </Page>
  );
};

/** A short marginal note that pops up when the narrator says its key term or figure. */
export const Callout: React.FC<{ scene: MotionScene }> = ({ scene }) => {
  const look = useLook();
  const frame = useCurrentFrame();
  if (!scene.callout || scene.calloutCue == null) return null;
  const at = Math.round(scene.calloutCue * FPS);
  const pop = spring({ frame: frame - at, fps: FPS, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const out = interpolate(frame, [at + 70, at + 84], [1, 0], clamp);
  if (frame < at || out <= 0) return null;
  return (
    <div style={{ position: 'absolute', right: 70, top: SAFE_TOP - 10, transform: `rotate(2.5deg) scale(${pop})`, opacity: out, padding: '10px 26px', background: look.paper, border: `3px solid ${look.accent}`, boxShadow: '0 10px 22px rgba(0,0,0,0.4)', fontFamily: look.italic, fontSize: fit(scene.callout, 50, 520, 1, 0.5, 28), color: look.accent, whiteSpace: 'nowrap' }}>{scene.callout}</div>
  );
};
