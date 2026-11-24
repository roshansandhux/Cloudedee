// Generates every sound effect and music loop for the series, purely from maths.
// No samples, no stock audio. Usage:  npm run sfx
// Output: public/sfx/*.wav, public/music/*.wav and src/generated/audio-library.json (durations).
import fs from 'node:fs';
import path from 'node:path';
import {writeWav, SR} from './lib/wav.mjs';

// ---------- deterministic randomness (same files every run) ----------
let seed = 1234567;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;

// ---------- building blocks ----------
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const TAU = Math.PI * 2;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

/** One-pole low-pass, in place. cutoff can be a function of time (s). */
function lowpass(x, cutoff) {
  let y = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = typeof cutoff === 'function' ? cutoff(i / SR) : cutoff;
    const a = 1 - Math.exp((-TAU * fc) / SR);
    y += a * (x[i] - y);
    x[i] = y;
  }
  return x;
}
function highpass(x, cutoff) {
  const lp = lowpass(Float32Array.from(x), cutoff);
  for (let i = 0; i < x.length; i++) x[i] -= lp[i];
  return x;
}
/** Resonant band-pass (state variable filter). */
function bandpass(x, freq, q = 4) {
  let low = 0;
  let band = 0;
  for (let i = 0; i < x.length; i++) {
    const f = typeof freq === 'function' ? freq(i / SR) : freq;
    const F = 2 * Math.sin((Math.PI * Math.min(f, SR / 6)) / SR);
    const high = x[i] - low - band / q;
    band += F * high;
    low += F * band;
    x[i] = band;
  }
  return x;
}
/** Oscillator with a frequency function, returns array. */
function osc(sec, freq, shape = 'sine', amp = 1) {
  const out = buf(sec);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const f = typeof freq === 'function' ? freq(t) : freq;
    ph += f / SR;
    const p = ph % 1;
    let v;
    if (shape === 'sine') v = Math.sin(TAU * p);
    else if (shape === 'tri') v = 1 - 4 * Math.abs(p - 0.5);
    else if (shape === 'saw') v = 2 * p - 1;
    else v = p < 0.5 ? 1 : -1; // square
    out[i] = v * (typeof amp === 'function' ? amp(t) : amp);
  }
  return out;
}
const noiseBuf = (sec) => buf(sec).map(() => noise());
function env(x, fn) {
  for (let i = 0; i < x.length; i++) x[i] *= fn(i / SR, x.length / SR);
  return x;
}
const expDecay = (k) => (t) => Math.exp(-t * k);
const adsr = (a, d, s, r) => (t, len) => {
  if (t < a) return t / a;
  if (t < a + d) return 1 - ((t - a) / d) * (1 - s);
  if (t > len - r) return s * Math.max(0, (len - t) / r);
  return s;
};
function mix(target, src, at = 0, gain = 1) {
  const o = Math.floor(at * SR);
  for (let i = 0; i < src.length && o + i < target.length; i++) if (o + i >= 0) target[o + i] += src[i] * gain;
  return target;
}
function normalize(x, peak = 0.89) {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= peak / m;
  return x;
}
/** gentle tanh saturation for warmth */
const warm = (x, drive = 1.5) => x.map((v) => Math.tanh(v * drive) / Math.tanh(drive));
/** Short fades so nothing clicks */
function fades(x, a = 0.003, r = 0.01) {
  const A = Math.floor(a * SR);
  const R = Math.floor(r * SR);
  for (let i = 0; i < A && i < x.length; i++) x[i] *= i / A;
  for (let i = 0; i < R && i < x.length; i++) x[x.length - 1 - i] *= i / R;
  return x;
}
/** Simple feedback-delay reverb (Schroeder-ish), returns new buffer with tail. */
function reverb(x, wet = 0.25, size = 1) {
  const tail = 1.2 * size;
  const out = new Float32Array(x.length + Math.floor(tail * SR));
  out.set(x);
  const combs = [1557, 1617, 1491, 1422].map((d) => Math.floor(d * size));
  const wetBuf = new Float32Array(out.length);
  for (const d of combs) {
    const line = new Float32Array(out.length);
    for (let i = 0; i < out.length; i++) {
      const fb = i >= d ? line[i - d] * 0.78 : 0;
      line[i] = (i < x.length ? x[i] : 0) + fb;
      wetBuf[i] += line[i] * 0.25;
    }
  }
  lowpass(wetBuf, 5000);
  for (let i = 0; i < out.length; i++) out[i] = out[i] * (1 - wet) + wetBuf[i] * wet;
  return out;
}
/** Karplus-Strong plucked string – lovely ukulele/pizzicato tones. */
function pluck(freq, sec, bright = 0.5, decay = 0.996) {
  const out = buf(sec);
  const N = Math.max(2, Math.round(SR / freq));
  const ring = new Float32Array(N).map(() => noise());
  lowpass(ring, 1500 + bright * 6000);
  let idx = 0;
  for (let i = 0; i < out.length; i++) {
    const a = ring[idx];
    const b = ring[(idx + 1) % N];
    ring[idx] = (a + b) * 0.5 * decay;
    out[i] = a;
    idx = (idx + 1) % N;
  }
  return fades(out, 0.001, 0.02);
}

// ---------- SOUND EFFECTS ----------
const sfx = {};

sfx.pop = () => env(osc(0.12, (t) => 900 * Math.exp(-t * 30) + 180), expDecay(35));
sfx.boing = () =>
  env(osc(0.8, (t) => 180 + 140 * Math.sin(TAU * 9 * t) * Math.exp(-t * 3) + 120 * t, 'tri'), expDecay(5));
sfx.whoosh = () => {
  const x = noiseBuf(0.55);
  bandpass(x, (t) => 400 + 2600 * Math.sin((Math.PI * t) / 0.55), 2.2);
  return env(x, (t, l) => Math.sin((Math.PI * t) / l) ** 2);
};
sfx.swish = () => {
  const x = noiseBuf(0.22);
  bandpass(x, (t) => 1500 + 6000 * (t / 0.22), 3);
  return env(x, (t, l) => Math.sin((Math.PI * t) / l));
};
sfx.thud = () => {
  const body = env(osc(0.35, (t) => 95 * Math.exp(-t * 6) + 38), expDecay(10));
  const hit = lowpass(env(noiseBuf(0.05), expDecay(80)), 900);
  return mix(body, hit, 0, 0.8);
};
sfx.bonk = () => {
  const x = env(osc(0.3, (t) => 520 * Math.exp(-t * 4) + 300, 'tri'), expDecay(14));
  return mix(x, env(osc(0.3, 1240), expDecay(25)), 0, 0.3);
};
sfx.ding = () => {
  const x = buf(1.6);
  [
    [1320, 1, 2.5],
    [2640, 0.4, 4],
    [3960, 0.2, 6],
    [1980, 0.15, 3],
  ].forEach(([f, a, k]) => mix(x, env(osc(1.6, f), expDecay(k)), 0, a));
  return x;
};
sfx.footstep = () => lowpass(env(noiseBuf(0.07), expDecay(60)), 700);
sfx.click = () => highpass(env(noiseBuf(0.012), expDecay(400)), 2000);
sfx.splat = () => {
  const x = lowpass(env(noiseBuf(0.4), expDecay(9)), (t) => 3000 * Math.exp(-t * 6) + 200);
  return mix(x, env(osc(0.25, (t) => 220 * Math.exp(-t * 9) + 50), expDecay(14)), 0, 0.7);
};
sfx.sparkle = () => {
  const x = buf(1.3);
  [0, 0.07, 0.13, 0.22, 0.3, 0.41, 0.5].forEach((t, i) =>
    mix(x, env(osc(0.6, midi(96 + [0, 4, 7, 12, 7, 11, 14][i])), expDecay(9)), t, 0.4),
  );
  return x;
};
sfx.slideUp = () => env(osc(0.7, (t) => 300 * Math.pow(4, t / 0.7) * (1 + 0.01 * Math.sin(TAU * 6 * t)), 'sine'), adsr(0.03, 0.1, 0.9, 0.08));
sfx.slideDown = () => env(osc(0.7, (t) => 1200 * Math.pow(0.25, t / 0.7) * (1 + 0.01 * Math.sin(TAU * 6 * t)), 'sine'), adsr(0.03, 0.1, 0.9, 0.08));
sfx.scratch = () => {
  const x = noiseBuf(0.45);
  bandpass(x, (t) => 600 + 1800 * Math.abs(Math.sin(TAU * 4.5 * t)), 3);
  return env(x, adsr(0.01, 0.05, 0.8, 0.1));
};
sfx.crickets = () => {
  const x = buf(4);
  for (let c = 0; c < 9; c++) {
    const at = c * 0.45 + (c % 3) * 0.05;
    for (let p = 0; p < 3; p++) mix(x, env(osc(0.04, 4600 + (c % 2) * 300), adsr(0.005, 0.01, 0.7, 0.02)), at + p * 0.055, 0.25);
  }
  return x;
};
sfx.drumroll = () => {
  const x = buf(2.2);
  for (let t = 0; t < 1.7; t += 0.035) mix(x, highpass(env(noiseBuf(0.08), expDecay(50)), 400), t, 0.25 + 0.5 * (t / 1.7));
  mix(x, env(highpass(noiseBuf(1.4), 3000), expDecay(3)), 1.72, 0.8); // cymbal
  mix(x, env(osc(0.4, (t) => 120 * Math.exp(-t * 8) + 45), expDecay(9)), 1.72, 1); // kick
  return x;
};
sfx.tada = () => {
  const x = buf(1.8);
  [60, 64, 67, 72].forEach((n) => {
    mix(x, env(osc(0.18, midi(n + 12), 'saw'), adsr(0.01, 0.05, 0.6, 0.05)), 0, 0.15);
    mix(x, env(osc(1.6, midi(n + 12), 'saw'), adsr(0.02, 0.3, 0.6, 0.6)), 0.22, 0.15);
  });
  lowpass(x, 3500);
  return x;
};
sfx.sadTrombone = () => {
  const x = buf(2.6);
  [
    [0, 0.45, 58],
    [0.5, 0.45, 57],
    [1.0, 0.45, 56],
    [1.5, 1.0, 55],
  ].forEach(([at, len, n], i) => {
    const tone = osc(len, (t) => midi(n) * (1 + (i === 3 ? 0.03 * Math.sin(TAU * 5 * t) : 0)), 'saw');
    mix(x, env(lowpass(tone, (t) => 500 + 900 * Math.sin((Math.PI * t) / len)), adsr(0.04, 0.1, 0.8, 0.12)), at, 0.5);
  });
  return x;
};
sfx.gulp = () => env(osc(0.25, (t) => 300 + 500 * Math.sin((Math.PI * t) / 0.25), 'sine'), (t, l) => Math.sin((Math.PI * t) / l));
sfx.honk = () => {
  const x = mix(osc(0.5, 415, 'saw'), osc(0.5, 523, 'saw'), 0, 1);
  return env(lowpass(x, 1800), adsr(0.02, 0.05, 0.8, 0.08));
};
sfx.knock = () => {
  const x = buf(0.9);
  [0, 0.22, 0.44].forEach((t) => mix(x, lowpass(env(mix(noiseBuf(0.1), osc(0.1, 180), 0, 0.7), expDecay(55)), 1200), t, 1));
  return x;
};
sfx.creak = () => {
  const x = buf(1.2);
  for (let t = 0; t < 1.1; t += 0.012 + 0.01 * Math.sin(t * 9) ** 2) mix(x, bandpass(env(noiseBuf(0.02), expDecay(300)), 900 + 500 * Math.sin(t * 3), 8), t, 0.7);
  return x;
};
sfx.phoneRing = () => {
  const x = buf(2.2);
  for (const start of [0, 1.1]) {
    const r = osc(0.8, (t) => (Math.floor(t * 20) % 2 ? 1400 : 1700), 'square');
    mix(x, lowpass(env(r, adsr(0.01, 0.05, 0.8, 0.02)), 4000), start, 0.25);
  }
  return x;
};
sfx.typing = () => {
  const x = buf(1.5);
  for (let t = 0; t < 1.4; t += 0.06 + rnd() * 0.07) mix(x, bandpass(env(noiseBuf(0.03), expDecay(180)), 2500 + rnd() * 1500, 2), t, 0.6);
  return x;
};
sfx.sting = () => {
  const x = buf(2);
  [36, 37, 43, 48].forEach((n) => mix(x, env(osc(2, midi(n), 'saw'), adsr(0.01, 0.3, 0.5, 1.2)), 0, 0.2));
  return lowpass(x, (t) => 2500 * Math.exp(-t * 1.5) + 300);
};
sfx.zap = () => env(osc(0.3, (t) => 1800 * Math.exp(-t * 14) + 200, 'square'), expDecay(10));
sfx.squeak = () => env(osc(0.18, (t) => 1800 + 900 * Math.sin((Math.PI * t) / 0.18), 'sine'), (t, l) => Math.sin((Math.PI * t) / l));
sfx.rumble = () => lowpass(env(noiseBuf(2.5), adsr(0.4, 0.4, 0.7, 0.8)), 160);
sfx.splash = () => {
  const x = env(noiseBuf(1.1), expDecay(4));
  bandpass(x, (t) => 2500 * Math.exp(-t * 2) + 600, 1.5);
  for (let t = 0.1; t < 0.8; t += 0.05 + rnd() * 0.06) mix(x, env(osc(0.05, 900 + rnd() * 1500), expDecay(60)), t, 0.25);
  return x;
};
sfx.heartbeat = () => {
  const x = buf(1);
  [0, 0.22].forEach((t, i) => mix(x, env(osc(0.18, (tt) => 70 * Math.exp(-tt * 6) + 40), expDecay(20)), t, i ? 0.7 : 1));
  return x;
};
sfx.gasp = () => {
  const x = noiseBuf(0.4);
  bandpass(x, (t) => 1400 + 1200 * (t / 0.4), 2.5);
  return env(x, adsr(0.05, 0.1, 0.6, 0.15));
};

// ---------- MUSIC (little sequencer) ----------
// Each track is a seamless loop. Drums + bass + chords + melody, mixed and slightly reverbed.
function drumKit() {
  return {
    kick: () => env(osc(0.35, (t) => 110 * Math.exp(-t * 20) + 45), expDecay(9)),
    snare: () => mix(highpass(env(noiseBuf(0.2), expDecay(22)), 900), env(osc(0.12, 190, 'tri'), expDecay(30)), 0, 0.5),
    hat: () => highpass(env(noiseBuf(0.05), expDecay(90)), 6000),
    shaker: () => highpass(env(noiseBuf(0.08), (t, l) => Math.sin((Math.PI * t) / l)), 5000),
  };
}
/**
 * spec: {bpm, bars, beatsPerBar, parts:[{fn(beatTime)->buffer, pattern:[[beat, arg, gain]] }]}
 * pattern beats are counted from loop start.
 */
function sequence({bpm, bars, beatsPerBar = 4}, events, opts = {}) {
  const beat = 60 / bpm;
  const len = bars * beatsPerBar * beat;
  const out = buf(len + 3); // extra room for tails, folded back for seamless loop
  for (const [b, make, gain] of events) mix(out, make(beat), b * beat, gain);
  let full = opts.reverb ? reverb(out, opts.reverb, 1.1) : out;
  const loop = buf(len);
  for (let i = 0; i < full.length; i++) loop[i % loop.length] += full[i];
  return normalize(warm(loop, 1.2), 0.7);
}
const chordsFrom = (prog, beatsEach, voicing) => prog.flatMap((root, i) => voicing.map((iv) => [i * beatsEach, root + iv]));

const music = {};

// Bright, bouncy series theme – ukulele plucks, bass, claps.
music.theme = () => {
  const ev = [];
  const k = drumKit();
  const prog = [60, 57, 53, 55, 60, 57, 53, 55]; // C Am F G
  prog.forEach((root, bar) => {
    const notes = [0, 4, 7, 12].map((iv) => root + (iv === 4 && [57].includes(root) ? 3 : iv));
    const minor = root === 57;
    const chord = [0, minor ? 3 : 4, 7, 12].map((i) => root + i);
    [0, 0.5, 1.5, 2, 2.5, 3.5].forEach((b, j) => ev.push([bar * 4 + b, () => pluck(midi(chord[j % 4]), 0.6, 0.6), 0.22]));
    ev.push([bar * 4, () => env(osc(0.5, midi(root - 24), 'tri'), adsr(0.01, 0.1, 0.7, 0.1)), 0.5]);
    ev.push([bar * 4 + 2, () => env(osc(0.5, midi(root - 17), 'tri'), adsr(0.01, 0.1, 0.7, 0.1)), 0.45]);
    [0, 2].forEach((b) => ev.push([bar * 4 + b, k.kick, 0.6]));
    [1, 3].forEach((b) => ev.push([bar * 4 + b, k.snare, 0.3]));
    [0.5, 1.5, 2.5, 3.5].forEach((b) => ev.push([bar * 4 + b, k.shaker, 0.12]));
  });
  const mel = [72, 74, 76, 79, 76, 74, 72, null, 69, 72, 74, 72, 71, 67, null, null];
  for (let r = 0; r < 2; r++)
    mel.forEach((n, i) => n && ev.push([r * 16 + i * 2, (b) => env(osc(b * 1.8, (t) => midi(n) * (1 + 0.004 * Math.sin(TAU * 5 * t)), 'tri'), adsr(0.02, 0.2, 0.5, 0.2)), 0.16]));
  return sequence({bpm: 112, bars: 8}, ev, {reverb: 0.18});
};

// Sneaky / curious – pizzicato minor walk, tiptoe vibe.
music.curious = () => {
  const ev = [];
  const walk = [57, 60, 64, 60, 56, 59, 64, 59, 53, 57, 60, 57, 52, 56, 59, 62];
  for (let r = 0; r < 2; r++)
    walk.forEach((n, i) => {
      ev.push([r * 16 + i, () => pluck(midi(n - 12), 0.5, 0.3, 0.99), 0.4]);
      if (i % 2 === 1) ev.push([r * 16 + i + 0.5, () => pluck(midi(n), 0.3, 0.7, 0.98), 0.18]);
    });
  [0, 4, 8, 12, 16, 20, 24, 28].forEach((b) => ev.push([b, () => env(osc(0.3, 55, 'sine'), expDecay(8)), 0.4]));
  const bell = [76, null, 75, null, 76, null, 71, null];
  bell.forEach((n, i) => n && ev.push([16 + i * 2, () => env(osc(1.2, midi(n)), expDecay(4)), 0.08]));
  return sequence({bpm: 96, bars: 8}, ev, {reverb: 0.22});
};

// Chase – fast, driving bass and drums.
music.chase = () => {
  const ev = [];
  const k = drumKit();
  const roots = [50, 50, 53, 48, 50, 50, 55, 52];
  roots.forEach((root, bar) => {
    for (let s = 0; s < 8; s++) ev.push([bar * 4 + s * 0.5, () => env(lowpass(osc(0.2, midi(root - 12 + (s === 6 ? 12 : 0)), 'saw'), 900), adsr(0.005, 0.05, 0.6, 0.05)), 0.35]);
    [0, 1, 2, 3].forEach((b) => ev.push([bar * 4 + b, k.kick, 0.55]));
    [1, 3].forEach((b) => ev.push([bar * 4 + b, k.snare, 0.4]));
    for (let s = 0; s < 8; s++) ev.push([bar * 4 + s * 0.5 + 0.25, k.hat, 0.12]);
    if (bar % 2 === 1) [74, 72, 69, 67].forEach((n, i) => ev.push([bar * 4 + i * 0.5 + 2, () => env(osc(0.22, midi(n), 'square'), adsr(0.005, 0.05, 0.5, 0.05)), 0.07]));
  });
  return sequence({bpm: 152, bars: 8}, ev, {reverb: 0.1});
};

// Tender – slow arpeggios and soft pad.
music.tender = () => {
  const ev = [];
  const prog = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]];
  for (let r = 0; r < 2; r++)
    prog.forEach((ch, bi) => {
      const bar = r * 4 + bi;
      ch.forEach((n) => ev.push([bar * 4, (b) => env(osc(b * 4, midi(n), 'tri'), adsr(0.8, 0.5, 0.6, 1.2)), 0.05]));
      [0, 1, 2, 3, 2, 1, 0, 3].forEach((ix, j) => ev.push([bar * 4 + j * 0.5, () => env(osc(1.2, midi(ch[ix] + 12)), expDecay(3.5)), 0.1]));
      ev.push([bar * 4, (b) => env(osc(b * 4, midi(ch[0] - 24), 'sine'), adsr(0.3, 0.5, 0.7, 0.8)), 0.25]);
    });
  return sequence({bpm: 72, bars: 8}, ev, {reverb: 0.35});
};

// Tension – drone, heartbeat pulse, dissonant swells.
music.tension = () => {
  const ev = [];
  for (let bar = 0; bar < 8; bar++) {
    ev.push([bar * 4, (b) => lowpass(env(mix(osc(b * 4, midi(38), 'saw'), osc(b * 4, midi(38) * 1.006, 'saw')), adsr(1, 0.5, 0.8, 1)), 400), 0.25]);
    ev.push([bar * 4, sfx.heartbeat, 0.45]);
    ev.push([bar * 4 + 2, sfx.heartbeat, 0.35]);
    if (bar % 2) ev.push([bar * 4 + 1, (b) => env(osc(b * 3, midi(75), 'sine'), adsr(1.2, 0.5, 0.4, 1)), 0.05]);
  }
  return sequence({bpm: 80, bars: 8}, ev, {reverb: 0.3});
};

// Silly – oompah tuba + bouncy clarinet-ish square, for slapstick.
music.silly = () => {
  const ev = [];
  const k = drumKit();
  const roots = [55, 50, 55, 50, 48, 50, 55, 50];
  roots.forEach((root, bar) => {
    ev.push([bar * 4, () => env(lowpass(osc(0.35, midi(root - 24), 'saw'), 500), adsr(0.01, 0.1, 0.7, 0.08)), 0.6]);
    ev.push([bar * 4 + 2, () => env(lowpass(osc(0.35, midi(root - 17), 'saw'), 500), adsr(0.01, 0.1, 0.7, 0.08)), 0.5]);
    [1, 3].forEach((b) => ev.push([bar * 4 + b, () => mix(pluck(midi(root), 0.3, 0.8), pluck(midi(root + 4), 0.3, 0.8)), 0.2]));
    [1, 3].forEach((b) => ev.push([bar * 4 + b, k.snare, 0.15]));
  });
  const mel = [67, 71, 74, 71, 72, 69, 66, 69, 67, 71, 74, 79, 76, 72, 74, null];
  for (let r = 0; r < 2; r++) mel.forEach((n, i) => n && ev.push([r * 16 + i, () => env(lowpass(osc(0.45, midi(n), 'square'), 2200), adsr(0.02, 0.1, 0.6, 0.08)), 0.09]));
  return sequence({bpm: 126, bars: 8}, ev, {reverb: 0.12});
};

// ---------- ZOMBIE & ACTION SFX (added ep01) ----------
/** Formant "voice": glottal pulse through two vowel formants – used for groans and roars. */
function voice(sec, pitch, f1, f2, opts = {}) {
  const src = osc(sec, pitch, 'saw');
  const breath = noiseBuf(sec).map((v) => v * (opts.breath ?? 0.25));
  for (let i = 0; i < src.length; i++) src[i] = src[i] * 0.8 + breath[i];
  const a = bandpass(Float32Array.from(src), f1, 5);
  const b = bandpass(Float32Array.from(src), f2, 6);
  const out = buf(sec);
  for (let i = 0; i < out.length; i++) out[i] = a[i] + b[i] * 0.6 + src[i] * 0.05;
  return warm(lowpass(out, opts.lp ?? 2600), 2.2);
}
const groan = (len, base, f1, f2, wob) => () =>
  env(voice(len, (t) => base * (1 + 0.18 * Math.sin((Math.PI * t) / len) - 0.12 * (t / len)) * (1 + 0.03 * Math.sin(TAU * wob * t)) * (1 + 0.04 * noise()), (t) => f1 + 120 * Math.sin((Math.PI * t) / len), f2), adsr(0.15, 0.3, 0.8, 0.45));
sfx.groan1 = groan(1.6, 95, 620, 1080, 5.5);
sfx.groan2 = groan(1.9, 82, 700, 1150, 4);
sfx.groan3 = groan(1.3, 120, 520, 900, 7);
sfx.groanCrowd = () => {
  const x = buf(4.5);
  for (let i = 0; i < 9; i++) mix(x, groan(1.4 + rnd() * 1.2, 70 + rnd() * 60, 500 + rnd() * 250, 900 + rnd() * 400, 3 + rnd() * 5)(), rnd() * 2.4, 0.5);
  return lowpass(x, 2000);
};
sfx.roar = () => {
  const len = 2.6;
  const v = voice(len, (t) => 55 * (1 + 0.3 * Math.sin((Math.PI * t) / len)) * (1 + 0.08 * Math.sin(TAU * 13 * t)), 450, 800, {breath: 0.7, lp: 1800});
  const sub = osc(len, (t) => 38 + 10 * Math.sin((Math.PI * t) / len));
  return env(mix(v, sub, 0, 0.6), adsr(0.25, 0.4, 0.85, 0.8));
};
sfx.explosion = () => {
  const x = lowpass(env(noiseBuf(3.2), (t) => (t < 0.02 ? t / 0.02 : Math.exp(-t * 1.6))), (t) => 4000 * Math.exp(-t * 2.5) + 120);
  mix(x, env(osc(1.2, (t) => 70 * Math.exp(-t * 3) + 28), expDecay(2.5)), 0, 1.4);
  for (let t = 0.2; t < 2.4; t += 0.04 + rnd() * 0.12) mix(x, highpass(env(noiseBuf(0.03), expDecay(120)), 1500), t, 0.3 * Math.exp(-t));
  return warm(x, 2.5);
};
sfx.punch = () => mix(lowpass(env(noiseBuf(0.15), expDecay(40)), 2500), env(osc(0.2, (t) => 160 * Math.exp(-t * 18) + 60), expDecay(16)), 0, 1);
sfx.flame = () => {
  const x = noiseBuf(2.2);
  lowpass(x, (t) => 600 + 1800 * Math.sin((Math.PI * t) / 2.2));
  for (let t = 0; t < 2; t += 0.03 + rnd() * 0.06) mix(x, highpass(env(noiseBuf(0.02), expDecay(150)), 2000), t, 0.3);
  return env(x, adsr(0.15, 0.3, 0.8, 0.6));
};
sfx.squelch = () => {
  const x = noiseBuf(0.6);
  bandpass(x, (t) => 300 + 500 * Math.abs(Math.sin(TAU * 3 * t)), 6);
  return mix(env(x, adsr(0.02, 0.1, 0.6, 0.2)), env(osc(0.5, (t) => 120 + 80 * Math.sin(TAU * 6 * t)), expDecay(5)), 0, 0.6);
};
sfx.bite = () => {
  const x = buf(0.4);
  [0, 0.06, 0.11].forEach((t) => mix(x, bandpass(env(noiseBuf(0.06), expDecay(70)), 1800, 1.5), t, 1));
  return x;
};
sfx.rcCar = () => env(lowpass(osc(2.2, (t) => 140 + 30 * Math.sin(TAU * 3 * t), 'saw'), 1600), adsr(0.1, 0.2, 0.8, 0.3));
sfx.static = () => env(highpass(noiseBuf(1.4), 800), adsr(0.01, 0.1, 0.7, 0.2));
sfx.buzz = () => {
  const x = buf(2);
  [120, 240, 360, 480].forEach((f, i) => mix(x, osc(2, f, 'square'), 0, 0.12 / (i + 1)));
  for (let t = 0; t < 2; t += 0.15 + rnd() * 0.3) mix(x, highpass(env(noiseBuf(0.05), expDecay(80)), 3000), t, 0.4);
  return lowpass(x, 3000);
};
sfx.alarm = () => {
  const x = buf(2.6);
  for (let i = 0; i < 4; i++) mix(x, env(lowpass(osc(0.6, (t) => 600 + 300 * (t / 0.6), 'saw'), 2500), adsr(0.02, 0.1, 0.8, 0.1)), i * 0.65, 0.4);
  return x;
};
sfx.riser = () => {
  const len = 2.2;
  const x = noiseBuf(len);
  bandpass(x, (t) => 300 + 4000 * (t / len) ** 2, 3);
  return env(mix(x, osc(len, (t) => 150 * Math.pow(6, t / len), 'saw'), 0, 0.12), (t) => (t / len) ** 2);
};
sfx.gameOver = () => {
  const x = buf(1.6);
  [67, 64, 60, 55, 48].forEach((n, i) => mix(x, env(osc(0.3, midi(n), 'square'), adsr(0.005, 0.05, 0.7, 0.05)), i * 0.22, 0.4));
  return x;
};
sfx.pew = () => env(osc(0.25, (t) => 1600 * Math.exp(-t * 12) + 300, 'square'), expDecay(12));
sfx.beep = () => env(osc(0.18, 1046), adsr(0.005, 0.02, 0.8, 0.03));
sfx.rumbleBig = () => lowpass(env(mix(noiseBuf(3.5), osc(3.5, (t) => 32 + 6 * Math.sin(t * 5)), 0, 0.8), adsr(0.6, 0.5, 0.8, 1.2)), 220);
sfx.slam = () => mix(sfx.thud(), lowpass(env(noiseBuf(0.25), expDecay(25)), 1800), 0, 0.6);
sfx.crunch = () => {
  const x = buf(0.7);
  for (let t = 0; t < 0.55; t += 0.025 + rnd() * 0.03) mix(x, bandpass(env(noiseBuf(0.03), expDecay(140)), 1200 + rnd() * 2500, 2), t, 0.6);
  return x;
};

// ---------- ep01 MUSIC ----------
// Funny orchestral: pizzicato strings, bassoon-ish reed, glockenspiel, oom-pah.
const reed = (n, len) => env(lowpass(mix(osc(len, (t) => midi(n) * (1 + 0.006 * Math.sin(TAU * 5.5 * t)), 'square'), osc(len, midi(n) * 2, 'saw'), 0, 0.3), 1300), adsr(0.04, 0.1, 0.75, 0.08));
const glock = (n) => env(mix(osc(1.2, midi(n)), osc(1.2, midi(n) * 2.76), 0, 0.25), expDecay(4));
music.orchestral = () => {
  const ev = [];
  const roots = [48, 53, 55, 48, 45, 50, 55, 48];
  roots.forEach((r, bar) => {
    ev.push([bar * 4, () => pluck(midi(r - 12), 0.5, 0.25, 0.995), 0.5]);
    ev.push([bar * 4 + 2, () => pluck(midi(r - 5), 0.5, 0.25, 0.995), 0.45]);
    [1, 3].forEach((b) => ev.push([bar * 4 + b, () => mix(mix(pluck(midi(r + 4), 0.3, 0.4), pluck(midi(r + 7), 0.3, 0.4)), pluck(midi(r + 12), 0.3, 0.4)), 0.18]));
  });
  const mel = [[0, 64, 1], [1, 65, 0.5], [1.5, 67, 0.5], [2, 72, 1.5], [4, 71, 0.5], [4.5, 69, 0.5], [5, 67, 1], [6, 65, 2], [8, 64, 0.5], [8.5, 62, 0.5], [9, 60, 1], [10, 62, 0.5], [10.5, 64, 0.5], [11, 65, 1], [12, 67, 3], [16, 69, 1], [17, 67, 0.5], [17.5, 65, 0.5], [18, 64, 2], [20, 62, 1], [21, 64, 0.5], [21.5, 65, 0.5], [22, 67, 2], [24, 72, 0.5], [24.5, 71, 0.5], [25, 69, 0.5], [25.5, 67, 0.5], [26, 65, 1], [27, 64, 1], [28, 60, 3]];
  mel.forEach(([b, n, d]) => ev.push([b, (beat) => reed(n - 12, d * beat * 0.95), 0.22]));
  [3, 7, 11, 15, 19, 23, 27, 31].forEach((b, i) => ev.push([b + 0.5, () => glock(84 + [0, 4, 7, 4, 2, 5, 7, 12][i]), 0.1]));
  return sequence({bpm: 112, bars: 8}, ev, {reverb: 0.25});
};
// Dramatic action: string ostinato, brass stabs, taiko.
music.action = () => {
  const ev = [];
  const k = drumKit();
  const roots = [45, 45, 41, 43, 45, 45, 48, 44];
  const taiko = () => mix(env(osc(0.6, (t) => 90 * Math.exp(-t * 6) + 50), expDecay(6)), lowpass(env(noiseBuf(0.1), expDecay(40)), 600), 0, 0.5);
  roots.forEach((r, bar) => {
    for (let s = 0; s < 16; s++) {
      const n = r + (s % 4 === 2 ? 7 : s % 4 === 3 ? 12 : 0);
      ev.push([bar * 4 + s * 0.25, () => env(lowpass(mix(osc(0.14, midi(n - 12), 'saw'), osc(0.14, midi(n - 12) * 1.004, 'saw')), 1400), adsr(0.005, 0.04, 0.5, 0.03)), 0.2]);
    }
    [0, 1.5, 3].forEach((b) => ev.push([bar * 4 + b, taiko, 0.55]));
    ev.push([bar * 4 + 2, k.snare, 0.25]);
    if (bar % 2 === 1)
      [[0, r + 12], [0.75, r + 15], [1.5, r + 19]].forEach(([b, n]) =>
        ev.push([bar * 4 + 2 + b, () => env(lowpass(mix(mix(osc(0.5, midi(n), 'saw'), osc(0.5, midi(n) * 1.006, 'saw')), osc(0.5, midi(n + 7), 'saw'), 0, 0.5), (t) => 3500 * Math.exp(-t * 5) + 600), adsr(0.01, 0.15, 0.5, 0.1)), 0.14]),
      );
    if (bar === 7) ev.push([bar * 4, sfx.riser, 0.25]);
  });
  return sequence({bpm: 140, bars: 8}, ev, {reverb: 0.15});
};
// Eerie lab: drone + theremin + bubbly plinks.
music.lab = () => {
  const ev = [];
  for (let bar = 0; bar < 8; bar++) {
    ev.push([bar * 4, (b) => lowpass(env(mix(osc(b * 4, midi(33), 'saw'), osc(b * 4, midi(40) * 1.003, 'saw'), 0, 0.6), adsr(1, 0.5, 0.8, 1)), 500), 0.22]);
    const th = [76, 75, 79, 74, 76, 72, 71, 75][bar];
    ev.push([bar * 4 + 1, (b) => env(osc(b * 2.5, (t) => midi(th) * (1 + 0.012 * Math.sin(TAU * 6 * t)) * (t < 0.3 ? 0.97 + 0.1 * t : 1)), adsr(0.4, 0.3, 0.7, 0.6)), 0.08]);
    for (let p = 0; p < 3; p++) ev.push([bar * 4 + rnd() * 4, () => env(osc(0.3, (t) => 600 + 900 * t + rnd() * 400), expDecay(14)), 0.05]);
  }
  return sequence({bpm: 70, bars: 8}, ev, {reverb: 0.4});
};
// Victory fanfare loop: brass chords + timpani.
music.victory = () => {
  const ev = [];
  const brass = (n, len) => env(lowpass(mix(osc(len, midi(n), 'saw'), osc(len, midi(n) * 1.005, 'saw')), (t) => 1200 + 1600 * Math.min(1, t * 6)), adsr(0.03, 0.2, 0.7, 0.15));
  const chords = [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74], [72, 76, 79]];
  chords.forEach((ch, bar) => {
    ch.forEach((n) => ev.push([bar * 4, (b) => brass(n - 12, b * 1.6), 0.09]));
    ch.forEach((n) => ev.push([bar * 4 + 2, (b) => brass(n - 12, b * 1.6), 0.08]));
    ev.push([bar * 4, () => env(osc(0.8, (t) => midi(ch[0] - 24) * (1 + 0.1 * Math.exp(-t * 20))), expDecay(4)), 0.5]);
    ev.push([bar * 4 + 3.5, () => env(osc(0.4, midi(ch[0] - 24)), expDecay(8)), 0.3]);
  });
  [[0, 72], [1, 76], [1.5, 79], [2, 84], [8, 77], [9, 81], [10, 84], [16, 79], [17, 83], [18, 86], [24, 84], [26, 88], [28, 84]].forEach(([b, n]) => ev.push([b, (beat) => brass(n - 12, beat * 0.9), 0.12]));
  return sequence({bpm: 104, bars: 8}, ev, {reverb: 0.25});
};
// 8-bit chiptune for the in-game TV.
music.chiptune = () => {
  const ev = [];
  const sq = (n, len, shape = 'square') => env(osc(len, midi(n), shape), adsr(0.003, 0.03, 0.6, 0.02));
  const bass = [45, 45, 48, 43];
  for (let bar = 0; bar < 8; bar++) {
    for (let s = 0; s < 8; s++) ev.push([bar * 4 + s * 0.5, () => sq(bass[bar % 4] - 12 + (s % 2) * 12, 0.2, 'tri'), 0.3]);
    const arp = [69, 72, 76, 81];
    for (let s = 0; s < 16; s++) ev.push([bar * 4 + s * 0.25, () => sq(arp[s % 4] + (bar % 4 === 2 ? 3 : 0), 0.1), 0.06]);
  }
  return sequence({bpm: 150, bars: 8}, ev);
};
// Terrible supermarket muzak: electric piano bossa.
music.muzak = () => {
  const ev = [];
  const ep = (n, len) => {
    const out = buf(len);
    let ph = 0;
    for (let i = 0; i < out.length; i++) {
      const t = i / SR;
      ph += midi(n) / SR;
      out[i] = Math.sin(TAU * ph + 1.4 * Math.exp(-t * 6) * Math.sin(TAU * ph * 2)) * Math.exp(-t * 2.2);
    }
    return out;
  };
  const prog = [[62, 65, 69, 72], [55, 59, 62, 65], [60, 64, 67, 71], [57, 60, 64, 67]];
  for (let bar = 0; bar < 8; bar++) {
    const ch = prog[bar % 4];
    [0, 1.5, 3].forEach((b) => ch.forEach((n) => ev.push([bar * 4 + b, () => ep(n, 1.2), 0.05])));
    ev.push([bar * 4, () => env(osc(0.8, midi(ch[0] - 24), 'sine'), expDecay(3)), 0.35]);
    ev.push([bar * 4 + 2.5, () => env(osc(0.6, midi(ch[0] - 17), 'sine'), expDecay(3)), 0.3]);
    [0.5, 1, 2, 2.5, 3.5].forEach((b) => ev.push([bar * 4 + b, () => highpass(env(noiseBuf(0.05), expDecay(80)), 5000), 0.08]));
  }
  return sequence({bpm: 100, bars: 8}, ev, {reverb: 0.2});
};

// ---------- write everything ----------
const lib = {sfx: {}, music: {}};
for (const [group, table] of [['sfx', sfx], ['music', music]]) {
  const dir = path.join('public', group);
  fs.mkdirSync(dir, {recursive: true});
  for (const [name, make] of Object.entries(table)) {
    let x = make();
    if (group === 'sfx') x = normalize(fades(x), 0.85);
    writeWav(path.join(dir, `${name}.wav`), x);
    lib[group][name] = {file: `${group}/${name}.wav`, duration: Math.round((x.length / SR) * 1000) / 1000};
    console.log(`${group}/${name}.wav  ${(x.length / SR).toFixed(2)}s`);
  }
}
fs.mkdirSync('src/generated', {recursive: true});
fs.writeFileSync('src/generated/audio-library.json', JSON.stringify(lib, null, 2));
console.log('wrote src/generated/audio-library.json');
