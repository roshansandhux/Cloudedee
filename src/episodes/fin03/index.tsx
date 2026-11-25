// fin03 – "How to Get Rich in Canada (Even If You Start Broke)" (Finnomics, ~10 min)
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import voices from '../../generated/voices/fin03.json';
import {sAuto, sBeaver, sCold, sDebt, sEmergency, sFees, sFhsa, sGarage, sIntro, sOutro, sPlan, sRrsp, sTfsa, sTraps} from './script';
import {ColdOpen, Emergency, GarageScene, Intro, Rrsp, Tfsa, Traps} from './scenesA';
import {Auto, BeaverScene, Debt, Fees, Fhsa, Outro, Plan} from './scenesB';

export const fin03: EpisodeDef = {
  id: 'fin03',
  number: 3,
  title: 'How to Get Rich in Canada (Even If You Start Broke)',
  voices: voices as VoiceManifest,
  scenes: [
    {id: 'cold', title: 'The Tax Moose', steps: sCold, View: ColdOpen, tail: 0.2},
    {id: 'intro', title: "Canada's 3 cheat codes", steps: sIntro, View: Intro},
    {id: 'tfsa', title: 'Cheat code #1: TFSA', steps: sTfsa, View: Tfsa},
    {id: 'garage', title: 'The #1 TFSA mistake', steps: sGarage, View: GarageScene},
    {id: 'traps', title: '2 TFSA traps', steps: sTraps, View: Traps},
    {id: 'emergency', title: 'Emergency fund first', steps: sEmergency, View: Emergency},
    {id: 'rrsp', title: 'Cheat code #2: RRSP', steps: sRrsp, View: Rrsp},
    {id: 'fhsa', title: 'Cheat code #3: FHSA', steps: sFhsa, View: Fhsa},
    {id: 'beaver', title: 'How to hit $1,000,000', steps: sBeaver, View: BeaverScene},
    {id: 'fees', title: 'The sneaky leak: fees', steps: sFees, View: Fees},
    {id: 'debt', title: 'Kill high-interest debt', steps: sDebt, View: Debt},
    {id: 'auto', title: 'Automate it', steps: sAuto, View: Auto},
    {id: 'plan', title: 'The game plan', steps: sPlan, View: Plan},
    {id: 'outro', title: 'Frozen lake goodbye', steps: sOutro, View: Outro, tail: 0.3},
  ],
};
