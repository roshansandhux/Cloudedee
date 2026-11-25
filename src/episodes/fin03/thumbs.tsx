// YouTube thumbnails for fin03 (1920×1080; export JPG). Same high-CTR rules as fin02/thumbs.tsx:
// one giant emotional face, ≤3 big words that don't repeat the title, complementary colours, white sticker outlines,
// red arrow/circle on the key object, curiosity gap, FINNOMICS badge top-left, nothing important bottom-right.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../../rig/Character';
import {FONT, INK} from '../../lib/theme';
import {Coin} from '../fin02/kit';
import {Arrow, Badge, Bg, Defs, Word} from '../fin02/thumbs';
import {Shield} from './scenesA';
import {Beaver, FINN_CA, MapleLeaf, TaxMoose} from './kit';

export const THUMBS3 = [
  {id: 'fin03-thumb1', variant: 1},
  {id: 'fin03-thumb2', variant: 2},
  {id: 'fin03-thumb3', variant: 3},
];

export const Thumbnail3: React.FC<{variant: number}> = ({variant}) => {
  // ---------- 1: "TAX-FREE?!" – shocked Finn + glowing TFSA shield + $1.4M
  if (variant === 1)
    return (
      <AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <Defs />
          <Bg inner="#ff5a5a" outer="#7a0a14" cx={1300} cy={520} />
          {[[1650, 160, 0.9, 20], [180, 900, 0.8, -15], [1080, 980, 0.7, 30]].map(([x, y, s, r], i) => (
            <MapleLeaf key={i} x={x} y={y} s={s * 2} color="#ffffff" rot={r} />
          ))}
          {Array.from({length: 8}, (_, i) => (
            <Coin key={i} x={1000 + ((i * 211) % 860)} y={150 + ((i * 337) % 780)} r={36 + (i % 3) * 12} rot={i * 33} />
          ))}
          <g filter="url(#sticker)">
            <Shield x={1360} y={560} s={2.9} label="TFSA" color="#2fb36a" sub="= $1.4M" />
          </g>
          <g filter="url(#sticker)" transform="translate(470 1760) scale(3.4)">
            <Character uid="t31" look={FINN_CA} frame={0} mood="surprised" talk={1} facing={1} pose={['down', 'point']} />
          </g>
          <Arrow x1={760} y1={330} x2={1120} y2={430} bend={-70} />
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 1020, top: 40}}>
          <Word size={150} color="#ffe600" rot={-5}>
            TAX-FREE?!
          </Word>
        </div>
      </AbsoluteFill>
    );

  // ---------- 2: "STOP PAYING HIM" – smug Tax Moose, angry Finn
  if (variant === 2)
    return (
      <AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <Defs />
          <Bg inner="#5fd3ff" outer="#0a2a5a" cx={1250} cy={480} />
          {Array.from({length: 10}, (_, i) => (
            <Coin key={i} x={820 + ((i * 197) % 1050)} y={120 + ((i * 331) % 820)} r={34 + (i % 3) * 12} rot={i * 33} />
          ))}
          <g filter="url(#sticker)" transform="translate(1320 1560) scale(2.2)">
            <TaxMoose x={0} y={0} frame={30} talk={0.5} mood="smug" arms="rub" flip />
          </g>
          <g filter="url(#sticker)" transform="translate(330 1700) scale(3.1)">
            <Character uid="t32" look={FINN_CA} frame={0} mood="angry" talk={0.8} facing={1} pose={['down', 'point']} />
          </g>
          <Arrow x1={760} y1={760} x2={1080} y2={700} bend={90} />
        </svg>
        <Badge />
        <div style={{position: 'absolute', left: 60, top: 150}}>
          <Word size={170} color="#fff" rot={-6}>
            STOP
          </Word>
          <Word size={170} color="#ffe600" rot={-6} style={{marginTop: -6}}>
            PAYING HIM
          </Word>
        </div>
      </AbsoluteFill>
    );

  // ---------- 3: "DON'T WAIT!" – Bernie the Beaver + two growth lines
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <Defs />
        <Bg inner="#b8ff7a" outer="#0f6a3a" cx={1300} cy={600} />
        <g filter="url(#sticker)">
          <rect x={980} y={140} width={860} height={560} rx={40} fill="#fffaf1" stroke={INK} strokeWidth={10} />
          <path d="M 1040 640 C 1300 630 1500 560 1780 200" fill="none" stroke="#2fb36a" strokeWidth={26} strokeLinecap="round" />
          <path d="M 1040 650 C 1350 645 1560 610 1780 430" fill="none" stroke="#e5302f" strokeWidth={26} strokeLinecap="round" />
          <text x={1700} y={190} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={66} fill="#2fb36a">
            START 25
          </text>
          <text x={1790} y={600} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={66} fill="#e5302f">
            START 35
          </text>
        </g>
        <g filter="url(#sticker)" transform="translate(520 1330) scale(2.75)">
          <Beaver x={0} y={0} frame={0} talk={0.7} mood="shock" arms="up" stick={false} />
        </g>
        <ellipse cx={1770} cy={320} rx={120} ry={170} fill="none" stroke="#fff" strokeWidth={40} />
        <ellipse cx={1770} cy={320} rx={120} ry={170} fill="none" stroke="#ff1f1f" strokeWidth={22} />
        <Arrow x1={1060} y1={860} x2={1620} y2={420} bend={-160} />
      </svg>
      <Badge />
      <div style={{position: 'absolute', left: 60, top: 140}}>
        <Word size={180} color="#ffe600" rot={-6}>
          DON'T
        </Word>
        <Word size={180} color="#fff" rot={-6} style={{marginTop: -6}}>
          WAIT!
        </Word>
      </div>
    </AbsoluteFill>
  );
};
