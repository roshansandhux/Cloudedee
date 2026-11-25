import type React from 'react';
import {buildSchedule, FPS, shiftSchedule, type Schedule, type Step, type VoiceManifest} from './timeline';

export type SceneDef = {
  id: string;
  title?: string; // used for YouTube chapters
  steps: Step[];
  View: React.FC;
  /** extra seconds of picture after the last step (default 0.6) */
  tail?: number;
  /** minimum length in seconds */
  min?: number;
};

export type EpisodeDef = {
  id: string; // e.g. 'ep01'
  number: number;
  title: string;
  voices: VoiceManifest;
  scenes: SceneDef[];
  /** 'chunks' = small 3–4-word captions at the bottom instead of speech bubbles (owner's style from fin04 on) */
  captions?: 'bubbles' | 'chunks';
};

export type BuiltScene = SceneDef & {from: number; local: Schedule; global: Schedule};
export type BuiltEpisode = {
  def: EpisodeDef;
  duration: number;
  scenes: BuiltScene[];
  global: Schedule; // everything merged, in episode frames
};

const cache = new Map<string, BuiltEpisode>();

export function buildEpisode(def: EpisodeDef): BuiltEpisode {
  const hit = cache.get(def.id);
  if (hit && hit.def === def) return hit;
  let from = 0;
  const scenes: BuiltScene[] = def.scenes.map((sc) => {
    const local = buildSchedule(sc.steps, def.voices, sc.min ?? 0);
    local.duration += Math.round((sc.tail ?? 0.6) * FPS);
    const built = {...sc, from, local, global: shiftSchedule(local, from)};
    from += local.duration;
    return built;
  });
  const global: Schedule = {
    duration: from,
    lines: scenes.flatMap((s) => s.global.lines),
    sfx: scenes.flatMap((s) => s.global.sfx),
    music: scenes.flatMap((s) => s.global.music),
    cues: Object.assign({}, ...scenes.map((s) => s.global.cues)),
    beats: Object.assign({}, ...scenes.map((s) => s.global.beats)),
  };
  const ep = {def, duration: from, scenes, global};
  cache.set(def.id, ep);
  return ep;
}

/** YouTube chapter list, e.g. "0:00 Cold open". */
export function chapters(ep: BuiltEpisode) {
  return ep.scenes
    .filter((s, i) => i === 0 || s.title)
    .map((s) => {
      const sec = Math.floor(s.from / FPS);
      return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} ${s.title ?? 'Intro'}`;
    });
}
