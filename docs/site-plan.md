# Red Elevators — site plan

The working reference for what we are building and in what order. Product truth lives in
[`PRODUCT.md`](../PRODUCT.md); visual rules live in [`DESIGN.md`](../DESIGN.md); the audit that
produced the fix items lives in [`design-audit-2026-09-09.md`](design-audit-2026-09-09.md).

**Status:** approved 9 September 2026. **Workstreams A, B, C and F are complete** (truth pass
shipped, System Anatomy built, cascade layers and hero first-paint fixed, all three open
accessibility failures resolved). **D is mostly done** — forms, the page header, focus-visible and
a 404 page shipped 12 September; long-form typography and scaling navigation are still undesigned.
**E is underway:** Home, the Services index + all 8 detail pages, Approach, Systems/Teardowns and
Contact are live. **About is the only page left, and it is blocked** — the plan says "who we are
*is* the trust asset", but no founding story, team or biography exists anywhere in these docs, and
inventing one would breach the truth rules. It needs a conversation with the owner before anything
is built. Shipped detail in [`changelog.md`](changelog.md).

**Styleguide:** the system is viewable and interactive at
<https://claude.ai/code/artifact/59fa371d-2124-4966-b133-508fdddf88fc> (private artifact,
source at [`design-system.html`](design-system.html)). Workstreams B and D are prototyped there —
System Anatomy, form controls, focus states and the page-header pattern have been *designed*, and
now need porting into React. Republish to the same URL after any edit.

---

## 1. The problem this plan solves

The site is expanding from one page to a full multi-page site. The page type that normally carries
a multi-page agency site — case studies with named clients and hard numbers — is the one page type
we cannot fill: there are a few real engagements, but none were measured, written up, or cleared
for publication.

The current home page solved that by inventing proof. Every headline stat, every case-study
metric, both testimonials and the "Trusted by 40+ growing teams" line are fabricated. Building
five more pages on that template multiplies the problem instead of solving it.

## 2. The decision: sell the machine, not the outcome

**Proof is redefined from "results we don't have" to "mechanism we can absolutely show."**

Nearly every competitor writes some version of *"we automate your funnel."* Almost none will show
the actual wiring, because it is unglamorous and gives something away. We show it. It is the one
form of credibility already fully owned: it needs no client's permission, makes no factual claim
that could be false, and is the most direct possible expression of the design system's North Star
("The Live Ascent" — a machine visibly running).

This decision governs everything below. When a page seems to need proof, the answer is *more
specific mechanism*, never a number we cannot stand behind.

---

## 3. Workstreams

Ordered by priority. A/B are prerequisites for everything else.

### A — Truth pass (P0) — ✅ DONE 9 Sep 2026

Strip fabricated proof from the home page **before** any new page copies the pattern.

| Element | Location | Action |
|---|---|---|
| "Trusted by 40+ growing teams" + four fake avatar dots | `src/components/Hero.tsx` | **Delete.** The weakest element on the site; reads as fake instantly and undermines everything above it. |
| Four headline stats (`40+`, `18hrs`, `3.4×`, `6 wks`) | `src/lib/content.ts` → `stats` | **Replace, don't remove.** Swap unverifiable *outcome* numbers for true *capability* numbers — tools we build inside, service lines, process stages, honest time-to-live if known. Same band, same design, same visual punch, all true. |
| Four case studies with metrics (`2 min`, `+38%`, `18 hrs`, `5×`) | `src/lib/content.ts` → `work` | **Replace with System Anatomies** (workstream B). Keep the section; change what fills it. |
| Two testimonials | `src/lib/content.ts` → `testimonials`, `src/components/Testimonials.tsx` | **Remove the section entirely** until real quotes exist. An honest gap reads better than an invented quote from "Operations Lead". |
| Hero panel figures (`1,284` leads, `< 2m`, `18h/wk`, `+34.8%`) | `src/components/HeroVisual.tsx` | **Reframe as an illustrative UI**, not a claim. Either label it clearly as an example, or use non-numeric states. Decide during the pass. |

**Parallel non-code action, highest leverage on this whole list:** ask two of the real clients for
three sentences each. A week of effort that would upgrade the site more than any design change.
When real quotes arrive, the testimonial section returns.

**Acceptance:** no number, quote, client, or logo appears anywhere on the site that cannot be
substantiated. See `PRODUCT.md` → *Evidence on Hand* for the binding rules.

**Met.** Verified against the served HTML, not just the source. The `work` and `testimonials` data
and the `Testimonials` component were deleted outright; the stat band now carries capability
figures (15 tools / 6 service lines / 4 stages / 0 new platforms); the hero trust line and its fake
avatars are gone; the hero panel's invented figures became the real tool chain. **Still outstanding:
collect two real client quotes** — that remains the highest-leverage item on this whole plan and is
blocked on nobody but the owner.

### B — The System Anatomy component (P0) — ✅ DONE 9 Sep 2026

The signature component and the centrepiece of the proof strategy. Build this before any new page.

A horizontal chain of labelled nodes showing a real workflow end to end — for example
`Form submit → Enrich → Score → Route → SMS in 90s → Log to CRM` — with a pulse travelling the
wire on a loop, and each node naming the actual tool used.

Why it earns its place:

- **Specificity reads as expertise.** "Speed-to-lead" is a claim; showing six steps and naming
  HubSpot at step four is evidence.
- **Zero client data, zero factual claims.** Nothing to clear, nothing to fabricate.
- **It is the North Star made literal** — a machine visibly running.
- **It scales.** Built once, reused on every service page with different nodes, so six pages read
  as one system instead of six templates.

Requirements:

- Responsive: horizontal chain on desktop, vertical stack on mobile — never a horizontally
  scrolling row.
- Honors `prefers-reduced-motion`: the pulse stops, the diagram still reads.
- Follows the Radius Ladder and uses only Elevator Red plus neutrals (The Single Voice Rule).
- Node labels are data, not markup — authored in `src/lib/content.ts` so a page can declare its
  own chain.
- Accessible: the chain must be readable as ordered text by a screen reader, not just as a
  decorative graphic.

**Acceptance:** one component, driven by data, rendering at least two different chains, passing
reduced-motion and mobile checks.

**Met.** `src/components/SystemAnatomy.tsx` renders three chains from the `systems` data. It is a
server component — nodes and wires are static markup, the pulse is pure CSS — so the diagram never
depends on JavaScript. Verified stacking vertically at 375px with no horizontal overflow.

### C — Foundation fixes (P1)

Both from the audit. Do these before building pages, because both compound with every new page.

**C1 — Cascade layers.** Move `globals.css` element rules into `@layer base` and custom classes
into `@layer components`. Currently every Tailwind typography utility on a heading is silently
discarded, and 16 `!` important modifiers exist purely to fight `.font-mono-label`. Full detail
and the exact fix in the audit, finding F1. Remove the now-redundant `!` modifiers in the same
pass and re-check the hero, which will start rendering at its intended `0.98` line-height.

**C2 — Hero first paint.** The hero headline is the LCP element and paints at `opacity: 0` until
JS hydrates; if JS fails the page is blank above the fold. Animate from a visible first paint,
move the reveal to CSS, or mirror the safety-timeout pattern `Counter` already uses. Audit finding
F4.

### D — Design system gaps (P1) — items 1, 2, 5 (partial), 6 and 7 ✅ DONE 12 Sep 2026

`DESIGN.md` documents a one-page site. These are the pieces a multi-page site needs. Build each one
*into the system* — tokens, states, and a sidecar entry — not ad hoc on the page that first needs
it. Items 3 and 4 are still undesigned and remain open.

1. **Forms — ✅ done.** `src/components/Form.tsx`: `Field`, `FieldLabel`, `FieldHint`,
   `FieldError`, `FieldOk`, `TextInput`, `Textarea`, `Select`, `Checkbox`, at the 12px control
   radius, with focus states (gap 7). One deviation from the styleguide mock: its green success
   state became neutral Ink-soft, since green breaks The Single Voice Rule.
2. **Page header pattern — ✅ done.** `src/components/PageHeader.tsx`: Chalk band, mono-label +
   headline + intro rhythm, optional actions slot. Renders the page's one `<h1>`.
3. **Long-form typography.** No prose rules exist — paragraph rhythm, lists, pull quotes, inline
   links, images with captions, code blocks. Required before any article ships. Still undesigned.
4. **Navigation that scales.** The nav is flat anchor links to sections of one page. Eight service
   pages plus resources needs real routing, a dropdown or mega-menu, and an active-page state. The
   dropdown/mega-menu/active-state redesign is still undesigned. **Two correctness bugs fixed 12
   Sep 2026, not the redesign:** (1) every nav link and the logo were bare same-page anchors
   (`#top`, `#systems`) that only worked on the page that happened to define that id. (2) User-
   reported: after fixing (1), every navigation landed scrolled near the bottom of the destination
   page instead of the top. Root cause was in Next.js 16 itself, not this app's markup alone — its
   built-in post-navigation scroll management skips fixed/sticky top-level elements (documented
   behavior), and with `ScrollProgress` and `Nav`'s header both `position: fixed` top-level
   siblings of `<main>`, it fell through past `<main>` and landed on `<footer>`. Fixed by giving
   every `Link` `scroll={false}` and taking scroll positioning over entirely in `Nav.tsx`. See
   `docs/changelog.md` for the full investigation.
5. **404, error and empty states — 404 ✅ done, error/empty still open.** `src/app/not-found.tsx`:
   reuses Nav/Footer, mono-label + headline + two links home. Deliberately plain — a fuller
   error-state system (form validation states already exist via workstream D item 1; a dedicated
   empty-state pattern does not) stays undesigned rather than invented ahead of need.
6. **A motion rule for reading contexts — ✅ recorded, nothing to build yet.** The Reading Calm Rule
   is documented in `DESIGN.md`; it governs long-form pages (gap 3), which don't exist yet, so
   there is no component to apply it to until then.
7. **Focus-visible styling — ✅ done.** Global `:focus-visible` rule in `globals.css` (`@layer
   base`): 2px solid Elevator Red, 3px offset, inverted to white inside `#process` and `#contact`.
   Verified by tabbing to a control on each of Paper, Chalk, Graphite and the red panel and reading
   its computed outline color. Form controls use a different, equally visible ring-based treatment
   by design — see gap 1.

### E — Page architecture (P2) — started 12 Sep 2026

Build in this order. Each page ships complete before the next starts.

| Order | Page | Purpose | Notes |
|---|---|---|---|
| 1 | **Home** | Convert | Exists. Cleaned by workstream A. |
| 2 | **Services index + 8 service pages — ✅ ALL LIVE 12 Sep 2026** | SEO + depth | Index (`/services`) and all eight detail pages shipping. Taxonomy rebuilt around the real two pillars — AI Automation leads, then Marketing (site-wide ordering decision) — from the company's own portfolio decks, see `PRODUCT.md` → *Evidence on Hand*. Every service has a real, generic (not client-specific) manual chain, felt-cost line, human checkpoint and System Anatomy — see `brief-service-page.md`. Real case-study content (named clients, screenshots, metrics) exists but remains **explicitly not cleared for the public site** — never source detail-page content from the decks' client specifics. |
| 3 | **Approach — ✅ LIVE 12 Sep 2026** | Credibility | `/approach` expands Audit → Design → Build → Run into a full page: two paragraphs of real detail plus a stated output per stage, one worked System Anatomy example, then the tool marquee and CTA. Needed no new proof — every line restates `PRODUCT.md` → *Operating Context*. Nav's old `#process` anchor link (home-page only) renamed "Approach" and repointed here. |
| 4 | **Systems / Teardowns — ✅ LIVE 12 Sep 2026** | Case-study substitute | `/systems` shows all 8 chains in full — anonymized, mechanism-led, no client name or metric. Becomes real case studies later when permission and numbers exist. Each card links through to its matching service page. `Systems.tsx` still shows a curated 3-item slice on the home page (unchanged), now pointing its "View all" link at `/systems` instead of `/services`; the global `CTA`'s "See how it works" does the same. |
| 5 | **About** | Trust | With no case studies, who we are *is* the trust asset. Do not skip it. |
| 6 | **Contact — ✅ LIVE 12 Sep 2026, form deferred** | Convert | `/contact` ships on the two real conversion paths (Calendly + `EmailLink`) plus a "what happens next" restatement of the four stages. **No form, by owner's decision:** `Form.tsx` exists, but a submitted form needs a backend (email API or form service) that isn't set up, and an unwired form that drops leads is worse than none. Revisit once a provider is chosen. Carries `id="contact"` itself so Nav's `#contact` anchor isn't dead here. |
| 7 | **Blog / Resources** | SEO | **Conditional — see open decisions.** |

Every page keeps the single 1152px container and the one-destination rule: all paths resolve to
the 30-minute call.

### F — Accessibility (P1) — ✅ DONE 12 Sep 2026

Colour contrast was measured on 10 September; full results and exact remediation values in
[`accessibility-audit-2026-09-10.md`](accessibility-audit-2026-09-10.md).

Neutral text passes WCAG AA. Smoke was darkened to `#71717B` to clear the Chalk ground. **All three
open failures are now resolved, per owner decision on 12 September:**

1. **A11Y-1 — Elevator Red as small text.** Was 3.69:1 on Paper, 3.45:1 on Chalk. Fixed with Option
   A: a text-only red token (`--color-red-text: #E2101E`), used only by `.font-mono-label`, leaving
   `#FF2D3B` untouched wherever it is a fill. Measured 4.85:1 on Paper. Does not breach The Single
   Voice Rule — a tone of red, not a second hue.
2. **A11Y-2 — CTA panel white-on-red.** Was 2.99:1. Fixed with solid white text plus a darker panel
   ground (`--color-red-panel: #EA1826`, used only on the CTA panel). Measured 4.51:1 for both the
   lede and the mono label — no need to enlarge the lede's type size.
3. **A11Y-3 — marquee tool names.** Was 2.52:1. Fixed by raising the rest state from `ink/40` to
   `ink/60`; the faded-strip aesthetic and hover-to-full-ink reveal are unchanged. Measured 4.60:1.

All three ratios were verified by compositing the actual rendered colours on canvas, not by reading
`getComputedStyle` alone — Tailwind v4's opacity utilities resolve to `oklab()`, which is not a
plain `rgb()` string.

Separately, **no `:focus-visible` styling exists anywhere** — a larger gap than any of the above,
and still open (workstream D, item 7).
It is designed in the styleguide and is item 7 of workstream D.

---

## 4. Open decisions

Do not resolve these unilaterally; they need the owner's call.

- **Blog.** Only worth building if it will genuinely be written. An abandoned blog is worse than
  no blog. Defer until someone commits to a cadence.
- **Testimonial card shadow.** Testimonial cards rest with a shadow while service and feature
  cards rest flat. Either unify them or justify the difference. Audit finding F3.
- **Dark theme.** Deferred by decision; the site is light-only and may stay that way permanently.
  The unused dark brand assets in `public/brand/` are out of scope, not a defect. See `PRODUCT.md`
  → *Capabilities and Constraints*.
- **Hero panel figures.** Whether to relabel as illustrative or replace with non-numeric states
  (workstream A).

---

## 5. Deliberately not doing

- **No dark mode**, no `prefers-color-scheme` handling, no theme toggle.
- **No second accent color.** One red, everything else neutral (The Single Voice Rule).
- **No stock photography**, no meeting-room imagery, no corporate blue.
- **No urgency mechanics** — countdown timers, scarcity badges, "limited spots".
- **No AI-startup visual clichés** — purple/blue gradients, frosted glass, floating 3D shapes,
  glowing orbs. The likeliest failure mode for an automation agency site.
- **No placeholder proof of any kind.** Not as lorem, not "to swap later." That is exactly how the
  current fabrications got here.

---

## 6. How to work on this

Where things live:

| File | Owns |
|---|---|
| `PRODUCT.md` | Durable product truth — users, positioning, constraints, what proof exists |
| `DESIGN.md` | The visual system — tokens, rules, components as built |
| `.impeccable/design.json` | Machine-readable sidecar: tonal ramps, motion, shadows, component snippets |
| `docs/site-plan.md` | This file — strategy and backlog |
| `docs/design-audit-2026-09-09.md` | Point-in-time verification record |
| `docs/design-system.html` | The living styleguide — source for the published artifact |
| `docs/brief-service-page.md` | Design brief for the service page template (workstream E.2) |

Suggested entry points:

```bash
/impeccable shape services
```

Plans one service page properly, including the System Anatomy, and writes a surface brief. Once
one page is right the other five are variations.

```bash
/impeccable document
```

Re-run after any significant build to refresh `DESIGN.md` and the sidecar from the real code.

**Rules for anyone picking this up:** read `PRODUCT.md` → *Evidence on Hand* before writing any
number onto a page. Finish workstreams A and B before starting E. Add new components to the design
system rather than to a single page.
