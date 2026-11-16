# Truth check

The page may only state what the user supplied. Truth governs claims, not visuals: drawn illustrations, patterns, type compositions and art-directed stand-ins are not claims, but a picture of a real person, product, place or logo is. This check runs on the blueprint's copy (step 4) and on the built page (step 7). The ux-ethics role owns it; the lead fixes what it finds.

## 1. Build the fact list (step 1)
Copy every fact the user gave into the profile's "Facts available" list, word for word: names, offers, prices, dates, hours, numbers, credentials, contact details, policies. Then list the facts a page like this usually needs but the user did not give (testimonials, results, address, prices per item, policies). Each becomes a missing fact, never an invention: leave it out or defer it honestly in the copy, mark the spot in code with `data-needed="…"`, and list it for the handover. Do not show placeholder text or empty boxes to visitors; design the section so it looks complete without the fact, or keep it out until the fact arrives.

## 2. Classify every claim on the page
Read the visible text and sort each statement that goes beyond plain wording of a supplied fact:

| Class | What it is | What to do |
|---|---|---|
| SUPPLIED | A fact from the list, possibly reworded | keep |
| GENERAL | True in general, not about this business (an emergency number, what a standard exam covers, a law article) | keep only if correct and useful; say where it comes from when it matters for safety |
| INVENTED | A specific claim about this business that the user did not give: a number, price, name, date, duration, credential, policy, guarantee, promise of service (reply times, what happens next, what to bring), product detail, or a claim about the site itself ("no cookies", "we store no data") | remove it, defer it honestly, or keep it only as an assumption listed for the user to confirm |
| TRAP | Social proof, ratings, counts, results, awards, certifications, or urgency and scarcity not in the facts ("trusted by 10,000", "sizes go fast", "only 3 left") | never ship |
| MARKED | Clearly labelled sample content in an interactive demo ("Sample data") | keep the label visible; placeholder text for missing facts does not belong on the page (`verify.mjs` warns) |

A designed detail can still be an invention: per-item prices inside a supplied price range, product names, a brand story, opening-day promises. Prefer copy that defers honestly ("Price on drop day", "Ask us for the price") over a plausible guess.

## 3. Use the helper, then read
`python3 scripts/claims.py <text.txt> <facts file>` lists numbers and risky phrases not found in the facts (`verify.mjs` writes `text.txt`). It finds about half of what a careful reader finds and is weakest on promises written freely and on non-English copy, so read the whole page as well, including collapsed sections (FAQ answers, menus, form messages).

## 4. Hand over
The handover lists every INVENTED item kept as an assumption and every missing fact with its `data-needed` location, plus the asset slots still showing stand-ins, so the user can confirm or supply them before launch.

## Why this check exists
In this project's smoke baseline (6 briefs, 12 pages, 2026-11-12), pages built without this skill contained 16 invented claims and pages built with Anthropic's frontend-design skill contained 26 plus one trap ("so sizes go fast"); neither invented testimonials, ratings or counts. Invention concentrated in operating details and site self-claims (ETH-001).

In the A3 pilot (2026-11-13) the skill's pages invented nothing but showed 42 placeholders, and the owner judged them the weakest visually (TST-004). Hence the rule above: gaps go to the handover, not onto the page.
