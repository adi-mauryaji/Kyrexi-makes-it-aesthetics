#!/usr/bin/env node
// Extract a palette from reference images (screenshots, photos the user gave) using real pixels.
// Node >= 22 built-ins and Chrome or Chromium; no npm packages. Pixels are clustered in OKLab
// (k-means, deterministic start), so the colours reflect what a person sees.
//
// Usage: node palette.mjs <image> [image ...] [--k 6] [--json] [--chrome PATH]
// Prints, per image and for all images together: colours by share (hex, %, OKLCH, contrast with
// white and black) and suggested roles (dominant, support, accent). Use them as a starting point
// for art direction, then check text pairs with contrast.py.
// Manual path: sample colours with any eyedropper and record their share by eye.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const VALUE_FLAGS = ['--k', '--chrome'];
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const files = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && VALUE_FLAGS.includes(args[i - 1])));
const K = Math.max(2, Math.min(12, Number(opt('--k', '6'))));
if (!files.length) { console.error('usage: node palette.mjs <image> [image ...] [--k 6] [--json]'); process.exit(2); }
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const explicit = opt('--chrome', process.env.CHROME_PATH);
  if (explicit) return explicit;
  for (const n of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'])
    for (const d of (process.env.PATH || '').split(path.delimiter)) if (existsSync(path.join(d, n))) return path.join(d, n);
  return ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(existsSync);
}

// Runs in the page: decode the image, sample pixels, cluster in OKLab, return clusters.
const IN_PAGE = String(async function cluster(dataUrls, K) {
  const toLin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const oklab = (r, g, b) => {
    const R = toLin(r), G = toLin(g), B = toLin(b);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  };
  const sample = async (url) => {
    const img = new Image(); img.src = url; await img.decode();
    const scale = Math.min(1, 200 / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale)), h = Math.max(1, Math.round(img.naturalHeight * scale));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data, px = [];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] >= 128) px.push([d[i], d[i + 1], d[i + 2]]);
    return px;
  };
  const kmeans = (px) => {
    const lab = px.map(([r, g, b]) => oklab(r, g, b));
    const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    // Deterministic farthest-point start from the mean colour.
    const mean = [0, 1, 2].map((j) => lab.reduce((s, p) => s + p[j], 0) / lab.length);
    const cents = [lab.reduce((best, p) => (dist(p, mean) < dist(best, mean) ? p : best), lab[0])];
    while (cents.length < Math.min(K, lab.length)) {
      let far = lab[0], fd = -1;
      for (const p of lab) { const dd = Math.min(...cents.map((c) => dist(p, c))); if (dd > fd) { fd = dd; far = p; } }
      if (fd <= 1e-6) break;
      cents.push(far);
    }
    let assign = new Array(lab.length).fill(0);
    for (let it = 0; it < 14; it++) {
      assign = lab.map((p) => { let bi = 0, bd = Infinity; cents.forEach((c, i) => { const dd = dist(p, c); if (dd < bd) { bd = dd; bi = i; } }); return bi; });
      cents.forEach((_, i) => { const mem = lab.filter((_, j) => assign[j] === i); if (mem.length) cents[i] = [0, 1, 2].map((k) => mem.reduce((s, p) => s + p[k], 0) / mem.length); });
    }
    return cents.map((c, i) => {
      const idx = assign.map((a, j) => (a === i ? j : -1)).filter((j) => j >= 0);
      if (!idx.length) return null;
      const rgb = [0, 1, 2].map((k) => Math.round(idx.reduce((s, j) => s + px[j][k], 0) / idx.length));
      return { rgb, lab: c, share: idx.length / px.length };
    }).filter(Boolean).sort((a, b) => b.share - a.share);
  };
  const per = [], all = [];
  for (const u of dataUrls) { const px = await sample(u); per.push(kmeans(px)); all.push(...px); }
  return { per, all: dataUrls.length > 1 ? kmeans(all) : null };
});

const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
function describe(clusters) {
  const colours = clusters.map(({ rgb, lab, share }) => {
    const C = Math.hypot(lab[1], lab[2]); const h = (Math.atan2(lab[2], lab[1]) * 180 / Math.PI + 360) % 360;
    return { hex: hex(rgb), share: Math.round(share * 1000) / 10, oklch: [+lab[0].toFixed(3), +C.toFixed(3), +h.toFixed(0)],
      onWhite: +ratio(rgb, [255, 255, 255]).toFixed(2), onBlack: +ratio(rgb, [0, 0, 0]).toFixed(2) };
  });
  const dominant = colours[0];
  const support = colours.slice(1).find((c) => Math.abs(c.oklch[0] - dominant.oklch[0]) > 0.15) || colours[1];
  const accent = colours.filter((c) => c.share >= 3 && c !== dominant && c !== support).sort((a, b) => b.oklch[1] - a.oklch[1])[0];
  return { colours, roles: { dominant: dominant?.hex, support: support?.hex, accent: accent?.hex } };
}

const chrome = findChrome();
if (!chrome) { console.error('Chrome/Chromium not found. Pass --chrome PATH, or sample colours by hand (see the header).'); process.exit(2); }
const urls = [];
for (const f of files) {
  const mime = MIME[path.extname(f).toLowerCase()];
  if (!mime) { console.error(`unsupported image type: ${f}`); process.exit(2); }
  urls.push(`data:${mime};base64,${(await readFile(f)).toString('base64')}`);
}
const profile = await mkdtemp(path.join(tmpdir(), 'kyrexi-palette-'));
const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let result;
try {
  const pf = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 150 && !existsSync(pf); i++) await sleep(100);
  const [port] = (await readFile(pf, 'utf8')).trim().split('\n');
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pend = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const r = await send('Runtime.evaluate', { expression: `(${IN_PAGE})(${JSON.stringify(urls)}, ${K})`, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails || !r.result?.result) throw new Error(r.result?.exceptionDetails?.exception?.description || 'could not read the image');
  result = r.result.result.value;
  ws.close();
} finally {
  proc.kill(); await sleep(200); await rm(profile, { recursive: true, force: true, maxRetries: 5 });
}
const out = { images: files.map((f, i) => ({ file: f, ...describe(result.per[i]) })), combined: result.all ? describe(result.all) : null };
if (args.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
const print = (title, d) => {
  console.log(title);
  for (const c of d.colours) console.log(`  ${c.hex}  ${String(c.share).padStart(5)}%  oklch(${c.oklch.join(' ')})  vs white ${c.onWhite}:1  vs black ${c.onBlack}:1`);
  console.log(`  roles: dominant ${d.roles.dominant} · support ${d.roles.support} · accent ${d.roles.accent || '—'}`);
};
for (const im of out.images) print(im.file, im);
if (out.combined) print('all images', out.combined);
