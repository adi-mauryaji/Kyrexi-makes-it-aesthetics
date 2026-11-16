# Evidence · Taste observations (TST)

Observations from people judging real pages, recorded in the skill's own words. Grade D by definition: they guide craft defaults, not research claims.

### TST-001 · A clear, conventional base wins; one relatable, useful, visitor-led moment adds engagement
- grade: D
- applies: Clean level (`art-direction.md`): every concept decision; the devil's advocate gimmick test
- not-for: Studio level, where a crafted concept may set the whole page (TST-002, ADR-014)
- value: base first (expected structure, clear type, calm palette, professional finish); at most one signature moment that is relatable to the audience's lived experience, useful, started by the visitor and contained in one component
- source: project owner's review of the smoke-baseline pages, 2026-11-13 · access: Unpublished · reuse: CC BY 4.0
- verified: 2026-11-13 full text (own data)
- caveats: one reviewer with a design/tech background, not blind to which arm made which page. Preferred the pages built without a design skill on every brief for their visual quality and clarity, while singling out moments from the pages built with Anthropic's frontend-design skill: the OMR-answer-sheet booking form for JEE/NEET students (nostalgic, relatable), wiping fog off the hero with the cursor and the clothesline of products for a monsoon streetwear drop, and the guided breathing exercise on the therapy page. The same review judged whole-page metaphors as weaker than the plain pages.

### TST-002 · Studio level: let one concept from the subject's world set type, palette, ornament and texture across the page
- grade: D
- applies: Studio level art direction (`art-direction.md` sections 2–3); sites that can be made from type, illustration and texture without special assets
- not-for: Clean level; concepts that make text hard to read or hide the next step
- value: a concept from the subject's materials or culture (a lined notebook with stamps and a certificate for a site that sells nothing; a red-lacquer tray, gold dragon line-art and a round tray of seven dishes for a Vietnamese family meal); a display face with character (handwritten or typewriter faces; a condensed display face) paired with a plain text face; ornament used at large scale behind the hero; small crafted details (stickers, stamps, labels, ruled paper); every section a different composition; no framework needed (one reference ships no JavaScript)
- source: nothingonpurpose.com and the-family-rice-tray.vercel.app, named by the project owner as targets · observed in headless Chrome at 1440 and 375 px, 2026-11-13 (screenshots kept local, not published) · access: Free-web · reuse: © (principles only; never copy layout, copy, code or assets)
- verified: 2026-11-13 observed (own observation)
- caveats: two sites, chosen by one person as models of quality, not a measured preference. Page weights 0.8 MB and 2.3 MB (mostly images); both honour `prefers-reduced-motion`; the cookie banner on the first offers "Essentials only" and "Accept all" as equal buttons.

### TST-003 · Studio level with assets: art-directed photography, video or 3D plus smooth, scroll-led motion carry experiential sites
- grade: D
- applies: Studio level when the client can supply or commission assets (`asset-brief.md`); product launches, automotive, food brands, film and culture
- not-for: briefs without an asset budget (use TST-002); audiences on slow networks without a lightweight path
- value: one hero asset that fills the screen (cut-out product jars floating over a large organic shape with circular text; luxury car photography; 3D renders); smooth scrolling with sections that reveal or scrub with the scroll; one 3D or WebGL moment used as the experience (discs that spin as a film archive; a playable racing scene); condensed or wide display type over imagery; an entry or intro screen that sets the mood
- source: agrumeafarm.it, a24.raviklaassens.com, forgeautomotive.co.uk, awards.racing and spykercars.com, named by the project owner as targets · observed in headless Chrome with timed, wheel-scrolled frames and script signals, 2026-11-13 (Lenis on three sites; Next.js or Nuxt; one three.js scene with physics) · access: Free-web · reuse: © (principles only)
- verified: 2026-11-13 observed (own observation)
- caveats: the look depends on professional assets the skill cannot make. Weights reached 8.6 MB and 12.3 MB, far above PERF budgets, and one site had no reduced-motion styles; this skill keeps its floors (poster frames, lazy loading, reduced-motion states). Some content was hidden behind intro gates in headless capture.

### TST-004 · Without imagery, scale and a subject-derived look, a correct page loses to the same model's unguided page
- grade: D
- applies: the visual quality gate (`art-direction.md` section 6); any temptation to leave sections text-only or show placeholders
- not-for: —
- value: a visual in every major section (drawn when no asset exists); a display-scale headline; palette and type from the subject, not one house look; missing facts kept off the visual surface
- source: project owner's review of the A3 pilot screenshots, 2026-11-13 · access: Unpublished · reuse: CC BY 4.0
- verified: 2026-11-13 full text (own data)
- caveats: one reviewer, not blind to the arms. Judged the skill's pages (v0.1, `b01c2df`) the worst and the no-skill pages the best, although the skill's pages had no invented facts and were lighter. Side-by-side reasons: no illustrations where the no-skill pages drew them, placeholder boxes in heroes, smaller headlines, and cream plus deep green/teal on five of six briefs.

### TST-005 · Studio level: make type and one flooded colour the hero; keep each screen to a few elements
- grade: D
- applies: Studio art direction (`art-direction.md` sections 3 and 7)
- not-for: Clean level heroes that must list facts at a glance; scripts whose display faces lack the needed glyphs (TYP, AUD rules)
- value: one short statement set at display scale (condensed or heavy grotesk, or a very light grotesk at huge size), allowed to crop at the viewport edge; mixed weights or outline for one word; a wordmark at full width in the footer; one brand colour flooding whole screens (neon lime, pink with red, yellow with blue, teal, cream) instead of appearing as a small accent; most screens hold one statement, one image and generous space, with complexity coming from scale and motion rather than component count
- source: Awwwards Sites of the Year list (https://www.awwwards.com/websites/sites_of_the_year/, read once 2026-11-13: 31 winners) and each winner's own site, observed in headless Chrome with timed and wheel-scrolled desktop frames, a 375 px frame and script signals (screenshots kept local, not published) · access: Free-web · reuse: © (principles only; never copy layout, copy, code or assets)
- verified: 2026-11-13 observed (own observation)
- caveats: about 20 of 31 winners were live and renderable; seen in Lando Norris, Don't Board Me, Mana Yerba Mate, KODE, The Other Side of Truth, Pangram Pangram, Opal Tadpole and Synchronized. Award juries reward desktop spectacle; visitors' preference was not measured. Consistent with LAY-001 and AUD-001 on low-to-moderate complexity.

### TST-006 · Tell the page as a story: one idea per screen, editorial composition, photography art-directed in layers, mobile recomposed
- grade: D
- applies: Studio art direction for brands, culture, products and causes; section order and composition
- not-for: task-first pages where the visitor needs a price or a form within one screen
- value: scroll as a timeline (a sentence per screen over a cinematic image; chapters of a documentary); text columns placed over imagery; small meta labels (indexes like 006/100, dates, coordinates, captions in small caps or mono); occasional rotated or vertical type; photography from the client art-directed as collage with depth, top-down flat lays of the maker's table or products, or full-bleed cinematic frames; the phone layout recomposed for its own frame (different crop, different order), not just stacked
- source: Awwwards Sites of the Year list (https://www.awwwards.com/websites/sites_of_the_year/, read once 2026-11-13: 31 winners) and each winner's own site, observed in headless Chrome with timed and wheel-scrolled desktop frames, a 375 px frame and script signals (screenshots kept local, not published) · access: Free-web · reuse: © (principles only; never copy layout, copy, code or assets)
- verified: 2026-11-13 observed (own observation)
- caveats: seen in Persepolis Reimagined, The Other Side of Truth, Lando Norris, Opal Tadpole, Koox, Frans Hals Museum, Star Atlas and Mana Yerba Mate (whose phone layout is a different composition). Photography is the client's (`asset-brief.md`).

### TST-007 · Spend spectacle on one moment: a branded intro, a playful gate or a small 3D world, always with a way past it
- grade: D
- applies: Studio motion signature (`art-direction.md` section 3.6); entry experiences; consent and age gates
- not-for: Clean level; visitors in a hurry or on slow networks without the fast path
- value: an intro that is part of the brand (a counter from 0 to 100, a logo on a flooded colour, a line drawing into a circle) lasting a few seconds and showing real progress; a playful entry (bounce a ball to get in) or a world as the concept (a tiny 3D planet whose buildings spell the name; a drivable 3D portfolio); consent and age gates designed in the brand with equal accept and reject buttons (ETH-008)
- source: Awwwards Sites of the Year list (https://www.awwwards.com/websites/sites_of_the_year/, read once 2026-11-13: 31 winners) and each winner's own site, observed in headless Chrome with timed and wheel-scrolled desktop frames, a 375 px frame and script signals (screenshots kept local, not published) · access: Free-web · reuse: © (principles only; never copy layout, copy, code or assets)
- verified: 2026-11-13 observed (own observation)
- caveats: seen in Lando Norris, Lusion, Synchronized, Pioneer, KODE, Nomadic Tribe, Don't Board Me, Messenger, Bruno Simon, Frans Hals Museum, Simply Chocolate and MA. In a browser without a GPU several stopped at their loader or reported "browser not supported". This skill requires: a skip control, no content hidden for no-JS or reduced-motion visitors, an intro under about 3 s, and a plain path to the content (A11Y-008, MOT rules).

### TST-008 · Spectacle has costs: weight, fragility and short lives; keep a light core that always works
- grade: D
- applies: stack choice and performance budget at Studio level (`stack-selection.md`, PERF rules); any WebGL or video-heavy plan
- not-for: —
- value: build the core page in plain HTML and CSS that loads fast and works without WebGL, then layer spectacle on top with poster frames, lazy loading and reduced-motion states; prefer static hosting and few dependencies so the site still works in five years
- source: Awwwards Sites of the Year list (https://www.awwwards.com/websites/sites_of_the_year/, read once 2026-11-13: 31 winners) and each winner's own site, observed in headless Chrome with timed and wheel-scrolled desktop frames, a 375 px frame and script signals (screenshots kept local, not published) · access: Free-web · reuse: © (principles only; never copy layout, copy, code or assets)
- verified: 2026-11-13 observed (own observation)
- caveats: desktop transfer of the live winners ranged 0.7–78.6 MB (median about 6.5 MB of 20); only 7 of 20 had `prefers-reduced-motion` rules readable by the page (cross-origin stylesheets could not be read, so this undercounts); 6 of 31 winners were gone or broken (server errors, parked or redirected domains, expired certificates); several WebGL sites did not render without a GPU. Compare PERF-001 and PERF-002.

### TST-009 · Judge like the jury and work like a studio: explore three directions, let a person choose, score Design, Usability, Creativity and Content
- grade: D
- applies: Studio art direction (`art-direction.md` sections 2 and 6); every build round
- not-for: small edits to an existing page (score only)
- value: three directions that differ in concept, mechanic and visual language, each prototyped as a first screen; the person picks; every round scored 1–10 on Design (40%), Usability (30%), Creativity (20%) and Content (10%), Studio target 8 weighted
- source: Awwwards, Evaluation System (official page: the four criteria and weights; at least 18 jurors with the 3 scores furthest from the average removed; honourable mentions from 6.5) · https://www.awwwards.com/about-evaluation/ · access: Free-web · reuse: ©
- source: Lim & Perrault 2024, Rapid AIdeation: Generating Ideas With the Self and in Collaboration With Large Language Models · arXiv 2403.12928 · access: OA · reuse: ©
- verified: 2026-11-14 standard text (Awwwards page); abstract (Lim & Perrault)
- caveats: the weights describe how one award jury scores, not what visitors prefer; self-scores by the building model are optimistic, so the person's choice of direction and review carry more weight. Lim & Perrault (21 participants): the LLM produced a greater variety of high-quality ideas, not necessarily higher in quality than people's. Studio process (Lusion: mood board and references, then concept prototypes in real code, then production; Active Theory: visual direction first, then three concepts each tied to a theme) comes from search summaries of their Medium articles, which refused automated access and were not read.
