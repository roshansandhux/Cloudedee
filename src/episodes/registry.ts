// Every episode must be listed here (composition props are JSON, so we pass ids, not components).
import type {EpisodeDef} from '../engine/episode';
import {ep00} from './ep00';
import {ep01} from './ep01';
import {fin01} from './fin01';
import {fin02} from './fin02';
import {fin03} from './fin03';
import {fin03s1} from './fin03s1';
import {fin03s2} from './fin03s2';
import {fin04} from './fin04';
import {fin04s1} from './fin04s1';
import {fin04s2} from './fin04s2';

export const EPISODES: EpisodeDef[] = [ep00, ep01, fin01, fin02, fin03, fin03s1, fin03s2, fin04, fin04s1, fin04s2];

export const getEpisode = (id: string) => {
  const ep = EPISODES.find((e) => e.id === id);
  if (!ep) throw new Error(`Episode ${id} is not in src/episodes/registry.ts`);
  return ep;
};
