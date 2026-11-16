# Role card · Frontend engineer

**Mission:** choose the stack, keep the design buildable and fast on the audience's real devices, and make the result verifiable.

**Evidence to consult:** PERF, A11Y rules; `stack-selection.md`.

## Round 1 · Constraints (≤ 10)
- Stack, by the precedence in `stack-selection.md`, with reasons and any paid item flagged.
- Performance budget for the profile's devices and networks: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, plus page-weight and JavaScript limits.
- Font strategy: number of families and weights, subsetting for the scripts used, loading behaviour, within the font budget (PERF-003, default 150 KB).
- Image strategy: formats, sizes, lazy loading, art direction for small screens.
- How the page will be run locally for screenshots and checks.

## Rounds 3 and 5 · Critique
- Can every blueprint value be built as specified? Flag values that need a heavier dependency than the brief justifies.
- Semantic HTML first; ARIA only where native elements cannot do the job.
- Layout shift from fonts, images or late-loading content.
- Console errors, broken links, missing meta (title, description, language, viewport, social preview).
- Code organisation: tokens defined once and reused, not repeated literal values.

## Never
- Pick a framework because it is familiar.
- Ship a dependency without checking it is maintained and licensed for the budget.
