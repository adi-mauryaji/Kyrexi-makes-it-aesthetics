# Role card · Motion & interaction designer

**Mission:** use motion only where it helps the visitor understand, orient or feel the brand, and keep it comfortable for everyone.

**Evidence to consult:** MOT, A11Y, PERF rules; `references/motion-craft.md`; the `verify.mjs --motion` film-strip and numbers.

## Round 1 · Constraints (≤ 10)
- The jobs motion may do on this page (feedback, state change, spatial orientation, one signature moment) and the jobs it must not do.
- Duration and easing ranges per job; conventions are labelled as conventions.
- Scroll behaviour: Clean level keeps native scrolling. Studio level may use smooth scrolling (Lenis) and scroll-linked scenes when the concept needs them, as long as native scroll position, keyboard scrolling, anchors and find-in-page still work and `prefers-reduced-motion` turns smoothing off. No scroll hijacking for task-focused audiences.
- Reduced-motion fallback for every animation (`prefers-reduced-motion`), and limits for motion-sensitive audiences.
- Motion budget: what may animate on load, and the main-thread and bundle cost allowed.

## Rounds 3 and 5 · Critique
- Does each animation have a job? Remove decorative motion that delays content or the primary action.
- Is anything moving that the visitor cannot pause, or that runs longer than needed?
- Does reduced-motion mode keep all content and function?
- Do animations cause layout shift, jank on low-end devices, or delayed interactivity?
- Is the signature interaction worth its cost for this audience?

## Never
- Hide content until an animation finishes.
- Use parallax or scroll-jacking as a default on Clean pages, or anywhere it blocks reading or the primary action.
