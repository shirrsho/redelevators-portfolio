import type { IconName } from "./icons";

// The homepage story (chapters 01–03 + morning). Ported unchanged from redesign-mockups/r3/home.js.
// Timings and layout numbers are part of the design: keep them.

/** Scroll segments of the story: the night, sound familiar?, the turn, morning. */
export const SEG: readonly (readonly [from: number, to: number])[] = [[0,0.12],[0.12,0.44],[0.44,0.88],[0.88,1]];
/** Vertical gap between stacked notifications on the phone, in px. */
export const GAP = 86;
/** Smoothing for the scroll-driven progress (ps += (p - ps) * LERP). */
export const LERP = 0.12;
/** Visible notifications: 3 on desktop, 2 at ≤760px. */
export const VISIBLE = { desktop: 3, phone: 2 } as const;

export const RAIL = ["The night", "Sound familiar?", "The turn", "Morning"] as const;
export const REASSURE = ["Live in 2–3 weeks", "Works with your tools", "We run it after launch"] as const;

/** Chapter 02 lines: [headline, line]. */
export const PAINS: readonly (readonly [string, string])[] = [
  ["Guests message at 2am.","And slow replies cost you ranking."],
  ["The platforms take a cut.","Of every stay, and the guest relationship."],
  ["Midweek nights sit empty.","Same price as Saturday. Nobody marketing them."],
  ["Turnovers run on group chats.","Cleaners, codes and linen, all by hand."],
];

/** Chapter 03 lines: [headline, line, pillar, pillar label]. */
export const TURNS: readonly (readonly [string, string, "auto" | "mkt" | "both", string])[] = [
  ["Every guest, answered in your voice.","In seconds, any hour, any language.","auto","AI Automation"],
  ["Guests book direct. No commission.","Past guests come back to your own site.","mkt","Marketing"],
  ["Prices move. Quiet nights fill.","Rates follow demand; campaigns target the gaps.","both","Automation + Marketing"],
  ["Turnovers schedule themselves.","Cleaner booked, code sent, calendars synced.","auto","AI Automation"],
];

/** Notification tile: brand colour + an icon or a (mono) tool logo. */
export type NotificationTile = { bg: string; icon?: IconName; logo?: string };

export type StoryNotification = {
  tile: NotificationTile;
  app: string;
  tt: string;
  bd: string;
  ago: string;
  /** Which "Sound familiar?" step focuses it, and which "turn" step fixes it. */
  pain: number;
  fix: number;
  /** Body once handled. */
  done: string;
};

/** Phone notifications in arrival order (oldest first). */
export const N: readonly StoryNotification[] = [
  {"tile":{"bg":"#3a3a46","icon":"calendar"},"app":"Calendar","tt":"Tue–Thu still open","bd":"3 nights unbooked at Canal House this week.","ago":"1h ago","pain":2,"fix":2,"done":"Rate adjusted, campaign live, 2 of 3 booked"},
  {"tile":{"bg":"#FF5A5F","logo":"Airbnb"},"app":"Airbnb","tt":"Response rate","bd":"2 messages waiting. Reply within 24h to keep your rate.","ago":"40m ago","pain":0,"fix":0,"done":"All messages answered"},
  {"tile":{"bg":"#003A9A","logo":"Booking.com"},"app":"Booking.com","tt":"New reservation · 2 nights","bd":"Harbor Studio, Oct 18–20. Commission applies.","ago":"31m ago","pain":1,"fix":1,"done":"Returning guest re-booked direct"},
  {"tile":{"bg":"#25D366","logo":"WhatsApp"},"app":"WhatsApp","tt":"Rosa (cleaning)","bd":"Can’t get into Canal House. The code isn’t working.","ago":"14m ago","pain":3,"fix":3,"done":"New code sent, clean set for 11:00"},
  {"tile":{"bg":"#FF5A5F","logo":"Airbnb"},"app":"Airbnb","tt":"James · Garden Suite","bd":"Any chance we can check in at 11 instead of 3?","ago":"6m ago","pain":0,"fix":0,"done":"Offered 12:00, cleaner confirmed"},
  {"tile":{"bg":"#FF5A5F","logo":"Airbnb"},"app":"Airbnb","tt":"Maria · Loft 2B","bd":"Hi! We just arrived. What’s the wifi password? 🙂","ago":"now","pain":0,"fix":0,"done":"Sent wifi + house guide"},
];

/** The card pulled out of the phone at each "Sound familiar?" step. `n` indexes N; `hl` is the highlighted phrase. */
export type Lift = { n: number; chip: string; big: string; small: string; hl: string };
export const LIFT: readonly Lift[] = [
  {"n":5,"chip":"2 guests waiting","big":"2:14am","small":"Reply late and your ranking slips.","hl":"What’s the wifi password?"},
  {"n":2,"chip":"Commission on this stay","big":"~15%","small":"Typical OTA commission, on every stay.","hl":"Commission applies."},
  {"n":0,"chip":"3 nights empty this week","big":"Tue–Thu","small":"Priced like Saturday. Nobody marketing them.","hl":"3 nights unbooked"},
  {"n":3,"chip":"Turnover at risk","big":"11:00","small":"Next guests arrive at 3pm.","hl":"The code isn’t working."},
];

/** The morning summary notification (7:30). */
export const MORNING_SUMMARY = {
  app: "Red Elevators",
  ago: "7:30",
  tt: "Good morning. Nothing needs you.",
  bd: "Overnight: 6 messages answered · 1 direct booking · 2 quiet nights filled · Canal House turnover sorted.",
} as const;

/** Handled state shown on a notification and on the card flying back from the laptop. */
export const HANDLED = { app: "✓ Handled for you", ago: "just now" } as const;

// ---- The laptop console --------------------------------------------------------------------
export const TOOLS: readonly string[] = ["Airbnb","Booking.com","Claude","Stripe","MailChimp","Meta","Google Ads","WhatsApp","Airtable"];
/** Tools lit per console view (Inbox, Bookings, Pricing & ads, Turnovers, Summary). */
export const VIEW_TOOLS: readonly (readonly string[])[] = [
  ["Airbnb","Claude"],
  ["Stripe","MailChimp","Booking.com"],
  ["Meta","Google Ads"],
  ["WhatsApp","Airtable"],
  ["Airbnb","Booking.com","Claude","Stripe","MailChimp","Meta","Google Ads","WhatsApp","Airtable"],
];
export const CONSOLE_NAV: readonly (readonly [icon: IconName, label: string])[] = [
  ["message","Inbox"],
  ["direct","Bookings"],
  ["price","Pricing & ads"],
  ["clean","Turnovers"],
  ["sun","Summary"],
];
/** Pricing chart: nightly rate before, and adjusted to demand (14 nights). */
export const CHART = {
  before: [118, 118, 118, 118, 132, 132, 118, 118, 118, 118, 118, 132, 132, 118],
  after: [109, 112, 116, 121, 151, 158, 126, 104, 106, 111, 124, 154, 160, 128],
} as const;
// The five console views' inner copy is still inline in home.js (#conMain); Track D ports it with
// the LaptopConsole markup, unchanged.

/** Time-of-day background colours the page moves through (rgb). */
export const TIME_OF_DAY = {
  night: [10, 11, 20],
  dawn: [26, 20, 15],
  day: [20, 19, 18],
} as const;
