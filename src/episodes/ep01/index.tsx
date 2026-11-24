import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import voices from '../../generated/voices/ep01.json';
import {s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13} from './script';
import {S01, S02, S03, S04, S05, S06} from './scenesA';
import {S07, S08, S09, S10, S11, S12, S13} from './scenesB';

export const ep01: EpisodeDef = {
  id: 'ep01',
  number: 1,
  title: 'Night of the Living Dough',
  voices: voices as VoiceManifest,
  scenes: [
    {id: 'cold-open', title: 'Cold open: 4 AM', steps: s01, View: S01, tail: 0.3},
    {id: 'wake-up', title: 'The news', steps: s02, View: S02},
    {id: 'gear-up', title: 'Gearing up', steps: s03, View: S03},
    {id: 'city', title: 'The destroyed city', steps: s04, View: S04},
    {id: 'supermarket', title: 'Mega Saver', steps: s05, View: S05},
    {id: 'backroom', title: 'Benny turns', steps: s06, View: S06},
    {id: 'rooftop', title: 'The Mother calls', steps: s07, View: S07},
    {id: 'night', title: 'Night of the dead', steps: s08, View: S08},
    {id: 'pizzeria', title: "Mama Mozza's", steps: s09, View: S09, tail: 0.2},
    {id: 'lab', title: 'The secret lab', steps: s10, View: S10},
    {id: 'boss', title: 'Boss battle', steps: s11, View: S11},
    {id: 'oven', title: 'Turbo Volcano Mode', steps: s12, View: S12},
    {id: 'sunrise', title: 'Sunrise', steps: s13, View: S13, tail: 0.2},
  ],
};
