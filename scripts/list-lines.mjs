// Lists every spoken line of an episode with its voice, and estimates the ElevenLabs cost.
// Usage: npm run lines -- ep01
// Reads src/episodes/<ep>/script.ts (say('id','who','text') / narrate('id','text') calls),
// writes episodes/<ep>/lines.json and shows which lines still need audio.
import fs from 'node:fs';
import path from 'node:path';

const ep = process.argv[2];
if (!ep) {
  console.error('Usage: npm run lines -- <episode-id>');
  process.exit(1);
}
const src = fs.readFileSync(path.join('src', 'episodes', ep, 'script.ts'), 'utf8');
const cast = JSON.parse(fs.readFileSync('src/cast.json', 'utf8'));
const manifestFile = path.join('src', 'generated', 'voices', `${ep}.json`);
const have = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};

// string literal: '...', "..." or `...` (escaped quotes allowed)
const str = String.raw`('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\x60(?:[^\x60\\]|\\.)*\x60)`;
const re = new RegExp(String.raw`\b(say|narrate)\(\s*` + str + String.raw`\s*,\s*` + str + String.raw`(?:\s*,\s*` + str + ')?', 'g');
const unq = (s) => (s ? s.slice(1, -1).replace(/\\(.)/g, '$1') : s);

const lines = [];
for (const m of src.matchAll(re)) {
  const kind = m[1];
  const id = unq(m[2]);
  const who = kind === 'narrate' ? 'narrator' : unq(m[3]);
  const text = kind === 'narrate' ? unq(m[3]) : unq(m[4]);
  const c = cast[who];
  lines.push({id, who, voice: c?.voice ?? '??', voice_id: c?.voice_id ?? '', text, chars: text.length, hasAudio: !!have[id]});
}
const ids = new Set();
for (const l of lines) {
  if (ids.has(l.id)) console.error(`!! duplicate line id ${l.id}`);
  ids.add(l.id);
  if (!l.voice_id) console.error(`!! no voice_id for "${l.who}" (line ${l.id}) – add them to src/cast.json`);
}
fs.mkdirSync(path.join('episodes', ep), {recursive: true});
fs.writeFileSync(path.join('episodes', ep, 'lines.json'), JSON.stringify(lines, null, 2));

const todo = lines.filter((l) => !l.hasAudio);
for (const l of lines) console.log(`${l.hasAudio ? '✓' : '·'} ${l.id.padEnd(6)} ${l.who.padEnd(12)} ${l.text}`);
const chars = todo.reduce((a, l) => a + l.chars, 0);
console.log(`\n${lines.length} lines, ${todo.length} still need audio ≈ ${chars} characters ≈ ${chars} credits (eleven_v4 ≈ 1 credit/char)`);
