# Track B · Systems: notes

Read `NOTES.md` first (the shared contract). This file is yours: keep it up to date while you build.

## Scope (from IMPLEMENTATION-PLAN → Stage 2)
`/systems` (control room hero, player with tabs, journey swipe) and the shared player.
Files: `src/app/systems/**`, `components/interactive/{SystemPlayer,ControlRoom,Journey}` (a folder per component is fine, e.g. `interactive/SystemPlayer/…`).

## What was built
- `interactive/SystemPlayer.tsx`: ported from `player.js → mountPlayer`. Same props as the stub (`service?`, `tabs?`, `hash?`). Also exports `selectSystem(slug, source)`, which the ControlRoom uses (a `CustomEvent` on `window`, so the two components don't need a shared parent or context).
- `interactive/ControlRoom.tsx` + `ControlRoom.module.css`: from `systems.html` (markup, the `<style>` block, the ticker).
- `interactive/Journey.tsx`: both modes. Swipe is the default. Pinned adds `.jpinned` to the closest `<section>` after mount.
- `app/systems/page.tsx`: the real page (hero + control room, "Watch one run", journey, CTA band). No `StubBox` is left in it.

Timings and sizes are the mockup's: 350ms to step 0, 1.3s then 1.5s per step, the 120ms scroll delay, the 35% threshold, 2.6s ticks, a 900ms flash, a 350ms feed swap, `minmax(0,1fr)` around the journey track, the 1.1× and 25vh pin height, `min-height: 700` (CSS, ported verbatim in Stage 1).

## How the pieces work (for the integrator)
- **Deep links:** `/systems#paid-social` selects that tab after hydration and scrolls to `#player` (the page's `<section id="player">`; the player looks for its closest `#player`, else scrolls itself). `hashchange` on the same page also works (e.g. an `<a href="/systems#paid-social">` clicked while on `/systems`). A tab click keeps the hash in sync with `history.replaceState`.
- **Service pages (Track A):** `<SystemPlayer service="paid-social" />` has no tabs and no pillar tag, the link reads "See all eight systems →" (`/systems`, Umami `View all systems`, location `service-player`), and the first time it plays in view it fires `System play { system, source: "service-page" }`. Moving between two service pages remounts the player (Next keys each dynamic segment by its value), so it starts fresh each time. Caveat: if `cacheComponents` is ever turned on, Next keeps earlier pages alive in a hidden `<Activity>`; a player left mid-run would then come back paused on that step until Replay. Not an issue with the current config.
- **Journey pinned (Track D):** render `<section className="section" id="journey-sec"><div className="jpin"><div className="wrap">…<Journey pinned />…</div></div></section>`. Journey adds `jpinned` and the section height after mount, and removes them on unmount. Before hydration (and with reduced motion, or without JS) it is the swipe version, so there is no horizontal overflow. I tested it on a throwaway route (not committed): the cards move with the wheel, the current card is highlighted, and the arrows scroll the page to the next/previous card.
- **Reduced motion:** the player shows its final state as soon as it is in view (all steps done, every scene part on); the control room doesn't tick; the pinned journey falls back to swipe.
- **Hydration:** the control room's counters start from `CR` and only tick after mount, and only while the room is on screen. The player's first render is always system 1 (or the `service` prop); the hash is read after mount.

## Shared changes needed
None required. Nice-to-haves for Stage 3:
- `Journey` cards keep the mockup's `h4` under the section's `h2` (see NOTES.md decision 4); same for the control room, which has no headings.
- `src/components/ui/StubBox.tsx` can go once Tracks A, C and D are merged (`grep -r "STUB:" src`). The two Track B stubs (`SystemPlayer`, `Journey`) no longer carry the `// STUB:` comment.

**Integration (merged into `redesign-2026`, 14 Oct 2026). Nothing shared was changed; deferred to the final integration:**
- Delete `StubBox`: Track A's four stubs remain (ServiceCard, SavingsCalculator, Calendar3Week, PricingTiers).
- The `h4` heading order above: owner decision.
- From the Track B review: "↓" and "→" are not in any of the three fonts. The mockup falls back to the system font (SF), the build to Arial (next/font's metric fallback), so "Watch one run ↓" and "See the service →" look thinner than the mockup on every page. Fix in `layout.tsx` (shared): give the three `next/font` calls a `fallback` that starts with `system-ui`, or add a system font to `--sans` / `--display` before the next/font fallback.

## Differences from the mockup
| Area | Mockup | Built | Why |
|---|---|---|---|
| Tabs | Every tab is in the tab order; Left/Right move and wrap | Roving tabindex (only the selected tab is tabbable), Left/Right wrap, **Home/End** added; tab ids and `aria-labelledby` on the panel | Standard tablist pattern, so keyboard users don't tab through eight chips |
| Journey track (swipe) | Plain scrolling div | `tabIndex=0`, `role="region"` and a label | A scrollable region must be reachable by keyboard |
| Step node logos | `aria-label` on each SVG | The node is `aria-hidden`; the step text already names the tool | Avoids reading each tool twice |
| Control room | Ticks run all the time | Ticks only while the room is on screen | DESIGN-SYSTEM → "pause out of view"; also not during render, so no hydration risk |
| Deep link on a phone | Selects the tab; the chip may stay off-screen | The linked chip is scrolled into view (horizontally, without moving the page) | Small usability fix |
| "System play" | n/a | On every visitor selection (`tabs`, `control-room`) and once when a service-page player first plays in view (`service-page`). Replay does not fire it | Matches the analytics table; replays would inflate the count |
| Tabs and SEO | Only the selected system is in the DOM | Same: the server HTML has system 1's run (title, steps, result strip); the other seven appear on selection | Same as the mockup. If the owner wants all eight in the HTML, render the eight panels and hide seven; it is a small change in `SystemPlayer.tsx` |
| Link targets | `systems.html`, `service.html?s=…` | `/systems`, `/services/<slug>` | Real routes |
| Dev-server note | n/a | `preview_start` runs from the main checkout, which already has `next dev` on :3000, so `redelevators-dev-b` could not start from inside a worktree. I ran `npm run dev -- -p 3002` in the worktree instead | Environment only |

## Questions for the owner
None.
