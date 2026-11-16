# Blueprint template

Copy this structure into the user's project (default `design/blueprint.md`). Values must be concrete enough that a different agent could build the same page from the blueprint alone.

```markdown
# Blueprint · <project>
date · skill version · level (Clean | Studio) · panel mode (lite | full: sub-agent or single-context)

## 0. Profile summary
Primary segment, primary action, locale/script/direction, devices, accessibility needs, key constraints. Link the full profile.

## 1. Art direction
- Feeling brief: offering · visitor's moment · the feeling within three seconds, and what would kill it.
- Directions explored: A, B, C, each with its concept sentence, mechanic, visual language and award score; which one the user chose and why.
- Concept: one sentence, "The page is [a thing from the subject's world] for [the audience]", and why it fits.
- Reference board: 3–6 lines, what each reference does that this page also does (principles, not copies).
- Visual language: display and text type, palette (dominant, support, accent), ornament and texture system, motion signature.
- Imagery plan: one row per section: section → visual (supplied asset, asset slot ID with its stand-in, illustration, SVG/CSS art, diagram, type composition).
- What stays conventional (so it is easy to use) and what is distinctive (so it is memorable).
- Motion system: one row per element type (`motion-craft.md` section 7).
- Award score (Design, Usability, Creativity, Content, weighted), visual gate and motion gate scores per round (`art-direction.md` section 6).

## 2. Stack
Path taken (existing | user's stack | user's list | panel choice), the stack, and why. Paid items flagged.

## 3. Tokens
- colour: role → value (OKLCH and hex) → contrast against its pair → reason
- type: families (with script coverage), scale, weights, line-height per script, measure, loading strategy
- spacing: base unit and scale
- shape: corner radii, borders, elevation
- imagery and iconography: style, sources, licence; asset slots and their brief (`design/asset-brief.md`)

## 4. Layout and hierarchy
Section order with each section's job; above-the-fold content at 375 px and 1280 px; grid; density and complexity target; reading direction.

## 5. Motion and scroll
What moves, why (orientation, feedback, explanation, delight), duration and easing, triggers, reduced-motion fallback, scroll behaviour.

## 6. Content
Copy tone, headline and CTA wording, facts used (each from the fact list), missing facts (`data-needed` spots, listed for the handover), assumptions the user must confirm (truth check).

## 7. Accessibility plan
How each WCAG 2.2 AA floor is met; anything beyond AA chosen for this audience.

## 8. Performance budget
LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on the target devices; page weight; font budget (PERF-003) and font subsets; image strategy.

## 9. Ethics check
Run `references/ethics-guard.md`. One row per persuasive element:
| Element | Attribute test | Pattern checks | Rule IDs | Jurisdictions |
Then the jurisdiction notes for the handover (guard section 5).

## 10. Decision ledger
| # | Decision | Value | Reason | Rule IDs | Grade | Role |
|---|---|---|---|---|---|---|

## 11. Panel record
Conflicts raised, how each was resolved, and by which precedence step.

## 12. Verify plan
Viewports, checks, tools available, acceptance criteria for this page.
```
