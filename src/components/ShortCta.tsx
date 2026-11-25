// End card for Shorts: Finn says "Want to learn more? Check out the full video on YouTube!" (voice: finshorts/cta1).
import React from 'react';
import {AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Character} from '../rig/Character';
import {lookOf} from '../cast';
import {FONT, INK, PAPER} from '../lib/theme';
import {audioLibrary} from '../engine/timeline';
import {Letterbox} from './Letterbox';
import ctaVoices from '../generated/voices/finshorts.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Clip = {file: string; duration: number; lead?: number; env: number[]};
const VOICES = ctaVoices as Record<string, Clip>;
export const ctaFrames = (id: string) => Math.round(((VOICES[id]?.duration ?? 4) + 1.2) * 30);

export const ShortCta: React.FC<{voice: string; who?: string; text: string}> = ({voice, who = 'finn', text}) => {
  const f = useCurrentFrame();
  const clip = VOICES[voice];
  const start = 8;
  const i = f - start;
  const talk = clip && i >= 0 && i < clip.env.length ? clip.env[i] / 100 : 0;
  const inn = interpolate(f, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const pulse = 1 + Math.sin(f / 6) * 0.04;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #2a1f5c 0%, #1d5f7a 55%, #1f8f7a 100%)', overflow: 'hidden'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 1150) rotate(${f * 0.6})`} opacity={0.12}>
          {Array.from({length: 16}, (_, k) => (
            <path key={k} d="M 0 0 L -90 -1400 L 90 -1400 Z" fill="#fff" transform={`rotate(${k * 22.5})`} />
          ))}
        </g>
        <rect x={0} y={1560} width={1080} height={400} fill="#132d40" />
        <g transform={`translate(540 ${1560 + (1 - inn) * 300}) scale(2.1)`}>
          <Character uid="cta-finn" look={lookOf(who)} frame={f} mood="happy" talk={talk} facing={1} pose={['down', 'wave']} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 70, right: 70, top: 230, transform: `scale(${inn})`, background: PAPER, border: `7px solid ${INK}`, borderRadius: 44, padding: '34px 40px', fontFamily: FONT, fontWeight: 700, fontSize: 66, lineHeight: 1.15, color: INK, textAlign: 'center', boxShadow: '10px 14px 0 rgba(0,0,0,0.3)'}}>
        {text}
      </div>
      <div style={{position: 'absolute', left: '50%', top: 640, transform: `translateX(-50%) scale(${inn * pulse})`, display: 'flex', alignItems: 'center', gap: 22, background: '#ff0033', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 60, padding: '24px 46px', borderRadius: 70, border: '7px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,0.4)', whiteSpace: 'nowrap'}}>
        <svg width={70} height={50} viewBox="0 0 54 38">
          <rect width={54} height={38} rx={10} fill="#fff" />
          <path d="M 21 10 L 37 19 L 21 28 Z" fill="#ff0033" />
        </svg>
        Full video on YouTube
      </div>
      {clip && (
        <Sequence from={start - Math.round((clip.lead ?? 0) * 30)}>
          <Html5Audio src={staticFile(clip.file)} />
        </Sequence>
      )}
      <Html5Audio src={staticFile(audioLibrary.sfx.whoosh.file)} volume={0.6} />
      <Letterbox size={22} />
    </AbsoluteFill>
  );
};
