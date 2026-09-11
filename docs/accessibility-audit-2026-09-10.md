# Accessibility audit — 10 September 2026

Closes the gap the [9 Sep audit](design-audit-2026-09-09.md) explicitly left open ("no
accessibility audit — no contrast ratios computed"). Scope here is **colour contrast only**.
Keyboard traversal, screen-reader behaviour and focus order are still uncovered — see *Coverage*.

**Status as of 12 September 2026: all three open findings (A11Y-1, A11Y-2, A11Y-3) are resolved.**
Values below are as measured on 10 September; the *Resolved* note under each finding records what
shipped and the new ratio, verified by compositing the actual rendered colours on canvas rather
than reading `getComputedStyle` alone (Tailwind v4's opacity utilities resolve to `oklab()`, which
does not parse as plain `rgb()`).

**Method.** Every foreground/background pair actually used in the shipped page, computed to
WCAG 2.1 relative luminance. Opacity-composited colours (`white/85`, `ink/40`) were flattened
against their real backgrounds before measuring, because that is what a reader's eye receives.

**Thresholds.** Normal text needs **4.5:1**. Large text — 24px+, or 18.66px+ bold — needs **3:1**.

---

## Results

| Pair | Where | Ratio | 4.5:1 | Verdict |
|---|---|---|---|---|
| Graphite `#17171B` on Paper | headings, node titles, body | **17.88:1** | PASS | — |
| Slate `#45454D` on Paper | node tool names, nav links | **9.50:1** | PASS | — |
| Slate `#45454D` on Chalk | chip labels | **8.87:1** | PASS | — |
| `white/60` on Graphite | Process step copy | **7.01:1** | PASS | — |
| Smoke `#71717B` on Paper | body copy, captions | **4.83:1** | PASS | fixed 10 Sep |
| Smoke `#71717B` on Chalk | Systems section intro | **4.51:1** | PASS | fixed 10 Sep |
| ~~Smoke `#74747E` on Chalk~~ | was failing | ~~4.32:1~~ | FAIL | **resolved** |
| ~~Elevator Red on Paper~~ | was every mono label | ~~3.69:1~~ | FAIL | **A11Y-1 resolved** → Red Text `#E2101E` on Paper, **4.85:1** |
| ~~Elevator Red on Chalk~~ | was mono labels on Chalk | ~~3.45:1~~ | FAIL | **A11Y-1 resolved** |
| ~~`white/85` on Elevator Red~~ | was CTA panel lede | ~~2.99:1~~ | FAIL | **A11Y-2 resolved** → white on Red Panel `#EA1826`, **4.51:1** |
| ~~`white/80` on Elevator Red~~ | was CTA panel mono label | ~~2.77:1~~ | FAIL | **A11Y-2 resolved** |
| ~~`ink/40` on Chalk~~ | was marquee tool names | ~~2.52:1~~ | FAIL | **A11Y-3 resolved** → `ink/60`, **4.60:1** |

---

## Resolved 10 September

**Smoke darkened `#74747E` → `#71717B`.** Three steps. Perceptually indistinguishable, and it
moves secondary text from 4.32:1 to 4.51:1 on Chalk while improving Paper to 4.83:1. Safe to do
unilaterally because Smoke is not a brand-sheet colour — the sheet fixes only Elevator Red,
Graphite and Paper.

---

## A11Y-1 — Elevator Red fails as small text

**Severity: high.** It affects every mono label on the site, and The Label-First Rule mandates one
above every heading.

**Resolved 12 September 2026 — Option A.** Added `--color-red-text: #E2101E`, used only by
`.font-mono-label`; `#FF2D3B` is untouched everywhere it is a fill. Measured on the rendered page:
4.85:1 on Paper (was 3.69:1). See `DESIGN.md` → *Red Text*.

Red text currently appears in two sizes, and only one of them fails:

- **Mono labels at 11.52px** — normal text, needs 4.5:1, gets 3.69:1 on Paper and 3.45:1 on Chalk.
  **Fails.**
- **Stat and metric numerals at 36–48px** — large text, needs 3:1, gets 3.69:1. **Passes.**

So the problem is precisely the small red text, not red-on-white as such.

**Option A — a text-only red (recommended).** Add a token used *only* for red text below 24px,
leaving `#FF2D3B` untouched everywhere it is a fill: buttons, the CTA panel, the mark, dots, bars,
rails, large numerals. Required values, computed:

| Ground | Minimum passing red | Ratio |
|---|---|---|
| Paper `#FFFFFF` | `#EA1826` | 4.51:1 |
| Chalk `#F8F7F5` | `#E2101E` | 4.53:1 |

A single `#E2101E` clears both. This does not breach The Single Voice Rule — a tone of red is
explicitly permitted where a second hue is not — and it leaves the brand red intact everywhere a
viewer perceives it as *the* brand colour.

**Option B — neutral labels.** Set mono labels in Slate (9.50:1) and reserve red for fills and
large numerals. Fully compliant and costs no new token, but the red eyebrow is a signature of the
system and this removes it.

**Option C — accept and document.** The brand sheet fixes `#FF2D3B`; the owner may decide the
labels stay. Then record it as a known, accepted deviation rather than leaving it undiscovered.

**Not for the agent to choose.** Any of these changes brand-visible colour.

## A11Y-2 — CTA panel white-on-red is the worst on the site

**Severity: high.** The closing CTA is the page's single most important block, and its supporting
copy is the least readable text on the page.

**Resolved 12 September 2026.** Both fixes applied together: the panel ground darkened to a new
`--color-red-panel: #EA1826` (used only there), and both the lede and mono label set to solid
white. Measured: 4.51:1 for both — passes the lede's 4.5:1 requirement without needing to enlarge
its type. See `DESIGN.md` → *Red Panel*.

Two compounding causes: the panel red is only 3.69:1 against pure white to begin with, and the copy
is then set at 85% and 80% opacity, dropping it to **2.99:1** and **2.77:1**.

**Fix, in order of effort:**

1. **Use solid white.** Removing the opacity alone takes both to 3.69:1 — enough for the 24px+
   heading, still short for the 18px lede.
2. **Plus one of:** darken the panel to `#EA1826` (4.51:1 with pure white), or raise the lede to
   24px so 3:1 applies. Either one, combined with solid white, makes the whole panel compliant.

The heading already passes as large text; only the lede and the mono label are at issue.

## A11Y-3 — Marquee tool names

**Severity: medium.** `ink/40` on Chalk composites to `#9E9D9E` — **2.52:1**. These are real
content (the tools you build inside), not decoration, and they fail even the 3:1 large-text bar.

**Resolved 12 September 2026.** Raised the rest state from `ink/40` to `ink/60`; the
hover-to-full-ink reveal and the faded-strip aesthetic are untouched. Measured: 4.60:1 (was
2.52:1).

---

## Coverage

Still not covered, and not claimed:

- **Keyboard traversal and focus.** No `:focus-visible` styling exists anywhere in the codebase —
  recorded as The Visible Focus Rule in `DESIGN.md` and designed in the styleguide, but unbuilt.
  This is a larger gap than any contrast failure above.
- Screen-reader semantics, heading order, landmark structure, and `aria` usage.
- Motion sensitivity beyond the existing `prefers-reduced-motion` handling.
- Target sizes, zoom to 200%, and text spacing overrides.
- Colour-blind simulation. A single-hue system is relatively safe here, but it is unverified.
