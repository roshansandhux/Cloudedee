// Every episode must be listed here (composition props are JSON, so we pass ids, not components).
import type {EpisodeDef} from '../engine/episode';
import {ep00} from './ep00';
import {ep01} from './ep01';

export const EPISODES: EpisodeDef[] = [ep00, ep01];

export const getEpisode = (id: string) => {
  const ep = EPISODES.find((e) => e.id === id);
  if (!ep) throw new Error(`Episode ${id} is not in src/episodes/registry.ts`);
  return ep;
};
