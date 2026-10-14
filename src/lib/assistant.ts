// "Try it yourself": the scripted assistant demo on the two messaging service pages.
// Ported unchanged from redesign-mockups/r3/site.js (mountTry). No live AI.

/** [pattern, answer (HTML, trusted), source]. answer = null → hand over to the owner. */
export const ASSISTANT_RULES: readonly (readonly [RegExp, string | null, string?])[] = [
  [/refund|complain|broken|dirty|angry|cancel|damage|not working/i, null],
  [/wifi|wi-fi|internet|password/i, "The wifi is <b>LoftGuest</b>, password <b>sunny-balcony-42</b>. It’s also on the card by the door 🙂", "House guide · Wifi"],
  [/check.?in|arrive|early|bags|luggage/i, "Check-in is from 3pm. Arriving earlier? The hall lockbox is free from 11am for your bags.", "House rules · Arrival"],
  [/check.?out|late|leave/i, "Checkout is 11am. Late checkout until 1pm is $25. Shall I add it for you?", "House rules · Checkout + upsell"],
  [/park|car/i, "Free street parking on Canal Street after 6pm. The nearest garage is the Central garage on 5th Street, a 4-minute walk.", "Local guide · Parking"],
  [/breakfast|coffee|eat|restaurant|food|dinner/i, "Café Lumen is 3 minutes away and opens at 8. For dinner, your host loves Osteria Nove.", "Local guide · Food"],
  [/dog|pet|cat/i, "Small dogs are welcome with a $20 cleaning fee. Please keep them off the sofa 🐶", "House rules · Pets"],
];

export const ASSISTANT = {
  eyebrow: "Try it yourself",
  title: "Ask it what a guest would.",
  lead: "This demo assistant knows one example rental. Ask anything, or try a complaint to see it hand over to you.",
  suggestions: ["What’s the wifi password?", "Can we check in early?", "Is there parking?", "Can I bring my dog?", "I want a refund"],
  source: "Answers come only from the house guide.",
  name: "Loft 2B Assistant",
  status: "Demo · replies instantly",
  greeting: "Hi! I’m the assistant for Loft 2B. Ask me anything about your stay.",
  placeholder: "Type a guest question…",
  handover: {
    reply: "I’m sorry about that. I’ve passed this to Sam, your host, who will reply shortly.",
    source: "Handed to the owner: anything about money or complaints.",
    card: { app: "Handed to you", ago: "now", tt: "Refund request · Loft 2B", bd: "Full conversation attached. Nothing was promised to the guest." },
  },
  unknown: {
    reply: "Good question! I don’t want to guess, so I’ve asked your host. You’ll hear back shortly.",
    source: "Not in the house guide, so it asked the owner instead of guessing.",
  },
  /** Typing delay before an answer, ms; the handoff card shows for this long. */
  replyMs: 900,
  handoffMs: 4200,
  /** At most this many messages stay in the chat. */
  maxMessages: 6,
} as const;
