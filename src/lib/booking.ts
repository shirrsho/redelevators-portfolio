// Booking stage copy: the booker's header and the alive phone next to it (Home ch.09).
// Ported unchanged from redesign-mockups/r3/site.js (mountScheduler, mountCalmPhone).
// The booker itself becomes the real Cal.com embed (src/lib/site.ts → CAL_LINK).

export const CALL = {
  title: "Free 30-min rental systems call",
  host: "Red Elevators",
  length: "30m",
  where: "Google Meet",
  tz: "Your time zone",
  blurb: "We map your setup and show you what to automate first. No commitment.",
} as const;

/** The line under the booker (Home and Contact). Home also gets the "Not ready for a call?" row: BookingStage. */
export const BOOKER_NOTE = "Any day, any hour · times are shown in your time zone";

// ---- The alive phone ------------------------------------------------------------------------
export const ALIVE_PHONE = {
  time: "2:14",
  /** The lock screen shows today's date (set on the client), so it matches the live calendar beside it. */
  activity: {
    title: "Red Elevators",
    status: "Tonight · running",
    rows: [
      ["Messages answered", "3"],
      ["Next arrival", "Maria · 15:00 · code sent"],
      ["This week", "88% booked"],
    ],
    /** Start values that tick: answered count and booked %. Booked % stops at 97. */
    answered: 3,
    weekBooked: 88,
  },
  label: "Example night · illustrative",
  /** A quiet "handled" notification every QUIET_MS; skipped half the time once booked. */
  quietMs: 5200,
  /** Nudge after this long on screen without booking. */
  idleMs: 12000,
} as const;

/** Quiet "handled" notifications: [headline, line]. Shown as "✓ <headline>". */
export const QUIET: readonly (readonly [string, string])[] = [
  ["Answered","James asked about parking"],
  ["Booked direct","Harbor Studio · 2 nights"],
  ["Turnover set","Rosa · 11:00 · code sent"],
  ["Rate adjusted","Friday +8% · demand is up"],
  ["Review requested","Canal House · checked out"],
  ["Answered","Sofia asked for the pet guide"],
];
export const QUIET_BODY = "Handled by your system · nothing needed";

/** Idle nudge on the homepage phone: "ask first" → the Contact page's other ways to reach us. */
export const NUDGE = { app: "Red Elevators", tt: "Questions before you book?", bd: "Message us · a real person replies →", href: "/contact#chat" } as const;

/** Booking placeholder card while choosing, and the confirmed card. `{d}` day, `{t}` time. */
export const BOOKING_CARD = {
  app: "Your call",
  day: { tt: "{d} · pick a time", bd: "Not booked yet · 30-min call with Red Elevators" },
  time: { tt: "{d} · {t}", bd: "Almost there · add your details to confirm" },
  booked: { app: "Calendar · confirmed", tt: "Call with Red Elevators ✓", bd: "{d}, {t} · 30 min · Google Meet link inside" },
} as const;
