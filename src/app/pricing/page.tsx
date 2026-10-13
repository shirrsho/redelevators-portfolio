// SKELETON (Stage 1). Owned by Track A: build per docs/redesign/ROUTES-AND-CONTENT.md → /pricing
// (mockup: redesign-mockups/r3/pricing.html). New route.
import type { Metadata } from "next";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { PricingTiers } from "@/components/interactive/PricingTiers";
import { SavingsCalculator } from "@/components/interactive/SavingsCalculator";
import { Eyebrow } from "@/components/ui/Chip";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Clear prices, no surprises. Start with one system or run the lot; the free audit call gives you a fixed quote before any work begins. US dollars, UAE dirhams or euros.",
  path: "/pricing",
});

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
          <PricingTiers />
        </section>

        <section className="wrap section" style={{ paddingTop: 80 }}>
          <SectionHead eyebrow="Build your own" title="Pick the systems you want." note="Tick what you need and see a starting estimate instantly." noteMaxWidth={320} />
          <StubBox name="PlanBuilder" track="A" minHeight={360} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Worth it?" title="What would you get back?" note="Move the sliders to match your business." noteMaxWidth={320} />
          <div className="rv">
            <SavingsCalculator />
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Always included" title="Whatever you choose." />
          <StubBox name="Included cards" track="A" minHeight={180} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="About pricing." />
          <StubBox name="FAQ (incl. AED billing)" track="A" minHeight={200} />
        </section>

        <CTABand title="Get your fixed quote." sub="A free 30-minute call. We’ll scope it with you and send a price in writing." />
      </main>
    </>
  );
}
