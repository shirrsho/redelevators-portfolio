# Components

The live library is at `/_design/components/` on the preview. Each entry below gives the mockup source and the behaviour that must survive the port. "C" means a client component (`"use client"`). Everything else should be a server component.

Suggested folders, replacing today's flat `src/components/`:
- `layout/`
- `devices/`
- `story/`
- `cards/`
- `viz/`
- `interactive/`
- `ui/`

## Layout
| Component | Source | Behaviour |
|---|---|---|
| `Nav` (C) | `site.js` → `navHTML`, `base.css` "Nav" | Floating rounded glass bar, 14px from the top, content-column width + 24px. A 3-column grid: logo, centred links, Book. Darker after any scroll (`scrolled` once `scrollY > 10`). The current page gets a soft pill + red dot (`aria-current="page"`). "Book a call" goes to `#calm` on home, `/contact` elsewhere. |
| `MobileSheet` (C) | `site.js` (burger), `base.css` `.msheet` | Under 900px: logo + Book + 42px burger (2 lines → X). A full-screen sheet with 34px links, a hint per link, staggered entrance, and Book + email at the bottom. Closes on link click and Escape. Locks body scroll. `aria-expanded`/`aria-controls`. |
| `Footer` | `site.js` → `footHTML` | Lockup 34px, one-liner, email, the 4 AI Automation and 4 Marketing links, company links, © + Privacy. |
| `Section`, `SectionHead` | `base.css` `.section`, `.head` | Eyebrow + H2 left, optional small note right. |
| `PageHero` | `sections.css` `.phero` | `split` (copy + visual, `min-height: 100vh - 76px`) or `short`. Stacks under 900px. |
| `CTABand` | `site.js` → `band()` | Title + line + one Book button. |
| `Logo` | logo SVGs | Lockup / mark / solid mark per size (see DESIGN-SYSTEM). |

## Story (home)
| Component | Source | Behaviour |
|---|---|---|
| `StoryStage` (C) | `home.html` (markup + CSS), `home.js` | Sticky stage; scroll progress → chapter/step (`SEG`); a lerped progress value; rigs positioned inside the 1240 column (`X()` helper + `--edge`). It drives the phone, laptop, lift card, spotlight, beam, reverse card, wire, chapter copy, rail and background colour. **Pause the rAF loop when the story is off-screen** (the mockup runs it always). **Reduced motion:** render the 4 chapters as static stacked sections, with no pinning. |
| `PhoneMockup` | `devices.css`, `home.html` | Lock screen, clock, notification stack with `GAP` 86 and up to 3 visible, buzz on arrival, day mode at morning. |
| `Notification` | `devices.css` `.n` | States: focus, dim, lifted (desktop: dashed amber ghost slot with glow; phones: zoomed 1.06 with amber ring + highlight), done (green, `landed` flash). |
| `LiftCard` | `home.html` `.lift`, `home.js` | FLIP from the phone slot; frosted glass; chip → card → big metric staggered; scan sweep; `<mark>` highlight; scales down to 0.8 when space is tight. |
| `Spotlight` + `ZoomBeam` | `home.html` `.spot-scrim`, `#beam` | The scrim uses `clip-path: path(evenodd, …)` with a rounded cut-out around the slot; the beam polygon is recomputed each frame from the live rects. Tag "FROM YOUR LOCK SCREEN". |
| `ReturnCard` | `home.html` `.retn`, `home.js` | The Turn: a quadratic curve laptop → slot, scaling to the slot width, opacity in and out, then the target card flips to done; siblings follow at +0.12 local progress each. |
| `LaptopConsole` | `devices.css` `.laptop/.con`, `home.js` views | 5 views (Inbox, Bookings, Pricing & ads, Turnovers, Summary) with a sidebar and tool lights. |
| `ChapterRail` | `home.html` `.rail` | 4 buttons with fill progress; jump to a chapter. |

## Devices and scenes
| Component | Source | Behaviour |
|---|---|---|
| `AlivePhone` (C) | `site.js` → `mountCalmPhone` | Live Activity ticking, quiet notifications every 5.2s, ghost/nudge/done cards, idle nudge; follows the booker (`day()`, `time()`, `booked()`). |
| `ScreenCard` | `sections.css` (900px block) | Laptop frame → real-size screen card under 900px (no stand/cam, sidebars hidden, `.con/.ibx/.site` set to `position: relative`). |
| `ServiceHero` ×8 (C) | `service.html` → `HERO` map | One scene per service (see ROUTES). Loops start in view; reduced motion shows the final state. |
| `ServicesDuo` (C) | `services.html` | Ad → tap → booked → pulse → rows; `fit()` sizes the laptop to the column and pads the row content clear of the phone; stacked under 900px. |
| `ControlRoom` (C) | `systems.html` | 8 rows, counters tick every 2.6s with a green flash, feed line swaps; a row click selects the player system and scrolls to it. |

## Interactive
| Component | Source | Behaviour |
|---|---|---|
| `SystemPlayer` (C) | `player.js` → `mountPlayer` (scenes only; simplified 17 Oct 2026) | Shared by Systems and every service page. `RUNS[8]` (`src/lib/runs.ts`): title, payoff `[now, before]`, four steps `[tool, text, stage, you?]` and a screen whose children appear by stage (`data-at`, hide at `data-to`). Device left; title, payoff, steps, actions beside it. Only the checkpoint step (lock, amber) stands out. Plays when the device is 60% in view: first step at 300ms, then every 800ms; Replay. The device auto-scrolls **only as far as the newest item needs**. Tabs: `role=tablist`, arrow keys, URL hash, control-room rows select. Under 860px: sticky chips, one column (title, payoff, device, steps, actions). Height comes from the device, so switching never jumps. |
| `CalBooker` (C) | `site.js` → `mountScheduler` (visual spec) | **Replace with the real Cal.com embed** (`@calcom/embed-react`, inline, dark theme, brand colour `#E51E2B`). Keep the mockup layout around it. Map Cal embed events to `AlivePhone` (date/time chosen → phone reacts; booked → done card) and to analytics. |
| `BookingStage` | `sections.css` `.bstage` | Booker (max 760) + AlivePhone (300) side by side; the phone is hidden under 1100px. Used on Home ch.09 and Contact. |
| `SavingsCalculator` (C) | `site.js` → `mountCalc` | Sliders → hours back, commission kept, where to start. |
| `PricingTiers` | `site.js` → `mountPricing` | Starter / Growth (Recommended) / Portfolio; compact on home; prices from `PRICE[cur]`. |
| `PlanBuilder` (C) | `site.js` → `mountBuilder` | Tick systems → setup + monthly estimate; bundle note. |
| `CurrencyToggle` (C) | `site.js` → `curToggle`, `setCur` | USD/AED/EUR; persists to `localStorage` (`re-cur`), wrapped in try/catch; notifies listeners. Use a small context. |
| `AssistantDemo` (C) | `site.js` → `mountTry` | Scripted answers to typed text or chips; refunds hand over to the owner. **No live AI.** |
| `Calendar3Week` (C) | `site.js` → `mountCal3` | Hover or tap a day → detail line + phase highlight + linked steps; optional `onPick` scroll (Approach). |
| `Journey` (C) | `site.js` → `mountJourney(root, {pin})` | 7 steps. **Pinned on Home:** section height = viewport + travel × 1.1 + 25vh, translateX from the scroll, `cur` card highlighted, arrows scroll the page. **Swipe on Systems:** scroll-snap, arrows, progress. Grid column `minmax(0,1fr)` (otherwise the track sizes to its content). |
| `ToolOrbit` | `home.js` (ch.08), `components.html` | 2 counter-rotating rings (60s / 90s), official marks, full mark in the centre, `--k` scale on phones. |
| `BeforeAfter` (C) | `service.html` | Starts on "Without", flips to "With" after 1.6s once in view, unless the visitor has touched it. |
| `FAQ` | `<details>` | First item open. |

## UI
`Button` (primary: red gradient, magnetic; quiet; WhatsApp green with dark text), `Chip` (problem / handled), `Tag` (auto / mkt), `Icon` (`icons.js` → `ICONS`, 1.6px line set, 24 grid), `ToolLogo` (`logos.js`, which mirrors the existing `src/lib/toolLogos.ts`; near-black brands render light on dark; a missing logo falls back to a monogram, **min 11px**).
