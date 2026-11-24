// Finds the ffmpeg that ships inside node_modules/@remotion/compositor-* (no system install needed).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';

export function ffmpegPath() {
  const base = path.resolve('node_modules/@remotion');
  const dirs = fs.readdirSync(base).filter((d) => d.startsWith('compositor-'));
  for (const d of dirs) {
    const bin = path.join(base, d, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
    if (fs.existsSync(bin)) {
      try {
        execFileSync(bin, ['-version'], {stdio: 'ignore', env: envFor(bin)});
        return bin;
      } catch {}
    }
  }
  throw new Error('No working ffmpeg found in node_modules/@remotion/compositor-*');
}

export function envFor(bin) {
  const dir = path.dirname(bin);
  return {...process.env, LD_LIBRARY_PATH: [dir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'), DYLD_LIBRARY_PATH: dir};
}

export function ffmpeg(args) {
  const bin = ffmpegPath();
  execFileSync(bin, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: ['ignore', 'inherit', 'inherit'], env: envFor(bin)});
}

/** Run ffmpeg and return its log output (stderr) – used for measurement passes. */
export function ffmpegCapture(args) {
  const bin = ffmpegPath();
  const r = spawnSync(bin, ['-hide_banner', '-y', ...args], {env: envFor(bin), maxBuffer: 64 * 1024 * 1024});
  return String(r.stderr ?? '');
}
