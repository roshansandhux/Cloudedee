// Use a pre-installed headless Chrome if one exists (cloud containers); otherwise Remotion downloads its own.
import fs from 'node:fs';

const CANDIDATES = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
  '/opt/pw-browsers/headless_shell_as_downloaded/chrome-headless-shell',
].filter(Boolean);

export const browserExecutable = CANDIDATES.find((p) => fs.existsSync(p)) ?? null;
