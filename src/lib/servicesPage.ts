import type { IconName } from "./icons";
import type { ServiceSlug } from "./services";

// /services copy: hero promises, the "What's costing you the most?" picker and the FAQ.
// Mockup: redesign-mockups/r3/services.html (reworked 17 Oct 2026). Service names, lines and
// prices come from services.ts and pricing.ts; only page-specific copy lives here.

/** Hero promises, one line of checks under the buttons. */
export const SERVICES_PROOF = ["Live in 21 days", "No lock-in", "You approve the rules"] as const;

export type Problem = {
  icon: IconName;
  /** The button label, in the owner's words. */
  label: string;
  /** Where to start. */
  start: ServiceSlug;
  /** "Today": what it's like now. */
  today: string;
  /** "With it": what changes. */
  withIt: string;
  /** The system that pairs well, and why (completes "Pairs well with X: …"). */
  pair: ServiceSlug;
  why: string;
};

/** The picker: one problem → one system to start with. The first one is selected on load. */
export const PROBLEMS: readonly Problem[] = [
  {
    icon: "message",
    label: "Guest messages eat my day",
    start: "guest-messaging",
    today: "Airbnb, Booking.com and WhatsApp each get checked separately, all day.",
    withIt: "Replies go out in minutes, in your voice, from one inbox. Only the unusual ones reach you.",
    pair: "ai-guest-assistant",
    why: "it answers the 2am questions too",
  },
  {
    icon: "moon",
    label: "Questions at 2am",
    start: "ai-guest-assistant",
    today: "Guests message at midnight about wifi, parking and checkout.",
    withIt: "The assistant answers from your house guide, day and night, and offers late checkout while it’s at it.",
    pair: "guest-messaging",
    why: "every channel lands in one inbox",
  },
  {
    icon: "clean",
    label: "Turnovers slip through the cracks",
    start: "guest-messaging",
    today: "Checkout times, cleaner schedules and the next check-in live in three different chats.",
    withIt: "Each checkout sends the cleaner the job and the next guest their arrival details. You see it done.",
    pair: "ai-guest-assistant",
    why: "guests get answers while the place is being turned",
  },
  {
    icon: "price",
    label: "Platforms take a cut of repeat guests",
    start: "direct-booking-engine",
    today: "Guests who booked direct once rebook on a platform, and the commission is paid again.",
    withIt: "Past direct and opted-in guests get a personal offer to book direct. The booking lands in your calendar with no fee.",
    pair: "direct-booking-website",
    why: "it gives them somewhere of your own to book",
  },
  {
    icon: "calendar",
    label: "Empty midweek nights",
    start: "paid-social",
    today: "Budget is the same on a quiet Tuesday as on a sold-out Saturday.",
    withIt: "Ads follow your empty dates. Budget shifts daily to whatever is actually booking.",
    pair: "photo-ad-creative",
    why: "one shoot gives the ads something worth stopping for",
  },
  {
    icon: "content",
    label: "My listings look tired",
    start: "listing-content-engine",
    today: "Listing descriptions were written once and never touched again.",
    withIt: "Listings, guides and posts are refreshed on schedule, in your voice, and checked before they go out.",
    pair: "photo-ad-creative",
    why: "new photos make fresh copy land",
  },
];

export const SERVICES_FAQ: readonly (readonly [string, string])[] = [
  ["Do I need a PMS?", "It helps. We build on what you already use, such as Guesty or Hostaway. No PMS yet? We’ll recommend one on the call."],
  ["Will guests know it’s automated?", "Replies are written in your voice from your own answers. Anything the system isn’t sure about, like refunds or complaints, comes to you before it’s sent."],
  ["How many properties do I need?", "Any number. Monthly fees cover up to 5 units, and only the per-unit fee grows after that. The systems are designed around managers with 10 to 50 units, and smaller hosts are welcome."],
  ["Which AI do you use?", "Mostly Anthropic’s Claude for guest-facing writing, and OpenAI where it fits a task better. You’re never locked to one."],
  ["Who owns the work?", "You do: the accounts, the site, the content and every guest record live in your own tools."],
];
