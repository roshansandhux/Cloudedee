// REUSABLE PROPS – all drawn in code. Positions are world coords; (x, y) is the base/bottom-centre.
import React from 'react';
import {INK} from '../lib/theme';

const sw = 4; // outline width
type P = {x: number; y?: number; s?: number; color?: string; flip?: boolean};
const T = (p: P, d = 900) => `translate(${p.x} ${p.y ?? d}) scale(${(p.flip ? -1 : 1) * (p.s ?? 1)} ${p.s ?? 1})`;
const Shadow: React.FC<{w: number}> = ({w}) => <ellipse cx={0} cy={2} rx={w} ry={w * 0.14} fill="rgba(20,10,30,0.2)" stroke="none" />;

export const Tree: React.FC<P & {leaf?: string; frame?: number}> = (p) => {
  const sway = Math.sin((p.frame ?? 0) / 40 + p.x) * 2;
  return (
    <g transform={T(p)}>
      <Shadow w={120} />
      <path d="M -22 0 Q -14 -150 -18 -260 L 18 -260 Q 14 -150 22 0 Z" fill="#8a5a3c" stroke={INK} strokeWidth={sw} />
      <g transform={`rotate(${sway} 0 -260)`} fill={p.leaf ?? '#5fb96a'} stroke={INK} strokeWidth={sw}>
        <circle cx={-80} cy={-300} r={90} />
        <circle cx={80} cy={-310} r={95} />
        <circle cx={0} cy={-400} r={110} />
        <circle cx={0} cy={-280} r={90} stroke="none" />
      </g>
      <circle cx={-40} cy={-420} r={26} fill="#fff" opacity={0.18} />
    </g>
  );
};

export const Bush: React.FC<P & {leaf?: string}> = (p) => (
  <g transform={T(p)} fill={p.leaf ?? '#4fa85a'} stroke={INK} strokeWidth={sw}>
    <Shadow w={90} />
    <circle cx={-45} cy={-40} r={50} />
    <circle cx={40} cy={-45} r={55} />
    <circle cx={0} cy={-75} r={60} />
    <rect x={-90} y={-45} width={180} height={45} rx={20} stroke="none" />
  </g>
);

export const Flower: React.FC<P> = (p) => (
  <g transform={T(p)}>
    <path d="M 0 0 Q 4 -30 0 -60" stroke="#3f8f4a" strokeWidth={5} fill="none" />
    <g transform="translate(0 -64)" stroke={INK} strokeWidth={3}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-13} rx={9} ry={14} fill={p.color ?? '#ff8fb1'} transform={`rotate(${a})`} />
      ))}
      <circle r={8} fill="#f6c945" />
    </g>
  </g>
);

export const Rock: React.FC<P> = (p) => (
  <g transform={T(p)}>
    <Shadow w={70} />
    <path d="M -70 0 Q -80 -50 -30 -70 Q 20 -90 60 -50 Q 80 -20 70 0 Z" fill={p.color ?? '#a6a2b5'} stroke={INK} strokeWidth={sw} />
    <path d="M -30 -55 Q 0 -70 30 -55" stroke="#fff" strokeWidth={5} opacity={0.3} fill="none" strokeLinecap="round" />
  </g>
);

export const Fence: React.FC<{x0: number; x1: number; y?: number; color?: string}> = ({x0, x1, y = 880, color = '#fff6e6'}) => {
  const posts = [];
  for (let x = x0; x <= x1; x += 60) posts.push(<path key={x} d={`M ${x - 18} ${y} L ${x - 18} ${y - 130} L ${x} ${y - 150} L ${x + 18} ${y - 130} L ${x + 18} ${y} Z`} fill={color} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />);
  return (
    <g>
      <rect x={x0 - 20} y={y - 110} width={x1 - x0 + 40} height={18} fill={color} stroke={INK} strokeWidth={sw} />
      <rect x={x0 - 20} y={y - 55} width={x1 - x0 + 40} height={18} fill={color} stroke={INK} strokeWidth={sw} />
      {posts}
    </g>
  );
};

export const StreetLamp: React.FC<P & {on?: boolean}> = (p) => (
  <g transform={T(p)}>
    <Shadow w={40} />
    {p.on && <circle cx={0} cy={-470} r={160} fill="#ffe9a0" opacity={0.22} />}
    <rect x={-9} y={-460} width={18} height={460} fill="#3e4a5c" stroke={INK} strokeWidth={sw} />
    <path d="M -40 -460 L 40 -460 L 26 -510 L -26 -510 Z" fill={p.on ? '#ffe9a0' : '#d9e6f2'} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M -46 -510 L 46 -510 L 0 -545 Z" fill="#3e4a5c" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
    <rect x={-26} y={-20} width={52} height={20} rx={4} fill="#3e4a5c" stroke={INK} strokeWidth={sw} />
  </g>
);

export const Bench: React.FC<P> = (p) => (
  <g transform={T(p)} stroke={INK} strokeWidth={sw}>
    <Shadow w={150} />
    <rect x={-140} y={-150} width={280} height={22} rx={6} fill={p.color ?? '#c9824e'} />
    <rect x={-140} y={-120} width={280} height={22} rx={6} fill={p.color ?? '#c9824e'} />
    <rect x={-150} y={-80} width={300} height={22} rx={6} fill={p.color ?? '#c9824e'} />
    <rect x={-130} y={-58} width={14} height={58} fill="#3e4a5c" />
    <rect x={116} y={-58} width={14} height={58} fill="#3e4a5c" />
  </g>
);

export const Table: React.FC<P & {w?: number}> = (p) => {
  const w = p.w ?? 300;
  return (
    <g transform={T(p)} stroke={INK} strokeWidth={sw}>
      <Shadow w={w * 0.55} />
      <rect x={-w / 2 + 20} y={-190} width={16} height={190} fill="#8a5a3c" />
      <rect x={w / 2 - 36} y={-190} width={16} height={190} fill="#8a5a3c" />
      <rect x={-w / 2} y={-205} width={w} height={26} rx={8} fill={p.color ?? '#c98f5e'} />
    </g>
  );
};

export const Chair: React.FC<P> = (p) => (
  <g transform={T(p)} stroke={INK} strokeWidth={sw}>
    <Shadow w={70} />
    <rect x={-50} y={-310} width={18} height={310} fill={p.color ?? '#d9534f'} />
    <rect x={40} y={-130} width={14} height={130} fill={p.color ?? '#d9534f'} />
    <rect x={-50} y={-145} width={110} height={22} rx={6} fill={p.color ?? '#d9534f'} />
    <rect x={-50} y={-300} width={18} height={140} fill={p.color ?? '#d9534f'} />
  </g>
);

export const Sofa: React.FC<P> = (p) => {
  const c = p.color ?? '#7b5ea7';
  return (
    <g transform={T(p)} stroke={INK} strokeWidth={sw}>
      <Shadow w={260} />
      <rect x={-250} y={-260} width={500} height={150} rx={40} fill={c} />
      <rect x={-260} y={-140} width={520} height={110} rx={30} fill={c} />
      <rect x={-290} y={-200} width={70} height={180} rx={30} fill={c} />
      <rect x={220} y={-200} width={70} height={180} rx={30} fill={c} />
      <rect x={-250} y={-30} width={20} height={30} fill="#3e2f3f" />
      <rect x={230} y={-30} width={20} height={30} fill="#3e2f3f" />
    </g>
  );
};

/** Wall props: y is the TOP-left based centre for these (they hang on walls). */
export const WindowFrame: React.FC<{x: number; y: number; w?: number; h?: number; view?: 'day' | 'night' | 'sunset'; curtains?: string}> = ({x, y, w = 280, h = 320, view = 'day', curtains}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <rect x={-w / 2} y={0} width={w} height={h} fill={view === 'night' ? '#2b2f66' : view === 'sunset' ? '#ffb88a' : '#bfe6ff'} />
    {view === 'night' && <circle cx={w * 0.2} cy={h * 0.25} r={26} fill="#fffbe6" stroke="none" />}
    <line x1={0} y1={0} x2={0} y2={h} />
    <line x1={-w / 2} y1={h / 2} x2={w / 2} y2={h / 2} />
    <rect x={-w / 2 - 14} y={-14} width={w + 28} height={h + 28} fill="none" strokeWidth={12} stroke="#fff6e6" />
    <rect x={-w / 2 - 20} y={-20} width={w + 40} height={h + 40} fill="none" />
    <rect x={-w / 2 - 30} y={h + 14} width={w + 60} height={20} rx={4} fill="#fff6e6" />
    {curtains && (
      <>
        <path d={`M ${-w / 2 - 40} -30 Q ${-w / 2 + 10} ${h / 2} ${-w / 2 - 30} ${h + 10} L ${-w / 2 - 70} ${h + 10} L ${-w / 2 - 70} -30 Z`} fill={curtains} />
        <path d={`M ${w / 2 + 40} -30 Q ${w / 2 - 10} ${h / 2} ${w / 2 + 30} ${h + 10} L ${w / 2 + 70} ${h + 10} L ${w / 2 + 70} -30 Z`} fill={curtains} />
      </>
    )}
  </g>
);

export const Door: React.FC<P & {open?: number}> = (p) => {
  const o = Math.max(0, Math.min(1, p.open ?? 0));
  return (
    <g transform={T(p, 860)} stroke={INK} strokeWidth={sw}>
      <rect x={-95} y={-400} width={190} height={400} fill="#2b2333" />
      <rect x={-110} y={-415} width={220} height={415} fill="none" strokeWidth={14} stroke="#fff6e6" />
      <g transform={`translate(-95 0) scale(${1 - o * 0.85} 1)`}>
        <rect x={0} y={-400} width={190} height={400} fill={p.color ?? '#b5653f'} />
        <rect x={25} y={-370} width={140} height={150} rx={8} fill="none" opacity={0.6} />
        <rect x={25} y={-190} width={140} height={160} rx={8} fill="none" opacity={0.6} />
        <circle cx={160} cy={-200} r={11} fill="#f6c945" />
      </g>
    </g>
  );
};

export const PictureFrame: React.FC<{x: number; y: number; w?: number; h?: number; color?: string; art?: 'mountain' | 'sun' | 'portrait'}> = ({x, y, w = 180, h = 140, color = '#c98f5e', art = 'mountain'}) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={sw}>
    <rect x={-w / 2} y={0} width={w} height={h} fill="#fff6e6" />
    {art === 'mountain' && <path d={`M ${-w / 2 + 10} ${h - 10} L ${-w / 6} ${h / 3} L ${w / 10} ${h * 0.6} L ${w / 4} ${h * 0.4} L ${w / 2 - 10} ${h - 10} Z`} fill="#7fb3d5" strokeWidth={3} />}
    {art === 'sun' && <circle cx={0} cy={h / 2} r={h / 4} fill="#f6c945" strokeWidth={3} />}
    {art === 'portrait' && (
      <>
        <circle cx={0} cy={h * 0.42} r={h * 0.2} fill="#ffd9b8" strokeWidth={3} />
        <path d={`M ${-w * 0.25} ${h - 10} Q 0 ${h * 0.55} ${w * 0.25} ${h - 10}`} fill="#e86a8f" strokeWidth={3} />
      </>
    )}
    <rect x={-w / 2 - 10} y={-10} width={w + 20} height={h + 20} fill="none" strokeWidth={10} stroke={color} />
  </g>
);

export const Plant: React.FC<P> = (p) => (
  <g transform={T(p)} stroke={INK} strokeWidth={sw}>
    <Shadow w={50} />
    {[-30, 0, 30].map((a) => (
      <path key={a} d="M 0 -80 Q 30 -160 0 -230 Q -30 -160 0 -80 Z" fill="#5fb96a" transform={`rotate(${a} 0 -80)`} />
    ))}
    <path d="M -45 -90 L 45 -90 L 34 0 L -34 0 Z" fill={p.color ?? '#e8553e'} strokeLinejoin="round" />
  </g>
);

export const Box: React.FC<P & {w?: number; h?: number; label?: string}> = (p) => {
  const w = p.w ?? 120;
  const h = p.h ?? 100;
  return (
    <g transform={T(p)} stroke={INK} strokeWidth={sw}>
      <Shadow w={w * 0.55} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={p.color ?? '#d9a066'} />
      <rect x={-w / 2} y={-h} width={w} height={h * 0.16} fill="#000" opacity={0.08} stroke="none" />
      <line x1={0} y1={-h} x2={0} y2={-h * 0.6} strokeWidth={3} />
      {p.label && (
        <text x={0} y={-h * 0.35} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={h * 0.22} fill={INK} stroke="none">
          {p.label}
        </text>
      )}
    </g>
  );
};

export const Sign: React.FC<P & {text: string; w?: number}> = (p) => {
  const w = p.w ?? Math.max(160, p.text.length * 24 + 40);
  return (
    <g transform={T(p)} stroke={INK} strokeWidth={sw}>
      <Shadow w={30} />
      <rect x={-8} y={-200} width={16} height={200} fill="#8a5a3c" />
      <rect x={-w / 2} y={-280} width={w} height={90} rx={12} fill={p.color ?? '#fff6e6'} />
      <text x={0} y={-222} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={40} fill={INK} stroke="none">
        {p.text}
      </text>
    </g>
  );
};

export const Car: React.FC<P & {frame?: number; moving?: boolean}> = (p) => {
  const spin = p.moving ? (p.frame ?? 0) * 18 : 0;
  const c = p.color ?? '#4f9dde';
  return (
    <g transform={T(p)} stroke={INK} strokeWidth={sw}>
      <Shadow w={220} />
      <path d="M -230 -60 Q -235 -130 -170 -140 L -110 -145 Q -70 -230 30 -230 Q 110 -230 150 -150 L 210 -140 Q 240 -130 235 -60 Z" fill={c} strokeLinejoin="round" />
      <path d="M -90 -150 Q -60 -205 0 -205 L 0 -150 Z" fill="#dff3ff" />
      <path d="M 20 -150 L 20 -205 Q 95 -205 125 -150 Z" fill="#dff3ff" />
      <circle cx={220} cy={-105} r={12} fill="#fff6c2" />
      {[-140, 140].map((wx) => (
        <g key={wx} transform={`translate(${wx} -52) rotate(${spin})`}>
          <circle r={50} fill="#2f2f3a" />
          <circle r={22} fill="#c7c9d1" />
          <line x1={-22} y1={0} x2={22} y2={0} strokeWidth={3} />
        </g>
      ))}
    </g>
  );
};

/** Small hand props – draw at the hand (0,0). */
export const Mug: React.FC<{color?: string; steam?: number}> = ({color = '#fff6e6', steam}) => (
  <g stroke={INK} strokeWidth={3.5}>
    <rect x={-6} y={-38} width={40} height={42} rx={6} fill={color} />
    <path d="M 34 -28 q 18 0 18 14 q 0 14 -18 14" fill="none" />
    {steam !== undefined && <path d={`M 6 -48 q -8 -12 0 -24 q 8 -12 0 -24`} fill="none" stroke="#fff" opacity={0.6} strokeWidth={4} transform={`translate(${Math.sin(steam / 8) * 3} 0)`} />}
  </g>
);
export const Phone: React.FC<{lit?: boolean}> = ({lit}) => (
  <g stroke={INK} strokeWidth={3}>
    <rect x={-14} y={-52} width={34} height={60} rx={7} fill="#2f2f3a" />
    <rect x={-9} y={-46} width={24} height={44} rx={3} fill={lit ? '#bfe6ff' : '#4a4f63'} strokeWidth={0} />
  </g>
);
export const Letter: React.FC = () => (
  <g stroke={INK} strokeWidth={3} transform="rotate(-8)">
    <rect x={-10} y={-50} width={70} height={48} rx={3} fill="#fff6e6" />
    <path d="M -10 -50 L 25 -24 L 60 -50" fill="none" />
  </g>
);
