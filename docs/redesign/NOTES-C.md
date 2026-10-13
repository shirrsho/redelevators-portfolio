# Track C · Booking: notes

Read `NOTES.md` first (the shared contract). This file is yours: keep it up to date while you build.

## Scope (from IMPLEMENTATION-PLAN → Stage 2)
Cal.com embed, alive phone, booking stage, `/contact`, booking analytics.
Files: `src/app/contact/**`, `components/interactive/{CalBooker,BookingStage}`, `components/devices/AlivePhone`. You may add the Cal.com embed dependency: write the exact `npm install` command below.

## Stub you own (props are final; replace the body)
- `interactive/BookingStage` `{ variant: "home" | "contact" }`: root `.bstage` (booker max 760 + phone 300; phone hidden under 1100px). The page supplies the heading. `home` → nudge "Questions before you book?" to `/contact#chat`, note links "other ways to reach us"; `contact` → WhatsApp nudge, note "US and UAE clients welcome" (`lib/booking.ts → NUDGE, BOOKER_NOTE`). Used by D on Home ch.09.

## Internal (no stub, your props)
- `CalBooker`: event link `lib/site.ts → CAL_LINK` (**placeholder** until the owner sends it; `CAL_LINK_IS_PLACEHOLDER`), brand `CAL_BRAND` (#E51E2B), dark theme. Map Cal embed events → AlivePhone and → `EVENTS.bookingStep` (date / time chosen) and `EVENTS.bookingComplete`.
- `AlivePhone`: build it from `PhoneShell` + `PhoneStatus` + `PhoneClock` + `LockIcons` + `Notification` (shared). Copy and timings in `lib/booking.ts` (`ALIVE_PHONE`, `QUIET`, `NUDGE`, `BOOKING_CARD`). Quiet notifications and the idle timer start after mount and only while on screen.
- WhatsApp: `whatsappUrl()` from `lib/site.ts`, as a button, on /contact only (`EVENTS.whatsappClick`). The number is deliberately not exported for display: never print it.
- contact.html's `<style>` (`.c-intro`, `.c-steps`, `.ways`, `.way`, `.take`, `.doc`) → a CSS Module. The summary doc's logo is `<Lockup tone="light" height={22} />`.

## Dependency added
_Write the exact command here, e.g. `npm install @calcom/embed-react@<version>`._

## Shared changes needed
_None yet._

## Differences from the mockup
_None yet._

## Questions for the owner
_None yet._
