// Prints an episode's chapters (YouTube timestamps) and, with "lines", every line's start/end in seconds.
//   node scripts/timings.mjs fin02 [lines]
import {buildSync} from 'esbuild';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
fs.mkdirSync('node_modules/.cache', {recursive: true});
const out = path.resolve('node_modules/.cache/timings.cjs');
buildSync({entryPoints: ['scripts/lib/timings-entry.ts'], bundle: true, platform: 'node', outfile: out, format: 'cjs', logLevel: 'error', loader: {'.tsx': 'tsx'}, external: ['remotion', 'react', 'react-dom', '@remotion/*', 'three', '@react-three/*']});
process.stdout.write(execFileSync('node', [out, ...process.argv.slice(2)]));
