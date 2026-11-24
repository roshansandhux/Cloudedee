// Episode 1 sets, props and creature. (Library-quality: reusable later, but these exact locations belong to ep01.)
import React from 'react';
import {interpolate, interpolateColors, random} from 'remotion';
import {INK, FONT} from '../../lib/theme';
import {Character} from '../../rig/Character';
import {lookOf} from '../../cast';

const sw = 4;
const X0 = -1600;
const X1 = 4800;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ───────────────────────── APARTMENT ─────────────────────────
export const Apartment: React.FC<{frame: number; night?: boolean; blinds?: number}> = ({frame, night, blinds = 0}) => (
  <g>
    <defs>
      <linearGradient id="apt-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={night ? '#2e2a4a' : '#e9c9a4'} />
        <stop offset="1" stopColor={night ? '#221f38' : '#d9ae86'} />
      </linearGradient>
    </defs>
    <rect x={X0} y={-1400} width={X1 - X0} height={2260} fill="url(#apt-wall)" />
    {/* wallpaper stripes */}
    {Array.from({length: 50}).map((_, i) => (
      <rect key={i} x={X0 + i * 110} y={-1400} width={40} height={2260} fill="#000" opacity={0.04} />
    ))}
    {/* window with blinds */}
    <g transform="translate(1420 180)" stroke={INK} strokeWidth={sw}>
      <rect x={-230} y={0} width={460} height={420} fill={night ? '#0e1236' : '#ffc77a'} />
      {night ? <circle cx={120} cy={110} r={40} fill="#fffbe6" stroke="none" /> : <circle cx={110} cy={120} r={70} fill="#fff1b8" stroke="none" opacity={0.9} />}
      {/* city silhouette in window */}
      <path d="M -230 420 L -230 300 L -170 300 L -170 250 L -100 250 L -100 320 L -40 320 L -40 220 L 40 220 L 40 300 L 110 300 L 110 260 L 170 260 L 170 330 L 230 330 L 230 420 Z" fill={night ? '#1b1f40' : '#d58a5a'} stroke="none" />
      {/* blinds slats (open amount 0..1 lifts them) */}
      {Array.from({length: 14}).map((_, i) => {
        const y = i * 30 * (1 - blinds) + 4;
        return <rect key={i} x={-226} y={y} width={452} height={22 * (1 - blinds * 0.7)} fill={night ? '#3d3a5c' : '#f5e6cc'} strokeWidth={2} opacity={0.95} />;
      })}
      <rect x={-250} y={-20} width={500} height={460} fill="none" strokeWidth={14} stroke={night ? '#4a4566' : '#fff3e0'} />
    </g>
    {/* posters */}
    <g transform="translate(330 220) rotate(-3)" stroke={INK} strokeWidth={sw}>
      <rect x={-110} y={0} width={220} height={300} fill="#2b2333" />
      <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#7cff8a" stroke="none">
        DEAD
      </text>
      <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#7cff8a" stroke="none">
        ZONE 7
      </text>
      <circle cx={0} cy={190} r={50} fill="#9fb59a" />
      <circle cx={-16} cy={180} r={10} fill="#fff" />
      <circle cx={18} cy={184} r={13} fill="#fff" />
    </g>
    <g transform="translate(700 260) rotate(4)" stroke={INK} strokeWidth={sw}>
      <rect x={-80} y={0} width={160} height={110} fill="#f6c945" />
      <text x={0} y={66} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={INK} stroke="none">
        GG EZ
      </text>
    </g>
    {/* floor */}
    <rect x={X0} y={860} width={X1 - X0} height={1800} fill={night ? '#3a2a2a' : '#a86d48'} />
    {Array.from({length: 40}).map((_, i) => (
      <line key={i} x1={X0 + i * 150} y1={870} x2={X0 + i * 150 - 260} y2={2600} stroke="#000" opacity={0.12} strokeWidth={3} />
    ))}
    <rect x={X0} y={834} width={X1 - X0} height={30} fill={night ? '#2a2238' : '#8a5a3a'} />
    {/* rug */}
    <ellipse cx={900} cy={960} rx={620} ry={90} fill={night ? '#3d2f5a' : '#7b5ea7'} opacity={0.85} />
  </g>
);

/** Big TV on a stand. screen: render-prop for whatever is on it (drawn in a 400×240 box). */
export const TV: React.FC<{x: number; y?: number; children?: React.ReactNode; glow?: string}> = ({x, y = 860, children, glow = '#7fb6ff'}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={4} rx={300} ry={30} fill="rgba(0,0,0,0.25)" />
    <circle cx={0} cy={-330} r={420} fill={glow} opacity={0.12} />
    <rect x={-260} y={-120} width={520} height={120} rx={10} fill="#5a3d2a" stroke={INK} strokeWidth={sw} />
    <rect x={-240} y={-100} width={140} height={60} rx={6} fill="#2b2333" stroke={INK} strokeWidth={3} />
    <rect x={-60} y={-90} width={90} height={20} rx={4} fill="#3a3348" stroke={INK} strokeWidth={3} />
    <rect x={-230} y={-460} width={460} height={300} rx={14} fill="#1c1a24" stroke={INK} strokeWidth={sw} />
    <svg x={-210} y={-440} width={420} height={260} viewBox="0 0 400 240" preserveAspectRatio="none" overflow="hidden">
      <rect width={400} height={240} fill="#0c0f1e" />
      {children}
    </svg>
    <rect x={-20} y={-160} width={40} height={40} fill="#2b2333" />
  </g>
);

/** Retro pixel zombie game on the TV (scene 1). */
export const PixelGame: React.FC<{frame: number; over?: boolean}> = ({frame, over}) => (
  <g>
    <rect width={400} height={240} fill="#14203a" />
    <rect y={180} width={400} height={60} fill="#2b4a2b" />
    {[0, 1, 2, 3].map((i) => {
      const x = ((i * 110 + 400 - frame * 1.5) % 440) - 20;
      return (
        <g key={i} transform={`translate(${x} 150)`}>
          <rect x={0} y={0} width={18} height={30} fill="#8fc06a" />
          <rect x={4} y={6} width={4} height={4} fill="#f00" />
          <rect x={-8} y={10} width={10} height={5} fill="#8fc06a" />
        </g>
      );
    })}
    <g transform={`translate(${60 + Math.sin(frame / 6) * 6} 150)`}>
      <rect width={16} height={30} fill="#4f9dde" />
      <rect x={16} y={10} width={14} height={4} fill="#ddd" />
    </g>
    {!over && frame % 16 < 8 && <rect x={95} y={160} width={30} height={3} fill="#ff0" />}
    <text x={10} y={22} fontFamily="monospace" fontSize={16} fill="#fff">
      SCORE 004200
    </text>
    {over && (
      <g>
        <rect width={400} height={240} fill="#000" opacity={0.6} />
        <text x={200} y={130} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={44} fill="#ff3b3b">
          GAME OVER
        </text>
      </g>
    )}
  </g>
);

/** News broadcast on TV (scene 2). zombie 0..1 turns the anchor; static covers it. */
export const NewsBroadcast: React.FC<{frame: number; zombie: number; staticAmt: number; talk: number}> = ({frame, zombie, staticAmt, talk}) => {
  const base = lookOf('anchor');
  const look = {...base, skin: interpolateColors(zombie, [0, 1], [base.skin, '#a3b88c']), eyeBags: zombie > 0.5, zombie: zombie > 0.85};
  return (
    <g>
      <rect width={400} height={240} fill="#20305a" />
      <rect x={250} y={30} width={130} height={90} fill="#2f4a8a" />
      <text x={315} y={85} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#f6c945">
        🍞
      </text>
      <g transform="translate(130 300) scale(0.5)">
        <Character uid="tvanchor" look={look} frame={frame} talk={talk} mood={zombie > 0.3 ? 'sleepy' : 'neutral'} lean={zombie * 10} />
      </g>
      <rect x={0} y={190} width={400} height={50} fill="#c0392b" />
      <rect x={0} y={190} width={90} height={50} fill="#fff" />
      <text x={45} y={222} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={20} fill="#c0392b">
        LIVE
      </text>
      <text x={100 - ((frame * 2) % 600) + 300} y={223} fontFamily={FONT} fontWeight={700} fontSize={20} fill="#fff">
        BREAKING: DO NOT EAT THE BREAD • STAY INDOORS • DO NOT EAT THE BREAD
      </text>
      {staticAmt > 0 &&
        Array.from({length: 120}).map((_, i) => (
          <rect key={i} x={random(`st${i}${frame}`) * 400} y={random(`sy${i}${frame}`) * 240} width={30 + random(`sw${i}`) * 60} height={3} fill={random(`sc${i}${frame}`) > 0.5 ? '#fff' : '#444'} opacity={staticAmt} />
        ))}
    </g>
  );
};

export const Couch: React.FC<{x: number; y?: number; color?: string}> = ({x, y = 900, color = '#5a7a9a'}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <ellipse cx={0} cy={4} rx={340} ry={36} fill="rgba(0,0,0,0.25)" stroke="none" />
    <rect x={-320} y={-280} width={640} height={170} rx={50} fill={color} />
    <rect x={-330} y={-150} width={660} height={120} rx={34} fill={color} />
    <rect x={-300} y={-160} width={290} height={40} rx={18} fill="#6d8fb0" />
    <rect x={10} y={-160} width={290} height={40} rx={18} fill="#6d8fb0" />
    <rect x={-370} y={-220} width={80} height={200} rx={34} fill={color} />
    <rect x={290} y={-220} width={80} height={200} rx={34} fill={color} />
    <path d="M -200 -250 q 30 20 60 0" stroke="#3d5a78" fill="none" />
  </g>
);

export const PizzaBox: React.FC<{x: number; y: number; rot?: number; open?: boolean}> = ({x, y, rot = 0, open}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={INK} strokeWidth={3}>
    <rect x={-70} y={-16} width={140} height={16} fill="#e7d3a8" />
    <rect x={-70} y={-22} width={140} height={8} fill="#f2e2bd" />
    {open && <path d="M -60 -20 L 0 -30 L 60 -20" fill="#f6c945" />}
    <circle cx={0} cy={-9} r={5} fill="#c0392b" stroke="none" />
  </g>
);
export const Can: React.FC<{x: number; y: number; color?: string; down?: boolean}> = ({x, y, color = '#c0392b', down}) => (
  <g transform={`translate(${x} ${y}) rotate(${down ? 90 : 0})`} stroke={INK} strokeWidth={3}>
    <rect x={-12} y={-40} width={24} height={40} rx={4} fill={color} />
    <rect x={-12} y={-30} width={24} height={10} fill="#fff" opacity={0.5} />
  </g>
);
export const Controller: React.FC<{color?: string}> = ({color = '#2f2f3a'}) => (
  <g stroke={INK} strokeWidth={3}>
    <path d="M -34 -6 Q -40 -26 -18 -26 L 18 -26 Q 40 -26 34 -6 Q 30 12 16 6 L -16 6 Q -30 12 -34 -6 Z" fill={color} />
    <circle cx={16} cy={-14} r={4} fill="#e8553e" strokeWidth={0} />
    <circle cx={-16} cy={-14} r={5} fill="#5a5a6a" strokeWidth={0} />
  </g>
);
export const Fridge: React.FC<{x: number; y?: number; open?: number; frame: number}> = ({x, y = 860, open = 0, frame}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <rect x={-120} y={-560} width={240} height={560} rx={18} fill="#e8eef5" />
    {open > 0 && (
      <g>
        <rect x={-104} y={-540} width={208} height={520} fill="#fffbe8" />
        <circle cx={0} cy={-470} r={140} fill="#fffbe0" opacity={0.6} stroke="none" />
        {[-420, -300, -180].map((sy) => (
          <line key={sy} x1={-104} y1={sy} x2={104} y2={sy} strokeWidth={3} />
        ))}
        {/* one olive + a sad ketchup */}
        <circle cx={-30} cy={-312} r={9} fill="#5a6b2a" />
        <g transform={`translate(40 -180) rotate(${Math.sin(frame / 10) * 2})`}>
          <rect x={-14} y={-70} width={28} height={70} rx={8} fill="#d63a2a" />
          <rect x={-6} y={-86} width={12} height={18} fill="#fff" />
        </g>
      </g>
    )}
    <g transform={`translate(${-120 + 240 * (1 - open)} 0) scale(${1 - open * 0.9} 1)`}>
      <rect x={-240 + 0} y={-560} width={240} height={560} rx={18} fill="#dfe7ef" transform="translate(0 0)" />
    </g>
    <rect x={88 - open * 200} y={-420} width={12} height={110} rx={6} fill="#9aa3ad" opacity={1 - open} />
    <g transform="translate(-40 -470)" opacity={1 - open}>
      <rect x={-34} y={-24} width={68} height={48} fill="#fff6c2" strokeWidth={2} />
      <text x={0} y={6} textAnchor="middle" fontFamily={FONT} fontSize={14} fill={INK} stroke="none">
        BUY FOOD
      </text>
    </g>
  </g>
);

// ───────────────────────── PROPS IN HAND ─────────────────────────
export const BroomSpatula: React.FC<{glint?: number}> = ({glint = 0}) => (
  <g transform="rotate(-35)" stroke={INK} strokeWidth={3}>
    <rect x={-5} y={-230} width={10} height={300} rx={4} fill="#c98f5e" />
    <path d="M -26 70 L 26 70 L 34 130 L -34 130 Z" fill="#e8cf6a" />
    <rect x={-22} y={-280} width={44} height={56} rx={6} fill="#9aa3ad" />
    {[-12, 0, 12].map((x) => (
      <line key={x} x1={x} y1={-272} x2={x} y2={-236} stroke="#6b7280" />
    ))}
    <rect x={-10} y={-212} width={20} height={24} fill="#b0b4bc" strokeWidth={2} />
    {glint > 0 && <path d="M 0 -310 l 8 22 l 22 8 l -22 8 l -8 22 l -8 -22 l -22 -8 l 22 -8 Z" fill="#fff8b0" opacity={glint} />}
  </g>
);
export const Baguette: React.FC = () => (
  <g transform="rotate(-50)" stroke={INK} strokeWidth={3}>
    <rect x={-14} y={-200} width={28} height={230} rx={14} fill="#d9a35a" />
    {[-160, -110, -60, -10].map((y) => (
      <path key={y} d={`M -8 ${y} l 16 -18`} stroke="#a8743a" />
    ))}
  </g>
);
export const CheesePuffs: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`} stroke={INK} strokeWidth={3}>
    <path d="M -50 -150 L 50 -150 L 56 0 L -56 0 Z" fill="#ff7a1a" strokeLinejoin="round" />
    <path d="M -50 -150 l 10 -10 l 10 10 l 10 -10 l 10 10 l 10 -10 l 10 10 l 10 -10 l 10 10 l 10 -10 l 10 10" fill="none" />
    <text x={0} y={-96} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#fff6c2" stroke="none">
      EXTREME
    </text>
    <text x={0} y={-70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={18} fill="#fff6c2" stroke="none">
      FLAMIN&apos;
    </text>
    <circle cx={-14} cy={-36} r={10} fill="#ffb02e" />
    <circle cx={12} cy={-30} r={12} fill="#ffb02e" />
  </g>
);
export const Remote: React.FC = () => (
  <g stroke={INK} strokeWidth={3}>
    <rect x={-16} y={-40} width={36} height={44} rx={6} fill="#3a3348" />
    <line x1={10} y1={-40} x2={20} y2={-80} />
    <circle cx={20} cy={-82} r={4} fill="#e8553e" />
    <circle cx={2} cy={-20} r={6} fill="#f6c945" strokeWidth={2} />
  </g>
);
export const Flyer: React.FC = () => (
  <g stroke={INK} strokeWidth={3}>
    <rect x={-70} y={-100} width={140} height={100} fill="#fff6e6" />
    <text x={0} y={-74} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={16} fill="#c0392b" stroke="none">
      MAMA MOZZA&apos;S
    </text>
    <text x={0} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={12} fill={INK} stroke="none">
      NEW Miracle Sourdough!
    </text>
    <circle cx={0} cy={-22} r={16} fill="#d9a35a" />
  </g>
);
/** Remote-control car with a single pepperoni on top. */
export const RCCar: React.FC<{x: number; y: number; frame: number; flip?: boolean}> = ({x, y, frame, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} stroke={INK} strokeWidth={3}>
    <ellipse cx={0} cy={2} rx={60} ry={8} fill="rgba(0,0,0,0.25)" stroke="none" />
    <rect x={-50} y={-40} width={100} height={30} rx={10} fill="#e8553e" />
    <rect x={-20} y={-58} width={46} height={22} rx={6} fill="#bfe6ff" />
    <circle cx={0} cy={-66} r={14} fill="#c0392b" />
    <circle cx={-4} cy={-70} r={3} fill="#8a2a1a" strokeWidth={0} />
    <circle cx={5} cy={-63} r={2.5} fill="#8a2a1a" strokeWidth={0} />
    {[-32, 32].map((wx) => (
      <g key={wx} transform={`translate(${wx} -8) rotate(${frame * 30})`}>
        <circle r={12} fill="#2f2f3a" />
        <line x1={-12} y1={0} x2={12} y2={0} stroke="#888" />
      </g>
    ))}
  </g>
);

// ───────────────────────── DESTROYED CITY ─────────────────────────
export const DestroyedCity: React.FC<{frame: number; time?: 'day' | 'sunset' | 'night' | 'dawn'; seed?: string; base?: number}> = ({frame, time = 'day', seed = 'dc', base = 870}) => {
  const sky: Record<string, [string, string]> = {day: ['#f6a35c', '#ffe0a8'], sunset: ['#e8673f', '#ffc178'], night: ['#0b0f2e', '#272a5c'], dawn: ['#ffa98a', '#ffe3b5']};
  const night = time === 'night';
  const pal = night ? ['#2a2f52', '#33385e', '#262a4a', '#3a3a5e'] : ['#c98a6a', '#b0796a', '#d8a080', '#a8806e', '#c7967a', '#9a7a7a'];
  const blds: React.ReactNode[] = [];
  let x = X0;
  let i = 0;
  while (x < X1) {
    const r = (k: string) => random(`${seed}${i}${k}`);
    const w = 220 + r('w') * 220;
    const h = 380 + r('h') * 460;
    const col = pal[Math.floor(r('c') * pal.length)];
    const broken = r('b') > 0.45;
    const top = base - h;
    // jagged broken roofline
    const roof = broken
      ? `M ${x} ${top + 40} L ${x + w * 0.2} ${top + 10} L ${x + w * 0.35} ${top + 60} L ${x + w * 0.55} ${top - 10} L ${x + w * 0.7} ${top + 50} L ${x + w} ${top + 20}`
      : `M ${x} ${top} L ${x + w} ${top}`;
    const wins: React.ReactNode[] = [];
    for (let wy = top + 80; wy < base - 120; wy += 90)
      for (let wx = x + 30; wx < x + w - 50; wx += 70) {
        const rr = random(`${seed}${wx}${wy}`);
        const lit = night ? rr > 0.85 : false;
        wins.push(
          <g key={`${wx}-${wy}`}>
            <rect x={wx} y={wy} width={38} height={50} fill={lit ? '#ffd56a' : night ? '#141833' : rr > 0.6 ? '#3a2a2a' : '#ffd9a8'} stroke={INK} strokeWidth={3} />
            {rr < 0.3 && <path d={`M ${wx + 4} ${wy + 6} l 14 18 l -6 10 l 18 12`} stroke={INK} strokeWidth={2} fill="none" />}
          </g>,
        );
      }
    blds.push(
      <g key={i}>
        <path d={`${roof} L ${x + w} ${base} L ${x} ${base} Z`} fill={col} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
        <rect x={x} y={top + 40} width={w * 0.12} height={h - 40} fill="#000" opacity={0.08} />
        {wins}
        {r('s') > 0.6 && <rect x={x + w * 0.15} y={base - 240} width={w * 0.7} height={50} fill={night ? '#4a3a6a' : '#e8553e'} stroke={INK} strokeWidth={3} />}
      </g>,
    );
    x += w + 6;
    i++;
  }
  // smoke plumes
  const smoke = [-400, 600, 1500, 2400].map((sx, k) => (
    <g key={k} opacity={night ? 0.35 : 0.55}>
      {Array.from({length: 7}).map((_, j) => {
        const t = (frame * 0.6 + j * 60) % 420;
        return <circle key={j} cx={sx + Math.sin((t + k * 30) / 40) * 30 + t * 0.3} cy={base - 500 - t * 1.3} r={50 + t * 0.25} fill={night ? '#4a4a6a' : '#7a6a6a'} opacity={1 - t / 420} />;
      })}
    </g>
  ));
  return (
    <g>
      <defs>
        <linearGradient id={`${seed}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[time][0]} />
          <stop offset="1" stopColor={sky[time][1]} />
        </linearGradient>
      </defs>
      <rect x={X0} y={-1400} width={X1 - X0} height={base + 1400} fill={`url(#${seed}-sky)`} />
      {night ? (
        <>
          {Array.from({length: 60}).map((_, k) => (
            <circle key={k} cx={X0 + random(`st${k}`) * (X1 - X0)} cy={-600 + random(`sy${k}`) * 900} r={2 + random(`sr${k}`) * 2} fill="#fff" opacity={0.6} />
          ))}
          <circle cx={1500} cy={60} r={90} fill="#fffbe6" />
          <circle cx={1530} cy={45} r={80} fill="#0b0f2e" />
        </>
      ) : (
        <circle cx={time === 'dawn' ? 300 : 1550} cy={time === 'dawn' ? 500 : 120} r={180} fill="#fff1b8" opacity={0.85} />
      )}
      {/* far skyline */}
      <path d={`M ${X0} ${base - 300} ` + Array.from({length: 40}).map((_, k) => `L ${X0 + k * 130} ${base - 320 - random(`fs${k}`) * 260} L ${X0 + k * 130 + 120} ${base - 320 - random(`fs${k}`) * 260}`).join(' ') + ` L ${X1} ${base} L ${X0} ${base} Z`} fill={night ? '#181c3c' : '#e0a27a'} opacity={0.9} />
      {smoke}
      {blds}
      {/* street */}
      <rect x={X0} y={base} width={X1 - X0} height={1800} fill={night ? '#22243a' : '#7d7a80'} />
      <rect x={X0} y={base} width={X1 - X0} height={60} fill={night ? '#2e3048' : '#a8a2a0'} stroke={INK} strokeWidth={3} />
      {Array.from({length: 30}).map((_, k) => (
        <rect key={k} x={X0 + k * 220} y={base + 200} width={120} height={14} rx={6} fill="#e8e2c8" opacity={0.7} />
      ))}
      {/* cracks */}
      {[200, 900, 1700].map((cx, k) => (
        <path key={k} d={`M ${cx} ${base + 80} l 40 50 l -20 40 l 60 60 l -10 50`} stroke={INK} strokeWidth={4} fill="none" opacity={0.6} />
      ))}
    </g>
  );
};

/** Car on its roof, wheels up, maybe on fire. */
export const FlippedCar: React.FC<{x: number; y?: number; color?: string; fire?: boolean; frame: number}> = ({x, y = 960, color = '#4f9dde', fire, frame}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <ellipse cx={0} cy={4} rx={240} ry={26} fill="rgba(0,0,0,0.3)" stroke="none" />
    <path d="M -230 -140 Q -235 -70 -170 -60 L -110 -55 Q -70 30 30 30 Q 110 30 150 -50 L 210 -60 Q 240 -70 235 -140 Z" fill={color} strokeLinejoin="round" transform="translate(0 -30)" />
    {[-140, 140].map((wx) => (
      <g key={wx} transform={`translate(${wx} -190) rotate(${frame * 3})`}>
        <circle r={46} fill="#2f2f3a" />
        <circle r={20} fill="#c7c9d1" />
      </g>
    ))}
    {fire && <Fire x={40} y={-170} frame={frame} s={1.1} />}
  </g>
);
export const Fire: React.FC<{x: number; y: number; frame: number; s?: number}> = ({x, y, frame, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={0}>
    <circle r={120} fill="#ff9a3a" opacity={0.18} />
    {[0, 1, 2].map((i) => {
      const k = 1 + Math.sin(frame / 3 + i * 2) * 0.12;
      return (
        <path
          key={i}
          d={`M ${-40 + i * 30} 0 Q ${-60 + i * 30} ${-70 * k} ${-10 + i * 25} ${-130 * k} Q ${30 + i * 10} ${-60 * k} ${40 + i * 10} 0 Z`}
          fill={['#ff6a2a', '#ff9a3a', '#ffd25a'][i]}
          transform={`scale(${1 - i * 0.22})`}
        />
      );
    })}
  </g>
);
export const Debris: React.FC<{x: number; y: number; seed: string}> = ({x, y, seed}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={3}>
    {Array.from({length: 6}).map((_, i) => (
      <path key={i} d={`M ${i * 40 - 120} 0 l ${10 + random(`${seed}a${i}`) * 30} -${10 + random(`${seed}b${i}`) * 40} l ${20 + random(`${seed}c${i}`) * 20} ${10} Z`} fill={['#9a8a8a', '#7a6a6a', '#b0a090'][i % 3]} />
    ))}
    <rect x={-60} y={-14} width={140} height={14} fill="#8a5a3a" transform="rotate(-12)" />
  </g>
);
export const StopSign: React.FC<{x: number; y?: number; tilt?: number}> = ({x, y = 900, tilt = 14}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`} stroke={INK} strokeWidth={sw}>
    <rect x={-6} y={-300} width={12} height={300} fill="#8a8f99" />
    <path d="M -40 -380 L 40 -380 L 70 -350 L 70 -300 L 40 -270 L -40 -270 L -70 -300 L -70 -350 Z" fill="#d63a2a" />
    <text x={0} y={-312} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#fff" stroke="none">
      STOP
    </text>
  </g>
);

// ───────────────────────── SUPERMARKET ─────────────────────────
export const Supermarket: React.FC<{frame: number; flicker: number}> = ({frame, flicker}) => {
  const products = ['#e8553e', '#f6c945', '#4f9dde', '#5aa469', '#e86a8f', '#ff7a1a', '#7b5ea7', '#ffffff'];
  const shelf = (x: number, w: number, k: number) => (
    <g key={k} transform={`translate(${x} 0)`} stroke={INK} strokeWidth={sw}>
      <rect x={0} y={330} width={w} height={540} fill="#d8dde4" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={0} y={420 + r * 118} width={w} height={14} fill="#aab3bf" />
          {Array.from({length: Math.floor(w / 46)}).map((_, j) => {
            const rr = random(`p${k}${r}${j}`);
            if (rr < 0.35) return null; // looted gaps
            const h = 50 + rr * 40;
            return <rect key={j} x={10 + j * 46} y={420 + r * 118 - h} width={36} height={h} rx={4} fill={products[Math.floor(rr * 97) % products.length]} strokeWidth={2.5} />;
          })}
        </g>
      ))}
    </g>
  );
  return (
    <g>
      <rect x={X0} y={-1400} width={X1 - X0} height={2270} fill="#efe9dc" />
      <rect x={X0} y={-1400} width={X1 - X0} height={1600} fill="#d9d4c8" />
      {/* ceiling lights */}
      {Array.from({length: 12}).map((_, i) => {
        const on = i === 4 ? flicker : 1;
        return (
          <g key={i}>
            <rect x={X0 + 200 + i * 420} y={60} width={260} height={24} rx={8} fill={on > 0.5 ? '#fffbe0' : '#9a9a8a'} stroke={INK} strokeWidth={3} />
            {on > 0.5 && <path d={`M ${X0 + 200 + i * 420} 84 L ${X0 + 100 + i * 420} 600 L ${X0 + 560 + i * 420} 600 L ${X0 + 460 + i * 420} 84 Z`} fill="#fffbe0" opacity={0.12} />}
          </g>
        );
      })}
      {/* hanging aisle signs */}
      {[
        [300, '6 CEREAL'],
        [1000, '7 SNACKS'],
        [1700, '8 BREAD'],
      ].map(([x, t], i) => (
        <g key={i} transform={`translate(${x} 160) rotate(${Math.sin(frame / 30 + i) * 2})`} stroke={INK} strokeWidth={sw}>
          <line x1={0} y1={-80} x2={0} y2={0} />
          <rect x={-120} y={0} width={240} height={70} rx={10} fill={i === 1 ? '#f6c945' : '#4f9dde'} />
          <text x={0} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill={INK} stroke="none">
            {`AISLE ${t}`}
          </text>
        </g>
      ))}
      {shelf(-700, 600, 0)}
      {shelf(40, 640, 1)}
      {shelf(1500, 600, 2)}
      {shelf(2400, 600, 3)}
      {/* floor tiles */}
      <rect x={X0} y={870} width={X1 - X0} height={1800} fill="#e6e1d4" />
      {Array.from({length: 40}).map((_, i) => (
        <line key={i} x1={X0 + i * 140} y1={870} x2={X0 + i * 140 - 300} y2={2600} stroke="#b8b2a4" strokeWidth={3} />
      ))}
      {Array.from({length: 12}).map((_, i) => (
        <line key={`h${i}`} x1={X0} y1={900 + i * i * 14} x2={X1} y2={900 + i * i * 14} stroke="#b8b2a4" strokeWidth={3} />
      ))}
    </g>
  );
};
export const Register: React.FC<{x: number; y?: number}> = ({x, y = 900}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <rect x={-200} y={-220} width={400} height={220} fill="#5a6f8a" />
    <rect x={-210} y={-236} width={420} height={24} fill="#3a4a5e" />
    <rect x={60} y={-330} width={110} height={90} rx={8} fill="#2f2f3a" />
    <rect x={72} y={-318} width={86} height={40} fill="#7cff8a" strokeWidth={2} />
    <text x={115} y={-290} textAnchor="middle" fontFamily="monospace" fontSize={20} fill="#0a3a1a" stroke="none">
      3
    </text>
  </g>
);
export const Cart: React.FC<{x: number; y?: number; frame?: number; full?: boolean}> = ({x, y = 900, frame = 0, full}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <path d="M -110 -200 L 110 -200 L 90 -60 L -90 -60 Z" fill="none" />
    {[-60, -20, 20, 60].map((lx) => (
      <line key={lx} x1={lx} y1={-200} x2={lx * 0.8} y2={-60} strokeWidth={3} />
    ))}
    {full && (
      <g>
        <rect x={-80} y={-250} width={50} height={70} rx={6} fill="#ff7a1a" />
        <rect x={-20} y={-240} width={40} height={60} rx={6} fill="#4f9dde" />
        <rect x={30} y={-260} width={46} height={80} rx={6} fill="#e86a8f" />
      </g>
    )}
    <line x1={110} y1={-200} x2={150} y2={-250} />
    {[-70, 70].map((wx) => (
      <circle key={wx} cx={wx} cy={-18} r={18} fill="#2f2f3a" transform={`rotate(${frame * 10} ${wx} -18)`} />
    ))}
    <line x1={-90} y1={-60} x2={-70} y2={-36} />
    <line x1={90} y1={-60} x2={70} y2={-36} />
  </g>
);
export const Display: React.FC<{x: number; y?: number; hasBag?: boolean}> = ({x, y = 900, hasBag = true}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <rect x={-150} y={-260} width={300} height={260} rx={10} fill="#e8553e" />
    <rect x={-160} y={-280} width={320} height={30} rx={8} fill="#c0392b" />
    <text x={0} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#fff6c2" stroke="none">
      LAST ONE!
    </text>
    {hasBag && <g transform="translate(0 -280)">{<CheesePuffs s={1.1} />}</g>}
  </g>
);

// ───────────────────────── BACK ROOM ─────────────────────────
export const BackRoom: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <rect x={X0} y={-1400} width={X1 - X0} height={2270} fill="#5a5048" />
    {Array.from({length: 30}).map((_, i) => (
      <rect key={i} x={X0 + i * 180} y={-1400} width={90} height={2270} fill="#000" opacity={0.05} />
    ))}
    {/* hanging bulb */}
    <line x1={960} y1={-400} x2={960 + Math.sin(frame / 25) * 10} y2={120} stroke={INK} strokeWidth={4} />
    <circle cx={960 + Math.sin(frame / 25) * 10} cy={140} r={26} fill="#fff3b0" stroke={INK} strokeWidth={4} />
    <circle cx={960 + Math.sin(frame / 25) * 10} cy={140} r={300} fill="#fff3b0" opacity={0.12} />
    {/* stacked boxes */}
    {[
      [200, 0],
      [330, 0],
      [260, -130],
      [1600, 0],
      [1730, 0],
      [1660, -130],
      [1700, -260],
    ].map(([bx, by], i) => (
      <g key={i} transform={`translate(${bx} ${870 + by})`} stroke={INK} strokeWidth={sw}>
        <rect x={-62} y={-130} width={124} height={130} fill="#c9935e" />
        <line x1={0} y1={-130} x2={0} y2={-80} />
        <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={18} fill={INK} stroke="none">
          {['CHIPS', 'SODA', 'FRAGILE', 'NAPKINS', 'BEANS', 'THIS SIDE UP', 'CHIPS'][i]}
        </text>
      </g>
    ))}
    <rect x={X0} y={870} width={X1 - X0} height={1800} fill="#6b6058" />
    <rect x={X0} y={860} width={X1 - X0} height={14} fill="#4a4038" />
  </g>
);

// ───────────────────────── ROOFTOP ─────────────────────────
export const Rooftop: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <defs>
      <linearGradient id="roof-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e8673f" />
        <stop offset="0.7" stopColor="#ffb36b" />
        <stop offset="1" stopColor="#ffd59e" />
      </linearGradient>
    </defs>
    <rect x={X0} y={-1400} width={X1 - X0} height={2400} fill="url(#roof-sky)" />
    <circle cx={300} cy={560} r={200} fill="#fff0b0" opacity={0.9} />
    {/* skyline far below */}
    {Array.from({length: 26}).map((_, i) => {
      const h = 150 + random(`rs${i}`) * 300;
      return <rect key={i} x={X0 + i * 200} y={860 - h} width={180} height={h} fill="#a8546a" opacity={0.7} />;
    })}
    {/* a pizzeria sign glowing green in the distance */}
    <g transform="translate(1720 560)">
      <circle r={90} fill="#6aff9a" opacity={0.25 + 0.1 * Math.sin(frame / 8)} />
      <rect x={-70} y={-20} width={140} height={40} rx={8} fill="#6aff9a" stroke={INK} strokeWidth={3} />
    </g>
    {/* roof ledge + floor */}
    <rect x={X0} y={860} width={X1 - X0} height={1800} fill="#8a7a7a" />
    <rect x={X0} y={830} width={X1 - X0} height={40} fill="#a08f8a" stroke={INK} strokeWidth={4} />
    {/* AC unit + antenna */}
    <g transform="translate(250 860)" stroke={INK} strokeWidth={sw}>
      <rect x={-110} y={-170} width={220} height={170} fill="#b8bec8" />
      <circle cx={0} cy={-85} r={55} fill="#8a909a" />
      <g transform={`rotate(${frame * 12} 0 -85)`}>
        <rect x={-50} y={-90} width={100} height={10} fill="#5a606a" />
      </g>
    </g>
    <g transform="translate(1650 860)" stroke={INK} strokeWidth={sw}>
      <rect x={-6} y={-380} width={12} height={380} fill="#5a606a" />
      <line x1={-60} y1={-330} x2={60} y2={-330} />
      <line x1={-40} y1={-280} x2={40} y2={-280} />
    </g>
  </g>
);

// ───────────────────────── PIZZERIA ─────────────────────────
export const PizzeriaExterior: React.FC<{frame: number; x: number; base?: number}> = ({frame, x, base = 870}) => {
  const pulse = 0.7 + 0.3 * Math.sin(frame / 6);
  return (
    <g transform={`translate(${x} ${base})`} stroke={INK} strokeWidth={sw}>
      <rect x={-330} y={-560} width={660} height={560} fill="#7a3a2a" />
      <rect x={-330} y={-560} width={660} height={60} fill="#5a2a1a" />
      {/* awning */}
      {Array.from({length: 11}).map((_, i) => (
        <path key={i} d={`M ${-330 + i * 60} -380 l 60 0 l -6 50 q -24 18 -48 0 Z`} fill={i % 2 ? '#fff6e6' : '#2f8a4a'} />
      ))}
      <rect x={-230} y={-300} width={200} height={220} fill="#0b2a1a" />
      <rect x={30} y={-300} width={200} height={300} fill="#0b2a1a" />
      <circle cx={0} cy={-470} r={200} fill="#6aff9a" opacity={0.22 * pulse} strokeWidth={0} />
      <rect x={-260} y={-500} width={520} height={90} rx={16} fill="#1a3a22" />
      <text x={0} y={-440} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill="#7dffaa" stroke="none" opacity={pulse}>
        MAMA MOZZA&apos;S
      </text>
      <text x={-130} y={-180} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={26} fill="#7dffaa" stroke="none" opacity={0.8}>
        FREE SAMPLES
      </text>
    </g>
  );
};
export const PizzeriaInterior: React.FC<{frame: number; wall?: number; crack?: number; crater?: boolean}> = ({frame, wall = 0, crack = 0, crater}) => (
  <g>
    <rect x={X0} y={-1400} width={X1 - X0} height={2270} fill="#8a4a32" />
    {/* brick pattern */}
    {Array.from({length: 22}).map((_, r) =>
      Array.from({length: 34}).map((_, c) => (
        <rect key={`${r}-${c}`} x={X0 + c * 150 + (r % 2) * 75} y={-200 + r * 50} width={140} height={42} fill="#9a5a3a" opacity={0.55} />
      )),
    )}
    {/* menu board */}
    <g transform="translate(400 160)" stroke={INK} strokeWidth={sw}>
      <rect x={-200} y={0} width={400} height={240} rx={10} fill="#2b2333" />
      <text x={0} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#f6c945" stroke="none">
        MENU
      </text>
      {['Margherita .... 9', 'Pepperoni .... 11', 'MIRACLE SOURDOUGH .... FREE'].map((t, i) => (
        <text key={i} x={-170} y={100 + i * 44} fontFamily={FONT} fontSize={22} fill={i === 2 ? '#7dffaa' : '#fff6e6'} stroke="none">
          {t}
        </text>
      ))}
    </g>
    {/* secret wall panel with giant pizza peel lever */}
    <g transform="translate(1480 870)" stroke={INK} strokeWidth={sw}>
      <rect x={-170} y={-520} width={340} height={520} fill="#0b2a1a" />
      <rect x={-150} y={-500} width={300} height={500} fill="#103a22" />
      <circle cx={0} cy={-250} r={200} fill="#6aff9a" opacity={0.35 * wall} strokeWidth={0} />
      {/* stairs going down */}
      {wall > 0.2 && [0, 1, 2, 3, 4].map((k) => <rect key={k} x={-140 + k * 10} y={-90 + k * 18} width={280 - k * 20} height={14} fill="#2a5a3a" strokeWidth={2} />)}
      <g transform={`translate(${-170 - wall * 330} 0)`}>
        <rect x={0} y={-520} width={340} height={520} fill="#8a4a32" />
        {Array.from({length: 10}).map((_, r) => (
          <rect key={r} x={10 + (r % 2) * 40} y={-510 + r * 52} width={300} height={42} fill="#9a5a3a" opacity={0.6} />
        ))}
      </g>
    </g>
    {/* the peel/lever */}
    <g transform={`translate(1240 560) rotate(${wall > 0 ? 30 : 0})`} stroke={INK} strokeWidth={sw}>
      <rect x={-8} y={-160} width={16} height={180} rx={6} fill="#c98f5e" />
      <ellipse cx={0} cy={-200} rx={60} ry={50} fill="#d9a86a" />
    </g>
    {/* floor: checkerboard */}
    <rect x={X0} y={870} width={X1 - X0} height={1800} fill="#f4efe6" />
    {Array.from({length: 14}).map((_, r) =>
      Array.from({length: 40}).map((_, c) =>
        (r + c) % 2 ? <rect key={`${r}-${c}`} x={X0 + c * 130 - r * 30} y={870 + r * 60} width={130} height={60} fill="#2b2333" opacity={0.85} /> : null,
      ),
    )}
    {crack > 0 && (
      <g>
        <path d={`M 700 ${900} l 80 40 l -40 60 l 120 30 l -60 80`} stroke={INK} strokeWidth={8} fill="none" opacity={crack} />
        <path d={`M 1000 ${900} l -50 50 l 70 40 l -30 80`} stroke={INK} strokeWidth={8} fill="none" opacity={crack} />
      </g>
    )}
    {crater && <ellipse cx={1200} cy={930} rx={300} ry={50} fill="#1a1414" />}
  </g>
);
/** The brick pizza oven with its fateful control panel. heat 0..1 glows. */
export const PizzaOven: React.FC<{x: number; y?: number; heat: number; frame: number; dial?: number; destroyed?: boolean}> = ({x, y = 870, heat, frame, dial = 0, destroyed}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <ellipse cx={0} cy={4} rx={360} ry={30} fill="rgba(0,0,0,0.3)" stroke="none" />
    {!destroyed ? (
      <>
        <rect x={-330} y={-320} width={660} height={320} fill="#7a3a2a" />
        <path d="M -300 -320 Q -300 -640 0 -650 Q 300 -640 300 -320 Z" fill="#9a4a2e" />
        {Array.from({length: 6}).map((_, r) => (
          <path key={r} d={`M ${-280 + r * 10} ${-340 - r * 50} Q 0 ${-420 - r * 46} ${280 - r * 10} ${-340 - r * 50}`} stroke="#6a2a1a" strokeWidth={3} fill="none" />
        ))}
        {/* mouth */}
        <path d="M -150 -320 Q -150 -470 0 -470 Q 150 -470 150 -320 Z" fill={interpolateColors(heat, [0, 0.5, 1], ['#1a0e0a', '#a83a1a', '#ffd25a'])} />
        {heat > 0.3 && <Fire x={0} y={-330} frame={frame} s={0.8 + heat * 0.6} />}
        {/* chimney */}
        <rect x={150} y={-820} width={80} height={220} fill="#7a3a2a" />
        {/* control panel */}
        <g transform="translate(-230 -230)">
          <rect x={-70} y={-60} width={240} height={150} rx={10} fill="#c7c9d1" />
          {['BAKE', 'BROIL', 'CRISPY', 'TURBO\nVOLCANO'].map((t, i) => (
            <g key={i} transform={`translate(${-30 + i * 56} 0)`}>
              <circle r={20} fill={i === 3 ? '#e8553e' : '#5a606a'} />
              <line x1={0} y1={0} x2={0} y2={-16} stroke="#fff" transform={`rotate(${i === 3 ? dial * 160 - 80 : -40})`} />
              {t.split('\n').map((ln, j) => (
                <text key={j} y={38 + j * 16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={13} fill={i === 3 ? '#c0392b' : INK} stroke="none">
                  {ln}
                </text>
              ))}
            </g>
          ))}
        </g>
        {/* warning sign */}
        <g transform="translate(190 -230) rotate(4)">
          <rect x={-80} y={-60} width={160} height={110} fill="#f6c945" />
          <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={16} fill={INK} stroke="none">
            ⚠ NEVER USE
          </text>
          <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={14} fill="#c0392b" stroke="none">
            TURBO VOLCANO
          </text>
          <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK} stroke="none">
            vents into
          </text>
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={INK} stroke="none">
            proofing chamber
          </text>
        </g>
      </>
    ) : (
      <>
        {/* rubble */}
        <path d="M -340 0 L -300 -120 L -220 -60 L -140 -180 L -40 -90 L 60 -200 L 140 -80 L 240 -150 L 330 0 Z" fill="#7a3a2a" />
        <Fire x={-100} y={-60} frame={frame} s={0.4} />
      </>
    )}
  </g>
);

// ───────────────────────── SECRET LAB ─────────────────────────
export const Lab: React.FC<{frame: number; alarm?: number}> = ({frame, alarm = 0}) => (
  <g>
    <rect x={X0} y={-1400} width={X1 - X0} height={2270} fill="#0f2a22" />
    {/* wall panels */}
    {Array.from({length: 20}).map((_, i) => (
      <rect key={i} x={X0 + i * 280} y={-200} width={260} height={1060} fill="#143a2e" stroke="#0a1f18" strokeWidth={6} />
    ))}
    {/* pipes */}
    {[120, 190, 260].map((py, i) => (
      <g key={i}>
        <rect x={X0} y={py} width={X1 - X0} height={26} fill={['#3a5a4a', '#2f4a3e', '#4a6a5a'][i]} stroke={INK} strokeWidth={3} />
        {Array.from({length: 20}).map((_, j) => (
          <rect key={j} x={X0 + j * 300 + i * 40} y={py - 6} width={20} height={38} fill="#6a8a7a" stroke={INK} strokeWidth={2} />
        ))}
      </g>
    ))}
    {/* bubbling tanks */}
    {[-300, 220, 2100, 2550].map((tx, i) => (
      <g key={i} transform={`translate(${tx} 870)`} stroke={INK} strokeWidth={sw}>
        <rect x={-90} y={-520} width={180} height={520} rx={30} fill="#1f5a3a" opacity={0.9} />
        <rect x={-76} y={-430} width={152} height={420} rx={20} fill="#6aff9a" opacity={0.55} />
        {Array.from({length: 6}).map((_, b) => {
          const t = (frame * 2 + b * 37 + i * 50) % 400;
          return <circle key={b} cx={-40 + ((b * 29) % 80)} cy={-20 - t} r={6 + (b % 3) * 3} fill="#d6ffe6" opacity={1 - t / 400} strokeWidth={0} />;
        })}
        <rect x={-100} y={-560} width={200} height={50} rx={10} fill="#5a7a6a" />
      </g>
    ))}
    {/* consoles */}
    <g transform="translate(560 870)" stroke={INK} strokeWidth={sw}>
      <rect x={-160} y={-240} width={320} height={240} fill="#2a3a36" />
      {Array.from({length: 12}).map((_, k) => (
        <circle key={k} cx={-130 + (k % 6) * 52} cy={-200 + Math.floor(k / 6) * 40} r={9} fill={random(`led${k}${Math.floor(frame / 10)}`) > 0.5 ? '#7dffaa' : '#e8553e'} strokeWidth={2} />
      ))}
    </g>
    {/* alarm light wash */}
    {alarm > 0 && <rect x={X0} y={-1400} width={X1 - X0} height={4000} fill="#ff2a2a" opacity={alarm * (0.15 + 0.15 * Math.sin(frame / 3))} />}
    {/* floor grate */}
    <rect x={X0} y={870} width={X1 - X0} height={1800} fill="#1a2a26" />
    {Array.from({length: 50}).map((_, i) => (
      <line key={i} x1={X0 + i * 110} y1={870} x2={X0 + i * 110 - 200} y2={2600} stroke="#0a1410" strokeWidth={5} />
    ))}
  </g>
);
/** Big monitor showing Dr. Crumb's video log. */
export const LogMonitor: React.FC<{x: number; y: number; frame: number; on: number; zombie: number; talk: number; day: string; staticAmt: number}> = ({x, y, frame, on, zombie, talk, day, staticAmt}) => {
  const base = lookOf('crumb');
  const look = {...base, skin: interpolateColors(zombie, [0, 1], [base.skin, '#a3b88c']), zombie: zombie > 0.8, eyeBags: zombie > 0.3};
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
      <rect x={-330} y={-230} width={660} height={420} rx={20} fill="#1c2420" />
      <rect x={-20} y={190} width={40} height={60} fill="#2a3430" />
      <svg x={-300} y={-200} width={600} height={360} viewBox="0 0 600 360" overflow="hidden">
        <rect width={600} height={360} fill={on > 0 ? '#e8f0ff' : '#0a0f0c'} />
        {on > 0 && (
          <g opacity={on}>
            {/* her lab behind her */}
            <rect x={0} y={250} width={600} height={110} fill="#c8d0dc" />
            <rect x={420} y={60} width={120} height={200} rx={20} fill="#6aff9a" opacity={0.6} />
            <g transform="translate(260 470) scale(0.72)">
              <Character uid="crumblog" look={look} frame={frame} talk={talk} mood={zombie > 0.3 ? 'scared' : 'happy'} pose={zombie > 0.5 ? 'reach' : ['down', 'point']} />
            </g>
            <rect x={14} y={14} width={200} height={40} rx={8} fill="#c0392b" stroke="none" />
            <text x={114} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#fff" stroke="none">
              ● REC {day}
            </text>
          </g>
        )}
        {staticAmt > 0 &&
          Array.from({length: 140}).map((_, i) => (
            <rect key={i} x={random(`ls${i}${frame}`) * 600} y={random(`ly${i}${frame}`) * 360} width={40 + random(`lw${i}`) * 80} height={4} fill={random(`lc${i}${frame}`) > 0.5 ? '#fff' : '#333'} opacity={staticAmt} />
          ))}
      </svg>
    </g>
  );
};

// ───────────────────────── THE MOTHER ─────────────────────────
/**
 * Giant sentient sourdough starter. rise 0..1 lifts it out of its vat; bake 0..1 turns it into a crusty loaf.
 * talk 0..1 opens its mouth. Draw centred at (x, y) = bottom-centre of the vat.
 */
export const TheMother: React.FC<{x: number; y: number; frame: number; rise: number; bake?: number; talk?: number; angry?: number; s?: number; vat?: boolean}> = ({x, y, frame, rise, bake = 0, talk = 0, angry = 0, s = 1, vat = true}) => {
  const R = 330;
  const cy = -360 - rise * 300;
  const wob = (a: number, k: number) => 1 + 0.05 * Math.sin(frame / 9 + a * 3 + k) + 0.03 * Math.sin(frame / 5 + a * 7) * (1 - bake);
  const pts = Array.from({length: 28}).map((_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const rr = R * wob(a, 0) * (a > Math.PI ? 1 : 0.92);
    return [Math.cos(a) * rr * 1.15, Math.sin(a) * rr * 0.95] as [number, number];
  });
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    d += ` Q ${p1[0]} ${p1[1]} ${(p1[0] + p2[0]) / 2} ${(p1[1] + p2[1]) / 2}`;
  }
  const doughA = interpolateColors(bake, [0, 0.5, 1], ['#f3e6c4', '#e2b36a', '#b8692e']);
  const doughB = interpolateColors(bake, [0, 0.5, 1], ['#e4d0a0', '#c9893e', '#8a4a1e']);
  const eyes = [
    [-120, -80, 46],
    [110, -90, 52],
    [0, -170, 34],
    [-200, 20, 26],
    [210, 10, 30],
    [40, -20, 22],
  ];
  const mouthOpen = 20 + talk * 90 + angry * 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id="mother-g" cx="40%" cy="30%" r="70%">
          <stop offset="0" stopColor={doughA} />
          <stop offset="1" stopColor={doughB} />
        </radialGradient>
      </defs>
      {/* glow */}
      {bake < 0.8 && <circle cx={0} cy={cy} r={R * 1.6} fill="#6aff9a" opacity={0.15 * (1 - bake)} />}
      {/* tendrils */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path
            d={`M ${sd * 280} ${cy + 120} Q ${sd * (520 + 60 * Math.sin(frame / 12))} ${cy - 80 + 80 * Math.sin(frame / 15 + sd)} ${sd * (620 + 40 * Math.sin(frame / 10))} ${cy + 260}`}
            stroke={INK}
            strokeWidth={70}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${sd * 280} ${cy + 120} Q ${sd * (520 + 60 * Math.sin(frame / 12))} ${cy - 80 + 80 * Math.sin(frame / 15 + sd)} ${sd * (620 + 40 * Math.sin(frame / 10))} ${cy + 260}`}
            stroke={doughB}
            strokeWidth={60}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <g transform={`translate(0 ${cy})`}>
        <path d={d} fill="url(#mother-g)" stroke={INK} strokeWidth={6} />
        {/* bubbles / pores */}
        {Array.from({length: 14}).map((_, i) => (
          <circle key={i} cx={(random(`mb${i}`) - 0.5) * 520} cy={(random(`mc${i}`) - 0.3) * 360} r={6 + random(`md${i}`) * 12} fill={doughB} opacity={0.6} />
        ))}
        {/* baked scoring lines */}
        {bake > 0.3 &&
          [-150, 0, 150].map((sx) => <path key={sx} d={`M ${sx - 60} ${-240} Q ${sx} ${-260} ${sx + 60} ${-240}`} stroke="#5a2a0e" strokeWidth={14} fill="none" opacity={bake} strokeLinecap="round" />)}
        {/* eyes */}
        {eyes.map(([ex, ey, er], i) => {
          const blink = (frame + i * 23) % 120 < 4 ? 0.1 : 1;
          return bake > 0.7 ? (
            <g key={i} stroke={INK} strokeWidth={6}>
              <line x1={ex - er * 0.5} y1={ey - er * 0.5} x2={ex + er * 0.5} y2={ey + er * 0.5} />
              <line x1={ex + er * 0.5} y1={ey - er * 0.5} x2={ex - er * 0.5} y2={ey + er * 0.5} />
            </g>
          ) : (
            <g key={i} transform={`translate(${ex} ${ey}) scale(1 ${blink})`}>
              <circle r={er} fill="#f6ffe8" stroke={INK} strokeWidth={5} />
              <circle r={er * 0.45} fill="#1a6a3a" />
              <circle r={er * 0.2} fill={INK} />
              {angry > 0.3 && <line x1={-er} y1={-er * 1.1} x2={er} y2={-er * 0.6} stroke={INK} strokeWidth={8} strokeLinecap="round" />}
            </g>
          );
        })}
        {/* mouth */}
        <path d={`M -150 90 Q 0 ${90 + mouthOpen * 0.4} 150 90 Q 120 ${110 + mouthOpen} 0 ${120 + mouthOpen} Q -120 ${110 + mouthOpen} -150 90 Z`} fill="#3a1a10" stroke={INK} strokeWidth={6} />
        {[-100, -50, 0, 50, 100].map((tx) => (
          <path key={tx} d={`M ${tx - 16} ${92 + Math.abs(tx) * 0.04} l 16 ${22 + mouthOpen * 0.1} l 16 ${-22 - mouthOpen * 0.1}`} fill="#fff6d8" stroke={INK} strokeWidth={3} />
        ))}
        {/* spores */}
        {bake < 0.5 &&
          Array.from({length: 10}).map((_, i) => {
            const t = (frame * 1.5 + i * 41) % 300;
            return <circle key={`s${i}`} cx={(random(`sp${i}`) - 0.5) * 700 + Math.sin(t / 20) * 20} cy={-200 - t} r={7} fill="#9aff8a" opacity={(1 - t / 300) * 0.8} />;
          })}
      </g>
      {/* vat front */}
      {vat && (
        <g stroke={INK} strokeWidth={6}>
          <path d="M -460 -360 L 460 -360 L 420 0 L -420 0 Z" fill="#2f4a3e" />
          <rect x={-480} y={-390} width={960} height={50} rx={16} fill="#5a7a6a" />
          <rect x={-300} y={-260} width={600} height={60} rx={10} fill="#1a2a24" />
          <text x={0} y={-218} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#7dffaa" stroke="none">
            PROOFING CHAMBER
          </text>
        </g>
      )}
    </g>
  );
};

/** Dough tendril bursting up through a floor (kitchen climax). grow 0..1, bake 0..1 */
export const DoughTendril: React.FC<{x: number; y: number; frame: number; grow: number; bake: number; flip?: boolean}> = ({x, y, frame, grow, bake, flip}) => {
  const h = 520 * grow;
  const sway = Math.sin(frame / 10) * 40 * (1 - bake);
  const col = interpolateColors(bake, [0, 1], ['#efdcae', '#a8602a']);
  const d = `M 0 0 Q ${sway} ${-h * 0.5} ${sway * 1.5 + 60} ${-h}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx={0} cy={0} rx={120 * grow + 1} ry={24} fill="#1a1010" />
      <path d={d} stroke={INK} strokeWidth={110} fill="none" strokeLinecap="round" />
      <path d={d} stroke={col} strokeWidth={98} fill="none" strokeLinecap="round" />
      {grow > 0.6 && bake < 0.7 && (
        <g transform={`translate(${sway * 1.5 + 60} ${-h})`}>
          <circle r={26} fill="#f6ffe8" stroke={INK} strokeWidth={5} />
          <circle r={11} fill="#1a6a3a" />
        </g>
      )}
    </g>
  );
};

export const CrumbBurst: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => {
  if (t < 0 || t > 90) return null;
  return (
    <g>
      {Array.from({length: 60}).map((_, i) => {
        const a = random(`cb${i}`) * Math.PI * 2;
        const v = 8 + random(`cv${i}`) * 22;
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t * 0.7 + 0.35 * t * t;
        return <rect key={i} x={px} y={py} width={10 + (i % 4) * 6} height={8 + (i % 3) * 5} rx={3} fill={['#d9a35a', '#b8692e', '#f3e0b0'][i % 3]} stroke={INK} strokeWidth={2} opacity={interpolate(t, [60, 90], [1, 0], clamp)} transform={`rotate(${t * 9 + i * 30} ${px} ${py})`} />;
      })}
    </g>
  );
};
