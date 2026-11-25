import {buildEpisode, chapters} from '../../src/engine/episode';
import {getEpisode} from '../../src/episodes/registry';
const id = process.argv[2];
const ep = buildEpisode(getEpisode(id));
console.log('duration', (ep.duration / 30).toFixed(1));
console.log(chapters(ep).join('\n'));
if (process.argv[3] === 'lines') for (const l of ep.global.lines) console.log(l.id, (l.start / 30).toFixed(2), (l.end / 30).toFixed(2), l.text.slice(0, 50));
