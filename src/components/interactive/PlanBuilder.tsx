"use client";

import { useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { BUILDER } from "@/lib/pricing";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";
import styles from "./planBuilder.module.css";

/**
 * Plan builder: tick the systems you want → setup + monthly estimate (placeholder prices, 15%
 * off from three systems). Follows the page currency and has its own toggle. Fires
 * "Plan builder used" on the first tick. Mockup: site.js → mountBuilder, sections.css .builder.
 * The checkboxes stay in the tab order (planBuilder.module.css); the mockup hides them with
 * display:none.
 */
export function PlanBuilder() {
  const { money, fx } = useCurrency();
  const [on, setOn] = useState<readonly number[]>([0]);
  const used = useRef(false);

  const toggle = (i: number) => {
    if (!used.current) {
      used.current = true;
      track(EVENTS.planBuilderUsed);
    }
    setOn((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  };

  const k = on.length >= BUILDER.bundleFrom ? BUILDER.bundleFactor : 1;
  const setup = Math.round((on.reduce((a, i) => a + BUILDER.setup[i], 0) * k * fx) / 50) * 50;
  const monthly = Math.round((on.reduce((a, i) => a + BUILDER.monthly[i], 0) * k * fx) / 10) * 10;
  const note = on.length
    ? `${on.length} system${on.length > 1 ? "s" : ""}${on.length >= BUILDER.bundleFrom ? " · bundle saving applied" : ""}. Ad spend is separate and paid to Meta or Google directly.`
    : "Pick at least one system.";

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
        <div className="row">
          <div>
            <b>{money(setup)}</b>
            <small>one-time setup</small>
          </div>
          <div>
            <b>{money(monthly)}</b>
            <small>per month</small>
          </div>
        </div>
        <p className="small" aria-live="polite">
          {note}
        </p>
        <Button href="/contact" event={EVENTS.bookCall} location="pricing">
          Get a fixed quote
        </Button>
        <p className="mono">Placeholder prices for review. Three or more systems get a bundle saving.</p>
      </div>
    </div>
  );
}
