import React from 'react';
import {FONT, INK, PAPER} from '../lib/theme';

export type BubbleLayout = {left: number; top: number; w: number; h: number; tail: {x: number; y: number} | null; fs: number; lines: string[]};

/** Greedy word wrap using an average glyph width – good enough to size & place bubbles. */
export function wrapText(text: string, fs: number, maxW: number) {
  const cw = fs * 0.5;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length * cw > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  const width = Math.max(...lines.map((l) => l.length * cw));
  return {lines, width};
}

type Safe = {x0: number; y0: number; x1: number; y1: number};

/**
 * Place a bubble near a head (screen coords). Tries above, then to the side, always stays on screen.
 * avoid: rectangles of bubbles already placed this frame.
 */
export function layoutBubble(text: string, head: {x: number; y: number} | null, safe: Safe, portrait: boolean, prefer: 1 | -1 = 1, avoid: {left: number; top: number; w: number; h: number}[] = []): BubbleLayout {
  const fs = portrait ? 50 : text.length > 90 ? 38 : 42;
  const maxW = portrait ? 860 : 660;
  const padX = 30;
  const padY = 20;
  const {lines, width} = wrapText(text, fs, maxW);
  const w = Math.min(maxW, width) + padX * 2;
  const h = lines.length * fs * 1.22 + padY * 2;
  const clampX = (x: number) => Math.max(safe.x0, Math.min(safe.x1 - w, x));
  const clampY = (y: number) => Math.max(safe.y0, Math.min(safe.y1 - h, y));
  const overlaps = (l: number, t: number) => avoid.some((r) => l < r.left + r.w + 12 && l + w + 12 > r.left && t < r.top + r.h + 12 && t + h + 12 > r.top);

  if (!head) {
    // off-screen speaker: top of frame, on the side they are coming from
    let top = safe.y0 + 10;
    const left = prefer > 0 ? safe.x1 - w - 10 : safe.x0 + 10;
    while (overlaps(left, top) && top < safe.y1 - h) top += 40;
    return {left, top, w, h, tail: null, fs, lines};
  }
  const tailLen = portrait ? 60 : 50;
  const candidates: {left: number; top: number}[] = [];
  // 1) above the head
  candidates.push({left: clampX(head.x - w / 2 + prefer * w * 0.12), top: head.y - tailLen - h});
  // 2) beside the head (preferred side first)
  for (const side of [prefer, -prefer]) {
    candidates.push({left: side > 0 ? head.x + 110 : head.x - 110 - w, top: clampY(head.y - h * 0.6)});
  }
  let pick = candidates.find((c) => c.top >= safe.y0 && c.left >= safe.x0 && c.left + w <= safe.x1 && !overlaps(c.left, c.top));
  if (!pick) pick = {left: clampX(candidates[0].left), top: clampY(candidates[0].top)};
  let {top} = pick;
  while (overlaps(pick.left, top) && top < safe.y1 - h) top += 30;
  return {left: pick.left, top, w, h, tail: {x: head.x, y: head.y - 6}, fs, lines};
}

export const SpeechBubble: React.FC<{layout: BubbleLayout; appear: number; shout?: boolean; name?: string; frame: number}> = ({layout, appear, shout, name, frame}) => {
  const {left, top, w, h, tail, fs, lines} = layout;
  const s = 0.6 + 0.4 * Math.min(1, appear) + (appear < 1 ? Math.sin(appear * Math.PI) * 0.08 : 0);
  const shake = shout ? Math.sin(frame * 2.1) * 2 : 0;
  // tail base sits on the bubble edge nearest to the speaker
  let tailEl: React.ReactNode = null;
  if (tail) {
    const cx = left + w / 2;
    const cy = top + h / 2;
    const below = tail.y > top + h;
    const sideways = !below && (tail.x < left || tail.x > left + w);
    let b1: [number, number];
    let b2: [number, number];
    let cover: React.ReactNode;
    if (sideways) {
      const ex = tail.x < left ? left + 2 : left + w - 2;
      const by = Math.max(top + 26, Math.min(top + h - 26, tail.y - 10));
      b1 = [ex, by - 16];
      b2 = [ex, by + 16];
      cover = <rect x={ex - 4} y={by - 13} width={8} height={26} fill={PAPER} />;
    } else {
      const bx = Math.max(left + 34, Math.min(left + w - 34, (tail.x * 0.6 + cx * 0.4)));
      const ey = below ? top + h - 2 : top + 2;
      b1 = [bx - 17, ey];
      b2 = [bx + 17, ey];
      cover = <rect x={bx - 14} y={ey - 4} width={28} height={8} fill={PAPER} />;
    }
    // stop the tail a little short of the head
    const tx = tail.x + (cx - tail.x) * 0.12;
    const ty = tail.y + (cy - tail.y) * 0.12;
    tailEl = (
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <path d={`M ${b1[0]} ${b1[1]} Q ${(b1[0] + tx) / 2} ${(b1[1] + ty) / 2 + 4} ${tx} ${ty} Q ${(b2[0] + tx) / 2} ${(b2[1] + ty) / 2} ${b2[0]} ${b2[1]} Z`} fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {cover}
      </svg>
    );
  }
  const origin = tail ? `${((tail.x - left) / w) * 100}% ${tail.y > top ? '100%' : '0%'}` : '50% 0%';
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${shake}px, 0)`, opacity: Math.min(1, appear * 2)}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: origin, transform: `scale(${s})`}}>
        {tailEl}
        <div
          style={{
            position: 'absolute',
            left,
            top,
            width: w,
            height: h,
            boxSizing: 'border-box',
            background: PAPER,
            border: `${shout ? 5 : 4}px solid ${INK}`,
            borderRadius: shout ? 18 : Math.min(46, h / 2),
            boxShadow: '0 8px 22px rgba(30,20,40,0.22)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: FONT,
            fontWeight: shout ? 700 : 600,
            fontSize: fs,
            lineHeight: 1.22,
            color: INK,
            textAlign: 'center',
          }}
        >
          {lines.map((l, i) => (
            <div key={i} style={{whiteSpace: 'nowrap'}}>
              {l}
            </div>
          ))}
        </div>
        {name && (
          <div
            style={{
              position: 'absolute',
              left: left + 18,
              top: top - 22,
              background: INK,
              color: PAPER,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: fs * 0.55,
              padding: '2px 14px',
              borderRadius: 12,
            }}
          >
            {name}
          </div>
        )}
      </div>
    </div>
  );
};

/** Narrator lines: a calm caption strip at the bottom. */
export const NarratorCaption: React.FC<{text: string; appear: number; portrait: boolean; bottom: number}> = ({text, appear, portrait, bottom}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      bottom,
      transform: `translate(-50%, ${(1 - Math.min(1, appear)) * 20}px)`,
      opacity: Math.min(1, appear * 1.5),
      maxWidth: portrait ? 940 : 1400,
      width: 'max-content',
      background: 'rgba(24,18,34,0.78)',
      color: '#fff7e8',
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: portrait ? 46 : 38,
      lineHeight: 1.25,
      padding: portrait ? '18px 30px' : '14px 30px',
      borderRadius: 20,
      textAlign: 'center',
      boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
    }}
  >
    {text}
  </div>
);
