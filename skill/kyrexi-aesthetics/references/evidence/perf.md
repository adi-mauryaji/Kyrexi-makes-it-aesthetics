# Evidence · Performance (PERF)

### PERF-001 · Meet Core Web Vitals "good" at the 75th percentile on mobile and desktop
- grade: B
- applies: every page; set as the blueprint's performance budget
- not-for: —
- value: LCP ≤ 2.5 s (poor > 4.0 s) · INP ≤ 200 ms (poor > 500 ms) · CLS ≤ 0.1 (poor > 0.25); measured at the 75th percentile of page loads, mobile and desktop segmented
- source: Google web.dev, Web Vitals; LCP, INP and CLS articles · https://web.dev/articles/vitals · access: OA · reuse: CC BY 4.0 (web.dev content)
- verified: 2026-11-12 standard text
- caveats: industry thresholds, not law; Google states stable metrics change at most once a year. Lab tools approximate field data. INP counts clicks, taps and key presses, not scrolling.

### PERF-002 · Expect visually ambitious, motion-heavy sites to fail Core Web Vitals unless performance is budgeted from the start
- grade: C
- applies: when the concept leans on large media, smooth-scroll or animation libraries
- not-for: —
- value: give the motion and media plan an explicit page-weight and main-thread budget; prefer CSS and native APIs before libraries
- source: Khorana 2026, 64 Beautiful Websites in 2026, Checked Live and Speed-Tested · personal blog, 31 Oct 2026 · https://gautamkhorana.com/blog/beautiful-websites/ · access: Free-web · reuse: ©
- verified: 2026-11-12 full text (figures)
- caveats: one author's curated pool of 227 sites, 8 random per category; median mobile Lighthouse 61 (16 of 64 under 50); median page weight 4.25 MB, 15 pages over 10 MB; 11 of 35 sites with enough field data passed all three Core Web Vitals; 20 sites loading Lenis or GSAP had median Lighthouse 56.5 vs 64 without. Single lab run, correlation only.

### PERF-003 · Keep web fonts within a budget (default 150 KB transferred) on pages for phones
- grade: D
- applies: every page whose audience uses phones or slow networks
- not-for: type-specimen or brand pages where the typeface is the product
- value: ≤ 150 KB of font files on first load; subset each family to the scripts and characters used; at most two families and the weights actually set; let body text use system fonts when the audience is on low-end devices; `verify.mjs --font-budget-kb` warns above the budget
- source: craft consensus; budget chosen by this project · project smoke baseline, 2026-11-12 · access: Unpublished · reuse: CC BY 4.0
- verified: 2026-11-12 full text (own data)
- caveats: the figure is a craft default, not a researched threshold. In the smoke baseline one therapy page shipped 827 KB of fonts (a full Devanagari family kept "for later pages") against 104 KB on the other arm's page for the same brief; fonts weigh most for Indic, Arabic and CJK scripts, so subsetting matters most there (PERF-001 is the outcome that counts).
