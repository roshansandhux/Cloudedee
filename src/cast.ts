import castJson from './cast.json';
import type {Look} from './rig/looks';

export type CastMember = {name: string; voice: string; voice_id: string; note?: string; look?: Look};
export const CAST = castJson as unknown as Record<string, CastMember>;

export const lookOf = (who: string): Look => {
  const l = CAST[who]?.look;
  if (!l) throw new Error(`No look for "${who}" in src/cast.json`);
  return l;
};
