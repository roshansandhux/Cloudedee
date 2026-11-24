// AUTO-DIRECTOR: picks a camera for every line of dialogue, so scenes get varied coverage
// (wide / medium two-shot / close-up / slow push / comedic zoom punch) without hand-keying each one.
// Hard cuts happen on line starts, like real editing. Override any line by id.
import {Easing, interpolate} from 'remotion';
import type {SceneApi} from '../engine/SceneContext';
import type {Cam} from './camera';
import {headTop} from '../rig/Character';
import {CAST} from '../cast';
import type {Look} from '../rig/looks';

export type Shot = 'wide' | 'medium' | 'close' | 'push' | 'punch' | 'low' | Partial<Cam>;
export type Pos = {x: number; y: number; look?: Look; scale?: number};

const head = (p: Pos, who: string) => {
  const look = p.look ?? CAST[who]?.look;
  const h = look ? headTop(look) * (p.scale ?? 1) : 420;
  return {x: p.x, y: p.y - h * 0.82};
};

export function direct(
  s: SceneApi,
  o: {
    wide: Cam;
    pos: Record<string, Pos>;
    pattern?: Shot[];
    shots?: Record<string, Shot>;
    /** frames before which we always stay wide (e.g. an establishing beat) */
    holdWideUntil?: number;
  },
): Cam {
  const lines = s.schedule.lines.filter((l) => l.who !== 'narrator');
  const f = s.frame;
  // current or most recent line
  let idx = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].start <= f) idx = i;
  if (idx < 0 || f < (o.holdWideUntil ?? 0)) return o.wide;
  const line = lines[idx];
  // after a line ends by > 1.2 s, drift back out to wide
  if (f > line.end + 36 && !o.shots?.[line.id]) return o.wide;
  const pattern = o.pattern ?? ['medium', 'close', 'medium', 'wide', 'close', 'push'];
  const shot: Shot = o.shots?.[line.id] ?? pattern[idx % pattern.length];
  const speaker = o.pos[line.who];
  const prev = lines[idx - 1] && o.pos[lines[idx - 1].who] ? lines[idx - 1] : undefined;
  if (typeof shot === 'object') return {...o.wide, ...shot};
  if (!speaker) return o.wide;
  const h = head(speaker, line.who);
  const t = f - line.start;
  switch (shot) {
    case 'wide':
      return o.wide;
    case 'medium': {
      const other = prev && prev.who !== line.who ? head(o.pos[prev.who], prev.who) : h;
      const mx = (h.x + other.x) / 2;
      const span = Math.abs(h.x - other.x);
      return {x: mx, y: Math.max(h.y, other.y) + 150, zoom: Math.max(1.15, Math.min(1.7, 1300 / (span + 700)))};
    }
    case 'close':
      return {x: h.x + 30, y: h.y + 70, zoom: 2.05};
    case 'low':
      return {x: h.x, y: h.y + 180, zoom: 1.55, rot: -3};
    case 'push': {
      const k = interpolate(t, [0, Math.max(1, line.end - line.start)], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
      return {x: h.x + 20, y: h.y + 110 - 30 * k, zoom: 1.5 + 0.7 * k};
    }
    case 'punch': {
      const k = interpolate(t, [0, 7], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.8))});
      return {x: h.x + 20, y: h.y + 60, zoom: 1.4 + 1.3 * k};
    }
  }
}
