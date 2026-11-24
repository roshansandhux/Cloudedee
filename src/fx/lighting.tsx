// LIGHTING – screen-space grading layers + world-space darkness with light pools.
import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Screen-space colour grade. kind: warm daylight / lab green / night / sunrise. */
export const Light: React.FC<{kind: 'warm' | 'lab' | 'night' | 'sunrise' | 'tv'; strength?: number; flicker?: number}> = ({kind, strength = 1, flicker = 0}) => {
  const k = strength * (1 - flicker);
  const layers: Record<string, React.CSSProperties[]> = {
    warm: [
      {background: 'linear-gradient(160deg, rgba(255,170,90,0.35), rgba(255,120,40,0.08) 60%, rgba(120,40,20,0.18))', mixBlendMode: 'soft-light'},
      {background: 'radial-gradient(ellipse at 85% 10%, rgba(255,200,120,0.35), rgba(255,200,120,0) 55%)', mixBlendMode: 'screen'},
    ],
    sunrise: [
      {background: 'linear-gradient(180deg, rgba(255,150,120,0.3), rgba(255,210,150,0.12) 50%, rgba(80,60,120,0.12))', mixBlendMode: 'soft-light'},
      {background: 'radial-gradient(ellipse at 20% 30%, rgba(255,220,160,0.4), rgba(255,220,160,0) 60%)', mixBlendMode: 'screen'},
    ],
    lab: [
      {background: 'rgba(60,255,140,0.22)', mixBlendMode: 'multiply'},
      {background: 'radial-gradient(ellipse at 50% 35%, rgba(120,255,160,0.28), rgba(0,40,20,0) 65%)', mixBlendMode: 'screen'},
      {background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,25,10,0.55) 100%)'},
    ],
    night: [
      {background: 'rgba(40,60,140,0.38)', mixBlendMode: 'multiply'},
      {background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(5,5,25,0.6) 100%)'},
    ],
    tv: [
      {background: 'rgba(30,40,110,0.55)', mixBlendMode: 'multiply'},
      {background: 'radial-gradient(ellipse at 50% 55%, rgba(120,170,255,0.32), rgba(0,0,0,0) 55%)', mixBlendMode: 'screen'},
      {background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(5,5,20,0.65) 100%)'},
    ],
  };
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
      {layers[kind].map((st, i) => (
        <AbsoluteFill key={i} style={st} />
      ))}
    </AbsoluteFill>
  );
};

/** World-space darkness with soft pools of light (street lamps, torches, glowing signs). Put in Stage `front`. */
export const Darkness: React.FC<{lights: {x: number; y: number; r: number; color?: string}[]; opacity?: number; color?: string; id?: string}> = ({lights, opacity = 0.6, color = '#070a20', id = 'dark'}) => (
  <g style={{pointerEvents: 'none'}}>
    <defs>
      <radialGradient id={`${id}-hole`}>
        <stop offset="0" stopColor="#000" />
        <stop offset="0.55" stopColor="#000" stopOpacity={0.7} />
        <stop offset="1" stopColor="#000" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" stopColor="#fff" stopOpacity={1} />
        <stop offset="1" stopColor="#fff" stopOpacity={0} />
      </radialGradient>
      <mask id={`${id}-mask`}>
        <rect x={-3000} y={-3000} width={9000} height={9000} fill="#fff" />
        {lights.map((l, i) => (
          <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#${id}-hole)`} />
        ))}
      </mask>
    </defs>
    <rect x={-3000} y={-3000} width={9000} height={9000} fill={color} opacity={opacity} mask={`url(#${id}-mask)`} />
    {lights.map((l, i) =>
      l.color ? (
        <g key={`g${i}`} style={{mixBlendMode: 'screen'}}>
          <defs>
            <radialGradient id={`${id}-c${i}`}>
              <stop offset="0" stopColor={l.color} stopOpacity={0.35} />
              <stop offset="1" stopColor={l.color} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={l.x} cy={l.y} r={l.r * 0.9} fill={`url(#${id}-c${i})`} />
        </g>
      ) : null,
    )}
  </g>
);
