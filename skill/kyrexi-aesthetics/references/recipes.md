# Recipes

Starting points for the techniques award sites use, written for this skill (not copied from any site or tutorial). Adapt them to the concept; never ship one only because it is here. Each recipe keeps the floors: content is complete without JavaScript and under reduced motion, only transform and opacity move during scroll (clip-path, background and stroke changes repaint: keep them to a few elements at once), and the page stays fast on a mid-range phone. Check every result with `verify.mjs --motion`.

Libraries: GSAP with ScrollTrigger and SplitText (GSAP Standard "No Charge" licence, free including commercial use), Lenis (MIT), Three.js (MIT). Save them as local files or pin exact CDN versions; load them after the core page.

## 0. Boot: motion only when allowed
```html
<script>document.documentElement.classList.add('js');</script>
<script type="module" src="motion.js"></script>
```
```js
// motion.js
import { gsap } from './vendor/gsap/index.js';
import { ScrollTrigger } from './vendor/gsap/ScrollTrigger.js';
import { SplitText } from './vendor/gsap/SplitText.js';
import Lenis from './vendor/lenis.mjs';
gsap.registerPlugin(ScrollTrigger, SplitText);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  document.documentElement.classList.add('motion');           // CSS hides start states only under .motion
  const lenis = new Lenis({ autoRaf: false });                  // smooth wheel scrolling; touch stays native
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  // ...recipes below run here...
  return () => { gsap.ticker.remove(raf); lenis.destroy(); document.documentElement.classList.remove('motion'); };
});
```
`gsap.matchMedia` reverts every animation if the visitor turns reduced motion on mid-visit. Start states live in CSS under `html.motion`, so without JavaScript the page shows end states.

## 1. Masked line reveal for headings
```js
document.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
  SplitText.create(el, {
    type: 'lines', mask: 'lines', autoSplit: true,                // re-splits on resize and font load
    onSplit: (self) => gsap.from(self.lines, {
      yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    }),
  });
});
document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
  gsap.from(el, { y: 14, opacity: 0, duration: 0.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
});
```
SplitText keeps the heading's text available to screen readers. For a hero headline that must be readable at once, reveal within the first second.

## 2. Image reveal and colour flood between sections
```css
html.motion [data-reveal="image"] { clip-path: inset(100% 0 0 0); transition: clip-path .9s cubic-bezier(.2,.8,.2,1); }
html.motion [data-reveal="image"].is-in { clip-path: inset(0 0 0 0); }
body { background: var(--bg, #15100d); transition: background-color .6s ease; }
```
```js
const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))), { rootMargin: '0px 0px -15% 0px' });
document.querySelectorAll('[data-reveal="image"]').forEach((el) => io.observe(el));
document.querySelectorAll('section[data-bg]').forEach((sec) => ScrollTrigger.create({
  trigger: sec, start: 'top 55%', end: 'bottom 55%',
  onToggle: (s) => s.isActive && document.body.style.setProperty('--bg', sec.dataset.bg),
}));
```
Check text contrast against every flood colour with `contrast.py`.

## 3. Parallax drift (large images and ornaments)
```js
mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('[data-drift]').forEach((el) => gsap.to(el, {
    yPercent: -Number(el.dataset.drift || 10), ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  }));
});
```
Keep drift under about 15% and off on phones if the film-strip shows jank.

## 4. Pinned scene with a scrubbed timeline (sticky frame, no layout writes)
```html
<section class="scene" data-scene>
  <div class="scene__frame"> <!-- the stage: plate, steam, captions --> </div>
</section>
```
```css
html.motion .scene { height: 300vh; }                         /* scroll distance */
html.motion .scene__frame { position: sticky; top: 0; height: 100vh; overflow: hidden; }
```
```js
const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-scene]', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
tl.to('.plate', { xPercent: 160, rotate: 20, ease: 'none' })
  .to('.steam', { yPercent: -40, opacity: 1, stagger: 0.1 }, '<')
  .to('.caption-1', { opacity: 0 }, 0.4).from('.caption-2', { opacity: 0 }, 0.5);
```
CSS `position: sticky` does the pinning, so only transforms change during scroll. Keep a scene to two or three screen heights; show its end state without `.motion`.

## 5. Horizontal sequence
```css
html.motion .hseq { position: relative; }
html.motion .hseq__frame { position: sticky; top: 0; height: 100vh; overflow: hidden; }
html.motion .hseq__track { display: flex; width: max-content; gap: 4vw; }
.hseq__track { display: grid; gap: 24px; }                   /* without motion: a normal vertical list */
```
```js
mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
  const sec = document.querySelector('.hseq'), track = sec.querySelector('.hseq__track');
  const size = () => { sec.style.height = `${track.scrollWidth - innerWidth + innerHeight}px`; };
  size(); addEventListener('resize', size);
  gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
  return () => { removeEventListener('resize', size); sec.style.height = ''; };
});
```
Phones keep the vertical list. Every item stays reachable by keyboard (tabbing scrolls it into view).

## 6. Stacking cards
```css
.stack { display: grid; gap: 4vh; }
.stack > .card { position: sticky; top: calc(10vh + var(--i) * 1.5rem); }
```
```js
const cards = gsap.utils.toArray('.stack > .card');
cards.forEach((card, i) => cards[i + 1] && gsap.to(card, {
  scale: 0.94, opacity: 0.65, ease: 'none',
  scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 25%', scrub: true },
}));
```
Set `--i` per card inline. Works as a plain list when sticky is not supported.

## 7. Marquee that speeds up with scroll
```html
<div class="marquee" aria-label="Dishes: Galouti, Afghani Chicken, Dal Makhani">
  <div class="marquee__track"><span>…items…</span><span aria-hidden="true">…same items…</span></div>
</div>
```
```css
.marquee { overflow: hidden; }
.marquee__track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
```
```js
const run = document.querySelector('.marquee__track').getAnimations()[0];
ScrollTrigger.create({ onUpdate: (s) => { run.playbackRate = 1 + Math.min(4, Math.abs(s.getVelocity()) / 500); } });
gsap.ticker.add(() => { if (run.playbackRate > 1) run.playbackRate = Math.max(1, run.playbackRate * 0.94); });
```

## 8. Micro-interactions: magnetic button, drawn underline, card tilt
```css
.link { background: linear-gradient(currentColor, currentColor) 0 100% / 0 2px no-repeat; transition: background-size .3s ease; }
.link:hover, .link:focus-visible { background-size: 100% 2px; }
.btn:active { transform: scale(.97); }
```
```js
if (matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach((b) => {
    const xTo = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.3); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
  document.querySelectorAll('[data-tilt]').forEach((c) => {
    c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(c, { rotateY: px * 6, rotateX: -py * 6, transformPerspective: 800, duration: 0.4 }); });
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.5 }));
  });
}
```
Focus styles stay visible; motion never moves a target away from the pointer.

## 9. Pointer follower (pointer devices only)
```js
if (matchMedia('(pointer: fine)').matches) {
  const dot = Object.assign(document.createElement('div'), { className: 'cursor', ariaHidden: 'true' });
  document.body.append(dot);
  const x = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3' }), y = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3' });
  addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); });
  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => { dot.textContent = el.dataset.cursor; dot.classList.add('is-label'); });
    el.addEventListener('pointerleave', () => { dot.textContent = ''; dot.classList.remove('is-label'); });
  });
}
```
```css
.cursor { position: fixed; left: 0; top: 0; width: 12px; height: 12px; margin: -6px; border-radius: 50%; background: currentColor; pointer-events: none; z-index: 100; }
```
Keep the native cursor; the follower adds, never replaces.

## 10. View Transitions between states or pages
```js
const swap = (update) => (document.startViewTransition && matchMedia('(prefers-reduced-motion: no-preference)').matches)
  ? document.startViewTransition(update) : update();
```
```css
@view-transition { navigation: auto; }                        /* cross-page, same origin, where supported */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .4s; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
```
Browsers without support simply change the page.

## 11. Line drawing (SVG)
```html
<svg viewBox="0 0 400 200"><path pathLength="1" class="draw" d="…"/></svg>
```
```css
html.motion .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-out; }
html.motion .is-in .draw { stroke-dashoffset: 0; }
```
For a scrubbed drawing: `gsap.fromTo('.draw', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.draw', start: 'top 80%', end: 'top 30%', scrub: true } })`.

## 12. Scroll-scrubbed footage (image sequence on canvas)
```js
const N = 150, base = innerWidth < 768 ? 'frames/mobile/' : 'frames/desktop/';
const src = (i) => `${base}${String(i + 1).padStart(4, '0')}.webp`;
const cache = [], load = (i) => (cache[i] ||= Object.assign(new Image(), { src: src(i), decoding: 'async' }));
const canvas = document.querySelector('.seq'), ctx = canvas.getContext('2d');
const fit = () => { const d = Math.min(devicePixelRatio, 2); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; draw(); };
const state = { f: 0 };
function draw() { const img = load(Math.round(state.f)); if (!img.complete) { img.onload = draw; return; }
  const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
  ctx.drawImage(img, (canvas.width - img.naturalWidth * s) / 2, (canvas.height - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s); }
fit(); addEventListener('resize', fit);
gsap.to(state, { f: N - 1, ease: 'none', onUpdate: draw, scrollTrigger: { trigger: '.seq-scene', start: 'top top', end: 'bottom bottom', scrub: 0.4 } });
(window.requestIdleCallback || setTimeout)(() => { for (let i = 0; i < N; i += 1) load(i); });
```
The scene's poster image (first frame) shows without motion. Encoding the frames: `asset-brief.md` section 4.

## 13. One WebGL moment (Three.js), loaded late
```js
const stage = document.querySelector('[data-webgl]');
const ok = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })()
  && !navigator.connection?.saveData && matchMedia('(prefers-reduced-motion: no-preference)').matches;
if (ok) {
  const io = new IntersectionObserver(async ([e]) => { if (!e.isIntersecting) return; io.disconnect();
    const { start } = await import('./scene.js'); start(stage.querySelector('canvas')); }, { rootMargin: '700px' });
  io.observe(stage);
}
```
```js
// scene.js
import * as THREE from './vendor/three.module.min.js';
export function start(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100); camera.position.z = 6;
  // build the one object or particle field the concept needs here
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);
  let visible = true; new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  renderer.setAnimationLoop((t) => { if (!visible || document.hidden) return; /* update with t */ renderer.render(scene, camera); });
  canvas.closest('[data-webgl]').classList.add('is-live');           // CSS fades the poster out
}
```
A poster image sits behind the canvas and stays when WebGL is off; add a pause button for loops. Build the bundle tree-shaken and count it in the budget.

## 14. Rotating circular text
```html
<svg class="ring" viewBox="0 0 200 200" aria-hidden="true">
  <defs><path id="c" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs>
  <text><textPath href="#c">SINCE 1968 · SAFDARJUNG ENCLAVE · </textPath></text>
</svg>
```
```css
.ring { animation: spin 24s linear infinite; }
@keyframes spin { to { transform: rotate(1turn); } }
@media (prefers-reduced-motion: reduce) { .ring { animation: none; } }
```
Only true, supplied words go on the ring.

## 15. Grain and texture
```css
body::after { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 50; background: url(img/grain.webp); opacity: .08; mix-blend-mode: multiply; }
```
Keep grain static (an animated full-screen layer repaints every frame); a 10–20 KB tile is enough.

## 16. Breaking the grid
```css
.overlap { display: grid; grid-template-columns: repeat(12, 1fr); align-items: end; }
.overlap__media { grid-column: 5 / -1; grid-row: 1; }
.overlap__title { grid-column: 1 / 10; grid-row: 1; z-index: 1; font-size: clamp(3rem, 11vw, 12rem); line-height: .9; }
.behind { position: relative; } .behind__word { position: absolute; inset: auto 0 10% 0; font-size: 22vw; opacity: .12; z-index: -1; }
.offset { margin-inline-start: calc(100% / 12 * 2); }
@media (max-width: 767px) { .overlap__media, .overlap__title { grid-column: 1 / -1; } }
```
Keep source order equal to reading order; overlap only where text stays readable over the image (check contrast where they meet).
