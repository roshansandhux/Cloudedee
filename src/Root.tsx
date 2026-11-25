import React from 'react';
import {Composition, Sequence, Still} from 'remotion';
import {buildEpisode} from './engine/episode';
import {ClipPlayer, EpisodePlayer} from './engine/EpisodePlayer';
import {FPS} from './engine/timeline';
import {RigSheet} from './RigSheet';
import {ShortOverlay} from './components/ShortOverlay';
import {ShortCta, ctaFrames} from './components/ShortCta';
import {Thumbnail, THUMBS} from './episodes/fin02/thumbs';
import {BRAND_STILLS} from './brand/Brand';
import {EPISODES} from './episodes/registry';
import {SHORTS} from './shorts';
import {CAST} from './cast';
import {Test3D, test3dDuration} from './three/Test3D';

const ShortComp: React.FC<{episodeId: string; from: number; len: number; hook?: string; cta?: string; ctaText?: string}> = ({episodeId, from, len, hook, cta, ctaText}) => (
  <>
    <Sequence durationInFrames={len}>
      <ClipPlayer episodeId={episodeId} from={from}>
        <ShortOverlay hook={hook} />
      </ClipPlayer>
    </Sequence>
    {cta && (
      <Sequence from={len}>
        <ShortCta voice={cta} text={ctaText ?? ''} />
      </Sequence>
    )}
  </>
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
        defaultProps={{episodeId: s.episode, from: Math.round(s.from * FPS), len: Math.round((s.to - s.from) * FPS), hook: s.hook, cta: s.cta, ctaText: s.ctaText}}
        durationInFrames={Math.round((s.to - s.from) * FPS) + (s.cta ? ctaFrames(s.cta) : 0)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
    <Composition id="Test3D" component={Test3D} durationInFrames={test3dDuration()} fps={FPS} width={1920} height={1080} />
    {BRAND_STILLS.map((b) => (
      <Still key={b.id} id={b.id} component={b.component} width={b.width} height={b.height} />
    ))}
    {THUMBS.map((t) => (
      <Still key={t.id} id={t.id} component={Thumbnail} defaultProps={{variant: t.variant}} width={1920} height={1080} />
    ))}
    {Object.keys(CAST)
      .filter((who) => CAST[who].look)
      .map((who) => (
        <Still key={who} id={`RigSheet-${who}`} component={RigSheet} defaultProps={{who}} width={1920} height={1080} />
      ))}
  </>
);
