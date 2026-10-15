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
| `INCLUDED_UNITS`, `UNIT_FEES`, `unitFee()` | 5 units included; then +$15 / unit (units 6–30) and +$10 / unit (31+), charged once per plan that has an AI Automation system | builder, calculator, tier cards |
| `bundleDiscount()` | 10% for 3–4 systems, 15% for 5 or more, on setup and monthly. Marketing systems count | builder, tiers, calculator |
| `GROWTH_FROM_UNITS`, `PORTFOLIO_FROM_UNITS` | 10 and 31: where Growth and Portfolio are the best fit. **Guidance only**: any plan works at any size, so no price jumps at a boundary | tier cards, calculator |
| `PORTFOLIO_SERVICE` | Portfolio service level: +$500 / AED 1,850 / €450 a month on top of the rate card, never discounted. Opt-in in the builder; the calculator adds it from 31 units | builder, tier cards, calculator, FAQ |
| `REPLY_DAYS`, `replyTime()` | Support reply times: Starter 2 business days, Growth 1, Portfolio same business day | tier cards, builder, FAQ |
| `quote()` | The quote formula: sum, unit fees, bundle saving, rounding (monthly to 10, EUR under 300 ends in 9; setup to 50), service level, founding setup. Also returns the pre-saving totals for the builder's breakdown | builder, calculator, /contact |
| `tierPlan()`, `tierFrom()` | Each tier's "from" plan: its **cheapest real plan** (lowest monthly, then lowest setup), so a card's monthly and setup always belong to one plan. Starter = 1 AI Automation system at 5 units; Growth = 3 at 5 units; Portfolio = 3 at 31 units + service level | `PricingTiers`, builder "Customize this plan" |
| `planTier()` | Which tier a builder plan matches: 1 AI system = Starter, 3+ = Growth, service level = Portfolio, anything else = "Custom plan". Marketing systems are add-ons | builder label, /contact |
| `planHref()`, `parsePlan()`, `planSummary()` | Plan links: `?tier=` (tier cards) or `?systems=&units=&portfolio=` (builder), plus `cur`. /contact shows the plan above the booker and prefills Cal.com's "Additional notes". Prices are re-quoted, never read from the URL | tier cards, builder, `BookingStage`, `CalBooker` |
| `FOUNDING` | 50% off setup for the first 5 clients. **Set `open: false` the day client 5 signs.** | `/pricing` hero, builder, service pages |
| `GUARANTEE_DAYS` | 21-day launch guarantee | `/pricing`, builder, service pages, home promises (`home.ts`), story (`story.ts`) |
| `CALC_TIME` | Calculator time model, counting only work our systems take over: 4 min per guest message + 3 h inbox admin per unit per month, 70% saved, 80% of replies automated | `SavingsCalculator` |
| `calcPicks()`, `calcPickCount()` | Recommends 1 system for 1–9 units, 3 for 10+; from 31 units the plan includes the Portfolio service level | `SavingsCalculator` |
| `DIRECT_SHARE`, `NET_COMMISSION`, `DIRECT_SYSTEMS` | 15% of platform bookings move direct, 12% net commission saved on each; counted only when a direct-booking system is recommended | `SavingsCalculator` |
| `FX` | Display factor only, for the calculator's nightly-rate slider (EUR 0.89 = ECB 14 Oct 2026). **Prices are not converted.** | `SavingsCalculator` |

## Current "from" prices (computed)

Each row is one real plan (monthly + setup).

| Tier | Plan | USD | AED | EUR |
|---|---|---|---|---|
| Starter | Listing & Content Engine, 5 units | $190 / mo + $600 setup | AED 690 + 2,200 | €169 + 550 |
| Growth | Guest Messaging + Direct Booking Engine + Listing & Content, 5 units | $510 / mo + $2,150 setup | AED 1,860 + 7,900 | €460 + 1,950 |
| Portfolio | Same three, 31 units, + service level | $1,360 / mo + $2,150 setup | AED 4,980 + 7,900 | €1,230 + 1,950 |

Changed 15 Oct 2026. Before, Growth showed "from $430 + setup from $1,600", two minimums taken
from different plans that nobody could buy together. Portfolio had a $2,500 monthly minimum that
made a 30 → 31 unit client jump from $565 to $2,500 a month. Growth is now three AI Automation
systems (marketing is an add-on), and Portfolio is the rate card plus the service level, so
adding a unit never adds more than its unit fee.

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
