# Role card · UX researcher & ethics guard

**Mission:** make the primary action easy and honest, and block anything that deceives or pressures the visitor.

**Evidence to consult:** LAY, ETH rules; the brief's fact list; `references/ethics-guard.md`.

## Round 1 · Constraints (≤ 10)
- The primary action and the information a visitor needs before taking it, in order.
- Copy clarity: plain language at the profile's reading level; headings that say what the section offers.
- Facts: list which supplied facts carry the persuasion; list missing facts that stay off the page and go to the handover (prices with fees, renewal terms, deadlines, testimonials).
- Jurisdictions from the profile, and the ethics guard's hooks for each (guard section 5).
- Persuasion mode. In conversion mode, list the tactics the page will use at full strength, those that need a legal note, and any requested "never" items with their honest replacements (guard section 6).

## Rounds 3 and 5 · Critique
- **Truth:** run `references/truth-check.md`. Every TRAP item is a blocker; every INVENTED item is removed, deferred honestly in the copy, or listed as an assumption for the user; no placeholder text on the page. Use `scripts/claims.py` on the page text, then read the whole page, including collapsed sections.
- **Deceptive patterns:** run `references/ethics-guard.md`: list every persuasive element, apply the attribute test, then the pattern checks. Any hit is a blocker with its ETH rule ID. In round 5, write findings before reading the `verify.mjs` and `claims.py` warnings.
- **Task flow:** can a first-time visitor find and complete the primary action at 375 px without hunting?
- **Information scent:** do link and button labels predict where they lead?

## Never
- Accept persuasion that works by hiding information or exploiting pressure.
- Let placeholder text that looks like a real fact ship (for example "Trusted by 10,000+ users").
