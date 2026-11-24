// Costume states for ep01 continuity.
import {interpolateColors} from 'remotion';
import {lookOf} from '../../cast';
import type {Look} from '../../rig/looks';

export const GREEN_SKIN = '#9fc28a';

export const dexL = (): Look => lookOf('dex');
export const miloL = (geared = false): Look => ({...lookOf('milo'), ...(geared ? {hat: 'colander' as const} : {})});
export const bennyL = (geared = false, green = 0, bandage = false): Look => {
  const b = lookOf('benny');
  return {
    ...b,
    ...(geared ? {armor: 'cushions' as const} : {}),
    skin: green > 0 ? interpolateColors(green, [0, 1], [b.skin, GREEN_SKIN]) : b.skin,
    eyeBags: green > 0.6,
    bandage,
  };
};
/** Benny at the end: normal skin again – except one green ear. */
export const bennyEndL = (): Look => ({...bennyL(true, 0, true), earColor: GREEN_SKIN});
export const crumbL = (zombie = false): Look => ({...lookOf('crumb'), ...(zombie ? {skin: GREEN_SKIN, zombie: true} : {})});
export const garyL = (): Look => ({
  skin: '#a3b88c',
  body: '#d63a2a',
  legs: '#3a3f55',
  shoes: '#2a2a2a',
  hair: 'swoop',
  hairColor: '#6b5a3a',
  neck: 'collar',
  neckColor: '#f6c945',
  zombie: true,
  torn: true,
  blush: false,
  girth: 1.1,
});
export const bigZL = (): Look => ({
  skin: '#98ad9f',
  body: '#4f5d6b',
  legs: '#2f3440',
  shoes: '#1a1a1a',
  hair: 'none',
  zombie: true,
  torn: true,
  blush: false,
  girth: 1.9,
  size: 1.25,
  head: 92,
  outfit: 'hoodie',
});
