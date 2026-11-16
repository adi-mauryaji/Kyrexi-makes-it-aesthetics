# Evidence · Audience differences (AUD)

Group differences are starting values, never rules (SKILL.md rule 4). Entries verified against the sources' text; the starting-value table at the end turns them into defaults with a confidence.

### AUD-001 · Keep visual complexity low-to-moderate; over-complexity costs more than under-complexity
- grade: B
- applies: any website first impression, all audiences
- not-for: expert tools where users already know the layout
- value: aim below the population's peak complexity; never compensate a weak concept with more elements
- source: Reinecke & Gajos 2014, Quantifying Visual Preferences Around the World · CHI 2014 · 10.1145/2556288.2557052 · access: OA · reuse: ©
- verified: 2026-11-11 full text
- caveats: ~40k online volunteers, 430 screenshots at 500 ms; appeal fell much more from peak to high complexity (d = 2.0) than to low (d = 0.6); demographics explain ~7% of variance (marginal R² 0.07), so group shifts are starting values only

### AUD-002 · Shift colourfulness and complexity only slightly by group; education and region move them most
- grade: B
- applies: the starting-value table below
- not-for: decisions about one person; any adjustment by gender alone (SKILL.md rule 4)
- value: higher formal education → somewhat less colour and less complexity; lower formal education → more colour and more (orderly) content tolerated; Finland and Russia among the most averse to high complexity; Macedonia the most colour-loving; women preferred more saturated colour than men (too small and too stereotype-prone to act on)
- source: Reinecke & Gajos 2014 (see AUD-001) · access: OA · reuse: ©
- verified: 2026-11-13 full text (group findings re-read; age findings from the 2026-11-11 full-text reading)
- caveats: demographics and the two visual features together explain about 7% of rating variance (marginal R² = .07; conditional R² = .47 with people and sites), so a group shift is a nudge of at most one step, never a rule.

### AUD-003 · Discount research-based defaults for non-Western audiences; most HCI evidence comes from Western samples
- grade: B
- applies: every rule's confidence when the audience is outside Western, educated, industrialised, rich, democratic societies
- not-for: accessibility floors and standards (A11Y), which apply everywhere
- value: lower the confidence of FI, LAY, COL, TYP and MOT rules by one step for such audiences; prefer local feedback (a quick survey with the real audience) over defaults
- source: Linxen, Sturm, Brühlmann, Cassau, Opwis & Reinecke 2021, How WEIRD is CHI? · CHI 2021 · https://wildlab.cs.washington.edu/Publications_files/Linxen_CHI2021.pdf · access: OA · reuse: ©
- verified: 2026-11-13 full text
- caveats: at least 73% of CHI study findings (2016–2020) were based on Western participant samples, representing less than 12% of the world's population.

### AUD-004 · Expect East Asian audiences to accept more information per page; keep it orderly
- grade: B
- applies: audiences in China, Japan, Korea and other East Asian locales
- not-for: assuming all Asian audiences share this; South and South-East Asia were not studied
- value: a denser page with more visible options is acceptable and searched faster by these audiences; still group and align it (LAY-001)
- source: Wang, Masuda, Ito & Rashid 2012, How much information? East Asian and North American cultural products and information search performance · Personality and Social Psychology Bulletin · https://www.ualberta.ca/%7Etmasuda/PublishedPapers/WangMasudaItoRashid2012.pdf · access: OA (author manuscript) · reuse: ©
- verified: 2026-11-13 abstract (full text available)
- caveats: posters and government/university portal pages produced by East Asians were more information-rich than North American ones; East Asians were faster than North Americans at finding targets on information-heavy mock pages; the authors also report shared functional and aesthetic preferences.

### AUD-005 · Design for older adults with legible text, large targets, no surprises and visible navigation
- grade: B
- applies: audiences aged 65+, and family members choosing for them
- not-for: —
- value: body text 18–20 px (TYP-001), targets about 44 px (A11Y-007 craft), no autoplaying sound or motion, navigation shown rather than hidden, plain language; do not strip colour entirely (older raters disliked colourless sites, AUD-002)
- source: Kane 2019, Usability for Older Adults: Challenges and Changes · Nielsen Norman Group · https://www.nngroup.com/articles/usability-for-senior-citizens/ · access: Free-web · reuse: ©
- verified: 2026-11-13 full text
- caveats: NN/g usability research with users 65+; names illegible text, tiny targets and startling sounds as common barriers, and cites a decline in website-use ability of about 0.8% per year between ages 25 and 60.

### AUD-006 · Design for teenagers with little reading, fast scanning and clear navigation
- grade: B
- applies: audiences aged about 13–17
- not-for: assuming teens want flashy design for its own sake
- value: short text, scannable layout, obvious navigation, relatable content; avoid dense pages
- source: Kendrick & Nielsen 2019, Teenager's UX: Designing for Teens · Nielsen Norman Group · https://www.nngroup.com/articles/usability-of-websites-for-teenagers/ · access: Free-web · reuse: ©
- verified: 2026-11-13 full text
- caveats: teens were confident but performed worse than adults; lower reading levels, impatience and undeveloped research skills reduced task success; dense content and poor navigation caused the most trouble.

### AUD-007 · Design for children by age band, with clear cues that there is more to see
- grade: B
- applies: pages used by children aged 3–12 (and the parents beside them)
- not-for: —
- value: design separately for younger and older children; give strong visual cues for scrolling and for content beyond the screen
- source: Sherwin & Nielsen 2019, Children's UX: Usability Issues in Designing for Young People · Nielsen Norman Group · https://www.nngroup.com/articles/childrens-websites-usability-issues/ · access: Free-web · reuse: ©
- verified: 2026-11-13 full text
- caveats: children have become much more proficient since earlier studies, yet many designs still do not suit them; children scrolled when the design gave sufficient cues that there was more to see.

### AUD-008 · Set right-to-left direction in HTML on the root element, not in CSS
- grade: B
- applies: Arabic, Hebrew, Persian, Urdu and other RTL pages
- not-for: —
- value: `<html dir="rtl" lang="…">`; use `dir` below the root only on the rare structural elements whose base direction differs; never set base direction with CSS
- source: W3C Internationalization, Structural markup and right-to-left text in HTML · https://www.w3.org/International/questions/qa-html-dir · access: OA · reuse: W3C
- verified: 2026-11-13 standard text
- caveats: guidance article backed by the HTML standard's `dir` attribute; mirroring of icons and layout needs judgement per element.

### AUD-009 · Never apply CSS letter-spacing to Devanagari and other Indic text
- grade: B
- applies: Hindi, Marathi and other Indic-script headings, labels and buttons
- not-for: Latin-script parts of the same page
- value: leave letter-spacing at normal for Indic scripts; if spacing is needed for display, it must fall between syllables, which CSS letter-spacing cannot do
- source: W3C, Indic Layout Requirements (Working Draft 29 May 2020) · https://www.w3.org/TR/ilreq/ · access: OA · reuse: W3C
- verified: 2026-11-13 standard text
- caveats: the draft says spacing in Indian languages must be introduced after each syllable for correct representation (it focuses on Devanagari); applying it per character, as CSS does, is this skill's inference of the failure (broken conjuncts and headline).

### AUD-010 · Give Arabic text generous line height and do not letter-space it
- grade: B
- applies: Arabic and Persian text, especially mixed with Latin
- not-for: —
- value: allow taller lines than for Latin text and check alignment when scripts mix; for emphasis use the script's own elongation, not letter-spacing
- source: W3C, Arabic & Persian Layout Requirements (Group Draft Note) · https://www.w3.org/TR/alreq/ · access: OA · reuse: W3C
- verified: 2026-11-13 standard text
- caveats: the note says Arabic ascenders and descenders extend much further than Latin ones, and that stretching in Arabic does not correspond to letter-spacing in non-cursive scripts.

## Starting values

Adjust from the page's default by at most one step, only when the profile value's basis is stated or inferred with at least medium confidence. Record each adjustment in the decision ledger with its rule ID.

| Profile signal | Starting adjustment | Rules | Confidence |
|---|---|---|---|
| Any audience | low-to-moderate complexity, orderly layout, typical structure | AUD-001, FI-002, LAY-001 | high |
| Postgraduate or specialist audience | a little less colour; complexity can stay moderate if the content needs it | AUD-002 | low |
| School-level formal education | a little more colour; keep reading simple | AUD-002, AUD-006 | low |
| Nordic, Russian, German, French audiences | less colour, lower complexity | AUD-002 | low |
| South-East European, Latin American, South-East Asian audiences | more colour allowed | AUD-002 | low |
| East Asian audiences | more information per screen allowed, still ordered | AUD-004 | medium |
| Any non-Western audience | lower every non-floor rule's confidence one step; seek local feedback | AUD-003 | high |
| Adults 65+ | 18–20 px body text, 44 px targets, no autoplay, visible navigation, keep some colour | AUD-005, TYP-001 | medium |
| Teenagers | short text, scannable, clear navigation | AUD-006 | medium |
| Children 3–12 | design by age band, strong scroll cues | AUD-007 | medium |
| RTL script | `dir="rtl"` on `<html>`, mirrored layout, generous line height (Arabic) | AUD-008, AUD-010 | high |
| Indic script | no letter-spacing, full script coverage, taller line height | AUD-009 | high |
| Gender skew | no adjustment | rule 4 | — |
| Domain experts | denser information acceptable | craft judgement | low |
