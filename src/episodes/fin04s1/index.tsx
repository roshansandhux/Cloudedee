// fin04s1 – original 9:16 Short for fin04 (render: npm run render -- fin04s1-vertical). Chunk captions; ends with Finn's CTA (cta2).
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import own from '../../generated/voices/fin04s1.json';
import shared from '../../generated/voices/finshorts.json';
import {s1} from './script';
import {ShortMelt} from '../fin04/shorts';

export const fin04s1: EpisodeDef = {
  id: 'fin04s1',
  number: 4,
  title: 'Your $100 is melting (Short)',
  voices: {...(own as VoiceManifest), ...(shared as VoiceManifest)},
  captions: 'chunks',
  scenes: [{id: 'short', steps: s1, View: ShortMelt, tail: 0.2}],
};
