// Motion review for `verify.mjs --motion` (Node built-ins only).
// Makes motion visible to a reviewer who can only see still images, and measures it:
//   - intro frames at fixed times after load, and scroll film-strips at even scroll positions
//     (desktop and phone), assembled into motion-sheet.png plus a playable motion.html flipbook;
//   - a scripted mouse-wheel scroll on a 4x-slowed CPU at phone width: frame times, long animation
//     frames, layout shift, which CSS properties change (inline styles written by GSAP and similar
//     libraries, and CSS/Web animations), and which elements change continuously with scroll;
//   - the same scroll with prefers-reduced-motion, to find motion that ignores the setting.
// Frames show what moves; numbers show whether it is smooth. Easing "feel" still needs a person.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Injected before any page script runs.
const PROBE = `(() => {
  const km = window.__km = { rec: false, step: 0, frames: [], loaf: [], cls: 0, props: {}, layout: {}, h1At: null, scrollTimelines: 0 };
  const steps = new Map();
  const LAYOUT = /^(top|left|right|bottom|width|height|margin|padding|inset|font-size|line-height|border-width)/;
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  const desc = (el) => !el || !el.tagName ? '?' : el.tagName.toLowerCase() + (el.id ? '#' + el.id : el.classList && el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
  let last = 0;
  const tick = (t) => { if (km.rec && last) km.frames.push(t - last); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  try { new PerformanceObserver((l) => { if (km.rec) for (const e of l.getEntries()) km.loaf.push(e.duration); }).observe({ type: 'long-animation-frame' }); } catch {}
  try { new PerformanceObserver((l) => { if (km.rec) for (const e of l.getEntries()) if (!e.hadRecentInput) km.cls += e.value; }).observe({ type: 'layout-shift' }); } catch {}
  const parse = (s) => { const o = {}; for (const d of (s || '').split(';')) { const i = d.indexOf(':'); if (i > 0) o[d.slice(0, i).trim().toLowerCase()] = d.slice(i + 1).trim(); } return o; };
  const note = (el, prop) => {
    km.props[prop] = (km.props[prop] || 0) + 1;
    if (LAYOUT.test(prop)) km.layout[desc(el)] = prop;
    let s = steps.get(el); if (!s) { s = new Set(); steps.set(el, s); } s.add(km.step);
  };
  new MutationObserver((ms) => {
    if (!km.rec) return;
    for (const m of ms) {
      const a = parse(m.oldValue), b = parse(m.target.getAttribute('style'));
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if (a[k] !== b[k]) note(m.target, k);
    }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ['style'], attributeOldValue: true });
  window.__kmSample = () => {
    if (!document.getAnimations) return;
    for (const a of document.getAnimations()) {
      if (a.playState !== 'running') continue;
      const tl = a.timeline && a.timeline.constructor && a.timeline.constructor.name;
      if (tl === 'ScrollTimeline' || tl === 'ViewTimeline') km.scrollTimelines++;
      try { for (const kf of a.effect.getKeyframes()) for (const k of Object.keys(kf)) if (!['offset', 'easing', 'composite', 'computedOffset'].includes(k)) note(a.effect.target, kebab(k)); } catch {}
    }
  };
  window.__kmResult = () => {
    let continuous = 0; const moved = steps.size;
    for (const s of steps.values()) if (s.size >= 4) continuous++;
    return { frames: km.frames, loaf: km.loaf, cls: km.cls, props: km.props, layout: km.layout, h1At: km.h1At, scrollTimelines: km.scrollTimelines, moved, continuous, steps: km.step };
  };
  const vis = () => {
    const h = document.querySelector('h1');
    if (h) {
      const r = h.getBoundingClientRect(); let o = 1;
      for (let e = h; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity;
      if (o > 0.5 && r.width > 0 && getComputedStyle(h).visibility !== 'hidden') { km.h1At = performance.now(); return; }
    }
    if (performance.now() < 15000) requestAnimationFrame(vis);
  };
  requestAnimationFrame(vis);
})();`;

async function openPage(cdp, url, width, { reducedMotion = false, throttle = 1 } = {}) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  await s('Page.enable');
  await s('Runtime.enable');
  await s('Page.addScriptToEvaluateOnNewDocument', { source: PROBE });
  await s('Emulation.setDeviceMetricsOverride', { width, height: width < 768 ? 812 : 900, deviceScaleFactor: 1, mobile: width < 768 });
  await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }] });
  if (throttle > 1) await s('Emulation.setCPUThrottlingRate', { rate: throttle });
  const t0 = Date.now();
  await s('Page.navigate', { url });
  const evaluate = async (expression) => (await s('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
  const shot = async (file) => { const r = await s('Page.captureScreenshot', { format: 'jpeg', quality: 60 }); await writeFile(file, Buffer.from(r.data, 'base64')); };
  const wheel = async (n, gap = 45) => { for (let i = 0; i < n; i++) { await s('Input.dispatchMouseEvent', { type: 'mouseWheel', x: Math.round(width / 2), y: 400, deltaX: 0, deltaY: 100 }); await sleep(gap); } };
  const close = () => cdp.send('Target.closeTarget', { targetId });
  return { t0, evaluate, shot, wheel, close };
}

const position = (p) => p.evaluate('[scrollY, document.documentElement.scrollHeight, innerHeight]');

// Intro frames at fixed times, then a film-strip of `count` frames at even scroll positions.
async function filmstrip(cdp, url, width, dir, prefix, count = 10) {
  const p = await openPage(cdp, url, width);
  const intro = [];
  for (const ms of [250, 500, 1000, 2000, 3000]) {
    const wait = p.t0 + ms - Date.now(); if (wait > 0) await sleep(wait);
    const file = `${prefix}-t${ms}.jpg`; await p.shot(path.join(dir, file)); intro.push({ file, ms });
  }
  const scroll = [];
  let [y, h, vh] = await position(p);
  const total = Math.max(0, h - vh);
  for (let i = 0; i <= count; i++) {
    const goal = Math.round((total * i) / count);
    for (let guard = 0; y < goal - 5 && guard < 80; guard++) { await p.wheel(2); [y, h, vh] = await position(p); }
    await sleep(900); // let smooth scrolling settle and reveals finish
    [y, h, vh] = await position(p);
    const file = `${prefix}-s${String(i).padStart(2, '0')}.jpg`; await p.shot(path.join(dir, file));
    scroll.push({ file, y, pct: total ? Math.round((100 * y) / total) : 0 });
  }
  await p.close();
  return { intro, scroll };
}

// Wheel-scroll top to bottom while the probe records; no screenshots, so timing is not disturbed.
async function measure(cdp, url, width, opts) {
  const p = await openPage(cdp, url, width, opts);
  await sleep(3000);
  await p.evaluate('__km.rec = true');
  let stuck = 0, prev = -1;
  for (let i = 0; i < 120 && stuck < 3; i++) {
    await p.wheel(3, 50);
    await sleep(250);
    const [y, h, vh] = await p.evaluate('__km.step++, __kmSample(), [scrollY, document.documentElement.scrollHeight, innerHeight]');
    stuck = (y + vh >= h - 2 || y === prev) ? stuck + 1 : 0; prev = y;
  }
  await sleep(600);
  const r = await p.evaluate('__km.rec = false, __kmResult()');
  await p.close();
  const f = r.frames.filter((d) => d > 0 && d < 1000).sort((a, b) => a - b);
  const pct = (q) => (f.length ? +f[Math.min(f.length - 1, Math.floor(q * f.length))].toFixed(1) : 0);
  return {
    width, throttle: opts.throttle || 1, reducedMotion: !!opts.reducedMotion,
    frames: f.length, slowPct: f.length ? Math.round((100 * f.filter((d) => d > 33.4).length) / f.length) : 0, p50: pct(0.5), p95: pct(0.95),
    longFrames: r.loaf.length, longestMs: r.loaf.length ? Math.round(Math.max(...r.loaf)) : 0, cls: +r.cls.toFixed(3),
    props: r.props, layoutProps: r.layout, movedElements: r.moved, scrollLinkedElements: r.continuous, scrollTimelines: r.scrollTimelines,
    headlineVisibleMs: r.h1At == null ? null : Math.round(r.h1At), steps: r.steps,
  };
}

function sheetHtml(strips) {
  const row = (title, frames, w) => `<h2>${title}</h2><div class="row">${frames.map((f) => `<figure><img src="${f.file}" style="width:${w}px"><figcaption>${f.ms != null ? f.ms + ' ms' : f.pct + '%'}</figcaption></figure>`).join('')}</div>`;
  return `<!doctype html><meta charset="utf-8"><style>body{margin:12px;font:12px system-ui;background:#fff;color:#111}h2{font-size:13px;margin:10px 0 4px}.row{display:flex;flex-wrap:wrap;gap:6px}figure{margin:0}img{display:block;border:1px solid #ccc}figcaption{color:#555}</style>
${strips.map((s) => row(`${s.label} · intro (time after navigation)`, s.intro, s.width >= 768 ? 250 : 110) + row(`${s.label} · scroll film-strip (share of page scrolled)`, s.scroll, s.width >= 768 ? 250 : 110)).join('')}`;
}

function flipbookHtml(strips) {
  const data = JSON.stringify(strips.map((s) => ({ label: s.label, frames: [...s.intro.map((f) => [f.file, f.ms + ' ms']), ...s.scroll.map((f) => [f.file, 'scroll ' + f.pct + '%'])] })));
  return `<!doctype html><meta charset="utf-8"><title>Motion flipbook</title><style>body{margin:16px;font:14px system-ui;background:#111;color:#eee}img{max-width:100%;max-height:80vh;display:block;margin:8px 0;border:1px solid #444}button,select{font:inherit;margin-right:6px}</style>
<p><select id="s"></select><button id="p">Pause</button><button id="b">◀</button><button id="n">▶</button> <span id="c"></span></p><img id="i" alt="frame">
<script>const D=${data};let s=0,k=0,play=true;const S=document.getElementById('s');D.forEach((d,j)=>S.add(new Option(d.label,j)));
const show=()=>{const f=D[s].frames[k];document.getElementById('i').src=f[0];document.getElementById('c').textContent=f[1]+' ('+(k+1)+'/'+D[s].frames.length+')';};
S.onchange=()=>{s=+S.value;k=0;show();};document.getElementById('p').onclick=(e)=>{play=!play;e.target.textContent=play?'Pause':'Play';};
document.getElementById('b').onclick=()=>{k=(k+D[s].frames.length-1)%D[s].frames.length;show();};document.getElementById('n').onclick=()=>{k=(k+1)%D[s].frames.length;show();};
setInterval(()=>{if(play){k=(k+1)%D[s].frames.length;show();}},600);show();</script>`;
}

export async function runMotion(cdp, url, outDir, widths) {
  const dir = path.join(outDir, 'motion');
  await mkdir(dir, { recursive: true });
  const phone = widths.filter((w) => w < 768).sort((a, b) => b - a)[0] || 375;
  const desk = Math.max(...widths.filter((w) => w >= 768), 0) || 1440;
  const strips = [];
  for (const [w, label] of [[desk, `${desk} px`], [phone, `${phone} px`]]) strips.push({ width: w, label, ...(await filmstrip(cdp, url, w, dir, `w${w}`)) });
  const slow = await measure(cdp, url, phone, { throttle: 4 });
  const reduced = await measure(cdp, url, phone, { reducedMotion: true });
  await writeFile(path.join(dir, 'motion.html'), flipbookHtml(strips));
  const sheetFile = path.join(dir, 'sheet.html');
  await writeFile(sheetFile, sheetHtml(strips));
  // Render the sheet with the same browser into one image the reviewer can read.
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
  await cdp.send('Page.navigate', { url: pathToFileURL(sheetFile).href }, sessionId);
  await sleep(1500);
  const { result } = await cdp.send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true }, sessionId);
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1400, height: Math.min(result.value, 12000), scale: 1 } }, sessionId);
  await writeFile(path.join(outDir, 'motion-sheet.png'), Buffer.from(shot.data, 'base64'));
  await cdp.send('Target.closeTarget', { targetId });
  return { strips, slow, reduced };
}

// Warnings for the summary; motion findings are judgement aids, never blockers.
export function motionFindings(m) {
  const w = [];
  const s = m.slow, r = m.reduced;
  if (s.slowPct > 15) w.push(`motion: ${s.slowPct}% of frames over 33 ms while scrolling at ${s.width} px with a 4x slower CPU (p95 ${s.p95} ms); lighten scroll work or animate only transform/opacity`);
  if (s.longFrames >= 3) w.push(`motion: ${s.longFrames} long animation frames during scroll (longest ${s.longestMs} ms) at ${s.width} px, 4x CPU`);
  if (s.cls > 0.1) w.push(`motion: layout shift ${s.cls} during scroll (CLS > 0.1)`);
  const lay = Object.entries(s.layoutProps);
  if (lay.length) w.push(`motion: layout properties animated (${lay.slice(0, 5).map(([el, p]) => `${p} on ${el}`).join(', ')}); animate transform and opacity instead`);
  if (s.headlineVisibleMs == null) w.push('motion: the <h1> never became visible within 15 s at phone width (intro or reveal hides it)');
  else if (s.headlineVisibleMs > 3000) w.push(`motion: the <h1> became visible after ${(s.headlineVisibleMs / 1000).toFixed(1)} s at phone width with a 4x slower CPU; keep intros under about 3 s`);
  const rm = Object.entries(r.props).filter(([p]) => /transform|translate|scale|rotate|opacity|top|left/.test(p)).reduce((a, [, n]) => a + n, 0);
  if (r.scrollLinkedElements > 0 || rm > 20) w.push(`reduced motion: ${r.scrollLinkedElements} element(s) still move with scroll and ${rm} motion style changes happened while scrolling; turn scroll effects and smoothing off under prefers-reduced-motion`);
  return w;
}

export function motionSummary(m) {
  const s = m.slow;
  const props = Object.entries(s.props).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([p]) => p).join(', ') || 'none';
  return `motion    ${s.width} px 4x CPU: ${s.frames} frames, ${s.slowPct}% over 33 ms, p95 ${s.p95} ms, ${s.longFrames} long frames · scroll-linked elements ${s.scrollLinkedElements} (+${s.scrollTimelines} CSS scroll timelines) · moved ${s.movedElements} · props ${props} · h1 visible ${s.headlineVisibleMs == null ? 'never' : (s.headlineVisibleMs / 1000).toFixed(1) + ' s'}`;
}
