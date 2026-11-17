# Audience profile

Fill this at intake. Every value carries a **basis** (stated by the user, inferred from the project or brief, or assumed) and a **confidence** (high, medium, low). Low-confidence values that change major decisions become questions for the user.

## The one intake question (step 1)
Read the project first (files, existing site, brand files, an assets folder, links), so the question only asks what you could not find. Ask it once, in the user's language, with a default:

> Before I design, two quick things. **1. Your idea:** do you have a direction, references or sites you like? **2. Your assets:** do you have a logo, brand colours or fonts, photos, video or 3D I should use? (I found: <what the project already has>.) If not, say "go ahead": I will choose the direction myself, and after you pick one of three designs I will tell you exactly which photos and videos it needs and how to get them.

Record the answers in `references` and `assets available` below; "go ahead" means work from the brief and the defaults.

Demographic research describes group averages that explain a small share of individual preference. Treat any group-based adjustment as a starting value the panel may override with a stated reason.

## Fields

```markdown
## Project
- type: <landing page | marketing site | portfolio | other>
- subject: <what the site is about, in one line>
- primary action: <the one thing a visitor should do>
- secondary actions: <…>
- existing assets: <logo, brand colours, fonts, photos, copy, existing site>  · basis · confidence

## Audience (repeat per segment, primary first)
- segment: <name>
- age band: <e.g. 16–24, 25–44, 45–64, 65+>  · basis · confidence
- locale and language: <country/region, language(s)>  · basis · confidence
- script and direction: <Latin, Devanagari, Arabic (RTL), CJK, Tamil, …>  · basis · confidence
- devices and network: <mobile share, low-end devices, slow networks>  · basis · confidence
- context of use: <time pressure, environment, emotional state, first visit or returning>  · basis · confidence
- domain expertise: <novice | intermediate | expert in the subject>  · basis · confidence
- literacy and education: <general reading level; only when it changes copy or density>  · basis · confidence
- accessibility needs: <low vision, colour-vision deficiency, motion sensitivity, cognitive, motor, screen reader>  · basis · confidence

## Brand and tone
- level: <Clean | Studio>  · basis (`art-direction.md` section 1)
- references: <sites or images the user likes or dislikes, and what about each>
- assets available: <photos, video, 3D, illustrations, brand files; quality and rights>  · basis
- personality: <3–5 adjectives>  · basis · confidence
- must feel like / must not feel like: <…>

## Constraints
- budget: <₹0 / free tier only, or the stated amount>
- stack: <existing stack, or user's stack, or user's allowed list, or none>
- hosting: <…>
- deadline and scale: <pages, sections, content volume>
- legal context: <jurisdictions that matter for consumer and accessibility law: the business's country and its visitors' (IN, EU, UK, US hooks in `ethics-guard.md`); subscriptions, cookies or trackers, sponsored content, child visitors>
- persuasion: <standard | conversion (only when the user asks to maximise sales or sign-ups; `ethics-guard.md` section 6)>  · basis

## Facts available
- <every fact the copy may use: names, offers, prices, numbers, quotes, credentials>
- missing facts the page would normally need: <missing facts: kept off the page, marked `data-needed` in code, listed in the handover>
```

## Never collected
- Race or ethnicity, religion, caste, or any other protected trait as a design input.
- Gender as more than a near-zero adjustment.

## Starting values
Use the starting-value table at the end of `evidence/audience.md`: at most one step from the default per signal, only for profile values stated or inferred with at least medium confidence, each recorded in the decision ledger. Where no row fits, the panel decides with a stated reason.
