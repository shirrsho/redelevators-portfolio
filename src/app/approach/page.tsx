// SKELETON (Stage 1). Owned by Track A: build per docs/redesign/ROUTES-AND-CONTENT.md → /approach
// (mockup: redesign-mockups/r3/approach.html).
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { Calendar3Week } from "@/components/interactive/Calendar3Week";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Chip";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  title: "Approach",
  description:
    "Live in three weeks, then we run it. Four steps and about two hours of your time in total. You approve everything that matters.",
  path: "/approach",
});

export default function ApproachPage() {
  return (
    <>
      <PageBg tone="day" />
      <JsonLd data={breadcrumbLd([{ name: "Approach", path: "/approach" }])} />
      <main id="main" className="page">
        <PageHero
          visualStyle={{ minHeight: "auto" }}
          visual={
            <div style={{ width: "100%" }}>
              <Calendar3Week pickScroll />
            </div>
          }
        >
          <Eyebrow>Approach</Eyebrow>
          <h1 className="d1" style={{ marginTop: 22 }}>
            Live in three weeks.
            <br />
            Then we run it.
          </h1>
          <p className="lead">Four steps. About two hours of your time in total. You approve everything that matters.</p>
          <div className="ctas">
            <Button href="/contact" arrow event={EVENTS.bookCall} location="hero">
              Start with the audit call
            </Button>
          </div>
        </PageHero>

        <section className="wrap" id="phases">
          <StubBox name="Phase rows ×4 (#ph-audit, #ph-design, #ph-build, #ph-run)" track="A" minHeight={360} />
        </section>

        <section className="wrap section">
          <SectionHead eyebrow="After launch" title="Every month, we keep it sharp." />
          <StubBox name="After-launch cards" track="A" minHeight={180} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="Before you book." />
          <StubBox name="FAQ" track="A" minHeight={200} />
        </section>

        <CTABand title="Step one is a 30-minute call." sub="We’ll map your setup and tell you what to fix first. No commitment." />
      </main>
    </>
  );
}
