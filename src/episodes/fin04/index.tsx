// fin04 – "Why Everything Costs More Now (Inflation Explained)" – Finnomics, chunk captions (no speech bubbles)
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import voices from '../../generated/voices/fin04.json';
import {s1985, sCoaster, sCold, sFight, sHyper, sIntro, sMelt, sOutro, sPlan, sRaise, sShrink, sThermo, sWhat, sWhy} from './script';
import {Coaster, ColdOpen, Intro, Melt, Rink85, What, Why} from './scenesA';
import {Fight, Hyper, Outro, Plan, Raise, Shrink, Thermo} from './scenesB';

export const fin04: EpisodeDef = {
  id: 'fin04',
  number: 4,
  title: 'Why Everything Costs More Now (Inflation Explained)',
  voices: voices as VoiceManifest,
  captions: 'chunks',
  scenes: [
    {id: 'cold', title: 'The $2.29 candy bar', steps: sCold, View: ColdOpen, tail: 0.2},
    {id: 'intro', title: 'Your money is shrinking', steps: sIntro, View: Intro},
    {id: 'what', title: 'What is inflation?', steps: sWhat, View: What},
    {id: 'melt', title: 'Why cash melts (Rule of 72)', steps: sMelt, View: Melt},
    {id: '1985', title: "Grandma's 1985 prices", steps: s1985, View: Rink85},
    {id: 'why', title: 'Why does inflation happen?', steps: sWhy, View: Why},
    {id: 'coaster', title: '2022: the wild ride', steps: sCoaster, View: Coaster},
    {id: 'shrink', title: 'Shrinkflation', steps: sShrink, View: Shrink},
    {id: 'hyper', title: 'Hyperinflation', steps: sHyper, View: Hyper},
    {id: 'thermo', title: 'Who fights inflation?', steps: sThermo, View: Thermo},
    {id: 'raise', title: 'The raise that makes you poorer', steps: sRaise, View: Raise},
    {id: 'fight', title: 'How to fight back', steps: sFight, View: Fight},
    {id: 'plan', title: 'The anti-inflation plan', steps: sPlan, View: Plan},
    {id: 'outro', title: 'Pop!', steps: sOutro, View: Outro, tail: 0.3},
  ],
};
