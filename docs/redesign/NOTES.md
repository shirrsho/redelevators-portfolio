# Build notes (shared)

Stage 1 (Foundation) is done on `redesign-2026`. This file is the contract the four tracks build on. Track-specific notes are in `NOTES-A.md` … `NOTES-D.md`.

## What Stage 1 built

| Area | Where |
|---|---|
| Fonts (Schibsted Grotesk, Hanken Grotesk, JetBrains Mono via `next/font`, variable weights) | `src/app/layout.tsx` → `--font-schibsted`, `--font-hanken`, `--font-jetbrains`, mapped to `--display` / `--sans` / `--mono` in `base.css` |
| The mockup's CSS, ported verbatim | `src/styles/base.css`, `devices.css`, `sections.css`, `aurora.css` (Aurora layer + `.light` paper; the review switcher and font candidates left out) |
| Tailwind v4 tokens, breakpoints, site additions | `src/app/globals.css` |
| Aurora on | `<html data-theme="aurora">` |
| Shell | `components/layout/`: `Nav`, `MobileSheet`, `Footer`, `Section` + `SectionHead`, `PageHero`, `CTABand`, `Logo` (`Lockup`, `MarkSolid`, `MarkFull`), `PageBg`, `SiteEffects`, `Analytics`, `JsonLd` |
| UI | `components/ui/`: `Button` + `TextLink`, `Chip` + `Tag` + `Eyebrow`, `Icon` + `ArrowIcon`, `ToolLogo` + `ToolPill`, `FAQ`, `CurrencyToggle`, `EmailLink`, `StubBox` (scaffolding) |
| Shared devices | `components/devices/PhoneShell.tsx` (`PhoneShell`, `PhoneStatus`, `PhoneClock`, `LockIcons`, `LaptopShell`), `components/devices/Notification.tsx` |
| Hooks | `src/lib/hooks/`: `useInView`, `useReducedMotion` (+ `prefersReducedMotion()`), `useRafLoop`, `useScrollProgress` (+ `scrollProgress()`) |
| Currency | `src/lib/currency.tsx`: `CurrencyProvider` (in the layout) and `useCurrency()` → `{ cur, setCur, money, fx }` |
| Data (typed, copied from the mockup JS by script, unchanged) | `src/lib/`: `services.ts`, `runs.ts`, `story.ts`, `home.ts`, `journey.ts`, `pricing.ts`, `controlRoom.ts`, `calendar.ts`, `booking.ts`, `assistant.ts`, `site.ts`, `icons.ts`, `logos.ts` |
| Analytics names | `src/lib/analytics.ts` → `EVENTS` (existing names kept, new ones added) |
| Routes | every route as a skeleton with real metadata; `next.config.ts` redirects (308); `sitemap.ts`; `robots.ts`; `manifest.ts` |
| Icons | favicon set from the bars-only mark (`src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `public/brand/icon-192/512.png`); lockups and marks in `public/brand/` |

Removed: the 34 old flat components and `src/lib/content.ts` (old slugs, the Google appointment link).

## How to build on it (all tracks)

**Shared files are frozen** (`globals.css`, `src/styles/*`, `layout.tsx`, `src/lib/*`, `components/ui/*`, `components/layout/*`, `components/devices/PhoneShell.tsx`, `components/devices/Notification.tsx`, `next.config.ts`, `package.json`). Need a change? Write it in your `NOTES-<track>.md` → "Shared changes needed" and work around it locally.

### CSS
- **Use the mockup's class names as they are** (`.btn`, `.chip`, `.phero`, `.svc`, `.n`, `.bub`, `.tier`, `.calc`, `.pl`…). The whole of `base.css`, `devices.css`, `sections.css` and `themes.css` (Aurora) is loaded globally, exactly as on every mockup page.
- Cascade: Tailwind preflight → mockup CSS (layer `components`) → Tailwind utilities → CSS Modules (unlayered). So a utility beats a mockup class, and a CSS Module beats both.
- **Each mockup page's own `<style>` block goes into a CSS Module** owned by your track (home.html, systems.html, services.html, service.html, approach.html, contact.html, pricing.html, privacy.html, 404.html). Next doesn't remove global CSS on navigation, and several of those blocks reuse generic names (`.ctas`, `.dots`, `.lines`, `.cr`, `.doc`), so they must not go global.
- Breakpoints: the mockup's are max-width. Tailwind variants `bp1100:`, `bp900:`, `bp860:`, `bp760:` match them exactly. Token utilities: `bg-night`, `text-sub`, `text-dim`, `border-hair`, `text-amber`, `text-green`, `text-auto`, `text-mkt`, `font-display`, `font-mono`, `ease-brand`…
- Inline `style` as in the mockup is fine where the mockup does it (`style="margin-top:18px"`).

### Behaviour you get for free (`SiteEffects`, mounted once)
- **Reveal:** add `rv` (+ `d1x`…`d4x`) and the element fades up when 15% visible. Safe on elements whose className React re-renders (`.in` is put back). `.weeks` also reveals. Don't write your own reveal observer.
- **Spotlight** on Aurora cards and **magnetic** `.btn.primary`: automatic, by class.
- **Count-up:** `<b data-count="412" data-pre="$" data-suf="%">0</b>`.
- Reduced motion: reveals show at once (base.css), no magnet, counts jump to the end. Every animated component you build must render its final state under reduced motion.

### Page building blocks
- Every page renders `<PageBg tone="night|day" />` once (the mockup's `:root{--bg}` per page) and a `<main id="main">` (inner pages add `className="page"` for the 76px nav offset; the skip link targets `#main`).
- `PageHero` (`variant="split" | "short"`, `visual`, `visualStyle`), `Section`, `SectionHead` (`eyebrow`, `title`, `note`, `noteMaxWidth`, `aside`, `gap`), `CTABand` (`title`, `sub`, `service`).
- `Button` (`variant="primary" | "quiet" | "wa"`, `arrow`, `event`, `location`): internal paths use `next/link`; external URLs open in a new tab.
- `Icon name="…"` (the 1.6px set), `ToolLogo name="Airbnb" size={16} mono? fallback?`, `ToolPill`, `Chip tone="problem|handled|brand"`, `Tag pillar="auto|mkt"`, `Eyebrow center?`, `FAQ items={[[q, a], …]}` (first open), `EmailLink location="…"`, `CurrencyToggle`.
- Logos: `Lockup height={34}` (footer), `Lockup tone="light" height={22}` (documents), `MarkSolid` under 32px (tiles, avatars), `MarkFull` at 32px and up.
- Devices: `PhoneShell` (`className="day|buzz|focus|alive"`, `dayWallpaper`, `ref`) with `PhoneStatus`, `PhoneClock`, `LockIcons`; `LaptopShell`; `Notification` (`icon`, `iconBg`, `mark`, `app`, `ago`, `title`, `body`, `className` for states, `href`, `ref`).

### Data
- Content lives in `src/lib/*` exactly as in the mockup JS, **with the mockup's shapes** (tuples stay tuples, labelled in the types) so ports read like the mockup code. Example: `SERVICES[i].p`, `s.gets.map(([icon, title, text]) => …)`, `RUNS[i].steps`.
- Copy that the mockups keep inline in a page's HTML or page script (approach phases, pricing FAQ and "included", contact steps and FAQ, privacy body, 404 copy, the services duo creatives, the service heroes, the console views in home.js) belongs to the page's track: port it into your own files, unchanged.
- Randomness and time-based state (control-room ticks, quiet notifications, the story clock) start after mount, never during render.

### Analytics
- Use `EVENTS` from `src/lib/analytics.ts` with `data-umami-event` / `data-umami-event-location` attributes for clicks, `track()` for the rest. Existing locations: `hero`, `cta`, `footer`, `contact`, `header`, `mobile`, `nav-desktop`, `nav-mobile`.

### Stubs (cross-track components)
Each stub has its **final props** and renders a placeholder; the owning track replaces the body. **Don't change a stub's props.** If one must change, write it in your notes.

| Component | Owner | Props | Used by |
|---|---|---|---|
| `cards/ServiceCard` | A | `slug: ServiceSlug; dimmed?: boolean; delay?: 1\|2\|3\|4; location?: string` | Home ch.05 (D), service "Works well with" (A) |
| `interactive/SavingsCalculator` | A | none | Home ch.06 (D), /pricing (A) |
| `interactive/PricingTiers` | A | `compact?: boolean` | Home ch.06 (D, compact), /pricing (A) |
| `interactive/Calendar3Week` | A | `legend?: boolean` (default true); `linkId?: string`; `pickScroll?: boolean` | Home ch.07 (D, `linkId="time"`), /approach (A, `pickScroll`) |
| `interactive/SystemPlayer` | B | `service?: ServiceSlug; tabs?: boolean; hash?: boolean` | /systems (B, `tabs hash`), every service page (A, `service={slug}`) |
| `interactive/Journey` | B | `pinned?: boolean` | Home ch.04 (D, `pinned`), /systems (B) |
| `interactive/BookingStage` | C | `variant: "home" \| "contact"` | Home ch.09 (D), /contact (C) |

Track-internal components (ServicesDuo, ServiceHero, ServiceRow, BeforeAfter, AssistantDemo, PlanBuilder, ControlRoom, CalBooker, AlivePhone, StoryStage and its parts, PhoneMockup, LaptopConsole, ToolOrbit) have **no stub on purpose**, so their owners choose the props. The route skeletons show them as `StubBox` placeholders.

## Decisions taken in Stage 1 (and why)

1. **Ownership tweak:** `PhoneShell`, `LaptopShell`, `Notification` and `CurrencyToggle` are shared Stage 1 components, not track D/A files. Three tracks draw phones and notifications (A: 404, assistant demo, service heroes; C: alive phone; D: story), and the mockup builds them from one helper (`phoneShell`, `.n`).
2. **SystemPlayer scenes stay HTML.** `RUNS[i].screen` is the mockup's exact markup string (with `data-at` / `data-to`), rendered server-side with `dangerouslySetInnerHTML`. The plan prefers JSX for illustrations, but these eight screens are dense inline-styled markup whose text is content; a hand conversion risks drift and gains nothing. Everything else stays JSX.
3. **Footer column headings are `<h2>`** (styled like the mockup's `h6` in globals.css) so the outline doesn't jump to h6.
4. **Card titles keep the mockup's `h4`/`h5`** (under section H2s, skipping h3) because the shared CSS targets those tags. Flag for the Stage 3 accessibility pass.
5. **Additions not in the mockup:** visible `:focus-visible` outline, a skip link, the mobile sheet moves focus to its first link on open and Escape returns focus to the burger, `inert` on the closed sheet.
6. **Analytics:** nav links → "Nav click" (`header` / `mobile`), nav Book → "Book a call" (`nav-desktop` / `nav-mobile`), footer service links → "Service click" (`footer`). Same names and locations as the live site.
7. **Currency:** the server renders USD; a stored choice (or `?cur=` like the mockup) is applied after mount, so returning AED/EUR visitors see USD for a frame. No hydration risk.
8. **Service page `<title>`:** the service's real title (`Guest Messaging & CRM · Red Elevators`, as service.html sets it), not build-site.py's slug-derived one.
9. **No trailing slashes** (Next default, same as the live site); the mockup preview uses `/services/`.
10. **Not built (unused in the pages):** the mockup's WhatsApp FAB and mobile action bar (`mountChatButtons`; DECISIONS puts WhatsApp on Contact only) and the pipeline + log (`mountPipe`, only in the component library).
11. `npm run lint` now ignores `redesign-mockups/**` (static mockup JS, not app code).
12. The OG image is restyled to Aurora with the new lockup; it has no text yet, so no font is loaded into it. Stage 3 can add a headline.

## Where the mockup and the docs disagree

| Topic | Docs / review pages say | Mockup code does | Built |
|---|---|---|---|
| Nav lockup height | `/_design/logo/`: 32px desktop, 28px phones | `base.css`: 30px, 26px (DESIGN-SYSTEM agrees) | 30 / 26 |
| Type scale label | `/_design/components/` text: "Inter Tight for headlines, Inter for body" | Schibsted + Hanken (DECISIONS, 14 Oct) | Schibsted + Hanken |
| Dawn colour | `base.css --dawn: #17130f` | home.js DAWN `rgb(26,20,15)` = `#1a140f` (also the component library) | story uses home.js (`story.ts → TIME_OF_DAY`) |
| Day colour | `base.css --day: #131211` | pages set `--bg: #141312`; home.js DAY = `#141312` | `PAGE_BG.day = #141312` |
| Service hero headline | `/_design/nav-hero/` table: "[Service outcome]" | service.html: H1 = service title, lead = outcome, small = description | mockup |
| Systems hero type | nav-hero table: "C · Short" | systems.html: split hero with the control room (DECISIONS agrees) | split |
| Service card mini demo (spark) | site.js VIZ: "Yes! Small dogs are welcome." | home.js VIZ: "…welcome. Here's the pet guide." | Track A to choose (see NOTES-A) |

## Open items for the owner
From DECISIONS (still open): real prices; privacy legal details; tracking vs the privacy page (the Meta Pixel and Umami `recorder.js` are still in `layout.tsx`, untouched); the Cal.com event link (`src/lib/site.ts → CAL_LINK` is a placeholder, flagged by `CAL_LINK_IS_PLACEHOLDER`); the WhatsApp number; keeping or archiving old mockup rounds.
