// fin01 – 10-second finance sample: "Money 101 – Compound Interest" with Finn (motion-graphics explainer).
import {beat, cue, music, say, sfx, wait} from '../../engine/timeline';

export const s1 = [
  music('silly', {vol: 0.35}),
  sfx('whoosh'),
  beat('title', 0.25),
  say('f01', 'finn', '[excited, fast] Compound interest! Your money... makes baby money!', {mood: 'happy', gap: 0.05}),
  sfx('pop', {offset: -1.02}),
  sfx('pop', {offset: -0.85}),
  sfx('pop', {offset: -0.68}),
  cue('chart'),
  sfx('slideUp'),
  say('f02', 'finn', '[giggling, amazed] And the baby money has MORE babies!', {mood: 'surprised', loud: true, gap: 0.05}),
  sfx('tada', {vol: 0.4, offset: -1.4}),
  cue('broke'),
  say('f03', 'finn', '[deadpan, flat] ...So why is my piggy bank empty?', {mood: 'sad'}),
  sfx('crickets', {vol: 0.6}),
  beat('end', 0.8),
];
