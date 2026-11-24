// REUSABLE SETS – flat vector backgrounds in world coordinates (1920×1080, ground ≈ 900).
// Everything extends well beyond the frame so camera moves and 9:16 crops never show an edge.
// Each episode should combine/recolour these into NEW locations (never reuse a whole scene).

import React from 'react';
import {random} from 'remotion';
import {Parallax} from '../stage/Stage';
import {INK, PALETTE} from '../lib/theme';

const X0 = -1600;
const X1 = 3520;
const Y0 = -1400;
const Y1 = 2600;

export type TimeOfDay = 'day' | 'sunset' | 'night';
const SKY: Record<TimeOfDay, [string, string]> = {day: ['#7cc8f5', '#d6f0ff'], sunset: ['#f78a68', '#ffd9a0'], night: ['#151a40', '#3a3c78']};

export const Sky: React.FC<{time?: TimeOfDay; frame: number; id?: string; clouds?: number}> = ({time = 'day', frame, id = 'sky', clouds = 5}) => (
  <>
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SKY[time][0]} />
        <stop offset="1" stopColor={SKY[time][1]} />
      </linearGradient>
      <radialGradient id={`${id}-sun`}>
        <stop offset="0" stopColor={time === 'night' ? '#fffbe6' : '#fff6c2'} />
        <stop offset="0.5" stopColor={time === 'night' ? '#f4f1d0' : '#ffd95a'} />
        <stop offset="1" stopColor={time === 'night' ? '#f4f1d0' : '#ffd95a'} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill={`url(#${id}-g)`} />
    <Parallax depth={0.92}>
      {time === 'night' &&
        Array.from({length: 90}).map((_, i) => (
          <circle key={i} cx={X0 + random(`st${i}`) * (X1 - X0)} cy={Y0 + random(`sy${i}`) * 1900} r={1.5 + random(`sr${i}`) * 2.5} fill="#fff" opacity={0.5 + 0.5 * Math.sin(frame / 12 + i)} />
        ))}
      <circle cx={time === 'sunset' ? 1500 : 1560} cy={time === 'sunset' ? 560 : 200} r={time === 'night' ? 120 : 170} fill={`url(#${id}-sun)`} />
      {time === 'night' && <circle cx={1600} cy={180} r={62} fill={SKY.night[0]} />}
    </Parallax>
    <Parallax depth={0.8}>
      {Array.from({length: clouds}).map((_, i) => (
        <Cloud key={i} x={((random(`cx${id}${i}`) * 3600 + frame * (0.25 + random(`cv${i}`) * 0.3)) % 3800) - 900} y={60 + random(`cy${i}`) * 300} s={0.6 + random(`cs${i}`) * 0.8} night={time === 'night'} />
      ))}
    </Parallax>
  </>
);

export const Cloud: React.FC<{x: number; y: number; s?: number; night?: boolean}> = ({x, y, s = 1, night}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={night ? 0.35 : 0.95}>
    <ellipse cx={0} cy={30} rx={130} ry={34} fill="rgba(70,90,140,0.12)" />
    <g fill={night ? '#9aa0d0' : '#fff'}>
      <circle cx={-60} cy={10} r={42} />
      <circle cx={0} cy={-12} r={58} />
      <circle cx={62} cy={8} r={44} />
      <rect x={-100} y={10} width={200} height={40} rx={20} />
    </g>
  </g>
);

/** Rolling hills in 2–3 parallax layers. */
export const Hills: React.FC<{time?: TimeOfDay; colors?: string[]}> = ({time = 'day', colors}) => {
  const c = colors ?? (time === 'night' ? ['#2c3a6a', '#26325c', '#1f2a4e'] : time === 'sunset' ? ['#c98a8a', '#a8787f', '#8b6a74'] : ['#a9dba0', '#8ccc84', '#6fba6a']);
  const hill = (base: number, amp: number, seed: string) => {
    let d = `M ${X0} ${Y1} L ${X0} ${base}`;
    for (let x = X0; x <= X1; x += 160) d += ` Q ${x + 80} ${base - amp * (0.5 + random(`${seed}${x}`))} ${x + 160} ${base}`;
    return `${d} L ${X1} ${Y1} Z`;
  };
  return (
    <>
      <Parallax depth={0.6}>
        <path d={hill(700, 180, 'h1')} fill={c[0]} />
      </Parallax>
      <Parallax depth={0.35}>
        <path d={hill(790, 120, 'h2')} fill={c[1]} />
      </Parallax>
    </>
  );
};

/** Flat ground plane from the horizon down. */
export const Ground: React.FC<{y?: number; color?: string; edge?: string; kind?: 'grass' | 'floor' | 'sand' | 'street' | 'snow'}> = ({y = 860, color, edge, kind = 'grass'}) => {
  const fill = color ?? {grass: PALETTE.grass, floor: PALETTE.floor, sand: '#f2d89b', street: '#8d8f9a', snow: '#f4f8ff'}[kind];
  const ed = edge ?? {grass: PALETTE.grassDark, floor: '#a8724a', sand: '#dcbc78', street: '#6f717b', snow: '#cfe0f5'}[kind];
  return (
    <g>
      <rect x={X0} y={y} width={X1 - X0} height={Y1 - y} fill={fill} />
      <rect x={X0} y={y} width={X1 - X0} height={10} fill={ed} />
      {kind === 'floor' && Array.from({length: 40}).map((_, i) => <line key={i} x1={X0 + i * 140} y1={y + 10} x2={X0 + i * 140 - 200} y2={Y1} stroke={ed} strokeWidth={3} opacity={0.5} />)}
      {kind === 'grass' && Array.from({length: 70}).map((_, i) => <path key={i} d={`M ${X0 + i * 75 + random(`g${i}`) * 40} ${y + 60 + random(`gy${i}`) * 400} l 6 -18 l 6 18`} stroke={ed} strokeWidth={4} fill="none" strokeLinecap="round" />)}
      {kind === 'street' && (
        <>
          <rect x={X0} y={y + 140} width={X1 - X0} height={600} fill="#5d5f69" />
          {Array.from({length: 30}).map((_, i) => <rect key={i} x={X0 + i * 200} y={y + 330} width={110} height={16} rx={6} fill="#f2f2e8" />)}
          <rect x={X0} y={y + 136} width={X1 - X0} height={12} fill="#b9bac2" />
        </>
      )}
    </g>
  );
};

/** Interior room: wall, wainscot, floor, baseboard. Add Window/Door/Frame props on top. */
export const Room: React.FC<{wall?: string; trim?: string; floor?: string; floorY?: number; wallpaper?: 'stripes' | 'dots' | 'plain'}> = ({wall = PALETTE.wall, trim = '#d8b98f', floor = PALETTE.floor, floorY = 860, wallpaper = 'stripes'}) => (
  <g>
    <defs>
      <linearGradient id="room-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={wall} />
        <stop offset="1" stopColor={wall} stopOpacity={0.85} />
      </linearGradient>
      <radialGradient id="room-light" cx="50%" cy="35%" r="60%">
        <stop offset="0" stopColor="#fff" stopOpacity={0.25} />
        <stop offset="1" stopColor="#000" stopOpacity={0.12} />
      </radialGradient>
    </defs>
    <rect x={X0} y={Y0} width={X1 - X0} height={floorY - Y0} fill="url(#room-wall)" />
    {wallpaper === 'stripes' && Array.from({length: 60}).map((_, i) => <rect key={i} x={X0 + i * 90} y={Y0} width={30} height={floorY - Y0} fill="#000" opacity={0.035} />)}
    {wallpaper === 'dots' &&
      Array.from({length: 400}).map((_, i) => <circle key={i} cx={X0 + (i % 40) * 130 + (Math.floor(i / 40) % 2) * 65} cy={Y0 + Math.floor(i / 40) * 110 + 400} r={8} fill="#000" opacity={0.05} />)}
    <rect x={X0} y={floorY - 220} width={X1 - X0} height={220} fill={trim} opacity={0.55} />
    <rect x={X0} y={floorY - 226} width={X1 - X0} height={12} fill={trim} />
    <rect x={X0} y={floorY - 26} width={X1 - X0} height={26} fill={trim} stroke={INK} strokeWidth={0} />
    <Ground y={floorY} color={floor} kind="floor" />
    <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill="url(#room-light)" />
  </g>
);

/** A row of simple buildings (town/street backdrop). */
export const Buildings: React.FC<{base?: number; seed?: string; palette?: string[]; night?: boolean}> = ({base = 870, seed = 'b', palette = ['#f2a65a', '#e86a8f', '#7fb3d5', '#a3d39c', '#f6c945', '#c39bd3'], night}) => {
  const items: React.ReactNode[] = [];
  let x = X0;
  let i = 0;
  while (x < X1) {
    const w = 220 + random(`${seed}w${i}`) * 200;
    const h = 380 + random(`${seed}h${i}`) * 420;
    const col = palette[Math.floor(random(`${seed}c${i}`) * palette.length)];
    const wins: React.ReactNode[] = [];
    for (let wy = base - h + 50; wy < base - 140; wy += 95)
      for (let wx = x + 34; wx < x + w - 60; wx += 76) wins.push(<rect key={`${wx}-${wy}`} x={wx} y={wy} width={42} height={56} rx={6} fill={night ? (random(`${seed}${wx}${wy}`) > 0.4 ? '#ffe28a' : '#3b3f6b') : '#dff3ff'} stroke={INK} strokeWidth={3} />);
    items.push(
      <g key={i}>
        <rect x={x} y={base - h} width={w} height={h} fill={col} stroke={INK} strokeWidth={4} />
        <rect x={x - 8} y={base - h - 16} width={w + 16} height={20} fill={col} stroke={INK} strokeWidth={4} />
        {wins}
        <rect x={x + w / 2 - 34} y={base - 120} width={68} height={120} rx={8} fill="#8a5a3c" stroke={INK} strokeWidth={4} />
      </g>,
    );
    x += w + 10;
    i++;
  }
  return <g>{items}</g>;
};

/** Generic colour wash + vignette – put last in `set` to unify a location's mood. */
export const Grade: React.FC<{tint?: string; amount?: number}> = ({tint = '#ffb36b', amount = 0.06}) => (
  <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill={tint} opacity={amount} />
);
