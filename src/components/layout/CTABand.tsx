import { EVENTS } from "@/lib/analytics";
import { BAND_DEFAULT, CONTACT_PATH } from "@/lib/site";
import { Button } from "@/components/ui/Button";

/**
 * End-of-page band: title + one line + one Book button. Wrapped in its own section with the
 * mockup's spacing (`<section class="wrap" style="padding-bottom:120px">`).
 * Mockup: site.js → band(), sections.css .band.
 */
export function CTABand({
  title = BAND_DEFAULT.title,
  sub = BAND_DEFAULT.sub,
  service,
}: {
  title?: string;
  sub?: string;
  /** Service slug, sent with the "Book a call" event on service pages. */
  service?: string;
}) {
  return (
    <section className="wrap" style={{ paddingBottom: 120 }}>
      <div className="band rv">
        <div>
          <h2 className="d2">{title}</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            {sub}
          </p>
        </div>
        <div className="ctas">
          <Button href={CONTACT_PATH} arrow event={EVENTS.bookCall} location="cta" {...(service ? { "data-umami-event-service": service } : {})}>
            {BAND_DEFAULT.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
