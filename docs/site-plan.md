# Red Elevators — site plan

The working reference for what we are building and in what order. Product truth lives in
[`PRODUCT.md`](../PRODUCT.md); visual rules live in [`DESIGN.md`](../DESIGN.md); the audit that
produced the fix items lives in [`design-audit-2026-09-09.md`](design-audit-2026-09-09.md).

**Status:** approved 9 September 2026. **Workstreams A, B and C are complete** (truth pass shipped,
System Anatomy built, cascade layers and hero first-paint fixed). D, E and F remain. Shipped detail
in [`changelog.md`](changelog.md).

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

### D — Design system gaps (P1)

`DESIGN.md` documents a one-page site. These are the pieces a multi-page site needs that do not
exist yet. Build each one *into the system* — tokens, states, and a sidecar entry — not ad hoc on
the page that first needs it.

**Items 1, 2, 6 and 7 are already designed in the styleguide** — port them from
`docs/design-system.html` into React rather than redesigning them. Items 3, 4 and 5 are still
undesigned.

1. **Forms.** There is not a single input, label, textarea, select, checkbox, error state or
   success state in the codebase, because the only conversion path is Calendly. A contact page
   needs the full set, designed to the Radius Ladder or they will look borrowed. Include focus
   states — see gap 7.
2. **Page header pattern.** The hero is bespoke and home-only. Every other page needs a shorter
   header band carrying the mono-label + headline rhythm without the chart.
3. **Long-form typography.** No prose rules exist — paragraph rhythm, lists, pull quotes, inline
   links, images with captions, code blocks. Required before any article ships.
4. **Navigation that scales.** The nav is flat anchor links to sections of one page. Six service
   pages plus resources needs real routing, a dropdown or mega-menu, and an active-page state.
5. **404, error and empty states.** None exist.
6. **A motion rule for reading contexts.** Reveal-on-scroll is right for a landing page and
   actively annoying in a 2,000-word article. Recorded in `DESIGN.md` as **The Reading Calm
   Rule**; the components have to honor it.
7. **Focus-visible styling.** No `:focus-visible` treatment was found anywhere in the codebase.
   Every interactive element needs one, and it must survive on Paper, Chalk, Graphite and the red
   CTA panel.

### E — Page architecture (P2)

Build in this order. Each page ships complete before the next starts.

| Order | Page | Purpose | Notes |
|---|---|---|---|
| 1 | **Home** | Convert | Exists. Cleaned by workstream A. |
| 2 | **Services index + 6 service pages** | SEO + depth | The highest-return work on this list — where an agency's organic traffic actually lives. Each page gets its own System Anatomy. Six services already defined in `src/lib/content.ts`. |
| 3 | **Approach** | Credibility | Expands Audit → Design → Build → Run into a full page. Needs no proof, and it is the page that closes a hesitant buyer. |
| 4 | **Systems / Teardowns** | Case-study substitute | Anonymized, mechanism-led, honest. Becomes real case studies later when permission and numbers exist. |
| 5 | **About** | Trust | With no case studies, who we are *is* the trust asset. Do not skip it. |
| 6 | **Contact** | Convert | Currently Calendly + mailto only. Needs the form system from workstream D. |
| 7 | **Blog / Resources** | SEO | **Conditional — see open decisions.** |

Every page keeps the single 1152px container and the one-destination rule: all paths resolve to
the 30-minute call.

### F — Accessibility (P1)

Colour contrast was measured on 10 September; full results and exact remediation values in
[`accessibility-audit-2026-09-10.md`](accessibility-audit-2026-09-10.md).

Neutral text passes WCAG AA. Smoke was darkened to `#71717B` to clear the Chalk ground. **Three
failures remain open, and each needs an owner decision because each changes brand-visible colour or
a deliberate aesthetic:**

1. **A11Y-1 — Elevator Red as small text.** 3.69:1 on Paper, 3.45:1 on Chalk; affects every mono
   label. Recommended fix is a text-only red (`#E2101E` clears both grounds) leaving `#FF2D3B`
   untouched wherever it is a fill. This does not breach The Single Voice Rule — a tone of red is
   permitted where a second hue is not.
2. **A11Y-2 — CTA panel white-on-red.** `white/85` is 2.99:1, the worst on the site. Solid white
   plus either a darker panel red or a 24px lede clears it.
3. **A11Y-3 — marquee tool names.** `ink/40` on Chalk is 2.52:1.

Separately, **no `:focus-visible` styling exists anywhere** — a larger gap than any of the above.
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
