# Stack catalog

Curated options for landing pages, marketing sites and portfolios. Status, licence and versions checked on **2026-11-12** (GitHub repository metadata and the npm registry). Recheck anything you rely on if this date is more than six months old. All grades here are craft (D); performance consequences link to PERF rules.

Columns: **Build** = needs a build step · **JS** = JavaScript shipped to visitors by default · **Cost** = money.

## Site structure
| Option | Status (2026-11-12) | Licence | Build | JS | Cost | Use when |
|---|---|---|---|---|---|---|
| Plain HTML + CSS (+ small JS) | web platform | — | no | none | free | default for a single page or a few pages; low-end devices; slow networks |
| Astro | active, v7.4 | MIT | yes | none unless islands are added | free | several pages, content-driven, SEO; components without shipping a framework |
| Eleventy ("Build Awesome", package `@11ty/eleventy`) | active, v3.1; repo renamed `11ty/buildawesome` | MIT | yes | none | free | template-driven multi-page static sites, Markdown content |
| Vite (vanilla) | active | MIT | yes | what you write | free | a single page with substantial custom JavaScript |
| Next.js / SvelteKit / Nuxt | active | MIT | yes | framework runtime | free | the project already uses one, or the brief needs app-like behaviour (outside this skill's MVP) |

## Styling
| Option | Status | Licence | Build | Cost | Use when |
|---|---|---|---|---|---|
| Vanilla CSS with custom properties | web platform | — | no | free | default; blueprint tokens map directly to `--variables` |
| Open Props | active, v1.7 | MIT | no (CDN or copy) | free | a ready token scale is wanted without a build step |
| Tailwind CSS | active, v4.3 | MIT | yes (CLI) | free | the project already uses it or the user asks; map blueprint tokens into its theme, don't accept its default palette |
| UnoCSS | active | MIT | yes | free | the project already uses it |

## Motion
| Option | Status | Licence | JS | Cost | Use when |
|---|---|---|---|---|---|
| CSS transitions and keyframes, Web Animations API | web platform | — | none / native | free | default for feedback, reveals and state changes |
| View Transitions API | web platform; check current browser support | — | native | free | page or state transitions; must degrade gracefully |
| GSAP (incl. ScrollTrigger, SplitText) | active, v3.15 | Standard "No Charge" licence (Webflow): free incl. commercial use; prohibited in no-code visual animation builders that compete with Webflow | library | free | sequenced timelines or scroll-linked scenes the motion plan justifies; Studio default for the motion signature (ScrollTrigger scrub/pin, SplitText), with Lenis (`motion-craft.md`) |
| Motion (motion.dev) | active, v14 | MIT | library | free | React or JS animation where native APIs are clumsy |
| Lenis (smooth scroll) | active | MIT | library | free | Studio level, when scroll-led scenes carry the concept; off under reduced motion; Clean pages keep native scroll (motion card) |
| Three.js | active | MIT | heavy | free | Studio level, one 3D or WebGL moment the concept needs, with a supplied or commissioned model (`asset-brief.md` section 6); poster image first, load after first paint; budget it (PERF-002) |
| Canvas + image sequence | web platform | — | native | free | scroll-scrubbed video from a client clip encoded as frames (`asset-brief.md` section 4); fewer, smaller frames on phones; poster under reduced motion |

## Light interactivity
| Option | Status | Licence | Use when |
|---|---|---|---|
| No framework (vanilla JS) | web platform | — | default |
| Alpine.js | active, v3.17 | MIT | small declarative behaviour (menus, tabs) in HTML |
| htmx | active, v2.0 | 0BSD | server-driven partial updates |
| Preact | active, v11 | MIT | React-style components at small size |

## Fonts and icons
| Option | Status | Licence | Notes |
|---|---|---|---|
| Fontsource (self-hosted font packages) | active | MIT (packaging); each font keeps its own licence, mostly OFL | self-hosting avoids third-party requests; subset to the scripts used |
| Google Fonts (hosted) | active | fonts mostly OFL | third-party request; prefer self-hosting for EU audiences |
| Lucide | active, v1.72 | ISC | outline icons |
| Heroicons | active (last push 2026-05) | MIT | outline and solid icons |
| Phosphor (`@phosphor-icons/web`) | low activity (npm last change 2025-03) | MIT | usable; check before relying on new icons |

Script coverage matters more than style: for Devanagari, Tamil, Arabic or Japanese, pick a family that covers the script fully (for example the Noto families) and test conjuncts and numerals.

## Verification tools
| Tool | Status | Licence | Role |
|---|---|---|---|
| Chrome / Chromium (headless) | active | — | needed by `scripts/verify.mjs` |
| axe-core | active | MPL-2.0 | deeper automated accessibility scan (optional, not bundled) |
| Lighthouse | active | Apache-2.0 | lab performance metrics (optional, not bundled) |
| Playwright | active | Apache-2.0 | browser automation (optional) |

## Do not start new work with
| Option | Reason (checked 2026-11-12) | Use instead |
|---|---|---|
| Pico CSS | repository archived | vanilla CSS or Open Props |
| Windi CSS | no repository activity since June 2024 | Tailwind CSS or UnoCSS |
| Motion One | repository archived (Nov 2024); merged into Motion | Motion |
| Recoil | repository archived (Jan 2025) | out of scope for static sites |

## Hosting (free tiers)
GitHub Pages, Cloudflare Pages and Netlify host static sites on free tiers. Free-tier limits and terms change; check them before recommending, and flag any paid add-on.
