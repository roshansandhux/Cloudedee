// Model sheet: every mood and pose for a cast member. Render with:  npm run stills -- RigSheet
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Character, type ArmPose} from './rig/Character';
import {lookOf, CAST} from './cast';
import type {Mood} from './engine/timeline';
import {FONT, INK} from './lib/theme';
import {ensureFonts} from './lib/fonts';

ensureFonts();

const MOODS: Mood[] = ['neutral', 'happy', 'angry', 'sad', 'surprised', 'worried', 'smug', 'confused', 'determined', 'sleepy'];
const POSES: ArmPose[] = ['down', 'wave', 'point', 'hips', 'shrug', 'up', 'think', 'hold', 'cross', 'reach', 'facepalm', 'fist'];

export const RigSheet: React.FC<{who: string}> = ({who}) => {
  const frame = useCurrentFrame();
  const look = lookOf(who);
  const cell = (label: string, el: React.ReactNode, i: number, row: number, cols: number) => (
    <g key={label} transform={`translate(${(i + 0.5) * (1920 / cols)} ${row})`}>
      <g transform="scale(0.5)">{el}</g>
      <text y={34} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={600} fill={INK}>
        {label}
      </text>
    </g>
  );
  return (
    <AbsoluteFill style={{background: '#f7efe2'}}>
      <svg width={1920} height={1080}>
        <text x={40} y={60} fontFamily={FONT} fontSize={44} fontWeight={700} fill={INK}>
          {CAST[who].name} – model sheet
        </text>
        {MOODS.map((m, i) => cell(m, <Character uid={`${who}m${i}`} look={look} frame={frame} mood={m} talk={m === 'surprised' ? 0.3 : 0} />, i, 330, MOODS.length))}
        {POSES.map((p, i) => cell(p, <Character uid={`${who}p${i}`} look={look} frame={frame} pose={p} facing={1} />, i, 650, POSES.length))}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => cell(`talk ${t}`, <Character uid={`${who}t${i}`} look={look} frame={frame} talk={t} mood="happy" />, i, 970, 10))}
        {[0, 1, 2, 3, 4].map((k, i) => cell(`walk ${k}`, <Character uid={`${who}w${i}`} look={look} frame={frame} walking walkPhase={(k * Math.PI) / 2.5} />, i + 5, 970, 10))}
      </svg>
    </AbsoluteFill>
  );
};
