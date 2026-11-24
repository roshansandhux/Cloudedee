import React, {createContext, useContext} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type {Line, Mood, Schedule} from './timeline';

const Ctx = createContext<Schedule | null>(null);

export const SceneProvider: React.FC<{schedule: Schedule; children: React.ReactNode}> = ({schedule, children}) => (
  <Ctx.Provider value={schedule}>{children}</Ctx.Provider>
);

const ease = Easing.inOut(Easing.cubic);

/**
 * Everything a scene needs to animate against its own timeline.
 * All frames are local to the scene (0 = scene start).
 */
export function useScene() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useScene() used outside a scene');
  const frame = useCurrentFrame();

  const cue = (name: string) => {
    const v = s.cues[name];
    if (v === undefined) throw new Error(`Unknown cue "${name}"`);
    return v;
  };
  const beat = (name: string) => {
    const v = s.beats[name];
    if (v === undefined) throw new Error(`Unknown beat "${name}"`);
    return v;
  };
  const line = (id: string) => {
    const l = s.lines.find((x) => x.id === id);
    if (!l) throw new Error(`Unknown line "${id}"`);
    return l;
  };
  /** 0→1 progress through a beat (eased by default). */
  const progress = (name: string, easing: ((t: number) => number) | null = ease) => {
    const b = beat(name);
    const p = interpolate(frame, [b.start, Math.max(b.start + 1, b.end)], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return easing ? easing(p) : p;
  };
  /** frames since a cue (negative before it). */
  const since = (name: string) => frame - cue(name);
  /** true once a cue / line start / beat start has been reached */
  const after = (name: string) => {
    if (name in s.cues) return frame >= s.cues[name];
    if (name in s.beats) return frame >= s.beats[name].start;
    const l = s.lines.find((x) => x.id === name);
    if (l) return frame >= l.start;
    throw new Error(`Unknown marker "${name}"`);
  };
  /** Start frame of any marker: cue, beat or line id. */
  const at = (name: string) => {
    if (name in s.cues) return s.cues[name];
    if (name in s.beats) return s.beats[name].start;
    return line(name).start;
  };
  const activeLine = (who?: string, f = frame): Line | undefined =>
    s.lines.find((l) => (!who || l.who === who) && f >= l.start && f < l.end);
  /** Mouth openness 0..1 for a character right now (from the voice loudness). */
  const mouth = (who: string, f = frame) => {
    const l = activeLine(who, f);
    if (!l) return 0;
    if (!l.clip) {
      // caption-only line (no audio yet): gentle fake chatter so the character still talks
      const k = f - l.start;
      return 0.25 + 0.25 * Math.abs(Math.sin(k * 0.55)) * Math.abs(Math.sin(k * 0.21 + 1));
    }
    const i = f - l.audioStart;
    const e = l.clip.env;
    return i >= 0 && i < e.length ? e[i] / 100 : 0;
  };
  /** Mood from the line the character is speaking (if any). */
  const moodOf = (who: string): Mood | undefined => activeLine(who)?.mood;
  /** Last line a character spoke up to now (useful for reactions). */
  const lastLine = (who?: string) => [...s.lines].reverse().find((l) => (!who || l.who === who) && l.start <= frame);

  return {frame, schedule: s, duration: s.duration, cue, beat, line, progress, since, after, at, activeLine, mouth, moodOf, lastLine};
}

export type SceneApi = ReturnType<typeof useScene>;
