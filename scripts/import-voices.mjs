// Usage: npm run voices:import -- ep01
// 1. reads episodes/<ep>/downloads.json  ({ "lineId": "https://...content_url" })
// 2. downloads each clip with curl into episodes/<ep>/raw/ (skips ones already downloaded)
// 3. converts to mono 44.1 kHz 16-bit WAV in public/voices/<ep>/<lineId>.wav
// 4. writes src/generated/voices/<ep>.json with duration + per-frame loudness (for lip-sync)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {ffmpeg} from './lib/ffmpeg.mjs';
import {readWav} from './lib/wav.mjs';

const FPS = 30;
const ep = process.argv[2];
if (!ep) {
  console.error('Usage: npm run voices:import -- <episode-id>  (e.g. ep01)');
  process.exit(1);
}
const epDir = path.join('episodes', ep);
const downloads = JSON.parse(fs.readFileSync(path.join(epDir, 'downloads.json'), 'utf8'));
const rawDir = path.join(epDir, 'raw');
const outDir = path.join('public', 'voices', ep);
const manifestFile = path.join('src', 'generated', 'voices', `${ep}.json`);
fs.mkdirSync(rawDir, {recursive: true});
fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(path.dirname(manifestFile), {recursive: true});

const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};

/** Per-frame loudness 0..100, normalised to the clip's own loud parts, smoothed for nice mouth shapes. */
function envelope(data, sr) {
  const hop = sr / FPS;
  const frames = Math.ceil(data.length / hop);
  const rms = [];
  for (let f = 0; f < frames; f++) {
    const s = Math.floor(f * hop);
    const e = Math.min(data.length, Math.floor((f + 1) * hop));
    let sum = 0;
    for (let i = s; i < e; i++) sum += data[i] * data[i];
    rms.push(Math.sqrt(sum / Math.max(1, e - s)));
  }
  const sorted = [...rms].sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
  const gate = ref * 0.12;
  const out = [];
  let prev = 0;
  for (const v of rms) {
    let x = v < gate ? 0 : Math.min(1, (v - gate) / (ref - gate));
    x = Math.pow(x, 0.7);
    // fast attack, slower release
    prev = x > prev ? x : prev * 0.55 + x * 0.45;
    out.push(Math.round(prev * 100));
  }
  return out;
}

/** Trim leading/trailing silence info (seconds) so timing can ignore dead air. */
function trimInfo(data, sr) {
  const th = 0.01;
  let a = 0;
  while (a < data.length && Math.abs(data[a]) < th) a++;
  let b = data.length - 1;
  while (b > a && Math.abs(data[b]) < th) b--;
  return {lead: a / sr, tail: (data.length - 1 - b) / sr};
}

for (const [id, url] of Object.entries(downloads)) {
  if (!url) continue;
  const raw = path.join(rawDir, `${id}.mp3`);
  const wav = path.join(outDir, `${id}.wav`);
  if (!fs.existsSync(raw)) {
    console.log(`downloading ${id}`);
    execFileSync('curl', ['-sSL', '--fail', '--retry', '3', '-o', raw, url], {stdio: 'inherit'});
  }
  // mono, 44.1 kHz, loudness-matched so every character sits at the same level
  ffmpeg(['-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', wav]);
  const {sampleRate, data} = readWav(wav);
  const duration = data.length / sampleRate;
  manifest[id] = {
    file: `voices/${ep}/${id}.wav`,
    duration: Math.round(duration * 1000) / 1000,
    ...Object.fromEntries(Object.entries(trimInfo(data, sampleRate)).map(([k, v]) => [k, Math.round(v * 1000) / 1000])),
    env: envelope(data, sampleRate),
  };
  console.log(`  ${id}: ${duration.toFixed(2)}s`);
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest));
console.log(`wrote ${manifestFile} (${Object.keys(manifest).length} lines)`);
