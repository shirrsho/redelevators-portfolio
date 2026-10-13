// SKELETON (Stage 1). Owned by Track A: build per docs/redesign/ROUTES-AND-CONTENT.md → 404
// (mockup: redesign-mockups/r3/404.html; the phone uses components/devices/PhoneShell +
// Notification). Keep the Umami "404" event.
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { PageBg } from "@/components/layout/PageBg";
import { TrackOnMount } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <PageBg tone="night" />
      <TrackOnMount name={EVENTS.notFound} />
      <main id="main" className="page">
        <section className="wrap phero">
          <div className="rv">
            <div className="mono">404 · page not found</div>
            <h1 className="d1" style={{ marginTop: 18 }}>
              This page
              <br />
              checked out.
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              It may have moved, or the link was mistyped. Nothing needs you here.
            </p>
            <div className="ctas">
              <Button href="/">Back to home</Button>
              <Button href="/services" variant="quiet">
                See the services
              </Button>
              <Button href="/contact" variant="quiet">
                Book a call
              </Button>
            </div>
          </div>
          <div className="visual">
            <StubBox name="404 lock-screen phone" track="A" minHeight={480} style={{ width: 300 }} />
          </div>
        </section>
      </main>
    </>
  );
}
