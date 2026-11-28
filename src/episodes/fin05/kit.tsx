// fin05 kit – NEW LOOK ("neon garage" era): Finn's new outfit, neon/glass motion-graphics style, car-world sets.
import React from 'react';
import {interpolate} from 'remotion';
import {FONT, INK} from '../../lib/theme';
import {lookOf} from '../../cast';
import type {Look} from '../../rig/looks';
import {Sky} from '../../sets/sets';
import {StreetLamp, Tree, Bush} from '../../props/props';
import {clamp, pop} from '../fin02/kit';

// ------------------------------------------------------------------ looks
/** Finn's fin05 restyle: orange bomber jacket, swoop hair, white sneakers, no bow tie. */
export const FINN_05: Look = {...lookOf('finn'), body: '#ff7a1a', legs: '#26304f', shoes: '#f4f1ea', outfit: 'coat', hair: 'swoop', hairColor: '#2a1a12', neck: 'collar', neckColor: '#1d2236', hat: 'none'};
export const RUTH_05: Look = {...lookOf('ruth'), body: '#5fb3a3', neckColor: '#ff7a8a'};
export const TYLER = lookOf('tyler');
export const VINNY = lookOf('vinny');

// ------------------------------------------------------------------ palette (neon)
export const NEON = {pink: '#ff4fd8', cyan: '#3ff0ff', lime: '#b6ff4a', orange: '#ff9a3c', violet: '#9b7bff', red: '#ff4a5e', gold: '#ffd84a'};
const GLASS = 'rgba(14,10,36,0.86)';

/** SVG glow filter defs (use filter="url(#nglow)"). */
export const NeonDefs: React.FC = () => (
  <defs>
    <filter id="nglow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="n-floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a2050" />
      <stop offset="1" stopColor="#0c0820" />
    </linearGradient>
  </defs>
);

/** Neon tube text in world space. */
export const NeonText: React.FC<{x: number; y: number; text: string; size?: number; color?: string; flicker?: number; rot?: number}> = ({x, y, text, size = 80, color = NEON.pink, flicker = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={flicker}>
    <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill="none" stroke={color} strokeWidth={size / 9} filter="url(#nglow)" strokeLinejoin="round">
      {text}
    </text>
    <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill="none" stroke="#fff" strokeWidth={size / 30} strokeLinejoin="round">
      {text}
    </text>
  </g>
);

// ------------------------------------------------------------------ screen-space graphics (glass + neon)
const fade = (t: number, dur: number) => interpolate(t, [dur - 8, dur], [1, 0], clamp);

/** Neon chapter chip (top-left). */
export const NeonChip: React.FC<{t: number; label: string; color?: string; dur?: number}> = ({t, label, color = NEON.cyan, dur = 150}) => {
  if (t < 0 || t > dur) return null;
  const a = pop(t, 12) * fade(t, dur);
  return (
    <div style={{position: 'absolute', left: 70, top: 64, transform: `translateX(${(1 - a) * -90}px)`, opacity: a, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT, fontWeight: 700, fontSize: 36, letterSpacing: 3, background: GLASS, color: '#fff', padding: '10px 28px 10px 20px', borderRadius: 999, border: `4px solid ${color}`, boxShadow: `0 0 22px ${color}, inset 0 0 14px ${color}55`, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>
      <span style={{width: 18, height: 18, borderRadius: 9, background: color, boxShadow: `0 0 12px ${color}`, opacity: 0.6 + 0.4 * Math.sin(t / 4)}} />
      {label}
    </div>
  );
};

/** Big glowing number/text. */
export const NeonStat: React.FC<{t: number; text: string; x: number | string; y: number | string; size?: number; color?: string; dur?: number; sub?: string; rot?: number}> = ({t, text, x, y, size = 120, color = NEON.cyan, dur = 99999, sub, rot = 0}) => {
  if (t < 0 || t > dur) return null;
  const s = pop(t, 10);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: fade(t, dur), textAlign: 'center', fontFamily: FONT}}>
      <div style={{fontWeight: 700, fontSize: size, color: '#fff', WebkitTextStroke: `${Math.round(size / 22)}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 0 18px ${color}, 0 0 44px ${color}, 0 6px 0 ${INK}`, whiteSpace: 'nowrap', lineHeight: 1}}>{text}</div>
      {sub && <div style={{display: 'inline-block', marginTop: 12, fontWeight: 700, fontSize: size * 0.3, color: INK, background: color, padding: '4px 18px', borderRadius: 12, border: `4px solid ${INK}`, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 2}}>{sub}</div>}
    </div>
  );
};

/** Glass card with a neon frame (screen space). */
export const GlassCard: React.FC<{t: number; dur?: number; x: number | string; y: number | string; w?: number; color?: string; title?: string; children: React.ReactNode; rot?: number}> = ({t, dur = 99999, x, y, w = 640, color = NEON.cyan, title, children, rot = 0}) => {
  if (t < 0 || t > dur) return null;
  const s = pop(t, 12);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: fade(t, dur), background: GLASS, border: `4px solid ${color}`, borderRadius: 26, boxShadow: `0 0 26px ${color}aa, inset 0 0 22px ${color}33, 10px 14px 0 rgba(0,0,0,0.35)`, overflow: 'hidden', fontFamily: FONT, color: '#fff'}}>
      {title && (
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 26px', fontWeight: 700, fontSize: 34, letterSpacing: 3, textTransform: 'uppercase', color, borderBottom: `3px solid ${color}66`, textShadow: `0 0 12px ${color}`}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 10px ${color}`}} />
          {title}
        </div>
      )}
      <div style={{padding: '16px 28px 20px', fontSize: 38, fontWeight: 600, lineHeight: 1.3}}>{children}</div>
    </div>
  );
};

/** One row in a GlassCard: label + value, with a bar that draws itself. */
export const BarRow: React.FC<{t: number; label: string; value: string; frac: number; color?: string; dim?: boolean}> = ({t, label, value, frac, color = NEON.cyan, dim}) => {
  if (t < 0) return null;
  const w = interpolate(t, [0, 24], [0, frac], clamp);
  return (
    <div style={{margin: '10px 0', opacity: dim ? 0.45 : pop(t, 8)}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34}}>
        <span>{label}</span>
        <span style={{color, textShadow: `0 0 10px ${color}`}}>{value}</span>
      </div>
      <div style={{height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.12)', marginTop: 6}}>
        <div style={{height: 16, width: `${w * 100}%`, borderRadius: 8, background: color, boxShadow: `0 0 12px ${color}`}} />
      </div>
    </div>
  );
};

/** Neon stamp (diagonal tag). */
export const NeonTag: React.FC<{t: number; text: string; x: number | string; y: number | string; color?: string; size?: number; rot?: number; dur?: number}> = ({t, text, x, y, color = NEON.red, size = 70, rot = -8, dur = 99999}) => {
  if (t < 0 || t > dur) return null;
  const s = interpolate(t, [0, 6], [2.2, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: interpolate(t, [0, 4], [0, 1], clamp) * fade(t, dur), border: `6px solid ${color}`, color: '#fff', borderRadius: 16, padding: '4px 26px', fontFamily: FONT, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', background: GLASS, boxShadow: `0 0 24px ${color}`, textShadow: `0 0 14px ${color}`, letterSpacing: 2}}>
      {text}
    </div>
  );
};

/** Full-screen colour grade for the new look (teal shadows, magenta highlights). */
export const NeonGrade: React.FC<{amount?: number; warm?: boolean}> = ({amount = 1, warm}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: warm ? 'linear-gradient(160deg, rgba(255,120,80,0.16), rgba(120,60,200,0.12))' : 'linear-gradient(160deg, rgba(255,60,200,0.14), rgba(40,220,255,0.12))', mixBlendMode: 'soft-light', opacity: amount}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(8,4,30,0.55) 100%)', opacity: amount}} />
  </>
);

/** Screen-space title card (new look). */
export const NeonTitle: React.FC<{t: number; dur: number; title: string; kicker?: string}> = ({t, dur, title, kicker}) => {
  if (t < 0 || t > dur) return null;
  const a = interpolate(t, [0, 8, dur - 8, dur], [0, 1, 1, 0], clamp);
  const s = pop(t, 14);
  return (
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 45%, #3a1460, #0b0620 70%)`, opacity: a, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
      {Array.from({length: 14}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 560 + i * i * 6 + ((t * 4) % 40), height: 3, background: NEON.pink, opacity: 0.35, boxShadow: `0 0 10px ${NEON.pink}`}} />
      ))}
      {kicker && <div style={{fontSize: 46, fontWeight: 700, letterSpacing: 10, color: NEON.cyan, textShadow: `0 0 18px ${NEON.cyan}`, transform: `scale(${s})`}}>{kicker}</div>}
      <div style={{maxWidth: 1500, textAlign: 'center', marginTop: 20, fontSize: 104, lineHeight: 1.05, fontWeight: 700, color: '#fff', textShadow: `0 0 20px ${NEON.pink}, 0 0 50px ${NEON.pink}, 0 8px 0 ${INK}`, transform: `scale(${s})`}}>{title}</div>
    </div>
  );
};

// ------------------------------------------------------------------ vehicles
const Wheel: React.FC<{x: number; y: number; r: number; spin?: number; rim?: string}> = ({x, y, r, spin = 0, rim = '#d8dce6'}) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <circle r={r} fill="#22222c" stroke={INK} strokeWidth={5} />
    <circle r={r * 0.58} fill={rim} stroke={INK} strokeWidth={4} />
    {[0, 72, 144, 216, 288].map((a) => (
      <line key={a} x1={0} y1={0} x2={0} y2={-r * 0.55} stroke={INK} strokeWidth={5} transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.14} fill={INK} />
  </g>
);

/** Tyler's giant lifted pickup "The Beast". (x,y) = ground under the middle. */
export const BeastTruck: React.FC<{x: number; y?: number; s?: number; frame?: number; moving?: boolean; color?: string}> = ({x, y = 900, s = 1, frame = 0, moving, color = '#b3202f'}) => {
  const spin = moving ? frame * 14 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={400} ry={34} fill="rgba(0,0,0,0.3)" stroke="none" />
      {/* lift kit */}
      <rect x={-300} y={-170} width={600} height={40} fill="#3a3a48" />
      {/* bed + cab */}
      <path d="M -380 -170 L -380 -330 L 20 -330 L 20 -440 Q 30 -480 80 -480 L 230 -480 Q 280 -480 310 -400 L 360 -330 Q 400 -320 400 -280 L 400 -170 Z" fill={color} />
      <path d="M 50 -330 L 50 -450 L 220 -450 Q 255 -450 280 -400 L 310 -330 Z" fill="#9fd4ff" />
      <line x1={160} y1={-450} x2={160} y2={-330} />
      <rect x={-380} y={-345} width={400} height={20} fill="#7a1420" />
      {/* chrome */}
      <rect x={340} y={-250} width={70} height={50} rx={8} fill="#e6e9f0" />
      <rect x={-395} y={-210} width={50} height={30} rx={6} fill="#e6e9f0" />
      <circle cx={380} cy={-300} r={16} fill="#fff6b0" />
      {/* light bar */}
      <rect x={40} y={-500} width={200} height={20} rx={6} fill="#ffe27a" />
      <text x={-180} y={-240} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
        THE BEAST
      </text>
      <Wheel x={-230} y={-95} r={95} spin={spin} rim="#f2c94c" />
      <Wheel x={250} y={-95} r={95} spin={spin} rim="#f2c94c" />
    </g>
  );
};

/** Long stretch limo; len = extra body length in px. */
export const Limo: React.FC<{x: number; y?: number; len: number; frame?: number; s?: number; color?: string}> = ({x, y = 900, len, frame = 0, s = 1, color = '#f4f1ea'}) => {
  const L = 260 + len;
  const spin = frame * 16;
  const wins = Math.max(1, Math.floor(len / 150));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={L / 2 + 150} ry={24} fill="rgba(0,0,0,0.3)" stroke="none" />
      <path d={`M ${-L / 2 - 130} -50 Q ${-L / 2 - 140} -120 ${-L / 2 - 80} -130 L ${-L / 2} -135 L ${-L / 2 + 30} -205 L ${L / 2 - 10} -205 L ${L / 2 + 60} -135 L ${L / 2 + 130} -125 Q ${L / 2 + 160} -110 ${L / 2 + 150} -50 Z`} fill={color} />
      {Array.from({length: wins + 1}, (_, i) => (
        <rect key={i} x={-L / 2 + 40 + i * ((L - 60) / (wins + 1))} y={-192} width={(L - 60) / (wins + 1) - 20} height={46} rx={6} fill="#2b2f45" />
      ))}
      <rect x={-L / 2 - 130} y={-90} width={L + 280} height={10} fill="#c9a93a" stroke="none" />
      <Wheel x={-L / 2 - 40} y={-45} r={48} spin={spin} />
      <Wheel x={L / 2 + 50} y={-45} r={48} spin={spin} />
      {len > 500 && <Wheel x={0} y={-45} r={48} spin={spin} />}
    </g>
  );
};

/** Generic modern car (new, shiny). */
export const ShinyCar: React.FC<{x: number; y?: number; s?: number; color?: string; frame?: number; moving?: boolean; flip?: boolean; bite?: number}> = ({x, y = 900, s = 1, color = '#3ff0ff', frame = 0, moving, flip, bite = 0}) => {
  const spin = moving ? frame * 18 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={270} ry={24} fill="rgba(0,0,0,0.28)" stroke="none" />
      <path d="M -270 -60 Q -275 -140 -200 -150 L -120 -160 Q -60 -250 40 -250 Q 130 -250 180 -165 L 250 -150 Q 280 -140 275 -60 Z" fill={color} />
      <path d="M -100 -165 Q -55 -225 10 -225 L 10 -165 Z" fill="#dff3ff" />
      <path d="M 35 -165 L 35 -225 Q 110 -225 150 -165 Z" fill="#dff3ff" />
      <path d="M -230 -110 Q 0 -130 240 -110" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={6} />
      <circle cx={255} cy={-115} r={14} fill="#fff6c2" />
      {/* bite marks (depreciation) */}
      {bite > 0 &&
        Array.from({length: Math.round(bite * 6)}, (_, i) => (
          <circle key={i} cx={-270 + i * 30} cy={-150 + (i % 2) * 20} r={30} fill="#1a1230" stroke="none" />
        ))}
      <Wheel x={-160} y={-55} r={55} spin={spin} />
      <Wheel x={160} y={-55} r={55} spin={spin} />
    </g>
  );
};

/** Grandma's 2009 station wagon "Betsy" (wood panels, puffs smoke). */
export const Betsy: React.FC<{x: number; y?: number; s?: number; frame?: number; puff?: number; flip?: boolean}> = ({x, y = 900, s = 1, frame = 0, puff = 0, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <ellipse cx={0} cy={0} rx={300} ry={24} fill="rgba(0,0,0,0.25)" stroke="none" />
    {puff > 0 &&
      [0, 1, 2].map((i) => {
        const k = ((frame + i * 14) % 42) / 42;
        return <circle key={i} cx={-320 - k * 120} cy={-60 - k * 60} r={20 + k * 40} fill="#c9c3d6" opacity={(1 - k) * puff} strokeWidth={3} />;
      })}
    <path d="M -290 -55 L -290 -210 Q -285 -240 -250 -240 L 120 -240 Q 160 -240 190 -170 L 270 -160 Q 300 -150 295 -55 Z" fill="#8fb8d8" />
    <rect x={-280} y={-150} width={440} height={60} fill="#a5703f" />
    <line x1={-140} y1={-150} x2={-140} y2={-90} strokeWidth={3} />
    <line x1={20} y1={-150} x2={20} y2={-90} strokeWidth={3} />
    {[-260, -130, 0].map((wx) => (
      <rect key={wx} x={wx} y={-225} width={110} height={60} rx={8} fill="#dff3ff" />
    ))}
    <path d="M 120 -225 L 120 -165 L 175 -165 Q 160 -220 130 -225 Z" fill="#dff3ff" />
    <rect x={-250} y={-262} width={300} height={14} rx={5} fill="#6b6f80" />
    <circle cx={280} cy={-110} r={13} fill="#fff6c2" />
    <rect x={250} y={-80} width={60} height={20} rx={6} fill="#cfd3dc" />
    <Wheel x={-180} y={-50} r={50} />
    <Wheel x={170} y={-50} r={50} />
  </g>
);

/** Small yellow used hatchback (Tyler's new car). */
export const Hatchback: React.FC<{x: number; y?: number; s?: number; frame?: number; moving?: boolean}> = ({x, y = 900, s = 1, frame = 0, moving}) => {
  const spin = moving ? frame * 18 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={210} ry={20} fill="rgba(0,0,0,0.25)" stroke="none" />
      <path d="M -200 -55 L -200 -170 Q -195 -230 -120 -235 L 40 -235 Q 90 -232 130 -160 L 190 -150 Q 215 -140 210 -55 Z" fill="#ffd84a" />
      <path d="M -175 -165 L -170 -210 L -30 -210 L -30 -165 Z" fill="#dff3ff" />
      <path d="M -10 -165 L -10 -210 L 40 -210 Q 75 -205 100 -165 Z" fill="#dff3ff" />
      <circle cx={195} cy={-110} r={12} fill="#fff6c2" />
      <rect x={-120} y={-120} width={70} height={10} rx={4} fill={INK} />
      <Wheel x={-120} y={-45} r={45} spin={spin} />
      <Wheel x={120} y={-45} r={45} spin={spin} />
    </g>
  );
};

// ------------------------------------------------------------------ creatures & props
/** The Depreciation Gremlin: small green value-eater with huge teeth and a tiny calculator. */
export const Gremlin: React.FC<{x: number; y: number; s?: number; frame: number; talk?: number; chew?: boolean; mood?: 'gleeful' | 'sulk' | 'scream'; flip?: boolean}> = ({x, y, s = 1, frame, talk = 0, chew, mood = 'gleeful', flip}) => {
  const bob = Math.sin(frame / 6) * 6;
  const jaw = Math.max(talk, chew ? Math.abs(Math.sin(frame / 3)) : 0);
  const blink = frame % 83 < 4;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${(flip ? -1 : 1) * s} ${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={110} rx={90} ry={14} fill="rgba(0,0,0,0.25)" stroke="none" />
      {/* feet */}
      <ellipse cx={-40} cy={100} rx={30} ry={16} fill="#5fbf3a" />
      <ellipse cx={40} cy={100} rx={30} ry={16} fill="#5fbf3a" />
      {/* ears */}
      <path d="M -70 -40 L -150 -110 L -60 -80 Z" fill="#7ad94c" />
      <path d="M 70 -40 L 150 -110 L 60 -80 Z" fill="#7ad94c" />
      {/* body/head blob */}
      <path d="M -90 20 Q -100 -90 0 -95 Q 100 -90 90 20 Q 95 100 0 100 Q -95 100 -90 20 Z" fill="#7ad94c" />
      <path d="M -50 40 Q 0 70 50 40 Q 40 90 0 92 Q -40 90 -50 40 Z" fill="#a9ef7f" stroke="none" />
      {/* eyes */}
      {[-34, 34].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy={-38} rx={24} ry={blink ? 3 : 28} fill="#fff7a0" />
          {!blink && <circle cx={ex + 4} cy={-34} r={10} fill={INK} />}
        </g>
      ))}
      {mood === 'sulk' && <path d="M -60 -74 L -12 -60 M 60 -74 L 12 -60" strokeWidth={7} />}
      {/* mouth + teeth */}
      <path d={`M -56 4 Q 0 ${16 + jaw * 40} 56 4 Q 0 ${-6} -56 4 Z`} fill="#3a1030" />
      {[-40, -20, 0, 20, 40].map((tx) => (
        <path key={tx} d={`M ${tx - 9} 4 L ${tx} ${22 + jaw * 10} L ${tx + 9} 4 Z`} fill="#fff" strokeWidth={3} />
      ))}
      {mood === 'scream' && <path d="M -30 -110 l -10 -30 M 0 -115 l 0 -34 M 30 -110 l 10 -30" strokeWidth={6} stroke="#fff" />}
      {/* arms */}
      <path d="M -85 20 Q -130 40 -120 70" fill="none" strokeWidth={10} stroke="#5fbf3a" />
      <path d="M 85 20 Q 130 40 120 70" fill="none" strokeWidth={10} stroke="#5fbf3a" />
    </g>
  );
};

export const RamenBowl: React.FC<{steam?: number}> = ({steam = 0}) => (
  <g stroke={INK} strokeWidth={3.5}>
    <path d="M -40 -10 L 40 -10 Q 36 30 0 32 Q -36 30 -40 -10 Z" fill="#f4f1ea" />
    <path d="M -38 -10 Q 0 -22 38 -10" fill="#f6c945" />
    <line x1={10} y1={-60} x2={30} y2={-12} strokeWidth={4} />
    <line x1={22} y1={-62} x2={36} y2={-12} strokeWidth={4} />
    {steam > 0 && <path d={`M -10 -24 q -10 -14 0 -28 q 10 -14 0 -28`} fill="none" stroke="#fff" strokeOpacity={0.6 * steam} />}
  </g>
);

export const Snorkel: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <rect x={-70} y={-30} width={140} height={60} rx={26} fill="rgba(160,230,255,0.55)" />
    <path d="M 70 0 L 92 0 L 92 -130" fill="none" strokeWidth={14} stroke="#ff7a1a" />
    <rect x={84} y={-150} width={18} height={24} rx={6} fill="#ff7a1a" />
  </g>
);

export const SavingsJar: React.FC<{x: number; y: number; s?: number; fill: number; label?: string}> = ({x, y, s = 1, fill, label = 'BETSY 2.0'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5}>
    <rect x={-90} y={-230} width={180} height={30} rx={8} fill="#c9a93a" />
    <path d="M -100 -200 L 100 -200 L 110 -10 Q 110 0 100 0 L -100 0 Q -110 0 -110 -10 Z" fill="rgba(220,240,255,0.55)" />
    <clipPath id="jarclip">
      <path d="M -100 -200 L 100 -200 L 110 -10 Q 110 0 100 0 L -100 0 Q -110 0 -110 -10 Z" />
    </clipPath>
    <g clipPath="url(#jarclip)">
      <rect x={-120} y={-200 * fill} width={240} height={200 * fill + 4} fill="#5fd38a" stroke="none" />
      {Array.from({length: Math.round(fill * 10)}, (_, i) => (
        <circle key={i} cx={-70 + (i * 37) % 150} cy={-14 - Math.floor(i / 4) * 34} r={16} fill="#ffd84a" strokeWidth={3} />
      ))}
    </g>
    <rect x={-80} y={-130} width={160} height={50} rx={8} fill="#fffaf1" />
    <text y={-95} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={INK} stroke="none">
      {label}
    </text>
  </g>
);

export const Cone: React.FC<{x: number; y?: number; s?: number; down?: number}> = ({x, y = 900, s = 1, down = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${down * 80}) scale(${s})`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-46} y={-14} width={92} height={14} rx={4} fill="#ff7a1a" />
    <path d="M -32 -14 L -8 -120 L 8 -120 L 32 -14 Z" fill="#ff7a1a" />
    <path d="M -24 -48 L 24 -48 L 20 -66 L -20 -66 Z" fill="#fff" />
  </g>
);

// ------------------------------------------------------------------ SETS
/** Neon garage studio (the new home set). */
export const NeonGarage: React.FC<{frame: number; sign?: string}> = ({frame, sign = 'FINNOMICS'}) => {
  const flick = frame % 211 < 3 ? 0.4 : 1;
  return (
    <g>
      <NeonDefs />
      <defs>
        <linearGradient id="ng-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1036" />
          <stop offset="1" stopColor="#2c1650" />
        </linearGradient>
        <pattern id="ng-brick" width="120" height="60" patternUnits="userSpaceOnUse">
          <path d="M 0 0 H 120 M 0 30 H 120 M 60 0 V 30 M 0 30 V 60" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="3" fill="none" />
        </pattern>
      </defs>
      <rect x={-500} y={-400} width={2920} height={1300} fill="url(#ng-wall)" />
      <rect x={-500} y={-400} width={2920} height={1300} fill="url(#ng-brick)" />
      {/* garage door (rolled up) behind with city night */}
      <rect x={1180} y={180} width={640} height={700} fill="#0b0a24" stroke={INK} strokeWidth={6} />
      {Array.from({length: 9}, (_, i) => (
        <rect key={i} x={1210 + i * 66} y={560 - ((i * 53) % 220)} width={50} height={320 + ((i * 53) % 220)} fill={['#2a2658', '#1f1c48', '#332c66'][i % 3]} />
      ))}
      {Array.from({length: 24}, (_, i) => (
        <rect key={i} x={1222 + (i * 71) % 590} y={600 - ((i * 37) % 260)} width={10} height={14} fill="#ffd84a" opacity={(i + Math.floor(frame / 40)) % 5 === 0 ? 0.2 : 0.8} />
      ))}
      <rect x={1170} y={150} width={660} height={56} fill="#3a3456" stroke={INK} strokeWidth={6} />
      {/* pegboard with tools */}
      <rect x={-60} y={200} width={460} height={340} rx={10} fill="#3b2a5e" stroke={INK} strokeWidth={5} />
      {Array.from({length: 40}, (_, i) => (
        <circle key={i} cx={-30 + (i % 10) * 44} cy={230 + Math.floor(i / 10) * 80} r={4} fill="#22183c" />
      ))}
      <g stroke={INK} strokeWidth={5} strokeLinejoin="round">
        <rect x={10} y={260} width={20} height={150} fill="#ff4a5e" />
        <rect x={-10} y={250} width={60} height={30} rx={6} fill="#b8bcc8" />
        <path d="M 110 250 L 130 420 M 150 250 L 130 420" fill="none" stroke="#b8bcc8" strokeWidth={10} />
        <circle cx={250} cy={320} r={50} fill="none" stroke="#3ff0ff" strokeWidth={10} />
        <rect x={320} y={260} width={40} height={180} rx={8} fill="#ffd84a" />
      </g>
      {/* neon sign */}
      <NeonText x={700} y={150} text={sign} size={110} color={NEON.pink} flicker={flick} />
      <NeonText x={700} y={240} text="money · cars · life" size={44} color={NEON.cyan} />
      {/* lightning bolt neon */}
      <path d="M 1000 300 L 960 380 L 1000 380 L 970 460" fill="none" stroke={NEON.lime} strokeWidth={10} filter="url(#nglow)" strokeLinejoin="round" />
      {/* floor */}
      <rect x={-500} y={880} width={2920} height={500} fill="url(#n-floor)" />
      <rect x={-500} y={876} width={2920} height={8} fill={NEON.cyan} opacity={0.8} filter="url(#nglow)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={960} y1={884} x2={-800 + i * 700} y2={1300} stroke={NEON.violet} strokeOpacity={0.25} strokeWidth={4} />
      ))}
      {/* reflections */}
      <ellipse cx={700} cy={940} rx={500} ry={30} fill={NEON.pink} opacity={0.08} />
      {/* tire stack */}
      <g stroke={INK} strokeWidth={5}>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={1950} cy={860 - i * 60} rx={110} ry={34} fill="#22222c" />
        ))}
      </g>
    </g>
  );
};

/** Big screen in the garage (world space) – a dark glass panel with neon frame; children positioned inside (0..w,0..h). */
export const GarageScreen: React.FC<{x: number; y: number; w: number; h: number; s?: number; color?: string; title?: string; children?: React.ReactNode}> = ({x, y, w, h, s = 1, color = NEON.cyan, title, children}) => (
  <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-w / 2} ${-h / 2})`}>
    <rect width={w} height={h} rx={28} fill="#0e0a24" stroke={color} strokeWidth={8} filter="url(#nglow)" />
    <rect width={w} height={h} rx={28} fill="#0e0a24" stroke={INK} strokeWidth={4} />
    <rect x={10} y={10} width={w - 20} height={h - 20} rx={20} fill="none" stroke={color} strokeOpacity={0.6} strokeWidth={3} />
    {title && (
      <text x={w / 2} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} letterSpacing={4} fill={color} filter="url(#nglow)">
        {title}
      </text>
    )}
    {children}
  </g>
);

/** Suburban driveway (night or morning) with Tyler's house. */
export const Driveway: React.FC<{frame: number; time?: 'night' | 'day' | 'sunset'}> = ({frame, time = 'night'}) => {
  const night = time === 'night';
  return (
    <g>
      <NeonDefs />
      <Sky time={time} frame={frame} id={`dw-${time}`} />
      {night &&
        Array.from({length: 30}, (_, i) => <circle key={i} cx={(i * 137) % 1920} cy={40 + ((i * 71) % 300)} r={2 + (i % 3)} fill="#fff" opacity={0.4 + 0.4 * Math.abs(Math.sin(frame / 30 + i))} />)}
      {/* house */}
      <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
        <rect x={-200} y={420} width={900} height={460} fill={night ? '#46528a' : '#8fb0e0'} />
        <path d="M -260 430 L 250 170 L 760 430 Z" fill={night ? '#3a2a4a' : '#a05a4a'} />
        <rect x={20} y={560} width={460} height={320} fill={night ? '#5a6aa0' : '#e9eef5'} />
        {Array.from({length: 6}, (_, i) => (
          <line key={i} x1={20} y1={600 + i * 48} x2={480} y2={600 + i * 48} strokeWidth={4} />
        ))}
        <rect x={560} y={540} width={110} height={110} fill={night ? '#ffd877' : '#bfe6ff'} />
        <line x1={615} y1={540} x2={615} y2={650} strokeWidth={4} />
      </g>
      {/* lawn + driveway */}
      <rect x={-500} y={880} width={2920} height={400} fill={night ? '#26402e' : '#6fbf5a'} />
      <path d="M -40 880 L 520 880 L 700 1300 L -300 1300 Z" fill={night ? '#5a5a6a' : '#c9c6c0'} stroke={INK} strokeWidth={5} />
      <Bush x={1500} y={890} s={1.2} />
      <Tree x={1780} y={890} s={1.3} frame={frame} />
      <StreetLamp x={1260} y={890} on={night} />
      {night && <ellipse cx={1260} cy={900} rx={260} ry={40} fill="#ffe8a0" opacity={0.18} />}
    </g>
  );
};

/** Vinny's Value Motors showroom. */
export const Showroom: React.FC<{frame: number; freeze?: boolean}> = ({frame, freeze}) => {
  const f = freeze ? 0 : frame;
  return (
    <g>
      <NeonDefs />
      <rect x={-500} y={-400} width={2920} height={1300} fill="#f6efe2" />
      {/* big windows */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={-60 + i * 520} y={140} width={480} height={560} fill="#bfe6ff" stroke={INK} strokeWidth={6} />
          <path d={`M ${-30 + i * 520} 170 L ${80 + i * 520} 170 L ${-30 + i * 520} 330 Z`} fill="#fff" opacity={0.5} />
        </g>
      ))}
      {/* banner */}
      <rect x={260} y={40} width={1400} height={90} rx={16} fill="#e5302f" stroke={INK} strokeWidth={6} />
      <text x={960} y={104} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={58} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
        VINNY'S VALUE MOTORS ★ BEST DEALS ★
      </text>
      {/* bunting */}
      {Array.from({length: 22}, (_, i) => (
        <path key={i} d={`M ${-100 + i * 100} 160 l 50 0 l -25 ${50 + Math.sin(f / 8 + i) * 6} z`} fill={['#e5302f', '#ffd84a', '#4f9dde'][i % 3]} stroke={INK} strokeWidth={3} />
      ))}
      {/* tube man */}
      <g transform={`translate(1780 880)`} stroke={INK} strokeWidth={5}>
        <path d={`M 0 0 Q ${Math.sin(f / 5) * 60} -150 ${Math.sin(f / 4) * 40} -320`} fill="none" stroke="#ff4fd8" strokeWidth={60} strokeLinecap="round" />
        <circle cx={Math.sin(f / 4) * 40} cy={-340} r={40} fill="#ff4fd8" />
        <circle cx={Math.sin(f / 4) * 40 - 12} cy={-348} r={6} fill={INK} />
        <circle cx={Math.sin(f / 4) * 40 + 12} cy={-348} r={6} fill={INK} />
      </g>
      {/* floor */}
      <rect x={-500} y={880} width={2920} height={400} fill="#e6dccb" />
      {Array.from({length: 16}, (_, i) => (
        <line key={i} x1={-500 + i * 200} y1={880} x2={-700 + i * 260} y2={1300} stroke="#cfc3ae" strokeWidth={4} />
      ))}
      <rect x={-500} y={876} width={2920} height={8} fill={INK} />
    </g>
  );
};

/** Sunset highway (road scrolls with `speed`). */
export const Highway: React.FC<{frame: number; speed?: number}> = ({frame, speed = 1}) => {
  const off = (frame * 30 * speed) % 240;
  return (
    <g>
      <NeonDefs />
      <Sky time="sunset" frame={frame} id="hw" />
      <circle cx={1450} cy={520} r={170} fill="#ffcf6a" opacity={0.9} />
      {Array.from({length: 7}, (_, i) => (
        <rect key={i} x={1280} y={470 + i * 26} width={340} height={8} fill="#ff7a6a" opacity={0.7} />
      ))}
      {/* hills */}
      <path d="M -500 700 Q 0 560 500 690 T 1500 670 T 2500 690 L 2500 900 L -500 900 Z" fill="#7a3a7a" />
      <path d="M -500 760 Q 200 660 800 760 T 2400 740 L 2400 900 L -500 900 Z" fill="#4a2a6a" />
      {/* palm silhouettes */}
      {[200, 900, 1700].map((px, i) => (
        <g key={i} transform={`translate(${((px - frame * 6 * speed) % 2600 + 2600) % 2600 - 300} 820)`} fill="#2a1a3a">
          <rect x={-8} y={-260} width={16} height={260} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx={0} cy={-260} rx={90} ry={16} transform={`rotate(${a} 0 -260) translate(60 0)`} />
          ))}
        </g>
      ))}
      {/* road */}
      <rect x={-500} y={820} width={2920} height={480} fill="#2c2a3a" />
      <rect x={-500} y={816} width={2920} height={8} fill="#e6e0d0" />
      {Array.from({length: 14}, (_, i) => (
        <rect key={i} x={-500 + i * 240 - off} y={960} width={130} height={14} rx={6} fill="#ffd84a" />
      ))}
      <rect x={-500} y={1050} width={2920} height={8} fill="#e6e0d0" />
    </g>
  );
};

/** Loan drive-thru restaurant ("LOAN-A-RAMA") with menu board. */
export const DriveThru: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <NeonDefs />
    <Sky time="sunset" frame={frame} id="dt" />
    <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
      <rect x={-200} y={380} width={1000} height={500} fill="#ffcf6a" />
      <rect x={-220} y={330} width={1040} height={80} fill="#e5302f" />
      {Array.from({length: 13}, (_, i) => (
        <path key={i} d={`M ${-220 + i * 80} 410 q 40 40 80 0`} fill={i % 2 ? '#fff' : '#e5302f'} />
      ))}
      <rect x={480} y={520} width={240} height={200} fill="#bfe6ff" />
      <rect x={20} y={560} width={300} height={320} fill="#7a3b1e" />
    </g>
    <NeonText x={300} y={300} text="LOAN-A-RAMA" size={100} color={NEON.orange} />
    <NeonText x={300} y={210} text="drive-thru • open 24/7 • no thinking required" size={34} color={NEON.cyan} />
    <rect x={-500} y={880} width={2920} height={400} fill="#3a3848" />
    {Array.from({length: 10}, (_, i) => (
      <rect key={i} x={-400 + i * 300} y={1000} width={150} height={12} fill="#e6e0d0" />
    ))}
  </g>
);

/** Drive-thru menu board (world). highlight: 0 none, 1..3 row highlighted. */
export const MenuBoard: React.FC<{x: number; y: number; s?: number; frame: number; highlight?: number}> = ({x, y, s = 1, frame, highlight = 0}) => {
  const rows = [
    ['🍔', 'NEW CAR COMBO', '~7% APR', NEON.lime],
    ['🍟', 'USED CAR MEAL', '~11% APR', NEON.gold],
    ['🌶️', 'BAD-CREDIT SUPERSIZE', '20%+ APR', NEON.red],
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-20} y={0} width={40} height={420} fill="#3a3456" stroke={INK} strokeWidth={5} />
      <rect x={-330} y={-360} width={660} height={400} rx={24} fill="#120c2c" stroke={INK} strokeWidth={6} />
      <rect x={-318} y={-348} width={636} height={376} rx={18} fill="none" stroke={NEON.orange} strokeWidth={5} filter="url(#nglow)" />
      <text x={0} y={-290} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} letterSpacing={4} fill={NEON.orange}>
        TODAY'S RATES
      </text>
      {rows.map(([e, name, rate, c], i) => {
        const hi = highlight === i + 1;
        return (
          <g key={i} transform={`translate(0 ${-210 + i * 100})`} opacity={highlight && !hi ? 0.5 : 1}>
            {hi && <rect x={-300} y={-50} width={600} height={84} rx={14} fill={c} opacity={0.18 + 0.1 * Math.sin(frame / 4)} />}
            <text x={-280} y={8} fontSize={44}>
              {e}
            </text>
            <text x={-220} y={6} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#fff">
              {name}
            </text>
            <text x={290} y={6} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={38} fill={c}>
              {rate}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** Drive-thru speaker post (Swipe sits on top in the scene). */
export const SpeakerPost: React.FC<{x: number; y?: number}> = ({x, y = 900}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={5}>
    <rect x={-14} y={-300} width={28} height={300} fill="#6b6f80" />
    <rect x={-90} y={-420} width={180} height={140} rx={20} fill="#e5302f" />
    {Array.from({length: 4}, (_, i) => (
      <line key={i} x1={-60} y1={-390 + i * 26} x2={60} y2={-390 + i * 26} strokeWidth={6} />
    ))}
  </g>
);

/** Car lot at dusk (gremlin scene). */
export const CarLot: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <NeonDefs />
    <Sky time="sunset" frame={frame} id="lot" />
    <rect x={-500} y={600} width={2920} height={300} fill="#2a2148" />
    {Array.from({length: 8}, (_, i) => (
      <g key={i}>
        <line x1={-200 + i * 320} y1={560} x2={-200 + i * 320} y2={880} stroke="#c9c6d6" strokeWidth={6} />
        <circle cx={-200 + i * 320} cy={550} r={18} fill="#ffe8a0" />
      </g>
    ))}
    {Array.from({length: 30}, (_, i) => (
      <path key={i} d={`M ${-300 + i * 90} 580 l 45 0 l -22 40 z`} fill={['#e5302f', '#ffd84a', '#4f9dde'][i % 3]} stroke={INK} strokeWidth={2} />
    ))}
    <path d="M -300 578 L 2400 578" stroke={INK} strokeWidth={3} />
    <NeonText x={1500} y={460} text="DRIVE IT OFF THE LOT!" size={64} color={NEON.gold} />
    <rect x={-500} y={880} width={2920} height={400} fill="#3a3848" />
    {Array.from({length: 12}, (_, i) => (
      <line key={i} x1={-400 + i * 260} y1={880} x2={-500 + i * 280} y2={1080} stroke="#e6e0d0" strokeWidth={6} />
    ))}
  </g>
);

/** Underwater world (negative equity). */
export const Underwater: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <defs>
      <linearGradient id="uw-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3fb7e0" />
        <stop offset="1" stopColor="#0f3a6a" />
      </linearGradient>
    </defs>
    <rect x={-500} y={-400} width={2920} height={1700} fill="url(#uw-bg)" />
    {/* surface */}
    <path d={`M -500 60 ${Array.from({length: 30}, (_, i) => `Q ${-450 + i * 100} ${40 + Math.sin(frame / 10 + i) * 10} ${-400 + i * 100} 60`).join(' ')}`} fill="none" stroke="#bff3ff" strokeWidth={6} opacity={0.8} />
    {/* light rays */}
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M ${200 + i * 380} 60 L ${120 + i * 380 + Math.sin(frame / 40 + i) * 30} 900 L ${260 + i * 380 + Math.sin(frame / 40 + i) * 30} 900 L ${280 + i * 380} 60 Z`} fill="#fff" opacity={0.07} />
    ))}
    {/* seaweed */}
    {Array.from({length: 12}, (_, i) => (
      <path key={i} d={`M ${-200 + i * 190} 900 q ${20 + Math.sin(frame / 12 + i) * 20} -80 0 -160 q ${-20 + Math.sin(frame / 12 + i) * 20} -80 0 -160`} fill="none" stroke="#2f9e5a" strokeWidth={18} strokeLinecap="round" />
    ))}
    {/* fish */}
    {[0, 1, 2].map((i) => {
      const fx = ((frame * (2 + i) + i * 700) % 2600) - 300;
      return (
        <g key={i} transform={`translate(${fx} ${260 + i * 140})`} stroke={INK} strokeWidth={4}>
          <ellipse rx={40} ry={22} fill={['#ffd84a', '#ff7a6a', '#b6ff4a'][i]} />
          <path d="M -40 0 L -70 -20 L -70 20 Z" fill={['#ffd84a', '#ff7a6a', '#b6ff4a'][i]} />
          <circle cx={20} cy={-5} r={5} fill={INK} />
        </g>
      );
    })}
    {/* bubbles */}
    {Array.from({length: 26}, (_, i) => {
      const by = 900 - ((frame * (3 + (i % 4)) + i * 97) % 900);
      return <circle key={i} cx={(i * 173) % 1920 + Math.sin(frame / 10 + i) * 10} cy={by} r={6 + (i % 4) * 4} fill="none" stroke="#dff8ff" strokeWidth={3} opacity={0.7} />;
    })}
    <rect x={-500} y={890} width={2920} height={400} fill="#d8c08a" />
    <path d="M -500 890 Q 0 870 500 892 T 1500 885 T 2500 892" fill="none" stroke={INK} strokeWidth={5} />
  </g>
);

/** Gas station at sunset. price ticks with `tick`. */
export const GasStation: React.FC<{frame: number; tick?: number}> = ({frame, tick = 0}) => (
  <g>
    <NeonDefs />
    <Sky time="sunset" frame={frame} id="gas" />
    <rect x={-500} y={880} width={2920} height={400} fill="#4a4658" />
    <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
      {/* canopy */}
      <rect x={-100} y={200} width={1700} height={100} fill="#f4f1ea" />
      <rect x={-100} y={270} width={1700} height={30} fill="#e5302f" />
      <rect x={100} y={300} width={50} height={580} fill="#c9c6d6" />
      <rect x={1350} y={300} width={50} height={580} fill="#c9c6d6" />
      {/* pumps */}
      {[500, 950].map((px, i) => (
        <g key={i} transform={`translate(${px} 880)`}>
          <rect x={-90} y={-360} width={180} height={360} rx={16} fill={i ? '#4f9dde' : '#e5302f'} />
          <rect x={-66} y={-320} width={132} height={90} rx={8} fill="#120c2c" />
          <text x={0} y={-262} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={NEON.lime} stroke="none">
            ${(tick * (i ? 1.3 : 1)).toFixed(2)}
          </text>
          <path d="M 90 -200 q 50 0 50 60 l 0 80" fill="none" strokeWidth={10} />
        </g>
      ))}
    </g>
    <NeonText x={760} y={168} text="GAS · SNACKS · REGRET" size={56} color={NEON.cyan} />
    {/* price sign */}
    <g transform="translate(1750 880)" stroke={INK} strokeWidth={5}>
      <rect x={-14} y={-420} width={28} height={420} fill="#6b6f80" />
      <rect x={-130} y={-640} width={260} height={230} rx={16} fill="#120c2c" />
      <text x={0} y={-570} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff" stroke="none">
        REGULAR
      </text>
      <text x={0} y={-490} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill={NEON.gold} stroke="none">
        $3.49
      </text>
    </g>
  </g>
);

/** Observatory dome at night (future money). */
export const Observatory: React.FC<{frame: number; open?: number}> = ({frame, open = 1}) => (
  <g>
    <NeonDefs />
    <rect x={-500} y={-400} width={2920} height={1700} fill="#070720" />
    {Array.from({length: 120}, (_, i) => (
      <circle key={i} cx={(i * 211) % 2400 - 240} cy={(i * 97) % 760} r={1.5 + (i % 4)} fill="#fff" opacity={(0.3 + 0.6 * Math.abs(Math.sin(frame / 25 + i))) * open} />
    ))}
    <path d="M -200 0 Q 300 200 800 120 T 2200 160" fill="none" stroke={NEON.violet} strokeOpacity={0.25} strokeWidth={120} />
    {/* dome frame */}
    <path d={`M -500 900 L -500 -400 L ${700 - open * 500} -400 Q ${700 - open * 500} 300 -500 520 Z`} fill="#1c1838" stroke={INK} strokeWidth={6} />
    <path d={`M 2420 900 L 2420 -400 L ${1220 + open * 500} -400 Q ${1220 + open * 500} 300 2420 520 Z`} fill="#1c1838" stroke={INK} strokeWidth={6} />
    {/* telescope */}
    <g transform="translate(1400 880)" stroke={INK} strokeWidth={6} strokeLinejoin="round">
      <path d="M -120 0 L 0 -240 L 120 0" fill="none" strokeWidth={12} />
      <g transform="translate(0 -260) rotate(-32)">
        <rect x={-260} y={-50} width={520} height={100} rx={20} fill="#c9c6d6" />
        <rect x={240} y={-64} width={60} height={128} rx={12} fill="#ff7a1a" />
        <rect x={-300} y={-36} width={50} height={72} rx={10} fill="#3a3456" />
      </g>
    </g>
    <rect x={-500} y={880} width={2920} height={400} fill="#1a1630" />
    <rect x={-500} y={876} width={2920} height={6} fill={NEON.violet} opacity={0.6} />
  </g>
);

/** Grandma's sunny street + cottage. */
export const RuthStreet: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <Sky time="day" frame={frame} id="ruth" />
    <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
      <rect x={-100} y={460} width={760} height={420} fill="#f6e2c8" />
      <path d="M -160 470 L 280 230 L 720 470 Z" fill="#5fb3a3" />
      <rect x={240} y={640} width={130} height={240} fill="#b35a4a" />
      {[40, 470].map((wx) => (
        <g key={wx}>
          <rect x={wx} y={560} width={130} height={120} fill="#bfe6ff" />
          <rect x={wx - 10} y={680} width={150} height={30} fill="#ff7a8a" />
        </g>
      ))}
    </g>
    {/* picket fence + flowers */}
    {Array.from({length: 26}, (_, i) => (
      <path key={i} d={`M ${800 + i * 50} 880 l 0 -120 l 18 -22 l 18 22 l 0 120 z`} fill="#fffaf1" stroke={INK} strokeWidth={3} />
    ))}
    <rect x={790} y={800} width={1320} height={14} fill="#fffaf1" stroke={INK} strokeWidth={3} />
    <rect x={-500} y={880} width={2920} height={400} fill="#7cc45f" />
    <path d="M 600 880 L 1500 880 L 1700 1300 L 400 1300 Z" fill="#cfcac0" stroke={INK} strokeWidth={5} />
    <Tree x={-180} y={890} s={1.3} frame={frame} />
  </g>
);

/** Driving-school parking lot with rule signs. */
export const DrivingSchool: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <NeonDefs />
    <Sky time="day" frame={frame} id="ds" />
    <path d="M -500 760 Q 300 640 1000 740 T 2400 720 L 2400 900 L -500 900 Z" fill="#8fd16a" />
    <rect x={-500} y={860} width={2920} height={440} fill="#5a5868" />
    {Array.from({length: 10}, (_, i) => (
      <rect key={i} x={-300 + i * 260} y={1000} width={20} height={200} fill="#f4f1ea" transform={`skewX(-30)`} />
    ))}
    <g transform="translate(320 860)" stroke={INK} strokeWidth={5}>
      <rect x={-10} y={-400} width={20} height={400} fill="#6b6f80" />
      <rect x={-260} y={-560} width={520} height={170} rx={20} fill="#2f9e5a" />
      <text x={0} y={-480} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#fff" stroke="none">
        FINN'S DRIVING
      </text>
      <text x={0} y={-425} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#ffd84a" stroke="none">
        (AND BUYING) SCHOOL
      </text>
    </g>
  </g>
);

/** Carnival carousel with cars instead of horses. */
export const Carousel: React.FC<{frame: number; spin: number}> = ({frame, spin}) => (
  <g>
    <NeonDefs />
    <rect x={-500} y={-400} width={2920} height={1700} fill="#1c0f3a" />
    {Array.from({length: 40}, (_, i) => (
      <circle key={i} cx={(i * 211) % 2400 - 240} cy={(i * 59) % 500} r={2 + (i % 3)} fill="#fff" opacity={0.6} />
    ))}
    {/* ferris wheel bg */}
    <g transform="translate(1650 420)" opacity={0.5}>
      <circle r={300} fill="none" stroke={NEON.cyan} strokeWidth={8} filter="url(#nglow)" />
      {Array.from({length: 12}, (_, i) => (
        <line key={i} x1={0} y1={0} x2={300 * Math.cos(i * 0.52 + frame / 80)} y2={300 * Math.sin(i * 0.52 + frame / 80)} stroke={NEON.cyan} strokeWidth={4} />
      ))}
    </g>
    <rect x={-500} y={880} width={2920} height={400} fill="#2a1a4a" />
    {/* carousel */}
    <g transform="translate(900 0)" stroke={INK} strokeWidth={6} strokeLinejoin="round">
      <path d="M -620 260 L 0 60 L 620 260 Z" fill="#e5302f" />
      {Array.from({length: 12}, (_, i) => (
        <path key={i} d={`M ${-620 + i * 103} 260 q 52 40 103 0`} fill={i % 2 ? '#ffd84a' : '#fff'} />
      ))}
      {Array.from({length: 13}, (_, i) => (
        <circle key={i} cx={-620 + i * 103} cy={262} r={10} fill={(i + Math.floor(frame / 6)) % 2 ? NEON.gold : '#fff'} filter="url(#nglow)" />
      ))}
      <rect x={-30} y={260} width={60} height={600} fill="#ffd84a" />
      <ellipse cx={0} cy={880} rx={640} ry={60} fill="#7a3b9a" />
      <NeonText x={0} y={200} text="LEASE-GO-ROUND" size={56} color={NEON.pink} />
    </g>
  </g>
);

/** Car-wash tunnel. foam 0..1, spin rollers. */
export const CarWash: React.FC<{frame: number; foam?: number}> = ({frame, foam = 0}) => (
  <g>
    <NeonDefs />
    <rect x={-500} y={-400} width={2920} height={1700} fill="#141a3a" />
    {/* tunnel arches */}
    {Array.from({length: 5}, (_, i) => (
      <path key={i} d={`M ${-200 + i * 520} 900 L ${-200 + i * 520} 200 Q ${60 + i * 520} 60 ${320 + i * 520} 200 L ${320 + i * 520} 900`} fill="none" stroke={[NEON.cyan, NEON.pink, NEON.lime, NEON.gold, NEON.violet][i]} strokeWidth={10} filter="url(#nglow)" />
    ))}
    {/* rollers */}
    {[260, 1660].map((rx, i) => (
      <g key={i} transform={`translate(${rx} 560)`}>
        <rect x={-70} y={-330} width={140} height={660} rx={60} fill={i ? '#3f8fff' : '#ff4fd8'} stroke={INK} strokeWidth={6} />
        {Array.from({length: 10}, (_, k) => (
          <line key={k} x1={-70} y1={-300 + ((k * 66 + frame * 12) % 640)} x2={70} y2={-300 + ((k * 66 + frame * 12) % 640)} stroke="#fff" strokeOpacity={0.6} strokeWidth={8} />
        ))}
      </g>
    ))}
    <rect x={-500} y={880} width={2920} height={400} fill="#2a3058" />
    {/* foam */}
    {foam > 0 &&
      Array.from({length: 40}, (_, i) => (
        <circle key={i} cx={(i * 97) % 1920} cy={880 - ((i * 53) % 260) * foam + Math.sin(frame / 8 + i) * 6} r={30 + (i % 5) * 12} fill="#fff" stroke="#c8e8ff" strokeWidth={3} opacity={0.85 * foam} />
      ))}
    <NeonText x={960} y={150} text="SQUEAKY-CLEAN CAR WASH" size={66} color={NEON.cyan} />
  </g>
);

/** World-space value tag over a car. */
export const ValueTag: React.FC<{x: number; y: number; value: number; s?: number; color?: string}> = ({x, y, value, s = 1, color = NEON.lime}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-50} width={340} height={100} rx={20} fill="#120c2c" stroke={INK} strokeWidth={5} />
    <rect x={-160} y={-40} width={320} height={80} rx={14} fill="none" stroke={color} strokeWidth={4} filter="url(#nglow)" />
    <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={60} fill="#fff">
      ${Math.round(value).toLocaleString('en-US')}
    </text>
  </g>
);
