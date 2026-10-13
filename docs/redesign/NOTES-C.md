# Track C · Booking: notes

Read `NOTES.md` first (the shared contract). This file is yours: keep it up to date while you build.

## Scope (from IMPLEMENTATION-PLAN → Stage 2)
Cal.com embed, alive phone, booking stage, `/contact`, booking analytics.
Files: `src/app/contact/**`, `components/interactive/{CalBooker,BookingStage}`, `components/devices/AlivePhone`. You may add the Cal.com embed dependency: write the exact `npm install` command below.

## Stub you own (props are final; replace the body)
- `interactive/BookingStage` `{ variant: "home" | "contact" }`: root `.bstage` (booker max 760 + phone 300; phone hidden under 1100px). The page supplies the heading. `home` → nudge "Questions before you book?" to `/contact#chat`, note links "other ways to reach us"; `contact` → WhatsApp nudge, note "US and UAE clients welcome" (`lib/booking.ts → NUDGE, BOOKER_NOTE`). Used by D on Home ch.09.

## Internal (no stub, your props)
- `CalBooker`: event link `lib/site.ts → CAL_LINK` (**placeholder** until the owner sends it; `CAL_LINK_IS_PLACEHOLDER`), brand `CAL_BRAND` (#E51E2B), dark theme. Map Cal embed events → AlivePhone and → `EVENTS.bookingStep` (briefed as date / time chosen; built as one "started" step, see below) and `EVENTS.bookingComplete`.
- `AlivePhone`: build it from `PhoneShell` + `PhoneStatus` + `PhoneClock` + `LockIcons` + `Notification` (shared). Copy and timings in `lib/booking.ts` (`ALIVE_PHONE`, `QUIET`, `NUDGE`, `BOOKING_CARD`). Quiet notifications and the idle timer start after mount and only while on screen.
- WhatsApp: `whatsappUrl()` from `lib/site.ts`, as a button, on /contact only (`EVENTS.whatsappClick`). The number is deliberately not exported for display: never print it.
- contact.html's `<style>` (`.c-intro`, `.c-steps`, `.ways`, `.way`, `.take`, `.doc`) → a CSS Module. The summary doc's logo is `<Lockup tone="light" height={22} />`.

## Status
Built and QA'd (Oct 2026): `CalBooker`, `AlivePhone`, `BookingStage`, `/contact`, booking analytics. Lint and build pass. Tested against a **public Cal.com demo event** (read-only; nothing booked); the real event link is still a placeholder (see "Questions for the owner").

## Dependency added
```bash
npm install @calcom/embed-react@1.5.3
```
React 19 is in its peer range (`^18.2.0 || ^19.0.0`), so the React component is used (no vanilla fallback needed). `package.json` and `package-lock.json` change (one dependency, plus `@calcom/embed-core` and `@calcom/embed-snippet` transitively). The embed script itself is loaded at runtime from `app.cal.com`.

## What Cal's embed does and doesn't tell us (checked against the live `embed.js`)
- **No date or time event.** Cal's only in-booker signal is a payload-free `__routeChanged`, which fires for a date pick, a time pick and "Back", but also for **month navigation** (and when Cal skips a fully booked month on load). It can't tell a date pick from browsing, so it isn't used.
- **"Booking step" is one step: `{ step: "started", location }`**, sent once per page view the first time the visitor clicks or tabs into the booker (detected as the window losing focus to Cal's iframe). The spec's "date chosen / time chosen" isn't possible with Cal's embed; see "Shared changes needed".
- **Booking complete** comes from `bookingSuccessfulV2` (and the deprecated `bookingSuccessful`, de-duplicated). It carries `startTime`, which the alive phone shows in the visitor's own time zone.
- **Fallbacks:** `linkFailed` (wrong or unpublished event) shows an in-frame notice with the email address, and the failed iframe is made `inert` so it's out of the tab order. The same notice shows if the embed sends nothing at all within 15s on screen (script or iframe blocked by an extension, CSP or the network); a background tab doesn't count down.
- Event data: `{ step, location }` and `{ location }`, where `location` is `home` or `contact`. No personal data.
- **WhatsApp click** is attribute-driven everywhere: the Contact button (`location: contact`) and the phone's WhatsApp nudge (`location: phone-nudge`, attributes set on the card in AlivePhone because `Notification` takes no data attributes). That also keeps the nudge out of the site's "Outbound link" tracker.

## Shared changes needed
- **Docs (Stage 3):** ROUTES-AND-CONTENT → Analytics, row `Booking step`: "date chosen / time chosen" → "started (first click into the booker; Cal's embed doesn't expose the date or time)". Same for the comment on `EVENTS.bookingStep` in `src/lib/analytics.ts`.
- **No code change required.** Two optional ones:
  1. `src/lib/site.ts`: replace `CAL_LINK` with the real event link and set `CAL_LINK_IS_PLACEHOLDER = false` when the owner sends it.
  2. `src/lib/booking.ts → CALL` is no longer rendered (Cal draws its own event details). Delete it, or keep it as the checklist for the Cal event's title and description: "Free 30-min rental systems call", 30 min, Google Meet, "We map your setup and show you what to automate first. No commitment."
- Integration (D): `BookingStage` is a client component and takes only `variant`; Home ch.09 renders it after its own heading. The home `tz` note links `/contact#chat`.

## Differences from the mockup
- **The booker is Cal.com's own UI** (event details left, calendar, times), not the mockup's scripted one. The "Booking by Cal.com" bar is Cal's own "Cal.com" mark inside the embed.
- **Booker width.** Cal switches to its side-by-side layout only when the iframe is ≥ 768px wide; the stage column (760px minus border) is just under, so beside the phone (≥ 1101px) the card overhangs its column by 10px a side (`CalBooker.module.css`). Below that it uses Cal's own responsive layout (stacked on phones, with `useSlotsViewOnSmallScreen` so the time list is its own screen). The card grows with the booker; it doesn't scroll inside.
- **Alive phone copy.** Cal never says which date or time was picked, so the mockup's two placeholder cards ("{d} · pick a time", "{d} · {t}") become one, "Picking a time" (body from `BOOKING_CARD.day.bd`), shown once the visitor starts using the booker. The confirmed card does show the real day and time (`BOOKING_CARD.booked`).
- **Idle nudge** only runs while the visitor hasn't started booking (stage `idle`): clicks inside the iframe can't be seen, so a visitor filling in the form would otherwise be nudged to WhatsApp. Any click or key elsewhere in the section restarts the 12s clock, as in the mockup. The Home nudge navigates client-side to `/contact#chat`.
- **Reduced motion:** no ticking and no nudge; the phone shows two "handled" cards. Booking reactions still happen (they're driven by the visitor).
- **Summary doc** settles flat once revealed, as in the mockup (`.rv.in` beats the tilt there); the CSS Module has to say so explicitly.
- The step cards' titles are `h3` under a visually hidden `h2` ("How the call works"), so the heading order is h1 → h2 → h3.
- Dev only: Cal logs "Existing embed CSS Vars are being reset" in the console (its `ui` call is applied twice). Harmless.

## Questions for the owner
1. The Cal.com event link (placeholder `red-elevators/30min` returns 404 on cal.com). Once it's live, run one real test booking (see QA below) and confirm the confirmation card and "Booking complete".
2. In Cal, set the event to Google Meet, 30 min, and the title/description above; the dark theme and `#E51E2B` come from the embed code, not the account.
3. Optional: ask Cal support whether the booker can report the chosen date/time (it would allow date/time funnel steps and let the phone name them); today it can't.
4. WhatsApp number (DECISIONS item 5): it only appears inside the `wa.me` link on `/contact` and the phone's nudge; it is never printed.
