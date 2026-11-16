---
name: kyrexi-aesthetics
description: Designs and builds gallery-quality websites for a specific audience. Profiles the audience (age, locale, language and script, device, context, accessibility), sets an art direction from the subject's own world (concept, type, palette, ornament, imagery, motion), writes a detailed asset brief for the photos, video and 3D the client must supply, builds the page at full craft, then checks it against a visual quality gate and hard floors for accessibility, truth and ethics. Use when asked to design, redesign or build a landing page, marketing site or portfolio, to make a site look award-level, or to choose its colours, fonts, layout or motion.
license: Apache-2.0 for SKILL.md and scripts; CC-BY-4.0 for references
compatibility: Any agent that reads Agent Skills. Sub-agents and scripts are optional; every step has a single-context, no-script path.
metadata:
  version: "0.2.0"
  evidence-schema-version: "1"
---

# Kyrexi Aesthetics

Design a website the way a top studio would: find a concept in the subject's own world, give it a visual language with character, and build it with care. Then check it against hard floors so it is also accessible, honest and fair. The page must look at least as good as what you would make without this skill; the skill adds audience fit, truth and ethics, never a plainer page.

## Contents
1. Rules that never bend
2. Workflow (8 steps)
3. Panel and cost control
4. Reference files

## 1. Rules that never bend

These outrank every other consideration, including the user's taste and the panel's.

1. **Accessibility floor:** WCAG 2.2 level AA. Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI component boundaries), content reflows at 320 CSS px without horizontal scroll, visible keyboard focus, targets ≥ 24×24 CSS px, `prefers-reduced-motion` honoured, correct `lang` and `dir`.
2. **Truth:** claims come only from facts the user or brief supplied. Never invent numbers, customer counts, testimonials, logos, awards, prices, credentials or integrations, and never show a real person, product or place the user did not supply. Truth governs claims, not visuals: illustrations, icons, SVG/CSS art, generative graphics, type compositions and art-directed stand-ins are encouraged. Keep missing facts off the visual surface: leave the claim out or defer it honestly in the copy ("Ask us for the price"), mark it in code (`data-needed="…"`), and list it in the handover. Never show placeholder boxes to visitors.
3. **No deceptive patterns:** no fake urgency or scarcity, confirmshaming, hidden costs, preselected add-ons, sneaking items into a basket, obstruction to cancel, disguised ads, nagging, trick wording, or visual tricks that steer choices against the user's interest. Declining is as easy as accepting. Persuade with clarity and honest benefit (`references/ethics-guard.md`). When the user asks to maximise conversions, use conversion mode (guard section 6): the strongest honest persuasion, with real data. Its "never" items are refused even on explicit request; build the closest honest version instead and say why.
4. **Fair audience model:** never profile or design by race or ethnicity. Gender gets close to no weight. Demographic findings are adjustable starting values, never hard rules; individual differences are larger than group differences.
5. **No unearned authority:** a decision may say "research shows" only when it cites a rule ID with grade A or B. Everything else is labelled "craft judgement" or "creative choice". Claims graded Debunked are never a justification.

## 2. Workflow

Design first, guard second. Show the user the profile and the three directions (steps 1–2) and let them choose before building, unless they asked you not to stop.

### Step 1 · Intake → profile
Read `references/profile.md`. Fill every field from what the user said, the project and the brief, each marked **stated**, **inferred** or **assumed** with a confidence. Include the level (Clean or Studio), the assets the user has, and any reference sites. Ask only about fields that are unknown and decision-changing. Never ask about race.

### Step 2 · Art direction
Read `references/art-direction.md` and `references/evidence/taste.md`, and the taste memory if it exists (`scripts/memory.py show`). Choose the level and write the feeling brief (the offering, the visitor's moment, the feeling the first screen must create; art-direction section 3b), then explore three directions that differ in concept, mechanic and visual language; prototype only the first screen of each, score them with the award score, and let the user choose (art-direction section 2). For the chosen direction set the visual language: type with character, palette from the subject, ornament and texture, illustration fidelity, an imagery plan for every section, a motion signature and a site-wide motion system (`references/motion-craft.md`, `references/recipes.md`). Look up evidence only for the decisions it covers (colour, type, motion, audience files in section 4); `references/evidence-schema.md` explains grades.

### Step 3 · Asset brief
If the design uses photos, video or 3D the user has not supplied, write `design/asset-brief.md` with `references/asset-brief.md`: one detailed block per slot (subject, angle, lens, movement, light, colour, crop, technical specs, phone version, rights). The developer hands it to the client.

### Step 4 · Blueprint
Write `design/blueprint.md` with `references/blueprint-template.md`: art direction, tokens, layout, motion, asset slots, ethics check and a decision ledger (value, reason, rule IDs or "craft judgement").

### Step 5 · Build
Pick the stack with `references/stack-selection.md`. Build at full craft: display-scale type, the ornament system, hover and focus states, a favicon and share image. Every missing asset gets an art-directed stand-in in its final composition (`art-direction.md` section 5). Update the ledger when the build changes a value.

### Step 6 · Visual review
Capture screenshots and motion: `node scripts/verify.mjs <page.html | url> --out <dir> --motion` (it serves local files over localhost, so the page behaves as when hosted; `--motion` adds intro frames, a scroll film-strip in `motion-sheet.png`, a playable `motion/motion.html` and frame timing on a slow CPU). Score the award score, the visual gate and the motion gate (`art-direction.md` section 6) at 1440 and 375 px, and run the devil's advocate card on the screenshots and film-strip. Any 0 means another round; at most 3 rounds.

### Step 7 · Guards
1. Floors: read the `verify.mjs` blockers and warnings; check palette pairs with `python3 scripts/contrast.py <fg> <bg> …`; check keyboard order. Without the scripts, use the manual checklist in `references/evidence/a11y.md`.
2. Truth: `references/truth-check.md`, with `python3 scripts/claims.py <verify-dir>/text.txt <facts file>`, then read the page.
3. Ethics: `references/ethics-guard.md`; `verify.mjs` warns about pre-ticked boxes, lopsided choices, consent prompts without reject and live timers.
4. Fix without flattening: keep the concept, type and imagery; fix a contrast failure by adjusting tone or adding a backing shape, a motion problem with a reduced-motion state, a claim by removing or deferring it. Re-check the visual gate if a fix changed the look. At most 2 fix rounds.

### Step 8 · Hand over
Record the person's verdicts in the taste memory (`scripts/memory.py add`), then hand over the page, the blueprint, the asset brief with its slot IDs, the missing facts (`data-needed` list), the assumptions to confirm, and the jurisdiction notes from the ethics guard.

## 3. Panel and cost control

- **Default (lite):** you design as the lead (`references/panel/lead-visual.md`). Reviews use three cards: devil's advocate in step 6, accessibility and ux-ethics in step 7. Read a card only when its step comes.
- **Full panel** (the user asks for it, or the project is a multi-page site): run `references/panel/protocol.md` rounds with all role cards, in sub-agent mode (roles in parallel, each with only the brief, profile, draft or screenshots and its own card) or single-context mode (roles one after another, each written up before the next).
- Spend effort on visual rounds, not on documents: keep the blueprint ledger to decisions that matter, and each role's findings to 12 items.

## 4. Reference files

Read a file only when its step needs it.

| File | Read at |
|---|---|
| `references/profile.md` | Step 1 |
| `references/art-direction.md` | Steps 2, 5, 6 |
| `references/evidence/taste.md` | Step 2; step 6 |
| `references/motion-craft.md` | Step 2 (motion signature and system); steps 5, 6 |
| `references/recipes.md` | Steps 2 (directions), 5 (build): technique skeletons with their floors |
| `references/asset-brief.md` | Step 3; step 5 (stand-ins) |
| `references/blueprint-template.md` | Step 4 |
| `references/evidence-schema.md` | Step 2, when citing a rule |
| `references/evidence/colour.md` | Step 2 (palette) |
| `references/evidence/type.md` | Step 2 (type, script) |
| `references/evidence/motion.md` | Step 2 (motion signature); step 7 |
| `references/evidence/audience.md` | Steps 1, 2 |
| `references/evidence/first-impression.md` | Step 2 |
| `references/evidence/layout.md` | Step 2 |
| `references/evidence/shape.md` | Step 2 |
| `references/evidence/myths.md` | Step 2: claims never used as reasons |
| `references/stack-selection.md` | Step 5 |
| `references/stack-catalog.md` | Step 5, when choosing or checking a library |
| `references/evidence/perf.md` | Steps 5, 7 |
| `references/evidence/a11y.md` | Step 7 |
| `references/truth-check.md` | Steps 1 (facts), 7 |
| `references/ethics-guard.md` | Steps 1 (legal context), 4 (blueprint section 9), 7 |
| `references/evidence/ethics.md` | Step 7 |
| `references/panel/lead-visual.md` | Steps 2, 5 (you, as the lead) |
| `references/panel/devils-advocate.md` | Step 6 |
| `references/panel/accessibility.md` | Step 7 |
| `references/panel/ux-ethics.md` | Step 7 |
| `references/panel/protocol.md` | Full panel only |
| `references/panel/psychologist.md` | Full panel only |
| `references/panel/culture.md` | Full panel only; step 2 for an unfamiliar locale or script |
| `references/panel/motion.md` | Full panel only; step 2 for a Studio motion signature |
| `references/panel/engineer.md` | Full panel only; step 5 for 3D, video scrubbing or a framework |

Scripts (optional; every check has a manual path). Paths are relative to this skill's folder: run them as `node <skill folder>/scripts/verify.mjs …` (in Claude Code, `${CLAUDE_SKILL_DIR}/scripts/…`), from the user's project so outputs land there.

| Script | Needs | Does |
|---|---|---|
| `scripts/verify.mjs` | Node ≥ 22, Chrome or Chromium | serves a local page over localhost; screenshots at 5 widths, automated floor checks, page weight and font budget, deceptive-pattern, anti-slop and visible-placeholder warnings, visible text (`text.txt`); `--motion` runs `scripts/motion.mjs` (film-strips, flipbook, frame timing, animated properties, reduced-motion leaks); exit 1 on blockers |
| `scripts/contrast.py` | Python 3 | WCAG 2.2 contrast for colour pairs (hex, rgb, oklch) |
| `scripts/palette.mjs` | Node ≥ 22, Chrome or Chromium | real colours from reference images: k-means in OKLab, shares, OKLCH, contrast with white and black, suggested dominant/support/accent |
| `scripts/memory.py` | Python 3 | taste and structure memory: record kept/rejected choices, show them, flag a page structure that repeats recent builds |
| `scripts/claims.py` | Python 3 | numbers and risky phrases (including urgency and confirmshaming) in the page text that the facts do not support; exit 1 if any |
