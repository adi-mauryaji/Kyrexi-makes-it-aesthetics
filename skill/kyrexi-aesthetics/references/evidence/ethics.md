# Evidence · Ethics, deceptive patterns and consumer law (ETH)

Verified against the sources' text on 2026-11-13. `references/ethics-guard.md` applies these rules. The legal entries say what the named texts require. They are not legal advice, and each names the main texts, not every law that may apply.

Not read directly: EUR-Lex (the UCPD as amended in 2019, the Consumer Rights Directive, the DSA, the Planet49 judgment) and legislation.gov.uk (the DMCC Act) refused automated access; the UK Act was read through the CMA's statutory guidance (CMA207) instead. consumeraffairs.nic.in refused connections, so the CCPA guidelines' own text was not read: the 13 pattern names come from Government of India press releases (PIB), and their definitions are not quoted here. A hook marked "name only" or "not read" never carries a rule on its own.

### ETH-001 · Expect AI-built pages to invent operating details; check every page against the fact list
- grade: C
- applies: every build, before handover
- not-for: —
- value: run the truth check (`references/truth-check.md`); zero TRAP items, every INVENTED item removed, kept off the page as a missing fact, or listed for the user to confirm
- source: Kyrexi Aesthetics smoke baseline · project evaluation records · 2026-11-12 · access: Unpublished · reuse: CC BY 4.0
- verified: 2026-11-12 full text (own data)
- caveats: 6 briefs × 2 arms × 1 seed; one model (Claude Opus 5.5) for builders and grader; blind grading by a model, not yet checked by a person. Without a skill: 0 traps, 16 invented claims across 6 pages; with Anthropic's frontend-design skill: 1 trap ("so sizes go fast"), 26 invented, including 6 product names and per-item prices on one page. Neither arm invented testimonials, ratings or counts. A direction, not an effect size.

### ETH-002 · Test every persuasive element for a dark attribute; any attribute blocks it until the panel can justify it
- grade: D
- applies: every persuasive element in the blueprint and the build: urgency, scarcity, social proof, defaults, paired choices, prices, forms, prompts, offers
- not-for: —
- value: an element is dark if it is asymmetric (puts unequal burdens on the options), restrictive (removes options the visitor should have), covert (hides how it influences), deceptive (induces false beliefs), information-hiding (hides or delays what the visitor needs), or treats one group of visitors worse (disparate treatment). Name its high-level type (obstruction, sneaking, interface interference, forced action, social engineering) to find the legal hook
- source: Mathur, Mayer & Kshirsagar 2021, What Makes a Dark Pattern… Dark? Design Attributes, Normative Considerations, and Measurement Methods · CHI 2021 · 10.1145/3411764.3445610 · access: OA (arXiv 2101.04843) · reuse: ©
- source: Gray, Bielova, Santos & Mildner 2023, An Ontology of Dark Patterns: Foundations, Definitions, and a Structure for Transdisciplinary Action · arXiv 2309.09640 · access: OA · reuse: © (paraphrase only)
- verified: 2026-11-13 full text (Mathur 2021); full text (Gray, arXiv preprint; the revised CHI 2024 version was not read)
- caveats: conceptual frameworks, not experiments. They say what to look for, not how much harm a pattern does (ETH-003). The ontology preprint gives 64 types in its abstract and other counts in its text; only its five high-level types are used here. Disparate treatment is the attribute the 2021 paper adds to the earlier five.

### ETH-003 · Block dark patterns before launch: mild ones work without backlash, and most people do not notice them
- grade: B
- applies: any argument for keeping a persuasive element, including "visitors will notice and leave" or "it is only a nudge"
- not-for: —
- value: no element stays because it is mild or because visitors could see through it. Mild patterns are the main risk because they raise compliance without annoying anyone
- source: Luguri & Strahilevitz 2021, Shining a Light on Dark Patterns · Journal of Legal Analysis 13(1):43–109 · 10.1093/jla/laaa006 · access: OA · reuse: ©
- source: Di Geronimo, Braz, Fregnan, Palomba & Bacchelli 2020, UI Dark Patterns and Where to Find Them: A Study on Mobile Applications and User Perception · CHI 2020 · 10.1145/3313831.3376600 · access: OA (author copy) · reuse: ©
- source: Mathur, Acar, Friedman, Lucherini, Mayer, Chetty & Narayanan 2019, Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites · Proc. ACM HCI 3 (CSCW), article 81 · 10.1145/3359183 · access: OA (arXiv 1907.07032) · reuse: ©
- source: FTC 2024, FTC, ICPEN, GPEN announce results of review of use of dark patterns affecting subscription services, privacy · press release, July 2024 · https://www.ftc.gov/news-events/news/press-releases/2024/07/ftc-icpen-gpen-announce-results-review-use-dark-patterns-affecting-subscription-services-privacy · access: OA · reuse: US government work
- verified: 2026-11-13 full text (Di Geronimo, Mathur 2019); Luguri & Strahilevitz Study 1 sections read on the journal page (Study 2 results not read); FTC release read by a reading agent
- caveats: Luguri & Strahilevitz Study 1 (census-weighted US sample, N = 1,963): 11.3% accepted a dubious paid plan in the control, 25.8% with mild patterns and 41.9% with aggressive ones; the mild condition caused no measurable backlash, the aggressive one did; less-educated participants were more affected. Di Geronimo: 95% of 240 popular Android apps had at least one dark pattern, and most of 589 users did not recognise them. Mathur 2019: 1,818 instances of 15 types on about 11K shopping sites, 183 sites with deceptive ones, 22 third-party vendors selling them ready-made. ICPEN 2024: nearly 76% of 642 subscription sites and apps had at least one possible dark pattern and nearly 67% several ("possible", not legal findings). US samples and mostly US/EU sites; for India the evidence is enforcement, not measurement.

### ETH-004 · Show urgency or scarcity only when it is true, specific and supplied; never a timer that resets or an invented deadline
- grade: A
- applies: deadlines, countdowns, "limited" offers, stock or seat counts, "others are viewing", launch and sale banners
- not-for: a real, supplied deadline stated plainly (date, time zone, what ends)
- value: a deadline appears only if the user supplied it. It states the date and what ends, and the offer really ends then. No timers that restart, no "almost gone" without supplied stock numbers, no live-viewer counts. `claims.py` flags the wording; `verify.mjs` flags live timers
- source: CCPA India 2023, Guidelines for Prevention and Regulation of Dark Patterns ("False Urgency", one of 13 specified patterns) · name read in PIB release 2146813, 22 Jul 2025 · https://www.pib.gov.in/PressReleasePage.aspx?PRID=2146813 · access: Free-web · reuse: ©
- source: Directive 2005/29/EC (Unfair Commercial Practices Directive, UCPD), Annex I point 7 · OJ L 149, 11.6.2005 · https://commission.europa.eu/system/files/2018-05/unfair-commercial-practices-directive-2005-29-ec_en.pdf · access: OA · reuse: ©
- source: CMA 2025, Unfair commercial practices (CMA207), banned practice 7 (DMCC Act 2024, Schedule 20) · 18 Nov 2025 · https://assets.publishing.service.gov.uk/media/691b9bd821ef5aaa6543ee6f/Unfair_commercial_practices_CMA207_18_Nov_2025__2_.pdf · access: OA · reuse: OGL v3
- source: FTC 2022, Bringing Dark Patterns to Light (staff report), section I p. 4 and Appendix A · https://www.ftc.gov/reports/bringing-dark-patterns-light · access: OA · reuse: US government work
- verified: 2026-11-13 standard text (UCPD 2005 text, CMA207, FTC); name only (CCPA)
- caveats: the UK and EU texts ban falsely saying an offer is available only for a (very) limited time to force an immediate decision. CMA207's example is a countdown that restarts when it runs out; a true end date is "unlikely to be problematic" unless a near-identical offer follows soon after. The EU text read is the 2005 original; the consolidated text was not reachable. Luguri & Strahilevitz report that countdown timers did not significantly raise acceptance in their Study 2 (from the paper's introduction). Fake urgency is unlawful whether or not it works.

### ETH-005 · Never fake or invent reviews, testimonials, ratings or popularity signals
- grade: A
- applies: testimonials, star ratings, review counts, client logos, "X people bought this", follower or view counts
- not-for: real reviews and testimonials the user supplied, shown with their source
- value: only supplied, attributable quotes; incentivised reviews say so; no invented ratings, counts or viewer numbers. Missing ones are left out and listed in the handover (truth check TRAP class, ETH-001)
- source: FTC 2024, Trade Regulation Rule on the Use of Consumer Reviews and Testimonials, 16 CFR Part 465 (§ 465.2 fake or false reviews and testimonials; § 465.8 fake indicators of social media influence) · 89 FR 68077, 22 Aug 2024 · https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465 · access: OA · reuse: US government work
- source: CMA 2025, CMA207, banned practice 13 (DMCC Act 2024, Schedule 20 paragraph 13: fake reviews and concealed incentivised reviews) · as ETH-004
- source: FTC 2022, Bringing Dark Patterns to Light, section I p. 4 (false claims that other people are looking at or have bought the product) · as ETH-004
- verified: 2026-11-13 standard text
- caveats: EU: the fake-review points added to UCPD Annex I in 2019 were not read. India: CCPA orders cite misleading advertisement under the Consumer Protection Act 2019 s. 2(28) (PIB release 2268302), but no Indian text specific to reviews was read.

### ETH-006 · Show the full price wherever a price appears: every mandatory fee and tax in the headline number
- grade: A
- applies: pricing sections, offer banners, product cards, booking and plan pages
- not-for: optional extras, which are shown as optional next to the price
- value: the most prominent price is what the visitor must pay. Recurring prices state the period ("₹499 per month"). Charges that cannot be known yet (delivery to an unknown address) are named as possible extra charges
- source: CMA 2025, CMA207 chapter 4 (DMCC Act 2024 s. 230(2)(b) and (4): total price including mandatory fees; drip pricing prohibited) · as ETH-004
- source: Directive 2005/29/EC (UCPD), Article 7(4)(c): in an invitation to purchase, the price inclusive of taxes and any additional delivery charges · as ETH-004
- source: FTC 2022, Bringing Dark Patterns to Light, section II p. 8 (drip pricing) · as ETH-004
- source: CCPA India 2023 ("Drip Pricing") · name read in PIB release 2146813 · as ETH-004
- verified: 2026-11-13 standard text (CMA207, UCPD, FTC); name only (CCPA)
- caveats: the UK rule covers any "invitation to purchase", including an advert or landing page that names a price, and leaving out the required information is unlawful whatever its effect on decisions (CMA207). The FTC report quotes a ticketing study in which visitors not shown fees upfront spent about 20% more and were 14% more likely to complete the purchase. Sector rules (US fees rule for live events and lodging, EU air fares) were not read.

### ETH-007 · Start every consent, add-on, donation and subscription box unticked; ask for an affirmative action
- grade: A
- applies: checkboxes and toggles in forms, sign-up, checkout, cookie or tracking prompts, newsletter opt-ins, donations, insurance or "protection" add-ons
- not-for: display settings that only serve the visitor and cost nothing, stated plainly
- value: unticked by default; ticking is the visitor's own action; the label says exactly what ticking does and what it costs. `verify.mjs` lists pre-ticked boxes
- source: PIB release 2268302, CCPA penalises PhysicsWallah and McAfee for dark patterns · 3 Jun 2026 · https://www.pib.gov.in/PressReleasePage.aspx?PRID=2268302 · access: Free-web · reuse: ©
- source: EDPB 2023, Report of the work undertaken by the Cookie Banner Taskforce (type B, pre-ticked boxes) · adopted 17 Jan 2023 · https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf · access: OA · reuse: ©
- source: ICO & CMA 2023, Harmful design in digital markets (joint position paper; "default settings") · https://www.drcf.org.uk/siteassets/drcf/pdf-files/harmful-design-in-digital-markets-ico-cma-joint-position-paper.pdf · access: OA · reuse: ©
- source: FTC 2022, Bringing Dark Patterns to Light, section IV p. 15 (default settings that maximise data collection) · as ETH-004
- verified: 2026-11-13 standard text
- caveats: India: a ₹10 donation preselected at checkout cost PhysicsWallah ₹5 lakh (basket sneaking, confirm shaming and forced action; Consumer Protection (E-Commerce) Rules 2020 rule 4(9) on consent recorded through a pre-ticked checkbox); the release says consent "cannot be assumed through pre-selected options". EU: taskforce members confirmed that pre-ticked boxes do not give valid consent (GDPR recital 32). UK: ICO and CMA list automatically selected add-ons, pre-ticked boxes and default auto-renewal as default settings that can stop users choosing effectively. The Consumer Rights Directive's rule on pre-ticked paid extras (Art. 22) and the Planet49 judgment were not read.

### ETH-008 · Make declining as easy, as visible and as neutral as accepting
- grade: A
- applies: any paired choice: cookie or consent prompts, newsletter and offer pop-ups, upsells, renewals, plan choices
- not-for: a section with one primary action and no competing choice
- value: wherever there is "Accept", "Yes" or "Subscribe", a "Reject", "No" or close option sits on the same layer, in the same component style, size and contrast class. The decline label is neutral ("No thanks", "Reject all"), never shaming or fearful ("No, I like paying more", "Accept risk"). "Ask me later" is not a way to decline. `verify.mjs` compares the pair; `claims.py` flags shaming wording
- source: EDPB 2023, Cookie Banner Taskforce report (type A, no reject button on the first layer; types D and E, deceptive button colours and contrast) · as ETH-007
- source: EDPB 2023, Guidelines 03/2022 on deceptive design patterns in social media platform interfaces, version 2.0 · adopted 14 Feb 2023 · https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-032022-deceptive-design-patterns-social-media_en · access: OA · reuse: ©
- source: California Code of Regulations, title 11, § 7004(a)(2) and (b), symmetry in choice · https://www.law.cornell.edu/regulations/california/11-CCR-7004 · access: OA · reuse: ©
- source: ICO & CMA 2023, Harmful design in digital markets ("harmful nudges and sludge", "confirmshaming", "biased framing") · as ETH-007
- source: PIB release 2268302 (McAfee: "Renew Now" next to "Accept Risk"; confirm shaming and interface interference; ₹1 lakh) · as ETH-007
- source: FTC 2022, Bringing Dark Patterns to Light, section IV p. 15 and Appendix A (confirm shaming) · as ETH-004
- verified: 2026-11-13 standard text (EDPB, ICO/CMA, FTC, PIB); § 7004 read by a reading agent from the LII copy
- caveats: EU: a vast majority of the taskforce's authorities held that a banner with no reject option on any layer that has a consent button infringes the ePrivacy rules; colours and contrast are judged case by case, not by a fixed standard. California: the path to the privacy-protective option may not be longer or harder; "Yes" with "Ask me later", and "Accept all" with "More information", are its examples of asymmetric choices; agreement obtained through a dark pattern is not consent. EDPB 03/2022 targets social media platforms; its six categories (overloading, skipping, stirring, obstructing, fickle, left in the dark) serve here as a review lens for any page.

### ETH-009 · Before asking for payment details, state the renewal price, period, trial end and how to cancel; cancelling is as easy as signing up
- grade: A
- applies: pricing cards and calls to action for subscriptions, memberships, free trials and auto-renewing plans
- not-for: one-off purchases
- value: next to the plan's call to action: price per period, "renews automatically until you cancel" (if true), trial length and when it becomes paid, and where to cancel. All from supplied facts, otherwise the terms are a missing fact for the handover and the page claims nothing about renewal or cancelling. The charge after a trial needs its own clear consent
- source: Restore Online Shoppers' Confidence Act (ROSCA), 15 U.S.C. § 8403 · https://www.law.cornell.edu/uscode/text/15/8403 · access: OA · reuse: US government work
- source: FTC 2022, Bringing Dark Patterns to Light, section III p. 10 (unauthorized charges, including subscriptions) · as ETH-004
- source: CCPA India 2023 ("Subscription Trap", "SaaS Billing") · names read in PIB release 2146813 · as ETH-004
- verified: 2026-11-13 standard text (ROSCA, FTC); names only (CCPA)
- caveats: ROSCA requires clear disclosure of all material terms before billing information is taken, express informed consent before charging, and simple ways to stop recurring charges. The FTC's 2024 "click-to-cancel" rule was vacated by the US Court of Appeals for the Eighth Circuit in July 2025 (law-firm reports; ruling not read). UK subscription-contract rules (DMCC Act Part 4 Chapter 2) were not read and their start date was not confirmed. The EU's Digital Fairness Act proposal covers subscriptions but is not law (`references/ethics-guard.md`, jurisdiction hooks).

### ETH-010 · Label ads, sponsored content and affiliate links where they appear
- grade: A
- applies: sponsored posts, paid placements, affiliate links, partner sections, comparison tables, case studies a third party paid for
- not-for: the business's own products on its own site
- value: a visible label ("Ad", "Sponsored", "Affiliate link: we earn a commission") next to the content, in the page's language, not only in a footer
- source: Directive 2005/29/EC (UCPD), Annex I point 11 (advertorial) · as ETH-004
- source: CMA 2025, CMA207, banned practice 12 · as ETH-004
- source: FTC 2022, Bringing Dark Patterns to Light, section I p. 4 (ads formatted as independent editorial content; comparison sites ranked by payment) · as ETH-004
- source: CCPA India 2023 ("Disguised Advertisement") · name read in PIB release 2146813 · as ETH-004
- verified: 2026-11-13 standard text (UCPD, CMA207, FTC); name only (CCPA)
- caveats: the texts require that payment be clear in the content itself; placing the label next to the content is this skill's reading of that, not a quoted rule.

### ETH-011 · Do not hide payment or unneeded sign-up behind the word "free"; ask once and accept "no"
- grade: A
- applies: lead magnets, "free" courses, downloads and trials; newsletter and sign-up pop-ups
- not-for: data an offer genuinely needs (an email address to send a requested file), stated before the form
- value: "free" means no payment beyond unavoidable delivery costs. Any sign-up the offer requires is stated next to the word "free". A prompt appears at most once per visit, closes with a clearly labelled control, and stays closed
- source: PIB release 2268302 (PhysicsWallah: "free" courses that required a phone number and email although the content did not need them; forced action and misleading advertisement) · as ETH-007
- source: Directive 2005/29/EC (UCPD), Annex I point 20 ("free" when the consumer has to pay anything beyond unavoidable costs) · as ETH-004
- source: FTC 2022, Bringing Dark Patterns to Light, section IV p. 15 (repeated prompts) and Appendix A (nagging) · as ETH-004
- source: CCPA India 2023 ("Forced Action", "Nagging") · names read in PIB release 2146813 · as ETH-004
- verified: 2026-11-13 standard text (PIB, UCPD, FTC); names only (CCPA guidelines)
- caveats: "at most once per visit" is this skill's operational limit (craft judgement), not a legal number.

### ETH-012 · Word every choice plainly: no double negatives, trick questions or surprise outcomes
- grade: A
- applies: checkbox and toggle labels, consent wording, buttons in prompts and forms
- not-for: —
- value: each checkbox or toggle label states, in the positive, what turning it on does ("Email me offers"). Buttons say what happens ("Reject all", not "Continue"). The result of a choice matches its label
- source: FTC 2022, Bringing Dark Patterns to Light, section IV p. 17 (a "Do Not Sell My Information" option with an "off" toggle as a double negative) and Appendix A (trick questions) · as ETH-004
- source: CCPA India 2023 ("Trick Question", also called "Trick Wording" in PIB releases) · name read in PIB releases 2146813 and 2268302 · as ETH-004
- source: Luguri & Strahilevitz 2021 (trick questions among the most effective patterns) · as ETH-003
- verified: 2026-11-13 standard text (FTC); name only (CCPA); paper introduction (Luguri & Strahilevitz)
- caveats: Mathur, Mayer & Kshirsagar (ETH-002) class trick questions as asymmetric: confusing language and double negatives burden the choice that withholds consent.

### ETH-013 · Advertise only offers the business can supply on the stated terms
- grade: A
- applies: offer banners, "from" prices, featured products, booking slots, launch announcements
- not-for: —
- value: every offer, price and product on the page is one the user supplied and can fulfil; a "from" price only when that price can really be bought; tie each to the fact list (truth check, ETH-001)
- source: Directive 2005/29/EC (UCPD), Annex I points 5 (bait advertising) and 6 (bait and switch) · as ETH-004
- source: CMA 2025, CMA207, banned practices 5 and 6 · as ETH-004
- source: CCPA India 2023 ("Bait and Switch") · name read in PIB release 2146813 · as ETH-004
- verified: 2026-11-13 standard text (UCPD, CMA207); name only (CCPA)
- caveats: on a landing page this mostly reduces to the truth check; it matters when a page lists offers the business has not confirmed.
