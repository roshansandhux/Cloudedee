import React from 'react';
import {Easing, interpolate} from 'remotion';
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import {useScene} from '../../engine/SceneContext';
import {Stage, GROUND} from '../../stage/Stage';
import {camKeys, hop, walk, WIDE} from '../../stage/camera';
import {Ground, Hills, Room, Sky} from '../../sets/sets';
import {Bench, Flower, Plant, Sofa, StreetLamp, Tree, WindowFrame, PictureFrame} from '../../props/props';
import {DustPuff, Emote, IrisWipe, Vignette} from '../../fx/fx';
import voices from '../../generated/voices/ep00.json';
import {s1, s2} from './script';

const Park: React.FC = () => {
  const s = useScene();
  const w = s.beat('walkIn');
  const a = walk(s.frame, w.start, w.end, -250, 760);
  const b = walk(s.frame, w.start + 10, w.end, 2200, 1180);
  const h = hop(s.frame, s.cue('hop'));
  const cam = camKeys(s.frame, [
    {f: 0, cam: {x: 960, y: 520, zoom: 1.0}},
    {f: w.end, cam: {x: 960, y: 560, zoom: 1.08}},
    {f: s.at('a02') - 4, cam: {x: 960, y: 560, zoom: 1.08}},
    {f: s.at('a02') + 6, cam: {x: 780, y: 520, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
  ]);
  return (
    <Stage
      cam={cam}
      vcam={{x: (a.x + b.x) / 2}}
      set={
        <>
          <Sky frame={s.frame} />
          <Hills />
          <Ground y={860} />
        </>
      }
      actors={[
        {who: 'testA', x: a.x, y: GROUND + h.dy, facing: 1, walking: a.walking, walkPhase: a.walkPhase, squash: h.squash, pose: s.after('a02') ? 'up' : s.after('a01') && !s.after('b01') ? 'wave' : 'down', mood: s.after('hop') ? 'surprised' : 'happy'},
        {who: 'testB', x: b.x, facing: -1, walking: b.walking, walkPhase: b.walkPhase, pose: s.after('b01') ? 'cross' : 'down', mood: 'neutral'},
      ]}
      front={
        <>
          <DustPuff x={a.x} y={GROUND} t={s.frame - s.cue('hop') - 16} />
          <Emote x={a.x + 20} y={GROUND - 520} t={s.frame - s.cue('hop')} kind="!" dur={30} />
        </>
      }
    >
      <Tree x={240} y={870} frame={s.frame} />
      <Tree x={1720} y={865} s={0.85} leaf="#6cc477" frame={s.frame} />
      <StreetLamp x={1500} y={880} />
      <Bench x={420} y={890} />
      <Flower x={620} y={930} />
      <Flower x={1340} y={940} color="#a98bff" />
    </Stage>
  );
};

const Lounge: React.FC = () => {
  const s = useScene();
  const iris = s.progress('iris', null);
  const cam = camKeys(s.frame, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: s.duration, cam: {x: 960, y: 600, zoom: 1.25}, ease: Easing.inOut(Easing.sin)},
  ]);
  const lookAt = s.activeLine('testB') ? {x: 0.6, y: 0} : {x: 0.3, y: 0.2};
  return (
    <Stage
      cam={cam}
      set={<Room wall="#3d3a66" trim="#5a548f" floor="#6b4d3a" wallpaper="dots" />}
      actors={[
        {who: 'testA', x: 820, y: 880, facing: 1, sitting: true, look2: lookAt, pose: ['down', 'hold'], mood: 'worried'},
        {who: 'testB', x: 1120, y: 880, facing: -1, sitting: true, pose: 'down', mood: 'neutral'},
      ]}
      overlay={
        <>
          <Vignette amount={0.45} />
          {iris > 0 && <IrisWipe t={iris} x="44%" y="45%" />}
        </>
      }
    >
      <WindowFrame x={500} y={300} view="night" curtains="#e86a8f" />
      <PictureFrame x={1450} y={330} art="sun" />
      <Plant x={1640} y={880} />
      <Sofa x={970} y={890} />
    </Stage>
  );
};

export const ep00: EpisodeDef = {
  id: 'ep00',
  number: 0,
  title: 'Pipeline Test',
  voices: voices as VoiceManifest,
  scenes: [
    {id: 'park', title: 'The park', steps: s1, View: Park},
    {id: 'lounge', title: 'Night in', steps: s2, View: Lounge, tail: 0.2},
  ],
};
