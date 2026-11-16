# Ethics guard

Persuade with clarity and honest benefit; never by pressure, hiding or trickery. This guard turns that rule (SKILL.md rule 3) into checks. The ux-ethics role owns it and the lead fixes what it finds. It runs on the blueprint (step 3 round 3, step 4 section 9) and on the built page (step 6). Evidence: `references/evidence/ethics.md` (ETH rules). This is a design check, not legal advice.

## 1. List every persuasive element
Before judging anything, list each element meant to move the visitor: calls to action, offers, prices, deadlines, counts, testimonials and logos, defaults (checkboxes, toggles, a preselected plan), paired choices (accept/decline, buy/skip), prompts and pop-ups, forms, and anything paid for by a third party. Judge each one; an element missing from the list is unchecked.

## 2. Attribute test (ETH-002)
Ask each question of each element. Any "yes" is a blocker until the panel removes it or shows a supplied fact that makes it honest (a real deadline the user gave).

| Attribute | Question |
|---|---|
| Asymmetric | Is one option easier, bigger, brighter or nearer than the option that is better for the visitor? |
| Restrictive | Is an option the visitor should have missing (no "No", no reject, no close)? |
| Covert | Would the element lose its effect if the page explained how it works? |
| Deceptive | Could it make a visitor believe something false (a deadline, stock, popularity, a price)? |
| Information-hiding | Is something the visitor needs to decide (total price, renewal, conditions) hidden, small or delayed? |
| Disparate treatment | Does it treat one group of visitors worse, or target people less able to resist (children, older adults, people in distress)? |

"It is mild" and "visitors will see through it" are not justifications (ETH-003).

## 3. Pattern checks for landing, marketing and portfolio pages
Names follow India's 13 specified patterns where one fits, since that list is the most explicit.

| Pattern | What it looks like here | Honest version | Rule | Helper |
|---|---|---|---|---|
| False urgency, fake scarcity | countdown that restarts, "only 3 left", "12 people viewing", "offer ends tonight" with no supplied deadline | a supplied date and what ends, or nothing | ETH-004 | `claims.py` urgency; `verify.mjs` live timer |
| Fake social proof | invented testimonials, ratings, client logos, "trusted by 10,000" | supplied, attributed quotes; otherwise none, and a handover note | ETH-005, ETH-001 | `claims.py` social proof |
| Drip pricing, hidden costs | "₹999*" with fees in small print or at checkout; price without period | total price including mandatory fees; period stated | ETH-006 | read the page |
| Basket sneaking, preselection | pre-ticked newsletter, donation, add-on, insurance or consent box | every box unticked | ETH-007 | `verify.mjs` pre-ticked |
| Confirm shaming | "No thanks, I don't want to save money", "Accept risk" | "No thanks" | ETH-008 | `claims.py` confirmshaming |
| Interface interference | bright "Accept all" next to a grey text link; no reject on the banner; "Ask me later" as the only decline | equal buttons on the same layer | ETH-008 | `verify.mjs` asymmetric choice, no reject |
| Subscription trap, SaaS billing | "Start free trial" with no price after the trial, renewal or cancel route | price per period, trial end, how to cancel, next to the call to action | ETH-009 | read the page |
| Disguised advertisement | affiliate links or paid placements that look like editorial picks | a visible "Ad", "Sponsored" or "Affiliate link" label | ETH-010 | read the page |
| Forced action, nagging | "free" download behind a phone number; pop-up on every page or scroll | say what sign-up the offer needs; one dismissible prompt that stays closed | ETH-011 | read the page |
| Trick question | "Uncheck to not stop receiving emails"; a "Continue" button that subscribes | a positive label that says what happens | ETH-012 | read the page |
| Bait and switch | a "from" price or product the business cannot supply | only supplied offers | ETH-013, ETH-001 | truth check |
| Rogue malware | fake virus or security warnings selling a fix | never; also no fear-based copy (ETH-008) | — | read the page |

## 4. Questions for what the table misses
Craft judgement (ungraded), for elements that fit no row above:
- **Golden rule:** would the team accept this nudge if it were aimed at them?
- **Disclosure:** could the page say how the element works without it losing its effect? (the covert attribute)
- **Exit:** is leaving, declining or cancelling at least as easy as joining?
- **Privacy default:** is the privacy-protective option the default, or at least as prominent?
- **Foreseeable harm:** would children, older adults, people with cognitive disabilities or people in distress be harmed? Less-educated people were more affected in Luguri & Strahilevitz (ETH-003); the CCPA weighed that many PhysicsWallah users were students, including minors (ETH-007).

## 5. Jurisdiction hooks
Take jurisdictions from the profile's "legal context" (the business's country and its visitors' countries). If unknown, apply all four: the rules overlap and the strictest reading is a good design default. Status as of 2026-11-13.

| Jurisdiction | Main texts | What changes on the page |
|---|---|---|
| India (IN) | CCPA Guidelines for Prevention and Regulation of Dark Patterns 2023 (Consumer Protection Act 2019 s. 18; 13 specified patterns; notified 30 Nov 2023); Consumer Protection (E-Commerce) Rules 2020 rule 4(9) (no consent through pre-ticked boxes); CCPA self-audit advisory to e-commerce platforms, 5 Jun 2025 | all 13 patterns are unfair trade practices; CCPA has fined pre-selected donations (₹5 lakh) and fear-based renewal buttons (₹1 lakh). The guidelines' scope clause was not read; treat them as applying to any page that sells to consumers in India |
| EU | Unfair Commercial Practices Directive 2005/29/EC (Annex I blacklist; Art. 7(4) total price); GDPR and ePrivacy consent as read by the EDPB (cookie taskforce 2023, Guidelines 03/2022); Digital Services Act Art. 25, which covers online platforms only (as described in the Commission's 2026 proposal) | no false deadlines, advertorials or false "free"; total price in any invitation to purchase; consent banners with a reject option on the first layer and no pre-ticked boxes |
| EU, pending | Digital Fairness Act proposal, COM(2026) 1100, 11 Nov 2026: a general ban on interfaces likely to deceive, manipulate or materially distort consumers (Art. 10) plus a blacklist of dark patterns (Annex I Part III); would repeal the UCPD | not law yet; re-check its status before relying on it |
| UK | DMCC Act 2024 Part 4 Chapter 1, in force for practices from 6 Apr 2025 (CMA207): Schedule 20 banned practices, s. 230 total price; UK GDPR and PECR reg. 6 for consent (ICO & CMA 2023) | banned practices can attract penalties up to the higher of £300,000 or 10% of worldwide turnover (CMA207); drip pricing prohibited; fake reviews banned; privacy choices presented evenly |
| US | FTC Act s. 5 (the FTC 2022 report's basis); ROSCA, 15 U.S.C. § 8403; Consumer Reviews and Testimonials Rule, 16 CFR Part 465 (2024); California CCPA regulations § 7004 (privacy choices) | no fake reviews or false claims; for subscriptions, material terms before billing details, express consent, simple cancellation; in California, symmetric privacy choices. The 2024 "click-to-cancel" rule was vacated in July 2025 (law-firm reports) |

A hook names the main texts; it does not clear a page under every law. When the page sells subscriptions, sets non-essential cookies or trackers, shows sponsored content, or targets children, add to the handover: "Confirm the [jurisdiction] rules for [feature] with someone qualified before launch."

## 6. Conversion mode
Use it when the user asks to maximise sales, sign-ups or conversions, or asks for aggressive or high-pressure marketing. Record it in the profile (`persuasion: conversion`, stated) and in the decision ledger. It changes how hard the page sells, never whether it tells the truth: rules 2 and 3 still bind, and every number, date, review and price comes from the fact list. The tactics are craft judgement; the rule IDs are the limits they must stay within.

### Use at full strength, with real data
| Tactic | Condition | Limit |
|---|---|---|
| Countdown to a deadline | the user supplied the date; the offer really ends then; the timer never restarts | ETH-004 |
| Stock or seat count | from the user's live data, or a fixed batch size the user gave | ETH-004 |
| Recommended plan, highlighted and preselected | the selected plan's full price is visible; nothing paid is added beyond the plan the visitor chooses to buy | ETH-006, ETH-007 |
| Price anchor and savings badge | the earlier price is one the business really charged recently; EU and UK rules define which earlier price counts (not read): add a handover note | ETH-013 |
| Reviews, ratings, client logos | supplied, attributed, with permission to show | ETH-005 |
| Upsell and cross-sell | clear price, unticked, one action to add and one to remove | ETH-007 |
| Exit-intent offer | once per visit; "No thanks" as visible as the offer | ETH-008, ETH-011 |
| Loss framing ("Don't miss the 30 Nov batch") | true; never shames the visitor who declines | ETH-008 |
| Strong hierarchy: sticky call to action, urgent colour, repeated call to action | wherever there is a choice, the decline or close path stays visible and equal | ETH-008 |

### Build, with a legal note in the handover
| Tactic | Condition | Limit |
|---|---|---|
| Decoy pricing (a third plan that makes another look better) | every plan is real and can be bought | ETH-013 |
| "Most popular" or "Best value" badge | a basis in the facts (sales data, the user's statement); otherwise no badge, and a handover note | ETH-005, ETH-001 |
| Offer or newsletter pop-up on time or scroll | once per visit; closes with a labelled control and stays closed | ETH-011 |
| Free trial that renews automatically | price after the trial, renewal and how to cancel, next to the call to action | ETH-009 |
| One retention offer when cancelling | skippable; cancelling completes without accepting it; rules differ by country | ETH-009 |

Note text: "Conversion mode used: [tactic]. Confirm the [jurisdiction] rules for it before launch."

### Never, even when asked
Fake or restarting timers; invented stock, viewer or buyer counts; fake or unattributed reviews, ratings or logos; prices without mandatory fees; pre-ticked add-ons, donations, consent or subscriptions; hidden auto-renewal, or cancelling made harder than signing up; shaming or fearful decline text; consent banners without a reject option; ads or paid placements without a label; fake security warnings. Each is a named deceptive practice in at least one of the four jurisdictions, most in all four (ETH-004 to ETH-013).

### When the user asks for a "never" item
1. Do not build it, not even as a hidden, optional, A/B or "test" variant.
2. Say why in one or two sentences: the rule and the jurisdictions where it is unlawful. Example: "A pre-ticked donation is basket sneaking, a specified dark pattern in India; it was part of the CCPA's ₹5 lakh penalty on PhysicsWallah (ETH-007)."
3. Build the closest honest version and show it:

| Request | Honest version |
|---|---|
| Countdown that restarts | countdown to the real launch or batch date, or "Enrolment closes 30 Nov" |
| "Only 3 left" without data | the real batch size ("30 seats per batch"), or a live count from the user's data |
| Made-up reviews | a review section designed and kept hidden until real quotes arrive, listed in the handover |
| "₹999*" with fees added later | "₹1,180 including all fees" |
| Pre-ticked add-on | unticked add-on with its benefit and price stated |
| "No, I hate saving money" | "No thanks" |
| Hidden auto-renewal | price per month, renewal stated, and where to cancel |

4. Record the request, the refusal and the replacement in the decision ledger and the handover, so the business owner sees them.

## 7. Output
- **Blueprint section 9:** one row per persuasive element: element · attribute test result · pattern checks passed · rule IDs · jurisdictions; state the persuasion mode (standard or conversion).
- **Build review (round 5):** each attribute or pattern hit is a blocker with its rule ID. Script output is read after the role has written its own findings (protocol round 5).
- **Handover:** the jurisdiction notes from section 5, the conversion-mode notes and refusals from section 6, and every missing fact that holds back a price, renewal term, deadline or testimonial.

## 8. Helpers and their limits
`python3 scripts/claims.py <text.txt> <facts>` flags urgency, scarcity, social proof and confirmshaming wording that the facts do not support. `node scripts/verify.mjs <page>` warns about pre-ticked checkboxes, accept/decline pairs that differ in size or fill, consent prompts without a reject option, and timers that change on screen. Both miss patterns inside images, flows that span several pages, prices and fine print, and most non-English wording. Read the whole page as well, including pop-ups, banners, collapsed sections and form messages.
