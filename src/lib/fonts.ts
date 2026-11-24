import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

let loaded = false;
export function ensureFonts() {
  if (loaded) return;
  loaded = true;
  for (const weight of ['500', '600', '700']) {
    loadFont({family: 'Fredoka', url: staticFile(`fonts/fredoka-latin-${weight}-normal.woff2`), weight}).catch((e) => console.error(e));
  }
}
