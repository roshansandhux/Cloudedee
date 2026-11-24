// Procedural textures & shared materials for the 3D look (everything generated in code – no image files).
import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTex(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, repeat?: [number, number]) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  draw(g, rng(key.length * 7919 + w));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  cache.set(key, t);
  return t;
}

/** Warm oak floorboards with grain and per-plank tone variation. */
export const woodFloor = () =>
  canvasTex(
    'wood',
    1024,
    1024,
    (g, r) => {
      const planks = 8;
      const ph = 1024 / planks;
      for (let i = 0; i < planks; i++) {
        let x = -r() * 400;
        while (x < 1024) {
          const len = 380 + r() * 300;
          const base = 150 + r() * 40;
          g.fillStyle = `rgb(${base + 40},${base - 10},${base - 60})`;
          g.fillRect(x, i * ph, len, ph);
          // grain
          for (let k = 0; k < 40; k++) {
            g.strokeStyle = `rgba(80,40,10,${0.05 + r() * 0.08})`;
            g.lineWidth = 1 + r() * 2;
            g.beginPath();
            const y = i * ph + r() * ph;
            g.moveTo(x, y);
            g.bezierCurveTo(x + len * 0.3, y + (r() - 0.5) * 10, x + len * 0.6, y + (r() - 0.5) * 10, x + len, y + (r() - 0.5) * 6);
            g.stroke();
          }
          g.fillStyle = 'rgba(40,20,5,0.55)';
          g.fillRect(x, i * ph, 3, ph);
          x += len;
        }
        g.fillStyle = 'rgba(40,20,5,0.6)';
        g.fillRect(0, i * ph, 1024, 3);
      }
    },
    [3, 3],
  );

/** Soft painted plaster wall with faint vertical wallpaper stripes. */
export const wallPaper = () =>
  canvasTex(
    'wall',
    512,
    512,
    (g, r) => {
      g.fillStyle = '#e6c9a5';
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 8; i++) {
        g.fillStyle = 'rgba(160,110,70,0.07)';
        g.fillRect(i * 64, 0, 22, 512);
      }
      for (let i = 0; i < 3000; i++) {
        g.fillStyle = `rgba(${r() > 0.5 ? 255 : 120},${r() > 0.5 ? 220 : 90},${180},0.03)`;
        g.fillRect(r() * 512, r() * 512, 2, 2);
      }
    },
    [4, 2],
  );

/** Knitted / woven fabric bump for couch & clothes. */
export const fabricBump = () =>
  canvasTex(
    'fabric',
    256,
    256,
    (g, r) => {
      g.fillStyle = '#808080';
      g.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 4)
        for (let x = 0; x < 256; x += 4) {
          const v = 110 + ((x + y) % 8 === 0 ? 40 : 0) + r() * 30;
          g.fillStyle = `rgb(${v},${v},${v})`;
          g.fillRect(x, y, 3, 3);
        }
    },
    [6, 6],
  );

/** Poster art: drawn in code. */
export const posterTex = () =>
  canvasTex('poster', 512, 720, (g) => {
    const grd = g.createLinearGradient(0, 0, 0, 720);
    grd.addColorStop(0, '#1d2a1f');
    grd.addColorStop(1, '#0b0f0c');
    g.fillStyle = grd;
    g.fillRect(0, 0, 512, 720);
    g.fillStyle = '#7cff8a';
    g.font = 'bold 96px sans-serif';
    g.textAlign = 'center';
    g.fillText('DEAD', 256, 160);
    g.fillText('ZONE 7', 256, 260);
    g.fillStyle = '#9fb59a';
    g.beginPath();
    g.arc(256, 470, 140, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#fff';
    g.beginPath();
    g.arc(205, 445, 34, 0, Math.PI * 2);
    g.arc(310, 455, 44, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#111';
    g.beginPath();
    g.arc(210, 450, 10, 0, Math.PI * 2);
    g.arc(305, 460, 12, 0, Math.PI * 2);
    g.fill();
  });

export const pizzaLidTex = () =>
  canvasTex('pizza', 256, 256, (g) => {
    g.fillStyle = '#e9d6aa';
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#c0392b';
    g.lineWidth = 10;
    g.beginPath();
    g.arc(128, 128, 80, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = '#c0392b';
    g.font = 'bold 40px sans-serif';
    g.textAlign = 'center';
    g.fillText('PIZZA', 128, 142);
  });

/** TV screen: animated news-ish glow (redrawn per frame by caller). */
export function tvScreen(canvas: HTMLCanvasElement, frame: number) {
  const g = canvas.getContext('2d')!;
  g.fillStyle = '#20305a';
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.fillStyle = '#c0392b';
  g.fillRect(0, canvas.height * 0.78, canvas.width, canvas.height * 0.22);
  g.fillStyle = '#fff';
  g.font = `bold ${canvas.height * 0.12}px sans-serif`;
  g.fillText('BREAKING: DO NOT EAT THE BREAD  •  STAY INDOORS  •', canvas.width - ((frame * 6) % (canvas.width * 2.4)), canvas.height * 0.93);
  g.fillStyle = '#f6c945';
  g.beginPath();
  g.arc(canvas.width * 0.3, canvas.height * 0.4, canvas.height * 0.18, 0, Math.PI * 2);
  g.fill();
}
