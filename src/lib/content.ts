export const nav = [
  { label: "Services", href: "/services" },
  { label: "Approach", href: "/approach" },
  { label: "Systems", href: "/#systems" },
];

// Capability figures only. Every value here is verifiable from this site or the
// way the work is actually done — no outcome claims, no client results.
// See PRODUCT.md -> Evidence on Hand before changing anything in this file.
export const stats = [
  { value: 15, suffix: "", label: "Tools we build inside" },
  { value: 6, suffix: "", label: "Service lines" },
  { value: 4, suffix: "", label: "Stages, audit to handover" },
  { value: 0, suffix: "", label: "New platforms to learn" },
];

export const marquee = [
  "HubSpot",
  "Zapier",
  "Make",
  "n8n",
  "OpenAI",
  "Claude",
  "Salesforce",
  "Airtable",
  "Slack",
  "Notion",
  "Webflow",
  "Google Ads",
  "Meta Ads",
  "Klaviyo",
  "Segment",
  // Added 12 Sep 2026 — the CRM used in the Sales & Outreach Systems chain,
  // confirmed real via Red-Elevators-AI-Portfolio.pdf's stack list.
  "HighLevel",
  // Added 12 Sep 2026 alongside the other 7 services' System Anatomy chains —
  // each confirmed real via one of the two portfolio decks' own stack lists.
  "Telegram",
  "Canva",
  "Shopify",
];

export type Service = {
  num: string;
  slug: string;
  category: "Marketing" | "AI Automation";
  title: string;
  desc: string;
  tags: string[];
};

// The two real service pillars, rebuilt 12 Sep 2026 from the company's own
// portfolio decks (Red-Elevators-Marketing-Portfolio.pdf,
// Red-Elevators-AI-Portfolio.pdf) — titles and descriptions are the company's
// own positioning copy, not invented here. Replaces the earlier six-line
// structure, which didn't match either deck. See docs/changelog.md.
// AI Automation leads — it's the harder-to-copy, higher-value pillar and the
// one the site's whole mechanism-led design language (System Anatomy, the
// red pulse) is actually about; Marketing is one thing that gets automated,
// not the differentiator. Reordered 12 Sep 2026, was Marketing-first.
export const services: Service[] = [
  // AI Automation
  {
    num: "01",
    slug: "workflow-crm-automation",
    category: "AI Automation",
    title: "Workflow & CRM Automation",
    desc: "Inboxes, pipelines and repetitive tasks wired together into one system that runs quietly in the background, day and night.",
    tags: ["CRM", "Workflows", "n8n"],
  },
  {
    num: "02",
    slug: "ai-assistants-chatbots",
    category: "AI Automation",
    title: "AI Assistants & Chatbots",
    desc: "Assistants that handle email, calendar, tasks and customer messages in natural language, so your team stops doing the busywork.",
    tags: ["Assistants", "Chatbots", "OpenAI"],
  },
  {
    num: "03",
    slug: "sales-outreach-systems",
    category: "AI Automation",
    title: "Sales & Outreach Systems",
    desc: "Leads researched and emailed with genuine personalization at scale, keeping your pipeline full without manual prospecting.",
    tags: ["Outreach", "Lead research", "Personalization"],
  },
  {
    num: "04",
    slug: "content-engines",
    category: "AI Automation",
    title: "Content Engines",
    desc: "SEO articles researched, written, illustrated and published on schedule, holding a steady cadence with no copywriter on payroll.",
    tags: ["SEO", "Content", "Publishing"],
  },
  // Marketing
  {
    num: "01",
    slug: "paid-social-advertising",
    category: "Marketing",
    title: "Paid Social Advertising",
    desc: "Meta lead-gen, conversions and page growth that pay for themselves.",
    tags: ["Meta Ads", "Lead-gen", "Conversions"],
  },
  {
    num: "02",
    slug: "creative-ad-design",
    category: "Marketing",
    title: "Creative & Ad Design",
    desc: "Scroll-stopping static and video built to sell, not just to look good.",
    tags: ["Static", "Video", "Creative"],
  },
  {
    num: "03",
    slug: "ecommerce-growth",
    category: "Marketing",
    title: "E-commerce Growth",
    desc: "Shopify stores managed and tuned to turn traffic into paid orders.",
    tags: ["Shopify", "CRO", "Growth"],
  },
  {
    num: "04",
    slug: "full-funnel-campaigns",
    category: "Marketing",
    title: "Full-Funnel Campaigns",
    desc: "From first impression to purchase, across any vertical or niche.",
    tags: ["Awareness", "Funnel", "Multi-channel"],
  },
];

export const steps = [
  {
    num: "01",
    title: "Audit",
    desc: "We map every repetitive task and manual campaign across your business, and put an hour and dollar figure on each one.",
  },
  {
    num: "02",
    title: "Design",
    desc: "We architect the workflow — what triggers it, what it touches, and exactly where a human still checks in.",
  },
  {
    num: "03",
    title: "Build",
    desc: "We build inside your existing tools, not a separate platform you have to learn. Live in weeks, not quarters.",
  },
  {
    num: "04",
    title: "Run",
    desc: "We monitor, refine and hand over full documentation. The system keeps running whether we're in the room or not.",
  },
];

// Expanded copy for /approach — one entry per `steps` stage. Everything here
// restates or elaborates PRODUCT.md -> Operating Context; no new claim, no
// number that isn't already established elsewhere on the site.
export type ApproachStage = {
  num: string;
  title: string;
  summary: string;
  detail: string[];
  output: string;
};

export const approachStages: ApproachStage[] = [
  {
    num: "01",
    title: "Audit",
    summary:
      "We map every repetitive task and manual campaign across your business, and put an hour and dollar figure on each one.",
    detail: [
      "We sit with the people who actually do the work, not just the person who signs off on it, and walk every tool, spreadsheet and hand-off in the current process.",
      "Each repetitive task gets an hour cost and a dollar figure, so what gets built first is set by what it's actually costing you, not by what looks most impressive to automate.",
    ],
    output:
      "A ranked list of what to fix first, in hours and dollars, before a single workflow is designed.",
  },
  {
    num: "02",
    title: "Design",
    summary:
      "We architect the workflow — what triggers it, what it touches, and exactly where a human still checks in.",
    detail: [
      "Every workflow gets a trigger, a defined path through the tools it touches, and at least one point where a person reviews or approves before anything goes out.",
      "This is the stage where we decide what should run itself and what shouldn't — full automation isn't the goal on every task, correctness is.",
    ],
    output:
      "A workflow diagram naming every tool, trigger and checkpoint, reviewed with you before we build anything.",
  },
  {
    num: "03",
    title: "Build",
    summary:
      "We build inside your existing tools, not a separate platform you have to learn. Live in weeks, not quarters.",
    detail: [
      "Nothing here requires your team to log into a new platform. We build using the CRM, ad accounts and automation tools you already run.",
      "Each system ships live in weeks, tested against real data before it ever touches a live lead or campaign.",
    ],
    output: "A working system, running on real data, inside the tools your team already knows.",
  },
  {
    num: "04",
    title: "Run",
    summary:
      "We monitor, refine and hand over full documentation. The system keeps running whether we're in the room or not.",
    detail: [
      "We watch the system's first weeks live, fix what real usage exposes, and document exactly how it works and where the human checkpoints sit.",
      "Handover isn't a PDF nobody reads — someone on your team can explain the system back to us before we call it done.",
    ],
    output: "A documented, running system your team owns and can maintain without us.",
  },
];

export type AnatomyNode = {
  /** Position in the chain — "Trigger", "Step 01", "Result". */
  step: string;
  /** What happens at this node. One or two words. */
  action: string;
  /** The tool it runs in. Must be a tool we actually build inside. */
  tool: string;
};

export type SystemAnatomy = {
  label: string;
  title: string;
  desc: string;
  nodes: AnatomyNode[];
};

// The proof device. These describe how the systems are wired, not results they
// produced — the mechanism is the claim. Never attach a metric to one of these.
// One entry per real service (`label` matches `services[].title` exactly, so
// a service page can look up its own chain) — rebuilt 12 Sep 2026 alongside
// the manual chains, replacing three entries whose labels ("Sales &
// follow-up", "Ops & reporting", "Marketing automation") predated the
// taxonomy rebuild and no longer matched any service. Same order as
// `services`: AI Automation first, then Marketing. `Systems.tsx` shows a
// curated slice on the home page, not the whole array — see that component.
export const systems: SystemAnatomy[] = [
  {
    label: "Workflow & CRM Automation",
    title: "A pipeline that updates itself",
    desc: "A change in one tool is detected, the record is updated everywhere it needs to be, and the right person is told — without anyone touching a spreadsheet.",
    nodes: [
      { step: "Trigger", action: "Deal changes", tool: "HighLevel" },
      { step: "Step 01", action: "Check rules", tool: "n8n" },
      { step: "Step 02", action: "Update record", tool: "Airtable" },
      { step: "Step 03", action: "Notify owner", tool: "Slack" },
      { step: "Result", action: "Logged", tool: "Notion" },
    ],
  },
  {
    label: "AI Assistants & Chatbots",
    title: "One conversation runs the whole day",
    desc: "A message arrives by chat, the assistant reads it, decides what it needs and drafts the response, task or calendar update — in natural language, from a single conversation.",
    nodes: [
      { step: "Trigger", action: "Message received", tool: "Telegram" },
      { step: "Step 01", action: "Understand intent", tool: "OpenAI" },
      { step: "Step 02", action: "Take action", tool: "n8n" },
      { step: "Step 03", action: "Draft reply", tool: "OpenAI" },
      { step: "Result", action: "Logged", tool: "Notion" },
    ],
  },
  {
    // Matches the real mechanism description already in
    // Red-Elevators-AI-Portfolio.pdf ("Outreach that researches itself"),
    // not a client-specific claim. This service page's pilot, added 12 Sep.
    label: "Sales & Outreach Systems",
    title: "Every prospect gets research, not a template",
    desc: "A raw lead list is researched across each prospect's site and public presence, then a personalized email is drafted — no generic template, no manual digging.",
    nodes: [
      { step: "Trigger", action: "Lead list", tool: "Airtable" },
      { step: "Step 01", action: "Research", tool: "n8n" },
      { step: "Step 02", action: "Personalize", tool: "OpenAI" },
      { step: "Step 03", action: "Send", tool: "n8n" },
      { step: "Result", action: "Logged", tool: "HighLevel" },
    ],
  },
  {
    label: "Content Engines",
    title: "An article a day, with no writer on payroll",
    desc: "A content pillar is picked, researched and written, a matching image is sourced, and the piece is checked and published — on schedule, without a copywriter driving it.",
    nodes: [
      { step: "Trigger", action: "Pillar due", tool: "n8n" },
      { step: "Step 01", action: "Research", tool: "OpenAI" },
      { step: "Step 02", action: "Write", tool: "OpenAI" },
      { step: "Step 03", action: "Quality check", tool: "n8n" },
      { step: "Result", action: "Published", tool: "Webflow" },
    ],
  },
  {
    label: "Paid Social Advertising",
    title: "Budget follows what's working, every day",
    desc: "Campaign performance is checked daily, underperforming ads are flagged, and budget is reallocated toward what's converting — before a slow week becomes a slow month.",
    nodes: [
      { step: "Trigger", action: "Daily check", tool: "Meta Ads" },
      { step: "Step 01", action: "Compare performance", tool: "Make" },
      { step: "Step 02", action: "Flag changes", tool: "Slack" },
      { step: "Result", action: "Budget shifted", tool: "Meta Ads" },
    ],
  },
  {
    label: "Creative & Ad Design",
    title: "One concept, every size, one approval",
    desc: "A creative concept is built once, resized and formatted for each platform automatically, and routed for a single approval before it's uploaded and ready to run.",
    nodes: [
      { step: "Trigger", action: "Concept approved", tool: "Canva" },
      { step: "Step 01", action: "Resize for platforms", tool: "Canva" },
      { step: "Step 02", action: "Route for approval", tool: "Slack" },
      { step: "Result", action: "Ready to run", tool: "Meta Ads" },
    ],
  },
  {
    label: "E-commerce Growth",
    title: "The store and the ads watch each other",
    desc: "Store performance and ad performance are checked together daily, so a stockout, a price change or a slow product gets flagged before it quietly burns ad spend.",
    nodes: [
      { step: "Trigger", action: "Daily sync", tool: "Shopify" },
      { step: "Step 01", action: "Compare to ad spend", tool: "Make" },
      { step: "Step 02", action: "Flag issues", tool: "Slack" },
      { step: "Result", action: "Reported", tool: "Notion" },
    ],
  },
  {
    label: "Full-Funnel Campaigns",
    title: "One view, from first impression to purchase",
    desc: "Awareness, consideration and conversion performance are pulled into one place daily, so the whole funnel is visible — not just whichever stage someone last checked.",
    nodes: [
      { step: "Trigger", action: "Daily pull", tool: "Google Ads" },
      { step: "Step 01", action: "Merge channels", tool: "Make" },
      { step: "Step 02", action: "Flag underperformance", tool: "Slack" },
      { step: "Result", action: "Reported", tool: "Notion" },
    ],
  },
];

// Service page content — workstream E, docs/brief-service-page.md. Keyed by
// `services[].slug`. A service only gets an entry once every required field
// is real; `manualChain` is the one hard content dependency the brief calls
// out twice ("the page cannot ship for a service until that chain exists") —
// it is described by who does it and what stalls it, never a duration or a
// percentage, and it comes from the owner, not invented here.
export type ManualStep = {
  /** Who does it, or what it waits on — e.g. "A rep checks the shared sheet". */
  note: string;
};

export type ServicePage = {
  feltCost: string[];
  /** The automated chain's human checkpoint — grounded in that chain's own
   *  data (e.g. a Slack notify step implies a person acts on it next), not a
   *  separate claim. */
  humanCheckpoint: string;
  manualChain?: ManualStep[];
};

// The old "sales-follow-up" entry was removed 12 Sep 2026 when the services
// taxonomy was rebuilt around the real Marketing / AI Automation pillars; it
// no longer matched any current slug. All eight entries below are generic,
// industry-typical descriptive copy of how each kind of work commonly
// happens without the system — not a claim about any specific client, so
// none of it falls under PRODUCT.md's evidence-clearance rule the way a
// named case study would. Every service now has one, so every service page
// is live — see docs/changelog.md.
export const serviceDetails: Record<string, ServicePage> = {
  "workflow-crm-automation": {
    feltCost: [
      "Data drifts out of sync the moment two tools both need the same update.",
      "A follow-up gets missed the moment the person who owns it gets busy.",
    ],
    humanCheckpoint:
      "The system watches for changes, updates records and notifies the right person — a person still decides what happens next. Nothing acts on a customer's behalf without someone choosing to.",
    manualChain: [
      { note: "Someone checks the CRM manually to see what changed" },
      { note: "The same update gets typed into two different tools by hand" },
      { note: "A teammate is pinged individually whenever something needs attention" },
      { note: "Follow-up tasks live in someone's memory, not a system" },
    ],
  },
  "ai-assistants-chatbots": {
    feltCost: [
      "The busywork never stops, it just moves to whenever there's a spare five minutes.",
      "Every channel needs checking on its own — nothing talks to anything else.",
    ],
    humanCheckpoint:
      "The assistant reads, drafts and organizes across channels — a person still approves anything that leaves the building or touches money. It handles the busywork, not the judgment calls.",
    manualChain: [
      { note: "Email, calendar and messages all get checked separately, all day" },
      { note: "Every reply gets typed out from scratch, even the routine ones" },
      { note: "Tasks get written on a sticky note or a mental list" },
      { note: "Expenses get logged whenever someone remembers to open the spreadsheet" },
    ],
  },
  "sales-outreach-systems": {
    feltCost: [
      "Prospecting stalls the moment nobody has an afternoon free to do it.",
      "A generic template gets ignored, and the lead never hears from you again.",
    ],
    humanCheckpoint:
      "The system researches, personalizes and sends the first email — a person still owns every reply and every real conversation once a prospect responds. Nothing but the first touch runs on its own.",
    manualChain: [
      { note: "Someone scrolls LinkedIn and company sites one prospect at a time" },
      { note: "Notes get typed into a spreadsheet by hand" },
      { note: "The same generic template goes out to everyone" },
      { note: "Follow-up happens only when someone remembers" },
    ],
  },
  "content-engines": {
    feltCost: [
      "A content calendar with no writer behind it just stops publishing.",
      "Every article starts from zero — nothing about the last one carries over.",
    ],
    humanCheckpoint:
      "A person still sets the content pillars and can pull any article before it goes out — the system handles the researching, writing, illustrating and publishing in between.",
    manualChain: [
      { note: "A writer researches the topic by hand before starting a draft" },
      { note: "Finding a matching image means another trip to a stock site" },
      { note: "Publishing means logging into the CMS and formatting everything by hand" },
      { note: "The schedule slips whenever the writer is busy with something else" },
    ],
  },
  "paid-social-advertising": {
    feltCost: [
      "Budget keeps spending on an ad that stopped working three days ago.",
      "A winning ad gets starved of budget because nobody moved it in time.",
    ],
    humanCheckpoint:
      "The system watches performance and flags what needs a decision — a person still approves every budget shift and every new creative before it runs.",
    manualChain: [
      { note: "Someone checks ad performance by logging into Ads Manager" },
      { note: "Underperforming ads get paused whenever someone notices" },
      { note: "Budget shifts happen manually, a few times a week at best" },
      { note: "Results get pulled into a report by hand at the end of the week" },
    ],
  },
  "creative-ad-design": {
    feltCost: [
      "A single ad becomes five different files the moment it needs to run on five platforms.",
      "Creative sits waiting for approval while the campaign misses its launch window.",
    ],
    humanCheckpoint:
      "The system handles resizing, formatting and routing for approval — a person still designs the concept and signs off before anything goes live. Nothing publishes without that sign-off.",
    manualChain: [
      { note: "A new ad concept starts from a blank canvas each time" },
      { note: "Each platform's size and format gets resized by hand" },
      { note: "Approval happens over back-and-forth messages, whenever someone's free" },
      { note: "The final files get uploaded to each ad account manually" },
    ],
  },
  "ecommerce-growth": {
    feltCost: [
      "A stockout on a bestseller keeps burning ad spend for another day before anyone notices.",
      "Reporting takes an afternoon that could've gone into the next campaign.",
    ],
    humanCheckpoint:
      "The system watches store and ad performance together and flags what needs attention — a person still decides what to change and approves it before it happens.",
    manualChain: [
      { note: "Store settings and inventory get checked across tools by hand" },
      { note: "Ad spend gets reviewed whenever someone has time to open the dashboard" },
      { note: "Sales numbers are exported from Shopify and reformatted for a report" },
      { note: "Underperforming products keep running the same ad regardless" },
    ],
  },
  "full-funnel-campaigns": {
    feltCost: [
      "Nobody can see whether the whole funnel is working, only pieces of it.",
      "A campaign coasts on inertia because stopping it means someone has to notice first.",
    ],
    humanCheckpoint:
      "The system tracks the whole funnel and flags what's underperforming — a person still decides what to launch, pause or scale.",
    manualChain: [
      { note: "Each stage of the funnel is planned and tracked in a separate tool" },
      { note: "Handoffs between awareness, consideration and purchase happen over messages" },
      { note: "Nobody sees the whole funnel's performance in one place" },
      { note: "A campaign keeps running past the point it stopped paying for itself" },
    ],
  },
};
