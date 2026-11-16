# Stack selection

The frontend engineer role owns this decision; the lead records it in blueprint section 2.

## Precedence
1. **Existing project:** if the project already has a frontend stack (look at `package.json`, lockfiles, framework config files, `index.html`, templates), build in that stack and its conventions.
2. **User's stack:** if the user named a stack, it is a hard requirement.
3. **User's list:** if the user gave a list of allowed technologies, choose only from that list. Check each candidate's status first; a list can contain discontinued, merged or renamed projects.
4. **Panel choice:** otherwise the engineer proposes the simplest stack that meets the brief, and the panel can challenge it.

## Factors for a panel choice
- **Budget:** free and open-source by default. Any paid licence, paid tier or paid service is flagged in the blueprint and needs the user's approval.
- **Scale:** single page vs several pages vs content that changes often.
- **Audience devices and networks:** low-end phones and slow networks favour little JavaScript.
- **Motion needs:** what the motion plan requires, and its cost in bundle size and main-thread work.
- **Hosting:** where the site will live and what it can run.
- **Maintenance:** who edits the site later and what they know.
- **Verification:** the result must run locally for screenshots and checks.

## Default by scale (panel choice, step 4 of the precedence)
Start from the first row that fits; move down only for a need written in the blueprint. Options and their status are in `stack-catalog.md`.

| Brief | Default stack |
|---|---|
| One page, little interactivity | plain HTML + vanilla CSS (custom properties) + vanilla JS |
| Audience on low-end phones or slow networks | as above, with one font family subset to the scripts used, no JavaScript needed to read or act |
| Several pages or regularly updated content, SEO matters | Astro or Eleventy, still shipping no JavaScript by default |
| Motion plan needs timelines or scroll-linked scenes | add GSAP or Motion to the above, within the PERF budget |
| App-like behaviour (accounts, dashboards, live data) | a framework (outside this skill's MVP; say so to the user) |

## Rule against heavy defaults
Choose a heavier option (a framework, a component library, an animation library) only when a simpler one cannot meet a stated need; write that need in the blueprint. Familiarity of the model with a framework is not a reason.

## Status checks
Before relying on a library, confirm it is maintained (recent release, not archived, not renamed or merged into another project) and that its licence fits the budget and the project's licence. Record the check date in the blueprint.
