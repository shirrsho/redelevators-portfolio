"use client";

import Link from "next/link";
import { EVENTS } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { RATES, UNIT_FEES, bundleDiscount } from "@/lib/pricing";
import { servicesIn, type Pillar, type ServiceSlug } from "@/lib/services";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";
import styles from "@/app/services/services.module.css";

const HEAD: Record<Pillar, string> = { auto: "The busy work, gone.", mkt: "Calendars that fill." };
const setupNote = (slug: ServiceSlug) => (slug === "photo-ad-creative" ? "setup per property" : "setup");

/**
 * "from $190/mo" with "+ $900 setup" under it, in the page currency. "from" on the automation
 * systems, whose monthly fee grows past the included units. Shared with the picker's answer.
 */
export function ServiceFromPrice({ slug }: { slug: ServiceSlug }) {
  const { cur, money } = useCurrency();
  const r = RATES[slug];
  return (
    <>
      {r.perUnit ? "from " : ""}
      <b>{money(r.monthly[cur])}</b>/mo<small>+ {money(r.setup[cur])} {setupNote(slug)}</small>
    </>
  );
}

/**
 * /services "All eight, with prices": two pillar columns, one row per system (name, one line,
 * monthly + setup), a bundle strip and one line of small print. Every number comes from
 * pricing.ts. Mockup: services.html → #all.
 */
export function ServicePriceList() {
  const { cur, money } = useCurrency();
  return (
    <>
      <div className={`rv ${styles.catHead}`}>
        <div>
          <h2 className="d2">All eight, with prices.</h2>
          <p className="small">A one-time setup fee, then a monthly fee to run it.</p>
        </div>
        <CurrencyToggle />
      </div>
      <div className={styles.cat}>
        {(["auto", "mkt"] as const).map((p, i) => (
          <div key={p} className={`rv${i ? " d1x" : ""} ${styles.pcol}`} data-p={p}>
            <header>
              <h3 className="d3">{HEAD[p]}</h3>
              <span className={`tag ${p}`}>{p === "auto" ? "AI Automation" : "Marketing"}</span>
            </header>
            {servicesIn(p).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={styles.ent}
                data-umami-event={EVENTS.serviceClick}
                data-umami-event-service={s.slug}
                data-umami-event-location="services"
              >
                <div>
                  <h4>
                    {s.title}
                    <Icon name="arrow" />
                  </h4>
                  <p>{s.short}</p>
                </div>
                <div className={styles.pr}>
                  <ServiceFromPrice slug={s.slug} />
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className={`rv ${styles.catFoot}`}>
        <p className={styles.save}>
          <Icon name="check" />
          <span>
            <b>Better together:</b> {bundleDiscount(3) * 100}% off with 3 systems, {bundleDiscount(5) * 100}% off with 5 or more.
          </span>
        </p>
        <Link className="link" href="/pricing#builder">
          Build your plan
        </Link>
      </div>
      <p className={`rv ${styles.catNote}`}>
        Prices exclude applicable taxes. Automation fees cover up to 5 units, then {money(UNIT_FEES.upTo30[cur])} per extra unit. Ad spend goes straight
        to Meta or Google from your own account (from {money(RATES["paid-social"].adMin![cur])}/mo). <Link href="/pricing">Full pricing</Link>
      </p>
    </>
  );
}
