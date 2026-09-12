export const nav = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Systems", href: "#systems" },
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

export const services = [
  {
    num: "01",
    slug: "marketing-automation",
    title: "Marketing automation",
    desc: "Lead capture, nurture sequences, content pipelines and campaign reporting — running on autopilot.",
    tags: ["Nurture", "Email", "Attribution"],
  },
  {
    num: "02",
    slug: "growth-paid-media",
    title: "Growth & paid media",
    desc: "Full-funnel campaigns across search, social and email — creative, targeting and optimization handled end to end.",
    tags: ["Paid", "Creative", "CRO"],
  },
  {
    num: "03",
    slug: "sales-follow-up",
    title: "Sales & follow-up",
    desc: "Automated qualification, CRM updates and instant follow-up so no lead ever goes cold again.",
    tags: ["CRM", "Routing", "Speed-to-lead"],
  },
  {
    num: "04",
    slug: "ops-reporting",
    title: "Ops & reporting",
    desc: "Data entry, internal reporting and cross-tool syncing — replaced with workflows that just run.",
    tags: ["Dashboards", "Sync", "RevOps"],
  },
  {
    num: "05",
    slug: "ai-agents",
    title: "AI agents",
    desc: "Task-specific agents that research, draft and decide inside the tools your team already uses.",
    tags: ["Agents", "RAG", "Drafting"],
  },
  {
    num: "06",
    slug: "custom-internal-tools",
    title: "Custom internal tools",
    desc: "Lightweight apps and portals that connect your stack and give the team one place to work.",
    tags: ["Apps", "Portals", "Integrations"],
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

export const serviceDetails: Record<string, ServicePage> = {
  "sales-follow-up": {
    feltCost: [
      "A form comes in, and it sits in an inbox until someone has five minutes.",
      "By the time anyone replies, the lead has already talked to someone else.",
    ],
    humanCheckpoint:
      "The system qualifies and routes the lead and pings the rep on Slack the moment it's ready — the rep still makes the actual call. Nothing sends an outreach message on a person's behalf.",
    // manualChain: intentionally absent — see comment above.
  },
};
