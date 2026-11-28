// fin05 – "Why Car Payments Are Keeping You Poor" – Finnomics (chunk captions, Finn = owner's cloned voice)
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import voices from '../../generated/voices/fin05.json';
import * as S from './script';
import {ColdOpen, GremlinScene, Intro, Monthly, Rates, Stretch, UnderwaterScene} from './scenesA';
import {Future, Lease, Outro, Playbook, Recap, RuthScene, TrueCost} from './scenesB';

export const fin05: EpisodeDef = {
  id: 'fin05',
  number: 5,
  title: 'Why Car Payments Are Keeping You Poor',
  voices: voices as VoiceManifest,
  captions: 'chunks',
  scenes: [
    {id: 'cold', title: 'The $1,000-a-month truck', steps: S.sCold, View: ColdOpen, tail: 0.2},
    {id: 'intro', title: 'A second rent?!', steps: S.sIntro, View: Intro},
    {id: 'monthly', title: "The dealer's favorite question", steps: S.sMonthly, View: Monthly},
    {id: 'stretch', title: 'The longer-loan trap', steps: S.sStretch, View: Stretch},
    {id: 'rates', title: 'The interest rate menu', steps: S.sRates, View: Rates},
    {id: 'gremlin', title: 'The depreciation gremlin', steps: S.sGremlin, View: GremlinScene},
    {id: 'underwater', title: 'Underwater on your car', steps: S.sUnderwater, View: UnderwaterScene},
    {id: 'truecost', title: 'The true cost of owning a car', steps: S.sTrueCost, View: TrueCost},
    {id: 'future', title: 'What $750 a month could become', steps: S.sFuture, View: Future},
    {id: 'ruth', title: "Grandma's car payment trick", steps: S.sRuth, View: RuthScene},
    {id: 'playbook', title: 'How to buy a car the smart way', steps: S.sPlaybook, View: Playbook},
    {id: 'lease', title: 'Should you lease?', steps: S.sLease, View: Lease},
    {id: 'recap', title: '5 rules (car wash edition)', steps: S.sRecap, View: Recap},
    {id: 'outro', title: "Tyler's comeback", steps: S.sOutro, View: Outro, tail: 0.3},
  ],
};
