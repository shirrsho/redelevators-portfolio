# Track A · Inner pages: notes

Read `NOTES.md` first (the shared contract). This file is yours: keep it up to date while you build.

## Scope (from IMPLEMENTATION-PLAN → Stage 2)
`/services` (duo hero), `/services/[slug]` (8 heroes, screen cards, Try it, BeforeAfter, What you get, FAQ, related), `/approach`, `/pricing`, `/privacy`, the 404.
Files: those `src/app/**` route files (incl. `not-found.tsx`), `components/cards/*`, `components/viz/*` (not ToolOrbit), `components/devices/{ScreenCard,ServiceHero*,ServicesDuo}`, `components/interactive/{Calendar3Week,PricingTiers,PlanBuilder,SavingsCalculator,BeforeAfter,AssistantDemo}`.

## Stubs you own (props are final; replace the bodies)
- `cards/ServiceCard` `{ slug, dimmed?, delay?, location? }`: D renders 8 of them on home with `delay={(i % 4) + 1}` and toggles `dimmed` from the pillar filter. Port `VIZ` from site.js. The home.js `spark` reply is longer ("…Here's the pet guide.") than site.js's; pick one (or use `location === "home"`) and note it below.
- `interactive/SavingsCalculator` (no props): root `.calc`, its own `CurrencyToggle`, fires `EVENTS.calculatorUsed` once. Formulas are in site.js → `mountCalc`; inputs in `lib/pricing.ts → CALC_FIELDS`, picks in `CALC_RECOMMEND`.
- `interactive/PricingTiers` `{ compact? }`: root `.tiers`, prices from `PRICE[cur]` via `useCurrency()`.
- `interactive/Calendar3Week` `{ legend?, linkId?, pickScroll? }`: `linkId` = id of an element whose `[data-phase]` children get `.on` and highlight the calendar on hover (home: `id="time"`, D's markup); `pickScroll` scrolls to `#ph-audit`, `#ph-design`, `#ph-build`, `#ph-run` (live → run), so give the approach phase rows those ids. The cells' own fade-in (`.cal3.in`) is the calendar's job, not `.rv`'s.

## You use
- `<SystemPlayer service={slug} />` (Track B) in "How it runs". Already placed in the skeleton.
- `PhoneShell` + `PhoneStatus`/`PhoneClock`/`LockIcons` + `Notification` for the 404 phone and the assistant demo's phone and handoff card; `LaptopShell` for the laptop heroes (the 900px screen-card rules are already in `sections.css`).
- Data: `services.ts` (before, control, gets, faq, chain), `pricing.ts`, `calendar.ts`, `assistant.ts`. Approach phases, pricing FAQ/"included", privacy body, 404 copy, the duo's creatives and the 8 `HERO` scenes are inline in the mockup pages: port them into your files unchanged.
- The approach monthly summary's `data-count` numbers count up automatically.
- Keep the pricing placeholder flag and the privacy `.todo` highlights.

## Shared changes needed
_None yet._

## Differences from the mockup
_None yet._

## Questions for the owner
_None yet._
