import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Thin cinematic black bars, top and bottom. */
export const Letterbox: React.FC<{size?: number}> = ({size = 34}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: size, background: '#000'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: size, background: '#000'}} />
  </AbsoluteFill>
);
