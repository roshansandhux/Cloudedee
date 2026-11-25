// fin03s2 – Short (9:16, ~55 s): "Start at 25 vs 35" with Bernie the Beaver. Ends with the shared CTA line cta2.
import {cue, music, say, sfx, wait, beat} from '../../engine/timeline';

export const s1 = [
  music('chase', {vol: 0.28}),
  wait(0.3),
  say('f211', 'finn', '[hyped] Two beavers. Same job. Same seven thousand dollars a year into a TFSA.', {mood: 'happy'}),
  say('b201', 'bernie', '[cheerful, proud] I started at twenty-five, bud!'),
  say('f212', 'finn', '[explaining] His cousin waited until thirty-five. Both invest until sixty-five, earning seven percent a year.', {mood: 'neutral'}),
  cue('race'),
  sfx('slideUp'),
  say('f213', 'finn', '[amazed] Bernie puts in two hundred eighty thousand, and ends up with about one point four million dollars.', {mood: 'surprised', loud: true}),
  cue('late'),
  sfx('slideDown'),
  say('f214', 'finn', '[serious] His cousin? About six hundred sixty thousand. Less than half. Just from waiting ten years.', {mood: 'worried'}),
  say('b202', 'bernie', '[wise, chill] Ya can’t build a dam in the last week of summer, eh.'),
  say('f215', 'finn', '[quick] Seven percent isn’t guaranteed. But time is the real cheat code.', {mood: 'determined'}),
  cue('cta'),
  sfx('pop'),
  say('cta2', 'finn', '[excited, friendly] Want the full video? Watch it on YouTube! The link is in the description and in my bio!', {mood: 'happy'}),
  beat('end', 1.0),
];
