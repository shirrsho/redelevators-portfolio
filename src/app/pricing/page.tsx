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
  ["calendar", "Live in 2–3 weeks", "From first call to a running system."],
];

const PRICING_FAQ: readonly (readonly [string, string])[] = [
  ["Which currency do you invoice in?", "US dollars, UAE dirhams or euros. Switch at the top of this page; you’re invoiced in the one you choose."],
  ["Is ad spend included?", "No. Ad spend goes straight to Meta or Google from your own account. Our fee covers building and managing the campaigns."],
  ["Is there a contract?", "Monthly, with 30 days’ notice. (Placeholder: set your real terms.)"],
  ["Can I start with just one system?", "Yes. Most owners start with guest messaging or direct bookings and add more once it’s paying off."],
  ["Why a setup fee?", "It covers the audit, the design and the build inside your tools. The monthly fee covers running, monitoring and improving it."],
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
          <p className="lead">Start with one system or run the lot. These are starting points; the audit call gives you a fixed quote before any work begins.</p>
          {/* Placeholder flag: keep it until the owner sets real prices (DECISIONS → still open, item 1). */}
          <span
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              fontSize: 13,
              color: "var(--amber)",
              border: "1px dashed rgba(232,163,61,.45)",
              borderRadius: 10,
              padding: "8px 12px",
              marginTop: 22,
            }}
          >
            <Icon name="alert" style={{ width: 16, height: 16 }} className="ico" /> Placeholder prices for review. You set the real ones.
          </span>
          <div style={{ marginTop: 18 }}>
            <CurrencyToggle />
          </div>
        </PageHero>

        <section className="wrap" style={{ paddingBottom: 40 }}>
          <h2 className="sr-only">Plans</h2>
          <PricingTiers />
        </section>

        <section className="wrap section" style={{ paddingTop: 80 }}>
          <SectionHead eyebrow="Build your own" title="Pick the systems you want." note="Tick what you need and see a starting estimate instantly." noteMaxWidth={320} />
          <div className="rv">
            <PlanBuilder />
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Worth it?" title="What would you get back?" note="Move the sliders to match your business." noteMaxWidth={320} />
          <div className="rv">
            <SavingsCalculator />
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
