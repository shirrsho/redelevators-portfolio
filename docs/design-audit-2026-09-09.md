# Design system audit — 9 September 2026

Point-in-time verification of the shipped site against [`DESIGN.md`](../DESIGN.md). This is a
record, not a plan; the work that came out of it lives in [`site-plan.md`](site-plan.md).

**Method.** Computed styles sampled from the running dev server at `http://localhost:3000` via
browser automation, at viewport widths **375, 540, 640, 700, 900 and 1440px**. Values were read
from `getComputedStyle` on live elements rather than inferred from Tailwind's default scale.
Emitted CSS custom properties were read off `:root` and `body`.

**Result.** Every documented value held except three. Two were corrected in `DESIGN.md` and
`.impeccable/design.json` on the same day; the third is recorded as an open inconsistency.

## Status as of 10 September 2026

| Finding | Status |
|---|---|
| **F1** — heading utilities silently ignored | **OPEN.** Still unfixed; the cascade-layer change is workstream C1. Recorded in `CLAUDE.md` as a known trap. |
| **F2** — dead `@theme` tokens | **OPEN.** `cream-2` removed from the design docs; the dead declarations are still in `globals.css`. |
| **F3** — testimonial card breaks Flat-Until-Touched | **RESOLVED 9 Sep.** The component was deleted in the truth pass; the inconsistency no longer exists on any surface. |
| **F4** — hero headline paints at `opacity: 0` | **PARTIALLY ADDRESSED.** `Counter` was fixed to render its true value server-side, but the hero itself still depends on hydration. Remains workstream C2. |

The coverage gap "no accessibility audit" was closed on 10 September — see
[`accessibility-audit-2026-09-10.md`](accessibility-audit-2026-09-10.md).

---

## 1. Confirmed accurate

| Area | Verified value |
|---|---|
| Container | `max-width: 1152px`, `padding-inline: 24px` |
| Section rhythm | `padding-block: 96px` |
| Radius ladder | 8px nav links · 12px buttons · 16px service cards + nav bar · 24px feature/testimonial cards + stat grid · 32px CTA panel · full for pills |
| Button padding | primary/secondary `14px 24px` · nav CTA `10px 16px` |
| Card padding | service `28px` · feature/testimonial `32px` |
| Chip | `4px 10px`, Chalk ground, Slate text, fully round |
| Colors | all nine tokens emit their documented hex exactly |
| Body type | `16px / 25.6px` (line-height 1.6) |
| Mono label | `11.52px`, weight 500, `letter-spacing: 2.5344px` (0.22em), uppercase |
| Headline / title | line-height 1.02, tracking -0.03em, weight 600 |
| Shadows | `soft`, `lift` and `red-glow` match character-for-character |
| Flat-at-rest | service and feature cards compute `box-shadow: none` at rest — the rule holds |
| Stat band | 24px radius, `gap: 1px` over a Hairline ground |
| Horizontal overflow | none at 375px (`scrollWidth === innerWidth`) |

---

## 2. Findings

### F1 — Heading typography utilities are silently ignored (confirmed)

**Severity: medium.** Wastes time and will recur on every new page.

`src/app/globals.css` styles `h1, h2, h3, h4` outside any cascade layer. Tailwind v4 emits its
utilities inside `@layer utilities`, and unlayered CSS beats layered CSS regardless of
specificity. Every typography utility applied to a heading element is therefore discarded.

Measured: the hero `<h1>` carries `leading-[0.98] tracking-tight` and renders at **line-height
1.02, tracking -0.03em** — the global values — at both 375px and 1440px.

The same mechanism costs more than headings. `.font-mono-label` is also unlayered and hard-sets
`color`, which is why the codebase carries **16 `!` important modifiers** to fight it:

```
7  !text-muted        2  !tracking-[0.18em]    2  !text-[0.6rem]
1  !text-xs           1  !text-white/80        1  !text-white
1  !text-red          1  !text-ink-soft
```

**Fix.** Move the element-level rules into `@layer base` and the custom classes into
`@layer components`, both of which `@import "tailwindcss"` already declares:

```css
@layer base {
  :root { color-scheme: light; }
  html { /* ... */ }
  body { /* ... */ }
  h1, h2, h3, h4 { /* ... */ }
  ::selection { /* ... */ }
}

@layer components {
  .font-mono-label { /* ... */ }
  .grid-bg, .dot-bg, .aurora { /* ... */ }
  .marquee-track, .text-gradient, .shadow-soft, .shadow-lift, .shadow-red { /* ... */ }
}
```

Leave the `prefers-reduced-motion` block unlayered — it already uses `!important` and must win.

**Regression risk:** once utilities start applying, the 16 `!` modifiers become redundant but
remain harmless. The hero will begin rendering at its intended `0.98` line-height, which is a
visible (small) change. Remove the `!` modifiers and re-check the hero in the same pass.

Recorded in `DESIGN.md` as **The Unlayered Heading Rule** so the behaviour is discoverable until
it is fixed.

### F2 — Two `@theme` tokens are never emitted (confirmed)

**Severity: low.** Dead code, and a trap for anyone who tries to use them.

Tailwind v4 only emits `@theme` custom properties that something references. Reading `:root` on
the live page:

- `--color-cream-2` (`#F2F1EE`) → **empty**. Declared, referenced by nothing.
- `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) → **empty**. The curve is used constantly,
  but always written as an inline literal in JS, never through the variable.

**Action taken.** `cream-2` was removed from the `DESIGN.md` token set and the sidecar's
`colorMeta` — documenting a color that does not exist at runtime would be worse than omitting it.
`ease-out-expo` is retained in the sidecar's `motion` extension because the *curve* is a genuine
system invariant even though the *variable* is dead.

**Fix.** Delete both declarations from `@theme`, or start using them. If the easing variable is
kept, route the JS through it rather than repeating the literal.

### F3 — Testimonial cards break the Flat-Until-Touched rule (confirmed, unresolved)

**Severity: low.** A consistency question, not a defect.

Service and feature cards compute `box-shadow: none` at rest. Testimonial cards rest with the
**Soft** shadow. Three content-card families, two behaviours.

`DESIGN.md` records this as an unresolved inconsistency rather than promoting it to a pattern.
**Decision needed:** either drop the resting shadow from testimonial cards so all content cards
behave alike, or articulate why a quote card is a floating object. Until then, new cards should
follow service and feature cards, not testimonials.

### F4 — Hero headline paints at `opacity: 0` (analysed, not measured)

**Severity: medium.** Affects Core Web Vitals and JS-failure resilience.

The hero `<h1>` is the page's largest text block and therefore its likely LCP element. It is
rendered with `initial={{ opacity: 0, y: 24 }}` and only becomes visible once `motion` has
hydrated and run. Consequences:

- LCP is gated on JS hydration rather than on first paint.
- If JS fails or is blocked, the headline, subheadline, CTAs and hero visual are all invisible —
  the page is effectively blank above the fold.
- While `document.hidden` is true the frame loop is throttled and the reveal does not advance.
  This was observed directly during the audit (see *Non-findings*), and is the same hazard the
  `Counter` component already guards against with an explicit 2200ms safety timeout. The hero has
  no equivalent guard.

**Not measured:** no Lighthouse or field LCP run was performed. The mechanism is certain; the
numeric impact is not quantified.

**Fix options,** cheapest first: animate from a visible first paint (translate only, no opacity
fade); or do the hero reveal in CSS so it never depends on hydration; or mirror `Counter`'s
safety-timeout pattern.

---

## 3. Non-findings

Recorded so nobody re-investigates them.

- **Service-card icon measured 16×36px on first sample.** Not reproducible at 375, 540, 640, 700,
  900 or 1440px, where it is a correct 36×36px circle. Almost certainly measured mid-hydration.
  **Not a defect.**
- **Hero and all below-fold sections screenshot as blank.** The automation pane runs with
  `document.hidden === true`, which throttles the frame loop, so `motion`'s entrance and
  `whileInView` reveals never advance and the compositor stops producing frames. DOM inspection
  confirmed correct geometry and `opacity: 1` throughout. **Test-harness artifact, not a site
  bug** — though it is the same underlying mechanism as F4.

## 4. Coverage gaps

What this audit did **not** cover, and should be picked up separately:

- No accessibility audit — no contrast ratios computed, no keyboard traversal, no screen-reader
  pass, no focus-visible review. Note that no `:focus-visible` styling was observed anywhere in
  the codebase.
- No performance measurement — no Lighthouse, no bundle analysis, no font-loading review.
- No visual inspection below the fold, for the reason in Non-findings.
- No cross-browser testing; Chromium only.
- Light theme only (the site ships light-only by decision).
