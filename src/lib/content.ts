export const nav = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
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
export const services: Service[] = [
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
export const systems: SystemAnatomy[] = [
  {
    label: "Sales & follow-up",
    title: "A lead answered before it cools",
    desc: "The form fires, the record fills itself in, the lead is qualified and routed, and the owner is told — before anyone has opened a tab.",
    nodes: [
      { step: "Trigger", action: "Form submit", tool: "Webflow" },
      { step: "Step 01", action: "Enrich", tool: "Segment" },
      { step: "Step 02", action: "Qualify", tool: "OpenAI" },
      { step: "Step 03", action: "Route", tool: "HubSpot" },
      { step: "Step 04", action: "Notify", tool: "Slack" },
      { step: "Result", action: "Logged", tool: "Salesforce" },
    ],
  },
  {
    label: "Ops & reporting",
    title: "The Monday report builds itself overnight",
    desc: "Numbers are pulled and reconciled while the office is empty, written up, and waiting in the same place the team already looks.",
    nodes: [
      { step: "Trigger", action: "Nightly", tool: "Schedule" },
      { step: "Step 01", action: "Pull", tool: "Airtable" },
      { step: "Step 02", action: "Normalize", tool: "Make" },
      { step: "Step 03", action: "Compose", tool: "Claude" },
      { step: "Result", action: "Published", tool: "Notion" },
    ],
  },
  {
    label: "Marketing automation",
    title: "Briefs become drafts without a handoff",
    desc: "A brief goes in, an on-brand first draft comes out, and a human approves it before anything reaches an audience.",
    nodes: [
      { step: "Trigger", action: "Brief filed", tool: "Notion" },
      { step: "Step 01", action: "Draft", tool: "Claude" },
      { step: "Step 02", action: "Review", tool: "Slack" },
      { step: "Result", action: "Published", tool: "Webflow" },
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

// Empty until a service gets real, owner-supplied content — see the type
// comment above. The old "sales-follow-up" entry was removed 12 Sep 2026
// when the services taxonomy was rebuilt around the real Marketing / AI
// Automation pillars; it no longer matches any current slug.
export const serviceDetails: Record<string, ServicePage> = {};
