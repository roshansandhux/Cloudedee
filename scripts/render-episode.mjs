// Renders an episode (or short) to MP4.  Usage: npm run render -- ep01   →  out/ep01.mp4
import fs from 'node:fs';
import path from 'node:path';
import {ffmpeg, ffmpegCapture} from './lib/ffmpeg.mjs';
import {bundle} from '@remotion/bundler';
import {browserExecutable} from './lib/browser.mjs';
import {renderMedia, selectComposition} from '@remotion/renderer';

const id = process.argv[2];
if (!id) {
  console.error('Usage: npm run render -- <composition-id>');
  process.exit(1);
}
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), onProgress: () => {}});
const composition = await selectComposition({serveUrl, id, browserExecutable});
const outputLocation = path.join('out', `${id}.raw.mp4`);
const finalLocation = path.join('out', `${id}.mp4`);
let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  crf: 18,
  audioBitrate: '192k',
  outputLocation,
  browserExecutable, chromiumOptions: {gl: 'swangle'},
  onProgress: ({progress}) => {
    const p = Math.floor(progress * 100);
    if (p !== last && p % 5 === 0) {
      last = p;
      console.log(`${p}%`);
    }
  },
});
// Mastering: two-pass loudness normalisation to YouTube's -14 LUFS (video stream is copied untouched).
console.log('mastering audio to -14 LUFS...');
const target = 'I=-14:TP=-1.5:LRA=11';
const log = ffmpegCapture(['-i', outputLocation, '-vn', '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-']);
const m = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1));
const second = `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=false`;
ffmpeg(['-i', outputLocation, '-c:v', 'copy', '-af', second, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', finalLocation]);
fs.rmSync(outputLocation);
console.log(`done: ${finalLocation}  (input loudness was ${m.input_i} LUFS)`);
