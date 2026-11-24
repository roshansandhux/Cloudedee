// What a character looks like. Every cast member gets one Look in src/cast.ts.

export type Hair = 'none' | 'tuft' | 'spiky' | 'bob' | 'bun' | 'curly' | 'swoop' | 'pigtails';
export type Hat = 'none' | 'cap' | 'beanie' | 'tophat' | 'bow' | 'chef' | 'crown' | 'headphones' | 'colander';
export type Neck = 'none' | 'tie' | 'bowtie' | 'scarf' | 'collar';
export type Outfit = 'shirt' | 'dress' | 'coat' | 'overalls' | 'hoodie';

export type Look = {
  skin: string; // head + hands
  body: string; // top / dress
  legs: string; // trousers / legs
  shoes: string;
  outline?: string;
  hair?: Hair;
  hairColor?: string;
  hat?: Hat;
  hatColor?: string;
  neck?: Neck;
  neckColor?: string;
  outfit?: Outfit;
  glasses?: boolean;
  mustache?: boolean;
  freckles?: boolean;
  blush?: boolean;
  /** overall size (1 = adult ~430px tall). Kids ≈ 0.75 */
  size?: number;
  /** head radius in px (default 98) */
  head?: number;
  /** body width multiplier (default 1) */
  girth?: number;
  /** leg length multiplier (default 1) */
  legLength?: number;
  /** zombie: blank eyes, eye bags, slack mouth */
  zombie?: boolean;
  /** tired/undead eye bags without full zombie eyes */
  eyeBags?: boolean;
  /** ragged hem on the top */
  torn?: boolean;
  /** draw ears (default true) */
  ears?: boolean;
  earColor?: string;
  /** strapped-on couch cushions */
  armor?: 'cushions';
  /** bandage on the front arm */
  bandage?: boolean;
};

export const OUTLINE = '#2b2333';
