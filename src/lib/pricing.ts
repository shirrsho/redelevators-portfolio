import { SERVICE_SLUGS, type ServiceSlug } from "./services";

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
/** Portfolio (31+ units): the monthly minimum, which covers a dedicated build lead, agreed
 *  response times and team training. Above it, the rate card applies. */
export const PORTFOLIO_FROM_UNITS = 31;
export const PORTFOLIO_MIN: Money = { usd: 2500, aed: 9000, eur: 2250 };

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
  /** True when the Portfolio minimum set the monthly price. */
  portfolioMin: boolean;
  /** Highest minimum ad spend among the systems, or 0. */
  adMin: number;
  /** Setup after the founding-client discount. */
  foundingSetup: number;
};

/** Quote formula (Pricing Playbook → Pricing rules 1–4). */
export function quote(slugs: readonly ServiceSlug[], units: number, cur: Currency): Quote {
  const rates = slugs.map((s) => RATES[s]);
  const discount = bundleDiscount(rates.length);
  const extra = rates.some((r) => r.perUnit) ? unitFee(units, cur) : 0;
  const rawMonthly = rates.reduce((a, r) => a + r.monthly[cur], 0) + extra;
  const rawSetup = rates.reduce((a, r) => a + r.setup[cur], 0);
  let monthly = discount ? roundMonthly(rawMonthly * (1 - discount), cur) : rawMonthly;
  const setup = discount ? roundSetup(rawSetup * (1 - discount)) : rawSetup;
  const portfolioMin = rates.length > 0 && units >= PORTFOLIO_FROM_UNITS && monthly < PORTFOLIO_MIN[cur];
  if (portfolioMin) monthly = PORTFOLIO_MIN[cur];
  return {
    setup,
    monthly,
    discount,
    units: extra,
    portfolioMin,
    adMin: Math.max(0, ...rates.map((r) => r.adMin?.[cur] ?? 0)),
    foundingSetup: roundSetup(setup * (1 - FOUNDING.setupOff)),
  };
}

/** Every combination of k items. */
function combos<T>(items: readonly T[], k: number): T[][] {
  if (k === 0) return [[]];
  return items.flatMap((x, i) => combos(items.slice(i + 1), k - 1).map((c) => [x, ...c]));
}

const AUTOMATION = SERVICE_SLUGS.filter((s) => RATES[s].perUnit);

export type TierKey = "starter" | "growth" | "portfolio";

/** A tier's "from" prices: the lowest monthly and the lowest setup the tier allows, each a true
 *  minimum over its allowed plans (at INCLUDED_UNITS). Portfolio shows its monthly minimum only. */
export function tierFrom(tier: TierKey, cur: Currency): { monthly: number; setup: number | null } {
  if (tier === "portfolio") return { monthly: PORTFOLIO_MIN[cur], setup: null };
  const plans = tier === "starter" ? AUTOMATION.map((s) => [s]) : combos(SERVICE_SLUGS, 3);
  const qs = plans.map((p) => quote(p, INCLUDED_UNITS, cur));
  return { monthly: Math.min(...qs.map((q) => q.monthly)), setup: Math.min(...qs.map((q) => q.setup)) };
}

export type Tier = {
  key: TierKey;
  n: string;
  for: string;
  line: string;
  items: readonly string[];
  pop?: boolean;
};
export const TIERS: readonly Tier[] = [
  {
    key: "starter",
    n: "Starter",
    for: "1–5 units",
    line: "One AI system, set up and run for you.",
    items: ["One AI Automation system of your choice", "Built inside your own tools", "Monthly tuning and summary", "Email and WhatsApp support"],
  },
  {
    key: "growth",
    n: "Growth",
    for: "5–30 units",
    line: "Three systems working together.",
    pop: true,
    items: ["Any three systems, 10% bundle saving", "Mix automation and marketing", "+{unit} a month per unit above five", "Priority support"],
  },
  {
    key: "portfolio",
    n: "Portfolio",
    for: "30+ units",
    line: "Everything, for larger operators.",
    items: ["Any of the eight systems", "A dedicated build lead", "Team training and documentation", "Agreed response times"],
  },
];

/** Savings calculator sliders: [key, label, min, max, default, unit ("" | "%" | "cur")]. "cur" values
 *  are entered in dollars and shown ×FX. */
export type CalcKey = "units" | "msgs" | "ota" | "rate" | "nights" | "hourly";
export const CALC_FIELDS: readonly (readonly [key: CalcKey, label: string, min: number, max: number, value: number, unit: "" | "%" | "cur"])[] = [
  ["units","Units you run",1,60,4,""],
  ["msgs","Guest messages per unit, per week",5,60,18,""],
  ["ota","Bookings through Airbnb / Booking.com",0,100,85,"%"],
  ["rate","Average nightly rate",40,400,120,"cur"],
  ["nights","Nights booked per unit, per month",5,30,18,""],
  // Default ≈ a US property-management assistant's hourly rate.
  ["hourly","Your time is worth, per hour",10,100,25,"cur"],
];

/** Calculator time model: only work our systems take over (guest messages + inbox admin). */
export const CALC_TIME = {
  /** Minutes per guest message: read, look up the booking, reply. */
  minutesPerMessage: 4,
  /** Inbox and guest-record admin per unit per month, in hours. */
  adminHoursPerUnit: 3,
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

/** Calculator "Start with": the systems that answer each pain, in priority order. */
export const CALC_RECOMMEND: Readonly<Record<"msgs" | "ota" | "nights" | "fallback", readonly ServiceSlug[]>> = {
  msgs: ["guest-messaging", "ai-guest-assistant"], // msgs ≥ 12
  ota: ["direct-booking-engine", "direct-booking-website"], // ota ≥ 60
  nights: ["paid-social"], // nights ≤ 18
  fallback: ["guest-messaging"],
};

/** How many systems to recommend, by portfolio size (matches the tiers: Starter = one system,
 *  Growth = three; 31+ units are quoted as Portfolio by quote()). */
export const calcPickCount = (units: number) => (units <= INCLUDED_UNITS ? 1 : 3);

/** Calculator picks: the pains that apply, in priority order, cut to calcPickCount(units). */
export function calcPicks(v: Readonly<Record<CalcKey, number>>): ServiceSlug[] {
  const rec = [
    ...(v.msgs >= 12 ? CALC_RECOMMEND.msgs : []),
    ...(v.ota >= 60 ? CALC_RECOMMEND.ota : []),
    ...(v.nights <= 18 ? CALC_RECOMMEND.nights : []),
  ];
  return [...new Set(rec.length ? rec : CALC_RECOMMEND.fallback)].slice(0, calcPickCount(v.units));
}
