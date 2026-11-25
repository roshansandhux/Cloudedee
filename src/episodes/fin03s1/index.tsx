// fin03s1 – original 9:16 Short for fin03 (render: npm run render -- fin03s1-vertical). Ends with Finn's CTA (cta2).
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import own from '../../generated/voices/fin03s1.json';
import shared from '../../generated/voices/finshorts.json';
import {s1} from './script';
import {ShortTfsa} from '../fin03/shorts';

export const fin03s1: EpisodeDef = {
  id: 'fin03s1',
  number: 3,
  title: 'The TFSA cheat code (Short)',
  voices: {...(own as VoiceManifest), ...(shared as VoiceManifest)},
  scenes: [{id: 'short', steps: s1, View: ShortTfsa, tail: 0.2}],
};
