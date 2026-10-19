// The website assistant (the Claude-powered chat in redelevators-assistant): settings and copy.
// The API contract is in that repo's docs/WIDGET.md. Mockups: redesign-mockups/assistant/ in the
// assistant-mockups worktree (decided 18 Oct 2026: side panel on desktop, bottom ask bar on phones).

/**
 * The assistant API. Set at build time (NEXT_PUBLIC_ is inlined by `next build`):
 * http://localhost:8788 for the local demo server, the workers.dev URL now, https://assistant.redelevators.com
 * after launch. Unset = the assistant is off: no button, no panel, /ask is a 404. That's the flag.
 */
export const ASSISTANT_URL = (process.env.NEXT_PUBLIC_ASSISTANT_URL ?? "").replace(/\/+$/, "");
export const ASSISTANT_ON = ASSISTANT_URL !== "";

/** Panel header. "Assistant" is still a placeholder name (owner, 19 Oct: keep it for now). */
export const NAME = "Assistant";
export const BYLINE = "By Red Elevators";

export const WELCOME = {
  hi: "Hi, I’m Red Elevators’ AI assistant. Ask me about our systems, prices or how we work.",
  more: "I answer from what we’ve published. Whenever you’d rather talk to a person, they’re one tap away.",
  /** /ask?from=<name>: the sales-link greeting. {name} is the team member. */
  sales: "Hi! {name} asked me to help you look at your setup. I’m Red Elevators’ AI assistant.",
  salesGeneric: "Hi! I’m Red Elevators’ AI assistant. Ask me about your setup, our systems, prices or how we work.",
} as const;

export const PLACEHOLDER = "Ask about prices, tools or setup…";
export const FOOT = "Answers come from what we’ve published.";

/**
 * Team members who send sales links (redelevators.com/ask?from=<key>): key → name shown on the page.
 * Only names listed here are shown ("Nakib from Red Elevators sent you this link"); any other `from`
 * gets the general page, so nobody can make the site vouch for a made-up person. Owner to fill in.
 */
export const SALES_TEAM: Readonly<Record<string, string>> = {};

/** A listed team member's display name, or null. Own keys only, so `?from=constructor` can't match a built-in. */
export const salesSender = (key: string | null | undefined): string | null =>
  key && Object.hasOwn(SALES_TEAM, key) ? SALES_TEAM[key] : null;

/** Starter questions per page. No prices here: the assistant quotes from the site's own pricing code. */
const STARTERS: Readonly<Record<string, readonly string[]>> = {
  "/": ["Do you work with Hostaway?", "What would it cost for 10 units?", "How does the 21-day guarantee work?", "Is this for me with 2 properties?"],
  "/pricing": ["Do you work with Hostaway?", "What would it cost for 14 units?", "Why is there a setup fee?", "Can I pay in AED?"],
  "/contact": ["What happens on the call?", "Do you work with clients in the UAE?", "What should I bring?", "Do you work with Hostaway?"],
  "/ask": ["Do you work with Hostaway?", "What would it cost for my units?", "How fast can we go live?", "What happens on the call?"],
  "/services/ai-guest-assistant": ["What if it doesn’t know an answer?", "Which languages does it reply in?", "Do you work with Hostaway?"],
};
export const startersFor = (path: string) => STARTERS[path] ?? (path.startsWith("/services/") ? ["What does this system cost?", "Do you work with Hostaway?", "How fast can it go live?"] : STARTERS["/"]);

/** "You’re on Pricing": the page's name for the welcome line. */
export function pageName(path: string): string {
  const known: Record<string, string> = { "/": "Home", "/pricing": "Pricing", "/contact": "Contact", "/services": "Services", "/systems": "Systems", "/approach": "Approach", "/privacy": "Privacy" };
  if (known[path]) return known[path];
  if (typeof document !== "undefined") return (document.title.split("·")[0] || "this page").trim();
  return "this page";
}

/** Where each knowledge document's citation links to. null = shown without a link; omitted titles are hidden. */
const SOURCES: Readonly<Record<string, string | null>> = {
  Pricing: "/pricing",
  Services: "/services",
  "Process and next steps": "/approach",
  "Terms, payment and contracts": "/pricing",
  "Who we work with": "/contact",
  "Tools and platforms": "/services",
  "Data, privacy and AI": "/privacy",
  "About Red Elevators": null,
};
/** Sources to show under an answer: known titles only ("When a person takes over" is internal). */
export const visibleSources = (titles: readonly string[]) =>
  titles.filter((t) => t in SOURCES).map((t) => ({ title: t, href: SOURCES[t] }));

/** Units stepper bounds in the details card. */
export const UNITS_MIN = 1;
export const UNITS_MAX = 500;
export const MARKETS = [
  { key: "US", label: "United States", phrase: "in the US" },
  { key: "UAE", label: "UAE", phrase: "in the UAE" },
  { key: "Elsewhere", label: "Somewhere else", phrase: "outside the US and UAE" },
] as const;
export type Market = (typeof MARKETS)[number]["key"];
export const TOOLS = ["Hostaway", "Guesty", "PriceLabs", "Airbnb only", "Something else"] as const;
