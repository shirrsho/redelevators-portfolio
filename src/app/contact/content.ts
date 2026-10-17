// Copy that contact.html keeps inline (steps, after-you-book timeline, FAQ).
import type { IconName } from "@/lib/icons";

/** How the call goes, [icon, step]: one slim line under the heading. */
export const STEPS: readonly (readonly [IconName, string])[] = [
  ["message", "You tell us how you run things"],
  ["audit", "We point out what to fix first"],
  ["mail", "You get a written summary"],
];

/** What happens once someone books, [icon, when, title, text]. Steps 1–2 are the Cal.com invite and
 *  the two reminder workflows (24 h and 1 h before); keep them in sync with the Cal.com event. */
export const NEXT: readonly (readonly [IconName, string, string, string])[] = [
  ["check", "Right away", "Your invite and Meet link", "Google Meet, straight to your inbox and calendar."],
  ["clock", "24 hours and 1 hour before", "A short reminder", "By email, so the call doesn’t slip."],
  ["message", "The call · 30 minutes", "We map your setup", "Your rentals, your tools, and where the hours go."],
  ["mail", "Within a day", "Your written plan", "What to fix first, what can wait, and what it takes. Yours to keep."],
];

export const FAQ_ITEMS: readonly (readonly [string, string])[] = [
  ["Is the call really free?", "Yes. Thirty minutes, no obligation, and you keep the written summary."],
  ["I only have one or two properties. Is this for me?", "Yes. Most systems start small and grow with you. Two units or two hundred, it’s the same system."],
  ["Do you work with clients in the US and the UAE?", "Yes. Calls are booked in your own time zone, and pricing is available in US dollars or UAE dirhams."],
  ["What should I bring?", "Nothing formal. It helps to know which tools you use, like your PMS and booking platforms."],
];
