// /services (reworked 17 Oct 2026; mockup: redesign-mockups/r3/services.html). A page that helps
// someone decide: hero → "What's costing you the most?" picker → all eight with prices → the
// 3-week path and the guarantee → FAQ → CTA.
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { FOUNDING, GUARANTEE_DAYS, GUARANTEE_DAYS_LONG } from "@/lib/pricing";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { SERVICES_FAQ, SERVICES_PROOF } from "@/lib/servicesPage";
import { ServicesDuo } from "@/components/devices/ServicesDuo";
import { Calendar3Week } from "@/components/interactive/Calendar3Week";
import { ServicePicker } from "@/components/interactive/ServicePicker";
import { ServicePriceList } from "@/components/interactive/ServicePriceList";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { FAQ } from "@/components/ui/FAQ";
import { Icon } from "@/components/ui/Icon";
import styles from "./services.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Eight done-for-you systems for short-term rentals, with prices. AI Automation takes the busy work off your plate. Marketing fills the empty nights. Live in 21 days.",
  path: "/services",
});

const TERMS: readonly (readonly [string, string])[] = [
  [`${GUARANTEE_DAYS_LONG} days`, " for websites and full-funnel campaigns."],
  ["No lock-in:", " month to month, 30 days’ notice. Ads run 3 months minimum."],
  ...(FOUNDING.open ? [["Founding clients:", ` ${FOUNDING.setupOff * 100}% off setup for our first ${FOUNDING.clients}, for a case study.`] as const] : []),
];

export default function ServicesPage() {
  return (
    <>
      <PageBg tone="day" />
      <JsonLd data={breadcrumbLd([{ name: "Services", path: "/services" }])} />
      <main id="main" className="page">
        <PageHero visual={<ServicesDuo />}>
          <h1 className={`d1 ${styles.h1}`}>Less time in the inbox. More nights booked.</h1>
          <p className="lead">
            Eight done-for-you systems for short-term rentals. AI Automation takes the busy work off your plate. Marketing fills the empty nights. Start
            with one.
          </p>
          <div className="ctas">
            <Button href="/contact" arrow event={EVENTS.bookCall} location="hero">
              Book a free 30-min call
            </Button>
            <Button href="#start" variant="quiet">
              Find where to start
            </Button>
          </div>
          <ul className={styles.proof}>
            {SERVICES_PROOF.map((t) => (
              <li key={t}>
                <Icon name="check" />
                {t}
              </li>
            ))}
          </ul>
        </PageHero>

        <section className={`wrap section ${styles.pick}`} id="start">
          <ServicePicker />
        </section>

        <section className={`wrap section ${styles.all}`} id="all">
          <ServicePriceList />
        </section>

        <section className={`wrap section ${styles.how}`} id="how">
          <div className={styles.howGrid}>
            <div className="rv">
              <h2 className="d2">Live in three weeks, or the first month is free.</h2>
              <p className="lead">Same path for every system: a call, a plan, a build in your own tools, then we run it. We need you three times.</p>
              <ul className={styles.terms}>
                {TERMS.map(([b, t]) => (
                  <li key={b}>
                    <Icon name="check" />
                    <span>
                      <b>{b}</b>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <Button href="/approach" variant="quiet" className={styles.howLink}>
                See the full process
              </Button>
            </div>
            <div className="rv d1x">
              <Calendar3Week />
            </div>
          </div>
        </section>

        <section className={`wrap section ${styles.faqSec}`}>
          <div className={styles.faqGrid}>
            <div className="rv">
              <h2 className="d2">Asked on most calls.</h2>
              <p className="small">Anything else, ask us on the call. It’s free and takes 30 minutes.</p>
            </div>
            <FAQ className="rv d1x" items={SERVICES_FAQ} />
          </div>
        </section>

        <CTABand
          title="Still not sure where to start?"
          sub={`Tell us what’s eating your week. We’ll point to the one system that pays off first, and send a fixed quote. Live in ${GUARANTEE_DAYS} days.`}
        />
      </main>
    </>
  );
}
