// THE CHARACTER RIG
// Big round head, dot eyes, expressive eyebrows, simple mouth, long noodle limbs.
// Idle breathing + blinking are automatic. Walk cycle when `walking` is set.
// Mouth opens from `talk` (0..1) – the Stage feeds it from the voice loudness.
// Origin (0,0) is between the feet. Drawn facing right; facing=-1 mirrors it.

import React from 'react';
import {random} from 'remotion';
import type {Mood} from '../engine/timeline';
import {OUTLINE, type Look} from './looks';

export type ArmPose =
  | 'down'
  | 'wave'
  | 'point'
  | 'hips'
  | 'shrug'
  | 'up'
  | 'think'
  | 'hold'
  | 'cross'
  | 'reach'
  | 'facepalm'
  | 'fist';

export type CharacterProps = {
  look: Look;
  uid: string;
  frame: number;
  mood?: Mood;
  talk?: number;
  facing?: 1 | -1;
  /** [back arm, front arm] or one pose for both */
  pose?: ArmPose | [ArmPose, ArmPose];
  walking?: boolean;
  /** walk phase in radians – Stage derives it from distance travelled so feet don't slide */
  walkPhase?: number;
  /** 0..1 run instead of walk */
  run?: boolean;
  /** pupil offset, -1..1 each */
  look2?: {x: number; y: number};
  /** squash (<1) and stretch (>1) */
  squash?: number;
  /** lean in degrees */
  lean?: number;
  eyesClosed?: boolean;
  /** draw a held prop in the front hand */
  holding?: React.ReactNode;
  sitting?: boolean;
};

type V = [number, number];

// Hand targets relative to the shoulder, in "facing right" space. [ctrl, hand]
const ARM: Record<ArmPose, {c: V; h: V}> = {
  down: {c: [22, 60], h: [18, 120]},
  wave: {c: [86, -10], h: [100, -96]},
  point: {c: [62, 6], h: [134, -14]},
  hips: {c: [64, 28], h: [30, 74]},
  shrug: {c: [58, 46], h: [74, -18]},
  up: {c: [80, -50], h: [92, -136]},
  think: {c: [62, 46], h: [30, -38]},
  hold: {c: [34, 66], h: [78, 50]},
  cross: {c: [44, 60], h: [-22, 52]},
  reach: {c: [70, -10], h: [138, -48]},
  facepalm: {c: [60, 30], h: [42, -64]},
  fist: {c: [54, 40], h: [70, -6]},
};

/** Eyebrow shapes per mood: [inner y offset, outer y offset] (negative = up), for back & front brow */
const BROWS: Record<Mood, {b: V; f: V; lift: number}> = {
  neutral: {b: [0, 0], f: [0, 0], lift: 0},
  happy: {b: [-3, 2], f: [-3, 2], lift: -6},
  angry: {b: [9, -6], f: [9, -6], lift: 4},
  sad: {b: [-9, 5], f: [-9, 5], lift: -2},
  surprised: {b: [-4, -2], f: [-4, -2], lift: -16},
  worried: {b: [-10, 4], f: [-10, 4], lift: -6},
  smug: {b: [4, 1], f: [-6, -8], lift: -2},
  confused: {b: [6, -2], f: [-8, -6], lift: -4},
  determined: {b: [7, -4], f: [7, -4], lift: 2},
  sleepy: {b: [2, 4], f: [2, 4], lift: 4},
};
/** Mouth curvature per mood (+ smile / - frown) and a resting openness */
const MOUTH: Record<Mood, {curve: number; open: number; width: number}> = {
  neutral: {curve: 3, open: 0, width: 1},
  happy: {curve: 12, open: 0.15, width: 1.15},
  angry: {curve: -7, open: 0, width: 0.9},
  sad: {curve: -9, open: 0, width: 0.85},
  surprised: {curve: 0, open: 0.55, width: 0.7},
  worried: {curve: -5, open: 0.05, width: 0.85},
  smug: {curve: 8, open: 0, width: 1},
  confused: {curve: -2, open: 0, width: 0.8},
  determined: {curve: -1, open: 0, width: 0.95},
  sleepy: {curve: 1, open: 0, width: 0.7},
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) + amt * 255)));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

/** A noodle: an outlined round-capped stroke along a quadratic curve. */
const Noodle: React.FC<{a: V; c: V; b: V; w: number; color: string; outline: string}> = ({a, c, b, w, color, outline}) => {
  const d = `M ${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
  return (
    <>
      <path d={d} stroke={outline} strokeWidth={w + 7} fill="none" strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />
    </>
  );
};

export const Character: React.FC<CharacterProps> = (p) => {
  const L = p.look;
  const o = L.outline ?? OUTLINE;
  const mood = p.mood ?? 'neutral';
  const f = p.frame;
  const seed = p.uid;
  const R = L.head ?? 98;
  const girth = L.girth ?? 1;
  const legLen = 128 * (L.legLength ?? 1);
  const talk = Math.max(0, Math.min(1, p.talk ?? 0));

  // ---- idle breathing, blink, tiny sway ----
  const breathe = Math.sin(f / 22 + random(seed) * 6);
  const blinkPeriod = 95 + Math.floor(random(`${seed}b`) * 60);
  const bt = (f + Math.floor(random(`${seed}o`) * 200)) % blinkPeriod;
  const blinkAmt = bt < 5 ? [0.6, 0.1, 0.05, 0.3, 0.75][bt] : 1;
  const eyeOpen = p.eyesClosed || mood === 'sleepy' ? (mood === 'sleepy' && !p.eyesClosed ? 0.35 : 0.08) : blinkAmt;

  // ---- walk cycle ----
  const phase = p.walkPhase ?? f * 0.28;
  const walking = !!p.walking && !p.sitting;
  const stride = walking ? (p.run ? 46 : 30) : 0;
  const lift = walking ? (p.run ? 30 : 18) : 0;
  const bob = walking ? Math.abs(Math.sin(phase)) * (p.run ? 12 : 6) : breathe * 1.5;

  const hipY = -legLen - 2 + bob * 0.5 - (p.sitting ? -50 : 0);
  const torsoH = 122;
  const neckY = hipY - torsoH + breathe * 1.2;
  const headY = neckY - R * 0.8 + (walking ? bob * 0.3 : breathe * 0.6);
  const shoulderY = neckY + 14;
  const bodyW = 48 * girth;

  // Legs
  const legs = [0, 1].map((i) => {
    const ph = phase + i * Math.PI;
    const hipX = (i ? 10 : -10) * girth;
    let footX = hipX + Math.sin(ph) * stride;
    let footY = -Math.max(0, Math.cos(ph)) * lift;
    if (p.sitting) {
      footX = hipX + 70;
      footY = 0;
    }
    const knee: V = p.sitting
      ? [hipX + 74, hipY + 4]
      : [lerp(hipX, footX, 0.5) + 14 + (walking ? Math.cos(ph) * 8 : 0), lerp(hipY, footY, 0.5)];
    return {hip: [hipX, hipY] as V, knee, foot: [footX, footY] as V, back: i === 0};
  });

  // Arms
  const poses: [ArmPose, ArmPose] = Array.isArray(p.pose) ? p.pose : [p.pose ?? 'down', p.pose ?? 'down'];
  const arms = [0, 1].map((i) => {
    const pose = poses[i];
    const base = ARM[pose];
    const sx = i ? 30 * girth : -30 * girth;
    const sh: V = [sx, shoulderY];
    let [hx, hy] = base.h;
    let [cx, cy] = base.c;
    const mirror = i === 0 && (pose === 'down' || pose === 'hips' || pose === 'shrug' || pose === 'up');
    if (mirror) {
      hx = -hx;
      cx = -cx;
    }
    if (pose === 'wave') {
      const w = Math.sin(f * 0.45) * 20;
      hx += w;
      cx += w * 0.4;
    }
    if (pose === 'down' && walking) {
      const sw = Math.sin(phase + (i ? 0 : Math.PI)) * (p.run ? 40 : 22);
      hx += sw;
      cx += sw * 0.5;
    } else if (pose === 'down') {
      hy += breathe * 1.5;
    }
    // little talking gestures on the front arm
    if (i === 1 && talk > 0.05 && (pose === 'down' || pose === 'hips' || pose === 'shrug' || pose === 'point')) {
      const g = Math.sin(f * 0.18) * 8 * Math.min(1, talk * 2);
      hy -= Math.abs(g) * (pose === 'down' ? 3 : 1);
      hx += pose === 'down' ? Math.abs(g) * 2.5 : 0;
    }
    return {sh, c: [sx + cx, shoulderY + cy] as V, h: [sx + hx, shoulderY + hy] as V, back: i === 0, pose};
  });

  const g = `${seed}`.replace(/[^a-zA-Z0-9]/g, '');
  const squash = p.squash ?? 1;
  const outfit = L.outfit ?? 'shirt';
  const brows = BROWS[mood];
  const mouth = MOUTH[mood];
  const openAmt = Math.max(mouth.open, talk);
  const pupil = p.look2 ?? {x: 0.35, y: 0};

  const legColor = L.legs;
  const armW = 15;
  const legW = 17;

  const drawLeg = (l: (typeof legs)[number]) => (
    <g key={l.back ? 'lb' : 'lf'}>
      <Noodle a={l.hip} c={l.knee} b={l.foot} w={legW} color={l.back ? shade(legColor, -0.08) : legColor} outline={o} />
      <ellipse cx={l.foot[0] + 12} cy={l.foot[1] - 4} rx={22} ry={11} fill={l.back ? shade(L.shoes, -0.1) : L.shoes} stroke={o} strokeWidth={3.5} />
    </g>
  );
  const drawArm = (a: (typeof arms)[number]) => (
    <g key={a.back ? 'ab' : 'af'}>
      <Noodle a={a.sh} c={a.c} b={a.h} w={armW} color={a.back ? shade(L.body, -0.1) : L.body} outline={o} />
      {!a.back && p.holding ? <g transform={`translate(${a.h[0]} ${a.h[1]})`}>{p.holding}</g> : null}
      <circle cx={a.h[0]} cy={a.h[1]} r={a.pose === 'fist' ? 13 : 11.5} fill={a.back ? shade(L.skin, -0.08) : L.skin} stroke={o} strokeWidth={3.5} />
    </g>
  );

  // Torso path (bean shape; dress flares at the bottom)
  const flare = outfit === 'dress' ? 26 : outfit === 'coat' ? 10 : 0;
  const bottom = hipY + (outfit === 'dress' ? 30 : outfit === 'coat' ? 22 : 8);
  const torso = `M ${-bodyW + 6} ${neckY + 4}
    Q ${-bodyW - 6} ${neckY + 40} ${-bodyW - flare} ${bottom}
    Q 0 ${bottom + 12} ${bodyW + flare} ${bottom}
    Q ${bodyW + 6} ${neckY + 40} ${bodyW - 6} ${neckY + 4}
    Q 0 ${neckY - 10} ${-bodyW + 6} ${neckY + 4} Z`;

  // Mouth geometry (head-local coords, facing right)
  const mx = R * 0.22;
  const my = R * 0.36;
  const mw = 18 * mouth.width * (1 - openAmt * 0.25) + 4;
  const mh = 4 + openAmt * 30;
  const curve = mouth.curve * (1 - openAmt * 0.5);
  const mouthEl =
    openAmt < 0.08 ? (
      <path d={`M ${mx - mw} ${my - curve * 0.3} Q ${mx} ${my + curve} ${mx + mw} ${my - curve * 0.3}`} stroke={o} strokeWidth={5} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <path
          d={`M ${mx - mw} ${my - curve * 0.3} Q ${mx} ${my + curve * 0.6 - 2} ${mx + mw} ${my - curve * 0.3}
              Q ${mx + mw * 0.9} ${my + mh} ${mx} ${my + mh + curve * 0.3}
              Q ${mx - mw * 0.9} ${my + mh} ${mx - mw} ${my - curve * 0.3} Z`}
          fill="#5a1f2b"
          stroke={o}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {mh > 14 && <ellipse cx={mx} cy={my + mh * 0.75} rx={mw * 0.55} ry={mh * 0.22} fill="#e8707f" />}
      </g>
    );

  // Eyes
  const eyeY = -R * 0.06;
  const eyes = [-1, 1].map((s) => {
    const ex = R * 0.2 + s * R * 0.3;
    const er = R * 0.105;
    return (
      <g key={s} transform={`translate(${ex} ${eyeY}) scale(1 ${eyeOpen})`}>
        <ellipse cx={pupil.x * 4} cy={pupil.y * 4} rx={er} ry={er * 1.18} fill={o} />
        {eyeOpen > 0.4 && <circle cx={pupil.x * 4 + er * 0.35} cy={pupil.y * 4 - er * 0.4} r={er * 0.32} fill="#fff" />}
      </g>
    );
  });
  const browEls = [-1, 1].map((s) => {
    const ex = R * 0.2 + s * R * 0.3;
    const bw = R * 0.17;
    const by = eyeY - R * 0.26 + brows.lift + (mood === 'surprised' ? -4 : 0);
    const shape = s < 0 ? brows.b : brows.f;
    // inner end is the one nearer the face centre
    const innerX = ex - s * bw;
    const outerX = ex + s * bw;
    return (
      <path
        key={`br${s}`}
        d={`M ${innerX} ${by + shape[0]} Q ${ex} ${by - 5 + (shape[0] + shape[1]) / 2} ${outerX} ${by + shape[1]}`}
        stroke={L.hairColor && L.hair !== 'none' ? shade(L.hairColor, -0.15) : o}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
    );
  });

  const hairC = L.hairColor ?? '#3b2a20';
  const hatC = L.hatColor ?? '#d9534f';

  const hairBack = () => {
    switch (L.hair) {
      case 'bob':
        return <path d={`M ${-R * 1.04} ${R * 0.25} Q ${-R * 1.15} ${-R * 1.1} 0 ${-R * 1.08} Q ${R * 1.15} ${-R * 1.1} ${R * 1.04} ${R * 0.25} L ${R * 0.75} ${R * 0.3} L ${-R * 0.75} ${R * 0.3} Z`} fill={hairC} stroke={o} strokeWidth={4} />;
      case 'bun':
        return <circle cx={-R * 0.35} cy={-R * 1.02} r={R * 0.34} fill={hairC} stroke={o} strokeWidth={4} />;
      case 'pigtails':
        return (
          <>
            <ellipse cx={-R * 1.05} cy={R * 0.1} rx={R * 0.26} ry={R * 0.42} fill={hairC} stroke={o} strokeWidth={4} />
            <ellipse cx={R * 1.05} cy={R * 0.1} rx={R * 0.26} ry={R * 0.42} fill={hairC} stroke={o} strokeWidth={4} />
          </>
        );
      default:
        return null;
    }
  };
  const hairFront = () => {
    switch (L.hair) {
      case 'tuft':
        return <path d={`M ${-R * 0.1} ${-R * 0.98} q ${-R * 0.1} ${-R * 0.35} ${R * 0.08} ${-R * 0.42} q ${-R * 0.02} ${R * 0.2} ${R * 0.12} ${R * 0.4}`} fill="none" stroke={o} strokeWidth={5} strokeLinecap="round" />;
      case 'spiky':
        return (
          <path
            d={`M ${-R * 0.85} ${-R * 0.5} L ${-R * 0.75} ${-R * 1.12} L ${-R * 0.45} ${-R * 0.88} L ${-R * 0.25} ${-R * 1.32} L ${R * 0.05} ${-R * 0.95} L ${R * 0.35} ${-R * 1.3} L ${R * 0.5} ${-R * 0.88} L ${R * 0.85} ${-R * 1.1} L ${R * 0.88} ${-R * 0.5} Q 0 ${-R * 0.78} ${-R * 0.85} ${-R * 0.5} Z`}
            fill={hairC}
            stroke={o}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        );
      case 'bob':
      case 'pigtails':
      case 'bun':
      case 'swoop':
        return (
          <path
            d={`M ${-R * 0.98} ${-R * 0.15} Q ${-R * 1.0} ${-R * 1.05} ${R * 0.05} ${-R * 1.02} Q ${R * 1.0} ${-R * 1.0} ${R * 0.98} ${-R * 0.2} Q ${R * 0.55} ${-R * 0.75} ${L.hair === 'swoop' ? -R * 0.2 : R * 0.1} ${-R * 0.62} Q ${-R * 0.55} ${-R * 0.55} ${-R * 0.98} ${-R * 0.15} Z`}
            fill={hairC}
            stroke={o}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        );
      case 'curly':
        return (
          <g fill={hairC} stroke={o} strokeWidth={4}>
            {[-0.8, -0.45, -0.1, 0.25, 0.6, 0.85].map((x, i) => (
              <circle key={i} cx={R * x} cy={-R * (0.82 + (i % 2 ? 0.12 : 0) - Math.abs(x) * 0.25)} r={R * 0.3} />
            ))}
          </g>
        );
      default:
        return null;
    }
  };
  const hat = () => {
    switch (L.hat) {
      case 'cap':
        return (
          <g stroke={o} strokeWidth={4} strokeLinejoin="round">
            <path d={`M ${-R * 0.95} ${-R * 0.38} Q ${-R} ${-R * 1.12} 0 ${-R * 1.1} Q ${R} ${-R * 1.1} ${R * 0.95} ${-R * 0.38} Z`} fill={hatC} />
            <path d={`M ${R * 0.6} ${-R * 0.42} Q ${R * 1.25} ${-R * 0.5} ${R * 1.45} ${-R * 0.32} Q ${R * 1.1} ${-R * 0.2} ${R * 0.7} ${-R * 0.3} Z`} fill={shade(hatC, -0.12)} />
            <circle cx={0} cy={-R * 1.1} r={7} fill={shade(hatC, -0.15)} />
          </g>
        );
      case 'beanie':
        return (
          <g stroke={o} strokeWidth={4}>
            <path d={`M ${-R * 0.98} ${-R * 0.35} Q ${-R} ${-R * 1.25} 0 ${-R * 1.2} Q ${R} ${-R * 1.25} ${R * 0.98} ${-R * 0.35} Z`} fill={hatC} />
            <rect x={-R * 1.02} y={-R * 0.52} width={R * 2.04} height={R * 0.26} rx={10} fill={shade(hatC, -0.12)} />
            <circle cx={0} cy={-R * 1.26} r={R * 0.16} fill={shade(hatC, 0.15)} />
          </g>
        );
      case 'tophat':
        return (
          <g stroke={o} strokeWidth={4}>
            <rect x={-R * 0.55} y={-R * 1.9} width={R * 1.1} height={R * 1.05} rx={6} fill={hatC} />
            <rect x={-R * 0.55} y={-R * 1.1} width={R * 1.1} height={R * 0.16} fill={shade(hatC, 0.3)} />
            <ellipse cx={0} cy={-R * 0.86} rx={R * 0.95} ry={R * 0.13} fill={hatC} />
          </g>
        );
      case 'bow':
        return (
          <g stroke={o} strokeWidth={4} transform={`translate(${-R * 0.45} ${-R * 0.92}) rotate(-15)`}>
            <path d="M 0 0 L -34 -20 L -34 20 Z" fill={hatC} strokeLinejoin="round" />
            <path d="M 0 0 L 34 -20 L 34 20 Z" fill={hatC} strokeLinejoin="round" />
            <circle r={10} fill={shade(hatC, -0.1)} />
          </g>
        );
      case 'chef':
        return (
          <g stroke={o} strokeWidth={4} fill="#fff">
            <rect x={-R * 0.62} y={-R * 1.3} width={R * 1.24} height={R * 0.5} />
            <circle cx={-R * 0.45} cy={-R * 1.45} r={R * 0.35} />
            <circle cx={R * 0.45} cy={-R * 1.45} r={R * 0.35} />
            <circle cx={0} cy={-R * 1.62} r={R * 0.42} />
          </g>
        );
      case 'crown':
        return (
          <path
            d={`M ${-R * 0.55} ${-R * 0.85} L ${-R * 0.6} ${-R * 1.45} L ${-R * 0.25} ${-R * 1.15} L 0 ${-R * 1.55} L ${R * 0.25} ${-R * 1.15} L ${R * 0.6} ${-R * 1.45} L ${R * 0.55} ${-R * 0.85} Z`}
            fill="#f6c945"
            stroke={o}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        );
      case 'headphones':
        return (
          <g stroke={o} strokeWidth={4}>
            <path d={`M ${-R * 0.95} ${-R * 0.1} Q ${-R * 1.05} ${-R * 1.25} 0 ${-R * 1.2} Q ${R * 1.05} ${-R * 1.25} ${R * 0.95} ${-R * 0.1}`} fill="none" strokeWidth={12} stroke={o} />
            <path d={`M ${-R * 0.95} ${-R * 0.1} Q ${-R * 1.05} ${-R * 1.25} 0 ${-R * 1.2} Q ${R * 1.05} ${-R * 1.25} ${R * 0.95} ${-R * 0.1}`} fill="none" strokeWidth={6} stroke={hatC} />
            <rect x={-R * 1.12} y={-R * 0.3} width={R * 0.3} height={R * 0.5} rx={10} fill={hatC} />
            <rect x={R * 0.82} y={-R * 0.3} width={R * 0.3} height={R * 0.5} rx={10} fill={hatC} />
          </g>
        );
      default:
        return null;
    }
  };

  const neck = () => {
    const nc = L.neckColor ?? '#c0392b';
    switch (L.neck) {
      case 'tie':
        return <path d={`M 0 ${neckY + 4} l -9 10 l 5 46 l 4 8 l 4 -8 l 5 -46 Z`} fill={nc} stroke={o} strokeWidth={3} strokeLinejoin="round" />;
      case 'bowtie':
        return (
          <g transform={`translate(0 ${neckY + 10})`} stroke={o} strokeWidth={3} fill={nc}>
            <path d="M 0 0 L -20 -11 L -20 11 Z" strokeLinejoin="round" />
            <path d="M 0 0 L 20 -11 L 20 11 Z" strokeLinejoin="round" />
            <circle r={5} />
          </g>
        );
      case 'scarf':
        return (
          <g stroke={o} strokeWidth={3.5} fill={nc}>
            <path d={`M ${-bodyW + 4} ${neckY + 2} Q 0 ${neckY + 24} ${bodyW - 4} ${neckY + 2} L ${bodyW - 2} ${neckY + 16} Q 0 ${neckY + 38} ${-bodyW + 2} ${neckY + 16} Z`} />
            <path d={`M ${bodyW * 0.3} ${neckY + 20} l 18 50 l -18 4 l -10 -48 Z`} strokeLinejoin="round" />
          </g>
        );
      case 'collar':
        return (
          <g stroke={o} strokeWidth={3} fill={nc}>
            <path d={`M -2 ${neckY + 2} L -24 ${neckY + 4} L -12 ${neckY + 22} Z`} strokeLinejoin="round" />
            <path d={`M 2 ${neckY + 2} L 24 ${neckY + 4} L 12 ${neckY + 22} Z`} strokeLinejoin="round" />
          </g>
        );
      default:
        return null;
    }
  };

  const outfitDetail = () => {
    if (outfit === 'overalls')
      return (
        <g stroke={o} strokeWidth={3} fill={legColor}>
          <path d={`M ${-bodyW * 0.62} ${neckY + 48} L ${bodyW * 0.62} ${neckY + 48} L ${bodyW * 0.82} ${bottom} Q 0 ${bottom + 10} ${-bodyW * 0.82} ${bottom} Z`} strokeLinejoin="round" />
          <line x1={-bodyW * 0.5} y1={neckY + 50} x2={-bodyW * 0.62} y2={neckY + 6} strokeWidth={8} stroke={legColor} />
          <line x1={bodyW * 0.5} y1={neckY + 50} x2={bodyW * 0.62} y2={neckY + 6} strokeWidth={8} stroke={legColor} />
          <circle cx={-bodyW * 0.48} cy={neckY + 54} r={4} fill="#f6c945" />
          <circle cx={bodyW * 0.48} cy={neckY + 54} r={4} fill="#f6c945" />
        </g>
      );
    if (outfit === 'coat')
      return (
        <g stroke={o} strokeWidth={3} fill="none">
          <path d={`M 0 ${neckY + 8} L 0 ${bottom - 2}`} />
          <circle cx={8} cy={neckY + 46} r={4} fill={o} />
          <circle cx={8} cy={neckY + 76} r={4} fill={o} />
        </g>
      );
    if (outfit === 'hoodie')
      return (
        <g stroke={o} strokeWidth={3} fill={shade(L.body, -0.08)}>
          <path d={`M ${-bodyW * 0.5} ${neckY + 70} L ${bodyW * 0.5} ${neckY + 70} L ${bodyW * 0.42} ${neckY + 98} L ${-bodyW * 0.42} ${neckY + 98} Z`} />
          <path d={`M ${-bodyW + 2} ${neckY + 6} Q 0 ${neckY + 30} ${bodyW - 2} ${neckY + 6}`} fill="none" strokeWidth={4} />
        </g>
      );
    return null;
  };

  return (
    <g transform={`scale(${(p.facing ?? 1) * (L.size ?? 1)} ${L.size ?? 1})`}>
      <defs>
        <radialGradient id={`${g}-head`} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor={shade(L.skin, 0.08)} />
          <stop offset="70%" stopColor={L.skin} />
          <stop offset="100%" stopColor={shade(L.skin, -0.1)} />
        </radialGradient>
        <linearGradient id={`${g}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(L.body, 0.07)} />
          <stop offset="100%" stopColor={shade(L.body, -0.08)} />
        </linearGradient>
      </defs>
      {/* soft contact shadow */}
      <ellipse cx={0} cy={2} rx={78 * girth * (walking ? 1 - Math.abs(Math.sin(phase)) * 0.08 : 1)} ry={13} fill="rgba(20,10,30,0.22)" />
      <g transform={`rotate(${p.lean ?? 0} 0 0) scale(${1 / Math.sqrt(squash)} ${squash})`}>
        {arms.filter((a) => a.back).map(drawArm)}
        {legs.filter((l) => l.back).map(drawLeg)}
        {legs.filter((l) => !l.back).map(drawLeg)}
        <path d={torso} fill={`url(#${g}-body)`} stroke={o} strokeWidth={4} strokeLinejoin="round" />
        {outfitDetail()}
        {neck()}
        <g transform={`translate(${walking ? 3 : 0} ${headY}) rotate(${(walking ? Math.sin(phase) * 1.5 : breathe * 0.8) + (mood === 'confused' ? 7 : 0)})`}>
          {hairBack()}
          <circle r={R} fill={`url(#${g}-head)`} stroke={o} strokeWidth={4.5} />
          {/* soft shine */}
          <ellipse cx={-R * 0.38} cy={-R * 0.5} rx={R * 0.22} ry={R * 0.12} fill="#fff" opacity={0.22} transform={`rotate(-30 ${-R * 0.38} ${-R * 0.5})`} />
          {(L.blush ?? true) && (
            <>
              <ellipse cx={R * 0.2 - R * 0.5} cy={R * 0.2} rx={R * 0.13} ry={R * 0.075} fill="#ff7a8a" opacity={mood === 'happy' || mood === 'smug' ? 0.5 : 0.28} />
              <ellipse cx={R * 0.2 + R * 0.5} cy={R * 0.2} rx={R * 0.13} ry={R * 0.075} fill="#ff7a8a" opacity={mood === 'happy' || mood === 'smug' ? 0.5 : 0.28} />
            </>
          )}
          {L.freckles &&
            [-0.55, -0.45, 0.85, 0.95].map((x, i) => <circle key={i} cx={R * x} cy={R * (0.12 + (i % 2) * 0.07)} r={2.6} fill={shade(L.skin, -0.3)} />)}
          {eyes}
          {browEls}
          {L.glasses && (
            <g stroke={o} strokeWidth={4} fill="rgba(255,255,255,0.18)">
              <circle cx={R * 0.2 - R * 0.3} cy={eyeY} r={R * 0.22} />
              <circle cx={R * 0.2 + R * 0.3} cy={eyeY} r={R * 0.22} />
              <line x1={R * 0.2 - R * 0.08} y1={eyeY} x2={R * 0.2 + R * 0.08} y2={eyeY} />
            </g>
          )}
          {mouthEl}
          {L.mustache && (
            <path d={`M ${mx} ${my - 6} q -14 -8 -30 2 q 12 8 30 2 q 14 6 30 -2 q -16 -10 -30 -2 Z`} fill={hairC} stroke={o} strokeWidth={3} strokeLinejoin="round" />
          )}
          {hairFront()}
          {hat()}
        </g>
        {arms.filter((a) => !a.back).map(drawArm)}
      </g>
    </g>
  );
};

/** Height of the top of the head above the feet, for bubble placement. */
export const headTop = (look: Look) => {
  const R = look.head ?? 98;
  const s = look.size ?? 1;
  const extra = look.hat === 'tophat' ? R * 1.0 : look.hat === 'chef' ? R * 0.9 : look.hat === 'crown' ? R * 0.6 : 0;
  return (128 * (look.legLength ?? 1) + 2 + 122 + R * 0.8 + R + extra) * s;
};
