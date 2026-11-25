// YouTube thumbnails for fin02 (1920×1080 stills; export as JPG). Big readable text, episode badge, soft look.
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

const Burst: React.FC<{a: string; b: string; cx?: number; cy?: number}> = ({a, b, cx = 960, cy = 540}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs>
      <radialGradient id={`tb-${a}`} cx={cx / 1920} cy={cy / 1080} r="0.8">
        <stop offset="0" stopColor={a} />
        <stop offset="1" stopColor={b} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#tb-${a})`} />
    {Array.from({length: 20}, (_, i) => (
      <path key={i} d={`M ${cx} ${cy} L ${cx - 140} -1400 L ${cx + 140} -1400 Z`} fill="#fff" opacity={0.07} transform={`rotate(${i * 18} ${cx} ${cy})`} />
    ))}
  </svg>
);

const Text: React.FC<{children: React.ReactNode; size: number; color: string; style?: React.CSSProperties}> = ({children, size, color, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1.0, color, WebkitTextStroke: `${Math.round(size / 9)}px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.35)', whiteSpace: 'nowrap', ...style}}>
    {children}
  </div>
);

const Badge: React.FC = () => (
  <div style={{position: 'absolute', left: 50, top: 46, background: '#f6c945', border: `8px solid ${INK}`, borderRadius: 26, padding: '6px 30px', fontFamily: FONT, fontWeight: 700, fontSize: 60, color: INK, transform: 'rotate(-4deg)', boxShadow: '8px 10px 0 rgba(0,0,0,0.35)'}}>
    FINNOMICS
  </div>
);

export const Thumbnail: React.FC<{variant: number}> = ({variant}) => {
  if (variant === 1)
    return (
      <AbsoluteFill>
        <Burst a="#ffb36b" b="#8a3a2a" cx={520} cy={620} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <g transform="translate(520 1500) scale(2.5)">
            <Character uid="t1" look={lookOf('finn')} frame={0} mood="surprised" talk={0.9} facing={1} pose={['down', 'hold']} holding={<LatteCup s={0.6} />} />
          </g>
        </svg>
        <Badge />
        <div style={{position: 'absolute', right: 70, top: 200, textAlign: 'right'}}>
          <Text size={150} color="#fff">$6 LATTE</Text>
          <Text size={250} color="#ff5a3c" style={{marginTop: 20}}>= $14?!</Text>
          <Text size={80} color="#f6c945" style={{marginTop: 40}}>credit card trick 💳</Text>
        </div>
      </AbsoluteFill>
    );
  if (variant === 2)
    return (
      <AbsoluteFill>
        <Burst a="#7b5ea7" b="#1b1240" cx={1350} cy={560} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 14}, (_, i) => (
            <Coin key={i} x={1000 + ((i * 173) % 900)} y={120 + ((i * 251) % 820)} r={34 + (i % 3) * 12} rot={i * 30} />
          ))}
          <SwipeCard x={1500} y={650} s={2.3} frame={20} talk={0.7} mood="sly" arms="rub" hat="tophat" legs={false} />
          <g transform="translate(330 1420) scale(2.2)">
            <Character uid="t2" look={lookOf('finn')} frame={0} mood="angry" talk={0.6} facing={1} pose={['down', 'point']} />
          </g>
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 60, top: 190}}>
          <Text size={130} color="#fff">CREDIT CARDS</Text>
          <Text size={130} color="#f6c945" style={{marginTop: 10}}>ARE TRICKING YOU</Text>
        </div>
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <Burst a="#9ad36a" b="#1f6b4a" cx={1250} cy={600} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <g transform="translate(1280 1560) scale(2.5)">
          <Character uid="t3" look={lookOf('ruth')} frame={0} mood="smug" talk={0.3} facing={-1} pose={['hips', 'up']} />
        </g>
        <g transform="translate(260 1400) scale(1.9)">
          <Character uid="t3b" look={lookOf('finn')} frame={0} mood="surprised" talk={0.9} facing={1} pose={['down', 'facepalm']} />
        </g>
      </svg>
      <Badge />
      <div style={{position: 'absolute', left: 60, top: 180}}>
        <Text size={110} color="#fff">BANKS CALL HER A</Text>
        <Text size={190} color="#ff5a3c" style={{marginTop: 14}}>“DEADBEAT”</Text>
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 70, transform: 'rotate(-8deg)', fontFamily: FONT, fontWeight: 700, fontSize: 72, color: '#e8553e', border: '10px solid #e8553e', borderRadius: 20, padding: '4px 26px', background: 'rgba(255,250,241,0.92)'}}>
        $0 INTEREST ✓
      </div>
    </AbsoluteFill>
  );
};
