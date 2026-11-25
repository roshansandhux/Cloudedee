// fin02 – "How Credit Cards Secretly Make Money Off You" (Money 101 with Finn, ~10 min)
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import voices from '../../generated/voices/fin02.json';
import {sBrain, sCold, sFees, sIntro, sLoan, sMinimum, sOutro, sRewards, sRules, sRuth, sScore, sSnow, sTacos} from './script';
import {ColdOpen, Intro, Loan, Minimum, Ruth, Snow, Tacos} from './scenesA';
import {Brain, Fees, Outro, Rewards, Rules, Score} from './scenesB';

export const fin02: EpisodeDef = {
  id: 'fin02',
  number: 2,
  title: 'How Credit Cards Secretly Make Money Off You',
  voices: voices as VoiceManifest,
  scenes: [
    {id: 'cold', title: 'The $14 latte', steps: sCold, View: ColdOpen, tail: 0.2},
    {id: 'intro', title: 'Meet Mr. Swipe', steps: sIntro, View: Intro},
    {id: 'loan', title: "It's a loan", steps: sLoan, View: Loan},
    {id: 'tacos', title: 'Way #1: swipe fees', steps: sTacos, View: Tacos},
    {id: 'ruth', title: 'Way #2: the deadbeats', steps: sRuth, View: Ruth},
    {id: 'snow', title: 'Way #3: interest', steps: sSnow, View: Snow},
    {id: 'minimum', title: 'The minimum payment trap', steps: sMinimum, View: Minimum},
    {id: 'rewards', title: 'Who pays for rewards?', steps: sRewards, View: Rewards},
    {id: 'fees', title: 'Fees, fees, fees', steps: sFees, View: Fees},
    {id: 'brain', title: 'Your brain on cards', steps: sBrain, View: Brain},
    {id: 'score', title: 'Credit score power-up', steps: sScore, View: Score},
    {id: 'rules', title: '5 rules to win', steps: sRules, View: Rules},
    {id: 'outro', title: 'Back at the coffee shop', steps: sOutro, View: Outro, tail: 0.3},
  ],
};
