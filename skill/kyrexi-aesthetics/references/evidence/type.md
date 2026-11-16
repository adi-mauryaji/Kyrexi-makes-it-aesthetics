# Evidence · Typography and readability (TYP)

Verified against the sources' text on 2026-11-13.

### TYP-001 · Set body text comfortably above the critical print size; size matters more than which font
- grade: B
- applies: base font size, small text (captions, labels, legal lines), older or low-vision audiences
- not-for: display type
- value: keep running text inside the fluent range; on screens this means body text of at least 16 CSS px, and 18–20 px for older or low-vision readers (inference below)
- source: Legge & Bigelow 2011, Does print size matter for reading? A review of findings from vision science and typography · Journal of Vision · https://pmc.ncbi.nlm.nih.gov/articles/PMC3428264/ · access: OA · reuse: ©
- verified: 2026-11-13 full text
- caveats: reading is at maximum speed across x-heights of about 0.2° to 2°; below the critical print size (about 0.15°–0.3°, varying by person) speed drops sharply. The pixel values are this skill's inference: with WCAG's reference CSS pixel (about 0.0213°), 0.2° is about 9 px of x-height, which most text faces reach at roughly 16–20 px font size.

### TYP-002 · Do not claim a "most readable font": the fastest font differs per reader, and preference does not predict speed
- grade: B
- applies: font choice rationale; deciding whether to offer reader controls (size, font)
- not-for: —
- value: choose a well-made family with full script coverage and a generous size (TYP-001); justify it by fit and craft, not by a readability claim; reader controls help where reading is the main task
- source: Wallace, Bylinskii, Dobres, Kerr, Berlow, Treitman, Kumawat, Arpin, Miller, Huang & Sawyer 2022, Towards Individuated Reading Experiences: Different Fonts Increase Reading Speed for Different Individuals · ACM TOCHI 29(4) · https://jeffhuang.com/papers/Readability_TOCHI22.pdf · access: OA (author copy) · reuse: ©
- verified: 2026-11-13 full text
- caveats: 352 crowdworkers (after removing 30% of 500), 16 fonts size-normalised; reading speed differed by 35% between a person's fastest and slowest fonts without loss of comprehension; no single factor predicted speed; English, Latin script, adults online.
