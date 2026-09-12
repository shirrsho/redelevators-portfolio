# Changelog

What actually shipped, and why. Newest first. Strategy lives in [`site-plan.md`](site-plan.md);
this file records what has been done against it.

---

## 2026-09-12 — False alarm: every service page 404'd in the dev container only

Reported from the browser: clicking "See this service →" on `/systems` landed on the 404 page.
**Not a bug in the app, and never broken for visitors.** Isolated by testing the same route in four
places:

| Where | Result |
|---|---|
| The local Docker dev container (`:3000`) | ❌ 404 |
| A fresh `next dev` on the host | ✅ 200 |
| `npm run build && npm run start` locally | ✅ 200 |
| Staging (`:6003`) and **production (`:6001`)** | ✅ 200 |

Only the container failed, which ruled out both the route code and any Next.js 16 dev-mode
behaviour. Cause: `docker-compose.dev.yml` mounted `/app/.next` as an **anonymous** volume, and
`docker inspect` dated that volume to **5 September** — before any service page existed, when
`generateStaticParams` correctly returned an empty list. With `dynamicParams = false`, that stale
empty param list is a 404 by design. Anonymous volumes survive `up`/`down` indefinitely, so the
container had been serving a week-old route map while the bind-mounted source was current — which
is why the nav showed the newest links while the pages behind them 404'd.

Fixed by recreating the container (`down -v`), and hardened so it cannot recur silently:
`dev_node_modules` and `dev_next_cache` are now **named** volumes, so `down -v` actually clears
them, with the symptom and the one-line fix written at the top of the compose file. The shadowing
itself is still deliberate — this repo gets built on the host too, and a macOS `node_modules` must
never leak into the container's Linux runtime.

**Rule of thumb recorded for next time:** a route that 404s in the dev container but builds fine is
a cache problem, not a routing problem. Check `npm run build` output for the route before debugging
the route.

## 2026-09-12 — Documentation sync, and two things found while doing it

Brought the binding docs back in line with what is actually built, at the owner's request. No code
changed in this pass.

**Synced:**

- `PRODUCT.md` → *Capabilities and Constraints*: the architecture line still said "Services index
  plus **six** service pages" and listed every later page as unbuilt. Replaced with the real
  inventory (8 detail pages, `/approach`, `/systems`, `/contact`, 404) and the one gap.
- `PRODUCT.md` → workstream D status: the 404 has shipped; the nav gap is now "scales past a flat
  link list", not "past anchor links", since the anchors are gone.
- `DESIGN.md`: added **Service Card** (built 12 Sep, never documented) and a **Page architecture**
  table covering all six route types, including which page carries `id="contact"` and why. Also
  recorded the `scroll={false}` rule in the design system itself, not just `CLAUDE.md` — a new
  `Link` without it silently fights `Nav.tsx`.

**Found while checking — the stat band has drifted out of true.** Capability figures are only
honest while they still describe the site, and two of the four no longer do:

| Claims | Site actually shows | |
|---|---|---|
| `15` Tools we build inside | **19** unique marquee tools | ❌ |
| `6` Service lines | **8** services | ❌ |

Both drifted on 12 September — the taxonomy rebuild took services 6 → 8, and four tools were added
to the marquee alongside the new chains. Nobody re-checked the band afterwards. A visitor can
disprove both by counting what is on the page. **Deliberately not fixed:** the owner's standing
instruction is not to touch the stat band, so this is flagged in `PRODUCT.md` → *Evidence on Hand*
as an open decision rather than edited unilaterally. It is a two-value change if approved.

**About page: deferred by owner decision.** No founding story, team size, location or biography
exists in any project document — the material is absent, not merely uncleared. The owner will
discuss it with other members before anything is written. Recorded in `PRODUCT.md` so the next
session does not "solve" it by inventing a company history.

## 2026-09-12 — Workstream E: Contact page shipped, deliberately form-free

`/contact` (Workstream E, item 6). **Owner's call: no form yet.** The form system from workstream D
exists (`Form.tsx`), but a submitted form needs somewhere to go, and no email API or form backend
is set up — an unwired form that silently drops leads is worse than no form. The page ships on the
two conversion paths that are real today: the Calendly booking and `contact@redelevators.com`
(reusing `EmailLink`, tooltip clearance included), plus a "what happens next" restatement of the
four `steps`. A real form goes in once a provider is chosen.

Two things wired up alongside it:

- **`id="contact"` moved onto the page's own booking section.** Nav's "Book a call" is a bare
  `#contact` anchor that every other page satisfies by rendering `<CTA/>`. This page deliberately
  doesn't render `<CTA/>` (a Book-a-call panel on the Book-a-call page is noise), so it carries the
  id itself — same dead-anchor class of bug already fixed once on 12 Sep.
- **Footer nav links are `Link`, not `<a>`.** Every `nav` entry is a real route now, so the bare
  `<a>` tags were full-reloading the site on each footer click. `scroll={false}` for the usual
  reason (see CLAUDE.md → *Known traps*).

Nav is now Services · Approach · Systems · Contact + the Book a call button. Verified at 1440px,
768px (all four fit, no crowding) and 700px (collapses to the hamburger cleanly): no overlaps, no
horizontal overflow.

## 2026-09-12 — Workstream E: Systems/Teardowns page shipped

`/systems` (Workstream E, item 4) — all 8 `systems` chains shown in full, each with its title,
description and complete `SystemAnatomy`, plus a "See this service →" link into the matching
service page (guarded the same way `ServiceCard` guards its own links, so a card can never point at
a 404). Anonymized and mechanism-led by design: no client name, no metric, only the real chain and
the tools it runs on. The home page's `Systems.tsx` keeps its existing curated 3-item slice
unchanged; its "View all" link and the global `CTA`'s "See how it works" now both point at this new
page instead of the home teaser / `/services`. Nav's "Systems" entry repointed from `/#systems` to
`/systems` for the same reason "Process" became "Approach" earlier today. Verified with the same
`getBoundingClientRect()` overlap check, mobile and 1440px: zero overlaps.

## 2026-09-12 — `dev` merged to `main`; production redeployed

Fast-forwarded `main` to `dev`'s tip and pushed. Every workstream shipped since 9 September — the
truth pass, System Anatomy, cascade-layer and hero-paint fixes, all three accessibility fixes, the
services rebuild (2 pillars × 4), the real navigation bug fixes, the site-wide overlap audit, and
the isolated dev-deploy pipeline itself — is now live in production. Production's own deploy
workflow (`deploy.yml`) ran unaffected: it still only reacts to `main` and only reads
`docker-compose.prod.yml`, so `dev`'s staging-only files came along inertly.

## 2026-09-12 — Workstream E: Approach page shipped

`/approach` (Workstream E, item 3). Expands the existing `steps` teaser (Audit → Design → Build →
Run) into a full page: each stage gets two paragraphs of real detail plus a stated output, all
restating PRODUCT.md → *Operating Context* rather than adding any new claim. One real System
Anatomy chain ("Workflow & CRM Automation") is shown in full as a worked example, followed by the
existing `Marquee` and `CTA`. New `approachStages` data in `content.ts`; nav's "Process" entry
(`/#process`, only ever reachable from the home page) renamed "Approach" and repointed at the new
page — the home page keeps its own `#process` teaser section unchanged. Verified with the same
`getBoundingClientRect()` overlap check used in the site-wide audit, at both mobile and 1440px
widths: zero overlaps.

## 2026-09-12 — Dev environment moved to port 6003

First deploy of the `dev` branch failed: `docker compose up -d` couldn't bind `127.0.0.1:6002` —
`docker ps` on the VPS showed it was already held by an unrelated, pre-existing container
(`leaderbot`), not by anything of ours. Owner's call: move dev to `127.0.0.1:6003` rather than
touch `leaderbot`. Updated `docker-compose.staging.yml`; `deploy-dev.yml` needed no change since it
only ever reads the port from that file.

---

## 2026-09-12 — Internal preview environment: the `dev` branch

Pushing `dev` now deploys to `dev.redelevators.com` for internal review — explicitly not a launch;
the team decides separately whether/when this becomes public.

- **`.github/workflows/deploy-dev.yml`**: a copy of the production pipeline, isolated at every
  layer so it can't collide with or overwrite production — own image tags (`:dev`,
  `:dev-<sha>`, never `:latest`), own VPS directory (`redelevators-portfolio-dev`, sibling to
  production's), own compose file.
- **`docker-compose.staging.yml`**: same shape as `docker-compose.prod.yml` but published on
  `127.0.0.1:6002` (production is `6001`) and with no `cloudflared` service — the owner is adding
  a `dev.redelevators.com` ingress rule to the *existing* tunnel themselves, so this environment
  needed no new secrets.
- **`NOINDEX` build arg** (`Dockerfile`, `layout.tsx`, new `src/app/robots.ts`): the dev image is
  built with `NOINDEX=true`, baked in at `next build` time since every route is static/SSG — emits
  a `noindex, nofollow` meta tag and a disallow-all `robots.txt`. Verified locally against an
  actual production build (`next build && next start`), not the local dev server, which doesn't
  use build-time args the same way. Unset on production; verified that build is unaffected.

---

## 2026-09-12 — Site-wide overlap audit

User asked to check the rest of the site for the same class of bug as the hero badges. Grepped
every `absolute`-positioned and negative-offset element in the codebase, then wrote a generic
pairwise bounding-box overlap check (any two leaf text elements sharing >15% of the smaller one's
area) and ran it against every route: `/`, `/services`, all 8 service detail pages, and the 404.

**Found and fixed two more, real ones:**

- **`PageHeader.tsx`'s top padding didn't clear the fixed Nav bar.** Ported `py-14 sm:py-16`
  (56/64px) straight from the styleguide mockup, whose own page uses a `sticky` nav, not this
  site's floating fixed one — Nav's pill sits at ~78px, taller than the padding. Manifested as
  "AI Automation" (the label on `/services/workflow-crm-automation`) overlapping "Growth on
  Autopilot" (the nav's own wordmark subtitle); shorter labels like "Services" happened not to
  reach far enough right to trigger it, same underlying bug regardless. `Hero.tsx` already solved
  this correctly with `pt-36 sm:pt-44` for the identical reason — this just wasn't carried over
  when `PageHeader` was built. Fixed to `pt-32 sm:pt-36` (kept bottom padding at the original
  `pb-14 sm:pb-16`).
- **`EmailLink`'s "Copied to clipboard" tooltip landed on "Book a call" right below it** in the
  Footer's Contact column — the list's `space-y-2.5` (10px) is far tighter than the tooltip's own
  footprint (~32px). `EmailLink` is only ever used in this one spot, so fixed at the call site
  (`Footer.tsx`) rather than the component: `pb-6` on the email's `<li>`, verified down to a
  measured 7px clear gap.

Everything else — `SystemAnatomy`'s pulse dot, `Process`'s step-number circles, the mobile menu —
checked clean, confirmed by the same measurement method rather than assumed safe by inspection.

---

## 2026-09-12 — Hero panel's floating badges were covering their own content

User-reported with a screenshot: the "New lead" / "Auto-qualified" / "CRM updated" badges that
float around `HeroVisual`'s dashboard mockup were sitting on top of the "Speed-to-lead · live"
label and the "Captured / Webflow" tile, obscuring them.

Two separate problems, not one:

1. **Not just a narrow-viewport issue.** My first fix (`hidden lg:block`) only hid the badges below
   the breakpoint where they'd have zero clearance — but measuring actual bounding rects (not just
   eyeballing a screenshot) showed "New lead" and "CRM updated" still overlapped their neighbors
   even at 1280px wide. The offsets were positioning the badges *inside* the card's own content
   area regardless of viewport, not just short of room on the outside.
2. **Fixed the actual positions.** "New lead": `top-8` (32px into the card, landing on the header
   row) → `-top-6` (fully above the card's top edge). "CRM updated": `bottom-10` (40px up from the
   card's bottom edge, landing on the tile row) → `-bottom-6` (fully below it). "Auto-qualified" was
   never the problem — it deliberately sits near the chart's peak as a data-point annotation, and
   measuring confirmed it never touched the label or tile.

Verified by measuring live `getBoundingClientRect()` overlap (not screenshots) at both 1280px, with
an 8px margin added to account for the badges' continuous bob animation, and visually at 1100px and
900px (below `lg`, where they stay hidden as before).

---

## 2026-09-12 — The real navigation bug: Next.js 16's scroll management, not the app

User-reported after the previous fix: every navigation now landed correctly on the right page, but
scrolled near the bottom instead of the top — "it opens up booking on the screen" (the CTA panel,
which sits just above the footer).

**Root cause, confirmed via `node_modules/next/dist/docs/`** (per `AGENTS.md`'s warning that this
Next.js version has undocumented-in-training-data behavior changes) — `Link`'s `scroll` prop docs:

> Next.js checks if `scroll: false`... it identifies the relevant DOM node for navigation and
> inspects each top-level element. All non-scrollable elements... are bypassed, this includes
> sticky or fixed positioned elements... Next.js then continues through siblings until it
> identifies a scrollable element that is visible in the viewport.

Every page renders `<ScrollProgress/>` and `<Nav/>` (whose header is `position: fixed`) as
top-level siblings of `<main>` and `<Footer/>`. Both fixed elements get skipped per that
documented behavior; instrumenting `Element.prototype.scrollIntoView` live in the browser (with a
clean, uninstrumented click as a control, to rule out the instrumentation itself) confirmed Next
calls it on `<footer>`, `<main>`, `<header>`, and the scroll-progress `<div>` in that order — i.e.
it falls through `<main>` and lands on `<footer>` instead.

**Fixed** by opting out of Next's scroll management entirely: every internal `Link` across the app
(`Nav`, `ServiceCard`, `Services`, `Systems`, `CTA`, `not-found`) now passes `scroll={false}`, and
`Nav.tsx` takes over positioning itself in a `pathname`-keyed effect — scroll to a hash target if
the new URL has one, `window.scrollTo(0, 0)` otherwise. Verified with real clicks only (no
`find`/`read_page`, which build accessibility trees and were briefly suspected of being the actual
source — a clean control test ruled that out) across: hamburger menu → Services, logo from a
scrolled-down service page, a same-page CTA anchor, a cross-category "More like this" card, and
the Process/Systems hash links.

## 2026-09-12 — Two design tweaks, at the user's request

- **Dropped the "N of 4" count from each service page's mono label** (was e.g. "AI Automation · 02
  of 04"). Kept the category name — useful context for a cold arrival — but the ordinal position
  reads as internal-catalog bookkeeping rather than something a reader benefits from knowing, and
  it's an easy revert if this is wrong.
- **"More like this" cards are now real links.** They rendered as plain, non-interactive `<div>`s —
  an oversight from before every service had a page to link to. Now reuse `ServiceCard` (the same
  component the home page and `/services` index use), so they link automatically, consistent with
  the rest of the site.

---

## 2026-09-12 — All 8 service pages live; navigation correctness fixes

**All eight service pages now live** (`src/lib/content.ts` → `serviceDetails`, `systems`). The
remaining 7 (beyond the `sales-outreach-systems` pilot) each got a real, generic, non-client-specific
feltCost / humanCheckpoint / manualChain and a matching System Anatomy chain, grounded in the two
portfolio decks' own service descriptions (never their named-client specifics — still not cleared,
per PRODUCT.md).

- **`systems` reconciled**: went from 3 pre-rebuild entries with stale labels ("Sales & follow-up",
  "Ops & reporting", "Marketing automation" — none matching any current service) to exactly 8, one
  per real service, `label` matching `services[].title`. The 3 old ones were removed, not left
  alongside the new ones.
- **`Systems.tsx` now shows a curated 3-item slice**, not the whole array — with 8 real chains,
  rendering all of them on the home page would have buried the section under detail-page-length
  content. Added a "View all services" link (same pattern as `Services.tsx`) so the rest are still
  reachable. Fixed the intro copy, which hardcoded "Three of the systems we build" and would have
  been wrong the moment a 4th entry existed.
- Added `Telegram`, `Canva`, `Shopify` to the tools marquee — each newly referenced in a System
  Anatomy chain, each confirmed real via one of the two decks' own stack lists.

**Navigation audit and fixes** (user-reported: clicking the logo from a service page misbehaved).
Found by grepping every `href` in the codebase, not just the reported case:

- **The logo was `href="#top"`.** `#top` only resolves to something on the home page (the only
  place an element with that id exists) — on every other page it silently scrolled the *current*
  page instead of going home. Fixed: `Link href="/"`, with an `onClick` that smooth-scrolls instead
  of navigating when already on the home page (`usePathname()`-gated).
- **`Nav`'s three links were plain `<a>` tags**, including two (`Process`, `Systems`) already fixed
  to absolute paths (`/#process`, `/#systems`) in an earlier session but never upgraded to
  `next/link` — meaning every nav click did a full page reload instead of a client-side transition.
  Converted to `Link`, including the mobile menu (`motion.a` → `motion.div` wrapping `Link`, to keep
  the entrance stagger animation without fighting Link's own click handling).
- **`CTA.tsx`'s "See how it works" was a bare `href="#systems"`.** `CTA` renders on `/services` and
  every `/services/[slug]` page, none of which have an element with `id="systems"` — silently did
  nothing there. Fixed to `/#systems` via `Link` (ESLint's `no-html-link-for-pages` caught the first
  pass, which used a plain `<a>`).
- **`not-found.tsx` had no `#contact` element**, so `Nav`'s "Book a call" (a same-page anchor by
  design, since it works everywhere else) resolved to nothing on the 404 page. Fixed by adding
  `<CTA />` to that page — which also satisfies PRODUCT.md's One Destination rule, which the 404
  page was quietly violating by not ending in the call-to-action every other page does.
- Verified every fix live: real mouse clicks (not just DOM inspection) from a scrolled-down service
  page to the logo, from `/services` to Process/Systems, the mobile menu on a service page, and the
  404 page's now-working CTA. A transient "duplicate key" console warning during testing turned out
  to be Docker's dev-server HMR websocket, not a real bug — confirmed clean against a production
  build with zero console errors.

---

## 2026-09-12 — Pilot service page live: Sales & Outreach Systems

`/services/sales-outreach-systems` is the first live service detail page — the workstream E pilot,
per `brief-service-page.md`.

- **AI Automation now leads the taxonomy**, Marketing second — reordered site-wide (`services`
  array, the `/services` index, the home page grid). It's the harder-to-copy, higher-value pillar
  and the one the site's whole mechanism-led design language (System Anatomy, the red pulse) is
  actually about; Marketing is one thing that gets automated, not the differentiator.
- **Pilot picked: `Sales & Outreach Systems`**, not the original `Sales & follow-up` (which no
  longer exists post-rebuild). Chosen because it already has a real mechanism description in
  `Red-Elevators-AI-Portfolio.pdf` ("Outreach that researches itself") to build an honest System
  Anatomy chain from, rather than inventing one: Lead list (Airtable) → Research (n8n) → Personalize
  (OpenAI) → Send (n8n) → Logged (HighLevel). Added `HighLevel` to the tools marquee to match.
- **Manual "today" chain written**, not owner-supplied this time — the user explicitly delegated
  this. It's generic, industry-typical descriptive copy of how outbound prospecting commonly works
  without this system (nobody's name, no metric), so it doesn't fall under the case-study clearance
  rule the same way a named example would.
- Fixed two bugs surfaced by the pilot going live: the page header's "of 06" was stale from the old
  6-service count (now shows the category-scoped count, e.g. "AI Automation · 03 of 04"); the
  related-services block was rendering all 7 other services instead of the brief's specified 2-3
  (now same-category, capped at 3).
- **Not reconciled:** the home page's 3 pre-rebuild System Anatomy chains still carry old service
  names — flagged in `site-plan.md`, not fixed here.

---

## 2026-09-12 — Services rebuilt around the real two-pillar taxonomy

The user shared two portfolio decks (`Red-Elevators-Marketing-Portfolio.pdf`,
`Red-Elevators-AI-Portfolio.pdf`) — see `PRODUCT.md` → *Evidence on Hand* → "Real evidence exists,
not yet cleared for the site". This entry covers only the taxonomy rebuild the user asked for; the
decks' real client names, screenshots and metrics are explicitly **not** used anywhere below.

- **`services` rebuilt** (`src/lib/content.ts`): 6 invented lines → 8 real ones under 2 pillars —
  Marketing (Paid Social Advertising, Creative & Ad Design, E-commerce Growth, Full-Funnel
  Campaigns) and AI Automation (Workflow & CRM Automation, AI Assistants & Chatbots, Sales &
  Outreach Systems, Content Engines). Titles and descriptions are the company's own positioning
  copy from the decks — not proof, not invented.
- **New `/services` index page**, grouped by pillar, reusing the same card component as the home
  page (extracted to `src/components/ServiceCard.tsx` so both stay one system).
- **Home page now links out**: "View all services" under the grid, and the nav's Services link now
  points at `/services` instead of the home-page anchor. `Process`/`Systems` nav links updated to
  `/#process` / `/#systems` so they still resolve correctly from a non-home page.
- **`serviceDetails` emptied.** The old `sales-follow-up` entry (including its dev-only placeholder
  manual chain) is gone — that slug no longer exists. `/services/[slug]` now correctly generates
  zero pages until a real service gets real content; that's honest, not broken.
- **Not done, and explicitly out of scope this round:** any named case study, screenshot, or
  specific metric from either deck — the user confirmed these aren't cleared for public site use
  yet. Also not reconciled: the home page's `systems` (System Anatomy) data still uses the old
  service names; flagged in `site-plan.md` workstream E rather than fixed here.

---

## 2026-09-12 — 404 page, and the home page links to the live service page

- **404 page** (`src/app/not-found.tsx`, workstream D item 5): mono-label, headline, two links
  home. Reuses Nav/Footer so a wrong turn still feels like the site. Deliberately plain rather than
  inventing a full error/empty-state system ahead of need.
- **`Services.tsx` cards link out** the moment a service's page is real — same completeness check
  (`serviceDetails[slug].manualChain`) the route itself gates on, so a card can never point at a
  404. Right now that's true for none in the committed content, one once the pilot's manual chain
  is supplied.

---

## 2026-09-12 — Workstream E starts: service page template, blocked on one field

`src/app/services/[slug]/page.tsx`, `src/components/Handover.tsx`, built per
`docs/brief-service-page.md`, pilot service **Sales & follow-up**.

- **Handover component:** the manual "today" chain (grey, hairline, no tool names, no numbers)
  stacked above the automated System Anatomy — reused, not reinvented. Verified at 375px and
  desktop: no horizontal scroll, same top-to-bottom order at every width.
- **`generateStaticParams` gates on content completeness.** A service only gets a page once
  `serviceDetails[slug].manualChain` (`src/lib/content.ts`) is populated. Right now that's true for
  no service, so the route correctly emits zero pages — confirmed live:
  `/services/sales-follow-up` returns 404. This is the same "empty is honest" pattern as the
  removed testimonials section, applied to a whole page instead of a section.
- Wrote real (not fabricated) content for the parts that don't depend on the owner: felt-cost
  lead-in, the human-checkpoint line (derived from the already-shipped System Anatomy's own Slack
  step, not a new claim), and the tools list (pulled straight from that chain's tool names).
- **Blocking:** the manual "today" chain itself. `docs/brief-service-page.md` calls this out twice
  as an owner-supplied dependency — 3-5 short steps naming who does something or what it waits on,
  no durations, no percentages. The page ships the moment that arrives.
- Verified both new components against a temporary, unlinked preview route with obviously
  illustrative placeholder text (never committed), deleted before this commit.

---

## 2026-09-12 — Workstream D: forms, page header, focus-visible

Ports three of the four design-system gaps already designed in the styleguide into React (site
plan workstream D, items 1, 2 and 7). Item 6 (The Reading Calm Rule) needed no code change — it's
recorded in `DESIGN.md` and governs a long-form page type that doesn't exist yet. Items 3
(long-form typography), 4 (scaling navigation) and 5 (404/error/empty states) remain undesigned.

- **Form controls** (`src/components/Form.tsx`): `Field`, `FieldLabel`, `FieldHint`, `FieldError`,
  `FieldOk`, `TextInput`, `Textarea`, `Select`, `Checkbox`. One deviation from the styleguide mock:
  its success state used green (`#1c7c4a`), which breaks The Single Voice Rule — shipped instead in
  neutral Ink-soft with a check icon. Error text uses Red Text (`#E2101E`, from the 12 Sep
  accessibility fix), not the primary red, since it's small text.
- **Page header** (`src/components/PageHeader.tsx`): the mono-label/headline/intro rhythm for every
  non-home page, without the hero's chart, with an optional CTA-actions slot.
- **Focus-visible** (`globals.css`): a global `:focus-visible` outline (2px solid Elevator Red, 3px
  offset), inverted to white inside `#process` and `#contact` so it survives all four grounds.
  Verified live by tabbing to a control on each ground and reading the computed outline color, not
  by eye.

Both new components were verified against a temporary, unlinked preview route, deleted before this
commit — they have no page to live on until workstream E's service pages and contact page exist.

---

## 2026-09-12 — Cascade layers, hero first paint, and all three accessibility fixes

Workstreams C and F of the site plan.

**Workstream C**

- **Cascade layers (F1).** `globals.css` element defaults (`h1-h4`, `:root`, `body`, `::selection`)
  moved into `@layer base`; custom classes (`.font-mono-label`, `.grid-bg`, `.aurora`,
  `.marquee-track`, `.anat-dot`/`.anat-node`, `.text-gradient`, `.shadow-*`) moved into
  `@layer components`. Tailwind utilities now correctly win regardless of source order. Removed all
  12 now-redundant `!important` modifiers. Verified: the hero `<h1>` now computes line-height 0.98 /
  tracking -0.025em (its own utilities) instead of the previously-forced 1.02 / -0.03em.
- **Hero first paint (F4).** Every `motion` element in `Hero.tsx` now animates position only
  (`translateY`/`scale`); opacity stays 1 from first paint. Confirmed in the served HTML — no
  `opacity: 0` on any hero element — so the headline, subheadline, CTAs and hero visual are visible
  before hydration or if JS fails.

**Workstream F — accessibility, all three findings resolved**

- **A11Y-1.** Added `--color-red-text: #E2101E`, used only by `.font-mono-label`; `#FF2D3B` stays
  the fill everywhere else. 3.69:1 → 4.85:1 on Paper.
- **A11Y-2.** Added `--color-red-panel: #EA1826` for the CTA panel ground only, and set its lede
  and mono label to solid white. 2.99:1/2.77:1 → 4.51:1 for both.
- **A11Y-3.** Marquee tool names raised from `ink/40` to `ink/60`. 2.52:1 → 4.60:1.

All ratios measured by compositing the actual rendered colours on canvas rather than reading
`getComputedStyle` alone, since Tailwind v4's opacity utilities resolve to `oklab()`.

**Not fixed, flagged separately:** the same `#FF2D3B` failure also affects a few surfaces the 10
September audit didn't enumerate — solid white on `bg-red` in the Hero and CTA primary buttons, and
`text-red` on white in the CTA secondary button and Footer hover links. These touch core button
branding, a bigger call than the three audited items, so left for a dedicated decision.

---

## 2026-09-10 — Accessibility audit and two safe fixes

Closes the accessibility gap the 9 Sep audit explicitly left open. Full findings and exact
remediation values in [`accessibility-audit-2026-09-10.md`](accessibility-audit-2026-09-10.md).

**Fixed**

- **Smoke `#74747E` → `#71717B`.** Secondary text failed WCAG AA on Chalk grounds (4.32:1). Three
  steps darker takes it to 4.51:1 on Chalk and 4.83:1 on Paper. Perceptually indistinguishable,
  and it converts a failure into a pass on the section ground the new Systems block uses.
- **System Anatomy node titles** now use `-0.03em` tracking rather than Tailwind's `tracking-tight`
  (`-0.025em`), so they obey The Tight Top Rule like every other display-face element. They are
  `<span>`s, so the unlayered heading rule was not applying it for them.
- **ESLint ignores `.claude/**` and `.impeccable/**`.** Vendored agent tooling was producing 94
  warnings in `npm run lint` that nobody could act on. Lint output is now silent.

**Found, not fixed — needs a brand decision** (see the audit for exact values)

- Elevator Red as *small text* fails AA on both Paper (3.69:1) and Chalk (3.45:1). This affects
  every mono label on the site, which The Label-First Rule mandates everywhere.
- The CTA panel's `white/85` and `white/80` text on Elevator Red are the worst on the site at
  2.99:1 and 2.77:1.
- Marquee tool names at `ink/40` on Chalk are 2.52:1.

None of these were touched because fixing them means either changing a brand-sheet colour or
changing a deliberate aesthetic choice. Both are the owner's call.

---

## 2026-09-09 — Truth pass, and the System Anatomy component

Workstreams A and B of the site plan. The home page no longer contains any claim that cannot be
substantiated.

**Removed**

- The hero's "Trusted by 40+ growing teams" line and its four fake avatar dots.
- Both testimonials, their data, and `Testimonials.tsx`. The section does not exist rather than
  standing empty — no real quote has been collected yet.
- All four fabricated case studies and their metrics (`2 min`, `+38%`, `18 hrs`, `5×`), plus
  `Work.tsx`.
- The hero panel's invented figures: `1,284` leads, `< 2m` replies, `18h/wk` saved, `+34.8%`.

**Replaced**

- **Stat band** now carries capability figures that are all verifiable: 15 tools we build inside ·
  6 service lines · 4 stages, audit to handover · 0 new platforms to learn.
- **Case studies → System Anatomy.** New `SystemAnatomy.tsx` renders three real workflow chains
  from data in `content.ts`. Deliberately a server component: nodes and wires are static markup and
  the pulse is pure CSS, so the diagram never depends on JavaScript.
- **Hero panel** became a small anatomy — Captured/Webflow, Qualified/OpenAI, Routed/HubSpot.
- Nav: "Results" removed (there are no results to show), "Work" → "Systems". CTA copy: "See case
  studies" → "See how it works". Anchors repointed to `#systems`.

**Fixed along the way**

- **The stat band was server-rendering `0`.** `Counter` initialised its state to zero and only
  reached the true number after hydration, so the page shipped "0 Tools we build inside" to anyone
  without JS, before hydration, and to crawlers — a new false statement created by the change meant
  to remove them. It now renders the true value on the server and only resets to zero once it has
  confirmed the element is off-screen.
- **A second-order fault in that fix:** the safety timer lived *inside* the IntersectionObserver
  callback, so if the observer never fired the number stuck at zero permanently. An unconditional
  4-second deadline now restores the true value regardless. Proven on the worst-case path — in a
  fully throttled tab where the observer never fires, the figures still land on 15 / 6 / 4 / 0.

**Still outstanding:** two real client quotes. Blocked on nobody but the owner, and the highest
leverage item remaining on the whole plan.

---

## 2026-09-09 — Documentation baseline

- `PRODUCT.md` written — product truth, proof strategy, the binding rules on evidence.
- `DESIGN.md` and `.impeccable/design.json` written from the shipped code, with every value
  verified in-browser rather than transcribed.
- `docs/design-audit-2026-09-09.md` — verification record and technical findings.
- `docs/design-system.html` — the living styleguide, published as a private artifact.
- `docs/site-plan.md` — approved strategy and workstreams.
- `docs/brief-service-page.md` — confirmed brief for the service page template.
