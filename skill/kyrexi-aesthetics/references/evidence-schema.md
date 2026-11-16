# Evidence schema (version 1)

How every research-based rule in this skill is written, graded and cited. The blueprint cites rules by ID, so a reader can trace any design value back to its source.

## Grades

| Grade | Meaning | Blueprint may say |
|---|---|---|
| **A** | Meta-analysis, systematic review, large replicated finding, or a binding standard or law | "research shows" / "required by" |
| **B** | One well-powered peer-reviewed study, several consistent smaller ones, or large practitioner research with a disclosed method | "research shows" |
| **C** | Single small study, preprint, vendor or self-reported research, or a design-system convention | "some evidence suggests" |
| **D** | Craft heuristic, expert opinion, or synthesis without primary data | "craft consensus" |
| **Contested** | Credible sources disagree | "evidence is mixed; chosen because …" |
| **Debunked** | Failed replication or null meta-analysis | never used as a reason; listed so the panel can refuse it |

An entry whose source has not been checked against the primary text (`verified: no`) counts as grade C at most, whatever its `grade` field says.

## Rule IDs

`<PREFIX>-<NNN>`, numbered in order of creation and never reused.

| Prefix | Dimension |
|---|---|
| FI | First impression, overall appeal |
| LAY | Layout, hierarchy, density, complexity |
| SHP | Shape, curvature, corner radius |
| COL | Colour |
| TYP | Typography and readability |
| MOT | Motion, animation, scrolling |
| AUD | Audience differences (age, locale, script, expertise, device, context) |
| A11Y | Accessibility floors |
| PERF | Performance and perceived speed |
| ETH | Ethics, deceptive patterns, consumer law |
| CRA | Craft defaults (grade D by definition) |
| TST | Taste observations from rated galleries (grade D by definition) |
| MYTH | Popular claims graded Contested or Debunked |

## Entry format

```markdown
### <ID> · <rule as a short imperative>
- grade: A | B | C | D | Contested | Debunked
- applies: <when this rule should be used>
- not-for: <when it should not be used, or "—">
- value: <the concrete default or range, if the rule sets one>
- source: <Author(s) year, title> · <venue> · <DOI or URL> · access: OA | Free-web | Lend | PW | Paid | Unpublished · reuse: © | <licence>
- verified: <YYYY-MM-DD> <full text | abstract | standard text> | no
- caveats: <sample limits, effect size, conflicts with other IDs>
```

Fields are one line each so the files can be searched with grep. A rule with several sources lists each on its own `source:` line.

## Access and reuse codes

- **OA** free legal full text · **Free-web** free to read, all rights reserved · **Lend** borrowable older edition · **PW** paywalled · **Paid** purchase or subscription · **Unpublished** this project's own evaluation records, not in the public repository, so readers cannot check them.
- **reuse: ©** means paraphrase and cite only; never copy wording, figures or screenshots. A named licence (e.g. CC BY 4.0, OGL v3, CC0) may allow adaptation with attribution; follow its terms.

## Worked example

```markdown
### AUD-001 · Keep visual complexity low-to-moderate; over-complexity costs more than under-complexity
- grade: B
- applies: any website first impression, all audiences
- not-for: expert tools where users already know the layout
- value: aim below the population's peak complexity; never compensate a weak concept with more elements
- source: Reinecke & Gajos 2014, Quantifying Visual Preferences Around the World · CHI 2014 · 10.1145/2556288.2557052 · access: OA · reuse: ©
- verified: 2026-11-11 full text
- caveats: ~40k online volunteers, 430 screenshots at 500 ms; appeal fell much more from peak to high complexity (d = 2.0) than to low (d = 0.6); demographics explain ~7% of variance (marginal R² 0.07), so group shifts are starting values only
```
