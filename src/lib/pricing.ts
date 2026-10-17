import { SERVICE_SLUGS, getService, type ServiceSlug } from "./services";

// Currencies, the rate card, the quote rules, tiers and the calculator inputs.
// Source of truth: docs/PRICING.md (the agency's Pricing Playbook, set 14 Oct 2026). Every price
// on the site — tiers, plan builder, calculator — is computed here from RATES, never typed twice.

export const CURRENCIES = ["usd", "aed", "eur"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const DEFAULT_CURRENCY: Currency = "usd";
export const isCurrency = (v: unknown): v is Currency => CURRENCIES.includes(v as Currency);

/** Toggle labels, in order. */
export const CURRENCY_LABEL: Record<Currency, string> = { usd: "$ USD", aed: "AED", eur: "€ EUR" };
export const CURRENCY_SYMBOL: Record<Currency, string> = { usd: "$", aed: "AED ", eur: "€" };

/** Display-only factors for values entered in dollars (the calculator's nightly rate). AED is the
 *  fixed peg; EUR is the ECB rate on 14 Oct 2026 (1.1195). Prices below are set per currency. */
export const FX: Record<Currency, number> = { usd: 1, aed: 3.67, eur: 0.89 };

/** "$1,234", "AED 1,234", "€1,234". */
export const formatMoney = (n: number, cur: Currency) => CURRENCY_SYMBOL[cur] + Math.round(n).toLocaleString("en-US");

export type Money = Readonly<Record<Currency, number>>;

export type Rate = {
  setup: Money;
  monthly: Money;
  /** AI Automation systems: the monthly fee covers INCLUDED_UNITS, then UNIT_FEES per unit. */
  perUnit: boolean;
  /** Minimum monthly ad spend, paid by the client straight to Meta or Google. */
  adMin?: Money;
  /** Launch guarantee when it is longer than GUARANTEE_DAYS (websites, full-funnel campaigns). */
  guaranteeDays?: number;
};

/** The rate card (Pricing Playbook → Rate card). Each currency is set, not converted. */
export const RATES: Readonly<Record<ServiceSlug, Rate>> = {
  "guest-messaging": { setup: { usd: 900, aed: 3300, eur: 800 }, monthly: { usd: 190, aed: 690, eur: 169 }, perUnit: true },
  "ai-guest-assistant": { setup: { usd: 1200, aed: 4400, eur: 1050 }, monthly: { usd: 240, aed: 890, eur: 209 }, perUnit: true },
  "direct-booking-engine": { setup: { usd: 900, aed: 3300, eur: 800 }, monthly: { usd: 190, aed: 690, eur: 169 }, perUnit: true },
  "listing-content-engine": { setup: { usd: 600, aed: 2200, eur: 550 }, monthly: { usd: 190, aed: 690, eur: 169 }, perUnit: true },
  "paid-social": {
    setup: { usd: 750, aed: 2750, eur: 650 },
    monthly: { usd: 750, aed: 2750, eur: 650 },
    perUnit: false,
    adMin: { usd: 1000, aed: 3500, eur: 900 },
  },
  // Setup is per property; the local photographer is billed at cost on top.
  "photo-ad-creative": { setup: { usd: 450, aed: 1650, eur: 400 }, monthly: { usd: 390, aed: 1450, eur: 349 }, perUnit: false },
  // Monthly = the care plan.
  "direct-booking-website": {
    setup: { usd: 1900, aed: 6950, eur: 1700 },
    monthly: { usd: 99, aed: 360, eur: 89 },
    perUnit: false,
    guaranteeDays: 30,
  },
  "booking-campaigns": {
    setup: { usd: 1500, aed: 5500, eur: 1350 },
    monthly: { usd: 1800, aed: 6590, eur: 1590 },
    perUnit: false,
    adMin: { usd: 2500, aed: 9000, eur: 2250 },
    guaranteeDays: 30,
  },
};

/** Units covered by a plan's monthly fee; above it the unit fee is charged once per plan. */
export const INCLUDED_UNITS = 5;
/** Per extra unit per month: units 6–30, then 31+. */
export const UNIT_FEES: { upTo30: Money; above30: Money } = {
  upTo30: { usd: 15, aed: 55, eur: 14 },
  above30: { usd: 10, aed: 35, eur: 9 },
};
/** Where each tier is the best fit, by units. Guidance only: any plan works at any size, and the
 *  unit fee is the only thing that grows with units, so there is no price jump between tiers. */
export const GROWTH_FROM_UNITS = 10;
export const PORTFOLIO_FROM_UNITS = 31;
/** Portfolio service level: a flat monthly fee on top of the rate card, never discounted. Covers a
 *  dedicated build lead, team training and documentation, and same-business-day replies. Opt-in,
 *  suggested from PORTFOLIO_FROM_UNITS. */
export const PORTFOLIO_SERVICE: Money = { usd: 500, aed: 1850, eur: 450 };
/** Support reply times, in business days, by service level (0 = same business day). */
export const REPLY_DAYS: Readonly<Record<TierKey, number>> = { starter: 2, growth: 1, portfolio: 0 };

/** Bundle saving on setup and monthly: 10% for 3–4 systems, 15% for 5+. */
export const bundleDiscount = (systems: number) => (systems >= 5 ? 0.15 : systems >= 3 ? 0.1 : 0);

/** Launch offers (Pricing Playbook → Offers). Set FOUNDING.open to false the day client 5 signs. */
export const FOUNDING = { open: true, clients: 5, setupOff: 0.5 } as const;
export const GUARANTEE_DAYS = 21;
/** The guarantee for a set of systems: the longest of theirs (an empty plan gets GUARANTEE_DAYS). */
export const guaranteeFor = (slugs: readonly ServiceSlug[]) =>
  Math.max(GUARANTEE_DAYS, ...slugs.map((s) => RATES[s].guaranteeDays ?? GUARANTEE_DAYS));
/** Websites and full-funnel campaigns (RATES[…].guaranteeDays). */
export const GUARANTEE_DAYS_LONG = guaranteeFor(["direct-booking-website", "booking-campaigns"]);

const roundMonthly = (n: number, cur: Currency) => {
  const r = Math.round(n / 10) * 10;
  return cur === "eur" && r < 300 ? r - 1 : r;
};
const roundSetup = (n: number) => Math.round(n / 50) * 50;

/** Monthly fee for the units above INCLUDED_UNITS (0 when the plan has no AI Automation system). */
export const unitFee = (units: number, cur: Currency) =>
  Math.max(0, Math.min(units, 30) - INCLUDED_UNITS) * UNIT_FEES.upTo30[cur] + Math.max(0, units - 30) * UNIT_FEES.above30[cur];

export type Quote = {
  setup: number;
  monthly: number;
  /** 0, 0.1 or 0.15. */
  discount: number;
  /** Extra-unit fee included in `monthly`, before the bundle saving. */
  units: number;
  /** Rate-card totals before the bundle saving (systems + unit fee; no service level). */
  rawSetup: number;
  rawMonthly: number;
  /** Portfolio service level included in `monthly` (0 when not chosen). */
  service: number;
  /** Highest minimum ad spend among the systems, or 0. */
  adMin: number;
  /** Setup after the founding-client discount. */
  foundingSetup: number;
};

/** Quote formula (Pricing Playbook → Pricing rules 1–4). `portfolio` adds the service level. */
export function quote(slugs: readonly ServiceSlug[], units: number, cur: Currency, portfolio = false): Quote {
  const rates = slugs.map((s) => RATES[s]);
  const discount = bundleDiscount(rates.length);
  const extra = rates.some((r) => r.perUnit) ? unitFee(units, cur) : 0;
  const rawMonthly = rates.reduce((a, r) => a + r.monthly[cur], 0) + extra;
  const rawSetup = rates.reduce((a, r) => a + r.setup[cur], 0);
  const service = portfolio && rates.length ? PORTFOLIO_SERVICE[cur] : 0;
  const monthly = (discount ? roundMonthly(rawMonthly * (1 - discount), cur) : rawMonthly) + service;
  const setup = discount ? roundSetup(rawSetup * (1 - discount)) : rawSetup;
  return {
    setup,
    monthly,
    discount,
    units: extra,
    rawSetup,
    rawMonthly,
    service,
    adMin: Math.max(0, ...rates.map((r) => r.adMin?.[cur] ?? 0)),
    foundingSetup: roundSetup(setup * (1 - FOUNDING.setupOff)),
  };
}

/** Every combination of k items. */
function combos<T>(items: readonly T[], k: number): T[][] {
  if (k === 0) return [[]];
  return items.flatMap((x, i) => combos(items.slice(i + 1), k - 1).map((c) => [x, ...c]));
}

/** The AI Automation systems (priced per unit). Starter and Growth are built from these. */
export const AUTOMATION: readonly ServiceSlug[] = SERVICE_SLUGS.filter((s) => RATES[s].perUnit);
export const isAutomation = (s: ServiceSlug) => RATES[s].perUnit;

export type TierKey = "starter" | "growth" | "portfolio";

/** A tier as a real plan: the systems, units and service level a card's price is quoted for. */
export type TierPlan = { slugs: readonly ServiceSlug[]; units: number; portfolio: boolean };

/** Each tier's "from" plan: its cheapest real plan (lowest monthly, then lowest setup), so the
 *  card's monthly and setup always belong to one plan you can buy. Starter = one AI Automation
 *  system; Growth = three; Portfolio = three at PORTFOLIO_FROM_UNITS + the service level. Prices
 *  are equal in every currency's order, so USD picks the plan. */
export function tierPlan(tier: TierKey): TierPlan {
  const portfolio = tier === "portfolio";
  const units = portfolio ? PORTFOLIO_FROM_UNITS : INCLUDED_UNITS;
  const plans = tier === "starter" ? AUTOMATION.map((s) => [s]) : combos(AUTOMATION, 3);
  const best = plans
    .map((slugs) => ({ slugs, q: quote(slugs, units, "usd", portfolio) }))
    .reduce((a, b) => (b.q.monthly < a.q.monthly || (b.q.monthly === a.q.monthly && b.q.setup < a.q.setup) ? b : a));
  return { slugs: best.slugs, units, portfolio };
}

/** A tier's "from" prices, quoted from tierPlan(). */
export function tierFrom(tier: TierKey, cur: Currency): { monthly: number; setup: number } {
  const p = tierPlan(tier);
  const q = quote(p.slugs, p.units, cur, p.portfolio);
  return { monthly: q.monthly, setup: q.setup };
}

/** Which tier a builder plan matches, or null for a custom mix. Marketing systems are add-ons to
 *  any tier; the service level makes it Portfolio. */
export function planTier(slugs: readonly ServiceSlug[], portfolio: boolean): TierKey | null {
  const auto = slugs.filter(isAutomation).length;
  if (portfolio) return slugs.length ? "portfolio" : null;
  return auto === 1 ? "starter" : auto >= 3 ? "growth" : null;
}

/** "within 2 business days", "same business day". */
export const replyTime = (tier: TierKey) =>
  REPLY_DAYS[tier] === 0 ? "same business day" : `within ${REPLY_DAYS[tier]} business day${REPLY_DAYS[tier] > 1 ? "s" : ""}`;

export type Tier = {
  key: TierKey;
  n: string;
  for: string;
  line: string;
  /** `{unit}` = the 6–30 unit fee, `{service}` = PORTFOLIO_SERVICE, both in the page currency. */
  items: readonly string[];
  pop?: boolean;
};
export const TIERS: readonly Tier[] = [
  {
    key: "starter",
    n: "Starter",
    for: `Best for 1–${GROWTH_FROM_UNITS - 1} units`,
    line: "One AI system, set up and run for you.",
    items: [
      "One AI Automation system of your choice",
      `${INCLUDED_UNITS} units included, then +{unit} a unit`,
      "Monthly tuning and summary",
      `Support replies ${replyTime("starter")}`,
    ],
  },
  {
    key: "growth",
    n: "Growth",
    for: `Best for ${GROWTH_FROM_UNITS}–${PORTFOLIO_FROM_UNITS - 1} units`,
    line: "Three AI systems working together.",
    pop: true,
    items: [
      "Three AI systems, 10% bundle saving",
      `${INCLUDED_UNITS} units included, then +{unit} a unit`,
      "Add marketing systems anytime",
      `Support replies ${replyTime("growth")}`,
    ],
  },
  {
    key: "portfolio",
    n: "Portfolio",
    for: `Best for ${PORTFOLIO_FROM_UNITS}+ units`,
    line: "Your whole operation, with a dedicated lead.",
    items: [
      "Three or more systems at rate-card prices",
      "Dedicated build lead, +{service} a month",
      "Team training and documentation",
      `Support replies the ${replyTime("portfolio")}`,
    ],
  },
];

/** Savings calculator sliders: [key, label, min, max, default, unit ("" | "%" | "cur")]. "cur" values
 *  are entered in dollars and shown ×FX. */
export type CalcKey = "units" | "msgs" | "turns" | "ota" | "rate" | "nights" | "hourly";
export const CALC_FIELDS: readonly (readonly [key: CalcKey, label: string, min: number, max: number, value: number, unit: "" | "%" | "cur"])[] = [
  ["units","Units you run",1,60,4,""],
  ["msgs","Guest messages per unit, per week",5,60,18,""],
  // Default 6 ≈ 18 booked nights a month at a ~3-night average stay.
  ["turns","Turnovers per unit, per month",1,20,6,""],
  ["ota","Bookings through Airbnb / Booking.com",0,100,85,"%"],
  ["rate","Average nightly rate",40,400,120,"cur"],
  ["nights","Nights booked per unit, per month",5,30,18,""],
  // Default ≈ a US property-management assistant's hourly rate.
  ["hourly","Your time is worth, per hour",10,100,25,"cur"],
];

/** Calculator time model: only work our systems take over. Guest messages and inbox admin count
 *  when a messaging system is recommended (MESSAGING_SYSTEMS); turnover coordination counts when
 *  Guest Messaging & CRM is, because turnover hand-offs are part of its scope. */
export const CALC_TIME = {
  /** Minutes per guest message: read, look up the booking, reply. */
  minutesPerMessage: 4,
  /** Inbox and guest-record admin per unit per month, in hours. */
  adminHoursPerUnit: 3,
  /** Minutes per turnover: tell the cleaner, confirm, send the next guest their arrival details,
   *  chase a clean that isn’t done. */
  minutesPerTurnover: 25,
  /** Share of that time the system takes over. */
  saved: 0.7,
  /** Share of messages answered without you. */
  autoReplies: 0.8,
} as const;

/** Calculator "commission kept": share of platform bookings moved direct, and the net commission
 *  saved on each (Airbnb host-only fee 15.5% / Booking.com ~15%, less ~3–4% card and engine fees).
 *  Counted only when the recommendation includes a direct-booking system (DIRECT_SYSTEMS). */
export const DIRECT_SHARE = 0.15;
export const NET_COMMISSION = 0.12;
export const DIRECT_SYSTEMS: readonly ServiceSlug[] = ["direct-booking-engine", "direct-booking-website"];
/** Systems that take over guest messages and inbox admin in the calculator. */
export const MESSAGING_SYSTEMS: readonly ServiceSlug[] = ["guest-messaging", "ai-guest-assistant"];
/** The system that takes over turnover hand-offs. */
export const TURNOVER_SYSTEM: ServiceSlug = "guest-messaging";

/** Calculator hours for a set of picks: admin hours now, and the hours the picks take over. */
export function calcHours(v: Readonly<Record<CalcKey, number>>, picks: readonly ServiceSlug[]) {
  const msgsPerMonth = v.units * v.msgs * 4.33;
  const inbox = (msgsPerMonth * CALC_TIME.minutesPerMessage) / 60 + v.units * CALC_TIME.adminHoursPerUnit;
  const turnovers = (v.units * v.turns * CALC_TIME.minutesPerTurnover) / 60;
  const messaging = picks.some((p) => MESSAGING_SYSTEMS.includes(p));
  const turnover = picks.includes(TURNOVER_SYSTEM);
  const now = inbox + turnovers;
  const back = Math.round(((messaging ? inbox : 0) + (turnover ? turnovers : 0)) * CALC_TIME.saved);
  const replies = messaging ? Math.round(msgsPerMonth * CALC_TIME.autoReplies) : 0;
  return { now, back, replies };
}

/** Calculator "Start with": the systems that answer each pain, in priority order. */
export const CALC_RECOMMEND: Readonly<Record<"msgs" | "ota" | "nights" | "fallback", readonly ServiceSlug[]>> = {
  msgs: ["guest-messaging", "ai-guest-assistant"], // msgs ≥ 12
  ota: ["direct-booking-engine", "direct-booking-website"], // ota ≥ 60
  nights: ["paid-social"], // nights ≤ 18
  fallback: ["guest-messaging"],
};

/** How many systems to recommend, by portfolio size (matches the tiers: Starter = one system,
 *  Growth = three; from PORTFOLIO_FROM_UNITS the calculator also adds the Portfolio service level). */
export const calcPickCount = (units: number) => (units < GROWTH_FROM_UNITS ? 1 : 3);

/** Calculator picks: the pains that apply, in priority order, cut to calcPickCount(units). */
export function calcPicks(v: Readonly<Record<CalcKey, number>>): ServiceSlug[] {
  const rec = [
    ...(v.msgs >= 12 ? CALC_RECOMMEND.msgs : []),
    ...(v.ota >= 60 ? CALC_RECOMMEND.ota : []),
    ...(v.nights <= 18 ? CALC_RECOMMEND.nights : []),
  ];
  return [...new Set(rec.length ? rec : CALC_RECOMMEND.fallback)].slice(0, calcPickCount(v.units));
}

// ---- Plan links: the builder and the tier cards hand the visitor's plan to /contact --------------

/** What a plan link carries. Prices are never in the URL: /contact quotes them again. */
export type PlanLink = { tier?: TierKey; slugs?: readonly ServiceSlug[]; units?: number; portfolio?: boolean; cur?: Currency };

const TIER_KEYS: readonly TierKey[] = ["starter", "growth", "portfolio"];

/** `/contact?plan=…` (or another path) for a plan: `tier`, or `systems` + `units` (+ `portfolio`), and `cur`. */
export function planHref(path: string, p: PlanLink): string {
  const q = new URLSearchParams();
  if (p.tier) q.set("tier", p.tier);
  if (p.slugs?.length) q.set("systems", p.slugs.join(","));
  if (p.units) q.set("units", String(p.units));
  if (p.portfolio) q.set("portfolio", "1");
  if (p.cur) q.set("cur", p.cur);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

/** Reads a plan link back; unknown values are dropped. */
export function parsePlan(search: string): PlanLink {
  const q = new URLSearchParams(search);
  const tier = q.get("tier");
  const slugs = (q.get("systems") ?? "").split(",").filter((s): s is ServiceSlug => (SERVICE_SLUGS as readonly string[]).includes(s));
  const units = Number(q.get("units"));
  const cur = q.get("cur");
  return {
    tier: TIER_KEYS.includes(tier as TierKey) ? (tier as TierKey) : undefined,
    slugs: slugs.length ? [...new Set(slugs)] : undefined,
    units: Number.isInteger(units) && units >= 1 && units <= 500 ? units : undefined,
    portfolio: q.get("portfolio") === "1" || undefined,
    cur: isCurrency(cur) ? cur : undefined,
  };
}

export const tierName = (t: TierKey) => TIERS.find((x) => x.key === t)!.n;

/** A plan link in words, for /contact and the booking notes. Re-quoted here, never read from the
 *  URL. Null when the link carries no plan. */
export function planSummary(p: PlanLink, cur: Currency): { title: string; detail: string; notes: string } | null {
  const money = (n: number) => formatMoney(n, cur);
  if (p.slugs) {
    const units = p.units ?? INCLUDED_UNITS;
    const q = quote(p.slugs, units, cur, !!p.portfolio);
    const tier = planTier(p.slugs, !!p.portfolio);
    const title = tier ? `${tierName(tier)} plan` : "Custom plan";
    const names = p.slugs.map((s) => getService(s)!.title).join(", ");
    const price = `about ${money(q.monthly)}/month + ${money(q.setup)} setup`;
    const detail = `${names} · ${units} unit${units > 1 ? "s" : ""}${p.portfolio ? " · Portfolio service level" : ""} · ${price}`;
    return { title, detail, notes: `From the plan builder: ${title}. ${detail} (${cur.toUpperCase()}, excl. taxes).` };
  }
  if (p.tier) {
    const from = tierFrom(p.tier, cur);
    const title = `${tierName(p.tier)} plan`;
    const detail = `from ${money(from.monthly)}/month + ${money(from.setup)} setup`;
    return { title, detail, notes: `From the pricing page: interested in the ${title}, ${detail} (${cur.toUpperCase()}, excl. taxes).` };
  }
  return null;
}
