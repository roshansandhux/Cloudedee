// FINNOMICS channel branding – all drawn in code. Rendered as Stills (see Root.tsx):
//   brand-logo (1024², profile picture for YouTube/Instagram/TikTok – safe inside the centre circle)
//   brand-banner (2560×1440 YouTube banner – everything important in the 1546×423 centre safe area)
//   brand-watermark (300² transparent, YouTube "branding watermark")
//   brand-wordmark (2000×600 transparent wordmark for posts / end screens)
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../rig/Character';
import {lookOf} from '../cast';
import {FONT, INK} from '../lib/theme';
import {Coin, SwipeCard} from '../episodes/fin02/kit';

export const BRAND = {
  name: 'FINNOMICS',
  tagline: 'Money explained by a 14-year-old (with jokes)',
  email: 'finnomics.yt@gmail.com',
  teal: '#1f8f7a',
  purple: '#2a1f5c',
  gold: '#f6c945',
};

const Burst: React.FC<{w: number; h: number; cx: number; cy: number; id: string}> = ({w, h, cx, cy, id}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={BRAND.purple} />
        <stop offset="0.55" stopColor="#1d5f7a" />
        <stop offset="1" stopColor={BRAND.teal} />
      </linearGradient>
      <radialGradient id={`glow-${id}`}>
        <stop offset="0" stopColor="#ffe27a" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ffe27a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={w} height={h} fill={`url(#bg-${id})`} />
    {Array.from({length: 22}, (_, i) => (
      <path key={i} d={`M ${cx} ${cy} L ${cx - 160} ${cy - 3000} L ${cx + 160} ${cy - 3000} Z`} fill="#fff" opacity={0.07} transform={`rotate(${i * (360 / 22)} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.45} fill={`url(#glow-${id})`} />
  </svg>
);

/** "FINN●MICS" – the O is a gold coin. */
export const Wordmark: React.FC<{size: number}> = ({size}) => {
  const st: React.CSSProperties = {fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1, WebkitTextStroke: `${Math.round(size / 9)}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size / 14}px 0 rgba(0,0,0,0.35)`};
  return (
    <div style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
      <span style={{...st, color: '#fff'}}>FINN</span>
      <svg width={size * 0.86} height={size * 0.86} viewBox="-60 -60 120 120" style={{margin: `0 ${size * 0.02}px`, transform: 'rotate(-10deg)'}}>
        <Coin x={0} y={0} r={52} />
      </svg>
      <span style={{...st, color: BRAND.gold}}>MICS</span>
    </div>
  );
};

export const Logo: React.FC = () => (
  <AbsoluteFill>
    <Burst w={1024} h={1024} cx={512} cy={470} id="logo" />
    <svg width={1024} height={1024} viewBox="0 0 1024 1024" style={{position: 'absolute', inset: 0}}>
      <Coin x={800} y={250} r={95} rot={-15} />
      <Coin x={215} y={300} r={60} rot={20} />
      <g transform="translate(512 1330) scale(2.3)">
        <Character uid="logo-finn" look={lookOf('finn')} frame={0} mood="happy" talk={0.45} facing={1} pose={['down', 'wave']} />
      </g>
    </svg>
  </AbsoluteFill>
);

export const Banner: React.FC = () => (
  <AbsoluteFill>
    <Burst w={2560} h={1440} cx={1280} cy={720} id="banner" />
    <svg width={2560} height={1440} viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
      {/* decorative coins (outside the safe area is fine) */}
      {Array.from({length: 26}, (_, i) => ({x: (i * 397) % 2560, y: 120 + ((i * 263) % 1200), i}))
        .filter((c) => !(c.x > 380 && c.x < 2180 && c.y > 400 && c.y < 960))
        .map((c) => (
          <Coin key={c.i} x={c.x} y={c.y} r={30 + (c.i % 4) * 14} rot={c.i * 25} />
        ))}
      {/* Finn on the left of the safe area, Mr. Swipe + Grandma on the right */}
      <g transform="translate(330 1300) scale(1.4)">
        <Character uid="ban-finn" look={lookOf('finn')} frame={0} mood="happy" talk={0.5} facing={1} pose={['down', 'point']} />
      </g>
      <g transform="translate(2230 1280) scale(1.2)">
        <Character uid="ban-ruth" look={lookOf('ruth')} frame={0} mood="smug" talk={0.2} facing={-1} pose={['hips', 'up']} />
      </g>
      <SwipeCard x={2250} y={330} s={0.9} frame={20} talk={0.4} mood="sly" arms="rub" hat="tophat" legs={false} rot={8} />
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
      <Wordmark size={190} />
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 64, color: '#fff', WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill'}}>{BRAND.tagline}</div>
    </div>
  </AbsoluteFill>
);

export const Watermark: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <svg width={300} height={300} viewBox="0 0 300 300">
      <circle cx={150} cy={150} r={140} fill="#ff0033" stroke="#fff" strokeWidth={14} />
      <g transform="translate(150 150)">
        <Coin x={0} y={-20} r={70} />
      </g>
      <text x={150} y={246} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#fff">
        SUBSCRIBE
      </text>
    </svg>
  </AbsoluteFill>
);

export const WordmarkStill: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Wordmark size={300} />
  </AbsoluteFill>
);

export const BRAND_STILLS = [
  {id: 'brand-logo', component: Logo, width: 1024, height: 1024},
  {id: 'brand-banner', component: Banner, width: 2560, height: 1440},
  {id: 'brand-watermark', component: Watermark, width: 300, height: 300},
  {id: 'brand-wordmark', component: WordmarkStill, width: 2000, height: 600},
];
