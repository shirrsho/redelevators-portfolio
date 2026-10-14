import type { IconName } from "./icons";

// The eight services and their automated chains.
// Ported unchanged from redesign-mockups/r3/site.js (SERVICES, CHAINS) and player.js (SHORT).
// Titles and descriptions are the company's own copy; before/after, deliverables and FAQ are
// draft copy for the owner to confirm.

export type Pillar = "auto" | "mkt";

export const SERVICE_SLUGS = [
  "guest-messaging",
  "ai-guest-assistant",
  "direct-booking-engine",
  "listing-content-engine",
  "paid-social",
  "photo-ad-creative",
  "direct-booking-website",
  "booking-campaigns",
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Mini demo on the service card (the mockup's VIZ keys). */
export type ServiceViz = "chat" | "spark" | "cal" | "doc" | "ad" | "frames" | "web" | "fun";
/** Hero scene on the service page (the mockup's HERO map keys in service.html). */
export type ServiceHeroKind = "chat" | "chat2" | "email" | "editor" | "ad" | "frames" | "site" | "funnel";

export type ChainNode = readonly [stage: string, action: string, tool: string];
export type Chain = readonly [title: string, desc: string, nodes: readonly ChainNode[]];

export type Service = {
  slug: ServiceSlug;
  /** Pillar: "auto" = AI Automation (indigo), "mkt" = Marketing (coral). */
  p: Pillar;
  icon: IconName;
  viz: ServiceViz;
  hero: ServiceHeroKind;
  title: string;
  outcome: string;
  desc: string;
  short: string;
  /** "Without the system" list (BeforeAfter). */
  before: readonly string[];
  /** "You stay in control": [what the system does, what stays with you]. */
  control: readonly [string, string];
  /** "What you get" cards. */
  gets: readonly (readonly [icon: IconName, title: string, text: string])[];
  faq: readonly (readonly [q: string, a: string])[];
};

type ServiceData = Omit<Service, "slug"> & { slug: string };

const SERVICE_DATA: readonly ServiceData[] = [
  {
    slug: "guest-messaging",
    p: "auto",
    icon: "message",
    viz: "chat",
    hero: "chat",
    title: "Guest Messaging & CRM",
    outcome: "Every guest message answered, from one inbox.",
    desc: "Inquiries, booking questions and check-in details answered instantly across Airbnb, Vrbo and direct, every guest message handled from one place.",
    short: "Every message answered, every guest remembered.",
    before: ["Airbnb, Booking.com and WhatsApp each get checked separately, all day","The same check-in answer gets typed out for the tenth time this week","Booking details get looked up in another tab before every reply","Guest notes live in someone’s head, not in a CRM"],
    control: ["The system reads, looks up and drafts.","You set the tone and the rules. Anything unusual, like refunds or complaints, comes to you before it’s sent."],
    gets: [["mail","One inbox","Airbnb, Booking.com, Vrbo and direct, in one place."],["message","Replies in your voice","Written with you once, used automatically."],["guest","A guest CRM","Every stay, preference and review remembered."],["run","Monthly tuning","We review conversations and sharpen replies."]],
    faq: [["Will guests know it’s automated?","Replies are written in your voice from your own answers. Anything the system isn’t sure about comes to you first."],["Does it work with my PMS?","We build on what you already use, such as Guesty or Hostaway. No PMS yet? We’ll recommend one in the audit."],["What about my response rate?","Replies go out in minutes at any hour, which is exactly what the platforms look for."]],
  },
  {
    slug: "ai-guest-assistant",
    p: "auto",
    icon: "assistant",
    viz: "spark",
    hero: "chat2",
    title: "AI Guest Assistant",
    outcome: "A 24/7 assistant that knows your property.",
    desc: "An assistant that answers guests in natural language, day and night; house rules, local tips, upsells and FAQs; so you’re not on your phone at 2am.",
    short: "Trained on your house rules. Replies around the clock.",
    before: ["Guests message at midnight about wifi, parking and checkout","Local tips get typed out again for every new guest","Upsells like late checkout are never offered","Every question waits until you’re awake"],
    control: ["The assistant answers only from your house guide and rules.","Anything about money, damage or a complaint is handed to you with the conversation attached."],
    gets: [["assistant","Trained on your property","House rules, guides and local tips."],["message","Where guests already are","WhatsApp and platform messages."],["payment","Built-in upsells","Late checkout, early check-in, extras."],["guest","Clean handoffs","Hard questions come to you with context."]],
    faq: [["Can it reply in other languages?","Yes. It answers in the language the guest writes in."],["What if it doesn’t know the answer?","It says so politely and hands the conversation to you, instead of guessing."],["Can I read the conversations?","Every conversation is logged in your own workspace, and you can step in at any time."],["Which AI do you use?","Mostly Anthropic’s Claude for guest-facing writing, and OpenAI where it fits a task better. You’re never locked to one."]],
  },
  {
    slug: "direct-booking-engine",
    p: "auto",
    icon: "direct",
    viz: "cal",
    hero: "email",
    title: "Direct Booking Engine",
    outcome: "Past guests come back. Directly.",
    desc: "Past guests and leads re-engaged automatically to drive repeat, direct bookings; fewer OTA commissions, more margin on every stay.",
    short: "Brings past guests back to book direct.",
    before: ["Past guests sit in a spreadsheet nobody opens","Repeat guests rebook on the platform, and the commission is paid again","Offers go out once a year, if at all, as one generic blast","Nobody knows which past guests actually came back"],
    control: ["You approve every offer and the discount behind it.","The system segments, personalizes and sends. Replies come straight to you."],
    gets: [["guest","A clean guest list","Every past stay, segmented."],["mail","Personal offers","Written per guest, sent at the right moment."],["direct","Direct checkout","Bookings land in your calendar, not the OTA’s."],["price","Repeat tracking","See who came back and what it was worth."]],
    faq: [["Can I contact guests who booked on Airbnb?","Only where you’re allowed to, such as direct guests and those who opted in. We check this together in the audit."],["Do I need a booking website?","It helps. We can build one, or connect to your PMS booking page."],["How often do guests hear from me?","A few well-timed messages a year. Never spam."]],
  },
  {
    slug: "listing-content-engine",
    p: "auto",
    icon: "content",
    viz: "doc",
    hero: "editor",
    title: "Listing & Content Engine",
    outcome: "Listings and guides that stay fresh on their own.",
    desc: "Optimized listing copy, neighborhood guides and social posts researched and published on schedule; every property kept fresh with no writer on payroll.",
    short: "Fresh listings and guides, published on schedule.",
    before: ["Listing descriptions were written once and never touched again","The area guide is a PDF from three years ago","Social posts happen when someone has a spare evening","Every new property starts from a blank page"],
    control: ["You set the topics and the voice, and can pull anything before it goes out.","The system researches, writes, checks and schedules."],
    gets: [["content","Listing copy","Tuned per platform and per property."],["direct","Neighborhood guides","Kept current for guests and for search."],["social","Social posts","Scheduled from the same source."],["check","A quality check","Every piece reviewed before it publishes."]],
    faq: [["Will it sound like AI?","It writes to a voice guide we build with you, and nothing publishes without passing a check."],["Which platforms does it update?","Your website and social channels directly. Platform listings are prepared for you to paste or sync."],["Can I edit before it goes live?","Always. You can approve, edit or pull anything."]],
  },
  {
    slug: "paid-social",
    p: "mkt",
    icon: "social",
    viz: "ad",
    hero: "ad",
    title: "Paid Social for Bookings",
    outcome: "Ads that fill your empty nights.",
    desc: "Meta and Instagram ads that fill the calendar with direct bookings, not just likes.",
    short: "Ads that follow your empty nights.",
    before: ["Ads get checked in Ads Manager whenever someone remembers","A tired ad keeps spending for days before anyone notices","Budget is the same on a quiet Tuesday as on a sold-out Saturday","Results are a weekly report pulled together by hand"],
    control: ["The system checks performance daily and recommends.","You approve every budget shift and every new creative before it runs."],
    gets: [["social","Campaigns built for bookings","Clicks to your booking page, not likes."],["calendar","Gap-night targeting","Budget follows the empty dates."],["price","Daily budget checks","Weak ads flagged, winners funded."],["run","One simple report","What you spent and what it booked."]],
    faq: [["What budget do I need?","It depends on your market and gaps. You’ll get a recommended range after the audit, and you stay in control of every change."],["Do you make the ads?","Yes, together with our creative service, or from your existing photos."],["Instagram only?","Meta (Instagram and Facebook) first, plus Google where it makes sense."]],
  },
  {
    slug: "photo-ad-creative",
    p: "mkt",
    icon: "camera",
    viz: "frames",
    hero: "frames",
    title: "Listing Photo & Ad Creative",
    outcome: "One shoot. Every format. One approval.",
    desc: "Scroll-stopping property photos, reels and ad creative built to earn the click and the booking.",
    short: "One shoot, every format, one approval.",
    before: ["Every new ad starts from a blank canvas","Each platform’s size gets resized by hand","Approval happens across scattered messages","Final files get uploaded to each account one by one"],
    control: ["You approve the concept and the final set.","The system resizes, formats and routes it, so nothing goes live without your sign-off."],
    gets: [["camera","Photo direction","Shot lists that sell the stay."],["build","Every format","Feed, story, reel and listing sizes."],["check","One approval","A single review before anything runs."],["social","Ready to run","Delivered straight into your ad accounts."]],
    faq: [["Do you do the photo shoot?","We direct it and can arrange a photographer, or work from your best existing photos."],["Video too?","Yes, short reels cut from the same shoot."],["Who owns the files?","You do, in your own drive."]],
  },
  {
    slug: "direct-booking-website",
    p: "mkt",
    icon: "website",
    viz: "web",
    hero: "site",
    title: "Direct Booking Website",
    outcome: "Your own booking site. No commission.",
    desc: "A fast, commission-free booking site tuned to turn lookers into confirmed reservations.",
    short: "Your own site, synced with your calendar.",
    before: ["Every booking goes through a platform that takes a cut","Your website is a brochure with an email address","Rates on the site don’t match the platforms","Double bookings get caught by luck"],
    control: ["You own the site, the domain and the guest data.","The system checks rates and availability daily and flags anything that doesn’t match."],
    gets: [["website","A fast booking site","Built to turn visits into stays."],["payment","Secure payments","Stripe checkout, money straight to you."],["calendar","Synced calendars","With your PMS and every platform."],["alert","Daily checks","Stale rates and clashes flagged early."]],
    faq: [["Will it connect to my PMS?","Yes. We sync availability and rates with what you already use."],["Who owns it?","You do: the domain, the site and every guest record."],["How do guests find it?","Through returning guests, search, and our ads and campaigns."]],
  },
  {
    slug: "booking-campaigns",
    p: "mkt",
    icon: "funnel",
    viz: "fun",
    hero: "funnel",
    title: "Full-Funnel Booking Campaigns",
    outcome: "From first look to confirmed stay.",
    desc: "From first impression to confirmed stay, across search, social and email.",
    short: "From first look to confirmed stay.",
    before: ["Search, social and email run as separate efforts","Nobody can say which channel actually brings bookings","People who looked but didn’t book never hear from you","Reports count clicks, not stays"],
    control: ["You set the goals and the budget.","The system pulls every channel into one view daily and flags where guests drop off."],
    gets: [["funnel","One full funnel","Awareness, retargeting and email in one plan."],["guest","Follow-up for lookers","Reminders for people who almost booked."],["price","One dashboard","Every channel, measured in bookings."],["run","Monthly tuning","Effort moves to what works."]],
    faq: [["Is this just ads?","No. It joins ads, search, email and your website into one path to booking."],["How do you measure it?","In bookings and revenue, tracked through to your calendar."],["Do I need the other services?","It works best with a direct booking website, but we start from what you have."]],
  },
];

// The automated chains, from the live site's systems data (index-aligned with SERVICES)
export const CHAINS: readonly Chain[] = [
  ["A guest question, answered in seconds","A message lands from any channel, the system reads it, pulls the booking details and drafts the right reply.",[["Trigger","Message in","Airbnb"],["Step 01","Read intent","Claude"],["Step 02","Pull booking","Guesty"],["Step 03","Draft reply","Claude"],["Result","Sent & logged","Guesty"]]],
  ["One assistant runs every conversation","A guest messages on WhatsApp; the assistant works out what they need, takes the action and replies in natural language.",[["Trigger","Message in","WhatsApp"],["Step 01","Understand","Claude"],["Step 02","Take action","n8n"],["Step 03","Draft reply","Claude"],["Result","Logged","Notion"]]],
  ["Past guests, back on the calendar","Your guest list is segmented, each contact gets a personal offer to book direct, and it sends itself.",[["Trigger","Guest list","Airtable"],["Step 01","Segment","n8n"],["Step 02","Personalize","Claude"],["Step 03","Send","n8n"],["Result","Logged","Guesty"]]],
  ["Fresh listings and guides, on schedule","A topic is picked, researched and written, checked, and published, keeping every listing and guide current.",[["Trigger","Topic due","n8n"],["Step 01","Research","Claude"],["Step 02","Write","Claude"],["Step 03","Quality check","n8n"],["Result","Published","Webflow"]]],
  ["Budget follows the bookings, every day","Ad performance is checked daily, weak ads are flagged, and budget shifts toward what’s driving bookings.",[["Trigger","Daily check","Meta Ads"],["Step 01","Compare","Make"],["Step 02","Flag changes","Slack"],["Result","Budget shifted","Meta Ads"]]],
  ["One property, every format, one approval","A creative set is built once, resized for each platform automatically, and routed for a single approval.",[["Trigger","Set approved","Canva"],["Step 01","Resize","Canva"],["Step 02","Route approval","Slack"],["Result","Ready to run","Meta Ads"]]],
  ["The site and the calendar stay in sync","Availability, pricing and content are checked daily, so a double booking or stale rate is flagged before it costs you.",[["Trigger","Daily sync","Guesty"],["Step 01","Compare rates","PriceLabs"],["Step 02","Flag issues","Slack"],["Result","Reported","Notion"]]],
  ["One view, from first click to confirmed stay","Every channel’s performance is pulled into one place daily, so the whole funnel is visible.",[["Trigger","Daily pull","Google Ads"],["Step 01","Merge channels","Make"],["Step 02","Flag drop-off","Slack"],["Result","Reported","Notion"]]],
];

export const SERVICES: readonly (Service & { chain: Chain; idx: number })[] = SERVICE_DATA.map((s, idx) => ({
  ...(s as Service),
  chain: CHAINS[idx],
  idx,
}));

/** Short names (player tabs, control room). Index-aligned with SERVICES. */
export const SHORT: readonly string[] = [
  "Guest Messaging",
  "AI Guest Assistant",
  "Direct Booking Engine",
  "Listing & Content",
  "Paid Social",
  "Photo & Ad Creative",
  "Booking Website",
  "Booking Campaigns",
];

export const PILLAR_LABEL: Record<Pillar, string> = { auto: "AI Automation", mkt: "Marketing" };

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const servicesIn = (p: Pillar) => SERVICES.filter((s) => s.p === p);

/** Old service slugs → new (301/308 redirects in next.config.ts). DECISIONS → URLs. */
export const OLD_SERVICE_SLUGS: Readonly<Record<string, ServiceSlug>> = {
  "workflow-crm-automation": "guest-messaging",
  "ai-assistants-chatbots": "ai-guest-assistant",
  "sales-outreach-systems": "direct-booking-engine",
  "content-engines": "listing-content-engine",
  "paid-social-advertising": "paid-social",
  "creative-ad-design": "photo-ad-creative",
  "ecommerce-growth": "direct-booking-website",
  "full-funnel-campaigns": "booking-campaigns",
};
