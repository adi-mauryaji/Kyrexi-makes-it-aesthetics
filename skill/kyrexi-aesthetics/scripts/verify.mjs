#!/usr/bin/env node
// Render a page in headless Chrome at several widths and check WCAG-floor issues.
// Needs Node >= 22 (built-in WebSocket) and Chrome or Chromium. No npm packages.
//
// Usage:
//   node verify.mjs <file.html | http(s)://url> [--out DIR] [--root DIR] [--widths 320,375,768,1280,1440] [--chrome PATH] [--font-budget-kb 150] [--motion]
// --motion adds a motion review (scripts/motion.mjs): intro and scroll film-strips in motion-sheet.png, a motion/motion.html
// flipbook, frame timing on a 4x slower CPU, animated properties, scroll-linked elements, reduced-motion leaks.
// A local file is served over localhost from its folder (or --root), so it behaves as when hosted.
//
// Writes DIR/report.json, DIR/<width>.png (full page) and DIR/text.txt (visible text at the widest width). Exit code 1 when a blocker is found.
// Blockers: text contrast below WCAG 2.2 AA, horizontal overflow, console errors, missing
// <html lang>, <img> without alt, unlabelled form fields, infinite or text-hiding animation
// under prefers-reduced-motion. Warnings: targets under 24x24 CSS px (check the spacing
// exception by eye), text over images (contrast not computable), heading-order gaps, and
// deceptive-pattern hints: pre-ticked checkboxes, accept/decline pairs that differ in size,
// fill or text size, consent prompts without a reject option, text that changes on its own.
// Automated checks find only part of real accessibility barriers and dark patterns; keep the manual review.

import { spawn } from 'node:child_process';
import { createReadStream, existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { motionFindings, motionSummary, runMotion } from './motion.mjs';

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
};
const VALUE_FLAGS = ['--out', '--root', '--widths', '--chrome', '--font-budget-kb'];
const target = args.find((a, i) => !a.startsWith('--') && !(i > 0 && VALUE_FLAGS.includes(args[i - 1])));
const wantMotion = args.includes('--motion');
if (!target) {
  console.error('usage: node verify.mjs <file.html | url> [--out DIR] [--widths 320,375,768,1280,1440] [--chrome PATH]');
  process.exit(2);
}
const outDir = path.resolve(opt('--out', 'verify-output'));

// A local page is served over localhost, so it behaves as when hosted (font preloads, favicon
// requests, fetch and video range requests all work as on a real server). --root sets the folder
// served (default: the page's own folder).
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.ics': 'text/calendar', '.pdf': 'application/pdf' };
let server = null;
let url = target;
if (!/^https?:\/\//.test(target)) {
  const file = path.resolve(target);
  const root = path.resolve(opt('--root', path.dirname(file)));
  server = createServer(async (req, res) => {
    const rel = decodeURIComponent((req.url || '/').split('?')[0]);
    let p = path.join(root, rel);
    if (p !== root && !p.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try {
      let st = await stat(p);
      if (st.isDirectory()) { p = path.join(p, 'index.html'); st = await stat(p); }
      const type = MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';
      const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
      if (m) {
        const start = m[1] ? Number(m[1]) : Math.max(0, st.size - Number(m[2]));
        const end = m[1] && m[2] ? Math.min(Number(m[2]), st.size - 1) : st.size - 1;
        res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
        createReadStream(p, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' });
        createReadStream(p).pipe(res);
      }
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  url = `http://127.0.0.1:${server.address().port}/${path.relative(root, file).split(path.sep).map(encodeURIComponent).join('/')}`;
}
const widths = opt('--widths', '320,375,768,1280,1440').split(',').map(Number);
const fontBudgetKb = Number(opt('--font-budget-kb', '150'));

function findChrome() {
  const explicit = opt('--chrome', process.env.CHROME_PATH);
  if (explicit) return explicit;
  const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'];
  const dirs = (process.env.PATH || '').split(path.delimiter);
  for (const n of names) for (const d of dirs) {
    const p = path.join(d, n);
    if (existsSync(p)) return p;
  }
  const fixed = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  return fixed.find(existsSync);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch(chromePath) {
  const profile = await mkdtemp(path.join(tmpdir(), 'kyrexi-verify-'));
  const proc = spawn(chromePath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 150 && !existsSync(portFile); i++) await sleep(100);
  if (!existsSync(portFile)) throw new Error('Chrome did not start (no DevToolsActivePort)');
  const [port, wsPath] = (await readFile(portFile, 'utf8')).trim().split('\n');
  const ws = new WebSocket(`ws://127.0.0.1:${port}${wsPath}`);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(`${msg.error.message}`)) : resolve(msg.result);
    } else if (msg.method) {
      for (const l of listeners) l(msg);
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const close = async () => {
    try { await send('Browser.close'); } catch { /* already closing */ }
    ws.close();
    proc.kill();
    await sleep(300);
    await rm(profile, { recursive: true, force: true, maxRetries: 5 });
  };
  return { send, listeners, close };
}

// Runs inside the page. Returns plain data only.
const PAGE_CHECKS = String(async function pageChecks(opts) {
  // Count running animations, then settle the finite ones so colours are measured at rest.
  const anims = document.getAnimations ? document.getAnimations().filter((a) => a.playState === 'running') : [];
  const infinite = anims.filter((a) => a.effect && a.effect.getComputedTiming().iterations === Infinity).length;
  for (const a of anims) {
    if (a.effect && a.effect.getComputedTiming().iterations !== Infinity) { try { a.finish(); } catch { /* not finishable */ } }
  }
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000';
    cx.fillStyle = c;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (top, under) => [0, 1, 2].map((i) => top[3] * top[i] + (1 - top[3]) * under[i]);
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const visible = (el) => {
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0;
  };
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.');
    return s;
  };
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
  const effectiveOpacity = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };

  // Colours inside gradients, as Chrome serialises them in computed styles.
  const COLOR_RE = /(rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|lab\([^)]*\)|lch\([^)]*\)|color\([^)]*\)|#[0-9a-fA-F]{3,8}\b|transparent)/g;
  // A gradient counts as a background only if it is sized to cover the box (not an underline strip).
  const coversBox = (s, e) => {
    const r = e.getBoundingClientRect();
    const size = s.backgroundSize.split(',')[0].trim().split(/\s+/);
    const ok = (tok, dim) => ['auto', 'cover', 'contain'].includes(tok) || (tok.endsWith('%') && parseFloat(tok) >= 50) || (tok.endsWith('px') && parseFloat(tok) >= dim * 0.5);
    return ok(size[0], r.width) && ok(size[1] || 'auto', r.height);
  };
  const contrastFails = [];
  let textOverImage = 0;
  let clipText = 0;
  let hiddenText = 0;
  const seen = new Set();
  for (const el of document.body.querySelectorAll('*')) {
    const text = ownText(el);
    if (!text || !visible(el)) continue;
    const opacity = effectiveOpacity(el);
    if (opacity < 0.05) { hiddenText++; continue; }
    const cs = getComputedStyle(el);
    // Ink: text fill, or the outline colour for transparent-fill outlined text.
    let ink = rgba(cs.webkitTextFillColor || cs.color);
    if (ink[3] === 0) {
      if ((parseFloat(cs.webkitTextStrokeWidth) || 0) > 0) ink = rgba(cs.webkitTextStrokeColor);
      else if ((cs.backgroundClip || cs.webkitBackgroundClip) === 'text') { clipText++; continue; }
      else continue;
    }
    ink[3] *= opacity;
    // Background layers from the element upwards, until an opaque colour or an image.
    const layers = [];
    let image = false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== 'none') {
        if (/url\(/.test(s.backgroundImage)) { image = true; break; }
        const stops = (s.backgroundImage.match(COLOR_RE) || []).map(rgba);
        if (stops.length && coversBox(s, e)) layers.push({ stops });
      }
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) layers.push({ stops: [c] });
      if (c[3] >= 1) break;
    }
    if (image) { textOverImage++; continue; }
    // Every combination of gradient stops gives a candidate background; check the worst.
    let candidates = [[255, 255, 255]];
    for (const layer of layers.reverse()) {
      candidates = candidates.flatMap((b) => layer.stops.map((st) => over(st, b))).slice(0, 64);
    }
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    let worst = null;
    for (const bg of candidates) {
      const fg = over(ink, bg);
      const r = ratio(fg, bg);
      if (!worst || r < worst.r) worst = { r, fg, bg };
    }
    const key = [hex(worst.fg), hex(worst.bg), large].join('|');
    if (worst.r < need && !seen.has(key)) {
      seen.add(key);
      contrastFails.push({ element: describe(el), text: text.slice(0, 40), fg: hex(worst.fg), bg: hex(worst.bg), ratio: Math.floor(worst.r * 100) / 100, need, fontSizePx: size, weight, gradient: candidates.length > 1 });
    }
  }

  // Targets (WCAG 2.5.8): visually hidden inputs are represented by their labels.
  const targets = [];
  for (let el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [tabindex]:not([tabindex="-1"])')) {
    let r = el.getBoundingClientRect();
    if (r.width * r.height <= 4 && el.labels && el.labels.length) { el = el.labels[0]; r = el.getBoundingClientRect(); }
    if (!visible(el) || r.width * r.height <= 4) continue;
    const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && ownText(el.parentElement).length > 0;
    targets.push({ el, r, inline, small: r.width < 24 || r.height < 24 });
  }
  const centre = (r) => [r.left + r.width / 2, r.top + r.height / 2];
  const circleHitsRect = ([cx, cy], rad, r) => {
    const dx = cx - Math.max(r.left, Math.min(cx, r.right));
    const dy = cy - Math.max(r.top, Math.min(cy, r.bottom));
    return dx * dx + dy * dy < rad * rad;
  };
  const smallTargets = [];
  for (const t of targets) {
    if (!t.small || t.inline) continue;
    const c = centre(t.r);
    const crowded = targets.some((o) => o !== t && o.el !== t.el && !o.el.contains(t.el) && !t.el.contains(o.el) && (
      circleHitsRect(c, 12, o.r) || (o.small && Math.hypot(c[0] - centre(o.r)[0], c[1] - centre(o.r)[1]) < 24)));
    if (crowded) smallTargets.push({ element: describe(t.el), width: Math.round(t.r.width), height: Math.round(t.r.height) });
  }

  const imgsWithoutAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src') || describe(i));
  const unlabelled = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]), select, textarea')]
    .filter((f) => !(f.labels && f.labels.length) && !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby') && !f.getAttribute('title'))
    .map(describe);
  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map((h) => Number(h.tagName[1]));
  const headingGaps = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;

  // Deceptive-pattern hints (references/ethics-guard.md). Heuristics: the ux-ethics role judges each one.
  const squash = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const nameOf = (el) => squash(el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title')).slice(0, 60);
  const fieldLabel = (el) => squash((el.labels && el.labels[0] && el.labels[0].innerText) || el.getAttribute('aria-label') || (el.closest('label') && el.closest('label').innerText) || el.name || describe(el)).slice(0, 60);
  const shown = (el) => visible(el) || !!(el.labels && [...el.labels].some(visible));
  const preTicked = [...document.querySelectorAll('input[type=checkbox], [role=checkbox][aria-checked=true], [role=switch][aria-checked=true]')]
    .filter((el) => (el.tagName === 'INPUT' ? el.checked : true) && shown(el)).map(fieldLabel);

  const ACCEPT = /^(accept|agree|allow|i agree|yes\b|ok\b|okay|got it|subscribe|sign me up|renew|enable|turn on|स्वीकार|हाँ|हां|अनुमति|akzeptieren|alle akzeptieren|zustimmen|einverstanden|قبول|موافق|أوافق)/i;
  const DECLINE = /^(reject|decline|deny|refuse|disagree|no\b(?![-‑])|nope|skip|i'?ll pass|cancel|opt out|turn off|don'?t allow|ablehnen|alle ablehnen|nein|अस्वीकार|नहीं|रद्द|رفض|لا\b)/i;
  const LATER = /^(not now|maybe later|ask me later|remind me later|later\b|बाद में|nicht jetzt|später|ليس الآن)/i;
  const CONSENT = /cookie|consent|tracking|tracker|datenschutz|कुकी|सहमति|ملفات تعريف الارتباط/i;
  const overlay = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky' || e.tagName === 'DIALOG' || /dialog/.test(e.getAttribute('role') || '') || e.getAttribute('aria-modal') === 'true') return true; } return false; };
  const controls = [...document.querySelectorAll('button, a[href], [role=button], input[type=submit], input[type=button]')]
    .filter(visible).map((el) => ({ el, name: nameOf(el), r: el.getBoundingClientRect() })).filter((c) => c.name && c.r.width * c.r.height > 4);
  const looksFilled = (el) => {
    const s = getComputedStyle(el);
    return rgba(s.backgroundColor)[3] > 0.1 || s.backgroundImage !== 'none' || ((parseFloat(s.borderTopWidth) || 0) > 0 && rgba(s.borderTopColor)[3] > 0.1 && s.borderTopStyle !== 'none');
  };
  // Two controls form a pair only inside one small component (a banner, card or dialog), not the whole page.
  const nearAncestor = (a, b, depth) => {
    let e = a;
    for (let i = 0; i <= depth && e && e !== document.body && e !== document.documentElement; i++, e = e.parentElement) {
      if (e.contains(b)) return (e.innerText || '').length <= 800 ? e : null;
    }
    return null;
  };
  const lopsided = [];
  const noReject = [];
  for (const acc of controls.filter((c) => ACCEPT.test(c.name))) {
    const others = controls.filter((c) => c !== acc && (DECLINE.test(c.name) || LATER.test(c.name)) && nearAncestor(acc.el, c.el, 4));
    for (const dec of others) {
      const aArea = acc.r.width * acc.r.height, dArea = dec.r.width * dec.r.height;
      const aFill = looksFilled(acc.el), dFill = looksFilled(dec.el);
      const aFont = parseFloat(getComputedStyle(acc.el).fontSize), dFont = parseFloat(getComputedStyle(dec.el).fontSize);
      const reasons = [];
      if (dArea < aArea * 0.5) reasons.push('smaller');
      if (aFill && !dFill) reasons.push('unfilled');
      if (dFont < aFont * 0.85) reasons.push('smaller text');
      if (LATER.test(dec.name)) reasons.push('"later" is not a refusal');
      if (reasons.length) lopsided.push({ accept: acc.name, decline: dec.name, reasons, accSize: `${Math.round(acc.r.width)}x${Math.round(acc.r.height)}`, decSize: `${Math.round(dec.r.width)}x${Math.round(dec.r.height)}` });
    }
    // A consent prompt: the nearest small ancestor that talks about cookies, tracking or consent,
    // shown as an overlay (fixed, sticky or a dialog), like a cookie banner.
    let box = acc.el.parentElement;
    for (let i = 0; i < 5 && box && box !== document.body; i++, box = box.parentElement) {
      const t = box.innerText || '';
      if (t.length > 1500) { box = null; break; }
      if (CONSENT.test(t)) break;
    }
    if (box && box !== document.body && CONSENT.test(box.innerText || '') && overlay(acc.el) && !controls.some((c) => DECLINE.test(c.name) && box.contains(c.el))) {
      noReject.push({ accept: acc.name, container: describe(box) });
    }
  }

  // Text that changes on its own within about a second: countdowns, ticking "people viewing" counts.
  const liveText = [];
  if (opts && opts.timers) {
    const cands = [...document.body.querySelectorAll('*')].filter((el) => { const t = ownText(el); return t && /\d/.test(t) && t.length <= 40 && visible(el); }).slice(0, 500);
    const before = cands.map((el) => el.textContent);
    await new Promise((r) => setTimeout(r, 1300));
    const seenBox = new Set();
    cands.forEach((el, i) => {
      if (el.isConnected && el.textContent !== before[i]) {
        const box = el.parentElement || el;
        if (seenBox.has(box)) return;
        seenBox.add(box);
        liveText.push({ element: describe(box), text: squash(box.innerText).slice(0, 60) });
      }
    });
  }

  // AI-default ("slop") hints: looks and phrases common in generated sites. Warnings only; the devil's advocate judges.
  const hueOf = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d < 0.15) return null; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
  const vpArea = innerWidth * innerHeight;
  const slop = { purpleGradients: 0, glass: 0, gradientText: 0, cardGroups: 0, emojiIcons: 0, cliches: [] };
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (/gradient/.test(cs.backgroundImage)) {
      const hues = (cs.backgroundImage.match(COLOR_RE) || []).map(rgba).map(hueOf).filter((h) => h != null);
      if ((cs.backgroundClip || cs.webkitBackgroundClip) === 'text') slop.gradientText++;
      else if (!/repeating-/.test(cs.backgroundImage) && r.width * r.height > vpArea * 0.2) {
        // A purple/indigo wash: most colour stops strongly saturated violet-blue (ruled lines and patterns use repeating gradients and are skipped).
        const stops = (cs.backgroundImage.match(COLOR_RE) || []).map(rgba).filter((c) => c[3] > 0.5);
        const violet = stops.filter((c) => { const h = hueOf(c); const sat = (Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3))) / 255; return h != null && h >= 230 && h <= 300 && sat >= 0.35; });
        if (violet.length >= 2 && violet.length >= stops.length * 0.5) slop.purpleGradients++;
      }
    }
    if ((cs.backdropFilter && cs.backdropFilter !== 'none') || (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none')) slop.glass++;
  }
  for (const parent of document.body.querySelectorAll('*')) {
    const kids = [...parent.children].filter(visible);
    if (kids.length < 3 || kids.length > 6) continue;
    const boxes = kids.map((k) => ({ r: k.getBoundingClientRect(), cs: getComputedStyle(k) }));
    const w0 = boxes[0].r.width;
    const same = boxes.every((b) => b.r.width > 120 && Math.abs(b.r.width - w0) < w0 * 0.05 && parseFloat(b.cs.borderTopLeftRadius) >= 12 && b.cs.boxShadow !== 'none');
    if (same) slop.cardGroups++;
  }
  slop.emojiIcons = [...document.querySelectorAll('h1,h2,h3,h4,button,a,li')].filter((e) => visible(e) && /\p{Extended_Pictographic}/u.test(ownText(e))).length;
  const CLICHE = /unlock (the|your) (power|potential)|seamless(ly)?|elevate your|supercharge|revolutioni[sz]e|game[- ]chang|cutting[- ]edge|next[- ]level|in today'?s (fast[- ]paced|digital)|empower(s|ing)? (you|your)|transform your|unleash|harness the|world[- ]class|state[- ]of[- ]the[- ]art|all[- ]in[- ]one (solution|platform)|effortless(ly)?|look no further|take (it|your \w+) to the next level|dive (in|into)|whether you'?re a/gi;
  slop.cliches = [...new Set((document.body.innerText.match(CLICHE) || []).map((t) => t.toLowerCase()))].slice(0, 8);

  // Placeholder text a visitor would see (missing facts belong in the handover, not on the page).
  const placeholders = [...new Set((document.body.innerText.match(/\[(?:NEEDED|TODO|TBD|PLACEHOLDER)\b[^\]\n]{0,50}\]?|lorem ipsum/gi) || []).map((t) => t.trim()))].slice(0, 8);

  return {
    placeholders, slop,
    title: document.title,
    lang: document.documentElement.getAttribute('lang') || '',
    dir: document.documentElement.getAttribute('dir') || document.body.getAttribute('dir') || '',
    viewportMeta: !!document.querySelector('meta[name=viewport]'),
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
    clientWidth: document.documentElement.clientWidth,
    contrastFails, textOverImage, clipText, hiddenText, smallTargets, imgsWithoutAlt, unlabelled,
    h1Count: levels.filter((l) => l === 1).length, headingGaps,
    runningAnimations: anims.length, infiniteAnimations: infinite,
    preTicked, lopsided, noReject, liveText,
  };
});

const SCROLL_THROUGH = `(async () => {
  const step = Math.max(200, innerHeight * 0.8);
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
  if (document.fonts) await document.fonts.ready;
})()`;

async function inspect(cdp, width, reducedMotion) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  const errors = [];
  const types = new Map();
  const bytes = {};
  let loaded;
  const loadedP = new Promise((r) => { loaded = r; });
  const onEvent = (msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Page.loadEventFired') loaded();
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push(`${msg.params.entry.text} ${msg.params.entry.url || ''}`.trim());
    if (msg.method === 'Network.responseReceived') types.set(msg.params.requestId, msg.params.type);
    if (msg.method === 'Network.loadingFinished') {
      const t = types.get(msg.params.requestId) || 'Other';
      bytes[t] = (bytes[t] || 0) + (msg.params.encodedDataLength || 0);
    }
  };
  cdp.listeners.push(onEvent);
  await s('Page.enable');
  await s('Runtime.enable');
  await s('Log.enable');
  await s('Network.enable');
  await s('Network.setCacheDisabled', { cacheDisabled: true }); // every run measures a cold load
  await s('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
  await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }] });
  await s('Page.navigate', { url });
  await Promise.race([loadedP, sleep(30000)]);
  await s('Runtime.evaluate', { expression: SCROLL_THROUGH, awaitPromise: true });
  await sleep(800);
  const opts = { timers: !reducedMotion && width === widths[0] }; // the timer check waits ~1.3 s, so run it once
  const { result } = await s('Runtime.evaluate', { expression: `(${PAGE_CHECKS})(${JSON.stringify(opts)})`, awaitPromise: true, returnByValue: true });
  let screenshot;
  if (!reducedMotion) {
    const height = Math.min(Math.ceil(result.value.scrollHeight), 16000);
    const shot = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
    screenshot = path.join(outDir, `${width}.png`);
    await writeFile(screenshot, Buffer.from(shot.data, 'base64'));
  }
  if (!reducedMotion && width === Math.max(...widths)) {
    // Visible text at the widest viewport, for checking claims against the fact list.
    const t = await s('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true });
    await writeFile(path.join(outDir, 'text.txt'), t.result.value || '');
  }
  cdp.listeners.splice(cdp.listeners.indexOf(onEvent), 1);
  await cdp.send('Target.closeTarget', { targetId });
  return { width, reducedMotion, screenshot, consoleErrors: errors, transferBytes: bytes, ...result.value };
}

function summarise(runs) {
  const blockers = [];
  const warnings = [];
  // Page weight from the widest normal run (bytes over the network; 0 for file:// pages).
  const wide = runs.filter((r) => !r.reducedMotion).sort((a, b) => b.width - a.width)[0];
  const kb = (n) => Math.round((n || 0) / 1024);
  const t = wide.transferBytes || {};
  const weight = { totalKb: kb(Object.values(t).reduce((a, b) => a + b, 0)), fontKb: kb(t.Font), scriptKb: kb(t.Script), imageKb: kb(t.Image), styleKb: kb(t.Stylesheet), documentKb: kb(t.Document) };
  if (weight.fontKb > fontBudgetKb) warnings.push(`web fonts ${weight.fontKb} KB > budget ${fontBudgetKb} KB (PERF-003): subset to the scripts used, fewer weights or families`);
  const first = runs[0];
  if (!first.lang) blockers.push('missing <html lang> (WCAG 3.1.1)');
  if (!first.title) blockers.push('missing <title> (WCAG 2.4.2)');
  if (!first.viewportMeta) warnings.push('no <meta name="viewport">');
  if (first.imgsWithoutAlt.length) blockers.push(`${first.imgsWithoutAlt.length} <img> without alt (WCAG 1.1.1): ${first.imgsWithoutAlt.slice(0, 5).join(', ')}`);
  if (first.unlabelled.length) blockers.push(`${first.unlabelled.length} form field(s) without a label (WCAG 3.3.2): ${first.unlabelled.slice(0, 5).join(', ')}`);
  if (first.h1Count !== 1) warnings.push(`${first.h1Count} <h1> elements (expected 1)`);
  if (first.headingGaps) warnings.push(`${first.headingGaps} skipped heading level(s)`);
  const contrast = new Map();
  const errors = new Map();
  const targets = new Map();
  const overImage = new Set();
  const clipped = new Set();
  for (const r of runs) {
    if (r.reducedMotion) {
      if (r.infiniteAnimations) blockers.push(`reduced motion: ${r.infiniteAnimations} infinite animation(s) still running (WCAG 2.2.2 / 2.3.3)`);
      if (r.hiddenText) blockers.push(`reduced motion: ${r.hiddenText} text element(s) still invisible after scrolling (content waits on animation)`);
      continue;
    }
    if (r.overflowX) blockers.push(`horizontal overflow at ${r.width}px: content ${r.scrollWidth}px wide (WCAG 1.4.10)`);
    for (const e of r.consoleErrors) errors.set(e, [...(errors.get(e) || []), r.width]);
    for (const c of r.contrastFails) contrast.set(`${c.fg}|${c.bg}|${c.need}`, c);
    const perWidth = new Map();
    for (const t of r.smallTargets) {
      const k = `${t.element} ${t.width}x${t.height}`;
      perWidth.set(k, (perWidth.get(k) || 0) + 1);
    }
    for (const [k, n] of perWidth) {
      const prev = targets.get(k) || { widths: [], count: 0 };
      targets.set(k, { widths: [...prev.widths, r.width], count: Math.max(prev.count, n) });
    }
    if (r.textOverImage) overImage.add(r.width);
    if (r.clipText) clipped.add(r.width);
  }
  // Deceptive-pattern hints: warnings for the ux-ethics role, never blockers on their own (ethics-guard.md).
  const ticked = new Set();
  const pairs = new Map();
  const consent = new Map();
  for (const r of runs.filter((x) => !x.reducedMotion)) {
    for (const t of r.preTicked) ticked.add(t);
    for (const p of r.lopsided) {
      const k = `"${p.accept}" ${p.accSize} vs "${p.decline}" ${p.decSize} (${p.reasons.join(', ')})`;
      pairs.set(k, [...(pairs.get(k) || []), r.width]);
    }
    for (const n of r.noReject) {
      const k = `"${n.accept}" in ${n.container}`;
      consent.set(k, [...(consent.get(k) || []), r.width]);
    }
    for (const l of r.liveText || []) warnings.push(`text changes on its own (countdown or live count?): "${l.text}" in ${l.element}; only a real, supplied deadline or number (ETH-004)`);
  }
  for (const t of ticked) warnings.push(`pre-ticked checkbox: "${t}"; consent, add-ons, donations and subscriptions must start unticked (ETH-007)`);
  for (const [k, ws] of pairs) warnings.push(`lopsided choice at ${ws.join('/')}px: ${k}; declining must be as easy and visible as accepting (ETH-008)`);
  for (const [k, ws] of consent) warnings.push(`consent prompt without a reject option at ${ws.join('/')}px: ${k} (ETH-008)`);
  const sl = runs.filter((x) => !x.reducedMotion).map((x) => x.slop).filter(Boolean).reduce((a, b) => (b.cliches.length + b.purpleGradients + b.glass + b.cardGroups > a.cliches.length + a.purpleGradients + a.glass + a.cardGroups ? b : a), { purpleGradients: 0, glass: 0, gradientText: 0, cardGroups: 0, emojiIcons: 0, cliches: [] });
  if (sl.purpleGradients) warnings.push(`anti-slop: ${sl.purpleGradients} large purple/indigo gradient(s), the most common AI-site background; derive colour from the subject`);
  if (sl.glass >= 3) warnings.push(`anti-slop: glass blur (backdrop-filter) on ${sl.glass} elements; use it once with a reason, not as a style`);
  if (sl.gradientText >= 2) warnings.push(`anti-slop: gradient-filled text on ${sl.gradientText} elements`);
  if (sl.cardGroups) warnings.push(`anti-slop: ${sl.cardGroups} row(s) of identical rounded, shadowed cards (the generic feature-card row); vary the composition`);
  if (sl.emojiIcons >= 2) warnings.push(`anti-slop: emoji used as icons in ${sl.emojiIcons} headings, buttons or list items`);
  if (sl.cliches.length) warnings.push(`anti-slop: cliché copy: ${sl.cliches.map((t) => `"${t}"`).join(', ')}; say the specific thing instead`);
  if (first.placeholders && first.placeholders.length) warnings.push(`visible placeholder text: ${first.placeholders.map((t) => `"${t}"`).join(', ')}; keep missing facts off the page and in the handover (truth-check.md)`);
  for (const [e, ws] of errors) {
    if (/404/.test(e) && /\/favicon\.ico/.test(e)) warnings.push('no favicon: the browser requested /favicon.ico and got 404; add <link rel="icon" href="…">');
    else blockers.push(`console error at ${ws.join('/')}px: ${e}`);
  }
  for (const c of contrast.values()) blockers.push(`contrast ${c.ratio}:1 < ${c.need}:1 (WCAG 1.4.3${c.gradient ? ', worst gradient stop' : ''}): "${c.text}" ${c.fg} on ${c.bg} in ${c.element}`);
  for (const [t, v] of targets) warnings.push(`target under 24x24 CSS px without enough spacing at ${v.widths.join('/')}px (WCAG 2.5.8): ${t}${v.count > 1 ? ` ×${v.count}` : ''}`);
  if (overImage.size) warnings.push(`text over a background image at ${[...overImage].join('/')}px: check contrast by eye`);
  if (clipped.size) warnings.push(`gradient- or image-filled text at ${[...clipped].join('/')}px: check contrast by eye`);
  return { blockers: [...new Set(blockers)], warnings: [...new Set(warnings)], weight };
}

const chrome = findChrome();
if (!chrome) {
  console.error('Chrome/Chromium not found. Pass --chrome PATH or set CHROME_PATH. Without a browser, use the manual checklist in references/evidence/a11y.md.');
  process.exit(2);
}
await mkdir(outDir, { recursive: true });
const cdp = await launch(chrome);
const runs = [];
let motion = null;
try {
  for (const w of widths) runs.push(await inspect(cdp, w, false));
  const mobile = widths.filter((w) => w >= 360);
  runs.push(await inspect(cdp, mobile.length ? Math.min(...mobile) : 375, true));
  if (wantMotion) motion = await runMotion(cdp, url, outDir, widths);
} finally {
  await cdp.close();
  if (server) { server.closeAllConnections(); server.close(); }
}
const summary = summarise(runs);
if (motion) summary.warnings.push(...motionFindings(motion));
await writeFile(path.join(outDir, 'report.json'), JSON.stringify({ url, checkedAt: new Date().toISOString(), summary, runs, motion }, null, 2));
console.log(`verify: ${url}`);
console.log(`screenshots + report: ${outDir}`);
if (summary.weight.totalKb) console.log(`weight    total ${summary.weight.totalKb} KB · fonts ${summary.weight.fontKb} · scripts ${summary.weight.scriptKb} · images ${summary.weight.imageKb} · css ${summary.weight.styleKb} · html ${summary.weight.documentKb}`);
for (const b of summary.blockers) console.log(`BLOCKER  ${b}`);
if (motion) { console.log(motionSummary(motion)); console.log(`motion frames: ${path.join(outDir, 'motion-sheet.png')} · flipbook: ${path.join(outDir, 'motion', 'motion.html')}`); }
for (const w of summary.warnings) console.log(`warning  ${w}`);
if (!summary.blockers.length) console.log('no blockers found by automated checks (manual review still required)');
process.exit(summary.blockers.length ? 1 : 0);
