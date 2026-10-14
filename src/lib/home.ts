import type { IconName } from "./icons";

// Homepage chapters 05–08 content. Ported unchanged from redesign-mockups/r3/home.js.
// (Chapter 05's eight cards use SERVICES: icon, viz, title and `short` match home.js SVC.)

/** Chapter 07 · How we work: [icon, when, title, text, your part]. data-phase links to the calendar. */
export const WEEKS: readonly (readonly [icon: IconName, when: string, title: string, text: string, you: string])[] = [
  ["audit", "Days 1–3", "Audit", "We map your setup and find what to automate first.", "You: one 30-min call"],
  ["design", "Week 1", "Design", "A plan in plain language. You approve it.", "You: approve the plan"],
  ["build", "Weeks 2–3", "Build", "We build it inside your accounts and test it end to end.", "You: nothing"],
  ["run", "Ongoing", "Run", "We watch it, fix it and improve it. You get a monthly summary.", "You: read the summary"],
];
/** The calendar phase each WEEKS item lights up with. */
export const WEEK_PHASES = ["audit", "design", "build", "live"] as const;

/** Chapter 08 · tool orbit: inner ring (60s) and outer ring (90s, reversed). Radii 136 / 222px. */
export const ORBIT = {
  inner: { tools: ["Airbnb", "Booking.com", "WhatsApp", "Stripe", "Meta", "Google Ads"], radius: 136, duration: 60 },
  outer: {
    tools: ["Claude", "n8n", "Make", "Zapier", "HubSpot", "MailChimp", "Airtable", "Notion", "Google Sheets", "Webflow"],
    radius: 222,
    duration: 90,
  },
} as const;

/** Chapter 08 · promises: [icon, title, text]. */
export const PROMISES: readonly (readonly [icon: IconName, title: string, text: string])[] = [
  ["lock", "Built in your accounts. You own it.", "Every workflow, login and line of data stays yours. Leave anytime, keep it all."],
  ["bolt", "Nothing new to learn", "Your team keeps the tools they already know."],
  ["calendar", "Live in 21 days, guaranteed", "Or your first month is free. The clock only pauses while we wait on you."],
  ["run", "We run it after launch", "Monitoring, fixes and a monthly summary. Swap a tool anytime."],
];

/** Chapter 08 · "also works with" pills (text only). */
export const ALSO_WORKS_WITH = ["Guesty", "Hostaway", "PriceLabs", "Google Calendar", "+ your PMS"] as const;
