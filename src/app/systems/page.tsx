// SKELETON (Stage 1). Owned by Track B: build per docs/redesign/ROUTES-AND-CONTENT.md → /systems
// (mockup: redesign-mockups/r3/systems.html).
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { Journey } from "@/components/interactive/Journey";
import { SystemPlayer } from "@/components/interactive/SystemPlayer";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Chip";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  title: "Systems",
  description:
    "Every system, end to end. Eight systems run quietly behind your rentals. Pick one and watch it work, step by step, inside the tools you already use.",
  path: "/systems",
});

export default function SystemsPage() {
  return (
    <>
      <PageBg tone="day" />
      <JsonLd data={breadcrumbLd([{ name: "Systems", path: "/systems" }])} />
      <main id="main" className="page">
        <PageHero visual={<StubBox name="ControlRoom" track="B" minHeight={520} style={{ width: "100%", maxWidth: 560 }} />}>
          <Eyebrow>Systems</Eyebrow>
          <h1 className="d1" style={{ marginTop: 22 }}>
            Every system,
            <br />
            end to end.
          </h1>
          <p className="lead">Eight systems run quietly behind your rentals. Pick one and watch it work, step by step, inside the tools you already use.</p>
          <div className="ctas">
            <Button href="/contact" arrow event={EVENTS.bookCall} location="hero">
              Book a free 30-min call
            </Button>
            <Button href="#player" variant="quiet">
              Watch one run ↓
            </Button>
          </div>
        </PageHero>

        <section className="wrap" id="player" style={{ paddingBottom: 110, scrollMarginTop: 80 }}>
          <SectionHead
            eyebrow="Watch one run"
            gap={14}
            title={
              <>
                Pick a system.
                <br />
                See exactly what happens.
              </>
            }
            note="Left: what your guest (or you) sees. Right: what the system does, step by step. Every one has the same four parts."
            noteMaxWidth={320}
          />
          <SystemPlayer tabs hash />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="All of it together" title="One booking, start to finish." note="Top: what your guest sees. Bottom: what the system does. Swipe or use the arrows." />
          <div className="rv">
            <Journey />
          </div>
          <p className="mono" style={{ marginTop: 12 }}>
            Illustrative example
          </p>
        </section>

        <CTABand title="Which of these would you switch on first?" sub="Bring your current setup to the call. We’ll show you the system that pays off fastest." />
      </main>
    </>
  );
}
