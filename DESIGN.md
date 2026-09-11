---
name: Red Elevators
description: Growth on Autopilot — a marketing and automation agency site built as a live readout of a system that never stops climbing.
colors:
  red: "#FF2D3B"
  red-hover: "#E51E2B"
  red-soft: "#FF6B74"
  red-text: "#E2101E"
  red-panel: "#EA1826"
  ink: "#17171B"
  ink-soft: "#45454D"
  muted: "#71717B"
  line: "#ECECEE"
  paper: "#FFFFFF"
  cream: "#F8F7F5"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.2vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  metric:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.22em"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  "3xl": "24px"
  panel: "32px"
  full: "9999px"
spacing:
  grid-gap: "16px"
  gutter: "24px"
  card: "28px"
  card-lg: "32px"
  section-sm: "80px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-inverse:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.red}"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  card-service:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card}"
  card-feature:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.card-lg}"
  chip-tag:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
---

# Design System: Red Elevators

## Overview

**Creative North Star: "The Live Ascent"**

Two ideas run this system at once, and neither one outranks the other. The site is a **live
readout** — a pulsing status dot, numbers that count themselves up when they scroll into frame, a
tool marquee that never stops, a rail that fills as you descend the process. And it is an
**ascent** — three bars climbing in the mark with particles lifting off the tallest, cards that
rise 6px under the cursor, a chart line that draws itself upward and to the right. An automation
agency has to look like something already running, and a company called Red Elevators has to look
like something going up. Every screen serves one of those two readings; the strongest screens
serve both at once.

The ground is paper white and near-silent. Structure comes from hairline rules, generous air, and
tonal shifts between sections rather than from boxes and borders fighting for attention. Against
that quiet, a single hot red does all the chromatic work — there is no second accent color in this
system, and adding one would dismantle it. Type carries the personality: geometric Space Grotesk
set tight and heavy for statements, Inter for everything that has to be read calmly, and
letter-spaced uppercase mono for the small machine-labels that make the whole thing feel
instrumented.

Motion is not decoration here, it is the argument. A static screenshot of this site under-sells it
by design: the proof that these systems run without you is that the page itself is visibly
running. That places a real obligation on new work — a page that sits perfectly still is off-brand
in a way no color or type choice can rescue.

**Key Characteristics:**
- Paper-white ground with a single hot red as the only chromatic voice
- Hairline structure (1px `#ECECEE`) instead of heavy containers or drop shadows at rest
- Tight, geometric display type against calm, generous body type
- Uppercase letter-spaced mono micro-labels as the system's connective tissue
- Continuous ambient motion — pulses, counters, marquees, draw-ons, scroll-linked rails
- Springy, generous hover response on every interactive surface
- Radius that scales with the element: 12px controls up to 32px full-width panels

## Colors

A near-monochrome neutral field interrupted by exactly one saturated color. The palette's
discipline is the point: with only one chromatic value in play, red always means something.

### Primary
- **Elevator Red** (`#FF2D3B`): the system's only chromatic voice, and the brand's fixed primary.
  It marks the live thing, the next action, and the number that matters — primary buttons, the
  scroll progress bar, the pulsing live dot, headline stat values, the filled portion of the
  process rail, and the chart line in the hero. Never used as text below 24px — see Red Text below.
- **Elevator Red Deep** (`#E51E2B`): the pressed and hovered state of the primary red only. It
  sweeps across the primary button on hover rather than swapping instantly. Never a resting color.
- **Ember** (`#FF6B74`): the soft tint used for secondary atmosphere — the second aurora blur
  behind the hero, the scrollbar thumb on hover, tertiary indicator dots. It never carries an
  action and never appears as text.
- **Red Text** (`#E2101E`): a text-only tone of the primary red, used exclusively for
  `.font-mono-label` and any other red text below 24px — mono micro-labels, step numbers, section
  eyebrows. Added 12 September 2026 to resolve A11Y-1 (`#FF2D3B` measured 3.69:1 on Paper, 3.45:1
  on Chalk — both fail AA; `#E2101E` clears both at 4.5:1+). This is a tone of the same hue, not a
  second color, so it does not breach The Single Voice Rule.
- **Red Panel** (`#EA1826`): the closing CTA panel's ground only, one step darker than the primary
  red so solid white text on it clears AA (4.51:1, was 2.99:1/2.77:1 at `white/85`/`white/80` on
  `#FF2D3B` — A11Y-2). Not used anywhere else; the primary red stays the fill on every other
  surface — buttons, the mark, dots, bars, rails, large numerals.

### Neutral
- **Graphite** (`#17171B`): the brand's fixed secondary and the body text color. Doubles as a full
  section ground for tonal inversion (the Process section) and as the dark button fill in the
  nav's persistent CTA.
- **Slate** (`#45454D`): secondary text — nav links at rest, footer links, chip labels. One step
  down from Graphite, never used on large type.
- **Smoke** (`#71717B`): tertiary text — body paragraphs under headings, metric captions, muted
  labels. The lowest-contrast text the system permits, and it is at the floor deliberately: 4.83:1
  on Paper and 4.51:1 on Chalk. Do not lighten it; there is no headroom left.
- **Hairline** (`#ECECEE`): every border, divider, and grid line in the system. This one value
  does nearly all the structural work; there is no second border color.
- **Paper** (`#FFFFFF`): the brand's fixed background and the default card surface.
- **Chalk** (`#F8F7F5`): the alternate section ground and the resting fill for chips, mini-stat
  tiles, and secondary-button hover. The barely-there warm step off pure white.

### Named Rules

**The Single Voice Rule.** Elevator Red is the only chromatic color in this system. Every other
token is a neutral. When a new surface seems to need a second color — a success green, a chart
palette, a category accent — the answer is a neutral, a tone of red, or a change of ground. A
second hue is a redesign, not an addition.

**The Signal Rule.** Red marks what is live, what is next, or what is the answer. It never
decorates. If red appears on a surface where nothing is happening and nothing is being asked of
the visitor, it is misapplied.

**The Ground Change Rule.** Sections separate by changing ground — Paper, Chalk, Graphite, or the
red CTA panel — not by stacking dividers. A heavy rule between two same-ground sections is the
wrong tool; change the ground or increase the air.

**The Contrast Floor Rule.** Every text colour in this system has a measured ratio against the
ground it sits on, recorded in
[`docs/accessibility-audit-2026-09-10.md`](docs/accessibility-audit-2026-09-10.md). Neutrals pass
WCAG AA. Elevator Red itself does not pass as small text, which is why red text below 24px always
uses Red Text (`#E2101E`), never the primary `#FF2D3B` — see above. The three A11Y findings from
10 September (red-as-small-text, the CTA panel, the marquee) are all resolved as of 12 September.
Never set a text colour by eye: compute it against its actual ground, flattening any opacity first.

**The Light-Only Rule (provisional).** The site ships light-only (`color-scheme: light`); there is
no dark theme and no theme toggle. Dark brand assets exist at `public/brand/*-dark.svg` and the
brand sheet defines a full dark palette, but neither is in play on the web surface. Do not
introduce `prefers-color-scheme` handling, dark variants, or a toggle until this decision is
reopened. Treat the unused dark assets as out of scope, not as a defect.

## Typography

**Display Font:** Space Grotesk (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Inter (with `ui-sans-serif, system-ui, sans-serif`)
**Label/Mono Font:** JetBrains Mono (with `ui-monospace, monospace`)

**Character:** Space Grotesk is geometric and slightly mechanical — set tight and heavy it reads as
engineered rather than corporate, which is exactly the register an automation agency needs. Inter
does the calm, unglamorous work of being read. JetBrains Mono appears only in small uppercase
bursts, and it is what makes the whole system feel instrumented rather than merely tidy.

### Hierarchy
- **Display** (Space Grotesk 600, `clamp(2.6rem, 6.2vw, 4.6rem)`): the hero statement only. One per
  page, animated in line by line. Renders at its own `leading-[0.98] tracking-tight` utilities
  (line-height 0.98, tracking -0.025em) rather than the base heading values below, now that
  utilities correctly win — see The Layered Heading Rule below.
- **Headline** (Space Grotesk 600, `clamp(1.9rem, 4vw, 3rem)`, line-height 1.02, tracking
  -0.03em): every section heading. Always preceded by a mono label.
- **Metric** (Space Grotesk 600, 2.25rem stepping to 3rem in stat grids, 3rem stepping to 3.75rem
  in feature cards): standalone numeric values. Set in Elevator Red on light grounds, or in the
  card's own accent.
- **Title** (Space Grotesk 600, 1.25rem): card and item headings.
- **Body** (Inter 400, 1rem, line-height 1.6): all running text. Section intros step up to
  1.125rem in Smoke; card copy steps down to 0.95rem. Constrain measures to roughly 42rem
  (`max-w-2xl`) for intros and 28–32rem inside cards.
- **Label** (JetBrains Mono 500, 0.72rem, tracking 0.22em, uppercase): section eyebrows, step
  numbers, status readouts, footer column heads. Elevator Red by default; overridden to Smoke or
  white when it sits on a colored or dark ground.

### Named Rules

**The Three Voices Rule.** Space Grotesk states, Inter explains, JetBrains Mono labels. The jobs
never swap. Mono is never body copy or a heading; Inter is never a display headline; Space Grotesk
is never a paragraph.

**The Tight Top Rule.** Display, headline, title and metric all run at -0.03em tracking and a
line-height at or below 1.02 — headings are meant to feel compressed and machined. Body copy
inherits none of it and stays at 1.6. Loosening a heading or tightening a paragraph both break the
contrast the system depends on.

**The Layered Heading Rule.** `globals.css` sets `h1, h2, h3, h4`'s defaults (font-family, weight
600, tracking -0.03em, line-height 1.02) inside `@layer base`, so a Tailwind typography utility on
a heading (`@layer utilities`, which always wins) correctly overrides them — fixed 12 September
2026, previously these rules sat outside any layer and silently beat every utility. Verified
in-browser: the hero now computes line-height 0.98 / tracking -0.025em, its own
`leading-[0.98] tracking-tight`, instead of the base 1.02 / -0.03em. A heading with no typography
utility still gets the base values above; add one to override them, and it will now land.

**The Label-First Rule.** Every section opens with a mono label above its headline. The label
names the section in two or three words; the headline makes the claim. A section heading with no
label above it is incomplete.

## Layout

A single centered column governs the whole site: `max-w-6xl` (1152px) with a 24px gutter
(`px-6`). Every section shares that container, so all left edges align down the full page.
Nothing breaks the container except a section's background — grounds, the red CTA panel, and the
marquee's mask run full-bleed while their content stays on the 1152px line.

**Vertical rhythm.** Sections run at 96px top and bottom (`py-24`), stepping to 80px for lighter
interstitials like the stat band and 64px in the footer. The gap between a section's heading block
and its content is a consistent 56px (`mt-14`). The hero is the deliberate exception, opening at
144–176px of top padding to clear the floating nav and give the display type room to land.

**Grids.** Content grids use a 16px gutter (`gap-4`) and collapse predictably: three columns at
`lg` (1024px) for service cards, two at `sm` (640px), one below. System Anatomy panels run full
width, one per row, stacked with a 16px gutter — the chain needs the horizontal room. The stat band is the one exception — it uses a 1px gutter over a Hairline
ground so the four cells read as a single divided object rather than four separate cards.

**Density.** Cards carry 28px of internal padding, stepping to 32px for the larger feature and
feature cards. The system is deliberately airy; when a layout feels tight the fix is more
outer air, not smaller type.

**The hero is asymmetric.** Its two columns run `1.05fr / 0.95fr` — copy slightly wider than the
visual — and collapse to a single column below `lg`. This is the only intentionally uneven grid in
the system.

### Named Rules

**The One Column Rule.** Every section lives inside the same 1152px container with the same 24px
gutter. Backgrounds may go full-bleed; content may not. A section that sets its own width breaks
the alignment spine the whole page depends on.

## Elevation & Depth

**Surfaces are flat at rest.** Depth comes from three sources in priority order: hairline borders
define edges, ground-tone changes separate regions, and shadow appears as a *response* — the card
lifts and casts as the cursor arrives. That sequencing is what makes hover feel physical here; if
every card already floats, the lift has nothing to say.

This is a strong default with one deliberate exception, confirmed with the project owner: **where
a resting shadow genuinely reads better than a flat surface, use it.** Two cases already in the
build show the shape of the exception — the hero's floating panel and its label chips carry a
resting shadow because they hover above the page rather than sitting in it, and the primary red
button carries a resting red glow because it is the page's single most important target. Both earn
it. A grid of ordinary content cards does not.

Beneath everything sits an atmospheric layer that is not elevation at all: heavily blurred red
"aurora" blobs (70px blur, ~0.55 opacity) drifting on a 16s loop behind the hero and the Process
section, a masked 64px grid behind the hero, and a 22px dot field over dark grounds. These
establish atmosphere and never imply that anything is raised.

### Shadow Vocabulary
- **Soft** (`0 1px 2px rgba(23,23,27,0.04), 0 12px 32px -12px rgba(23,23,27,0.12)`): the scrolled
  nav bar and small floating chips. Present but nearly subliminal.
- **Lift** (`0 1px 2px rgba(23,23,27,0.05), 0 24px 60px -20px rgba(23,23,27,0.18)`): the hover
  state of every content card, and the resting state of the hero's floating panel.
- **Red glow** (`0 10px 30px -8px rgba(255,45,59,0.45)`): the primary red button only. It is the
  one place in the system where a shadow is tinted, and it should stay that way.

### Named Rules

**The Flat-Until-Touched Rule.** Content cards rest flat with a hairline border and gain the Lift
shadow on hover. The testimonial card was the one family that broke this; it was removed from the
site in the truth pass of 9 September 2026 and survives only as a styleguide pattern. If it ever
returns, it returns flat. Exceptions are allowed where a surface genuinely floats above the page or is the
single most important target on it — but the exception must be argued from the element's role, not
applied to a grid by default.

**The Untinted Shadow Rule.** Shadows are neutral Graphite at low alpha. The one tinted shadow in
the system belongs to the primary button. A second colored glow dilutes it.

## Shapes

Rounded, generous, and consistently scaled — nothing in this system has a sharp corner, and
nothing is a stadium unless it is a pill.

Radius scales with the element's footprint: 6px for the smallest floating labels, 8px for nav
links, 12px for buttons and small tiles, 16px for standard content cards and the nav bar itself,
24px for large feature cards and grouped containers, and 32px for the full-width CTA panel. Fully
round (`9999px`) is reserved for genuine pills and circles — tags, status dots, avatars, icon
buttons, and the scrollbar thumb.

Borders are always 1px in Hairline, or `white/15`–`white/20` on dark grounds. Where a border would
crowd a layout the system drops it entirely and relies on ground contrast instead. Icon buttons
are perfect 36px circles that invert to solid red on hover. The three-bar mark uses a 4px radius
on 12px-wide bars, which is the origin of the whole rounded language.

### Named Rules

**The Radius Ladder Rule.** Radius is a function of size: 12px controls, 16px cards, 24px large
cards, 32px full-width panels, full for pills. A 12px radius on a full-bleed panel or a 32px
radius on a button both read as mistakes, because the corner arc no longer matches the edge it
turns.

**The One Hairline Rule.** There is exactly one border color on light grounds (`#ECECEE`) at
exactly one width (1px). Darker, thicker, or doubled borders are not part of this system; if an
edge needs more presence, change the ground behind it.

## Components

### Buttons
- **Shape:** consistently rounded (12px), never pill-shaped, never square.
- **Primary:** Elevator Red ground, white label, 24px horizontal and 14px vertical padding,
  carrying the red glow at rest. On hover a Deep Red panel sweeps in from the left over 300ms
  while the whole button scales to 1.03 and an arrow fades in; on press it drops to 0.95.
- **Secondary:** Paper ground, Graphite label, Hairline border, same geometry. Hover darkens the
  border toward Graphite at 30% and fills with Chalk.
- **Dark:** Graphite ground, white label, tighter padding (16px / 10px). This is the nav's
  persistent CTA — it stays visible while the hero's primary red button scrolls away, so the page
  always has exactly one visible primary action.
- **Inverse:** Paper ground, Elevator Red label — used only on the red CTA panel, where the
  ground and the primary color have traded places.
- **All buttons** scale up on hover and down on press. That 1.03 / 0.95 pair is the system's
  standard tactile signature.

### Chips
- **Style:** Chalk ground, Slate label, fully round, 10px / 4px padding, 0.75rem medium weight.
  Used for service tags. A bordered variant adds a Hairline stroke and is used for category tags
  on feature cards.
- **State:** static. Chips label; they do not filter or toggle in this system.

### Cards
- **Corner style:** 16px for standard cards, 24px for large feature cards and anatomy panels.
- **Background:** Paper on light sections; Paper retained on Chalk sections so cards separate from
  the ground.
- **Shadow strategy:** flat with a Hairline border at rest, Lift on hover. See Elevation & Depth.
- **Internal padding:** 28px standard, 32px large.
- **Hover behavior:** the card springs up 6px (spring, stiffness 300, damping 22) and gains Lift.
  Service cards additionally carry a cursor-tracked red radial glow — a 240px `rgba(255,45,59,0.10)`
  circle following `--mx`/`--my` — that fades in over 300ms. Feature cards instead bloom a large
  blurred accent orb in the top-right corner and draw a hairline underline left-to-right over
  500ms. Each card family gets one distinctive hover flourish; they are not mixed.

### Navigation
- **Style:** a floating 16px-radius bar inset 16px from the top, centered on the 1152px container.
  Transparent and borderless over the hero, then transitioning over 300ms to Paper at 80% with a
  blur, a Hairline border, and the Soft shadow once scroll passes 24px.
- **Links:** Inter medium 0.875rem in Slate, 8px radius, filling with Chalk and darkening to
  Graphite on hover.
- **Mobile:** below `md` (768px) links collapse behind a three-bar toggle that morphs into an X.
  The panel is a full-screen Paper overlay at 95% with a blur; items are display-type 1.5rem,
  separated by hairline rules, staggered in at 50ms intervals, with a full-width red button at the
  bottom. Body scroll locks while it is open.

### Section Heading
- The system's most-reused composition: a mono label in Elevator Red, a 16px gap, a headline in
  Graphite, then an optional 1.125rem Smoke intro constrained to `max-w-2xl`. Left-aligned by
  default with an optional centered variant. Each of the three parts reveals independently at 0 /
  50 / 100ms. Reuse this rather than assembling section headings by hand.

### Scroll Progress Bar
- A 3px Elevator Red bar pinned to the very top of the viewport above everything (`z-60`), scaling
  from the left origin with page progress, spring-smoothed (stiffness 140, damping 30). It is the
  first thing that tells a visitor the page is instrumented.

### Process Rail
- On the Graphite section, a 1px vertical rail at `white/15` runs the full step list with an
  Elevator Red rail scaling over it as you scroll through, tied to the section's own scroll range
  with a spring. Each step is numbered in a bordered circle that fills red on hover. This is the
  clearest single expression of the North Star and should be preserved in spirit if the section is
  ever rebuilt.

### Animated Counter
- Numeric values animate 0 → target over 1.4s on first entry into view, using the system easing,
  with a 2.2s safety timeout that snaps to the final value if the tab is backgrounded. Under
  reduced motion the final value renders immediately. Any large standalone number in this system
  should count.

### System Anatomy — signature component

**Built and shipping** on the home page (`src/components/SystemAnatomy.tsx`), driven by the
`systems` data in `src/lib/content.ts`. It is the system's proof device: a workflow drawn end to
end, each node naming the tool it runs in, with a red pulse travelling the wire on a loop.

A **server component by design** — nodes and wires are static markup and the pulse is pure CSS, so
the diagram never depends on JavaScript and never paints empty while hydrating.

- **Node:** 12px radius, 16px padding, Paper ground, 1px Hairline border, 6px internal gap. Nodes
  flex to equal widths (`flex-basis: 0`), so a chain reads as one evenly divided object.
- **Node content, three lines:** step position in mono at 10px / 0.16em tracking / uppercase in
  Smoke; the action in Space Grotesk 600 at 16px / -0.03em; the tool in JetBrains Mono at 11px in
  Slate.
- **Wire:** a 40px span carrying a 1px Hairline line, horizontal from `lg`; a 26px vertical line
  below it.
- **Pulse:** a 7px Elevator Red dot travelling the wire, 5.4s linear loop, each segment delayed by
  0.6s so the pulse walks the chain. Nodes light their border red as it arrives.
- **Direction:** horizontal from `lg` (1024px), stacked vertically below it. It must never scroll
  sideways.
- **Reduced motion:** the global override collapses both animations to their resting state — dot
  hidden, borders Hairline — and the diagram still reads completely.
- **Chain length:** 4–7 nodes. The shipped chains run 6, 5 and 4.
- **Semantics:** an ordered list. It is information, not decoration, and must be readable as
  ordered text.

### Systems section

The home page block that carries the anatomies, and the pattern for any surface that needs proof.
Chalk ground at 96px rhythm; each system is a Paper panel at 24px radius with 28px padding
(36px from `sm`), flat with a hairline border — anatomies never rest on a shadow. Panel heading is
title-size stepping to 24px, with the service line named in a bordered chip on the same baseline.

### Planned system extensions

Not yet designed, and deliberately not specified here — inventing values would be worse than the
gap. Tracked as workstream D in [`docs/site-plan.md`](docs/site-plan.md): form controls (none of
any kind exist today), a page-header pattern for non-home pages, long-form prose styles, a
navigation system that scales past anchor links, 404 and empty states, and focus-visible styling.
Form controls, the page header and focus states are already designed in the styleguide and need
porting rather than designing.
When each is built, add it to this section and re-run `/impeccable document`.

### Motion Grammar
- **Standard easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — fast out, long settle. Used for every
  entrance and draw-on.
- **Entrances:** 24px rise with fade over 600–700ms, triggered 80px before the element enters view,
  once only. Groups stagger children at 80ms.
- **State transitions:** 200–300ms. **Card lift:** spring, stiffness 300, damping 22.
- **Ambient loops:** aurora drift 16s, marquee 32s linear (pausing on hover), float bob 4–6s,
  live-dot ping continuous.
- **Reading contexts are quiet.** See The Reading Calm Rule below.
- **Reduced motion is honored globally** in `globals.css`: all animation and transition durations
  collapse to 0.001ms and smooth scrolling is disabled. Components additionally check
  `useReducedMotion()` to skip transforms and render final states directly. Both layers must be
  maintained — the CSS alone does not stop a JS-driven counter or a `y: [0,-8,0]` loop.

### Named Rules

**The Reading Calm Rule.** Ambient and reveal motion belongs to persuasion surfaces — the home
page, service pages, the CTA. In reading contexts (articles, documentation, long-form prose,
anything a visitor stays inside to comprehend), motion recedes to state feedback only: hover,
focus and press. Reveal-on-scroll down a 2,000-word article is an obstacle, not a signature. The
system's obligation to move is an obligation on surfaces that persuade, not on every page.

**The Visible Focus Rule.** Every interactive element carries a `:focus-visible` treatment, and it
must remain visible on all four grounds — Paper, Chalk, Graphite and the red CTA panel. A single
outline color cannot satisfy that; expect to invert it on dark and red grounds. No interactive
element in this system may rely on the browser default, and none may remove the outline without
replacing it. **Nothing in the codebase satisfies this yet** — it is a confirmed requirement, not
a description of the current state.

## Do's and Don'ts

### Do:
- **Do** open every section with a mono label above the headline, and reuse the Section Heading
  composition rather than rebuilding it.
- **Do** keep all content inside the 1152px container with a 24px gutter; let only backgrounds go
  full-bleed.
- **Do** let cards rest flat with a hairline border and earn their shadow on hover — and where a
  surface genuinely floats or is the page's single most important target, give it a resting shadow
  deliberately.
- **Do** scale radius to the element: 12px controls, 16px cards, 24px large cards, 32px panels.
- **Do** make new sections move. Ambient motion is the system's core argument; a page that sits
  perfectly still is off-brand.
- **Do** honor reduced motion in both layers — the global CSS override and `useReducedMotion()`
  inside any component that animates in JS.
- **Do** keep the mark's clear space equal to one bar's width on all sides, per the brand sheet.
- **Do** separate sections by changing ground (Paper → Chalk → Graphite → red panel) rather than
  by stacking dividers.
- **Do** give every interactive element a `:focus-visible` treatment that survives Paper, Chalk,
  Graphite and the red panel.
- **Do** let motion recede to state feedback on reading surfaces, per The Reading Calm Rule.
- **Do** prove capability by showing mechanism — the real chain, the real tools — rather than by
  asserting an outcome. The System Anatomy is the system's answer to a section that seems to need
  proof.

### Don't:
- **Don't** introduce a second chromatic color. One red, everything else neutral. No success
  greens, no category palettes, no chart colors beyond red and Graphite.
- **Don't** use red where nothing is live, next, or being asked of the visitor.
- **Don't** add dark mode, `prefers-color-scheme` handling, or a theme toggle. The site is
  light-only until that decision is reopened, and the unused dark brand assets are not a defect.
- **Don't** drift toward the generic AI-startup look: purple and blue gradients, frosted glass
  panels, dark-by-default surfaces, floating 3D shapes, glowing orbs. This is the single most
  likely failure mode for an automation agency site and the fastest way to look like everyone else.
- **Don't** drift toward the corporate stock-photo agency look: smiling people in meeting rooms,
  handshake imagery, corporate blue, or abstract "solutions" language.
- **Don't** drift toward loud growth-hacker marketing: countdown timers, scarcity badges, neon
  slabs, arrows pointing at buttons, or urgency the product does not actually have.
- **Don't** swap the type roles — no mono body copy, no Inter headlines, no Space Grotesk
  paragraphs.
- **Don't** loosen heading tracking above -0.03em or tighten body line-height below 1.6.
- **Don't** add a second border color or a border heavier than 1px. If an edge needs presence,
  change the ground behind it.
- **Don't** tint a shadow. The red glow on the primary button is the system's only colored shadow.
- **Don't** design a composition whose layout only holds together when filled with metrics,
  logos, or testimonials. Proof is scarce on this project (see PRODUCT.md) — a section must read
  as finished with its real content or with the slot honestly empty.
- **Don't** add a heading typography utility and assume it applied. See The Unlayered Heading
  Rule; verify in the browser until the cascade-layer fix lands.
- **Don't** invent a second proof device. If a surface needs credibility, it gets a System
  Anatomy, not a new badge, counter, logo wall, or rating widget.
