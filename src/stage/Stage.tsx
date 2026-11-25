// THE STAGE: one shot = a set + actors + camera. Handles lip-sync, moods and bubbles automatically.
// World space is 1920×1080 (ground line ≈ y 900). Shorts (9:16) see the middle of the same world.

import React, {createContext, useContext} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Character, headTop, type ArmPose} from '../rig/Character';
import {CAST, lookOf} from '../cast';
import {useCaptionStyle} from '../components/ChunkCaptions';
import type {Look} from '../rig/looks';
import type {Mood} from '../engine/timeline';
import {useScene} from '../engine/SceneContext';
import {layoutBubble, NarratorCaption, SpeechBubble, type BubbleLayout} from '../components/SpeechBubble';
import {WIDE, type Cam} from './camera';
import {ensureFonts} from '../lib/fonts';

ensureFonts();

export const GROUND = 900;

export type ActorSpec = {
  who: string;
  x: number;
  /** feet y in world space (default GROUND) */
  y?: number;
  facing?: 1 | -1;
  pose?: ArmPose | [ArmPose, ArmPose];
  /** mood when not speaking (when speaking, the line's mood wins unless lockMood) */
  mood?: Mood;
  lockMood?: boolean;
  walking?: boolean;
  run?: boolean;
  walkPhase?: number;
  squash?: number;
  lean?: number;
  look2?: {x: number; y: number};
  eyesClosed?: boolean;
  holding?: React.ReactNode;
  sitting?: boolean;
  scale?: number;
  /** draw order; default sorts by y */
  z?: number;
  /** override look (e.g. a costume change) */
  look?: Look;
  opacity?: number;
  /** extra mouth movement (e.g. chewing) */
  mouth?: number;
};

const CamCtx = createContext<Cam>(WIDE);
/** Sets use this for parallax (distant layers move less). */
export const useCam = () => useContext(CamCtx);

/** Parallax wrapper: depth 0 = moves with world, 1 = stuck to the sky. */
export const Parallax: React.FC<{depth: number; children: React.ReactNode}> = ({depth, children}) => {
  const cam = useCam();
  const dx = (cam.x - WIDE.x) * depth;
  const dy = (cam.y - WIDE.y) * depth;
  const s = (1 + (cam.zoom - 1) * (1 - depth)) / cam.zoom;
  return <g transform={`translate(${cam.x} ${cam.y}) scale(${s}) translate(${-cam.x + dx} ${-cam.y + dy})`}>{children}</g>;
};

type StageProps = {
  /** background set (SVG elements in world coords) */
  set?: React.ReactNode;
  cam?: Cam;
  /** 9:16 camera overrides (merged over a tighter version of cam: zoom ×1.5, a bit lower) */
  vcam?: Partial<Cam>;
  actors?: ActorSpec[];
  /** world-space SVG drawn behind the actors (props, furniture) */
  children?: React.ReactNode;
  /** world-space SVG in front of the actors */
  front?: React.ReactNode;
  /** screen-space overlay (HTML), e.g. flashes, title cards */
  overlay?: React.ReactNode;
  /** show speech bubbles (default true) */
  bubbles?: boolean;
  /** for speakers not on stage: which side their bubble appears */
  offscreen?: Record<string, 1 | -1>;
  background?: string;
  /** speech anchors for non-rig speakers (creature, TV, monitor): world point just above the "head" */
  speakers?: Record<string, {x: number; y: number}>;
  /** rim-light colour on characters (key light) */
  rim?: string;
};

export const Stage: React.FC<StageProps> = ({set, cam = WIDE, vcam, actors = [], children, front, overlay, bubbles = true, offscreen = {}, background = '#000', speakers = {}, rim}) => {
  const {width: W, height: H} = useVideoConfig();
  const sc = useScene();
  const chunkMode = useCaptionStyle() === 'chunks';
  const portrait = H > W;
  const c: Cam = portrait ? {...cam, zoom: Math.min(cam.zoom * 1.5, Math.max(cam.zoom, 2.5)), y: cam.y + 70 / Math.max(1, cam.zoom), ...vcam} : cam;
  const base = portrait ? W / 1080 : H / 1080;
  const z = c.zoom * base;
  const toScreen = (x: number, y: number) => {
    const r = ((c.rot ?? 0) * Math.PI) / 180;
    const dx = (x - c.x) * z;
    const dy = (y - c.y) * z;
    return {x: W / 2 + dx * Math.cos(r) - dy * Math.sin(r), y: H / 2 + dx * Math.sin(r) + dy * Math.cos(r)};
  };

  const sorted = [...actors].sort((a, b) => (a.z ?? a.y ?? GROUND) - (b.z ?? b.y ?? GROUND));

  // Bubbles (screen space)
  const bar = portrait ? 22 : 34;
  const safe = {x0: 40, y0: bar + 24, x1: W - 40, y1: H - bar - (portrait ? 330 : 140)};
  const placed: BubbleLayout[] = [];
  const bubbleEls: React.ReactNode[] = [];
  let narratorEl: React.ReactNode = null;
  const active = sc.schedule.lines.filter((l) => sc.frame >= l.start - 2 && sc.frame < l.end + 5);
  for (const l of chunkMode ? [] : active) {
    const appear = Math.min(1, (sc.frame - (l.start - 2)) / 6) * Math.min(1, (l.end + 5 - sc.frame) / 5);
    if (l.who === 'narrator') {
      narratorEl = <NarratorCaption key={l.id} text={l.text} appear={appear} portrait={portrait} bottom={bar + (portrait ? 250 : 26)} />;
      continue;
    }
    if (!bubbles) continue;
    const a = actors.find((x) => x.who === l.who);
    let head: {x: number; y: number} | null = null;
    if (a && (a.opacity ?? 1) > 0.2) {
      const look = a.look ?? lookOf(a.who);
      const top = headTop(look) * (a.scale ?? 1) * (a.squash ?? 1);
      const p = toScreen(a.x, (a.y ?? GROUND) - top);
      if (p.x > -50 && p.x < W + 50 && p.y > -200 && p.y < H) head = {x: Math.max(60, Math.min(W - 60, p.x)), y: Math.max(safe.y0 + 40, p.y)};
    } else if (speakers[l.who]) {
      const p = toScreen(speakers[l.who].x, speakers[l.who].y);
      if (p.x > -100 && p.x < W + 100 && p.y > -300 && p.y < H + 100) head = {x: Math.max(60, Math.min(W - 60, p.x)), y: Math.max(safe.y0 + 40, Math.min(H - 300, p.y))};
    }
    const prefer: 1 | -1 = a ? ((a.facing ?? 1) as 1 | -1) : offscreen[l.who] ?? 1;
    const layout = layoutBubble(l.text, head, safe, portrait, prefer, placed);
    placed.push(layout);
    bubbleEls.push(<SpeechBubble key={l.id} layout={layout} appear={appear} shout={l.loud} frame={sc.frame} name={head ? undefined : CAST[l.who]?.name ?? l.who} />);
  }

  return (
    <AbsoluteFill style={{background, overflow: 'hidden'}}>
      <CamCtx.Provider value={c}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${W / 2} ${H / 2}) rotate(${c.rot ?? 0}) scale(${z}) translate(${-c.x} ${-c.y})`}>
            {set}
            {children}
            {sorted.map((a) => {
              const look = a.look ?? lookOf(a.who);
              const talking = sc.mouth(a.who) + (a.mouth ?? 0);
              const mood = a.lockMood ? a.mood : sc.moodOf(a.who) ?? a.mood;
              return (
                <g key={a.who} transform={`translate(${a.x} ${a.y ?? GROUND}) scale(${a.scale ?? 1})`} opacity={a.opacity ?? 1}>
                  <Character
                    uid={a.who}
                    look={look}
                    frame={sc.frame}
                    mood={mood}
                    talk={talking}
                    facing={a.facing}
                    pose={a.pose}
                    walking={a.walking}
                    run={a.run}
                    walkPhase={a.walkPhase}
                    squash={a.squash}
                    lean={a.lean}
                    look2={a.look2}
                    eyesClosed={a.eyesClosed}
                    holding={a.holding}
                    sitting={a.sitting}
                    rim={rim}
                  />
                </g>
              );
            })}
            {front}
          </g>
        </svg>
      </CamCtx.Provider>
      {overlay}
      {bubbleEls}
      {narratorEl}
    </AbsoluteFill>
  );
};
