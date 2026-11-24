// Renders still frames so scenes can be checked before the full render.
// Usage:
//   npm run stills -- ep01                    (one frame every 2 s + a contact sheet)
//   npm run stills -- ep01 --every 1          (every second)
//   npm run stills -- ep01 --frames 10,250,900
//   npm run stills -- ep01 --from 30 --to 60  (seconds range)
//   npm run stills -- RigSheet-testA          (a Still composition)
// Output: out/stills/<id>/f<frame>.png and out/stills/<id>/contact.jpg
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {browserExecutable} from './lib/browser.mjs';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';

const args = process.argv.slice(2);
const id = args[0];
if (!id) {
  console.error('Usage: npm run stills -- <composition-id> [--every 2] [--frames 1,2,3] [--from s --to s] [--scale 0.5]');
  process.exit(1);
}
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), onProgress: () => {}});
const composition = await selectComposition({serveUrl, id, browserExecutable});
const fps = composition.fps;
let frames;
if (opt('frames')) frames = opt('frames').split(',').map(Number);
else {
  const every = Number(opt('every', 2)) * fps;
  const from = Math.round(Number(opt('from', 0)) * fps);
  const to = Math.min(composition.durationInFrames - 1, Math.round(Number(opt('to', composition.durationInFrames / fps)) * fps));
  frames = [];
  for (let f = from; f <= to; f += every) frames.push(Math.round(f));
}
frames = frames.filter((f) => f < composition.durationInFrames);
const outDir = path.join('out', 'stills', id);
fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});
const scale = Number(opt('scale', 0.5));
for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(5, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame, scale, browserExecutable, chromiumOptions: {gl: 'swangle'}});
  process.stdout.write(`.`);
}
console.log(`\n${frames.length} stills in ${outDir}`);
if (frames.length > 1) {
  // contact sheet needs a full ffmpeg (the one bundled with Remotion has no "tile" filter)
  const cols = composition.width >= composition.height ? 4 : 6;
  const sheet = path.join(outDir, 'contact.jpg');
  try {
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(outDir, 'f*.png'), '-vf', `scale=${composition.width >= composition.height ? 480 : 270}:-1,tile=${cols}x${Math.ceil(frames.length / cols)}:padding=6:color=white`, '-frames:v', '1', '-q:v', '3', sheet], {stdio: 'inherit'});
    console.log(`contact sheet: ${sheet}`);
  } catch {
    console.log('(no system ffmpeg with "tile" filter – skipped contact sheet; the single frames are there)');
  }
}
