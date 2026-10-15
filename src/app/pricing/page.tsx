// Track A · /pricing (mockup: redesign-mockups/r3/pricing.html). New route.
import type { Metadata } from "next";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { PlanBuilder } from "@/components/interactive/PlanBuilder";
import { PricingTiers } from "@/components/interactive/PricingTiers";
import { SavingsCalculator } from "@/components/interactive/SavingsCalculator";
import { Eyebrow } from "@/components/ui/Chip";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { FAQ } from "@/components/ui/FAQ";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";
import {
  FOUNDING,
  GUARANTEE_DAYS,
  GUARANTEE_DAYS_LONG,
  INCLUDED_UNITS,
  PORTFOLIO_FROM_UNITS,
  PORTFOLIO_SERVICE,
  RATES,
  UNIT_FEES,
  formatMoney,
  replyTime,
  type Money,
} from "@/lib/pricing";

/** "$1,000 (AED 3,500, €900)": a rate-card amount in all three currencies, for static copy. */
const all3 = (m: Money) => `${formatMoney(m.usd, "usd")} (${formatMoney(m.aed, "aed")}, ${formatMoney(m.eur, "eur")})`;

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Clear prices, no surprises. Start with one system or run the lot; the free audit call gives you a fixed quote before any work begins. US dollars, UAE dirhams or euros.",
  path: "/pricing",
});

/** "Always included" cards: [icon, title, text]. */
const INCLUDED: readonly (readonly [IconName, string, string])[] = [
  ["lock", "You own everything", "Built in your accounts. Leave anytime, keep it all."],
  ["bolt", "No new software", "We work inside the tools you already use."],
  ["run", "We run it after launch", "Monitoring, fixes and a monthly summary."],
  ["calendar", `Live in ${GUARANTEE_DAYS} days, guaranteed`, `Or your first month is free (${GUARANTEE_DAYS_LONG} days for websites and full-funnel campaigns). The clock only pauses while we wait on you.`],
];

const PRICING_FAQ: readonly (readonly [string, string])[] = [
  ["Which currency do you invoice in?", "US dollars, UAE dirhams or euros. Switch at the top of this page; you’re invoiced in the one you choose, and it stays fixed."],
  ["Do prices include tax?", "No. Prices exclude applicable taxes. We invoice from outside the UAE and EU, so VAT-registered businesses there account for VAT under the reverse charge."],
  ["Do you charge per property?", `A plan covers up to ${INCLUDED_UNITS} units. Above that, plans with an AI Automation system add ${all3(UNIT_FEES.upTo30)} a unit each month up to 30 units, then ${all3(UNIT_FEES.above30)}. Marketing systems are flat.`],
  ["Is ad spend included?", `No. Ad spend goes straight to Meta or Google from your own account. Our fee covers building and managing the campaigns. We ask for at least ${all3(RATES["paid-social"].adMin!)} a month so campaigns can learn.`],
  ["Is there a contract?", "No lock-in. Monthly fees run month to month with 30 days’ notice. Ads are the one exception: they run for 3 months minimum, because campaigns need that long to learn."],
  ["How does the launch guarantee work?", `If your system isn’t live within ${GUARANTEE_DAYS} days of kickoff, your first month is free. Kickoff is when the setup deposit, access and onboarding answers are in. If we’re waiting on you or a platform review, the clock pauses, and we tell you in writing. Websites and full-funnel campaigns get ${GUARANTEE_DAYS_LONG} days.`],
  ["How do I pay?", "Half the setup fee when you sign, half at launch. The monthly fee starts on launch day, invoiced in advance."],
  ["Why a setup fee?", "It covers the audit, the design and the build inside your tools. That’s why the monthly fee needs no lock-in: it covers running, monitoring and improving the system."],
  ["Can I start with just one system?", "Yes. Most owners start with guest messaging or direct bookings and add more once it’s paying off. Three or more systems get a 10% bundle saving, five or more 15%. Marketing systems count toward it too."],
  [
    "What does Portfolio add?",
    `A dedicated build lead, training and documentation for your team, and support replies the ${replyTime("portfolio")}, for ${all3(PORTFOLIO_SERVICE)} a month on top of the systems you choose. It’s built for ${PORTFOLIO_FROM_UNITS}+ units, but it’s optional at any size: nothing jumps in price as you grow. Starter replies ${replyTime("starter")}, Growth ${replyTime("growth")}.`,
  ],
];

export default function PricingPage() {
  return (
    <>
      <PageBg tone="day" />
      <JsonLd data={breadcrumbLd([{ name: "Pricing", path: "/pricing" }])} />
      <main id="main" className="page">
        <PageHero variant="short">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="d1" style={{ marginTop: 22 }}>
            Clear prices.
            <br />
            No surprises.
          </h1>
          <p className="lead">Start with one system or run the lot. Every price here is a plan you can buy, and the audit call fixes yours in writing before any work begins.</p>
          {FOUNDING.open ? (
            <span
              style={{
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
                fontSize: 13,
                color: "var(--green)",
                border: "1px solid rgba(143,212,176,.4)",
                borderRadius: 10,
                padding: "8px 12px",
                marginTop: 22,
              }}
            >
              <Icon name="check" style={{ width: 16, height: 16 }} className="ico" /> Founding clients: {FOUNDING.setupOff * 100}% off setup for our first {FOUNDING.clients}, in
              return for a case study.
            </span>
          ) : null}
          <div style={{ marginTop: 18 }}>
            <CurrencyToggle />
          </div>
        </PageHero>

        <section className="wrap" style={{ paddingBottom: 40 }}>
          <h2 className="sr-only">Plans</h2>
          <PricingTiers />
          <p className="mono" style={{ marginTop: 18 }}>
            Prices exclude applicable taxes. Ad spend and your own software subscriptions are paid directly. Live in {GUARANTEE_DAYS} days ({GUARANTEE_DAYS_LONG} for
            websites and full-funnel campaigns) or your first month is free.
          </p>
        </section>

        <section className="wrap section" style={{ paddingTop: 80 }}>
          <SectionHead eyebrow="Build your own" title="Pick the systems you want." note="Tick what you need and see exactly how the price adds up." noteMaxWidth={320} />
          <div className="rv">
            <PlanBuilder />
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Worth it?" title="What would you get back?" note="Move the sliders to match your business." noteMaxWidth={320} />
          <div className="rv">
            <SavingsCalculator currencyToggle={false} />
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Always included" title="Whatever you choose." />
          <div className="gets">
            {INCLUDED.map(([icon, title, text], i) => (
              <div key={title} className={`rv d${i + 1}x`}>
                <div className="ico-tile">
                  <Icon name={icon} />
                </div>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="About pricing." />
          <FAQ className="rv" items={PRICING_FAQ} />
        </section>

        <CTABand title="Get your fixed quote." sub="A free 30-minute call. We’ll scope it with you and send a price in writing." />
      </main>
    </>
  );
}
