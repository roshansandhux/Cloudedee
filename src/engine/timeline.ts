// TIMELINE ENGINE
// A scene is written as a list of steps. Timing comes automatically from the audio lengths:
//   say('l01', 'pip', '[nervous] Is it... safe?', {mood: 'worried'})
//   narrate('n03', '[warm] Meanwhile, across town...')
//   sfx('boing')            – fires at the current moment, does not take time
//   music('chase')          – switches background music (music(null) stops it)
//   wait(1.5)               – pause for 1.5 seconds
//   cue('doorOpens')        – a named moment you can animate against (zero length)
//   beat('walkIn', 2)       – a named stretch of time (2 s) for blocking/animation
// Missing voice clips fall back to an estimated duration and show as captions only.

import audioLib from '../generated/audio-library.json';

export const FPS = 30;

export type Mood =
  | 'neutral'
  | 'happy'
  | 'angry'
  | 'sad'
  | 'surprised'
  | 'worried'
  | 'smug'
  | 'confused'
  | 'determined'
  | 'sleepy';

export type VoiceClip = {file: string; duration: number; lead?: number; tail?: number; env: number[]};
export type VoiceManifest = Record<string, VoiceClip>;

export type Step =
  | {t: 'say'; id: string; who: string; text: string; mood?: Mood; gap?: number; overlap?: number; loud?: boolean}
  | {t: 'narrate'; id: string; text: string; gap?: number}
  | {t: 'sfx'; name: SfxName; vol?: number; offset?: number}
  | {t: 'music'; name: MusicName | null; vol?: number}
  | {t: 'wait'; sec: number}
  | {t: 'cue'; name: string}
  | {t: 'beat'; name: string; sec: number};

export type SfxName = keyof typeof audioLib.sfx;
export type MusicName = keyof typeof audioLib.music;

type SayOpts = {mood?: Mood; gap?: number; overlap?: number; loud?: boolean};

export const say = (id: string, who: string, text: string, o: SayOpts = {}): Step => ({t: 'say', id, who, text, ...o});
export const narrate = (id: string, text: string, o: {gap?: number} = {}): Step => ({t: 'narrate', id, text, ...o});
export const sfx = (name: SfxName, o: {vol?: number; offset?: number} = {}): Step => ({t: 'sfx', name, ...o});
export const music = (name: MusicName | null, o: {vol?: number} = {}): Step => ({t: 'music', name, ...o});
export const wait = (sec: number): Step => ({t: 'wait', sec});
export const cue = (name: string): Step => ({t: 'cue', name});
export const beat = (name: string, sec: number): Step => ({t: 'beat', name, sec});

/** Remove leading [delivery tags] – they are for the voice actor, not for the bubble. */
export const displayText = (text: string) => text.replace(/\[[^\]]*\]\s*/g, '').trim();

export type Line = {
  id: string;
  who: string; // 'narrator' for narration
  text: string; // display text (tags removed)
  mood?: Mood;
  loud?: boolean;
  start: number; // frames, relative to the schedule origin
  end: number;
  audioStart: number; // where the clip starts playing
  clip?: VoiceClip;
  missing: boolean;
};
export type SfxHit = {name: SfxName; start: number; vol: number};
export type MusicChange = {name: MusicName | null; start: number; vol: number};
export type Schedule = {
  duration: number;
  lines: Line[];
  sfx: SfxHit[];
  music: MusicChange[];
  cues: Record<string, number>;
  beats: Record<string, {start: number; end: number}>;
};

const DEFAULT_GAP = 0.25; // seconds of breathing room after each line

/** Estimate for lines that have no audio yet (≈ 2.7 words per second). */
export const estimateSeconds = (text: string) => {
  const words = displayText(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1.4, words / 2.7 + 0.6);
};

export function buildSchedule(steps: Step[], voices: VoiceManifest, minSeconds = 0): Schedule {
  const s: Schedule = {duration: 0, lines: [], sfx: [], music: [], cues: {}, beats: {}};
  let t = 0; // seconds
  const f = (sec: number) => Math.round(sec * FPS);
  for (const step of steps) {
    switch (step.t) {
      case 'say':
      case 'narrate': {
        const clip = voices[step.id];
        const startSec = Math.max(0, t - (step.t === 'say' ? step.overlap ?? 0 : 0));
        // Trim dead air at the start/end of the clip from the timing (not from the audio).
        const lead = clip ? Math.min(clip.lead ?? 0, 0.3) : 0;
        const tail = clip ? Math.min(clip.tail ?? 0, 0.4) : 0;
        const len = clip ? Math.max(0.3, clip.duration - lead - tail) : estimateSeconds(step.text);
        s.lines.push({
          id: step.id,
          who: step.t === 'say' ? step.who : 'narrator',
          text: displayText(step.text),
          mood: step.t === 'say' ? step.mood : undefined,
          loud: step.t === 'say' ? step.loud : undefined,
          start: f(startSec),
          end: f(startSec + len),
          audioStart: f(startSec - lead),
          clip,
          missing: !clip,
        });
        t = startSec + len + (step.gap ?? DEFAULT_GAP);
        break;
      }
      case 'sfx':
        s.sfx.push({name: step.name, start: f(Math.max(0, t + (step.offset ?? 0))), vol: step.vol ?? 0.8});
        break;
      case 'music':
        s.music.push({name: step.name, start: f(t), vol: step.vol ?? 0.4});
        break;
      case 'wait':
        t += step.sec;
        break;
      case 'cue':
        s.cues[step.name] = f(t);
        break;
      case 'beat':
        s.beats[step.name] = {start: f(t), end: f(t + step.sec)};
        t += step.sec;
        break;
    }
  }
  s.duration = Math.max(f(t), f(minSeconds), 1);
  return s;
}

export function shiftSchedule(s: Schedule, by: number): Schedule {
  return {
    duration: s.duration,
    lines: s.lines.map((l) => ({...l, start: l.start + by, end: l.end + by, audioStart: l.audioStart + by})),
    sfx: s.sfx.map((x) => ({...x, start: x.start + by})),
    music: s.music.map((x) => ({...x, start: x.start + by})),
    cues: Object.fromEntries(Object.entries(s.cues).map(([k, v]) => [k, v + by])),
    beats: Object.fromEntries(Object.entries(s.beats).map(([k, v]) => [k, {start: v.start + by, end: v.end + by}])),
  };
}

export const audioLibrary = audioLib;
