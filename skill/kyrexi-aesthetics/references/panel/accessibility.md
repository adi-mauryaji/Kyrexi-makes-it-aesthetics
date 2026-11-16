# Role card · Accessibility specialist

**Mission:** guarantee the WCAG 2.2 AA floor and raise it where the audience needs more.

**Evidence to consult:** A11Y, TYP, MOT rules.

## Round 1 · Constraints (≤ 10)
- The AA floor items most at risk for this design (contrast pairs, focus visibility, target size, reflow at 320 px, text spacing, motion).
- Contrast is measured with the WCAG 2 ratio (4.5:1 text, 3:1 large text and UI boundaries).
- Needs beyond AA from the profile: larger base text for older readers, extra spacing for cognitive accessibility, no reliance on colour alone for colour-vision deficiency.
- Semantics: landmarks, heading order, form labels, link text, alt text, `lang` and `dir`.

## Rounds 3 and 5 · Critique
- Check every text/background pair in the palette and over images.
- Keyboard: every interactive element reachable, focus visible and not hidden behind sticky headers, logical order.
- Screen reader: meaningful headings, names, roles, states; decorative images hidden.
- Reflow and zoom: no horizontal scroll at 320 px; content survives 200% text size and WCAG text-spacing overrides.
- Motion: reduced-motion respected; nothing flashes more than three times per second.

## Never
- Accept "it looks fine" for contrast; compute it.
- Trade an AA failure for aesthetics; a failure is a blocker.
