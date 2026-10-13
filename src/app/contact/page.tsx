// SKELETON (Stage 1). Owned by Track C: build per docs/redesign/ROUTES-AND-CONTENT.md → /contact
// (mockup: redesign-mockups/r3/contact.html). WhatsApp appears on this page only, as a wa.me
// button (src/lib/site.ts → whatsappUrl); never print the number.
import type { Metadata } from "next";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { SectionHead } from "@/components/layout/Section";
import { BookingStage } from "@/components/interactive/BookingStage";
import { Eyebrow } from "@/components/ui/Chip";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  title: "Book a call",
  description:
    "Book a free 30-minute call. We map your setup and show you what to automate first. No pitch deck, no commitment, and you keep the written summary.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageBg tone="night" />
      <JsonLd data={breadcrumbLd([{ name: "Contact", path: "/contact" }])} />
      <main id="main" className="page">
        <section className="wrap" style={{ padding: "120px 0 40px", textAlign: "center" }}>
          <div className="rv">
            <Eyebrow center>Contact</Eyebrow>
            <h1 className="d1" style={{ marginTop: 20 }}>
              Book a free 30-minute call.
            </h1>
            <p className="lead" style={{ margin: "20px auto 0", maxWidth: 560 }}>
              We map your setup and show you what to automate first. No pitch deck, no commitment, and you keep the written summary.
            </p>
          </div>
          <StubBox name="Step cards ×3" track="C" minHeight={110} style={{ maxWidth: 900, margin: "40px auto 0" }} />
        </section>

        <section className="wrap" data-night>
          <BookingStage variant="contact" />
        </section>

        <section className="wrap section" id="chat" style={{ paddingTop: 90 }}>
          <SectionHead eyebrow="Not ready to book?" title="Ask us anything first." />
          <StubBox name="WhatsApp + email cards" track="C" minHeight={120} />
        </section>

        <section className="wrap section" style={{ paddingTop: 40 }}>
          <StubBox name="What you take away · summary doc" track="C" minHeight={360} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="About the call." />
          <StubBox name="FAQ" track="C" minHeight={200} />
        </section>
      </main>
    </>
  );
}
