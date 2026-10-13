// SKELETON (Stage 1). Owned by Track A: build per docs/redesign/ROUTES-AND-CONTENT.md → /services
// (mockup: redesign-mockups/r3/services.html).
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { servicesIn } from "@/lib/services";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Tag } from "@/components/ui/Chip";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Eight systems for short-term rentals, in two pillars. AI Automation runs your operation. Marketing fills your calendar. Start with one, or let them work together.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageBg tone="day" />
      <JsonLd data={breadcrumbLd([{ name: "Services", path: "/services" }])} />
      <main id="main" className="page">
        <PageHero visual={<StubBox name="ServicesDuo" track="A" minHeight={480} style={{ width: "100%" }} />}>
          <Eyebrow>Services</Eyebrow>
          <h1 className="d1" style={{ marginTop: 22 }}>
            Eight systems.
            <br />
            Two pillars.
          </h1>
          <p className="lead">AI Automation runs your operation. Marketing fills your calendar. Start with one, or let them work together.</p>
          <div className="ctas">
            <Button href="/contact" arrow event={EVENTS.bookCall} location="hero">
              Book a free 30-min call
            </Button>
            <Button href="#p1" variant="quiet">
              Browse the eight
            </Button>
          </div>
        </PageHero>

        {(["auto", "mkt"] as const).map((p, i) => (
          <section key={p} className="wrap section" id={`p${i + 1}`} style={{ paddingTop: i ? 20 : 60 }}>
            <div className="pillar-head rv">
              <span className="num">0{i + 1}</span>
              <div>
                <Tag pillar={p} />
                <h2 className="d2" style={{ marginTop: 12 }}>
                  {p === "auto" ? "The busy work, gone." : "Calendars that fill."}
                </h2>
              </div>
              <span className="mono">4 systems</span>
            </div>
            {servicesIn(p).map((s) => (
              <StubBox key={s.slug} name={`ServiceRow ${s.slug}`} track="A" minHeight={120} style={{ marginBottom: 12 }} />
            ))}
          </section>
        ))}

        <section className="wrap section" style={{ paddingTop: 40 }}>
          <SectionHead
            eyebrow="Better together"
            title="One guest, both pillars."
            note="Marketing brings the guest in. Automation looks after them. They come back direct."
            noteMaxWidth={320}
          />
          <StubBox name="Loop diagram" track="A" minHeight={220} />
        </section>

        <CTABand
          title="Not sure where to start?"
          sub="Most owners start with guest messaging or direct bookings. On the call we’ll tell you which one pays off first for you."
        />
      </main>
    </>
  );
}
