# Track A · Inner pages: notes

Read `NOTES.md` first (the shared contract). Branch `redesign-2026-a`. **Status: done.** Built, lint and `npm run build` pass, QA run (results below).

## What was built

| Route / piece | Where |
|---|---|
| `/services` (duo hero, 8 rows, "Better together") | `src/app/services/page.tsx`, `components/devices/ServicesDuo.tsx` + `servicesDuo.module.css`, `components/cards/ServiceRow.tsx` |
| `/services/[slug]` ×8 | `src/app/services/[slug]/page.tsx` + `service.module.css` |
| 8 hero scenes | `components/devices/ServiceHero.tsx` (switch) → `ServiceHeroInbox`, `Night`, `Email`, `Editor`, `Ad`, `Frames`, `Site`, `Funnel`; `ScreenCard.tsx` (laptop + chip, `ConBar`); `useSceneTimeline.ts`; CSS in `serviceHero.module.css` |
| Try it, What changes, What you get, FAQ, related + prev/next | `interactive/AssistantDemo`, `interactive/BeforeAfter` (+ `beforeAfter.module.css`), page markup |
| `/approach` | `src/app/approach/page.tsx`, `phases.tsx` (copy + illustrative visuals), `approach.module.css` |
| `/pricing` | `src/app/pricing/page.tsx` |
| `/privacy` | `src/app/privacy/page.tsx`, `PrivacyToc.tsx`, `privacy.module.css` |
| 404 | `src/app/not-found.tsx`, `NotFoundPhone.tsx`, `not-found.module.css` |
| Stubs replaced (props unchanged) | `cards/ServiceCard`, `interactive/Calendar3Week`, `PricingTiers`, `SavingsCalculator` |
| New | `interactive/PlanBuilder`, `viz/ServiceViz` (the mini demos) |

## Notes for integration (Stage 3)

- **`SystemPlayer`** (Track B) renders in "How it runs" on every service page, still the 700px stub in my branch. After B merges, section heights below it change by design (the real player is about 8px taller at desktop and 1,826px at 375). Nothing in my pages depends on its height. `#how` is the anchor.
- **`ServiceCard`** (used by D on Home ch.05): `location="home"` (the default) uses home.js's longer assistant reply ("…Here's the pet guide."); any other location (my "related" cards use `"related"`) uses site.js's.
- **`Calendar3Week linkId`**: finds `document.getElementById(linkId)` in an effect after mount and toggles `.on` on its `[data-phase]` descendants, and hovering them highlights the phase. D's markup (`<div class="weeks linked" id="time">` with `.wk[data-phase]`) must be in the DOM at mount (server-rendered is fine). Not exercised here, because only `/approach` uses the calendar on my side. Untested with real Home markup.
- **`PricingTiers`, `SavingsCalculator`, `PlanBuilder`** read the currency from context. `SavingsCalculator` and `PlanBuilder` each carry their own `CurrencyToggle`. `PricingTiers` has none (the page provides one).
- **`ScreenCard`, `ConBar`, `useSceneTimeline`, `useSceneStart`** are reusable by other tracks if they need laptop scenes (`ConBar` = the `.con .bar` window bar). `useSceneTimeline(cues, period, active)` returns the latest cue time reached (or `Infinity` under reduced motion).
- **Privacy copy is the mockup draft, unchanged.** It still says "no ad trackers" and "cookie-free analytics", which contradicts the Meta Pixel and Umami `recorder.js` still in `layout.tsx` (DECISIONS → open item 3). The `.todo` highlights and the "Draft for review" note are in place. Don't launch with both.
- Pricing keeps the amber "Placeholder prices for review" flag.
- Analytics: service rows and cards send "Service click" (`location="services"` / `"related"` / `"home"`); pricing buttons send "Book a call" (`location="pricing"`); `Calculator used` and `Plan builder used` fire once on first input. Currency changes go through the shared toggle ("Currency change").

## Shared changes needed
_None blocking. Suggestions for Stage 3:_

1. **`NOTES.md` CSS section: some CSS Modules must be layered.** It says Modules are unlayered, so they beat everything. For the hero scenes that breaks the mockup's cascade: the 900px screen-card rules in `sections.css` (`.phero .visual .laptop :is(.con,.ibx,.site){position:relative}`) must beat the scene's own `position:absolute` by specificity, as they do in the mockup. Unlayered Module CSS beat them outright, so the inbox hero collapsed to 0px height at ≤900px. I fixed it locally: `serviceHero.module.css` puts its rules in `@layer components` and prefixes them with `:where(.scene)` (zero specificity). Tracks that port page CSS which shares selectors with `sections.css` / `devices.css` should do the same.
2. **`SiteEffects` can add `.in` to `.rv` elements before React has hydrated the page**, which logs "A tree hydrated but some attributes of the server rendered HTML didn't match" (`rv` vs `rv in`). I saw it once on the first, cold-compile load of `/services` in dev; it did not happen on warm loads or in the production build (13 pages × 2 widths, scrolled end to end: no console messages). Low priority. A fix would be to start the reveal observer after hydration (for example after two animation frames).
3. **Headings under H1 skip levels in shared components**: `PricingTiers` tiers are `h4` and the privacy summary cards are `h5` (CSS targets those tags; Stage 1 decision 4). I added a visually hidden `h2` ("Plans", "The short version") on `/pricing` and `/privacy`, and one ("The four steps…") above the phase `h3`s on `/approach`. `PricingTiers` on Home (D, compact) will have the same issue.
4. **JetBrains Mono `→` glyph**: `next/font` loads the latin subset, which has no U+2192 (arrow), so `22:00 → 07:00` in the AI Guest Assistant hero and "Next →" fall back to another font. Visible but small. Fix with a subset or `display` change in `layout.tsx` if it matters.
5. **`redelevators-dev-a` in `.claude/launch.json` starts in the main checkout, not the worktree** (preview tools use the repo root as `cwd`), so it would serve the skeleton, not this branch. I ran `npm run dev -- -p 3001` from the worktree instead. The other tracks probably need the same.

## Differences from the mockup

- **Hero loops start when in view and pause out of view** (the mockup's service heroes ran `setInterval` forever from page load). Timings and sizes are unchanged. One-shot scenes (editor, frames, site, funnel) play once, once in view, with the same delays. Under reduced motion every scene shows its final state; the AI Guest Assistant hero and the inbox match the mockup's own reduced-motion snapshot (time marker at the start, no source highlighted, no selected row).
- **`/services` duo is ported imperatively** (classes, the measured SVG path and the rAF pulse driven from one effect), not as state, because it is built on live `getBoundingClientRect()` reads and `fit()`. It never re-renders. Behaviour, timings (12.6s loop) and the stacked layout are the mockup's.
- **Savings calculator**: the big numbers are in the server HTML at their default values and animate (450ms) when an input changes; the mockup counted up from 0 on load.
- **Related heading** reads "More AI automation systems." The mockup lowercased the pillar and produced "More ai automation systems."
- Added: visually hidden H2s (see above), `aria-pressed` on the before/after toggle, labelled calendar cells, `role="log"` on the demo chat, a sticky TOC with `aria-current`, `aria-hidden` on the decorative 404 phone and on the mini-demo visuals.
- **404 notification** is not a link (as in the mockup); the three buttons are the ways back.
- Page-style rules for the pages (`.pick`, `.rel`, `.pn-nav`, the phase visuals, privacy reading section, 404 layout) live in CSS Modules, so the classes are scoped (`styles.pick`, etc.); the mockup's global names are still used inside scenes.
- `Try it`, `What changes`, `What you get`, FAQ and the related cards are server-rendered HTML apart from the two interactive widgets.
- Device text under 11px (for example 10px mono labels inside the laptop and phone scenes) is the mockup's own size and is kept ("keep its sizes"). No functional text outside the device illustrations is under 11px.

## QA (QA-CHECKLIST.md, my pages)

Pages: `/services`, `/services/[8 slugs]`, `/approach`, `/pricing`, `/privacy`, 404.

- **Build**: `npm run lint` clean, `tsc --noEmit` clean, `npm run build` passes (all 8 slugs prerendered as SSG).
- **Console**: none, on the production build, 13 pages at 1440 and 375, scrolled end to end.
- **Layout vs the mockup** (production build vs the mockup preview, same viewport, animations frozen, positions and sizes of ~35 key selectors, tolerance 4px): **1900, 1440, 1280, 1100, 900, 768 and 375 for `/services`, the 8 service pages, `/approach`, `/pricing` and `/privacy` → no differences (84 page × width checks), and identical page heights on the pages without the player.** On service pages the comparison stops at "How it runs", where Track B's stub sits. The 404 matched the mockup (position and page height) at 1440, 1280, 900, 768 and 375 on the dev server.
- **Horizontal scroll**: `scrollWidth` equals `clientWidth` at 1440 and 375 on every page (production), and matches the mockup's at all seven widths.
- **Mockup pixel check** (same headless Chrome): the services duo at the same animation moment, desktop and stacked mobile, and the reduced-motion hero for `/services` and the AI assistant, are the mockup's.
- **Reduced motion** (`prefers-reduced-motion: reduce` emulated): final state on `/services` (booked, 4 rows done), all 8 heroes, before/after ("With it"), calendar fades in at once. DOM-checked for each.
- **Behaviour**: currency USD default, AED and EUR switch tiers, builder and calculator, persists after reload (`re-cur`); builder bundle saving at 3 systems; calculator formulas and "start with" picks; assistant demo (answer, refund handoff card for 4.2s, unknown question, typed input, 6-message cap); before/after auto-flips once and not after a first touch; calendar hover, detail line, click scrolls to `#ph-run`; privacy TOC tracks the scroll; 404 notification arrives at 0.9s and the phone buzzes; the count-up numbers on `/approach`.
- **Headings**: one H1 per page; the rest in order (see suggestion 3). Titles and descriptions per route. All copy is in the server HTML (view source) apart from the interactive widgets' state.
- **Not covered**: WhatsApp (Contact only, not my pages); keyboard-only walk-through (all controls are native buttons, links and `<details>`; focus ring from `globals.css`); Lighthouse (Stage 3); the `linkId` path of the calendar (needs D's Home markup).

## Questions for the owner
_None new._ (Still open from DECISIONS: real prices, privacy legal details and tracking vs the privacy copy.)
