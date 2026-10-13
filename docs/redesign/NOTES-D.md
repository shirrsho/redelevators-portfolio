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

## Shared changes needed
_None yet._

## Differences from the mockup
_None yet._

## Questions for the owner
_None yet._
