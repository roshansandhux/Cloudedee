import React from 'react';
import {Composition, Still} from 'remotion';
import {buildEpisode} from './engine/episode';
import {ClipPlayer, EpisodePlayer} from './engine/EpisodePlayer';
import {FPS} from './engine/timeline';
import {RigSheet} from './RigSheet';
import {ShortOverlay} from './components/ShortOverlay';
import {EPISODES} from './episodes/registry';
import {SHORTS} from './shorts';
import {CAST} from './cast';
import {Test3D, test3dDuration} from './three/Test3D';

const ShortComp: React.FC<{episodeId: string; from: number; hook?: string}> = ({episodeId, from, hook}) => (
  <ClipPlayer episodeId={episodeId} from={from}>
    <ShortOverlay hook={hook} />
  </ClipPlayer>
);

export const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition key={ep.id} id={ep.id} component={EpisodePlayer} defaultProps={{episodeId: ep.id}} durationInFrames={buildEpisode(ep).duration} fps={FPS} width={1920} height={1080} />
    ))}
    {EPISODES.map((ep) => (
      <Composition key={`${ep.id}-vertical`} id={`${ep.id}-vertical`} component={EpisodePlayer} defaultProps={{episodeId: ep.id}} durationInFrames={buildEpisode(ep).duration} fps={FPS} width={1080} height={1920} />
    ))}
    {SHORTS.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={ShortComp}
        defaultProps={{episodeId: s.episode, from: Math.round(s.from * FPS), hook: s.hook}}
        durationInFrames={Math.round((s.to - s.from) * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
    <Composition id="Test3D" component={Test3D} durationInFrames={test3dDuration()} fps={FPS} width={1920} height={1080} />
    {Object.keys(CAST)
      .filter((who) => CAST[who].look)
      .map((who) => (
        <Still key={who} id={`RigSheet-${who}`} component={RigSheet} defaultProps={{who}} width={1920} height={1080} />
      ))}
  </>
);
