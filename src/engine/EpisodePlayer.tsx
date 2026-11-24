import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {audioLibrary, FPS, type Schedule} from './timeline';
import {buildEpisode} from './episode';
import {getEpisode} from '../episodes/registry';
import {SceneProvider} from './SceneContext';
import {Letterbox} from '../components/Letterbox';

/** Per-frame music volume multiplier: dips while anyone is talking. */
function duckCurve(s: Schedule) {
  const talk = new Uint8Array(s.duration + 1);
  for (const l of s.lines) for (let f = Math.max(0, l.start); f < Math.min(s.duration, l.end); f++) talk[f] = 1;
  const out = new Float32Array(s.duration + 1);
  let v = 1;
  for (let f = 0; f <= s.duration; f++) {
    const target = talk[f] ? 0.38 : 1;
    // look ahead a few frames so the music dips just before the voice
    const ahead = talk[Math.min(s.duration, f + 4)] ? 0.38 : target;
    const goal = Math.min(target, ahead);
    v += (goal - v) * (goal < v ? 0.35 : 0.08);
    out[f] = v;
  }
  return out;
}

/** Music segments: each music() step plays until the next one. */
function musicSegments(s: Schedule) {
  const segs: {name: keyof typeof audioLibrary.music; from: number; to: number; vol: number}[] = [];
  const changes = [...s.music].sort((a, b) => a.start - b.start);
  changes.forEach((m, i) => {
    if (!m.name) return;
    const to = i + 1 < changes.length ? changes[i + 1].start : s.duration;
    if (to > m.start) segs.push({name: m.name, from: m.start, to, vol: m.vol});
  });
  return segs;
}

export const AudioTracks: React.FC<{schedule: Schedule}> = ({schedule}) => {
  const duck = useMemo(() => duckCurve(schedule), [schedule]);
  const segs = useMemo(() => musicSegments(schedule), [schedule]);
  const fade = Math.round(0.6 * FPS);
  return (
    <>
      {segs.map((m, i) => (
        <Sequence key={`m${i}`} from={m.from} durationInFrames={m.to - m.from} name={`music:${m.name}`} layout="none">
          <Html5Audio
            src={staticFile(audioLibrary.music[m.name].file)}
            loop
            volume={(f) => {
              const len = m.to - m.from;
              const edge = Math.min(1, f / fade, (len - f) / fade);
              return m.vol * Math.max(0, edge) * duck[Math.min(duck.length - 1, m.from + f)];
            }}
          />
        </Sequence>
      ))}
      {schedule.lines
        .filter((l) => l.clip)
        .map((l) => (
          <Sequence key={l.id} from={l.audioStart} name={`voice:${l.id}`} layout="none" durationInFrames={Math.ceil(l.clip!.duration * FPS) + 2}>
            <Html5Audio src={staticFile(l.clip!.file)} volume={1} />
          </Sequence>
        ))}
      {schedule.sfx.map((x, i) => (
        <Sequence key={`s${i}`} from={x.start} name={`sfx:${x.name}`} layout="none" durationInFrames={Math.ceil(audioLibrary.sfx[x.name].duration * FPS) + 2}>
          <Html5Audio src={staticFile(audioLibrary.sfx[x.name].file)} volume={x.vol} />
        </Sequence>
      ))}
    </>
  );
};

/** Renders a whole episode: every scene in order, plus all voices, sfx and music. */
export const EpisodePlayer: React.FC<{episodeId: string; letterbox?: boolean}> = ({episodeId, letterbox = true}) => {
  const ep = buildEpisode(getEpisode(episodeId));
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {ep.scenes.map((sc) => (
        <Sequence key={sc.id} from={sc.from} durationInFrames={sc.local.duration} name={`scene:${sc.id}`} premountFor={15}>
          <SceneProvider schedule={sc.local}>
            <sc.View />
          </SceneProvider>
        </Sequence>
      ))}
      <AudioTracks schedule={ep.global} />
      {letterbox && <Letterbox size={width >= height ? 34 : 22} />}
    </AbsoluteFill>
  );
};

/** A vertical (9:16) clip of an episode, for Shorts/Reels. */
export const ClipPlayer: React.FC<{episodeId: string; from: number; children?: React.ReactNode}> = ({episodeId, from, children}) => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Sequence from={-from} layout="absolute-fill">
      <EpisodePlayer episodeId={episodeId} />
    </Sequence>
    {children}
  </AbsoluteFill>
);
