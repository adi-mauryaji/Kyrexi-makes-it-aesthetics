# Evidence · Motion and scrolling (MOT)

Verified against the sources' text on 2026-11-13. Accessibility floors for motion are A11Y-008.

### MOT-001 · Animate only to show change, and keep it simple and slow enough to follow; do not expect animation itself to teach
- grade: B
- applies: deciding whether anything should animate, and how
- not-for: —
- value: animate state changes and processes that unfold over time (congruence); keep each animation simple and paced to be perceived (apprehension); where an "animated explainer" seems to help, the gain usually comes from extra information or interactivity, which can be offered without motion
- source: Tversky, Morrison & Bétrancourt 2002, Animation: can it facilitate? · International Journal of Human-Computer Studies 57 · https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf · access: OA (course copy) · reuse: ©
- verified: 2026-11-13 full text
- caveats: a review of studies on learning from graphics, mostly explanatory diagrams; interfaces are an extrapolation.

### MOT-002 · Use short animated transitions to keep objects trackable when the view changes
- grade: B
- applies: filtering or sorting cards, expanding sections, switching tabs or views
- not-for: page-load decoration
- value: move the same object from its old state to its new state so people can see what changed; keep transitions staged and simple
- source: Heer & Robertson 2007, Animated Transitions in Statistical Data Graphics · IEEE InfoVis · https://homes.cs.washington.edu/~jheer/files/2007-AnimatedTrans-InfoVis.pdf · access: OA (author copy) · reuse: ©
- verified: 2026-11-13 full text
- caveats: two controlled experiments on transitions between statistical charts; animated transitions significantly improved graphical perception. Transfer to website state changes is an inference.

### MOT-003 · Put the main message and the primary action in the first screen; attention falls off below it
- grade: B
- applies: above-the-fold content at 375 px and 1280 px; section order
- not-for: —
- value: the first screen must say what this is and offer the primary action; keep the most important content within the first two screenfuls
- source: Fessenden 2018, Scrolling and Attention · Nielsen Norman Group · https://www.nngroup.com/articles/scrolling-and-attention/ · access: Free-web · reuse: ©
- verified: 2026-11-13 full text
- caveats: eyetracking study by NN/g: about 57% of page-viewing time above the fold and 74% within the first two screenfuls; people scroll more than in earlier studies but still look most at the top.

### MOT-004 · Keep native scrolling; scroll-jacking is a last resort for a story that needs it
- grade: C
- applies: any scroll-linked effect (smooth-scroll libraries, pinned scenes, speed or direction changes)
- not-for: —
- value: never change scroll speed or direction by default; consider it only for a single narrative sequence, with a way out and a reduced-motion version
- source: Paul 2023, Scrolljacking 101 · Nielsen Norman Group · https://www.nngroup.com/articles/scrolljacking-101/ · access: Free-web · reuse: ©
- verified: 2026-11-13 full text
- caveats: qualitative usability testing: scrolljacking threatened user control, discoverability and efficiency; one storytelling example worked because it helped comprehension. No effect sizes.

### MOT-005 · Use skeleton screens for full-page loads of about 2–10 seconds; use a progress bar for longer waits
- grade: C
- applies: loading states for dynamic content
- not-for: loads under about 1–2 seconds (show nothing or a minimal indicator)
- value: skeleton (wireframe placeholder) for 2–10 s full-page loads; progress bar beyond 10 s
- source: Tankala 2023 (reviewed 2026), Skeleton Screens 101 · Nielsen Norman Group · https://www.nngroup.com/articles/skeleton-screens/ · access: Free-web · reuse: ©
- verified: 2026-11-13 full text
- caveats: practitioner guidance; evidence on whether skeletons feel faster than spinners is mixed (research notes), so treat the choice as a craft default.
