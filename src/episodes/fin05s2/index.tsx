// fin05s2 – original 9:16 Short for fin05 (render: npm run render -- fin05s2-vertical). Chunk captions; ends with Finn's CTA (cta3).
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import own from '../../generated/voices/fin05s2.json';
import shared from '../../generated/voices/finshorts.json';
import {s1} from './script';
import {ShortRuth} from '../fin05/shorts';

export const fin05s2: EpisodeDef = {
  id: 'fin05s2',
  number: 5,
  title: "Grandma's car payment trick (Short)",
  voices: {...(shared as VoiceManifest), ...(own as VoiceManifest)},
  captions: 'chunks',
  scenes: [{id: 'short', steps: s1, View: ShortRuth, tail: 0.2}],
};
