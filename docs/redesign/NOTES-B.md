# Track B · Systems: notes

Read `NOTES.md` first (the shared contract). This file is yours: keep it up to date while you build.

## Scope (from IMPLEMENTATION-PLAN → Stage 2)
`/systems` (control room hero, player with tabs, journey swipe) and the shared player.
Files: `src/app/systems/**`, `components/interactive/{SystemPlayer,ControlRoom,Journey}` (a folder per component is fine, e.g. `interactive/SystemPlayer/…`).

## Stubs you own (props are final; replace the bodies)
- `interactive/SystemPlayer` `{ service?, tabs?, hash? }`:
  - /systems: `<SystemPlayer tabs hash />`; select from `location.hash` on load and on `hashchange` (same page too), keep the hash in sync, `source: "tabs"`.
  - service pages (Track A): `<SystemPlayer service={slug} />`: no tabs, link "See all eight systems →", `source: "service-page"`.
  - `EVENTS.systemPlay` with `{ system, source }`.
  - Scenes: `RUNS[i].screen` is the mockup's HTML with `data-at`/`data-to`; render it with `dangerouslySetInnerHTML` and toggle `.on`/`.off` like player.js → `show()` (including run 7's `.cal .b` cells). Auto-scroll only as far as the newest item needs.
- `interactive/Journey` `{ pinned? }`:
  - swipe (default, /systems): scroll-snap, arrows, progress, "n / 7".
  - pinned (Home ch.04, Track D): D renders `<section className="section" id="journey-sec"><div className="jpin"><div className="wrap">{head}<Journey pinned />{note}</div></div></section>`. Journey pins its **closest `<section>`** (adds `.jpinned`, sets the height: viewport + travel × 1.1 + 25vh) as `mountJourney({ pin })` does. Reduced motion → swipe.
  - Grid column `minmax(0,1fr)` around the track (otherwise it sizes to its content).

## Internal (no stub, your props)
- `ControlRoom`: `CR` in `lib/controlRoom.ts` (copy the values into state; ticks every `CR_TICK_MS` after mount; random picks only in effects). Clicking a row selects that system in the player and scrolls to `#player` with `source: "control-room"`. How ControlRoom talks to SystemPlayer is up to you (both are yours); the props above must not change.
- systems.html's `<style>` (`.cr`, `.cr-row`…) → a CSS Module.

## Shared changes needed
_None yet._

## Differences from the mockup
_None yet._

## Questions for the owner
_None yet._
