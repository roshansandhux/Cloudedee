// ep00 – PIPELINE TEST (not a real episode). Proves voices, captions, sfx, music, rig and camera work.
import {beat, cue, music, narrate, say, sfx, wait} from '../../engine/timeline';

export const s1 = [
  music('curious'),
  wait(0.6),
  narrate('n01', '[warm, amused] Every story starts somewhere. This one starts with a test.'),
  beat('walkIn', 2.4),
  say('a01', 'testA', '[cheerful, eager] Hi! Am I on? Is this thing working?', {mood: 'happy'}),
  say('b01', 'testB', '[deadpan] You are a test puppet. Nothing is working yet.', {mood: 'smug'}),
  cue('hop'),
  sfx('boing'),
  wait(0.9),
  say('a02', 'testA', '[shocked] NOTHING?!', {mood: 'surprised', loud: true}),
  sfx('sting', {vol: 0.5}),
  wait(0.8),
];

export const s2 = [
  music('tender'),
  wait(0.8),
  say('b02', 'testB', '[softer] Okay... the bubbles work. That is something.', {mood: 'happy'}),
  say('a03', 'testA', '[whispering] Do you think the real cast will like us?', {mood: 'worried'}),
  cue('ding'),
  sfx('ding', {vol: 0.5}),
  wait(1.2),
  beat('iris', 1.2),
];
