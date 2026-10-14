// Track A · 404 (mockup: redesign-mockups/r3/404.html). Keeps the Umami "404" event.
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { PageBg } from "@/components/layout/PageBg";
import { TrackOnMount } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { NotFoundPhone } from "./NotFoundPhone";
import styles from "./not-found.module.css";

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
        <section className={`wrap ${styles.nf}`}>
          <div className="rv">
            <div className={styles.code}>404 · page not found</div>
            <h1 className="d1">
              This page
              <br />
              checked out.
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              It may have moved, or the link was mistyped. Nothing needs you here.
            </p>
            <div className={styles.links2}>
              <Button href="/">Back to home</Button>
              <Button href="/services" variant="quiet">
                See the services
              </Button>
              <Button href="/contact" variant="quiet">
                Book a call
              </Button>
            </div>
          </div>
          <div className={`${styles.hold} rv d2x`} aria-hidden="true">
            <NotFoundPhone />
          </div>
        </section>
      </main>
    </>
  );
}
