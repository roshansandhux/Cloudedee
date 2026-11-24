// REUSABLE EFFECTS. World-space ones are SVG (put them in Stage children/front);
// screen-space ones are HTML (put them in Stage `overlay`).
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {FONT, INK, PAPER} from '../lib/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Cartoon impact stars burst. t = frames since impact. */
export const ImpactStars: React.FC<{x: number; y: number; t: number; color?: string; s?: number}> = ({x, y, t, color = '#f6c945', s = 1}) => {
  if (t < 0 || t > 20) return null;
  const k = interpolate(t, [0, 4, 20], [0.3, 1.1, 0.9], clamp);
  const op = interpolate(t, [12, 20], [1, 0], clamp);
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s}) rotate(${t * 4})`} opacity={op}>
      <path d="M 0 -90 L 22 -30 L 85 -40 L 38 5 L 70 60 L 10 32 L -30 85 L -28 25 L -88 20 L -36 -18 L -60 -72 L -8 -40 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 0 -40 L 10 -12 L 38 -16 L 16 4 L 30 28 L 4 14 L -14 36 L -12 10 L -38 8 L -16 -8 L -26 -32 L -4 -18 Z" fill="#fff" />
    </g>
  );
};

/** Dust puffs (landing, running start). */
export const DustPuff: React.FC<{x: number; y: number; t: number; dir?: number; n?: number}> = ({x, y, t, dir = 0, n = 6}) => {
  if (t < 0 || t > 24) return null;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / (n - 1) - 0.5) * Math.PI * 0.9 + dir;
        const d = interpolate(t, [0, 24], [10, 90 + random(`d${i}`) * 40], clamp);
        const r = interpolate(t, [0, 8, 24], [8, 26, 6], clamp);
        return <circle key={i} cx={x + Math.sin(a) * d} cy={y - Math.abs(Math.cos(a)) * d * 0.35} r={r} fill="#f3eadb" stroke={INK} strokeWidth={3} opacity={interpolate(t, [14, 24], [1, 0], clamp)} />;
      })}
    </g>
  );
};

/** Sweat drop by a head (worry). */
export const SweatDrop: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  if (t < 0) return null;
  const dy = (t % 40) * 1.2;
  return <path d="M 0 -18 Q 13 4 0 12 Q -13 4 0 -18 Z" transform={`translate(${x} ${y + dy})`} fill="#8fd3ff" stroke={INK} strokeWidth={3} opacity={interpolate(t % 40, [30, 40], [1, 0], clamp)} />;
};

/** Motion lines behind something moving fast. dir: 1 = moving right. */
export const MotionLines: React.FC<{x: number; y: number; dir?: 1 | -1; frame: number; len?: number}> = ({x, y, dir = 1, frame, len = 160}) => (
  <g stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.55}>
    {[-60, -20, 20, 60].map((dy, i) => {
      const off = ((frame * 9 + i * 37) % 60) * dir;
      return <line key={i} x1={x - dir * 60 - off} y1={y + dy} x2={x - dir * (60 + len * (0.6 + 0.4 * random(`ml${i}`))) - off} y2={y + dy} />;
    })}
  </g>
);

/** Little twinkles (idea, magic, cleanliness). */
export const Sparkles: React.FC<{x: number; y: number; t: number; r?: number; color?: string}> = ({x, y, t, r = 90, color = '#fff3a0'}) => {
  if (t < 0 || t > 40) return null;
  return (
    <g>
      {Array.from({length: 6}).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + random(`sp${i}`);
        const d = r * (0.5 + random(`sd${i}`) * 0.6);
        const k = Math.sin(interpolate(t - i * 2, [0, 22], [0, Math.PI], clamp));
        return <path key={i} d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" transform={`translate(${x + Math.cos(a) * d} ${y + Math.sin(a) * d}) scale(${k * 1.3})`} fill={color} stroke={INK} strokeWidth={2.5} />;
      })}
    </g>
  );
};

/** Emote floating above a head: '!' '?' 'heart' 'anger' 'idea' 'zzz' '...' */
export const Emote: React.FC<{x: number; y: number; t: number; kind: '!' | '?' | 'heart' | 'anger' | 'idea' | 'zzz' | '...'; dur?: number}> = ({x, y, t, kind, dur = 45}) => {
  if (t < 0 || t > dur) return null;
  const pop = interpolate(t, [0, 5, 9], [0, 1.25, 1], clamp) * interpolate(t, [dur - 6, dur], [1, 0], clamp);
  const bob = Math.sin(t / 5) * 4;
  let el: React.ReactNode;
  switch (kind) {
    case '!':
      el = (
        <g fill="#e8553e" stroke={INK} strokeWidth={4}>
          <path d="M -10 -70 L 10 -70 L 6 -14 L -6 -14 Z" />
          <circle cy={4} r={9} />
        </g>
      );
      break;
    case '?':
      el = (
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={96} fill="#4f9dde" stroke={INK} strokeWidth={4} paintOrder="stroke">
          ?
        </text>
      );
      break;
    case 'heart':
      el = <path d="M 0 0 C -40 -30 -30 -70 0 -50 C 30 -70 40 -30 0 0 Z" fill="#ff6b8b" stroke={INK} strokeWidth={4} />;
      break;
    case 'anger':
      el = (
        <g stroke="#e8553e" strokeWidth={8} strokeLinecap="round" fill="none">
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M 10 -30 Q 10 -10 30 -10" transform={`rotate(${a} 0 -30) translate(0 0)`} />
          ))}
        </g>
      );
      break;
    case 'idea':
      el = (
        <g stroke={INK} strokeWidth={4}>
          <circle cy={-40} r={30} fill="#fff3a0" />
          <rect x={-14} y={-14} width={28} height={18} rx={4} fill="#c7c9d1" />
          {[-60, -30, 0, 30, 60].map((a) => (
            <line key={a} x1={0} y1={-85} x2={0} y2={-100} transform={`rotate(${a} 0 -40)`} strokeLinecap="round" />
          ))}
        </g>
      );
      break;
    case 'zzz':
      el = (
        <g fontFamily={FONT} fontWeight={700} fill="#7b5ea7" stroke={INK} strokeWidth={3} paintOrder="stroke">
          {[0, 1, 2].map((i) => (
            <text key={i} x={i * 26} y={-i * 34 - ((t + i * 10) % 30)} fontSize={34 + i * 10} opacity={interpolate((t + i * 10) % 30, [0, 25, 30], [1, 1, 0], clamp)}>
              z
            </text>
          ))}
        </g>
      );
      break;
    default:
      el = (
        <g fill={INK}>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-24 + i * 24} cy={-20} r={8} opacity={t > i * 8 ? 1 : 0} />
          ))}
        </g>
      );
  }
  return <g transform={`translate(${x} ${y + bob}) scale(${pop})`}>{el}</g>;
};

/** Screen-space: white flash. */
export const Flash: React.FC<{t: number; dur?: number; color?: string}> = ({t, dur = 8, color = '#fff'}) =>
  t < 0 || t > dur ? null : <AbsoluteFill style={{background: color, opacity: interpolate(t, [0, dur], [0.85, 0], clamp)}} />;

/** Screen-space: soft vignette for mood. */
export const Vignette: React.FC<{amount?: number}> = ({amount = 0.35}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(10,5,20,${amount}) 100%)`, pointerEvents: 'none'}} />
);

/** Screen-space: anime speed lines (comedic intensity). */
export const SpeedLines: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.5}) => (
  <AbsoluteFill style={{opacity}}>
    <svg width="100%" height="100%" viewBox="-960 -540 1920 1080" preserveAspectRatio="xMidYMid slice">
      {Array.from({length: 48}).map((_, i) => {
        const a = (i / 48) * Math.PI * 2 + random(`sl${i}${Math.floor(frame / 2)}`) * 0.08;
        const r0 = 420 + random(`sr${i}${Math.floor(frame / 2)}`) * 160;
        return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * 1400} y2={Math.sin(a) * 1400} stroke="#fff" strokeWidth={6 + (i % 3) * 4} />;
      })}
    </svg>
  </AbsoluteFill>
);

/** Iris wipe (classic cartoon ending). t: 0..1 closing. */
export const IrisWipe: React.FC<{t: number; x?: string; y?: string}> = ({t, x = '50%', y = '50%'}) => {
  const r = interpolate(t, [0, 1], [130, 0], clamp);
  return <AbsoluteFill style={{background: `radial-gradient(circle at ${x} ${y}, transparent ${r}%, #000 ${r + 0.3}%)`}} />;
};

/** Big comic sound-word ("BONK!") – screen space. */
export const SoundWord: React.FC<{text: string; t: number; x: number; y: number; color?: string; rot?: number; size?: number}> = ({text, t, x, y, color = '#f6c945', rot = -8, size = 120}) => {
  if (t < 0 || t > 30) return null;
  const s = interpolate(t, [0, 4, 8], [0.2, 1.2, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`,
        opacity: interpolate(t, [22, 30], [1, 0], clamp),
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color,
        WebkitTextStroke: `8px ${INK}`,
        paintOrder: 'stroke fill',
        whiteSpace: 'nowrap',
        letterSpacing: 2,
      }}
    >
      {text}
    </div>
  );
};

/** Title card for an episode / location ("Later that day..."). */
export const TitleCard: React.FC<{t: number; dur: number; title: string; kicker?: string; bg?: string}> = ({t, dur, title, kicker, bg = '#2b2333'}) => {
  const inn = interpolate(t, [0, 10], [0, 1], clamp);
  const out = interpolate(t, [dur - 10, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: bg, opacity: Math.min(inn, out), justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: FONT}}>
      {kicker && <div style={{color: '#f6c945', fontSize: 44, fontWeight: 600, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 12}}>{kicker}</div>}
      <div style={{color: PAPER, fontSize: 110, fontWeight: 700, transform: `scale(${0.9 + 0.1 * inn})`, textAlign: 'center', padding: '0 80px'}}>{title}</div>
    </AbsoluteFill>
  );
};

/** For Shorts/Reels: a "Full episode on YouTube" button. */
export const FullEpisodeButton: React.FC<{frame: number}> = ({frame}) => {
  const pulse = 1 + Math.sin(frame / 9) * 0.03;
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 90, transform: `translateX(-50%) scale(${pulse})`, display: 'flex', alignItems: 'center', gap: 18, background: '#ff0033', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 46, padding: '20px 40px', borderRadius: 60, boxShadow: '0 10px 28px rgba(0,0,0,0.35)', border: '5px solid #fff', whiteSpace: 'nowrap'}}>
      <svg width={54} height={38} viewBox="0 0 54 38">
        <rect width={54} height={38} rx={10} fill="#fff" />
        <path d="M 21 10 L 37 19 L 21 28 Z" fill="#ff0033" />
      </svg>
      Full episode on YouTube
    </div>
  );
};
