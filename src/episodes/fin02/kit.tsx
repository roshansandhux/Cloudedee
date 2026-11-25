// fin02 kit – sets, props and characters for "How Credit Cards Secretly Make Money Off You".
// Everything is drawn in code (flat vector, #2b2333 outlines, soft gradients).
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {FONT, INK, PAPER} from '../../lib/theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const backOut = Easing.out(Easing.back(1.8));
/** 0→1 with overshoot, starting at t = 0. */
export const pop = (t: number, dur = 10) => interpolate(t, [0, dur], [0, 1], {...clamp, easing: backOut});
export const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

// ============================================================== MR. SWIPE (talking credit card)
export type SwipeMood = 'sly' | 'happy' | 'shock' | 'sad' | 'cry';
export const SwipeCard: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  talk?: number;
  mood?: SwipeMood;
  rot?: number;
  hat?: 'none' | 'tophat' | 'host';
  arms?: 'wave' | 'rub' | 'down' | 'mic' | 'up';
  legs?: boolean;
  flip?: boolean;
}> = ({x, y, s = 1, frame, talk = 0, mood = 'sly', rot = 0, hat = 'none', arms = 'down', legs = true, flip}) => {
  const bob = Math.sin(frame / 9) * 6;
  const blink = frame % 97 < 4;
  const w = 260;
  const h = 168;
  const mouthOpen = 6 + talk * 34;
  const brow = mood === 'sly' ? 1 : mood === 'shock' ? -1.4 : mood === 'sad' || mood === 'cry' ? -0.8 : 0;
  const armY = -h * 0.1;
  const armPath = (side: 1 | -1) => {
    const sx = (w / 2 - 6) * side;
    let hx = sx + side * 70;
    let hy = armY + 60;
    if (arms === 'wave') {
      hx = sx + side * 60;
      hy = armY - 80 + (side === 1 ? Math.sin(frame * 0.4) * 18 : 60);
    } else if (arms === 'rub') {
      hx = side * 30 + Math.sin(frame * 0.6) * 8 * side;
      hy = h / 2 + 30;
    } else if (arms === 'up') {
      hx = sx + side * 50;
      hy = armY - 110;
    } else if (arms === 'mic' && side === 1) {
      hx = sx + 30;
      hy = armY - 30;
    }
    return {d: `M ${sx} ${armY} Q ${sx + side * 50} ${armY + 10} ${hx} ${hy}`, hx, hy};
  };
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rot}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <defs>
        <linearGradient id="swipe-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="0.45" stopColor="#f3b73c" />
          <stop offset="1" stopColor="#d1841a" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={h / 2 + 130 - bob} rx={110} ry={14} fill="rgba(20,10,30,0.18)" />
      {/* legs */}
      {legs &&
        [-1, 1].map((side) => (
          <g key={side}>
            <path d={`M ${side * 50} ${h / 2 - 4} L ${side * 56} ${h / 2 + 100}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={side * 66} cy={h / 2 + 106} rx={28} ry={14} fill="#2b2333" />
          </g>
        ))}
      {/* arms */}
      {[-1, 1].map((side) => {
        const a = armPath(side as 1 | -1);
        return (
          <g key={side}>
            <path d={a.d} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
            <circle cx={a.hx} cy={a.hy} r={17} fill="#fff" stroke={INK} strokeWidth={4} />
            {arms === 'mic' && side === 1 && (
              <g transform={`translate(${a.hx} ${a.hy - 26})`}>
                <rect x={-7} y={0} width={14} height={40} rx={5} fill="#3a3a4a" stroke={INK} strokeWidth={3} />
                <circle cx={0} cy={-6} r={15} fill="#9aa3b5" stroke={INK} strokeWidth={4} />
              </g>
            )}
          </g>
        );
      })}
      {/* body */}
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={22} fill="rgba(0,0,0,0.2)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="url(#swipe-body)" stroke={INK} strokeWidth={6} />
      <path d={`M ${-w / 2 + 20} ${-h / 2 + 18} Q 0 ${-h / 2 + 4} ${w / 2 - 30} ${-h / 2 + 24}`} stroke="#fff6c9" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* chip */}
      <rect x={-w / 2 + 26} y={-12} width={46} height={36} rx={7} fill="#e8e1c8" stroke={INK} strokeWidth={3} />
      <path d={`M ${-w / 2 + 26} 6 h 46 M ${-w / 2 + 49} -12 v 36`} stroke={INK} strokeWidth={2} />
      <text x={-w / 2 + 26} y={h / 2 - 20} fontFamily="monospace" fontWeight={700} fontSize={19} fill="#7a4b0c" letterSpacing={2}>
        4000 1234 5678 9010
      </text>
      {/* face */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${30 + side * 42} -34)`}>
          {blink ? (
            <path d="M -16 0 h 32" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          ) : (
            <>
              <ellipse rx={17} ry={mood === 'shock' ? 24 : 20} fill="#fff" stroke={INK} strokeWidth={4} />
              <circle cx={side * 2 + 3} cy={mood === 'sad' || mood === 'cry' ? 6 : 2} r={8} fill={INK} />
              <circle cx={side * 2 + 6} cy={-2} r={3} fill="#fff" />
            </>
          )}
          <path d={`M -20 ${-28 - brow * side * 6} L 20 ${-28 + brow * side * 6}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}
      {/* mustache */}
      <path d="M 30 12 q -30 -14 -56 6 q 24 -2 56 -2 q 32 0 56 2 q -26 -20 -56 -6 z" fill="#5a3311" stroke={INK} strokeWidth={3} />
      {/* mouth */}
      {mood === 'sad' || mood === 'cry' ? (
        <path d={`M 4 ${40 + mouthOpen * 0.3} Q 30 ${22} 56 ${40 + mouthOpen * 0.3}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      ) : (
        <path d={`M 2 26 Q 30 ${26 + mouthOpen + (mood === 'happy' ? 10 : 0)} 58 26 Z`} fill="#7a2d3a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      )}
      {mood === 'cry' &&
        [0, 1].map((i) => {
          const t = (frame * 2 + i * 17) % 34;
          return <ellipse key={i} cx={i ? 76 : -14} cy={-10 + t * 2.2} rx={7} ry={11} fill="#7fd3ff" stroke={INK} strokeWidth={2} opacity={1 - t / 34} />;
        })}
      {/* hats */}
      {hat === 'tophat' && (
        <g transform="translate(-60 -84) rotate(-12)">
          <rect x={-46} y={-8} width={92} height={14} rx={6} fill={INK} />
          <rect x={-30} y={-70} width={60} height={66} rx={6} fill={INK} />
          <rect x={-30} y={-22} width={60} height={10} fill="#e8553e" />
        </g>
      )}
      {hat === 'host' && (
        <g transform="translate(30 80)">
          <path d="M 0 0 L -34 -18 L -34 18 Z M 0 0 L 34 -18 L 34 18 Z" fill="#e8553e" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <circle r={9} fill="#ff7a5c" stroke={INK} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

// ============================================================== money & icons
export const Coin: React.FC<{x: number; y: number; r: number; frame?: number; face?: boolean; rot?: number}> = ({x, y, r, frame = 0, face = false, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={INK} strokeWidth={Math.max(2, r / 14)}>
    <ellipse cx={r * 0.12} cy={r * 0.08} rx={r} ry={r} fill="#c98a12" />
    <circle r={r} fill="#f6c945" />
    <circle r={r * 0.78} fill="none" stroke="#e0a81e" strokeWidth={r / 9} />
    {face ? (
      <>
        <circle cx={-r * 0.3} cy={-r * 0.12} r={r * 0.1} fill={INK} stroke="none" />
        <circle cx={r * 0.3} cy={-r * 0.12} r={r * 0.1} fill={INK} stroke="none" />
        <path d={`M ${-r * 0.3} ${r * 0.25} Q 0 ${r * 0.55} ${r * 0.3} ${r * 0.25}`} fill="none" strokeLinecap="round" />
      </>
    ) : (
      <text y={r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r * 1.05} fill="#b87a0e" stroke="none">
        $
      </text>
    )}
    {frame % 60 < 6 && <path d={`M ${-r * 0.5} ${-r * 0.5} l ${r * 0.3} ${r * 0.3}`} stroke="#fff" strokeWidth={r / 8} strokeLinecap="round" />}
  </g>
);

export const Bill: React.FC<{x: number; y: number; s?: number; rot?: number; amount?: string}> = ({x, y, s = 1, rot = 0, amount = '10'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={INK} strokeWidth={4}>
    <rect x={-80} y={-40} width={160} height={80} rx={8} fill="#8fd18a" />
    <rect x={-68} y={-29} width={136} height={58} rx={5} fill="none" stroke="#3f8f4a" strokeWidth={3} />
    <circle r={22} fill="#b9e6b3" stroke="#3f8f4a" strokeWidth={3} />
    <text y={11} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#2f6b38" stroke="none">
      ${amount}
    </text>
  </g>
);

/** Plastic card prop (for hands). Centered at 0,0. */
export const CardProp: React.FC<{s?: number; color?: string}> = ({s = 1, color = '#f3b73c'}) => (
  <g transform={`scale(${s}) rotate(-20)`}>
    <rect x={-34} y={-22} width={68} height={44} rx={6} fill={color} stroke={INK} strokeWidth={3} />
    <rect x={-26} y={-8} width={14} height={11} rx={2} fill="#e8e1c8" stroke={INK} strokeWidth={1.5} />
  </g>
);

export const LatteCup: React.FC<{x?: number; y?: number; s?: number; steam?: number}> = ({x = 0, y = 0, s = 1, steam = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={4}>
    {[0, 1].map((i) => (
      <path key={i} d={`M ${-8 + i * 16} -78 q ${8 + Math.sin(steam / 8 + i) * 6} -16 0 -32`} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={5} strokeLinecap="round" />
    ))}
    <path d="M -30 -60 L 30 -60 L 24 0 L -24 0 Z" fill="#fffaf1" />
    <rect x={-34} y={-72} width={68} height={14} rx={5} fill="#8a5a3c" />
    <rect x={-28} y={-42} width={56} height={22} fill="#c98f5e" stroke="none" />
  </g>
);

// ============================================================== shared screen graphics
export const Panel: React.FC<{x: number; y: number; w: number; h: number; title?: string; color?: string; s?: number; children?: React.ReactNode}> = ({x, y, w, h, title, color = '#7b5ea7', s = 1, children}) => (
  <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-w / 2} ${-h / 2})`}>
    <rect x={14} y={18} width={w} height={h} rx={34} fill="rgba(0,0,0,0.25)" />
    <rect width={w} height={h} rx={34} fill={PAPER} stroke={INK} strokeWidth={6} />
    {title !== undefined && (
      <>
        <path d={`M 0 34 A 34 34 0 0 1 34 0 H ${w - 34} A 34 34 0 0 1 ${w} 34 V 84 H 0 Z`} fill={color} stroke={INK} strokeWidth={6} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={40 + i * 34} cy={42} r={10} fill={['#ff6b6b', '#f6c945', '#5fd38a'][i]} stroke={INK} strokeWidth={3} />
        ))}
        <text x={w / 2} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
          {title}
        </text>
      </>
    )}
    {children}
  </g>
);

/** Chapter chip, top-left (screen space). */
export const ChapterChip: React.FC<{t: number; label: string; color?: string; dur?: number}> = ({t, label, color = '#f6c945', dur = 150}) => {
  if (t < 0 || t > dur) return null;
  const a = pop(t, 12) * interpolate(t, [dur - 12, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 70, top: 64, transform: `translateX(${(1 - a) * -80}px)`, opacity: a, fontFamily: FONT, fontWeight: 700, fontSize: 40, background: color, color: INK, padding: '8px 26px', borderRadius: 16, border: `5px solid ${INK}`, boxShadow: '6px 8px 0 rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
      {label}
    </div>
  );
};

/** Big kinetic stat text in screen space (stays until `dur`). */
export const BigStat: React.FC<{t: number; text: string; x: number | string; y: number | string; size?: number; color?: string; dur?: number; rot?: number; sub?: string}> = ({t, text, x, y, size = 110, color = '#f6c945', dur = 9999, rot = -4, sub}) => {
  if (t < 0 || t > dur) return null;
  const s = pop(t, 10);
  const o = interpolate(t, [dur - 8, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, textAlign: 'center', fontFamily: FONT}}>
      <div style={{fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${Math.round(size / 14)}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', lineHeight: 1}}>{text}</div>
      {sub && <div style={{fontWeight: 600, fontSize: size * 0.32, color: '#fff', WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill', marginTop: 8, whiteSpace: 'nowrap'}}>{sub}</div>}
    </div>
  );
};

export const Confetti: React.FC<{t: number; n?: number; seed?: number}> = ({t, n = 60, seed = 1}) => {
  if (t < 0 || t > 150) return null;
  const cols = ['#f6c945', '#e8553e', '#4f9dde', '#5fd38a', '#e86a8f', '#a98bff'];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {Array.from({length: n}, (_, i) => {
          const r1 = Math.sin(i * 12.9898 + seed) * 43758.5453;
          const r = r1 - Math.floor(r1);
          const x = (i * 137 + seed * 71) % 1920;
          const y = -40 + t * (6 + r * 6) + Math.sin(t / 6 + i) * 20;
          return <rect key={i} x={x + Math.sin(t / 10 + i) * 30} y={y} width={16} height={26} fill={cols[i % cols.length]} transform={`rotate(${t * 8 + i * 30} ${x} ${y})`} opacity={interpolate(t, [120, 150], [1, 0], clamp)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================== STUDIO (host desk set)
export const Studio: React.FC<{frame: number; a?: string; b?: string; c?: string; cx?: number}> = ({frame, a = '#2a1f5c', b = '#1d5f7a', c = '#1f8f7a', cx = 560}) => (
  <g>
    <defs>
      <linearGradient id={`st-bg-${a}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="0.55" stopColor={b} />
        <stop offset="1" stopColor={c} />
      </linearGradient>
      <pattern id="st-grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="2" />
      </pattern>
      <radialGradient id="st-glow">
        <stop offset="0" stopColor="#ffe27a" stopOpacity="0.5" />
        <stop offset="1" stopColor="#ffe27a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-500} y={-400} width={2920} height={1900} fill={`url(#st-bg-${a})`} />
    <rect x={-500} y={-400} width={2920} height={1900} fill="url(#st-grid)" />
    <g transform={`translate(${cx} 560) rotate(${frame * 0.25})`} opacity={0.1}>
      {Array.from({length: 18}, (_, i) => (
        <path key={i} d="M 0 0 L -70 -1300 L 70 -1300 Z" fill="#fff" transform={`rotate(${i * 20})`} />
      ))}
    </g>
    <circle cx={cx} cy={560} r={420} fill="url(#st-glow)" />
    {['$', '%', '¢', '$', '%', '$', '¢', '$'].map((sym, i) => {
      const x = ((i * 263 + frame * (0.6 + (i % 3) * 0.25)) % 2300) - 180;
      const y = 120 + ((i * 97) % 520) + Math.sin(frame / 25 + i) * 18;
      return (
        <text key={i} x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize={50 + (i % 4) * 22} fill="#fff" opacity={0.1}>
          {sym}
        </text>
      );
    })}
    <rect x={-500} y={880} width={2920} height={700} fill="#132d40" />
    <rect x={-500} y={880} width={2920} height={6} fill="#3fd0b0" opacity={0.7} />
  </g>
);

export const OfficeChair: React.FC<{x: number; frame: number; color?: string}> = ({x, frame, color = '#e8553e'}) => {
  const swivel = Math.sin(frame / 18) * 3;
  return (
    <g transform={`translate(${x} 0)`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <ellipse cx={0} cy={902} rx={120} ry={14} fill="rgba(0,0,0,0.3)" stroke="none" />
      <path d="M -105 878 L 105 878" strokeWidth={12} stroke="#2e2e3e" />
      {[-105, -45, 45, 105].map((wx) => (
        <circle key={wx} cx={wx} cy={890} r={11} fill="#1f1f2b" />
      ))}
      <rect x={-9} y={812} width={18} height={62} fill="#9aa3b5" />
      <g transform={`rotate(${swivel} 0 800)`}>
        <rect x={-108} y={560} width={70} height={230} rx={30} fill={color} />
        <rect x={-80} y={770} width={16} height={40} fill="#45455a" />
        <rect x={-95} y={788} width={200} height={34} rx={16} fill={color} />
        <path d="M 70 790 L 70 740 L 120 740" fill="none" strokeWidth={10} stroke="#45455a" />
      </g>
    </g>
  );
};

// ============================================================== COFFEE SHOP "Bean Me Up"
export const CoffeeShop: React.FC<{frame: number; evening?: boolean}> = ({frame, evening}) => {
  const wall = evening ? '#6b3f4e' : '#8a5a3c';
  return (
    <g stroke={INK} strokeWidth={4}>
      <rect x={-400} y={-300} width={2720} height={1200} fill={wall} stroke="none" />
      {Array.from({length: 30}, (_, i) => (
        <rect key={i} x={-400 + i * 100} y={-300} width={50} height={1200} fill="#000" opacity={0.05} stroke="none" />
      ))}
      {/* window */}
      <rect x={1350} y={170} width={420} height={380} rx={16} fill={evening ? '#ff9a6b' : '#bfe8ff'} />
      {evening && <circle cx={1560} cy={470} r={70} fill="#ffd59e" stroke="none" />}
      <path d="M 1560 170 V 550 M 1350 360 H 1770" stroke="#5a3a2a" strokeWidth={10} />
      <text x={1560} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff" stroke="none" opacity={0.8} transform="scale(-1 1) translate(-3120 0)">
        BEAN ME UP
      </text>
      {/* menu board */}
      <rect x={180} y={110} width={620} height={330} rx={14} fill="#2b2b33" />
      <text x={490} y={175} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#f6c945" stroke="none">
        ☕ BEAN ME UP ☕
      </text>
      {[
        ['Drip coffee', '$2.50'],
        ['Oat caramel latte', '$6.00'],
        ['Croissant', '$3.75'],
        ['Existential muffin', '$4.25'],
      ].map(([n, p], i) => (
        <g key={n} stroke="none" fontFamily={FONT} fontSize={34} fill="#fffaf1">
          <text x={220} y={240 + i * 52}>{n}</text>
          <text x={760} y={240 + i * 52} textAnchor="end">{p}</text>
        </g>
      ))}
      {/* pendant lamps */}
      {[600, 1000, 1400].map((lx, i) => (
        <g key={lx} transform={`rotate(${Math.sin(frame / 40 + i) * 2} ${lx} -100)`}>
          <path d={`M ${lx} -100 V 90`} strokeWidth={3} />
          <path d={`M ${lx - 46} 130 Q ${lx} 70 ${lx + 46} 130 Z`} fill="#f6c945" />
          <ellipse cx={lx} cy={140} rx={60} ry={24} fill="#fff3a0" stroke="none" opacity={0.35} />
        </g>
      ))}
      <rect x={-400} y={900} width={2720} height={400} fill="#3a2a22" stroke="none" />
    </g>
  );
};

/** Counter + espresso machine + pastry case + card reader (draw in Stage `front`). Counter ends at x 1150. */
export const CoffeeCounter: React.FC<{readerLit?: number}> = ({readerLit = 0}) => (
  <g stroke={INK} strokeWidth={4}>
    <rect x={-400} y={640} width={1550} height={260} fill="#5a3a2a" />
    <rect x={-400} y={620} width={1560} height={30} rx={6} fill="#c98f5e" />
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} x={-380 + i * 190} y={680} width={150} height={190} rx={10} fill="#6b4532" stroke="#4a2e20" strokeWidth={3} />
    ))}
    <g transform="translate(360 620)">
      <rect x={-120} y={-170} width={240} height={170} rx={14} fill="#c0c7d6" />
      <rect x={-100} y={-200} width={200} height={34} rx={8} fill="#9aa3b5" />
      <circle cx={-50} cy={-110} r={22} fill="#fff" />
      <circle cx={50} cy={-110} r={22} fill="#fff" />
    </g>
    <rect x={560} y={500} width={300} height={124} rx={10} fill="#bfe8ff" fillOpacity={0.6} />
    {[610, 680, 750, 820].map((px) => (
      <path key={px} d={`M ${px - 26} 610 q 26 -46 52 0 z`} fill="#e0a85e" />
    ))}
    <g transform="translate(1080 620)">
      <rect x={-34} y={-90} width={68} height={90} rx={10} fill="#2b2b33" />
      <rect x={-24} y={-80} width={48} height={34} rx={4} fill={readerLit > 0 ? '#5fd38a' : '#3d6b55'} />
      {readerLit > 0 && <text y={-56} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={16} fill={INK} stroke="none">$6.00</text>}
    </g>
  </g>
);

// ============================================================== BANK OFFICE (Chad)
export const BankOffice: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4}>
    <rect x={-400} y={-300} width={2720} height={1200} fill="#efe6d3" stroke="none" />
    <rect x={-400} y={700} width={2720} height={200} fill="#d9ccb0" stroke="none" />
    {[220, 620, 1300, 1700].map((cx) => (
      <g key={cx}>
        <rect x={cx - 50} y={60} width={100} height={800} fill="#fffaf1" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${cx - 30 + i * 20} 80 V 840`} stroke="#d9ccb0" strokeWidth={3} />
        ))}
        <rect x={cx - 70} y={40} width={140} height={30} fill="#e9dfc6" />
        <rect x={cx - 70} y={850} width={140} height={30} fill="#e9dfc6" />
      </g>
    ))}
    {/* vault door */}
    <g transform={`translate(960 400)`}>
      <circle r={250} fill="#9aa3b5" />
      <circle r={200} fill="#c0c7d6" />
      <g transform={`rotate(${frame * 0.4})`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect key={a} x={-8} y={-150} width={16} height={110} rx={6} fill="#6b7385" transform={`rotate(${a})`} />
        ))}
        <circle r={50} fill="#6b7385" />
      </g>
      <text y={-212} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={INK} stroke="none">
        FIRST NATIONAL BANK OF MORE
      </text>
    </g>
    {/* portrait of Chad (gold frame) */}
    <rect x={1450} y={180} width={160} height={200} fill="#d4af37" />
    <rect x={1466} y={196} width={128} height={168} fill="#2c3e66" />
    <circle cx={1530} cy={260} r={36} fill="#f2c9a4" />
    <path d="M 1494 248 q 36 -50 72 0 q -36 -22 -72 0 z" fill="#d9a441" />
    {/* desk */}
    <rect x={1180} y={680} width={560} height={40} rx={8} fill="#6b3f2a" />
    <rect x={1200} y={720} width={520} height={180} fill="#5a3322" />
    <rect x={1500} y={620} width={120} height={60} rx={6} fill="#d4af37" />
    <text x={1560} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={INK} stroke="none">
      VP LENDING
    </text>
    <rect x={-400} y={900} width={2720} height={400} fill="#a88b5e" stroke="none" />
  </g>
);

// ============================================================== TACO TRUCK street
export const TacoTruck: React.FC<{x: number; frame: number}> = ({x, frame}) => (
  <g transform={`translate(${x} 0)`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <ellipse cx={0} cy={905} rx={520} ry={24} fill="rgba(0,0,0,0.25)" stroke="none" />
    <rect x={-480} y={360} width={960} height={480} rx={40} fill="#ff8f3a" />
    <rect x={-480} y={720} width={960} height={120} rx={20} fill="#e8553e" />
    {/* serving window */}
    <rect x={-330} y={440} width={560} height={240} rx={14} fill="#3a2a22" />
    <path d={`M -350 440 L -360 380 L 250 380 L 240 440 Z`} fill="#5fd38a" />
    {Array.from({length: 8}, (_, i) => (
      <path key={i} d={`M ${-360 + i * 76} 380 l 38 34 l 38 -34`} fill="#fffaf1" />
    ))}
    <rect x={-350} y={676} width={600} height={30} rx={6} fill="#c0c7d6" />
    {/* cab */}
    <path d="M 480 520 L 620 560 L 640 840 L 480 840 Z" fill="#ff8f3a" />
    <path d="M 500 545 L 600 570 L 610 680 L 500 680 Z" fill="#bfe8ff" />
    {[-300, 380].map((wx) => (
      <g key={wx} transform={`translate(${wx} 850)`}>
        <circle r={62} fill="#2b2333" />
        <circle r={28} fill="#9aa3b5" />
      </g>
    ))}
    {/* sign */}
    <rect x={-300} y={250} width={500} height={110} rx={20} fill="#f6c945" />
    <text x={-50} y={325} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#e8553e" stroke="none">
      ROSA'S 🌮
    </text>
    {/* cash is king sign */}
    <g transform={`translate(300 520) rotate(${Math.sin(frame / 20) * 3})`}>
      <rect x={-80} y={-50} width={160} height={100} rx={10} fill="#fffaf1" />
      <text y={-8} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#2f6b38" stroke="none">CASH IS</text>
      <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#2f6b38" stroke="none">KING 👑</text>
    </g>
  </g>
);

// ============================================================== GRANDMA'S KITCHEN
export const Kitchen: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4}>
    <rect x={-400} y={-300} width={2720} height={1200} fill="#cfe9d8" stroke="none" />
    {Array.from({length: 40}, (_, i) =>
      Array.from({length: 14}, (_, j) => <rect key={`${i}-${j}`} x={-400 + i * 70} y={-300 + j * 70} width={70} height={70} fill={(i + j) % 2 ? '#bfe0cb' : 'none'} stroke="none" />),
    )}
    {/* cabinets */}
    <rect x={1200} y={120} width={700} height={220} rx={10} fill="#fff6e6" />
    <path d="M 1433 120 V 340 M 1666 120 V 340" />
    <rect x={1200} y={560} width={700} height={340} fill="#fff6e6" />
    <rect x={1190} y={540} width={720} height={30} fill="#e8b4a0" />
    {/* fridge with magnets */}
    <rect x={60} y={200} width={300} height={700} rx={24} fill="#fffaf1" />
    <path d="M 60 460 H 360 M 320 260 V 420 M 320 500 V 700" strokeWidth={6} />
    <rect x={110} y={520} width={140} height={100} fill="#fff" transform="rotate(-6 180 570)" />
    <text x={180} y={565} textAnchor="middle" fontFamily={FONT} fontSize={20} fill={INK} stroke="none" transform="rotate(-6 180 570)">STATEMENT</text>
    <text x={180} y={595} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#2fbf71" stroke="none" transform="rotate(-6 180 570)">PAID ✓</text>
    {/* window w/ flowers */}
    <rect x={560} y={140} width={420} height={320} rx={14} fill="#bfe8ff" />
    <path d="M 770 140 V 460 M 560 300 H 980" stroke="#fff" strokeWidth={10} />
    <path d={`M 540 140 Q ${620 + Math.sin(frame / 30) * 10} 300 600 470 L 540 470 Z M 1000 140 Q ${920 + Math.sin(frame / 30) * 10} 300 940 470 L 1000 470 Z`} fill="#e86a8f" />
    <rect x={540} y={460} width={460} height={26} rx={6} fill="#fff6e6" />
    {/* clock */}
    <circle cx={1550} cy={440} r={60} fill="#fffaf1" />
    <path d={`M 1550 440 L ${1550 + Math.sin(frame / 60) * 40} ${440 - Math.cos(frame / 60) * 40} M 1550 440 L 1570 410`} strokeWidth={5} />
    <rect x={-400} y={900} width={2720} height={400} fill="#d8b98f" stroke="none" />
    {Array.from({length: 30}, (_, i) => (
      <path key={i} d={`M ${-400 + i * 100} 900 V 1300`} stroke="#c4a37a" strokeWidth={3} />
    ))}
  </g>
);

export const KitchenTable: React.FC<{x: number}> = ({x}) => (
  <g transform={`translate(${x} 0)`} stroke={INK} strokeWidth={4}>
    <ellipse cx={0} cy={905} rx={300} ry={20} fill="rgba(0,0,0,0.2)" stroke="none" />
    <rect x={-300} y={700} width={600} height={30} rx={8} fill="#c98f5e" />
    <path d="M -300 712 q 300 60 600 0" fill="#fffaf1" stroke="#e86a8f" strokeWidth={4} />
    <rect x={-260} y={730} width={24} height={170} fill="#8a5a3c" />
    <rect x={236} y={730} width={24} height={170} fill="#8a5a3c" />
  </g>
);

export const Tombstone: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5}>
    <ellipse cx={0} cy={6} rx={220} ry={24} fill="#4f8f4a" stroke="none" />
    <path d="M -170 0 V -300 A 170 150 0 0 1 170 -300 V 0 Z" fill="#b8bcc8" />
    <path d="M -140 -20 V -290 A 140 120 0 0 1 140 -290 V -20" fill="none" stroke="#9aa0ae" strokeWidth={4} />
    <text y={-330} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK} stroke="none">HERE LIES</text>
    <text y={-270} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK} stroke="none">RUTH</text>
    <text y={-200} textAnchor="middle" fontFamily={FONT} fontSize={30} fill={INK} stroke="none">Never paid</text>
    <text y={-160} textAnchor="middle" fontFamily={FONT} fontSize={30} fill={INK} stroke="none">interest.</text>
    <text y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#2fbf71" stroke="none">PROUD DEADBEAT</text>
    {[-130, -90, 100, 140].map((fx, i) => (
      <g key={fx} transform={`translate(${fx} -10)`}>
        <path d="M 0 0 V -40" stroke="#3f8f4a" strokeWidth={4} />
        <circle cy={-46} r={12} fill={['#e86a8f', '#f6c945', '#a98bff', '#e8553e'][i]} strokeWidth={3} />
      </g>
    ))}
  </g>
);

// ============================================================== SNOWY HILL
export const SnowHill: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4}>
    <defs>
      <linearGradient id="snow-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fb3d5" />
        <stop offset="1" stopColor="#e6f3ff" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1400} fill="url(#snow-sky)" stroke="none" />
    {Array.from({length: 40}, (_, i) => {
      const x = (i * 211 + frame * (1 + (i % 3) * 0.4)) % 2400 - 200;
      const y = (i * 137 + frame * (2 + (i % 4) * 0.6)) % 1100 - 50;
      return <circle key={i} cx={x + Math.sin(frame / 20 + i) * 14} cy={y} r={3 + (i % 3) * 2} fill="#fff" stroke="none" />;
    })}
    <path d="M -400 520 L 300 180 L 700 380 L 1100 120 L 1700 420 L 2320 300 L 2320 900 L -400 900 Z" fill="#dfeaf5" />
    <path d="M 300 180 L 380 230 L 330 250 L 260 210 Z M 1100 120 L 1190 175 L 1120 190 L 1040 160 Z" fill="#fff" stroke="none" />
    {/* big slope from top-left to bottom-right */}
    <path d="M -400 300 Q 600 420 2320 860 L 2320 1300 L -400 1300 Z" fill="#fffaf1" />
    {[150, 420, 1600, 1850].map((tx, i) => (
      <g key={tx} transform={`translate(${tx} ${i < 2 ? 520 : 860})`}>
        <path d="M 0 -200 L 70 -40 L -70 -40 Z M 0 -130 L 90 30 L -90 30 Z" fill="#3f8f6a" />
        <rect x={-12} y={30} width={24} height={40} fill="#6b4d3a" />
        <path d="M 0 -200 L 30 -130 L -30 -130 Z" fill="#fff" />
      </g>
    ))}
  </g>
);

// ============================================================== GAME SHOW
export const GameShow: React.FC<{frame: number; lights?: number}> = ({frame, lights = 1}) => (
  <g stroke={INK} strokeWidth={4}>
    <rect x={-400} y={-300} width={2720} height={1400} fill="#1b1240" stroke="none" />
    {Array.from({length: 12}, (_, i) => (
      <path key={i} d={`M ${-200 + i * 200} -300 L ${-140 + i * 200 + Math.sin(frame / 14 + i) * 120} 900 L ${-60 + i * 200 + Math.sin(frame / 14 + i) * 120} 900 Z`} fill={['#e86a8f', '#4f9dde', '#f6c945'][i % 3]} opacity={0.12 * lights} stroke="none" />
    ))}
    {/* marquee bulbs */}
    <rect x={160} y={60} width={1600} height={140} rx={30} fill="#e8553e" />
    {Array.from({length: 30}, (_, i) => (
      <circle key={i} cx={190 + i * 53} cy={74} r={8} fill={(i + Math.floor(frame / 5)) % 3 === 0 ? '#fff3a0' : '#7a5a2a'} strokeWidth={2} />
    ))}
    <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={84} fill="#f6c945" stroke={INK} strokeWidth={8} paintOrder="stroke">
      WHEEL OF POINTS!
    </text>
    <rect x={-400} y={860} width={2720} height={500} fill="#2b1f5c" />
    <path d="M -400 860 H 2320" stroke="#f6c945" strokeWidth={6} />
  </g>
);

export const Wheel: React.FC<{x: number; y: number; r: number; spin: number}> = ({x, y, r, spin}) => {
  const labels = ['2X', '50', 'BANKRUPT', '100', '5X', '25', 'FREE*', '10'];
  const cols = ['#e8553e', '#4f9dde', '#2b2333', '#5fd38a', '#a98bff', '#f6c945', '#e86a8f', '#ff8f3a'];
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={5}>
      <rect x={-20} y={0} width={40} height={r + 220} fill="#6b7385" />
      <g transform={`rotate(${spin})`}>
        {labels.map((l, i) => {
          const a0 = (i / 8) * Math.PI * 2;
          const a1 = ((i + 1) / 8) * Math.PI * 2;
          return (
            <g key={l}>
              <path d={`M 0 0 L ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`} fill={cols[i]} />
              <text transform={`rotate(${((i + 0.5) / 8) * 360}) translate(${r * 0.62} 0) rotate(90)`} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={l.length > 5 ? 24 : 40} fill="#fff" stroke="none" y={12}>
                {l}
              </text>
            </g>
          );
        })}
        <circle r={40} fill="#f6c945" />
      </g>
      <path d={`M 0 ${-r - 40} L -22 ${-r + 10} L 22 ${-r + 10} Z`} fill="#fffaf1" />
    </g>
  );
};

export const Podium: React.FC<{x: number; label: string; color?: string}> = ({x, label, color = '#4f9dde'}) => (
  <g transform={`translate(${x} 0)`} stroke={INK} strokeWidth={5}>
    <path d="M -130 640 L 130 640 L 110 900 L -110 900 Z" fill={color} />
    <rect x={-140} y={620} width={280} height={30} rx={8} fill="#f6c945" />
    <rect x={-90} y={690} width={180} height={70} rx={10} fill="#2b2333" />
    <text y={738} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#5fd38a" stroke="none">
      {label}
    </text>
  </g>
);

// ============================================================== MALL at night
export const Mall: React.FC<{frame: number}> = ({frame}) => {
  const shops = [
    {name: 'HOODIE HUT', c: '#e86a8f'},
    {name: 'GADGET GALAXY', c: '#4f9dde'},
    {name: 'SNEAKER STORM', c: '#f6c945'},
    {name: 'SHINY THINGS', c: '#a98bff'},
  ];
  return (
    <g stroke={INK} strokeWidth={4}>
      <rect x={-400} y={-300} width={2720} height={1400} fill="#191433" stroke="none" />
      <rect x={-400} y={-300} width={2720} height={260} fill="#251d4a" stroke="none" />
      {shops.map((sh, i) => {
        const x = -60 + i * 520;
        const flick = (frame + i * 13) % 140 < 3 ? 0.4 : 1;
        return (
          <g key={sh.name}>
            <rect x={x} y={160} width={460} height={700} fill="#2b2350" />
            <rect x={x + 30} y={330} width={400} height={500} fill="#3a3070" />
            <rect x={x + 30} y={330} width={400} height={500} fill={sh.c} opacity={0.12} stroke="none" />
            <text x={x + 230} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill={sh.c} stroke="none" opacity={flick} style={{filter: `drop-shadow(0 0 10px ${sh.c})`}}>
              {sh.name}
            </text>
            <rect x={x + 120} y={420} width={220} height={60} rx={10} fill="#e8553e" />
            <text x={x + 230} y={464} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#fff" stroke="none">
              SALE 50%
            </text>
          </g>
        );
      })}
      <rect x={-400} y={860} width={2720} height={500} fill="#2a2440" />
      <path d="M -400 860 H 2320" stroke="#a98bff" strokeWidth={4} />
      <ellipse cx={960} cy={960} rx={900} ry={40} fill="#a98bff" opacity={0.08} stroke="none" />
    </g>
  );
};

// ============================================================== Fee montage cards
export const FeeCard: React.FC<{kind: 'late' | 'annual' | 'atm' | 'paris'; frame: number; t: number}> = ({kind, frame, t}) => {
  const bg = {late: '#e8553e', annual: '#a98bff', atm: '#4f9dde', paris: '#e86a8f'}[kind];
  const title = {late: 'LATE FEE', annual: 'ANNUAL FEE', atm: 'CASH ADVANCE', paris: 'FOREIGN FEE'}[kind];
  const price = {late: '−$40', annual: '−$95/yr', atm: '5% + interest NOW', paris: '+3%'}[kind];
  const s = pop(t, 10);
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1400} fill={bg} />
      {Array.from({length: 16}, (_, i) => (
        <path key={i} d="M 960 540 L -500 -300 L -300 -300 Z" fill="#fff" opacity={0.08} transform={`rotate(${i * 22.5 + frame * 0.6} 960 540)`} />
      ))}
      <g transform={`translate(960 470) scale(${s})`} stroke={INK} strokeWidth={6}>
        {kind === 'late' && (
          <g>
            <circle r={190} fill="#fffaf1" />
            <path d={`M 0 0 L ${Math.sin(frame / 3) * 140} ${-Math.cos(frame / 3) * 140} M 0 0 L ${Math.sin(frame / 30) * 90} ${-Math.cos(frame / 30) * 90}`} strokeWidth={12} strokeLinecap="round" />
            <circle r={14} fill={INK} />
            {/* monster teeth on the clock */}
            <path d="M -120 120 L -90 160 L -60 120 L -30 160 L 0 120 L 30 160 L 60 120 L 90 160 L 120 120" fill="#fff" />
            <path d="M -80 -230 l -60 -60 M 80 -230 l 60 -60" strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
        {kind === 'annual' && (
          <g>
            <rect x={-200} y={-60} width={400} height={180} rx={20} fill="#f6c945" />
            <rect x={-200} y={-60} width={400} height={50} rx={20} fill="#fffaf1" />
            <rect x={-150} y={-190} width={300} height={130} rx={16} fill="#e86a8f" />
            {[-80, 0, 80].map((cx) => (
              <g key={cx}>
                <rect x={cx - 8} y={-260} width={16} height={70} fill="#4f9dde" strokeWidth={3} />
                <path d={`M ${cx} -300 q 14 ${18 + Math.sin(frame / 3 + cx) * 4} 0 30 q -14 -12 0 -30`} fill="#ff8f3a" strokeWidth={3} />
              </g>
            ))}
            <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK} stroke="none">Happy card-iversary!</text>
          </g>
        )}
        {kind === 'atm' && (
          <g>
            <rect x={-170} y={-260} width={340} height={480} rx={20} fill="#c0c7d6" />
            <rect x={-130} y={-220} width={260} height={160} rx={10} fill="#2b2333" />
            <text y={-130} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={34} fill="#5fd38a" stroke="none">FEE: 5%</text>
            <rect x={-100} y={40} width={200} height={20} rx={6} fill={INK} />
            {[0, 1, 2].map((i) => {
              const bt = (frame + i * 12) % 36;
              return <rect key={i} x={-70 + i * 10} y={50 + bt * 6} width={140} height={60} rx={6} fill="#8fd18a" strokeWidth={4} transform={`rotate(${bt * 2 - 20} 0 ${80 + bt * 6})`} />;
            })}
          </g>
        )}
        {kind === 'paris' && (
          <g>
            <path d="M 0 -300 L 70 120 L 40 120 L 0 -100 L -40 120 L -70 120 Z" fill="#8a7a6a" />
            <path d="M -110 120 Q 0 -20 110 120 Z" fill="#8a7a6a" />
            <rect x={-60} y={-60} width={120} height={18} fill="#8a7a6a" />
            <g transform={`translate(230 80) rotate(${Math.sin(frame / 8) * 10})`}>
              <path d="M -110 0 Q -60 -90 0 -100 Q 60 -90 110 0 Q 50 40 0 30 Q -50 40 -110 0 Z" fill="#e0a85e" />
              {[-60, -20, 20, 60].map((cx) => (
                <path key={cx} d={`M ${cx} -88 Q ${cx + 16} -30 ${cx} 26`} fill="none" strokeWidth={4} />
              ))}
            </g>
          </g>
        )}
      </g>
      <text x={960} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill="#fff" stroke={INK} strokeWidth={12} paintOrder="stroke" transform={`rotate(-3 960 850)`}>
        {title}
      </text>
      <text x={960} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill="#f6c945" stroke={INK} strokeWidth={10} paintOrder="stroke">
        {price}
      </text>
    </g>
  );
};

// ============================================================== Game HUD (credit score)
export const ScoreGauge: React.FC<{x: number; y: number; r: number; score: number}> = ({x, y, r, score}) => {
  const u = (score - 300) / 550;
  const a = Math.PI * (1 - u);
  const segs = ['#e8553e', '#ff8f3a', '#f6c945', '#9ad36a', '#2fbf71'];
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={5}>
      {segs.map((c, i) => {
        const a0 = Math.PI * (1 - i / 5);
        const a1 = Math.PI * (1 - (i + 1) / 5);
        return <path key={c} d={`M ${Math.cos(a0) * r} ${-Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${-Math.sin(a1) * r} L ${Math.cos(a1) * r * 0.62} ${-Math.sin(a1) * r * 0.62} A ${r * 0.62} ${r * 0.62} 0 0 0 ${Math.cos(a0) * r * 0.62} ${-Math.sin(a0) * r * 0.62} Z`} fill={c} />;
      })}
      <path d={`M 0 0 L ${Math.cos(a) * r * 0.85} ${-Math.sin(a) * r * 0.85}`} strokeWidth={12} strokeLinecap="round" />
      <circle r={22} fill={INK} />
      <text y={80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill="#fff" strokeWidth={8} paintOrder="stroke">
        {Math.round(score)}
      </text>
      <text x={-r} y={40} textAnchor="middle" fontFamily={FONT} fontSize={28} fill="#fff" stroke="none">300</text>
      <text x={r} y={40} textAnchor="middle" fontFamily={FONT} fontSize={28} fill="#fff" stroke="none">850</text>
    </g>
  );
};
