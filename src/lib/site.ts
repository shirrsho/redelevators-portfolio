// Site-wide contact details, booking, navigation and footer copy.
// Source: redesign-mockups/r3/site.js (NAV, footHTML, band, WA) and docs/redesign/DECISIONS.md.

export const EMAIL = "contact@redelevators.com";
export const LINKEDIN_URL = "https://www.linkedin.com/company/red-elevators";

// ---- Booking (Cal.com, free plan, inline embed) --------------------------------------------
// The owner's live event: https://cal.com/red-elevators/30min (set up 14 Oct 2026).
export const CAL_LINK = "red-elevators/30min";
export const CAL_LINK_IS_PLACEHOLDER = false;
/** Brand colour for the embed (the AA button red). */
export const CAL_BRAND = "#E51E2B";

/** Where "Book a call" goes: the booking stage on home, the Contact page elsewhere. */
export const HOME_BOOK_HASH = "#calm";
export const CONTACT_PATH = "/contact";
export const bookHref = (pathname: string) => (pathname === "/" ? HOME_BOOK_HASH : CONTACT_PATH);

// ---- WhatsApp: Contact page only, as a wa.me link. NEVER print the number. -------------------
// The number is the mockup's +880 one; the owner may swap it for a US/UAE business number
// (DECISIONS → still open, item 5).
const WHATSAPP_NUMBER = "8801521707826";
export const WHATSAPP_MESSAGE = "Hi Red Elevators! I’d like to talk about automating my rentals.";
export const whatsappUrl = (msg: string = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

// ---- Navigation ------------------------------------------------------------------------------
export type NavLink = { href: string; label: string; hint: string };
// mockup: NAV = [[slug, label, hint], …]
export const NAV_LINKS: readonly NavLink[] = [
  { href: "/services", label: "Services", hint: "Eight systems, two pillars" },
  { href: "/systems", label: "Systems", hint: "Watch them run" },
  { href: "/approach", label: "Approach", hint: "Live in three weeks" },
  { href: "/pricing", label: "Pricing", hint: "Clear prices" },
  { href: "/contact", label: "Contact", hint: "Book a free call" },
];

/** Is `href` the current section? /services/<slug> counts as Services. */
export const isCurrentPath = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

// ---- Footer ----------------------------------------------------------------------------------
export const FOOTER = {
  blurb: "Automation and marketing systems for short-term rentals. Built in weeks, run by us.",
  company: [
    { href: "/approach", label: "Approach" },
    { href: "/pricing", label: "Pricing" },
    { href: "/systems", label: "Systems" },
    { href: "/contact", label: "Contact" },
  ],
  copyright: "© 2026 Red Elevators",
  tagline: "Growth on autopilot",
} as const;

// ---- CTA band default copy (mockup: band()) --------------------------------------------------
export const BAND_DEFAULT = {
  title: "See what you can stop doing by hand.",
  sub: "A free 30-minute call. We map your setup and show you what to automate first.",
  cta: "Book a free 30-min call",
} as const;

// ---- Page backgrounds (each mockup page fixes --bg; home animates it) ------------------------
export const PAGE_BG = {
  night: "#0a0b14", // home (start), contact, privacy, 404
  day: "#141312", // services, service, systems, approach, pricing
} as const;
