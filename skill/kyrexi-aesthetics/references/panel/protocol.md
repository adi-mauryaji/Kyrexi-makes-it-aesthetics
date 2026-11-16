# Panel protocol

One lead designs; specialists set constraints and critique. A single author keeps the design coherent (a committee averaging eight proposals produces a bland page), while independent critics catch what one author misses.

## Roster

| Role | Card | Rounds |
|---|---|---|
| Lead (visual & brand designer, also moderator) | `lead-visual.md` | 2, 4, 6 |
| Audience psychologist | `psychologist.md` | 1, 3, 5 |
| Culture & locale expert | `culture.md` | 1, 3 |
| Motion & interaction designer | `motion.md` | 1, 3, 5 |
| Accessibility specialist | `accessibility.md` | 1, 3, 5 |
| UX researcher & ethics guard | `ux-ethics.md` | 1, 3, 5 |
| Frontend engineer | `engineer.md` | 1, 3, 5 |
| Devil's advocate | `devils-advocate.md` | 3, 5 |

The main agent plays the lead. In sub-agent mode every other role is a separate sub-agent.

## Rounds

1. **Constraints.** Each listed role reads the brief and profile and returns at most 10 constraints for its discipline: what the design must do or must avoid for this audience, each with a rule ID or "craft judgement", plus questions only the user can answer.
2. **Draft.** The lead writes blueprint v1 within all constraints, including the concept (blueprint section 1). Where two constraints conflict, the lead picks one using the precedence below and notes it.
3. **Critique.** Each listed role reviews blueprint v1 independently and returns findings (format below).
4. **Resolve.** The lead accepts, adapts or rejects each finding using the precedence below, records every conflict in blueprint section 11, and produces blueprint v2. Blockers cannot be rejected; they are fixed or escalated to the user.
5. **Build review.** After the build, the listed roles review screenshots at all viewports and the code. Deterministic checks (contrast, overflow, accessibility and performance tools) run now, but their output is opened only after the roles have written their findings, so the tools do not anchor the judgement.
6. **Fix.** The lead fixes blockers and majors, then repeats round 5 once if anything changed. At most 2 fix iterations; remaining issues go to the user with reasons.

## Precedence for conflicts

1. **Hard floors:** accessibility floor, truth, no deceptive patterns, fair audience model (SKILL.md section 1), and the user's explicit requirements.
2. **Evidence:** a higher-graded rule beats a lower-graded one (A > B > C > D). Contested rules need a stated reason. Debunked claims lose to everything.
3. **Audience fit:** a choice derived from this profile beats a generic default.
4. **Level:** when 1–3 do not decide, follow the level in `art-direction.md`. Clean: keep the page clear and expected, and spend distinctiveness on one signature moment (TST-001, FI-001). Studio: keep the concept, as long as reading and the next step stay easy (TST-002). At either level, a plainer page is not a safer page (TST-004).

This full protocol runs only when the user asks for the full panel or the project is a multi-page site; otherwise SKILL.md section 3 (lite) applies.

## Finding format

```markdown
- [blocker | major | minor] <where: section, token, component or viewport>
  issue: <what is wrong, for whom>
  basis: <rule ID and grade, or "craft judgement">
  fix: <concrete change>
```

Blocker = breaks a hard floor or the primary action. Major = clearly hurts the primary audience. Minor = polish.

## Independence
- Sub-agent mode: each role gets only the brief, profile, current blueprint or screenshots, and its own card.
- Single-context mode: before each role, re-read only those inputs and that role's card; do not look at earlier roles' findings in the same round. Write each role's findings under its own heading before starting the next role.
