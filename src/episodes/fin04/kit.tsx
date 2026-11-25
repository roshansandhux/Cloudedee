// fin04 kit – "Why Everything Costs More Now" – Inflato (balloon villain) + inflation-themed sets. All drawn in code.
import React from 'react';
import {interpolate} from 'remotion';
import {FONT, INK, PAPER} from '../../lib/theme';
import {lookOf} from '../../cast';
import type {Look} from '../../rig/looks';
import {Sky} from '../../sets/sets';
import {clamp} from '../fin02/kit';

export const FINN_04: Look = {...lookOf('finn'), body: '#2f9e8f', outfit: 'hoodie', glasses: true, hat: 'cap', hatColor: '#f6c945', neck: 'none'};
export const RUTH_04: Look = {...lookOf('ruth')};
export const RUTH_85: Look = {...lookOf('ruth'), body: '#ff5fa2', neck: 'scarf', neckColor: '#5fd3ff', glasses: false, hairColor: '#8a5a3a', hair: 'curly'};
export const KID_LOOKS: Look[] = [
  {skin: '#f2c8a0', body: '#ff8f3f', legs: '#3a4a7a', shoes: '#2b2333', hair: 'bob', hairColor: '#e0b040', outfit: 'shirt', size: 0.7, blush: true},
  {skin: '#8a5a3a', body: '#5fd38a', legs: '#2b2333', shoes: '#e8553e', hair: 'curly', hairColor: '#2b2333', outfit: 'shirt', size: 0.68},
  {skin: '#e0a37c', body: '#a98bff', legs: '#3a3f55', shoes: '#2b2333', hair: 'pigtails', hairColor: '#7a3b1e', outfit: 'dress', size: 0.66, blush: true},
];

const rnd = (i: number, seed = 1) => {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

// ------------------------------------------------------------------ INFLATO
/** Living balloon villain. puff: 0.4 (deflated) .. 1.6 (super puffed). */
export const Inflato: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  talk?: number;
  puff?: number;
  mood?: 'smug' | 'shock' | 'happy' | 'sad' | 'cold';
  pump?: boolean;
  flip?: boolean;
  rot?: number;
}> = ({x, y, s = 1, frame, talk = 0, puff = 1, mood = 'smug', pump = false, flip, rot = 0}) => {
  const bob = Math.sin(frame / 12) * 10;
  const sway = Math.sin(frame / 20) * 4 + rot;
  const blink = frame % 101 < 4;
  const rx = 120 * puff;
  const ry = 140 * puff;
  const body = mood === 'cold' ? '#9fd8ff' : '#ff4f6d';
  const wrinkle = puff < 0.8;
  const mo = 6 + talk * 30;
  const brow = {smug: [-6, 8], shock: [-14, -14], happy: [-6, -6], sad: [8, -8], cold: [6, -6]}[mood];
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s * (flip ? -1 : 1)} ${s}) rotate(${sway})`} strokeLinejoin="round">
      {/* string */}
      <path d={`M 0 ${ry - 10} q 20 60 -10 110 q -30 50 10 110`} fill="none" stroke={INK} strokeWidth={4} />
      <defs>
        <radialGradient id={`inf-g-${mood}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={mood === 'cold' ? '#e6f6ff' : '#ff9aac'} />
          <stop offset="0.6" stopColor={body} />
          <stop offset="1" stopColor={mood === 'cold' ? '#5aa8d8' : '#c42848'} />
        </radialGradient>
      </defs>
      <path d={`M -14 ${ry - 6} L 14 ${ry - 6} L 8 ${ry + 14} L -8 ${ry + 14} Z`} fill={body} stroke={INK} strokeWidth={4} />
      <ellipse rx={rx} ry={ry} fill={`url(#inf-g-${mood})`} stroke={INK} strokeWidth={6} />
      {wrinkle &&
        [-0.5, 0, 0.5].map((k) => <path key={k} d={`M ${k * rx - 20} ${-ry * 0.6} q 10 20 0 40 q -10 20 0 40`} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />)}
      <ellipse cx={-rx * 0.45} cy={-ry * 0.5} rx={rx * 0.16} ry={ry * 0.24} fill="#fff" opacity={0.55} transform={`rotate(-25 ${-rx * 0.45} ${-ry * 0.5})`} />
      {/* face */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={side * 34} cy={-24} rx={18} ry={blink ? 2 : mood === 'shock' ? 24 : 20} fill="#fff" stroke={INK} strokeWidth={4} />
          {!blink && <circle cx={side * 34 + 3} cy={-20} r={mood === 'shock' ? 6 : 9} fill={INK} />}
          {!blink && mood === 'smug' && <path d={`M ${side * 34 - 20} -34 H ${side * 34 + 20} V -44 H ${side * 34 - 20} Z`} fill={body} />}
          <path d={`M ${side * 34 - 20} ${-52 + (side === 1 ? brow[1] : brow[0])} L ${side * 34 + 20} ${-52 + (side === 1 ? brow[0] : brow[1])}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
        </g>
      ))}
      {/* monocle */}
      <circle cx={34} cy={-24} r={27} fill="none" stroke="#d8b24a" strokeWidth={5} />
      <path d="M 58 -12 q 20 30 6 70" fill="none" stroke="#d8b24a" strokeWidth={3} />
      {/* mouth */}
      {mood === 'shock' ? (
        <ellipse cx={0} cy={36} rx={16} ry={10 + mo * 0.4} fill="#5a1f2a" stroke={INK} strokeWidth={4} />
      ) : mood === 'sad' || mood === 'cold' ? (
        <path d={`M -34 ${44 + mo * 0.3} Q 0 ${24} 34 ${44 + mo * 0.3}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      ) : (
        <path d={`M -44 26 Q 0 ${48 + mo} 44 26 Q 0 ${40 + mo * 0.3} -44 26 Z`} fill="#5a1f2a" stroke={INK} strokeWidth={5} />
      )}
      {/* curly mustache */}
      <path d="M 0 16 q -20 -10 -40 4 q -14 10 -26 -4 M 0 16 q 20 -10 40 4 q 14 10 26 -4" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      {/* bow tie */}
      <path d={`M 0 ${ry * 0.62} l -30 -18 v 36 Z M 0 ${ry * 0.62} l 30 -18 v 36 Z`} fill="#2b2333" />
      <circle cx={0} cy={ry * 0.62} r={7} fill="#f6c945" />
      {/* arms */}
      {[-1, 1].map((side) => {
        const ax = side * rx * 0.95;
        const hx = pump && side === 1 ? rx + 50 : ax + side * 60;
        const hy = pump && side === 1 ? 40 + Math.abs(Math.sin(frame / 5)) * 40 : mood === 'shock' ? -110 : 20 + Math.sin(frame / 9 + side) * 10;
        return (
          <g key={side}>
            <path d={`M ${ax} 10 Q ${(ax + hx) / 2} ${hy - 30} ${hx} ${hy}`} fill="none" stroke={INK} strokeWidth={6} />
            <circle cx={hx} cy={hy} r={16} fill="#fff" stroke={INK} strokeWidth={4} />
          </g>
        );
      })}
      {pump && (
        <g transform={`translate(${rx + 50} 160)`} stroke={INK} strokeWidth={4}>
          <rect x={-18} y={-60} width={36} height={90} rx={6} fill="#4f9dde" />
          <rect x={-5} y={-60 - Math.abs(Math.sin(frame / 5)) * 40 - 30} width={10} height={60} fill="#c8ccd2" />
          <rect x={-30} y={30} width={60} height={12} rx={4} fill="#2b2333" />
        </g>
      )}
      {mood === 'cold' && [-1, 0, 1].map((k) => <path key={k} d={`M ${k * 60 - 10} ${ry - 4} l 10 26 l 10 -26`} fill="#e6f6ff" stroke={INK} strokeWidth={3} />)}
    </g>
  );
};

// ------------------------------------------------------------------ props
export const PriceTag: React.FC<{x: number; y: number; s?: number; text: string; color?: string; rot?: number}> = ({x, y, s = 1, text, color = '#fff6c4', rot = -8}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <path d="M -90 -40 H 70 L 100 0 L 70 40 H -90 Z" fill={color} />
    <circle cx={68} cy={0} r={8} fill="#fff" />
    <text x={-10} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#e5302f" stroke="none">
      {text}
    </text>
  </g>
);

export const CandyBar: React.FC<{s?: number; short?: number}> = ({s = 1, short = 1}) => (
  <g transform={`scale(${s})`} stroke={INK} strokeWidth={4}>
    <rect x={-70 * short} y={-24} width={140 * short} height={48} rx={8} fill="#7a3b1e" />
    <rect x={-40 * short} y={-26} width={80 * short} height={52} fill="#e5302f" />
    <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#fff" stroke="none">
      CHOCO
    </text>
  </g>
);

export const IceCream: React.FC<{x: number; y: number; s?: number; melt: number; frame: number; label?: string}> = ({x, y, s = 1, melt, frame, label = '$100'}) => {
  const scoop = 1 - melt * 0.75;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={210} rx={40 + melt * 140} ry={10 + melt * 18} fill="#ff9ec4" />
      {melt > 0.2 && [0, 1, 2].map((i) => <ellipse key={i} cx={-40 + i * 40} cy={60 + ((frame * 2 + i * 30) % 140)} rx={10} ry={16} fill="#ff9ec4" strokeWidth={3} />)}
      <path d="M -60 0 L 0 200 L 60 0 Z" fill="#e0a95a" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${-50 + i * 30} 0 L ${-10 + i * 12} 150`} strokeWidth={3} opacity={0.6} />
      ))}
      <g transform={`translate(0 ${-10}) scale(${scoop})`}>
        <path d="M -80 0 Q -90 -110 0 -120 Q 90 -110 80 0 Q 60 30 40 10 Q 20 40 0 12 Q -20 40 -40 10 Q -60 30 -80 0 Z" fill="#ffb8d6" />
        <ellipse cx={-26} cy={-80} rx={16} ry={10} fill="#fff" opacity={0.6} strokeWidth={0} />
        <rect x={-6} y={-190} width={6} height={80} fill="#9aa0a6" strokeWidth={3} />
        <path d="M 0 -190 h 80 v 46 h -80 Z" fill="#5fd38a" strokeWidth={4} />
        <text x={40} y={-158} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#fff" stroke={INK} strokeWidth={5} paintOrder="stroke">
          {label}
        </text>
      </g>
    </g>
  );
};

export const ShoppingCart: React.FC<{x: number; y: number; s?: number; items?: number; frame: number}> = ({x, y, s = 1, items = 6, frame}) => {
  const icons = ['🍕', '🏠', '⛽', '💇', '📱', '🥛', '🚌', '👟'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={6} strokeLinejoin="round">
      {icons.slice(0, items).map((e, i) => (
        <text key={i} x={-150 + (i % 4) * 90} y={-200 - Math.floor(i / 4) * 70 + Math.sin(frame / 10 + i) * 4} fontSize={78} stroke="none">
          {e}
        </text>
      ))}
      <path d="M -260 -260 L -220 -260 L -180 -40 L 200 -40 L 240 -220 L -200 -220" fill="none" strokeWidth={14} />
      <path d="M -200 -220 L 240 -220 L 200 -40 L -180 -40 Z" fill="#c8ccd2" fillOpacity={0.55} />
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M ${-180 + i * 70} -220 L ${-160 + i * 62} -40`} strokeWidth={4} />
      ))}
      <circle cx={-140} cy={10} r={30} fill="#2b2333" />
      <circle cx={160} cy={10} r={30} fill="#2b2333" />
      <text x={30} y={-110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">
        CPI
      </text>
    </g>
  );
};

// ------------------------------------------------------------------ SETS
/** Doug's Corner store. night = evening look. */
export const CornerStore: React.FC<{frame: number; night?: boolean}> = ({frame, night}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill={night ? '#3a3560' : '#f3e2c0'} stroke="none" />
    <rect x={-400} y={-300} width={2720} height={1400} fill="url(#cs-tiles)" opacity={0.15} stroke="none" />
    <defs>
      <pattern id="cs-tiles" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#2b2333" strokeWidth={2} />
      </pattern>
    </defs>
    {/* window with street */}
    <rect x={80} y={160} width={520} height={400} fill={night ? '#1c2440' : '#bfe6ff'} />
    {night && [0, 1, 2].map((i) => <circle key={i} cx={180 + i * 150} cy={260} r={6} fill="#ffe9a8" stroke="none" />)}
    <path d="M 340 160 V 560 M 80 360 H 600" strokeWidth={8} />
    <g transform="translate(340 250)">
      <rect x={-110} y={-40} width={220} height={80} rx={16} fill="#2b2333" />
      <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill="#ff4f6d" stroke="none" opacity={0.7 + 0.3 * Math.sin(frame / 4)}>
        OPEN
      </text>
    </g>
    {/* shelves */}
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x={1180} y={200 + r * 170} width={680} height={16} fill="#a5703f" />
        {Array.from({length: 9}, (_, i) => (
          <rect key={i} x={1195 + i * 74} y={120 + r * 170} width={60} height={80} rx={6} fill={['#e5302f', '#f6c945', '#4f9dde', '#5fd38a', '#ff9ec4', '#a98bff'][(i + r) % 6]} />
        ))}
      </g>
    ))}
    <rect x={-400} y={860} width={2720} height={400} fill={night ? '#5a4f6a' : '#d8c4a0'} />
  </g>
);

/** Doug's counter – draw in Stage `front` so Doug stands behind it. */
export const StoreCounter: React.FC = () => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <g>
      <rect x={760} y={640} width={720} height={240} fill="#c0392b" />
      <rect x={740} y={620} width={760} height={30} rx={8} fill="#f4f1ea" />
      <rect x={1240} y={520} width={180} height={100} rx={12} fill="#9aa0a6" />
      <rect x={1260} y={535} width={140} height={44} rx={6} fill="#1c2440" />
      <text x={1330} y={568} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={30} fill="#5fd38a" stroke="none">
        $2.29
      </text>
      {/* candy rack */}
      <rect x={800} y={540} width={260} height={80} fill="#f6c945" />
      {Array.from({length: 4}, (_, i) => (
        <g key={i} transform={`translate(${840 + i * 60} 580) rotate(-90)`}>
          <CandyBar s={0.35} />
        </g>
      ))}
      <text x={1120} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#fff" stroke="none">
        DOUG’S CORNER
      </text>
    </g>
  </g>
);

/** Inflato's price workshop (balloon factory). */
export const Workshop: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#5a2a4a" stroke="none" />
    {Array.from({length: 7}, (_, i) => (
      <rect key={i} x={-300 + i * 380} y={-300} width={190} height={1200} fill="#6a3258" stroke="none" />
    ))}
    {/* pipes */}
    <path d="M -400 150 H 700 Q 760 150 760 210 V 420" fill="none" strokeWidth={46} stroke={INK} />
    <path d="M -400 150 H 700 Q 760 150 760 210 V 420" fill="none" strokeWidth={34} stroke="#9aa0a6" />
    <path d="M 2320 260 H 1500 Q 1440 260 1440 320 V 420" fill="none" strokeWidth={46} stroke={INK} />
    <path d="M 2320 260 H 1500 Q 1440 260 1440 320 V 420" fill="none" strokeWidth={34} stroke="#d8b24a" />
    {/* floating price balloons */}
    {[
      ['$', '#f6c945'],
      ['%', '#5fd38a'],
      ['$', '#4f9dde'],
      ['¢', '#ff9ec4'],
      ['$', '#a98bff'],
    ].map(([t, c], i) => {
      const x = 200 + i * 380 + Math.sin(frame / 30 + i) * 30;
      const y = 120 + ((i * 137 + frame * 0.6) % 200);
      return (
        <g key={i}>
          <path d={`M ${x} ${y + 70} q 10 40 -6 90`} fill="none" strokeWidth={3} />
          <ellipse cx={x} cy={y} rx={56} ry={68} fill={c} />
          <text x={x} y={y + 22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#fff" stroke="none">
            {t}
          </text>
        </g>
      );
    })}
    <rect x={-400} y={860} width={2720} height={400} fill="#3a1a30" />
    <path d="M -400 860 H 2320" stroke="#ff4f6d" strokeWidth={6} />
  </g>
);

/** Sunny boardwalk with ice cream stand. time day | sunset */
export const Boardwalk: React.FC<{frame: number; time?: 'day' | 'sunset'}> = ({frame, time = 'day'}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time={time} frame={frame} id={`bw-${time}`} clouds={2} />
    {time === 'day' &&
      Array.from({length: 10}, (_, i) => <path key={i} d={`M 1620 160 L ${1620 + Math.cos((i / 10) * Math.PI * 2 + frame / 60) * 220} ${160 + Math.sin((i / 10) * Math.PI * 2 + frame / 60) * 220}`} stroke="#ffd84a" strokeWidth={8} opacity={0.5} />)}
    <rect x={-400} y={560} width={2720} height={200} fill={time === 'sunset' ? '#3a6a9a' : '#4fb0e0'} />
    {Array.from({length: 8}, (_, i) => (
      <path key={i} d={`M ${-300 + i * 320 + Math.sin(frame / 25 + i) * 30} ${620 + (i % 2) * 50} q 40 -16 80 0`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />
    ))}
    <rect x={-400} y={740} width={2720} height={160} fill="#f2d79a" />
    {/* boardwalk planks */}
    <rect x={-400} y={860} width={2720} height={400} fill="#b8814a" />
    {Array.from({length: 30}, (_, i) => (
      <path key={i} d={`M ${-400 + i * 100} 860 V 1260`} strokeWidth={3} opacity={0.6} />
    ))}
    {/* ice cream stand */}
    <g transform="translate(1440 880)">
      <rect x={-220} y={-280} width={440} height={280} fill="#fff6e6" />
      <path d="M -260 -280 L 260 -280 L 230 -380 L -230 -380 Z" fill="#ff9ec4" />
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M ${-230 + i * 92} -380 L ${-260 + i * 104} -280`} stroke="#fff" strokeWidth={14} />
      ))}
      <rect x={-180} y={-240} width={360} height={110} fill="#bfe6ff" />
      <text x={0} y={-400} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill="#e5302f" stroke="#fff" strokeWidth={8} paintOrder="stroke">
        SCOOPS
      </text>
      <g transform="translate(150 -160) scale(0.4)">
        <IceCream x={0} y={0} melt={0} frame={frame} label="" />
      </g>
    </g>
    {/* umbrella */}
    <g transform="translate(300 880)">
      <rect x={-6} y={-300} width={12} height={300} fill="#fff" />
      <path d="M -200 -280 Q 0 -420 200 -280 Z" fill="#f6c945" />
      <path d="M -200 -280 Q -100 -330 0 -280 Q 100 -330 200 -280" fill="none" />
    </g>
  </g>
);

/** 1985 roller rink. */
export const RollerRink: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#1a0f3a" stroke="none" />
    {Array.from({length: 12}, (_, i) => (
      <path
        key={i}
        d={`M 960 40 L ${960 + Math.cos(i * 0.52 + frame / 40) * 1600} ${40 + Math.abs(Math.sin(i * 0.52 + frame / 40)) * 1200}`}
        stroke={['#ff4fd8', '#4fd8ff', '#ffe94f'][i % 3]}
        strokeWidth={30}
        opacity={0.12}
      />
    ))}
    <g transform="translate(960 80)">
      <path d="M 0 -120 V -40" strokeWidth={4} />
      <circle r={60} fill="#c8ccd2" />
      {Array.from({length: 18}, (_, i) => (
        <rect key={i} x={-60 + (i % 6) * 20} y={-50 + Math.floor(i / 6) * 32} width={16} height={16} fill={(i + Math.floor(frame / 6)) % 3 === 0 ? '#fff' : '#9aa0a6'} strokeWidth={1} />
      ))}
    </g>
    <text x={1500} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill="#ff4fd8" stroke="#fff" strokeWidth={6} paintOrder="stroke" opacity={0.85 + 0.15 * Math.sin(frame / 5)}>
      ROLLER WORLD ’85
    </text>
    <rect x={-400} y={700} width={2720} height={600} fill="#2a1f5c" />
    {Array.from({length: 24}, (_, i) =>
      Array.from({length: 4}, (_, r) => <rect key={`${i}-${r}`} x={-400 + i * 120 + (r % 2) * 60} y={700 + r * 60} width={60} height={60} fill={(i + r) % 2 ? '#ff4fd8' : '#4fd8ff'} opacity={0.4} stroke="none" />),
    )}
    <rect x={-400} y={680} width={2720} height={24} fill="#ffe94f" />
  </g>
);

/** Park with lemonade stand. */
export const Park: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <Sky time="day" frame={frame} id="park" clouds={5} />
    <path d="M -400 600 Q 400 500 1000 580 Q 1600 660 2320 560 L 2320 900 L -400 900 Z" fill="#7cc46a" />
    {[200, 1700, 2000].map((tx, i) => (
      <g key={tx} transform={`translate(${tx} ${640 + i * 20})`}>
        <rect x={-14} y={-120} width={28} height={130} fill="#6b4d3a" />
        <circle cx={0} cy={-170} r={100} fill="#3f8f6a" />
        <circle cx={-50} cy={-140} r={70} fill="#4fa07a" />
      </g>
    ))}
    <rect x={-400} y={860} width={2720} height={400} fill="#5fae55" />
    {/* lemonade stand */}
    <g transform="translate(1260 880)">
      <rect x={-200} y={-200} width={400} height={200} fill="#f6e27a" />
      <rect x={-220} y={-220} width={440} height={30} fill="#fff6c4" />
      <path d="M -200 -220 V -420 M 200 -220 V -420" strokeWidth={10} />
      <path d="M -240 -420 H 240 L 210 -360 H -210 Z" fill="#ff8f3f" />
      <text x={0} y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#e5302f" stroke="none">
        LEMONADE
      </text>
      <g transform="translate(120 -250)">
        <path d="M -24 -60 L 24 -60 L 18 0 L -18 0 Z" fill="#fff6a0" />
        <circle cx={14} cy={-64} r={10} fill="#f6e27a" />
      </g>
    </g>
  </g>
);

/** Theme park with a roller coaster whose track is the US inflation chart (2015–2025). */
export const COASTER = [
  [2015, 0.1], [2016, 1.3], [2017, 2.1], [2018, 2.4], [2019, 1.8], [2020, 1.2], [2021, 4.7], [2022, 9.1], [2023, 4.1], [2024, 2.9], [2025, 2.7],
] as const;
export const coasterPoint = (t: number) => {
  // t 0..1 along the track
  const n = COASTER.length - 1;
  const f = Math.max(0, Math.min(n, t * n));
  const i = Math.min(n - 1, Math.floor(f));
  const k = f - i;
  const v = COASTER[i][1] + (COASTER[i + 1][1] - COASTER[i][1]) * k;
  return {x: 120 + f * 168, y: 820 - v * 64, v};
};
export const CoasterPark: React.FC<{frame: number}> = ({frame}) => {
  const pts = Array.from({length: 101}, (_, i) => coasterPoint(i / 100));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <Sky time="day" frame={frame} id="coaster" clouds={4} />
      <rect x={-400} y={860} width={2720} height={400} fill="#9ad08a" />
      {pts.filter((_, i) => i % 5 === 0).map((p, i) => (
        <path key={i} d={`M ${p.x} ${p.y + 8} V 870`} strokeWidth={6} stroke="#8a5a3a" />
      ))}
      <path d={d} fill="none" strokeWidth={22} stroke={INK} />
      <path d={d} fill="none" strokeWidth={12} stroke="#e5302f" />
      {COASTER.map(([yr, v], i) => {
        const p = coasterPoint(i / (COASTER.length - 1));
        return (
          <g key={yr}>
            <text x={p.x} y={940} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK} stroke="none">
              {yr}
            </text>
            {(yr === 2022 || yr === 2020 || yr === 2025) && (
              <text x={p.x} y={p.y - 30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={yr === 2022 ? '#e5302f' : INK} stroke="#fff" strokeWidth={6} paintOrder="stroke">
                {v}%
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Grocery aisle. */
export const Grocery: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#eef3f7" stroke="none" />
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} x={-300 + i * 340} y={-200} width={240} height={30} rx={12} fill="#fff" opacity={0.8 + 0.2 * Math.sin(frame / 20 + i)} />
    ))}
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={-400} y={250 + r * 150} width={2720} height={14} fill="#9aa0a6" />
        {Array.from({length: 26}, (_, i) => (
          <rect key={i} x={-390 + i * 105} y={160 + r * 150} width={80} height={90} rx={8} fill={['#e5302f', '#f6c945', '#4f9dde', '#5fd38a', '#ff9ec4', '#ff8f3f', '#a98bff'][(i * 3 + r) % 7]} opacity={0.85} />
        ))}
      </g>
    ))}
    <rect x={-400} y={860} width={2720} height={400} fill="#d6dde4" />
    <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={60} fill="#4f9dde" stroke="#fff" strokeWidth={8} paintOrder="stroke">
      AISLE 7 · SNACKS
    </text>
  </g>
);

export const ChipBag: React.FC<{x: number; y: number; s?: number; open?: number; frame: number}> = ({x, y, s = 1, open = 0, frame}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -130 -280 L 130 -280 L 150 0 L -150 0 Z" fill="#f6c945" />
    <path d="M -130 -280 l 20 -20 l 20 20 l 20 -20 l 20 20 l 20 -20 l 20 20 l 20 -20 l 20 20 l 20 -20 l 20 20 l 20 -20 l 20 20" fill="#f6c945" />
    <text x={0} y={-180} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#e5302f" stroke="#fff" strokeWidth={6} paintOrder="stroke">
      CRUNCH!
    </text>
    {open > 0 && (
      <g opacity={open}>
        <rect x={-120} y={-150} width={240} height={140} rx={10} fill="#bfe6ff" strokeWidth={3} />
        <text x={0} y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#4f9dde" stroke="none">
          70% AIR
        </text>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={-60 + i * 40} cy={-30 + Math.sin(frame / 6 + i) * 3} rx={22} ry={12} fill="#f6c945" strokeWidth={3} />
        ))}
      </g>
    )}
  </g>
);

export const CerealBox: React.FC<{x: number; y: number; s?: number; thin?: number}> = ({x, y, s = 1, thin = 0}) => {
  const w = 220 * (1 - thin * 0.45);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <rect x={-w / 2} y={-340} width={w} height={340} fill="#4f9dde" />
      <circle cx={0} cy={-200} r={w * 0.3} fill="#f6c945" />
      <text x={0} y={-290} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={Math.max(24, w * 0.2)} fill="#fff" stroke="none">
        O’s
      </text>
      <PriceTag x={0} y={60} s={0.7} text="$4.99" rot={0} />
    </g>
  );
};

/** Museum gallery. */
export const Museum: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#e9e1d0" stroke="none" />
    <rect x={-400} y={560} width={2720} height={40} fill="#b8a888" />
    {[300, 960, 1620].map((cx, i) => (
      <g key={cx}>
        <path d={`M ${cx - 80} -300 L ${cx - 260} 900 L ${cx + 260} 900 L ${cx + 80} -300 Z`} fill="#fff8d0" opacity={0.25} stroke="none" />
        <circle cx={cx} cy={-40} r={20} fill="#fff8d0" opacity={0.6 + 0.2 * Math.sin(frame / 15 + i)} />
      </g>
    ))}
    <rect x={-400} y={860} width={2720} height={400} fill="#8a5a3a" />
    {Array.from({length: 14}, (_, i) => (
      <path key={i} d={`M ${-400 + i * 200} 860 L ${-500 + i * 200} 1260`} strokeWidth={3} opacity={0.4} />
    ))}
    <text x={960} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill="#7a5a2a" stroke="none">
      MUSEUM OF MONEY GONE WRONG
    </text>
  </g>
);

export const Frame: React.FC<{x: number; y: number; w: number; h: number; title: string; children: React.ReactNode}> = ({x, y, w, h, title, children}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={5}>
    <rect x={-w / 2 - 24} y={-h - 24} width={w + 48} height={h + 48} fill="#c9a24a" />
    <rect x={-w / 2} y={-h} width={w} height={h} fill={PAPER} />
    <g transform={`translate(${-w / 2} ${-h})`}>{children}</g>
    <rect x={-w / 2} y={50} width={w} height={60} rx={6} fill="#fff" />
    <text x={0} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK} stroke="none">
      {title}
    </text>
  </g>
);

/** Central bank control room with a giant thermostat. heat -1 (cold) .. 1 (hot) */
export const ControlRoom: React.FC<{frame: number; heat: number}> = ({frame, heat}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#1f2c48" stroke="none" />
    {Array.from({length: 6}, (_, i) => (
      <g key={i}>
        <rect x={-300 + i * 420} y={140} width={340} height={200} rx={12} fill="#0f1830" />
        <path d={`M ${-280 + i * 420} 300 ${Array.from({length: 8}, (_, k) => `L ${-280 + i * 420 + k * 42} ${300 - (rnd(k + i, 3) * 100 + Math.sin(frame / 10 + k) * 10)}`).join(' ')}`} fill="none" stroke={i % 2 ? '#5fd38a' : '#ff4f6d'} strokeWidth={4} />
      </g>
    ))}
    <rect x={-400} y={860} width={2720} height={400} fill="#2f3a5a" />
    {/* giant thermostat */}
    <g transform="translate(1180 560)">
      <circle r={250} fill="#f4f1ea" strokeWidth={8} />
      <circle r={200} fill={heat > 0 ? `rgb(${200 + heat * 55},${120 - heat * 60},${100 - heat * 60})` : `rgb(${150 + heat * 60},${200 + heat * 20},255)`} />
      {Array.from({length: 11}, (_, i) => {
        const a = (-135 + i * 27) * (Math.PI / 180);
        return <path key={i} d={`M ${Math.sin(a) * 180} ${-Math.cos(a) * 180} L ${Math.sin(a) * 215} ${-Math.cos(a) * 215}`} strokeWidth={6} />;
      })}
      <g transform={`rotate(${heat * 120})`}>
        <path d="M -16 0 L 0 -170 L 16 0 Z" fill="#2b2333" />
      </g>
      <circle r={30} fill="#2b2333" />
      <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
        {heat > 0.3 ? 'HOT' : heat < -0.3 ? 'COLD' : '2%'}
      </text>
      <text x={-210} y={240} fontFamily={FONT} fontWeight={700} fontSize={36} fill="#7fd3ff" stroke="none">
        ❄ cold
      </text>
      <text x={120} y={240} fontFamily={FONT} fontWeight={700} fontSize={36} fill="#ff8f73" stroke="none">
        hot 🔥
      </text>
    </g>
    <text x={1180} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke="none">
      CENTRAL BANK · PRICE CONTROL ROOM
    </text>
  </g>
);

/** Department store with a down escalator. */
export const Escalator: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#f6efe2" stroke="none" />
    <rect x={-400} y={360} width={2720} height={30} fill="#d8c4a0" />
    <rect x={-400} y={860} width={2720} height={400} fill="#e0d4bc" />
    {/* escalator from top-right (1700,360) down to bottom-left (500,860) */}
    <path d="M 420 880 L 520 880 L 1720 380 L 1860 380 L 1860 420 L 1740 420 L 540 920 L 420 920 Z" fill="#9aa0a6" />
    {Array.from({length: 26}, (_, i) => {
      const t = ((i / 26 + frame * 0.004) % 1);
      const x = 1720 - t * 1200;
      const y = 380 + t * 500;
      return <path key={i} d={`M ${x} ${y} h 60 v 20 h -60 Z`} fill="#c8ccd2" strokeWidth={2} />;
    })}
    <path d="M 500 820 L 1700 320" strokeWidth={22} stroke={INK} />
    <path d="M 500 820 L 1700 320" strokeWidth={14} stroke="#2b2333" />
    <text x={1100} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#e5302f" stroke="#fff" strokeWidth={6} paintOrder="stroke" transform="rotate(-22 1100 540)">
      ⬇ INFLATION ⬇
    </text>
  </g>
);

/** Bowling alley. */
export const Bowling: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={-400} y={-300} width={2720} height={1400} fill="#20163a" stroke="none" />
    {Array.from({length: 10}, (_, i) => (
      <circle key={i} cx={-200 + i * 260} cy={60} r={14} fill={['#ff4fd8', '#4fd8ff', '#ffe94f'][i % 3]} opacity={0.5 + 0.5 * Math.sin(frame / 4 + i)} />
    ))}
    {/* lanes in perspective */}
    {[-1, 0, 1].map((k) => (
      <path key={k} d={`M ${960 + k * 520 - 220} 1260 L ${960 + k * 200 - 70} 640 L ${960 + k * 200 + 70} 640 L ${960 + k * 520 + 220} 1260 Z`} fill="#d8a85a" />
    ))}
    <rect x={-400} y={560} width={2720} height={80} fill="#120c22" />
    {/* pins on middle lane */}
    {[[0, 0], [-1, 1], [1, 1], [-2, 2], [0, 2], [2, 2]].map(([c, r], i) => (
      <g key={i} transform={`translate(${960 + c * 24} ${620 - r * 10})`}>
        <path d="M -10 0 Q -14 -30 -6 -40 Q -12 -54 0 -60 Q 12 -54 6 -40 Q 14 -30 10 0 Z" fill="#fff" strokeWidth={2} />
        <path d="M -7 -40 H 7" stroke="#e5302f" strokeWidth={3} />
      </g>
    ))}
  </g>
);

export {clamp, interpolate};
