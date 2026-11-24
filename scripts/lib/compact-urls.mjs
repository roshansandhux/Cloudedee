// Expands "session gen signature expires" lines (episodes/<ep>/urls.compact) into full content URLs (urls.txt).
import fs from 'node:fs';
const ep = process.argv[2];
const WS = '99bac0937de04f0796990ffaf5108358';
const lines = fs.readFileSync(`episodes/${ep}/urls.compact`, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const urls = lines.map((l) => {
  const [s, g, sig, exp] = l.split(/\s+/);
  return `https://elevenlabsusercontent.com/database/workspace/${WS}/content_generation/${s}/${g}/content.mp3?Expires=${exp}&KeyName=assets-cdn-key-1&Signature=${sig}`;
});
fs.writeFileSync(`episodes/${ep}/urls.txt`, urls.join('\n') + '\n');
console.log(`${urls.length} urls`);
