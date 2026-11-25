// fin03s2 – original 9:16 Short for fin03 (render: npm run render -- fin03s2-vertical). Ends with Finn's CTA (cta2).
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import own from '../../generated/voices/fin03s2.json';
import shared from '../../generated/voices/finshorts.json';
import {s1} from './script';
import {ShortBeaver} from '../fin03/shorts';

export const fin03s2: EpisodeDef = {
  id: 'fin03s2',
  number: 3,
  title: 'Start at 25 vs 35 (Short)',
  voices: {...(own as VoiceManifest), ...(shared as VoiceManifest)},
  scenes: [{id: 'short', steps: s1, View: ShortBeaver, tail: 0.2}],
};
