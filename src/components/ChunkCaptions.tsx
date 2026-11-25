// "Chunk" captions (owner's style from fin04 on): instead of speech bubbles over the characters, the spoken line appears
// as small 3–4-word chunks near the bottom of the screen, one chunk after another, with the current word highlighted.
// Timing: words are spread over the voiced part of the clip by length (+ small pauses at punctuation).
import React, {createContext, useContext} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, type Line, type Schedule} from '../engine/timeline';
import {FONT, INK} from '../lib/theme';

export type CaptionStyle = 'bubbles' | 'chunks';
export const CaptionStyleCtx = createContext<CaptionStyle>('bubbles');
export const useCaptionStyle = () => useContext(CaptionStyleCtx);

/** Speaker text colours (everyone else: white). */
const COLORS: Record<string, string> = {
  finn: '#ffffff',
  ruth: '#e6d3ff',
  swipe: '#ffd84a',
  inflato: '#ff9b9b',
  doug: '#9fe0ff',
  narrator: '#fff3c4',
};

type Chunk = {words: string[]; from: number; to: number; wordAt: number[]};

const cache = new Map<string, Chunk[]>();

/** Split a line into ≤4-word chunks, ending a chunk early at punctuation when it has 2+ words. */
export function chunkLine(l: Line): Chunk[] {
  const key = `${l.id}:${l.audioStart}:${l.end}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const words = l.text.split(/\s+/).filter(Boolean);
  const groups: string[][] = [];
  let cur: string[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const punct = /[.,!?;:…—–]$/.test(w);
    if (cur.length >= 4 || (punct && cur.length >= 2)) {
      groups.push(cur);
      cur = [];
    }
  });
  if (cur.length) {
    // avoid a lonely last word: glue it to the previous chunk if that one has room
    if (cur.length === 1 && groups.length && groups[groups.length - 1].length < 5) groups[groups.length - 1].push(...cur);
    else groups.push(cur);
  }
  // timing: voiced span of the clip
  const lead = l.clip ? Math.round((l.clip.lead ?? 0) * FPS) : 0;
  const tail = l.clip ? Math.round((l.clip.tail ?? 0) * FPS) : 0;
  const s0 = l.clip ? l.audioStart + lead : l.start;
  const s1 = l.clip ? l.audioStart + Math.round(l.clip.duration * FPS) - tail : l.end;
  const weight = (w: string) => w.replace(/[^\p{L}\p{N}$%]/gu, '').length + 1.5 + (/[.!?]$/.test(w) ? 5 : /[,;:—–]$/.test(w) ? 3 : 0);
  const total = words.reduce((a, w) => a + weight(w), 0) || 1;
  const span = Math.max(1, s1 - s0);
  let acc = 0;
  const out: Chunk[] = groups.map((g) => {
    const from = s0 + (acc / total) * span;
    const wordAt: number[] = [];
    for (const w of g) {
      wordAt.push(s0 + (acc / total) * span);
      acc += weight(w);
    }
    return {words: g, from, to: s0 + (acc / total) * span, wordAt};
  });
  cache.set(key, out);
  return out;
}

/** Renders the active chunk(s) of the schedule. Put it above the scenes (EpisodePlayer does this in 'chunks' mode). */
export const ChunkCaptions: React.FC<{schedule: Schedule}> = ({schedule}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const portrait = H > W;
  const active = schedule.lines.filter((l) => f >= l.start - 2 && f < l.end + 3);
  if (!active.length) return null;
  // newest line wins if two overlap
  const l = active[active.length - 1];
  const chunks = chunkLine(l);
  let idx = chunks.findIndex((c) => f < c.to);
  if (idx < 0) idx = chunks.length - 1;
  const c = chunks[idx];
  if (f < c.from - 2 && idx === 0 && f < l.start) return null;
  const t = f - Math.max(l.start, c.from);
  const s = interpolate(t, [0, 3, 6], [0.82, 1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(f, [l.end - 2, l.end + 3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const size = portrait ? 76 : 58;
  const color = COLORS[l.who] ?? '#ffffff';
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: portrait ? H * 0.64 : undefined,
        bottom: portrait ? undefined : 70,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: o,
      }}
    >
      <div
        style={{
          transform: `scale(${s})`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          textAlign: 'center',
          maxWidth: portrait ? W - 120 : W * 0.7,
          WebkitTextStroke: `${Math.round(size / 6)}px ${INK}`,
          paintOrder: 'stroke fill',
          textShadow: `0 ${size / 12}px 0 ${INK}, 0 ${size / 8}px ${size / 5}px rgba(0,0,0,0.45)`,
          color,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {c.words.map((w, i) => {
          const on = f >= c.wordAt[i] && (i === c.words.length - 1 || f < c.wordAt[i + 1]);
          return (
            <span key={i} style={{color: on ? '#ffe600' : color, marginRight: i < c.words.length - 1 ? '0.28em' : 0, display: 'inline-block', transform: on ? 'scale(1.08)' : undefined}}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
