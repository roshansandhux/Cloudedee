// fin03 kit – "How to Get Rich in Canada" – Canadian winter sets, Gordon the Tax Moose, Bernie the Beaver.
// Everything drawn in code (flat vector, #2b2333 outlines, soft gradients). Reuses fin02/kit helpers.
import React from 'react';
import {interpolate} from 'remotion';
import {FONT, INK, PAPER} from '../../lib/theme';
import {lookOf} from '../../cast';
import type {Look} from '../../rig/looks';
import {Sky} from '../../sets/sets';
import {clamp} from '../fin02/kit';

// ------------------------------------------------------------------ looks
export const FINN_CA: Look = {...lookOf('finn'), body: '#d8323a', outfit: 'hoodie', hat: 'beanie', hatColor: '#f4f1ea', neck: 'none'};
export const RUTH_CA: Look = {...lookOf('ruth'), body: '#7b5ea7', outfit: 'coat', neck: 'scarf', neckColor: '#e8553e'};

const rnd = (i: number, seed = 1) => {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/** Falling snow (world space). */
export const Snowfall: React.FC<{frame: number; n?: number; speed?: number; wind?: number; opacity?: number}> = ({frame, n = 50, speed = 1, wind = 0.4, opacity = 0.9}) => (
  <g opacity={opacity}>
    {Array.from({length: n}, (_, i) => {
      const r = 2.5 + rnd(i) * 5;
      const y = ((rnd(i, 2) * 1300 + frame * (1.6 + rnd(i, 3) * 1.6) * speed) % 1300) - 120;
      const x = ((rnd(i, 4) * 2600 + frame * wind * speed * 2 + Math.sin(frame / 22 + i) * 18) % 2600) - 340;
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" />;
    })}
  </g>
);

export const MapleLeaf: React.FC<{x: number; y: number; s?: number; color?: string; rot?: number}> = ({x, y, s = 1, color = '#e5302f', rot = 0}) => (
  <path
    transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
    d="M 0 -50 L 9 -32 L 20 -36 L 16 -10 L 34 -24 L 30 -14 L 46 -10 L 38 2 L 44 8 L 18 14 L 22 24 L 3 20 L 3 46 L -3 46 L -3 20 L -22 24 L -18 14 L -44 8 L -38 2 L -46 -10 L -30 -14 L -34 -24 L -16 -10 L -20 -36 L -9 -32 Z"
    fill={color}
    stroke={INK}
    strokeWidth={3 / s}
    strokeLinejoin="round"
  />
);

export const Pine: React.FC<{x: number; y: number; s?: number; snow?: boolean; color?: string}> = ({x, y, s = 1, snow = true, color = '#2f7a5a'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={4 / s} strokeLinejoin="round">
    <rect x={-12} y={-40} width={24} height={40} fill="#6b4d3a" />
    <path d="M 0 -300 L 70 -170 L 35 -170 L 100 -40 L -100 -40 L -35 -170 L -70 -170 Z" fill={color} />
    {snow && <path d="M 0 -300 L 30 -245 Q 0 -232 -30 -245 Z M -60 -150 Q -20 -140 10 -160 Q 40 -140 70 -130 L 50 -170 L -50 -170 Z" fill="#fff" />}
  </g>
);

const Treeline: React.FC<{y: number; color?: string; seed?: number; s?: number}> = ({y, color = '#3d6f72', seed = 1, s = 0.5}) => (
  <g>
    {Array.from({length: 26}, (_, i) => (
      <Pine key={i} x={-300 + i * 100 + rnd(i, seed) * 50} y={y + rnd(i, seed + 1) * 16} s={s * (0.7 + rnd(i, seed + 2) * 0.5)} color={color} />
    ))}
  </g>
);

// ------------------------------------------------------------------ GORDON THE TAX MOOSE
export type MooseMood = 'smug' | 'angry' | 'shock' | 'sad' | 'happy' | 'neutral';
export const TaxMoose: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  talk?: number;
  mood?: MooseMood;
  arms?: 'down' | 'clip' | 'point' | 'up' | 'rub';
  flip?: boolean;
  shiver?: number;
}> = ({x, y, s = 1, frame, talk = 0, mood = 'smug', arms = 'clip', flip, shiver = 0}) => {
  const bob = Math.sin(frame / 14) * 4;
  const blink = frame % 113 < 4;
  const fur = '#7a4a2a';
  const fur2 = '#9a643c';
  const mouthOpen = 4 + talk * 30;
  const sx = shiver ? Math.sin(frame * 2.3) * 3 * shiver : 0;
  const brow = {smug: [8, -6], angry: [-10, 10], shock: [-14, -14], sad: [10, -10], happy: [-4, -4], neutral: [0, 0]}[mood];
  const armEnd = (side: 1 | -1): [number, number] => {
    if (arms === 'up') return [side * 170, -470];
    if (arms === 'point' && side === 1) return [200, -330];
    if ((arms === 'clip' || arms === 'rub') && side === 1) return [40, -250];
    if (arms === 'rub') return [-30, -255];
    return [side * 120, -170];
  };
  const arm = (side: 1 | -1) => {
    const [hx, hy] = armEnd(side);
    const shx = side * 80;
    return (
      <g key={side}>
        <path d={`M ${shx} -320 Q ${(shx + hx) / 2 + side * 30} ${(-320 + hy) / 2 + 20} ${hx} ${hy}`} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d={`M ${shx} -320 Q ${(shx + hx) / 2 + side * 30} ${(-320 + hy) / 2 + 20} ${hx} ${hy}`} stroke={fur} strokeWidth={26} fill="none" strokeLinecap="round" />
        <ellipse cx={hx} cy={hy} rx={20} ry={16} fill="#3b2a22" stroke={INK} strokeWidth={4} />
      </g>
    );
  };
  const eye = (side: 1 | -1) => {
    const ex = side * 36;
    const pr = mood === 'shock' ? 6 : 10;
    return (
      <g key={side}>
        <ellipse cx={ex} cy={-470} rx={20} ry={blink ? 2 : 22} fill="#fff" stroke={INK} strokeWidth={4} />
        {!blink && <circle cx={ex + 3} cy={-466} r={pr} fill={INK} />}
        {!blink && mood === 'smug' && <path d={`M ${ex - 22} -478 H ${ex + 22} V -492 H ${ex - 22} Z`} fill={fur} />}
        <path d={`M ${ex - 22 * side} ${-500 + brow[0] * (side === 1 ? 0 : 0)} L ${ex + 22 * side} ${-500}`} stroke="none" />
        <path d={`M ${ex - 24} ${-500 + (side === 1 ? brow[1] : brow[0])} L ${ex + 24} ${-500 + (side === 1 ? brow[0] : brow[1])}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      </g>
    );
  };
  const antler = (
    <path
      d="M 46 -508 Q 90 -548 126 -552 L 138 -620 L 160 -560 L 186 -634 L 202 -566 L 236 -622 L 244 -560 L 280 -590 Q 270 -520 200 -506 Q 130 -496 64 -486 Z"
      fill="#ead4a8"
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  );
  return (
    <g transform={`translate(${x + sx} ${y}) scale(${s * (flip ? -1 : 1)} ${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={4} rx={150} ry={18} fill="rgba(0,0,0,0.25)" />
      {/* legs */}
      {[-48, 48].map((lx) => (
        <g key={lx} stroke={INK} strokeWidth={5}>
          <rect x={lx - 24} y={-170} width={48} height={160} rx={18} fill={fur} />
          <path d={`M ${lx - 28} -24 h 56 v 24 h -56 Z`} fill="#2b2026" />
        </g>
      ))}
      <g transform={`translate(0 ${bob})`}>
        {/* body (tweed vest) */}
        <ellipse cx={0} cy={-250} rx={108} ry={128} fill={fur} stroke={INK} strokeWidth={6} />
        <path d="M -92 -300 Q -60 -360 -26 -368 L 0 -280 L 26 -368 Q 60 -360 92 -300 Q 110 -200 70 -140 Q 0 -120 -70 -140 Q -110 -200 -92 -300 Z" fill="#4c6b4a" stroke={INK} strokeWidth={5} />
        <path d="M 0 -280 L 0 -140" stroke={INK} strokeWidth={4} />
        {[-240, -200, -165].map((by) => (
          <circle key={by} cx={14} cy={by} r={6} fill="#d8b24a" stroke={INK} strokeWidth={3} />
        ))}
        {/* pocket with pencil */}
        <rect x={-74} y={-276} width={40} height={30} rx={4} fill="#3f5a3e" stroke={INK} strokeWidth={4} />
        <rect x={-62} y={-300} width={10} height={34} fill="#f6c945" stroke={INK} strokeWidth={3} />
        {arm(-1)}
        {/* head */}
        <g transform={`rotate(${mood === 'shock' ? 0 : Math.sin(frame / 30) * 2} 0 -400)`}>
          <g transform="scale(-1 1)">{antler}</g>
          {antler}
          {[-1, 1].map((side) => (
            <path key={side} d={`M ${side * 62} -478 Q ${side * 118} -500 ${side * 112} -456 Q ${side * 86} -440 ${side * 60} -452 Z`} fill={fur2} stroke={INK} strokeWidth={5} />
          ))}
          {/* dewlap */}
          <path d="M -14 -320 Q -26 -270 0 -258 Q 26 -270 14 -320 Z" fill={fur} stroke={INK} strokeWidth={5} />
          <ellipse cx={0} cy={-462} rx={74} ry={78} fill={fur} stroke={INK} strokeWidth={6} />
          {/* long snout */}
          <path d="M -60 -440 Q -92 -340 -40 -318 Q 0 -306 40 -318 Q 92 -340 60 -440 Z" fill={fur2} stroke={INK} strokeWidth={6} />
          <ellipse cx={-22} cy={-366} rx={10} ry={14} fill={INK} />
          <ellipse cx={22} cy={-366} rx={10} ry={14} fill={INK} />
          {/* mouth */}
          {mood === 'shock' ? (
            <ellipse cx={0} cy={-332} rx={16} ry={8 + mouthOpen * 0.5} fill="#5a1f2a" stroke={INK} strokeWidth={4} />
          ) : (
            <path
              d={`M -38 -338 Q 0 ${-338 + (mood === 'sad' ? -10 : 10) + mouthOpen} 38 -338 ${talk > 0.05 ? `Q 0 ${-330 + mouthOpen * 0.2} -38 -338` : ''}`}
              fill={talk > 0.05 ? '#5a1f2a' : 'none'}
              stroke={INK}
              strokeWidth={5}
              strokeLinecap="round"
            />
          )}
          {eye(-1)}
          {eye(1)}
          {/* green accountant visor */}
          <path d="M -80 -520 Q 0 -552 80 -520 L 104 -492 Q 0 -520 -104 -492 Z" fill="#3fae6a" fillOpacity={0.85} stroke={INK} strokeWidth={5} />
        </g>
        {arm(1)}
        {(arms === 'clip' || arms === 'rub') && (
          <g transform="translate(70 -270) rotate(-8)">
            <rect x={-56} y={-70} width={112} height={140} rx={8} fill="#c98f5e" stroke={INK} strokeWidth={5} />
            <rect x={-44} y={-54} width={88} height={114} fill={PAPER} stroke={INK} strokeWidth={3} />
            <rect x={-20} y={-78} width={40} height={18} rx={4} fill="#9aa0a6" stroke={INK} strokeWidth={4} />
            <text x={0} y={-20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#e8553e" transform={flip ? 'scale(-1 1)' : undefined}>TAX</text>
            {[4, 20, 36].map((ly) => (
              <path key={ly} d={`M -32 ${ly} H 32`} stroke={INK} strokeWidth={3} opacity={0.5} />
            ))}
          </g>
        )}
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ BERNIE THE BEAVER
export const Beaver: React.FC<{x: number; y: number; s?: number; frame: number; talk?: number; mood?: 'happy' | 'shock' | 'wise'; stick?: boolean; flip?: boolean; arms?: 'stick' | 'up' | 'wave'}> = ({
  x,
  y,
  s = 1,
  frame,
  talk = 0,
  mood = 'happy',
  stick = true,
  flip,
  arms = 'stick',
}) => {
  const fur = '#8b5a2b';
  const bob = Math.abs(Math.sin(frame / 8)) * -5;
  const blink = frame % 89 < 4;
  const mo = talk * 22;
  const tailWag = Math.sin(frame / 10) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s})`} strokeLinejoin="round" stroke={INK}>
      <ellipse cx={0} cy={4} rx={90} ry={12} fill="rgba(0,0,0,0.25)" stroke="none" />
      {/* tail */}
      <g transform={`rotate(${tailWag} 40 -30)`}>
        <ellipse cx={110} cy={-24} rx={70} ry={30} fill="#5a3a22" strokeWidth={5} />
        {[-30, 0, 30].map((tx) => (
          <path key={tx} d={`M ${110 + tx - 14} -44 L ${110 + tx + 14} -4 M ${110 + tx + 14} -44 L ${110 + tx - 14} -4`} stroke="#3e2716" strokeWidth={3} />
        ))}
      </g>
      <g transform={`translate(0 ${bob})`}>
        <ellipse cx={-34} cy={-8} rx={30} ry={14} fill="#3e2716" strokeWidth={4} />
        <ellipse cx={34} cy={-8} rx={30} ry={14} fill="#3e2716" strokeWidth={4} />
        <ellipse cx={0} cy={-100} rx={74} ry={96} fill={fur} strokeWidth={6} />
        <ellipse cx={0} cy={-86} rx={46} ry={66} fill="#c98f5e" strokeWidth={0} />
        {/* head */}
        <circle cx={-48} cy={-246} r={18} fill={fur} strokeWidth={5} />
        <circle cx={48} cy={-246} r={18} fill={fur} strokeWidth={5} />
        <ellipse cx={0} cy={-210} rx={66} ry={60} fill={fur} strokeWidth={6} />
        <ellipse cx={0} cy={-186} rx={40} ry={28} fill="#c98f5e" strokeWidth={4} />
        <ellipse cx={0} cy={-202} rx={14} ry={10} fill={INK} />
        {/* mouth + teeth */}
        <path d={`M -16 -184 Q 0 ${-176 + mo} 16 -184`} fill={talk > 0.05 ? '#5a1f2a' : 'none'} strokeWidth={4} />
        <rect x={-13} y={-180 + mo * 0.6} width={13} height={22} rx={3} fill="#fff" strokeWidth={3} />
        <rect x={0} y={-180 + mo * 0.6} width={13} height={22} rx={3} fill="#fff" strokeWidth={3} />
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse cx={side * 26} cy={-226} rx={11} ry={blink ? 2 : mood === 'shock' ? 15 : 12} fill="#fff" strokeWidth={3} />
            {!blink && <circle cx={side * 26 + 2} cy={-224} r={mood === 'shock' ? 4 : 6} fill={INK} stroke="none" />}
            {mood === 'wise' && !blink && <path d={`M ${side * 26 - 12} -230 H ${side * 26 + 12}`} strokeWidth={5} />}
          </g>
        ))}
        {/* hard hat */}
        <path d="M -58 -248 Q -56 -300 0 -304 Q 56 -300 58 -248 Z" fill="#f6c945" strokeWidth={5} />
        <rect x={-70} y={-254} width={140} height={14} rx={7} fill="#e0a92a" strokeWidth={4} />
        <path d="M 0 -304 V -254" strokeWidth={4} />
        {/* arms */}
        {arms === 'stick' ? (
          <g>
            {stick && (
              <g transform="rotate(-24 0 -120)">
                <rect x={-120} y={-128} width={240} height={18} rx={9} fill="#a5703f" strokeWidth={4} />
                <path d="M 80 -124 l 26 -26" strokeWidth={5} />
                <ellipse cx={108} cy={-152} rx={12} ry={7} fill="#5fa04a" strokeWidth={3} />
              </g>
            )}
            <ellipse cx={-40} cy={-128} rx={18} ry={14} fill={fur} strokeWidth={4} />
            <ellipse cx={40} cy={-112} rx={18} ry={14} fill={fur} strokeWidth={4} />
          </g>
        ) : (
          <g>
            <path d={`M -60 -140 L ${arms === 'up' ? -96 : -84} ${arms === 'up' ? -230 : -90}`} strokeWidth={22} strokeLinecap="round" />
            <path d={`M -60 -140 L ${arms === 'up' ? -96 : -84} ${arms === 'up' ? -230 : -90}`} stroke={fur} strokeWidth={14} strokeLinecap="round" />
            <path d={`M 60 -140 L ${arms === 'up' ? 96 : 92 + Math.sin(frame / 4) * 10} ${arms === 'up' ? -230 : -220}`} strokeWidth={22} strokeLinecap="round" />
            <path d={`M 60 -140 L ${arms === 'up' ? 96 : 92 + Math.sin(frame / 4) * 10} ${arms === 'up' ? -230 : -220}`} stroke={fur} strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ SETS
/** Snowy small-town street (cold open). */
export const SnowStreet: React.FC<{frame: number; time?: 'day' | 'sunset'}> = ({frame, time = 'day'}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time={time} frame={frame} id={`snowst-${time}`} clouds={4} />
    <path d="M -400 640 Q 300 560 900 620 Q 1500 680 2320 590 L 2320 900 L -400 900 Z" fill="#dcebf6" stroke="none" />
    <Treeline y={660} color="#4f7f86" s={0.45} seed={3} />
    {[
      {x: 60, w: 300, c: '#e8553e', r: '#7a2e2a'},
      {x: 420, w: 260, c: '#4f9dde', r: '#2a4a7a'},
      {x: 1360, w: 300, c: '#f6c945', r: '#8a6a2a'},
      {x: 1720, w: 280, c: '#5fb37a', r: '#2f5a3e'},
    ].map((h, i) => (
      <g key={i}>
        <rect x={h.x} y={560} width={h.w} height={300} fill={h.c} />
        <path d={`M ${h.x - 30} 570 L ${h.x + h.w / 2} 420 L ${h.x + h.w + 30} 570 Z`} fill={h.r} />
        <path d={`M ${h.x - 34} 572 L ${h.x + h.w / 2} 418 L ${h.x + h.w + 34} 572 L ${h.x + h.w + 20} 550 L ${h.x + h.w / 2} 446 L ${h.x - 20} 550 Z`} fill="#fff" />
        <rect x={h.x + 40} y={620} width={80} height={80} fill="#ffe9a8" />
        <path d={`M ${h.x + 80} 620 V 700 M ${h.x + 40} 660 H ${h.x + 120}`} />
        <rect x={h.x + h.w - 110} y={720} width={70} height={140} fill="#6b4d3a" />
        <circle cx={h.x + h.w - 54} cy={792} r={5} fill="#f6c945" />
      </g>
    ))}
    {/* street */}
    <rect x={-400} y={860} width={2720} height={400} fill="#f4f8fb" />
    <rect x={-400} y={940} width={2720} height={150} fill="#8e9aa6" />
    {Array.from({length: 12}, (_, i) => (
      <rect key={i} x={-300 + i * 230} y={1008} width={110} height={14} rx={7} fill="#f6c945" stroke="none" />
    ))}
    <path d="M -400 860 Q -100 840 200 862 Q 600 846 1000 864 Q 1400 846 1800 862 Q 2100 848 2320 862 L 2320 880 L -400 880 Z" fill="#fff" />
    {/* moose crossing sign */}
    <g transform="translate(980 860)">
      <rect x={-8} y={-280} width={16} height={280} fill="#9aa0a6" />
      <g transform="translate(0 -300) rotate(45)">
        <rect x={-70} y={-70} width={140} height={140} rx={12} fill="#f6c945" strokeWidth={6} />
      </g>
      <g transform="translate(0 -300)" fill={INK} stroke="none">
        <ellipse cx={0} cy={6} rx={36} ry={18} />
        <rect x={-30} y={14} width={8} height={30} />
        <rect x={22} y={14} width={8} height={30} />
        <path d="M 26 -4 L 52 -24 L 58 -8 L 40 6 Z" />
        <path d="M 46 -24 L 40 -46 L 54 -34 L 62 -50 L 64 -30 Z" />
      </g>
    </g>
    <Snowfall frame={frame} n={40} />
  </g>
);

/** Frozen lake with treeline; time = day | sunset. */
export const IceLake: React.FC<{frame: number; time?: 'day' | 'sunset' | 'night'; hut?: boolean}> = ({frame, time = 'day', hut = true}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time={time} frame={frame} id={`ice-${time}`} clouds={3} />
    <path d="M -400 560 L 200 380 L 520 520 L 900 340 L 1300 500 L 1700 360 L 2320 520 L 2320 700 L -400 700 Z" fill={time === 'sunset' ? '#b58fb8' : time === 'night' ? '#3a4470' : '#b9cfe0'} />
    <path d="M 200 380 L 260 420 L 220 432 L 160 400 Z M 900 340 L 970 384 L 920 396 L 850 370 Z M 1700 360 L 1770 400 L 1720 410 L 1650 384 Z" fill="#fff" stroke="none" />
    <Treeline y={690} color={time === 'sunset' ? '#5a4f7a' : time === 'night' ? '#1f2c48' : '#3d6f72'} s={0.5} seed={7} />
    <defs>
      <linearGradient id={`ice-g-${time}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={time === 'sunset' ? '#f3c3b0' : time === 'night' ? '#5a6f9a' : '#d8ecf8'} />
        <stop offset="1" stopColor={time === 'sunset' ? '#c99ac8' : time === 'night' ? '#2f3d66' : '#a9d0ea'} />
      </linearGradient>
    </defs>
    <rect x={-400} y={680} width={2720} height={600} fill={`url(#ice-g-${time})`} />
    {[
      'M 200 760 L 320 790 L 380 770 L 470 810',
      'M 1300 980 L 1420 950 L 1500 990',
      'M 1600 760 L 1700 780 L 1760 760',
      'M -100 1000 L 40 970 L 120 1010',
    ].map((d) => (
      <path key={d} d={d} fill="none" stroke="#fff" strokeWidth={5} opacity={0.8} />
    ))}
    {hut && (
      <g transform="translate(260 840)">
        <rect x={-120} y={-200} width={240} height={200} fill="#c0392b" />
        <path d="M -140 -196 L 0 -290 L 140 -196 Z" fill="#7a2e2a" />
        <path d="M -146 -196 L 0 -294 L 146 -196 L 128 -190 L 0 -270 L -128 -190 Z" fill="#fff" />
        <rect x={-40} y={-120} width={80} height={120} fill="#6b4d3a" />
        <rect x={60} y={-160} width={44} height={44} fill="#ffe9a8" />
        <rect x={70} y={-330} width={24} height={60} fill="#555" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={82 + Math.sin(frame / 12 + i) * 12 + i * 10} cy={-350 - ((frame * 0.8 + i * 30) % 90)} r={14 + i * 4} fill="#eef" opacity={0.7} strokeWidth={0} />
        ))}
      </g>
    )}
    <Snowfall frame={frame} n={24} speed={0.6} opacity={0.7} />
  </g>
);

export const IceHole: React.FC<{x: number; y: number; shield?: number; frame: number}> = ({x, y, shield = 0, frame}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={4}>
    <ellipse rx={130} ry={40} fill="#fff" />
    <ellipse rx={104} ry={30} fill="#1f4f7a" />
    <ellipse cx={-20} cy={-6} rx={50} ry={10} fill="#3f7fb0" stroke="none" opacity={0.6 + Math.sin(frame / 10) * 0.2} />
    {shield > 0 && (
      <g opacity={shield}>
        <path d="M -150 0 A 150 150 0 0 1 150 0" fill="#7ff0ff" fillOpacity={0.22} stroke="#7ff0ff" strokeWidth={6} />
        {Array.from({length: 6}, (_, i) => {
          const a = Math.PI + (i + 0.5) * (Math.PI / 6);
          return <circle key={i} cx={Math.cos(a) * 110} cy={Math.sin(a) * 110} r={16} fill="none" stroke="#bff8ff" strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(frame / 6 + i)} />;
        })}
        <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
          TFSA
        </text>
      </g>
    )}
  </g>
);

export const Fish: React.FC<{x: number; y: number; s?: number; rot?: number; gold?: boolean; label?: string}> = ({x, y, s = 1, rot = 0, gold, label}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <path d="M -70 0 Q -20 -44 40 0 Q -20 44 -70 0 Z" fill={gold ? '#f6c945' : '#7fb3d5'} />
    <path d="M 36 0 L 74 -30 L 70 30 Z" fill={gold ? '#e0a92a' : '#5a8fb5'} />
    <circle cx={-44} cy={-8} r={6} fill="#fff" />
    <circle cx={-44} cy={-8} r={3} fill={INK} />
    {label && (
      <text x={-6} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill={INK} stroke="none">
        {label}
      </text>
    )}
  </g>
);

/** Garage interior. */
export const Garage: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#8a97a8" stroke="none" />
    <rect x={-400} y={-300} width={2720} height={1400} fill="url(#gar-brick)" stroke="none" opacity={0.25} />
    <defs>
      <pattern id="gar-brick" width="120" height="60" patternUnits="userSpaceOnUse">
        <path d="M 0 0 H 120 M 0 30 H 120 M 60 0 V 30 M 0 30 V 60" stroke="#2b2333" strokeWidth={2} fill="none" />
      </pattern>
    </defs>
    {/* pegboard */}
    <rect x={100} y={260} width={520} height={300} fill="#c98f5e" />
    {Array.from({length: 40}, (_, i) => (
      <circle key={i} cx={130 + (i % 10) * 50} cy={290 + Math.floor(i / 10) * 70} r={4} fill="#6b4d3a" stroke="none" />
    ))}
    <path d="M 180 300 v 120 M 160 300 h 40" strokeWidth={10} stroke="#9aa0a6" />
    <path d="M 300 320 l 60 120" strokeWidth={12} stroke="#e8553e" />
    <circle cx={480} cy={380} r={50} fill="none" strokeWidth={10} stroke="#4f9dde" />
    {/* hockey sticks + shelf */}
    <rect x={1500} y={420} width={360} height={16} fill="#6b4d3a" />
    {[1530, 1640, 1760].map((bx, i) => (
      <rect key={bx} x={bx} y={350} width={80} height={70} fill={['#e8553e', '#f6c945', '#5fb37a'][i]} />
    ))}
    {[1240, 1290].map((hx) => (
      <path key={hx} d={`M ${hx} 300 L ${hx} 780 L ${hx + 50} 800`} fill="none" strokeWidth={12} />
    ))}
    {/* window with snow outside */}
    <rect x={760} y={240} width={360} height={220} fill="#cfe6f5" />
    <path d="M 760 420 Q 900 400 1120 430 L 1120 460 L 760 460 Z" fill="#fff" />
    <path d="M 940 240 V 460 M 760 350 H 1120" strokeWidth={8} />
    <rect x={-400} y={860} width={2720} height={400} fill="#b8bec6" />
    <ellipse cx={960} cy={960} rx={300} ry={30} fill="#9aa2ac" stroke="none" opacity={0.7} />
    <Snowfall frame={frame} n={0} />
  </g>
);

export const RaceCar: React.FC<{x: number; y: number; s?: number; frame: number; moving?: boolean; label?: string}> = ({x, y, s = 1, frame, moving, label = 'TFSA'}) => {
  const spin = moving ? frame * 30 : 0;
  const shakeY = moving ? Math.sin(frame * 2) * 2 : 0;
  return (
    <g transform={`translate(${x} ${y + shakeY}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={6} rx={300} ry={20} fill="rgba(0,0,0,0.25)" stroke="none" />
      <path d="M -300 -40 L -280 -110 L -120 -120 L -60 -190 L 80 -190 L 140 -120 L 300 -100 L 320 -40 Z" fill="#e5302f" />
      <path d="M -40 -180 L 70 -180 L 110 -124 L -80 -124 Z" fill="#bfe6ff" />
      <path d="M -330 -120 h 80 v 30 h -80 Z M 280 -70 h 70 v 30 h -70 Z" fill="#2b2333" />
      <MapleLeaf x={-170} y={-78} s={0.7} color="#fff" />
      <text x={120} y={-58} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
        {label}
      </text>
      {[-190, 200].map((wx) => (
        <g key={wx} transform={`translate(${wx} -30) rotate(${spin})`}>
          <circle r={58} fill="#2b2333" />
          <circle r={26} fill="#c8ccd2" />
          <path d="M -26 0 H 26 M 0 -26 V 26" strokeWidth={5} />
        </g>
      ))}
    </g>
  );
};

/** Indoor curling rink. */
export const CurlingRink: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1000} fill="#3a4a6a" stroke="none" />
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} x={-300 + i * 340} y={120} width={220} height={130} rx={10} fill={['#e8553e', '#f4f1ea'][i % 2]} />
    ))}
    {Array.from({length: 8}, (_, i) => (
      <MapleLeaf key={i} x={-190 + i * 340} y={185} s={0.8} color={i % 2 ? '#e5302f' : '#fff'} />
    ))}
    <rect x={-400} y={540} width={2720} height={60} fill="#1f2a44" />
    {Array.from({length: 40}, (_, i) => (
      <circle key={i} cx={-380 + i * 70} cy={520 - (i % 3) * 22} r={22} fill={['#e8553e', '#4f9dde', '#f6c945', '#5fb37a'][i % 4]} opacity={0.7} strokeWidth={3} />
    ))}
    <rect x={-400} y={600} width={2720} height={700} fill="#eef6fc" />
    <path d="M -400 700 H 2320" stroke="#c8d8e8" strokeWidth={3} />
    {/* house (target) */}
    <g transform="translate(1440 790)">
      <ellipse rx={300} ry={90} fill="#4f9dde" />
      <ellipse rx={210} ry={62} fill="#fff" />
      <ellipse rx={120} ry={36} fill="#e5302f" />
      <ellipse rx={40} ry={12} fill="#fff" />
    </g>
    <path d="M -400 790 H 2320" stroke="#e5302f" strokeWidth={4} opacity={0.5} />
    <ellipse cx={600} cy={920} rx={260} ry={22} fill="#fff" opacity={0.5 + 0.2 * Math.sin(frame / 20)} stroke="none" />
  </g>
);

export const CurlingStone: React.FC<{x: number; y: number; s?: number; color?: string; label?: string; spin?: number}> = ({x, y, s = 1, color = '#e5302f', label, spin = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={4}>
    <ellipse cx={0} cy={0} rx={90} ry={26} fill="rgba(0,0,0,0.2)" stroke="none" />
    <path d="M -84 -10 Q -90 -60 0 -64 Q 90 -60 84 -10 Q 80 14 0 16 Q -80 14 -84 -10 Z" fill="#8a8f96" />
    <ellipse cx={0} cy={-46} rx={80} ry={20} fill={color} />
    <g transform={`rotate(${spin} 0 -60)`}>
      <path d="M -10 -56 V -86 H 50" fill="none" strokeWidth={14} />
      <path d="M -10 -56 V -86 H 50" fill="none" stroke={color} strokeWidth={8} />
    </g>
    {label && (
      <text x={0} y={-2} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#fff" stroke={INK} strokeWidth={5} paintOrder="stroke">
        {label}
      </text>
    )}
  </g>
);

/** Winter cottage on a lake with a dock. storm 0..1 */
export const Cottage: React.FC<{frame: number; storm?: number}> = ({frame, storm = 0}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time="day" frame={frame} id="cottage" clouds={4} />
    <rect x={-400} y={-300} width={2720} height={1100} fill="#3a4560" opacity={storm * 0.65} stroke="none" />
    <path d="M -400 600 L 400 440 L 800 560 L 1400 420 L 2320 580 L 2320 720 L -400 720 Z" fill="#a9bfd3" />
    <Treeline y={720} color="#3d6f72" s={0.5} seed={11} />
    <rect x={-400} y={710} width={2720} height={600} fill="#cfe3f2" />
    {/* dock */}
    <g>
      <path d="M -400 860 L 900 860 L 900 900 L -400 900 Z" fill="#a5703f" />
      {Array.from({length: 14}, (_, i) => (
        <path key={i} d={`M ${-380 + i * 92} 860 V 900`} strokeWidth={3} />
      ))}
      {[-200, 200, 600, 880].map((px) => (
        <rect key={px} x={px} y={880} width={28} height={110} fill="#6b4d3a" />
      ))}
    </g>
    {/* cottage */}
    <g transform="translate(1520 880)">
      <rect x={-260} y={-300} width={520} height={300} fill="#a5703f" />
      {Array.from({length: 7}, (_, i) => (
        <path key={i} d={`M -260 ${-260 + i * 40} H 260`} strokeWidth={3} />
      ))}
      <path d="M -300 -290 L 0 -470 L 300 -290 Z" fill="#5a3a22" />
      <path d="M -306 -288 L 0 -476 L 306 -288 L 284 -280 L 0 -446 L -284 -280 Z" fill="#fff" />
      <rect x={-200} y={-220} width={120} height={100} fill="#ffe9a8" />
      <rect x={60} y={-220} width={120} height={100} fill="#ffe9a8" />
      <rect x={-50} y={-160} width={100} height={160} fill="#6b2e2a" />
      <rect x={150} y={-500} width={50} height={120} fill="#7a7f86" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={176 + Math.sin(frame / 12 + i) * 14 + i * 14 + storm * i * 30} cy={-530 - ((frame + i * 30) % 90)} r={18 + i * 5} fill="#eef" opacity={0.6} strokeWidth={0} />
      ))}
    </g>
    <Snowfall frame={frame} n={30 + Math.round(storm * 90)} speed={1 + storm * 1.5} wind={0.4 + storm * 3} />
  </g>
);

/** Hockey rink (side view, crowd + boards). */
export const HockeyRink: React.FC<{frame: number; goalLight?: number; cheer?: number}> = ({frame, goalLight = 0, cheer = 0}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1000} fill="#1c2440" stroke="none" />
    {[0, 1, 2, 3].map((row) =>
      Array.from({length: 34}, (_, i) => {
        const jump = cheer > 0 ? Math.abs(Math.sin(frame / 4 + i * 0.7 + row)) * 18 * cheer : 0;
        const cx = -380 + i * 80 + (row % 2) * 40;
        const cy = 260 + row * 90 - jump;
        const col = ['#e8553e', '#f4f1ea', '#4f9dde', '#f6c945', '#c0392b'][(i + row * 2) % 5];
        return (
          <g key={`${row}-${i}`} opacity={0.85}>
            <rect x={cx - 26} y={cy + 20} width={52} height={60} rx={18} fill={col} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={22} fill={['#f2c8a0', '#c98f5e', '#8a5a3a', '#e0a37c'][(i + row) % 4]} strokeWidth={3} />
          </g>
        );
      }),
    )}
    <rect x={-400} y={600} width={2720} height={14} fill="#bfe6ff" opacity={0.5} />
    <rect x={-400} y={620} width={2720} height={170} fill="#fdfdfd" />
    <rect x={-400} y={760} width={2720} height={30} fill="#f6c945" />
    {[120, 760, 1400].map((ax) => (
      <g key={ax}>
        <rect x={ax} y={650} width={260} height={80} rx={10} fill={['#e8553e', '#4f9dde', '#5fb37a'][(ax / 640) | 0]} />
        <MapleLeaf x={ax + 130} y={690} s={0.6} color="#fff" />
      </g>
    ))}
    <rect x={-400} y={790} width={2720} height={500} fill="#eaf4fb" />
    <rect x={500} y={790} width={22} height={500} fill="#4f9dde" stroke="none" opacity={0.6} />
    <rect x={1100} y={790} width={22} height={500} fill="#e5302f" stroke="none" opacity={0.6} />
    {goalLight > 0 && <rect x={-400} y={-300} width={2720} height={1600} fill="#ff2a2a" opacity={0.18 * goalLight * (0.5 + 0.5 * Math.sin(frame / 2))} stroke="none" />}
  </g>
);

export const HockeyNet: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={4}>
    <path d="M -110 0 V -150 H 110 V 0" fill="none" stroke="#e5302f" strokeWidth={12} />
    <path d="M -100 -140 L -60 -40 H 60 L 100 -140" fill="none" strokeWidth={2} />
    {Array.from({length: 9}, (_, i) => (
      <path key={i} d={`M ${-100 + i * 25} -140 L ${-60 + i * 15} -20`} strokeWidth={2} opacity={0.6} />
    ))}
    {Array.from({length: 5}, (_, i) => (
      <path key={i} d={`M -100 ${-130 + i * 26} H 100`} strokeWidth={2} opacity={0.6} />
    ))}
  </g>
);

export const Puck: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={3}>
    <ellipse cy={6} rx={30} ry={10} fill="#111" />
    <rect x={-30} y={-6} width={60} height={12} fill="#111" />
    <ellipse cy={-6} rx={30} ry={10} fill="#333" />
  </g>
);

/** Suburban street with houses + far skyline. */
export const HouseStreet: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time="day" frame={frame} id="house" clouds={4} />
    {/* far skyline */}
    <g fill="#9fb6cc" stroke="none">
      {[[-200, 300], [-60, 220], [60, 360], [200, 260], [330, 420], [1500, 300], [1620, 380], [1760, 240], [1880, 330], [2000, 280]].map(([bx, bh], i) => (
        <rect key={i} x={bx} y={640 - bh} width={110} height={bh} />
      ))}
      <rect x={1180} y={140} width={20} height={500} />
      <ellipse cx={1190} cy={300} rx={44} ry={26} />
      <path d="M 1190 60 L 1194 140 H 1186 Z" />
    </g>
    <rect x={-400} y={640} width={2720} height={600} fill="#f4f8fb" />
    {[
      {x: -60, c: '#4f9dde', p: '$999K'},
      {x: 420, c: '#f6c945', p: '$1.1M'},
      {x: 900, c: '#e86a8f', p: '$1.3M'},
      {x: 1380, c: '#5fb37a', p: '$2M?!'},
    ].map((h, i) => (
      <g key={i} transform={`translate(${h.x} 860)`}>
        <rect x={0} y={-260} width={380} height={260} fill={h.c} />
        <path d="M -30 -250 L 190 -400 L 410 -250 Z" fill="#6b4d3a" />
        <path d="M -36 -248 L 190 -404 L 416 -248 L 396 -240 L 190 -376 L -16 -240 Z" fill="#fff" />
        <rect x={150} y={-130} width={80} height={130} fill="#fff6e6" />
        <rect x={30} y={-210} width={90} height={70} fill="#ffe9a8" />
        <rect x={260} y={-210} width={90} height={70} fill="#ffe9a8" />
        <g transform={`translate(330 40) rotate(${Math.sin(frame / 30 + i) * 3})`}>
          <rect x={-6} y={-90} width={12} height={90} fill="#fff" />
          <rect x={-80} y={-150} width={160} height={66} rx={8} fill="#fff" />
          <text x={0} y={-104} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#e5302f" stroke="none">
            {h.p}
          </text>
        </g>
      </g>
    ))}
    <rect x={-400} y={930} width={2720} height={200} fill="#8e9aa6" />
    <Snowfall frame={frame} n={20} speed={0.6} opacity={0.7} />
  </g>
);

/** Beaver pond with a dam of logs. dam 0..1 */
export const BeaverPond: React.FC<{frame: number; dam?: number; damX?: number}> = ({frame, dam = 1, damX = 1260}) => {
  const rows = 6;
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <Sky time="day" frame={frame} id="pond" clouds={5} />
      <path d="M -400 520 Q 400 420 1000 500 Q 1600 580 2320 470 L 2320 760 L -400 760 Z" fill="#9fcf8a" />
      <Treeline y={640} color="#2f7a5a" s={0.6} seed={5} />
      <rect x={-400} y={700} width={2720} height={600} fill="#6db0d8" />
      {Array.from({length: 10}, (_, i) => (
        <path key={i} d={`M ${-300 + i * 260 + Math.sin(frame / 20 + i) * 20} ${760 + (i % 3) * 60} q 30 -10 60 0`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />
      ))}
      {/* the dam */}
      <g transform={`translate(${damX} 900)`}>
        {Array.from({length: rows}, (_, r) =>
          Array.from({length: 6 - (r >> 1)}, (_, c) => {
            const idx = r * 6 + c;
            if (idx / 30 > dam) return null;
            return <rect key={`${r}-${c}`} x={-300 + c * 100 + (r % 2) * 50 + (r >> 1) * 50} y={-30 - r * 34} width={110} height={30} rx={14} fill={['#a5703f', '#8b5a2b', '#b8814a'][(r + c) % 3]} transform={`rotate(${(rnd(idx) - 0.5) * 10} ${-245 + c * 100} ${-15 - r * 34})`} />;
          }),
        )}
      </g>
      <rect x={-400} y={900} width={2720} height={400} fill="#c9a77a" />
      <path d="M -400 900 Q 0 880 400 902 Q 800 884 1200 900 Q 1600 886 2320 900" fill="none" />
    </g>
  );
};

/** Sugar shack in a maple forest, with sap buckets. */
export const SugarShack: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time="day" frame={frame} id="sugar" clouds={3} />
    <rect x={-400} y={600} width={2720} height={700} fill="#f4f8fb" />
    {[-120, 200, 1700, 2000].map((tx, i) => (
      <g key={tx}>
        <rect x={tx - 34} y={200} width={68} height={680} fill="#6b4d3a" />
        <path d={`M ${tx} 300 L ${tx - 120} 140 M ${tx} 360 L ${tx + 140} 200 M ${tx} 240 L ${tx + 40} 80`} strokeWidth={18} />
        <path d={`M ${tx} 300 L ${tx - 120} 140 M ${tx} 360 L ${tx + 140} 200 M ${tx} 240 L ${tx + 40} 80`} stroke="#6b4d3a" strokeWidth={10} />
        <rect x={tx - 30} y={540} width={60} height={70} rx={6} fill="#9aa0a6" />
        <path d={`M ${tx - 8} 520 h 24`} strokeWidth={8} />
        <circle cx={tx + 8} cy={540 + ((frame * 2 + i * 13) % 40)} r={5} fill="#d8a24a" strokeWidth={2} />
      </g>
    ))}
    <g transform="translate(960 880)">
      <rect x={-340} y={-320} width={680} height={320} fill="#a5703f" />
      {Array.from({length: 13}, (_, i) => (
        <path key={i} d={`M ${-320 + i * 54} -320 V 0`} strokeWidth={3} />
      ))}
      <path d="M -380 -310 L 0 -500 L 380 -310 Z" fill="#7a2e2a" />
      <path d="M -386 -308 L 0 -506 L 386 -308 L 362 -300 L 0 -476 L -362 -300 Z" fill="#fff" />
      <rect x={-80} y={-560} width={160} height={70} fill="#7a2e2a" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={Math.sin(frame / 14 + i) * 30 + (i - 1.5) * 40} cy={-600 - ((frame * 1.2 + i * 25) % 120)} r={30 + i * 6} fill="#fff" opacity={0.6} strokeWidth={0} />
      ))}
      <rect x={-260} y={-230} width={140} height={110} fill="#ffe9a8" />
      <rect x={120} y={-230} width={140} height={110} fill="#ffe9a8" />
      <rect x={-60} y={-180} width={120} height={180} fill="#5a3a22" />
      <rect x={-200} y={-300} width={400} height={56} rx={8} fill={PAPER} />
      <text x={0} y={-260} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#7a2e2a" stroke="none">
        SUGAR SHACK
      </text>
    </g>
    <Snowfall frame={frame} n={16} speed={0.5} opacity={0.6} />
  </g>
);

export const SapBucket: React.FC<{x: number; y: number; s?: number; level: number; leak?: number; frame: number; label?: string}> = ({x, y, s = 1, level, leak = 0, frame, label}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -90 -200 L 90 -200 L 72 0 L -72 0 Z" fill="#c8ccd2" />
    <clipPath id={`bk-${x}`}>
      <path d="M -88 -196 L 88 -196 L 72 0 L -72 0 Z" />
    </clipPath>
    <rect x={-100} y={-196 * level} width={200} height={200} fill="#d8a24a" clipPath={`url(#bk-${x})`} stroke="none" />
    <path d="M -90 -200 Q 0 -280 90 -200" fill="none" strokeWidth={6} />
    {leak > 0 &&
      [0, 1, 2].map((i) => {
        const t = (frame * 3 + i * 20) % 60;
        return <ellipse key={i} cx={40 + i * 10} cy={10 + t * 3} rx={8} ry={12} fill="#d8a24a" opacity={leak * interpolate(t, [40, 60], [1, 0], clamp)} strokeWidth={2} />;
      })}
    {label && (
      <text x={0} y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke">
        {label}
      </text>
    )}
  </g>
);

/** Robot Zamboni that auto-moves money. */
export const RoboZamboni: React.FC<{x: number; y: number; s?: number; frame: number; happy?: boolean}> = ({x, y, s = 1, frame, happy = true}) => {
  const spin = frame * 12;
  const blink = frame % 70 < 4;
  return (
    <g transform={`translate(${x} ${y + Math.sin(frame / 5) * 2}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cy={8} rx={260} ry={18} fill="rgba(0,0,0,0.25)" stroke="none" />
      <rect x={-240} y={-200} width={420} height={160} rx={24} fill="#4f9dde" />
      <rect x={120} y={-330} width={160} height={290} rx={20} fill="#3a7fbf" />
      <rect x={140} y={-310} width={120} height={90} rx={14} fill="#1c2440" />
      <circle cx={174} cy={-266} r={blink ? 2 : 14} fill="#7ff0ff" />
      <circle cx={226} cy={-266} r={blink ? 2 : 14} fill="#7ff0ff" />
      <path d={happy ? 'M 176 -240 Q 200 -226 224 -240' : 'M 176 -232 H 224'} stroke="#7ff0ff" strokeWidth={5} fill="none" />
      <path d="M 200 -330 V -370" strokeWidth={6} />
      <circle cx={200} cy={-378} r={12} fill="#e5302f" opacity={0.5 + 0.5 * Math.sin(frame / 3)} />
      <rect x={-270} y={-60} width={120} height={40} rx={10} fill="#c8ccd2" />
      <text x={-40} y={-104} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke">
        AUTO-SAVE
      </text>
      {[-150, 110].map((wx) => (
        <g key={wx} transform={`translate(${wx} -30) rotate(${spin})`}>
          <circle r={44} fill="#2b2333" />
          <circle r={18} fill="#c8ccd2" />
          <path d="M -18 0 H 18" strokeWidth={4} />
        </g>
      ))}
    </g>
  );
};

/** Arena jumbotron for the game plan. */
export const Arena: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1600} fill="#141a30" stroke="none" />
    {Array.from({length: 7}, (_, i) => (
      <path key={i} d={`M ${-200 + i * 380} -300 L ${-280 + i * 380 + Math.sin(frame / 40 + i) * 80} 1100 L ${-120 + i * 380 + Math.sin(frame / 40 + i) * 80} 1100 Z`} fill="#fff" opacity={0.04} stroke="none" />
    ))}
    <rect x={-400} y={800} width={2720} height={500} fill="#dfeef8" />
    <rect x={-400} y={780} width={2720} height={30} fill="#f6c945" />
  </g>
);
