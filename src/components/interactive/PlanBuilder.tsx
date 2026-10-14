"use client";

import { useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { FOUNDING, GUARANTEE_DAYS, INCLUDED_UNITS, quote } from "@/lib/pricing";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import styles from "./planBuilder.module.css";

/**
 * Plan builder: tick the systems you want and set your units → setup + monthly from the rate card
 * (quote() in src/lib/pricing.ts: unit fees, 10% / 15% bundle saving, Portfolio minimum).
 * Follows the page currency and has its own toggle. Fires "Plan builder used" on the first
 * change. Mockup: site.js → mountBuilder, sections.css .builder.
 * The checkboxes stay in the tab order (planBuilder.module.css); the mockup hides them with
 * display:none.
 */
export function PlanBuilder() {
  const { cur, money } = useCurrency();
  const [on, setOn] = useState<readonly number[]>([0]);
  const [units, setUnits] = useState(INCLUDED_UNITS);
  const used = useRef(false);

  const markUsed = () => {
    if (!used.current) {
      used.current = true;
      track(EVENTS.planBuilderUsed);
    }
  };
  const toggle = (i: number) => {
    markUsed();
    setOn((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  };

  const slugs = on.map((i) => SERVICES[i].slug);
  const q = quote(slugs, units, cur);
  const n = on.length;

  const notes: string[] = [];
  if (n) {
    notes.push(
      `${n} system${n > 1 ? "s" : ""}` +
        (q.discount ? ` · ${Math.round(q.discount * 100)}% bundle saving applied` : "") +
        (n === 2 ? ". Add one more for 10% off." : n === 4 ? ". Add one more for 15% off." : "."),
    );
    if (q.units) notes.push(`Includes ${money(q.units)} a month for ${units - INCLUDED_UNITS} units above five.`);
    if (q.portfolioMin) notes.push("Portfolio minimum: it covers a dedicated build lead, agreed response times and team training.");
    if (q.adMin) notes.push(`Plus ad spend of at least ${money(q.adMin)} a month, paid to Meta or Google directly. Ads run for 3 months minimum.`);
    if (slugs.includes("photo-ad-creative")) notes.push("Photo setup is per property; the local photographer is billed at cost.");
  }

  return (
    <div className="builder">
      <div className="picks">
        {SERVICES.map((s, i) => (
          <label key={s.slug} className={`pk ${styles.row}`}>
            <input type="checkbox" className={styles.input} checked={on.includes(i)} onChange={() => toggle(i)} />
            <span className="box">
              <Icon name="check" />
            </span>
            <Icon name={s.icon} />
            <span>{s.title}</span>
            <span className={`tag ${s.p}`}>{s.p === "auto" ? "Auto" : "Mkt"}</span>
          </label>
        ))}
      </div>
      <div className="est">
        <div className="chead">
          <span className="mono">YOUR ESTIMATE</span>
          <CurrencyToggle />
        </div>
        <label className="sl">
          <span>
            Units you run
            <b>{units}</b>
          </span>
          <input
            type="range"
            min={1}
            max={60}
            value={units}
            onChange={(e) => {
              markUsed();
              setUnits(+e.target.value);
            }}
          />
        </label>
        <div className="row">
          <div>
            <b>{n ? <Price n={q.setup} /> : "–"}</b>
            <small>one-time setup</small>
          </div>
          <div>
            <b>{n ? <Price n={q.monthly} /> : "–"}</b>
            <small>per month</small>
          </div>
        </div>
        <div className={`small ${styles.notes}`} aria-live="polite">
          {n ? notes.map((t) => <p key={t}>{t}</p>) : <p>Pick at least one system.</p>}
        </div>
        {n && FOUNDING.open ? (
          <p className={styles.offer}>
            <Icon name="check" /> Founding client? Your setup would be {money(q.foundingSetup)}.
          </p>
        ) : null}
        <Button href="/contact" event={EVENTS.bookCall} location="pricing">
          Get a fixed quote
        </Button>
        <p className="mono">
          Live in {GUARANTEE_DAYS} days or your first month is free. Prices exclude applicable taxes.
        </p>
      </div>
    </div>
  );
}
