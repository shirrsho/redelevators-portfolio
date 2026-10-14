# Pricing

The owner set the prices on 14 Oct 2026. The full agency version is the **Red Elevators Pricing
Playbook**: https://claude.ai/code/artifact/fd43f83e-f3ae-49e0-a908-2c6a8a726a7e. It covers the
market analysis, terms, offers, cost floors and how to quote. This file covers only what the site
needs.

## Source of truth in code

`src/lib/pricing.ts`. Every price on the site is computed there from `RATES`, so a price is never
typed twice.

| Constant / function | What it is | Shown in |
|---|---|---|
| `RATES` | Setup + monthly per service, set separately in USD / AED / EUR; `adMin` = minimum ad spend | builder, tiers, calculator, each service page's "What it costs" (`ServicePrice`) and its `Offer` JSON-LD (USD) |
| `INCLUDED_UNITS`, `UNIT_FEES`, `unitFee()` | 5 units included; then +$15 / unit (units 6–30) and +$10 / unit (31+), charged once per plan that has an AI Automation system | builder, calculator, Growth card |
| `bundleDiscount()` | 10% for 3–4 systems, 15% for 5 or more, on setup and monthly | builder, tiers, calculator |
| `PORTFOLIO_MIN`, `PORTFOLIO_FROM_UNITS` | $2,500 / AED 9,000 / €2,250 monthly minimum from 31 units | Portfolio card, builder |
| `quote()` | The quote formula: sum, unit fees, bundle saving, rounding (monthly to 10, EUR under 300 ends in 9; setup to 50), Portfolio minimum, founding setup | builder, calculator |
| `tierFrom()` | A tier's "from" figures: the true minimum monthly and setup the tier allows | `PricingTiers` |
| `FOUNDING` | 50% off setup for the first 5 clients. **Set `open: false` the day client 5 signs.** | `/pricing` hero, builder, service pages |
| `GUARANTEE_DAYS` | 21-day launch guarantee | `/pricing`, builder, service pages, home promises (`home.ts`), story (`story.ts`) |
| `CALC_TIME` | Calculator time model, counting only work our systems take over: 4 min per guest message + 3 h inbox admin per unit per month, 70% saved, 80% of replies automated | `SavingsCalculator` |
| `calcPicks()`, `calcPickCount()` | Recommends 1 system for 1–5 units, 3 for 6+ (31+ is priced as Portfolio by `quote()`) | `SavingsCalculator` |
| `DIRECT_SHARE`, `NET_COMMISSION`, `DIRECT_SYSTEMS` | 15% of platform bookings move direct, 12% net commission saved on each; counted only when a direct-booking system is recommended | `SavingsCalculator` |
| `FX` | Display factor only, for the calculator's nightly-rate slider (EUR 0.89 = ECB 14 Oct 2026). **Prices are not converted.** | `SavingsCalculator` |

## Current "from" prices (computed)

| Tier | USD | AED | EUR |
|---|---|---|---|
| Starter | $190 / mo + setup from $600 | AED 690 + 2,200 | €169 + 550 |
| Growth | $430 / mo + setup from $1,600 | AED 1,570 + 5,950 | €380 + 1,450 |
| Portfolio | from $2,500 / mo | AED 9,000 | €2,250 |

## Changing a price

1. Change `RATES` (or the constant) in `src/lib/pricing.ts`, in all three currencies.
2. Update the Pricing Playbook's rate card so sales and the site agree.
3. **Copy with prices typed into it.** `/pricing`'s FAQ reads its numbers from `pricing.ts`, so
   it updates itself. One answer does not: the Paid Social FAQ "What budget do I need?" in
   `src/lib/services.ts` has the minimum ad spend typed in. Update it by hand, because
   `services.ts` can't import `pricing.ts`.

## Savings calculator

The calculator counts only work our systems take over:

- **Hours back** = 70% × (guest messages × 4 min + 3 h inbox admin per unit), per month.
- **Worth to you** = hours back × the visitor's hourly value + commission kept.
- **The verdict** compares "worth" with the recommended plan's monthly fee:
  - 1.15× or more: "Pays for itself about N×", plus setup payback in months.
  - 0.9–1.15×: "Roughly pays for itself".
  - Below 0.9×: "Covers about N% of the monthly fee".

The full method, assumptions and examples are in the Pricing Playbook, section "Savings
calculator".

**Open:** turnover hours are not counted, because no service includes turnover coordination in its
scope yet. If it is added to Guest Messaging & CRM, bring back a turnovers input and count it in
`CALC_TIME`.
