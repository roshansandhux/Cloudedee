// fin05s1 – original 9:16 Short for fin05 (render: npm run render -- fin05s1-vertical). Chunk captions; ends with Finn's CTA (cta3).
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import own from '../../generated/voices/fin05s1.json';
import shared from '../../generated/voices/finshorts.json';
import {s1} from './script';
import {ShortDealer} from '../fin05/shorts';

export const fin05s1: EpisodeDef = {
  id: 'fin05s1',
  number: 5,
  title: "The dealer's favorite question (Short)",
  voices: {...(shared as VoiceManifest), ...(own as VoiceManifest)},
  captions: 'chunks',
  scenes: [{id: 'short', steps: s1, View: ShortDealer, tail: 0.2}],
};
