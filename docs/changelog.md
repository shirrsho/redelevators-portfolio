# Changelog

What actually shipped, and why. Newest first. Strategy lives in [`site-plan.md`](site-plan.md);
this file records what has been done against it.

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
