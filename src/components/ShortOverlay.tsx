import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FullEpisodeButton} from '../fx/fx';
import {FONT, INK} from '../lib/theme';

/** Overlay for Shorts: hook text at the top for the first seconds + "Full episode on YouTube" button. */
export const ShortOverlay: React.FC<{hook?: string}> = ({hook}) => {
  const f = useCurrentFrame();
  const hookOp = interpolate(f, [0, 6, 100, 112], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      {hook && (
        <div style={{position: 'absolute', top: 190, left: 60, right: 60, textAlign: 'center', opacity: hookOp, fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill'}}>
          {hook}
        </div>
      )}
      <FullEpisodeButton frame={f} />
    </>
  );
};
