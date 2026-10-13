# Track D · Homepage: notes

Read `NOTES.md` first (the shared contract). This file is yours: keep it up to date while you build.

## Scope (from IMPLEMENTATION-PLAN → Stage 2 and "Homepage notes")
The story stage and chapters 04–09 on `/`.
Files: `src/app/page.tsx`, `components/story/*`, `components/devices/{PhoneMockup,LaptopConsole}`, `components/viz/ToolOrbit`. (`Notification`, `PhoneShell` and `LaptopShell` became shared Stage 1 components because A and C draw phones too: build the story phone and laptop on them. If the story needs something they can't do, note it below rather than forking.)

## What's on `/` now
A skeleton with the real H1 and hero copy, then chapters 04–09 with their section heads and the other tracks' stubs: `<Journey pinned />` (B), 8 × `<ServiceCard>` (A), `<SavingsCalculator />`, `<CurrencyToggle />` + `<PricingTiers compact />` (A + shared), `<Calendar3Week linkId="time" />` with your `.weeks#time` steps (A), the promises and "also works with" (yours), `<BookingStage variant="home" />` (C). Keep the section ids: the nav's Book goes to `#calm`, "Skip the story" to `#build`, "See how it works" jumps into the story.

## Contracts with other tracks
- **Journey pinned:** keep `<section className="section" id="journey-sec"><div className="jpin"><div className="wrap">…<Journey pinned />…`. Journey pins its closest `<section>`.
- **Calendar link:** the `.wk` steps carry `data-phase` (audit, design, build, live) inside `id="time"`.
- **Pillar filter (ch.05):** a small client wrapper of yours holds the tab state and passes `dimmed` to each `ServiceCard`.

## Notes
- Data: `lib/story.ts` (SEG, GAP 86, LERP .12, PAINS, TURNS, N, LIFT, morning summary, console tools/nav/chart, TIME_OF_DAY) and `lib/home.ts` (weeks, orbit rings, promises, also). The five console views' inner copy is inline in home.js `#conMain`: port it unchanged.
- **Background:** you animate `--bg` on `<html>` (`style.setProperty`). `PageBg tone="night"` sets the base; **remove your inline `--bg` on unmount**, or other pages keep the story's last colour after a client-side navigation.
- The nav's `scrolled` state is already handled by `Nav`; don't toggle it from the story loop (home.js does).
- home.html's `<style>` → CSS Modules. Its generic names (`.ctas`, `.lines`, `.ln`, `.dots`, `.kick`, `.copy`, `.rig`) collide with global classes (`.con .bar .dots`, `.phero .ctas`), so scope them.
- `EVENTS.storySkip` on "Skip the story", `EVENTS.seeHowItWorks` on "See how it works", `EVENTS.jumpToBooking` on in-page Book buttons.
- Off-screen pause for the rAF loop and the static reduced-motion version (four stacked chapters) are required.

## What Track D built
| File | What |
|---|---|
| `src/app/page.tsx` | `/`: `<StoryStage/>`, then chapters 04–09 (section ids unchanged: `#story`, `#journey-sec`, `#build`, `#calc`, `#how`, `#time`, `#tools`, `#calm`) |
| `components/story/StoryStage.tsx` (C) | The story engine: home.js `step()` ported structure for structure (SEG, GAP 86, lerp .12, `X()` + `--edge`, measured `copyRight` on step change only, FLIP, spotlight `clip-path`, beam, scan, `<mark>`, return-card curve, +.12 stagger, wire, rail, clock, time of day) |
| `components/story/StoryStatic.tsx` (C) | prefers-reduced-motion: the four chapters as stacked sections in their final state |
| `components/story/StoryCopy.tsx` | Hero copy (the H1), morning copy, `paintBg()` |
| `components/story/notes.tsx` | Story notifications: tile, `<mark>` body, handled state, morning summary |
| `components/story/HomeServices.tsx` (C) | Ch.05 head + pillar filter + 8 × `ServiceCard dimmed` |
| `components/story/story.module.css` | home.html `<style>`, line for line (+ the static version's rules) |
| `components/devices/PhoneMockup.tsx` | Story lock screen on `PhoneShell` |
| `components/devices/LaptopConsole.tsx` | The "Your system" console + its five views (home.js `#conMain` copy unchanged) |
| `components/viz/ToolOrbit.tsx` (C) | Ch.08 orbit |

How the port works: markup renders once on the server (the H1, lead and every chapter line are in the HTML); the per-frame work stays imperative (refs, `classList`, `style`) so scrolling never re-renders React. Only three pieces of content are React state: the lifted card, the returning card, and which phone cards show their "handled" text.

## Shared changes needed
None required. Two things for the integration session to know:
- **Lightning CSS drops `translate` when the same rule also sets `transform`** (Turbopack's CSS minifier folds them and loses the translate). It broke the story's `.ch{translate:0 -50%;transform:…}`; worked around with `translate:0 var(--ch-y,-50%)`. The shared CSS in `src/styles/` has no such rule (checked), but check other tracks' CSS Modules for the pattern.
- `useInView`/`useRafLoop` work as designed; nothing to change.

## Differences from the mockup
- **Added (required by the plan):** the story's rAF loop runs only while `#story` is on screen (IntersectionObserver); when it resumes it snaps to the scroll position instead of lerping through every chapter in between. The static reduced-motion version. Server-rendered first frame: chapter 01 is already `.on`, the rigs start at the hero position, and a one-frame `init` class stops them sliding in from that guess on hydration.
- **Time-of-day background:** `paintBg` runs from a passive scroll/resize listener instead of the rAF loop (it must keep working on chapters 04–09 while the loop is paused). Same colours and breakpoints. The inline `--bg` is removed on unmount (checked: empty on `/services` after a client-side navigation).
- **Timing nuance:** the lifted card's FLIP waits until React has rendered the new card (≤1 frame later than the mockup); a card's "handled" text swaps one commit after its `.done` class (the class, and so the `landed` flash, is immediate).
- **Accessibility additions:** links in hidden chapters leave the tab order (`tabIndex=-1`) while still readable; rail buttons carry `aria-label` (their text is hidden ≤760); the pillar tabs are `aria-pressed` buttons in a labelled group; the orbit is one `role="img"` with the tool list; device rigs, beam, wire and lift card are `aria-hidden` (their text duplicates the chapter copy).
- **ToolOrbit:** pauses its CSS spin off screen; and `--fit` shrinks the rings when the column is narrower than the outer ring plus a tile. The mockup overflows the page by 14px at 900 (ring 496px in a ~392px column); now 0.
- **"See how it works"** has `href="#story"` (the mockup's `#`) as the no-JS fallback; with JS it jumps to chapter 02 as before. The morning "Book" button tracks `Jump to booking` with location `story`.
- **Morning laptop at 1280/1900:** its rotated bounding box ends 1.5px past the 1240 column (45% opacity, mockup's `X(.79)` and `lf*.82` kept). Same in the mockup.

## QA results (Track D)
- Lift card vs chapter text, all four "Sound familiar?" steps (minimum gap, text→card / card→phone): 1900: 32 / 46 · 1440: 31 / 46 · 1280: 32 / 45 · 1100: 32 / 21 (the card scales to .8). No overlap at any of them.
- Inside the 1240 column through all 10 story positions at 1900, 1440, 1280, 1100: yes, except the faded morning laptop (+1.5px, above).
- Staggered flips: target first, then +.12 (turn 01: Maria at .55, James at .67, the Airbnb rate card at .79).
- 375: phone version (lifted card zoomed in the phone with the amber ring and highlight; handled cards; 2 visible + "n more"); "Skip the story →" visible in the hero. No horizontal scroll at 375, 768, 900, 1100+.
- Loop off screen: 0 frames/s at `#calm` and the footer; resumes on return.
- Reduced motion: static version renders (one H1, four chapters, final states). Tested by patching `matchMedia` and remounting through a client navigation; the browser pane can't emulate the media query itself.
- Not verified: the story sweep at 900 and 768 (the browser pane was hidden, so rAF and IntersectionObserver didn't run). Not in the required widths, but worth a look at integration.
- Lint, `tsc` and `next build` pass. No console errors.

## Integration notes
- Contracts kept: `<section className="section" id="journey-sec"><div className="jpin"><div className="wrap">…<Journey pinned />`; `.weeks.linked#time` with `data-phase` on each `.wk`; `<Calendar3Week linkId="time" />`; `<BookingStage variant="home" />`; `<PricingTiers compact />`; `ServiceCard` with `dimmed`/`delay`/`location="home"`.
- `paintBg` reads `#journey-sec` and `#calm` positions on every scroll, so Journey's pinned height (set after mount) is picked up without coordination.
- Once B's Journey lands, re-check the dawn → day blend into chapter 04 against the mockup (it depends on the section's real height).

## Questions for the owner
None.
