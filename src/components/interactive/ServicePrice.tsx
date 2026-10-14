"use client";

import { EVENTS } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { FOUNDING, INCLUDED_UNITS, RATES, UNIT_FEES, guaranteeFor, quote } from "@/lib/pricing";
import type { ServiceSlug } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import styles from "./servicePrice.module.css";

/**
 * "What it costs" on a service page: this service's setup + monthly from the rate card
 * (src/lib/pricing.ts → RATES), in the page currency, with the rules that apply to it
 * (units, ad spend, per-property shoot), the bundle saving, the founding offer and the guarantee.
 */
export function ServicePrice({ slug }: { slug: ServiceSlug }) {
  const { cur, money } = useCurrency();
  const r = RATES[slug];
  const founding = quote([slug], INCLUDED_UNITS, cur).foundingSetup;

  const notes: string[] = [];
  if (r.perUnit)
    notes.push(
      `Covers up to ${INCLUDED_UNITS} units. Then ${money(UNIT_FEES.upTo30[cur])} a unit each month up to 30, and ${money(UNIT_FEES.above30[cur])} above.`,
    );
  if (r.adMin) notes.push(`Ad spend is separate, at least ${money(r.adMin[cur])} a month, paid straight to Meta or Google. Ads run for 3 months minimum.`);
  if (slug === "photo-ad-creative") notes.push("Setup is per property. The local photographer is billed at cost. The monthly fee is a fresh ad set each month.");
  if (slug === "direct-booking-website") notes.push("The monthly fee is the care plan: updates, checks, small edits and rate syncs.");
  notes.push("Add two more systems for 10% off, or five in total for 15%.");

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className="mono">STARTING PRICE</span>
        <CurrencyToggle />
      </div>
      <div className={styles.figs}>
        <div>
          <b>
            <Price n={r.setup[cur]} />
          </b>
          <small>one-time setup</small>
        </div>
        <div>
          <b>
            <Price n={r.monthly[cur]} />
          </b>
          <small>{r.adMin ? "per month, 3-month minimum" : "per month, no lock-in"}</small>
        </div>
      </div>
      <ul className={styles.notes}>
        {notes.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className={styles.offers}>
        <p>
          <Icon name="calendar" /> Live in {guaranteeFor([slug])} days or your first month is free.
        </p>
        {FOUNDING.open ? (
          <p>
            <Icon name="check" /> Founding clients pay {money(founding)} setup.
          </p>
        ) : null}
      </div>
      <div className={styles.ctas}>
        <Button href="/contact" event={EVENTS.bookCall} location="service-price" data-umami-event-service={slug}>
          Get a fixed quote
        </Button>
        <Button href="/pricing" variant="quiet">
          Build a plan
        </Button>
      </div>
      <p className="mono">Prices exclude applicable taxes.</p>
    </div>
  );
}
