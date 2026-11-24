// Zombie looks + a horde helper. Every zombie is a normal rig with zombie flags and decayed colours.
import {random} from 'remotion';
import type {Look, Hair} from './looks';
import type {ActorSpec} from '../stage/Stage';

const SKINS = ['#a9c08f', '#9fb59a', '#b7c49a', '#a3b88c', '#98ad9f', '#b4bf8a'];
const CLOTHES = ['#7a6a8c', '#8a5a4a', '#5a6f8a', '#8c7a4a', '#6a8a6a', '#9a5a6a', '#4f5d6b', '#a07850'];
const HAIRS: Hair[] = ['none', 'tuft', 'spiky', 'bob', 'curly', 'swoop'];

export function zombieLook(seed: string | number, over: Partial<Look> = {}): Look {
  const r = (k: string) => random(`z${seed}${k}`);
  const pick = <T,>(arr: T[], k: string) => arr[Math.floor(r(k) * arr.length)];
  return {
    skin: pick(SKINS, 's'),
    body: pick(CLOTHES, 'b'),
    legs: pick(CLOTHES, 'l'),
    shoes: '#3a3340',
    hair: pick(HAIRS, 'h'),
    hairColor: pick(['#4a3a2a', '#6b6b6b', '#2a2a2a', '#8a6a3a'], 'hc'),
    outfit: pick(['shirt', 'coat', 'hoodie', 'dress', 'shirt'] as const, 'o'),
    zombie: true,
    torn: true,
    blush: false,
    girth: 0.8 + r('g') * 0.6,
    size: 0.88 + r('sz') * 0.18,
    head: 86 + r('hd') * 14,
    ...over,
  };
}

/** A shambling horde. Each zombie walks slowly from x0 toward x1 starting at its own offset. */
export function horde(
  frame: number,
  o: {n: number; seed: string; x0: number; x1: number; y0: number; y1: number; speed?: number; start?: number; spread?: number; facing?: 1 | -1; scale?: number},
): ActorSpec[] {
  const out: ActorSpec[] = [];
  for (let i = 0; i < o.n; i++) {
    const r = (k: string) => random(`${o.seed}${i}${k}`);
    const y = o.y0 + (o.y1 - o.y0) * r('y');
    const dir = o.facing ?? (o.x1 >= o.x0 ? 1 : -1);
    const speed = (o.speed ?? 1.1) * (0.7 + r('v') * 0.6);
    const t = Math.max(0, frame - (o.start ?? 0));
    const base = o.x0 + (r('x') - 0.5) * (o.spread ?? 900);
    const x = base + dir * speed * t;
    const depth = 0.75 + 0.35 * ((y - o.y0) / Math.max(1, o.y1 - o.y0));
    out.push({
      who: `${o.seed}${i}`,
      look: zombieLook(`${o.seed}${i}`),
      x,
      y,
      facing: dir,
      walking: true,
      walkPhase: (Math.abs(x - base) / 14) + r('p') * 6,
      pose: 'reach',
      lean: dir * 6,
      scale: (o.scale ?? 1) * depth,
      mouth: 0,
    });
  }
  return out;
}
