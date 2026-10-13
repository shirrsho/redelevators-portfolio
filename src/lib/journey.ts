import type { IconName } from "./icons";

// One booking, start to finish: the 7-step journey (Home ch.04 pinned, Systems swipe).
// Ported unchanged from redesign-mockups/r3/site.js (JOURNEY).

/** Guest-side bubble: "out" = the guest writes, "in" = the guest receives. */
export type JourneyBubble = readonly [dir: "in" | "out", text: string];

export type JourneyStep = readonly [
  icon: IconName,
  title: string,
  when: string,
  guestSees: readonly JourneyBubble[],
  tools: readonly string[],
  systemDoes: string,
];

export const JOURNEY: readonly JourneyStep[] = [
  ["message","Enquiry","Day −14",[["out","Is Loft 2B free Oct 18–20?"],["in","Yes, it is! Book direct here and skip the fees →"]],["Airbnb","Claude"],"Checked the calendar and replied in seconds, in your tone."],
  ["payment","Booked direct","Day −14",[["in","Booking confirmed · Oct 18–20 · $340 ✓"]],["Stripe","Google Sheets"],"Payment taken, every calendar blocked, guest added to your CRM."],
  ["key","Before arrival","Day −1",[["in","Your door code is 4821. Here’s your check-in guide 🗝️"]],["WhatsApp"],"Fresh door code generated and sent with the guide."],
  ["assistant","During the stay","Day 0–2",[["out","Where’s the nearest pharmacy?"],["in","Two minutes’ walk: the Main Street pharmacy, open till 10pm."]],["Claude"],"Answered from your local guide, any hour, any language."],
  ["clean","Checkout & turnover","Day 2",[["in","Thanks for staying! Safe travels 👋"]],["WhatsApp","Airtable"],"Rosa booked for 11:00, linens ordered, next code queued."],
  ["review","Review","Day 3",[["in","How was your stay? A review would mean a lot ★"]],["Airbnb"],"Asked at the best moment. Five stars flagged to you."],
  ["mail","Comes back","Day +90",[["in","Spring is coming. Past guests save 10% booking direct."]],["MailChimp","Meta"],"Past guests invited back direct, by email and ads."],
];
