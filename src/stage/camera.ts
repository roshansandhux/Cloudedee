import {Easing, interpolate, random} from 'remotion';

export type Cam = {x: number; y: number; zoom: number; rot?: number};

/** Default camera: whole 1920×1080 world. */
export const WIDE: Cam = {x: 960, y: 540, zoom: 1};

type Key = {f: number; cam: Partial<Cam>; ease?: (t: number) => number};
const defaultEase = Easing.inOut(Easing.cubic);

/**
 * Keyframed camera. keys = [{f: 0, cam: WIDE}, {f: 90, cam: {x: 700, zoom: 1.6}}]
 * Missing fields carry over from the previous key.
 */
export function camKeys(frame: number, keys: Key[]): Cam {
  const full: {f: number; cam: Cam; ease?: (t: number) => number}[] = [];
  let prev: Cam = {...WIDE, rot: 0};
  for (const k of [...keys].sort((a, b) => a.f - b.f)) {
    prev = {...prev, ...k.cam};
    full.push({f: k.f, cam: prev, ease: k.ease});
  }
  if (frame <= full[0].f) return full[0].cam;
  for (let i = 1; i < full.length; i++) {
    const a = full[i - 1];
    const b = full[i];
    if (frame <= b.f) {
      const t = (b.ease ?? defaultEase)((frame - a.f) / Math.max(1, b.f - a.f));
      const lerp = (x: number, y: number) => x + (y - x) * t;
      // zoom interpolates in log space so push-ins feel even
      return {x: lerp(a.cam.x, b.cam.x), y: lerp(a.cam.y, b.cam.y), zoom: Math.exp(lerp(Math.log(a.cam.zoom), Math.log(b.cam.zoom))), rot: lerp(a.cam.rot ?? 0, b.cam.rot ?? 0)};
    }
  }
  return full[full.length - 1].cam;
}

/** Camera shake (adds to a cam) starting at `start` for `dur` frames. */
export function shake(cam: Cam, frame: number, start: number, dur = 12, amp = 14): Cam {
  const t = frame - start;
  if (t < 0 || t > dur) return cam;
  const k = (1 - t / dur) * amp;
  return {...cam, x: cam.x + (random(`sx${t}`) - 0.5) * 2 * k, y: cam.y + (random(`sy${t}`) - 0.5) * 2 * k, rot: (cam.rot ?? 0) + (random(`sr${t}`) - 0.5) * k * 0.05};
}

/** Slow drift for "living" static shots. */
export const drift = (cam: Cam, frame: number, amt = 1): Cam => ({...cam, x: cam.x + Math.sin(frame / 90) * 6 * amt, y: cam.y + Math.cos(frame / 110) * 3 * amt, zoom: cam.zoom * (1 + 0.0002 * frame * amt)});

/** Walk from x0 to x1 between frames f0..f1 – gives x, facing and a foot-locked walk phase. */
export function walk(frame: number, f0: number, f1: number, x0: number, x1: number, ease: (t: number) => number = Easing.inOut(Easing.sin)) {
  const t = interpolate(frame, [f0, Math.max(f0 + 1, f1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = x0 + (x1 - x0) * ease(t);
  const walking = frame > f0 && frame < f1;
  return {x, walking, walkPhase: Math.abs(x - x0) / 19, facing: (x1 >= x0 ? 1 : -1) as 1 | -1};
}

/** Simple jump arc: returns y offset (negative = up) and squash. */
export function hop(frame: number, start: number, dur = 16, height = 120) {
  const t = (frame - start) / dur;
  if (t < -0.25 || t > 1.25) return {dy: 0, squash: 1};
  if (t < 0) return {dy: 0, squash: 1 - 0.12 * Math.sin((t + 0.25) * 4 * Math.PI)}; // anticipation
  if (t > 1) return {dy: 0, squash: 1 - 0.18 * Math.sin((t - 1) * 4 * Math.PI)}; // landing
  return {dy: -Math.sin(t * Math.PI) * height, squash: 1 + 0.12 * Math.cos(t * Math.PI)};
}
