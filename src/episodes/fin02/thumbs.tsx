// YouTube thumbnails for fin02 (1920×1080; export JPG). High-CTR rules used:
// one giant emotional face, ≤3 big words, complementary colours, white sticker outlines, red arrow/circle on the
// key object, curiosity gap, and NOTHING important bottom-right (YouTube puts the video length there).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../../rig/Character';
import {lookOf} from '../../cast';
import {FONT, INK} from '../../lib/theme';
import {Coin, LatteCup, SwipeCard} from './kit';

export const THUMBS = [
  {id: 'fin02-thumb1', variant: 1},
  {id: 'fin02-thumb2', variant: 2},
  {id: 'fin02-thumb3', variant: 3},
];

/** SVG defs: white sticker outline + soft drop shadow. */
const Defs: React.FC = () => (
  <defs>
    <filter id="sticker" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="12" result="fat" />
      <feFlood floodColor="#ffffff" />
      <feComposite in2="fat" operator="in" result="outline" />
      <feGaussianBlur in="fat" stdDeviation="14" result="blur" />
      <feOffset in="blur" dx="0" dy="18" result="shadowOff" />
      <feFlood floodColor="#000" floodOpacity="0.45" />
      <feComposite in2="shadowOff" operator="in" result="shadow" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="outline" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const Bg: React.FC<{inner: string; outer: string; cx: number; cy: number; rays?: boolean}> = ({inner, outer, cx, cy, rays = true}) => (
  <>
    <radialGradient id={`g-${inner}`} cx={cx / 1920} cy={cy / 1080} r="0.85">
      <stop offset="0" stopColor={inner} />
      <stop offset="1" stopColor={outer} />
    </radialGradient>
    <rect width={1920} height={1080} fill={`url(#g-${inner})`} />
    {rays &&
      Array.from({length: 18}, (_, i) => (
        <path key={i} d={`M ${cx} ${cy} L ${cx - 170} -1500 L ${cx + 170} -1500 Z`} fill="#fff" opacity={0.08} transform={`rotate(${i * 20} ${cx} ${cy})`} />
      ))}
  </>
);

/** Hand-drawn red arrow from (x1,y1) to (x2,y2). */
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; bend?: number}> = ({x1, y1, x2, y2, bend = 120}) => {
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2 - bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h = 70;
  const p1 = [x2 - Math.cos(a - 0.5) * h, y2 - Math.sin(a - 0.5) * h];
  const p2 = [x2 - Math.cos(a + 0.5) * h, y2 - Math.sin(a + 0.5) * h];
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2} M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}`} stroke="#fff" strokeWidth={46} />
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2} M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}`} stroke="#ff1f1f" strokeWidth={26} />
    </g>
  );
};

const Word: React.FC<{children: React.ReactNode; size: number; color: string; rot?: number; style?: React.CSSProperties}> = ({children, size, color, rot = -4, style}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.95,
      color,
      WebkitTextStroke: `${Math.round(size / 7)}px ${INK}`,
      paintOrder: 'stroke fill',
      textShadow: `0 ${size / 12}px 0 ${INK}, 0 ${size / 6}px ${size / 5}px rgba(0,0,0,0.45)`,
      transform: `rotate(${rot}deg)`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

const Badge: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 36, background: '#f6c945', border: `7px solid ${INK}`, borderRadius: 22, padding: '2px 22px', fontFamily: FONT, fontWeight: 700, fontSize: 44, color: INK, transform: 'rotate(-3deg)', boxShadow: '6px 8px 0 rgba(0,0,0,0.4)'}}>
    FINNOMICS
  </div>
);

export const Thumbnail: React.FC<{variant: number}> = ({variant}) => {
  // ---------- 1: "$6 → $14?!" – shocked Finn + latte
  if (variant === 1)
    return (
      <AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <Defs />
          <Bg inner="#ffe27a" outer="#ff7a1a" cx={620} cy={560} />
          {/* giant latte with price tag */}
          <g filter="url(#sticker)" transform="translate(1240 930) rotate(8)">
            <LatteCup s={6.4} steam={6} />
          </g>
          <g transform="translate(1560 420) rotate(12)" filter="url(#sticker)">
            <rect x={-170} y={-80} width={340} height={160} rx={24} fill="#ff1f1f" stroke={INK} strokeWidth={8} />
            <circle cx={-128} cy={0} r={16} fill="#fff" stroke={INK} strokeWidth={6} />
            <text x={22} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={118} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">
              $14
            </text>
          </g>
          {/* Finn – huge shocked face */}
          <g filter="url(#sticker)" transform="translate(500 1720) scale(3.4)">
            <Character uid="t1" look={lookOf('finn')} frame={0} mood="surprised" talk={1} facing={1} pose={['down', 'facepalm']} />
          </g>
          <Arrow x1={880} y1={300} x2={1340} y2={380} bend={-60} />
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 820, top: 70}}>
          <Word size={150} color="#fff" rot={-5}>
            <span style={{textDecoration: 'line-through', textDecorationColor: '#ff1f1f', textDecorationThickness: 18}}>$6</span> LATTE?!
          </Word>
        </div>
      </AbsoluteFill>
    );

  // ---------- 2: "IT'S A TRAP" – evil Mr. Swipe + angry Finn
  if (variant === 2)
    return (
      <AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <Defs />
          <Bg inner="#ff4d4d" outer="#2a0a3a" cx={1300} cy={520} />
          {Array.from({length: 10}, (_, i) => (
            <Coin key={i} x={900 + ((i * 197) % 1000)} y={140 + ((i * 331) % 760)} r={40 + (i % 3) * 14} rot={i * 33} />
          ))}
          <g filter="url(#sticker)">
            <SwipeCard x={1320} y={560} s={3.1} frame={20} talk={0.9} mood="evil" arms="rub" hat="tophat" legs={false} rot={-6} />
          </g>
          <g filter="url(#sticker)" transform="translate(330 1650) scale(3.0)">
            <Character uid="t2" look={lookOf('finn')} frame={0} mood="angry" talk={0.8} facing={1} pose={['down', 'point']} />
          </g>
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 60, top: 120}}>
          <Word size={190} color="#fff" rot={-6}>IT'S A</Word>
          <Word size={250} color="#ffe600" rot={-6} style={{marginTop: -10}}>
            TRAP!
          </Word>
        </div>
      </AbsoluteFill>
    );

  // ---------- 3: "BANKS HATE HER" – proud Grandma Ruth
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <Defs />
        <Bg inner="#b8ff7a" outer="#0f7a4a" cx={1250} cy={600} />
        <g filter="url(#sticker)" transform="translate(1420 1880) scale(3.4)">
          <Character uid="t3" look={lookOf('ruth')} frame={0} mood="smug" talk={0.4} facing={-1} pose={['hips', 'up']} />
        </g>
        {/* cool sunglasses on Grandma */}
        <g transform="translate(1420 1880) scale(3.4)">
          <g transform="translate(0 -302)">
            <rect x={-74} y={-24} width={64} height={40} rx={12} fill={INK} />
            <rect x={6} y={-24} width={64} height={40} rx={12} fill={INK} />
            <path d="M -10 -8 h 16" stroke={INK} strokeWidth={6} />
            <path d="M -66 -16 l 18 0" stroke="#fff" strokeWidth={5} opacity={0.6} />
          </g>
        </g>
        <g transform="translate(250 330) rotate(-12)" filter="url(#sticker)">
          <rect x={-250} y={-70} width={500} height={140} rx={20} fill="#fff" stroke="#ff1f1f" strokeWidth={14} />
          <text y={34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={78} fill="#ff1f1f">$0 INTEREST</text>
        </g>
      </svg>
      <Badge />
      <div style={{position: 'absolute', left: 60, top: 470}}>
        <Word size={190} color="#fff" rot={-5}>BANKS</Word>
        <Word size={210} color="#ffe600" rot={-5} style={{marginTop: 4}}>
          HATE HER
        </Word>
      </div>
    </AbsoluteFill>
  );
};
