// YouTube thumbnails for fin04 (1920×1080; export JPG). High-CTR rules as fin02/fin03 thumbs.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../../rig/Character';
import {Coin} from '../fin02/kit';
import {Arrow, Badge, Bg, Defs, Word} from '../fin02/thumbs';
import {CandyBar, FINN_04, IceCream, Inflato, PriceTag, RUTH_04} from './kit';

export const THUMBS4 = [
  {id: 'fin04-thumb1', variant: 1},
  {id: 'fin04-thumb2', variant: 2},
  {id: 'fin04-thumb3', variant: 3},
];

export const Thumbnail4: React.FC<{variant: number}> = ({variant}) => {
  // ---------- 1: shocked Grandma + candy bar 35¢ → $2.29
  if (variant === 1)
    return (
      <AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <Defs />
          <Bg inner="#ffe27a" outer="#e8553e" cx={1350} cy={520} />
          <g filter="url(#sticker)" transform="translate(500 1820) scale(3.5)">
            <Character uid="t41" look={RUTH_04} frame={0} mood="surprised" talk={1} facing={1} pose={['down', 'up']} />
          </g>
          <g filter="url(#sticker)" transform="translate(1300 560) rotate(-12)">
            <CandyBar s={3.4} />
          </g>
          <g filter="url(#sticker)">
            <PriceTag x={1180} y={250} s={2.2} text="35¢" color="#fff" rot={-10} />
            <PriceTag x={1500} y={790} s={2.6} text="$2.29" color="#fff6c4" rot={6} />
          </g>
          <path d="M 1020 290 L 1330 200" stroke="#ff1f1f" strokeWidth={14} strokeLinecap="round" />
          <Arrow x1={1680} y1={260} x2={1620} y2={650} bend={-120} />
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 60, top: 140}}>
          <Word size={190} color="#fff" rot={-6}>
            WHAT?!
          </Word>
        </div>
      </AbsoluteFill>
    );

  // ---------- 2: smug Inflato + angry Finn
  if (variant === 2)
    return (
      <AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <Defs />
          <Bg inner="#5fe0d0" outer="#123a4a" cx={1300} cy={480} />
          {Array.from({length: 10}, (_, i) => (
            <Coin key={i} x={820 + ((i * 197) % 1050)} y={120 + ((i * 331) % 820)} r={34 + (i % 3) * 12} rot={i * 33} />
          ))}
          <g filter="url(#sticker)">
            <Inflato x={1340} y={500} s={2.3} frame={30} talk={0.7} puff={1.15} mood="smug" pump />
          </g>
          <g filter="url(#sticker)" transform="translate(340 1700) scale(3.1)">
            <Character uid="t42" look={FINN_04} frame={0} mood="angry" talk={0.8} facing={1} pose={['down', 'point']} />
          </g>
          <Arrow x1={760} y1={760} x2={1030} y2={640} bend={90} />
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 60, top: 150}}>
          <Word size={170} color="#fff" rot={-6}>
            HE'S
          </Word>
          <Word size={170} color="#ffe600" rot={-6} style={{marginTop: -6}}>
            ROBBING YOU
          </Word>
        </div>
      </AbsoluteFill>
    );

  // ---------- 3: worried Finn + melting $100 ice cream
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <Defs />
        <Bg inner="#9fe8ff" outer="#1d5f9a" cx={1350} cy={520} />
        <g filter="url(#sticker)">
          <IceCream x={1360} y={520} s={2.5} melt={0.45} frame={20} label="$100" />
        </g>
        <g filter="url(#sticker)" transform="translate(470 1760) scale(3.4)">
          <Character uid="t43" look={FINN_04} frame={0} mood="scared" talk={0.9} facing={1} pose={['down', 'facepalm']} />
        </g>
        <ellipse cx={1360} cy={1000} rx={360} ry={80} fill="none" stroke="#fff" strokeWidth={36} />
        <ellipse cx={1360} cy={1000} rx={360} ry={80} fill="none" stroke="#ff1f1f" strokeWidth={18} />
      </svg>
      <Badge />
      <div style={{position: 'absolute', left: 860, top: 50}}>
        <Word size={160} color="#ffe600" rot={-5}>
          IT'S MELTING
        </Word>
      </div>
    </AbsoluteFill>
  );
};
