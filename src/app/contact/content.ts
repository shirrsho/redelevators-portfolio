// Copy that contact.html keeps inline (steps, summary doc, FAQ), unchanged.
import type { IconName } from "@/lib/icons";

/** [icon, title, text] */
export const STEPS: readonly (readonly [IconName, string, string])[] = [
  ["message", "You tell us how you run things", "Your units, your tools, where the hours go."],
  ["audit", "We point out what to fix first", "Usually one or two systems pay off fastest."],
  ["mail", "You get a written summary", "Yours to keep, whether we work together or not."],
];

/** The example call summary: [badge class, badge, text, reveal delay (s)]. Illustrative. */
export const DOC = {
  stamp: "CALL SUMMARY · NOV 12",
  title: "Harbor Rentals · 6 units",
  sub: "Airbnb + Booking.com · Guesty · two cleaners on WhatsApp",
  rows: [
    ["f", "FIX FIRST", "Guest messaging: about 9 hours a week, mostly at night", 0.2],
    ["t", "THEN", "Turnover hand-offs: codes and cleaner bookings by hand", 0.5],
    ["t", "THEN", "Direct booking engine: 85% of stays pay a platform fee", 0.8],
    ["l", "LATER", "Paid social: worth it once the direct site is live", 1.1],
    ["g", "TIMELINE", "First system live in about 3 weeks", 1.4],
  ],
  sig: ["Prepared after a 30-min call", "Yours to keep"],
} as const;

export const FAQ_ITEMS: readonly (readonly [string, string])[] = [
  ["Is the call really free?", "Yes. Thirty minutes, no obligation, and you keep the written summary."],
  ["I only have one or two properties. Is this for me?", "Yes. Most systems start small and grow with you. Two units or two hundred, it’s the same system."],
  ["Do you work with clients in the US and the UAE?", "Yes. Calls are booked in your own time zone, and pricing is available in US dollars or UAE dirhams."],
  ["What should I bring?", "Nothing formal. It helps to know which tools you use, like your PMS and booking platforms."],
];
