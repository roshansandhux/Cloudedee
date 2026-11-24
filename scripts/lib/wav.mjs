// Tiny WAV helpers (16-bit PCM). Used by the audio generator and the voice importer.
import fs from 'node:fs';

export const SR = 44100;

/** Write mono or stereo Float32 data (-1..1) as a 16-bit PCM WAV. */
export function writeWav(file, channels, sampleRate = SR) {
  const chans = Array.isArray(channels) ? channels : [channels];
  const n = chans[0].length;
  const nc = chans.length;
  const buf = Buffer.alloc(44 + n * nc * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * nc * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(nc, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * nc * 2, 28);
  buf.writeUInt16LE(nc * 2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * nc * 2, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < nc; c++) {
      const v = Math.max(-1, Math.min(1, chans[c][i]));
      buf.writeInt16LE(Math.round(v * 32767), o);
      o += 2;
    }
  }
  fs.writeFileSync(file, buf);
}

/** Read a 16-bit PCM WAV, return {sampleRate, data: Float32Array (first channel)}. */
export function readWav(file) {
  const b = fs.readFileSync(file);
  let p = 12;
  let fmt = null;
  while (p < b.length) {
    const id = b.toString('ascii', p, p + 4);
    const size = b.readUInt32LE(p + 4);
    if (id === 'fmt ') {
      fmt = {nc: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22)};
    } else if (id === 'data') {
      if (!fmt || fmt.bits !== 16) throw new Error(`${file}: need 16-bit PCM`);
      const frames = size / (2 * fmt.nc);
      const out = new Float32Array(frames);
      for (let i = 0; i < frames; i++) out[i] = b.readInt16LE(p + 8 + i * 2 * fmt.nc) / 32768;
      return {sampleRate: fmt.sr, data: out};
    }
    p += 8 + size + (size % 2);
  }
  throw new Error(`${file}: no data chunk`);
}
