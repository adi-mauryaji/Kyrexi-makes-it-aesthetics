# Motion craft

How to build the motion signature and judge it. Durations and easings here are craft conventions (grade D), not research findings; the floors (reduced motion, no hidden content, no seizure risk) come from A11Y-008 and the MOT rules.

## 1. Decide the motion signature (step 2)
One idea that expresses the concept and that the page is remembered for, plus quiet supporting motion. Name it in the blueprint in one sentence ("the plate slides along the counter as you scroll and steam rises"). Clean level: micro-interactions and gentle reveals only. Studio level: one signature sequence (TST-007) on top of a site-wide motion system (section 7), so motion is not limited to one object.

## 2. Choreography and timing
- Order entrances by meaning: headline, then the key visual, then the call to action; stagger 60–120 ms between items, never everything at once.
- Durations: feedback (hover, press) 120–200 ms; small reveals 300–600 ms; large moves and section transitions 600–1000 ms; an intro at most about 3 s and skippable.
- Easing: ease-out (decelerate) for things arriving, ease-in for leaving, a soft ease-in-out for scroll-scrubbed moves; avoid linear except for continuous loops and scrubbed video.
- One focal motion per screen; supporting motion smaller and slower. Ambient loops (steam, glow, drift) are subtle, pause when off screen, and can be paused.
- **Cinematic defaults for Studio pages** (starting values, tune by eye): eases `power3.out`, `power4.out` or `expo.out`; scroll scrub 0.8–1.4 for a slight cinematic lag; reveals 0.75–1.1 s; hover 0.35–0.6 s; pointer follower lag 0.25–0.45 s; stagger 0.035–0.07 s between words, 0.08–0.14 s between lines, 0.06–0.1 s between cards; start reveals when the element's top reaches about 82% of the viewport. Avoid bounce, elastic and large scale jumps on marketing pages; springs belong to direct manipulation (dragging, flicking), where they make motion follow the hand and stay interruptible.
- **Choreography order:** hero: background or media first, headline lines second, supporting copy third, call to action last. Each section: label, heading, media, then details. Parallax: background slowest, foreground slightly faster, text mostly still. Pinned scenes: one idea per screen.
- **Interruptible by default:** hover and press states use CSS transitions (they reverse mid-way); never animate from `scale(0)` (start near 0.9–0.95 with opacity); menus and popovers grow from where they were opened.

## 3. Scroll storytelling patterns
| Pattern | Use for | Build with |
|---|---|---|
| Reveal on enter | most sections | IntersectionObserver + CSS transitions, or GSAP ScrollTrigger `once` |
| Scrubbed move | the signature (an object travels, a drawing assembles) | GSAP ScrollTrigger `scrub`, or CSS scroll-driven animations (`animation-timeline: view()`) where supported, with a static fallback |
| Pinned sequence | a short story in steps (then → now; order → pay → collect) | ScrollTrigger `pin` with 2–4 steps; keep the pinned distance short (one to two screen heights) |
| Scrubbed video or image sequence | real footage from the asset brief | canvas + image sequence (`asset-brief.md` section 4) |
| Parallax layers | depth in illustrations | transforms at small speed differences; off on phones if it janks |
| Smooth scroll | Studio pages with scroll scenes | Lenis, synced with ScrollTrigger; off under reduced motion |
| Split text | a display headline arriving | GSAP SplitText or spans per word; keep the full text in the DOM for screen readers |
| 3D moment | one object or scene the concept needs | Three.js, loaded after first paint, behind a poster image |

## 4. Performance rules
- Animate only `transform` and `opacity` (and `filter` sparingly). Never animate `top`, `left`, `width`, `height` or margins.
- Scroll handlers are passive and do their work in `requestAnimationFrame`; prefer ScrollTrigger or CSS scroll timelines to hand-written scroll math.
- `will-change` only on the few elements that move continuously.
- Load GSAP/Lenis from local files or a pinned CDN version after the core page; Three.js only when its section is near (IntersectionObserver), with device pixel ratio capped at 2 and rendering paused off screen.
- Budget the libraries in the performance plan (stack catalog). The page must read and work without JavaScript.
- Run one smooth-scroll engine only; call `ScrollTrigger.refresh()` after fonts and images load or the layout changes; revert or kill triggers on cleanup.

## 5. Reduced motion and fallbacks
Under `prefers-reduced-motion: reduce`: no smooth scrolling, no scrubbed or pinned movement (show the end state), no parallax, no autoplay loops; keep instant state changes and opacity fades under 200 ms. Without JavaScript or WebGL: every section shows its final, readable state. Provide a visible pause control for any loop longer than 5 s.

## 6. Check it (step 6)
Run `node scripts/verify.mjs <page> --out <dir> --motion`. Read `motion-sheet.png` (intro frames at 0.25–3 s and a scroll film-strip at desktop and phone width) and the `motion` line and warnings: frames over 33 ms on a 4× slower CPU, long animation frames, layout properties animated, scroll-linked elements, headline visibility time, and motion that ignores reduced motion. The person reviewing opens `motion/motion.html` to play the frames. Score the motion gate in `art-direction.md` section 6.

## 7. Motion system (Studio level)
Award sites give every element type one consistent behaviour, so the whole page feels alive while each screen still has one focal motion. Define the system in the blueprint, one row per element type, then apply it everywhere. Recipes are in `references/recipes.md`.

| Element | Default behaviour | Recipe |
|---|---|---|
| Display headings | lines rise from behind a mask, 60–90 ms stagger | 1 |
| Body text and labels | short fade-up (8–16 px, 300–400 ms) as the block enters | 1 |
| Images and illustrations | clip-path or scale reveal on enter; a small parallax drift on large ones | 2, 3 |
| Buttons | press feedback; a magnetic pull on pointer devices | 8 |
| Text links | underline draws in on hover and focus | 8 |
| Cards and list items | lift or tilt a few degrees on hover; stagger on enter | 6, 8 |
| Section changes | colour flood or wipe between strongly different sections | 2 |
| Repeating strips (dish names, clients) | marquee that speeds up with scroll velocity | 7 |
| Pointer (optional) | a follower or label on media, pointer devices only; the native cursor stays | 9 |
| Page or state changes | View Transitions where supported | 10 |

Keep the system to the rows the concept needs; one focal motion per screen still applies (section 2), and every row has its reduced-motion state (section 5).
