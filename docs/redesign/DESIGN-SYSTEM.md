# Design system

Source: `redesign-mockups/r3/base.css` (tokens, nav, base), `themes.css` (the Aurora layer and font overrides), `sections.css` (components), `devices.css` (phone, laptop, notifications). Live review pages: `/_design/components/`, `/_design/logo/`, `/_design/fonts/`, `/_design/nav-hero/`.

## Tokens → Tailwind v4 `@theme`
The app uses Tailwind v4 (CSS-first, `src/app/globals.css`, no config file). Put these in `@theme` (colours, fonts) and `:root` (anything Tailwind doesn't need to generate utilities for).

| Token | Value | Use |
|---|---|---|
| `--night` | `#0a0b14` | Page background at night (story, booking stage) |
| `--dawn` | `#17130f` | Background at the story's turn |
| `--day` | `#131211` | Background for day sections |
| `--bg` | animated | The homepage moves it night → dawn → day → night with scroll; other pages fix it per page |
| `--surface` / `--surface-2` | `rgba(255,255,255,.035)` / `.06` | Card fills |
| `--ink` | `#f4f4f5` | Primary text |
| `--sub` | `#a6a6b0` | Secondary text |
| `--dim` | `#8d8d97` | Tertiary text and labels |
| `--hair` / `--hair-2` | `rgba(255,255,255,.08)` / `.14` | Borders |
| `--red` | `#FF2D3B` | Brand: logo bars, accents, the dot |
| `--red-btn` | `#E51E2B`; in Aurora a gradient `#dc1a2b → #b80e28` | Primary (booking) buttons. AA contrast with white |
| `--amber` | `#E8A33D` | Problems, checkpoints, "handed to you" |
| `--green` | `#8FD4B0` | Handled, success, live |
| `--auto` | `#8b93ff` | AI Automation pillar (indigo) |
| `--mkt` | `#ff5a4e` | Marketing pillar (coral) |
| `--pad` | `clamp(20px, 4.2vw, 64px)` | Page gutter |
| `--max` | `1240px` | Content column (nav, hero, sections) |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | Standard ease-out |

### The Aurora layer (on by default)
- **Page background:** four blurred radial fields (indigo top-left, red bottom-right, teal and violet faint), drifting slowly (26s, alternate). See `themes.css` → `[data-theme="aurora"] body::before`.
- **Cards:** a gradient border, made with a padding-box fill plus a border-box gradient from indigo, through neutral, to coral. The list of card classes is in `themes.css`; turn it into a `card` variant.
- **Hover spotlight:** a 280px radial highlight follows the cursor on cards (`.spot`, driven by `--mx`/`--my` in `theme.js`).
- **Magnetic primary buttons:** buttons nudge a few px toward the cursor (`theme.js`).
- **Hero visual glow:** a soft indigo-to-red blur behind split-hero visuals.

## Typography
- **Families:** Schibsted Grotesk (`--display`), Hanken Grotesk (`--sans`), JetBrains Mono (`--mono`).
- **Loading:** replace the current Space Grotesk/Inter fonts in `src/app/layout.tsx` with `next/font/google` (`Schibsted_Grotesk`, `Hanken_Grotesk`, `JetBrains_Mono`), using variable weights.

| Role | Class in mockup | Size | Weight | Tracking | Line height |
|---|---|---|---|---|---|
| Display 1 | `.d1` | `clamp(44px, 5.4vw, 80px)` | 600 | −0.03em | 1.0 |
| Display 2 | `.d2` | `clamp(34px, 3.8vw, 56px)` | 600 | −0.03em | 1.04 |
| Display 3 | `.d3` | `clamp(24px, 2.2vw, 32px)` | 500 | −0.02em | 1.12 |
| Lead | `.lead` | 17px | 400 | — | 1.6 (max 460px wide) |
| Body | body | 16px | 400 | — | 1.5 |
| Small | `.small` | 14px | 400 | — | 1.55 |
| Label | `.mono`, `.eyebrow` | 12px | 400–500 | +0.04 to 0.06em | — |

Rules:
- **Nothing functional below 11px.** This includes labels, chips and timecodes inside interactive UI. Decorative text inside device illustrations may be smaller.
- Keep headlines to **8 words or fewer**. `em` inside `.d1`/`.d2` turns coral (`#ff5a4e`).
- Use tabular numerals for counters and prices.

## Logo
Files: `redesign-mockups/r3/logo-lockup-dark.svg`, `logo-lockup-light.svg`, `logo-mark.svg` (full mark), `logo-mark-solid.svg` (bars only).
- **Nav:** the lockup at 30px (26px on phones). It is lifted with `translate: 0 -30%` so the wordmark lines up optically with the nav links (the particles add headroom above the mark).
- **Footer:** 34px. **Documents:** the light lockup at 22px or larger.
- **Marks:**
  - Use the **full mark at 32px and up**.
  - **Below 32px use the bars-only mark** (avatars, notification icons, favicon). The particles turn to noise at small sizes.
  - Generate the favicon set from `logo-mark-solid.svg`.
- **Don't:** stretch it, recolour the bars, or place it on busy colour.

## Motion principles
- Motion explains cause and effect, never decoration. Every animation shows something happening (a message answered, a card handled, a booking travelling).
- **Scroll-driven (the homepage story, the pinned journey):** use the scroll position directly, with light smoothing (the mockup uses a lerp of 0.12). Never scroll-jack.
- **Time-driven demos (heroes, the player, the alive phone, the control room):**
  - Start them when they enter the viewport (IntersectionObserver).
  - Pause them when they leave.
  - Loop with a rest pause.
- **Reveals:** `.rv` → `.in` fade and 24px rise, staggered with `.d1x`…`.d4x` (80ms steps).
- **`prefers-reduced-motion: reduce`:** every animated component must render its **final, complete state** with no movement. The mockups do this per component (`reduce` checks); the homepage story still needs a static version (see the plan).
- **No endless looping decoration.** Status dots don't pulse forever. Typing dots run a few cycles. Endless loops are allowed only for the slow background aurora and the tool orbit.

## Layout
- **Section rhythm:** `.section` has 140px vertical padding on desktop and 96px under 900px. Section heads put the eyebrow and H2 on the left, with an optional `.small` note on the right.
- **Breakpoints used by the mockups:**
  - 1100: the player and the booking stage collapse.
  - 900: the nav goes to the sheet, heroes stack, laptops become screen cards.
  - 860: the player goes to mobile mode with sticky chips.
  - 760: phone-specific layouts (the story, the journey cards).
- **Laptop heroes under 900px become "screen cards":** no stand, no camera, no scaling. The screen renders at real size with sidebars hidden and inner grids stacked.
