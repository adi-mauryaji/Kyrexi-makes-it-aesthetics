# Art direction

The lead writes this before any layout or token. It decides how the site looks and feels; the evidence and guards decide what it must not break. Design at full strength: the page should look as good as the best work you can make without this skill, and better because it fits its audience.

## 0. Read the taste memory
If `design/taste-memory.jsonl` (this project) or `~/.kyrexi/taste-memory.jsonl` (all projects on this computer) exists, read it first: `python3 scripts/memory.py show` (add `--global` for the shared file). Lean towards what the person kept, avoid what they rejected, and state which memory shaped the directions. After the person chooses a direction or reviews a build, record each verdict: `python3 scripts/memory.py add --kind direction --value "…" --verdict kept|rejected` (also palette, type, motion, structure, imagery, copy); in an autonomous run record `pending`, never an invented verdict. Before building, describe the page shape as a sequence (for example `hero-split > story-pin > menu-board > steps > map`) and run `python3 scripts/memory.py check-structure --value "…" --global`; if it repeats recent builds, vary the hero type, the order or a section composition, or note why the repeat is right.

## 1. Choose the level
| Level | When | What it allows |
|---|---|---|
| **Clean** | trust-first services (clinics, finance, B2B tools, public information), or the user asks for simple | the expected structure for this kind of site, finished with care: strong type scale, real imagery or illustration in every major section, one signature moment (TST-001) |
| **Studio** | brands, launches, products, food, fashion, culture, portfolios, events; the user shares award-level references or asks to stand out | one concept may set the whole page's visual language (materials, palette, type, ornament, motion), as long as every section stays readable and the next step stays obvious (TST-002, TST-003) |

Record the level in the profile (`level`) and the blueprint. When unsure, pick Studio for anything people choose by taste, Clean for anything people choose by trust.

## 2. Explore three directions, then choose one
Studios do not build their first idea: they gather references, prototype several concepts quickly in real code, and only then produce one (TST-009). Do the same.
1. **Write three directions that differ on every dimension**, not three variations of one idea. For each: the concept sentence ("The page is [a thing from the subject's world] for [the audience]"), the big idea or interaction the visitor will remember (a mechanic, not a decoration), the visual language (type, palette, illustration fidelity), and the motion signature. Make one of them the bold direction the client would not have asked for.
   - Good concepts come from the subject's own materials, rituals, places, tools or culture: a lined notebook with stamps and a certificate for a site that sells nothing; a red-lacquer rice tray with a gold dragon for a Vietnamese family meal; a rain-fogged Mumbai bus window for a monsoon streetwear drop.
   - Test each: swap in a competitor's name. If it still fits, it is not specific enough.
2. **Prototype only the first screen of each** (hero at 1440 and 375 px, with its motion), in `design/directions/A|B|C/`. Keep each to a quick sketch in code, not a finished page.
3. **Score each with the award score (section 6)** from screenshots, and write two lines on what each does best.
4. **Let the person choose.** Show the three screenshots with their scores and recommend one; people are better at choosing among generated ideas than at generating them, and an LLM's ideas tend to resemble each other (TST-009). If the user asked you not to stop, choose the highest-scoring direction and say why. Then build only the chosen direction.
- Clean level: two directions are enough; the concept shows in the imagery, palette and one signature moment, not in the structure.

## 3. Build the visual language
Decide each item and record it in the blueprint ledger.
1. **Type with character.** A display face that carries the concept (condensed, wide, serif with personality, handwritten, monospaced) with a readable text face; display size from about 3 rem on phones to 6–18 vw on desktop for Studio. Check script coverage (TYP, AUD rules). Render the real strings at their real sizes before committing: high-contrast Didones with an optical-size axis (Bodoni Moda, for one) thin their hairlines as the size grows, so hyphens, dashes and other horizontal strokes can vanish ("Apex-Imperium" shows as "Apex Imperium"). Wrap those glyphs in a span with a low optical size (`font-variation-settings: "opsz" 6`), or pick another face; at text size, set the axis low for the whole paragraph.
2. **Palette from the subject.** Colours taken from its materials (lacquer, terracotta, monsoon asphalt, citrus, chrome), not a default off-white with one deep green or teal. Give the palette a dominant, a support and one accent, then check contrast pairs.
3. **Ornament and texture.** One system drawn from the subject: line-art motifs, paper or grain, stamps and stickers, cut-outs, rules and labels. Use it at large scale in at least one place.
4. **Asset cast, then imagery plan.** First cast the page's images by role, so it does not repeat one kind of picture: the hero anchor (the offering at its best), range (other offerings or uses), process (how it is made or works), proof (the place, the people, real details), texture (a material close-up), and micro assets (icons, marks, small ornaments). No image family more than twice. Then give every major section its visual from the cast; a text-only section needs a reason.
   - **Photo or illustration:** anything factual and physical (the offering, the place, the people, the product in use) is a photograph or video; abstract ideas (a value, a process diagram, a benefit) may be illustrated.
   - **Whose photo:** pictures of this business's own offering, place and people come only from the user (`asset-brief.md`). Non-claim imagery (a texture, a general ingredient, weather, a city mood) may come from free sources whose licence allows commercial use without attribution; check the licence when using it, list each file in the handover, and never present it as the business's own. Generated images only when the user has a tool for it (its cost is the user's), labelled the same way.
   - Until the user's photos arrive, focal slots show stand-ins (section 5).
5. **Layout rhythm.** At least three distinct section compositions (full-bleed, split, grid, list, single statement); headline-to-body size ratio of 3× or more in the hero.
6. **Motion signature.** One motion idea that expresses the concept (scroll-scrubbed product turn, ornament that draws itself, type that settles), plus quiet micro-interactions. Every motion has a reduced-motion state (MOT, A11Y-008).
7. **Details.** Hover and focus states, cursor feedback, a favicon, a share image, a 404 or empty state in the same language.
8. **Never draw the focal object.** Model-drawn SVG or CSS reads as clip-art when it depicts something people should want (a dish, a product, a person, a place). Use drawing for icons, diagrams, ornaments, line-art motifs, typography and abstract ideas; for the focal object use the user's photo, a licensed or generated image under the rules above, a type composition, or procedural 3D built from simple forms. Keep one fidelity level across the page.
9. **Break the grid once or twice.** Overlap an image and a headline, set oversized type behind or across an image, offset a column, or run one horizontal sequence; keep reading order and the next step clear (`references/recipes.md`).
10. **One experiment.** Each Studio project tries one unusual interaction that serves the concept (drag the plate to choose a dish; wipe the fogged glass), built as an enhancement with a plain path.

## 3b. Feeling brief: derive it, do not look it up
Before the directions, write three lines in the blueprint from your own knowledge of the subject and of the best examples in its field:
1. **Offering:** the one thing people come for (a dish, a room, a result, a product, a person, an event).
2. **Moment:** who sees the first screen, where, when and in what state (hungry at 8 pm on a phone deciding where to eat; a worried parent at midnight; a buyer comparing tools at work).
3. **Feeling:** what they must feel within three seconds to take the next step, and what would kill that feeling.
Every direction, palette, image and motion choice must serve that feeling; a choice that fights it needs a stated reason and a counterweight on the first screen. Example of the method: for a restaurant, the offering is the dish, the moment is a hungry person choosing tonight, the feeling is appetite, so the dish appears large, close and true-coloured on the first screen (FI-007, COL-004). There is deliberately no list of categories here: derive the brief for each subject.

## 4. Reference board
Before drafting, read `evidence/taste.md` and any references the user gave. When the user supplies reference images, take their real colours with `node scripts/palette.mjs <images…>` (shares, OKLCH, contrast, suggested roles) instead of guessing. Write three to six lines: what each reference does that this page should also do (in your own words). Never copy a reference's layout, copy, code or assets; take the principle.

## 5. Stand-ins while assets are missing
Each photo, video or 3D slot gets a stand-in in the same composition and palette, sized like the final asset: for focal slots a type composition, an abstract material texture or a licensed non-claim image (never a drawing of the object); for other slots an illustration, a duotone shape or a generative pattern. It must look finished and must not depict a real person, product or place as if it were the client's. Mark it in code (`data-asset="H1"`) so the developer can swap it, and list it in the handover.

## 6. Award score, visual gate and motion gate (after each build round)

**Award score.** Score the page from 1 to 10 on Awwwards' four criteria and weight them as the jury does: Design 40%, Usability 30%, Creativity 20%, Content 10% (TST-009). Studio target: 8 or more weighted, no criterion under 7; below 6.5 means rework before polish.

| Criterion | 6.5 (honourable) | 8 (strong) | 9+ (site of the day) |
|---|---|---|---|
| Design | clean, consistent, no errors | a distinct visual language from the subject; confident type scale; rich imagery; a layout that breaks the grid with intent | every screen composed; craft in details (texture, light, transitions) that rewards a second look |
| Usability | works, readable, fast | effortless on phones; clear next step everywhere; motion never blocks | all floors met invisibly; fast on slow devices; delightful feedback |
| Creativity | one nice idea | a big idea and a mechanic the visitor remembers | an idea that feels new for this kind of site, executed fully |
| Content | correct facts | real content with depth (story, specifics, real photos) | content and design tell one story |

Write the four scores and one line per criterion in the blueprint; fix the lowest weighted score first.

### Visual gate
Take screenshots at 1440 and 375 px and score each item 0 (missing), 1 (present) or 2 (strong). Any 0 means another visual round; stop after 3 rounds and report what is left.

| # | Check |
|---|---|
| 1 | First screen: one clear focal visual, a headline at display scale, the primary action visible |
| 2 | The concept is recognisable in the first screen within about three seconds |
| 3 | Every major section has a visual element; no long runs of text-only blocks |
| 4 | Palette and type are derived from the subject; not the house look (off-white + one deep green/teal + a generic sans) unless the ledger says why |
| 5 | Rhythm: three or more distinct section compositions; strong scale contrast |
| 6 | Craft: consistent spacing, aligned edges, texture or ornament used with restraint; every interactive element has hover, focus, active, disabled, loading and error states where they apply, and touch works |
| 7 | The 375 px first screen is as strong as the desktop one |
| 8 | No visible placeholder text or empty boxes on the page (`verify.mjs` warns) |
| 9 | Feeling: seen as the visitor in their moment (section 3b), the first screen creates the feeling the brief names |

Ask last: "Would this lose next to a page the same model makes without this skill?" If yes, say why and fix that first.

**Motion gate** (same scoring, from `verify.mjs --motion`: `motion-sheet.png`, the `motion` line and its warnings; `references/motion-craft.md`). Studio level scores all six; Clean level scores 2, 5 and 6.

| # | Check |
|---|---|
| M1 | Signature: one motion idea from the concept is visible across the scroll film-strip |
| M2 | Choreography: the intro frames show headline, visual and action arriving in order; the headline is readable within about 3 s |
| M3 | Scroll story: at least one scrubbed or pinned sequence (scroll-linked elements > 0, or the film-strip shows it) |
| M4 | Smoothness: on the 4× slower CPU most frames stay under 33 ms, no repeated long frames, and only transform/opacity animate |
| M5 | Restraint: one focal motion per screen; loops subtle and pausable |
| M6 | Floors: no reduced-motion leaks; all content visible with motion off and without JavaScript |

## 7. Studio moves (learned from award winners)
Pick the moves the concept needs; never all of them. Each comes with the condition that keeps the page usable (TST-005 to TST-008).

| Move | How it is done well | Condition |
|---|---|---|
| Type as the hero | one short statement at display scale, cropped at the edge if it helps; one word in another weight or outline; a full-width wordmark to close the page | text stays real text (not an image); contrast passes; the phone size is set separately |
| Flooded colour | one brand colour fills whole screens; a second colour for contrast; neutrals for reading sections | pairs checked with `contrast.py`; not the same flood on every section |
| Few elements per screen | one statement, one image, space; complexity from scale and motion | the primary action is still on the first screen |
| Story scroll | one idea per screen; chapters; scroll as a timeline | content readable with motion off; no forced scroll speed |
| Editorial details | meta labels (index numbers, dates, captions), text columns over images, an occasional rotated line | labels are decorative or true facts, never invented numbers |
| Art-directed photography | collage with depth, top-down flat lay, full-bleed cinematic frame | the client's assets (`asset-brief.md`); stand-ins until they arrive |
| Mobile recomposed | its own crop, order and scale, not a stacked desktop | judged at 375 px in the visual gate |
| Branded intro | counter, logo on colour, line drawing; a few seconds; real progress | skip control; none under reduced motion; content in the HTML |
| Playful entry or world | a small game to enter, a 3D world as the concept | a plain path past it on the first screen; keyboard and screen-reader alternative |
| Designed consent | the cookie or age prompt in the brand's type and colour | equal accept and reject (ETH-008) |
| Light core | plain HTML/CSS core; spectacle layered on top with posters and lazy loading | the page works with WebGL, video and JavaScript unavailable |
