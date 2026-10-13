// SKELETON (Stage 1). Owned by Track A: build per docs/redesign/ROUTES-AND-CONTENT.md → /privacy
// (mockup: redesign-mockups/r3/privacy.html). New route. The copy must match the real tracking
// setup before launch (docs/redesign/DECISIONS.md → still open, items 2 and 3).
import type { Metadata } from "next";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { Eyebrow } from "@/components/ui/Chip";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Your data, in plain English: what Red Elevators collects, why, who sees it and how to get it deleted.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageBg tone="night" />
      <JsonLd data={breadcrumbLd([{ name: "Privacy", path: "/privacy" }])} />
      <main id="main" className="page">
        <section className="wrap phero short">
          <div className="rv">
            <Eyebrow>Privacy</Eyebrow>
            <h1 className="d1" style={{ marginTop: 20 }}>
              Your data, in plain English.
            </h1>
            <p className="lead">What we collect, why, who sees it and how to get it deleted. Last updated October 14, 2026.</p>
          </div>
          <StubBox name="Draft note + 4 summary cards" track="A" minHeight={160} />
        </section>
        <section className="light legal" data-night style={{ padding: "80px 0" }}>
          <div className="wrap">
            <StubBox name="Reading section · sticky TOC" track="A" minHeight={480} />
          </div>
        </section>
      </main>
    </>
  );
}
