import type { ServiceSlug } from "./services";

// Currencies, placeholder prices, tiers, plan builder and calculator inputs.
// Ported unchanged from redesign-mockups/r3/site.js (FX, PRICE, TIERS, mountBuilder, mountCalc).
// PRICES ARE PLACEHOLDERS: the owner sets real ones (DECISIONS → still open, item 1). The UI
// must keep showing the placeholder flag.

export const CURRENCIES = ["usd", "aed", "eur"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const DEFAULT_CURRENCY: Currency = "usd";
export const isCurrency = (v: unknown): v is Currency => CURRENCIES.includes(v as Currency);

/** Toggle labels, in order. */
export const CURRENCY_LABEL: Record<Currency, string> = { usd: "$ USD", aed: "AED", eur: "€ EUR" };
export const CURRENCY_SYMBOL: Record<Currency, string> = { usd: "$", aed: "AED ", eur: "€" };

/** Display-only factors for values entered in dollars (calculator rate, builder). Prices below are set per currency. */
export const FX: Record<Currency, number> = {"usd":1,"aed":3.67,"eur":0.92};

/** "$1,234", "AED 1,234", "€1,234". */
export const formatMoney = (n: number, cur: Currency) => CURRENCY_SYMBOL[cur] + Math.round(n).toLocaleString("en-US");

/** Placeholder prices, rounded per currency (not a live exchange rate). s = setup, m = monthly, per tier index. */
export const PRICE: Record<Currency, { s: readonly [number, number]; m: readonly [number, number] }> = {
  "usd": {"s":[990,2600],"m":[160,490]},
  "aed": {"s":[3600,9500],"m":[590,1800]},
  "eur": {"s":[900,2400],"m":[150,450]},
};

export type Tier = {
  n: string;
  for: string;
  line: string;
  /** Index into PRICE[cur].s / .m; null = "Custom". */
  i: number | null;
  items: readonly string[];
  pop?: boolean;
};
export const TIERS: readonly Tier[] = [
  {"n":"Starter","for":"1–5 units","line":"One system, set up and run for you.","i":0,"items":["One system of your choice","Built inside your own tools","Monthly tuning and summary","Email and WhatsApp support"]},
  {"n":"Growth","for":"5–30 units","line":"Automation and marketing working together.","i":1,"pop":true,"items":["Up to three systems","Paid social managed (ad spend separate)","Direct booking site or engine","Priority support"]},
  {"n":"Portfolio","for":"30+ units","line":"Everything, for larger operators.","i":null,"items":["Any of the eight systems","A dedicated build lead","Team training and documentation","Agreed response times"]},
];

/** Plan builder: base USD setup and monthly per service (SERVICES order), ×FX, 15% off from 3 systems. */
export const BUILDER = {
  setup: [990,770,880,660,770,660,1320,990],
  monthly: [160,130,110,100,220,110,70,200],
  bundleFrom: 3,
  bundleFactor: 0.85,
} as const;

/** Savings calculator sliders: [key, label, min, max, default, unit ("" | "%" | "cur")]. */
export type CalcKey = "units" | "msgs" | "turn" | "ota" | "rate" | "nights";
export const CALC_FIELDS: readonly (readonly [key: CalcKey, label: string, min: number, max: number, value: number, unit: "" | "%" | "cur"])[] = [
  ["units","Units you run",1,60,4,""],
  ["msgs","Guest messages per unit, per week",5,60,18,""],
  ["turn","Turnovers per unit, per month",1,15,6,""],
  ["ota","Bookings through Airbnb / Booking.com",0,100,85,"%"],
  ["rate","Average nightly rate",40,400,120,"cur"],
  ["nights","Nights booked per unit, per month",5,30,18,""],
];

/** Calculator "Start with" picks: the services it may recommend, by rule (see site.js → mountCalc). */
export const CALC_RECOMMEND: Readonly<Record<"msgs" | "ota" | "nights" | "fallback", readonly ServiceSlug[]>> = {
  msgs: ["guest-messaging", "ai-guest-assistant"], // msgs ≥ 12
  ota: ["direct-booking-engine", "direct-booking-website"], // ota ≥ 60
  nights: ["paid-social"], // nights ≤ 18
  fallback: ["guest-messaging"],
};
