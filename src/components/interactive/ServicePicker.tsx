"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PILLAR_LABEL, getService } from "@/lib/services";
import { PROBLEMS } from "@/lib/servicesPage";
import { ArrowIcon, Icon } from "@/components/ui/Icon";
import { ServiceFromPrice } from "./ServicePriceList";
import styles from "@/app/services/services.module.css";

/**
 * /services "What's costing you the most right now?": problem buttons on the left, one answer on
 * the right (start with X, today vs with it, the price, what pairs well). The first problem is
 * selected on load so the answer is never empty. Mockup: services.html → PROBS, ansHTML().
 */
export function ServicePicker() {
  const [pick, setPick] = useState(0);
  const [swap, setSwap] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const choose = (i: number) => {
    if (i === pick) return;
    track(EVENTS.servicePicker, { problem: PROBLEMS[i].label });
    if (reduced) return setPick(i);
    clearTimeout(timer.current);
    setSwap(true);
    timer.current = setTimeout(() => {
      setPick(i);
      setSwap(false);
    }, 220);
  };

  const p = PROBLEMS[pick];
  const s = getService(p.start)!;
  const pair = getService(p.pair)!;

  return (
    <div className={styles.pickGrid}>
      <div className="rv">
        <h2 className={`d2 ${styles.pickTitle}`}>What’s costing you the most right now?</h2>
        <p className={`small ${styles.pickSub}`}>Pick the one that hurts most. We’ll show you where to start and what it costs.</p>
        <div className={styles.probs} role="group" aria-label="Pick a problem">
          {PROBLEMS.map((x, i) => (
            <button key={x.label} type="button" className={styles.prob} aria-pressed={i === pick} onClick={() => choose(i)}>
              <Icon name={x.icon} />
              <span>{x.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={`rv d1x ${styles.ans}${swap ? ` ${styles.swap}` : ""}`} aria-live="polite">
        <div className={styles.ansIn}>
          <p className={styles.lbl}>
            Start with <span className={`tag ${s.p}`}>{PILLAR_LABEL[s.p]}</span>
          </p>
          <h3 className={`d3 ${styles.ansTitle}`}>{s.title}</h3>
          <p className={styles.out}>{s.outcome}</p>
          <ol className={styles.shift}>
            <li className={styles.was}>
              <span>Today</span>
              {p.today}
            </li>
            <li className={styles.now}>
              <span>With it</span>
              {p.withIt}
            </li>
          </ol>
          <div className={styles.ansFoot}>
            <div className={styles.price}>
              <ServiceFromPrice slug={s.slug} />
            </div>
            <Link
              className="btn quiet"
              href={`/services/${s.slug}`}
              data-umami-event={EVENTS.serviceClick}
              data-umami-event-service={s.slug}
              data-umami-event-location="services-picker"
            >
              See how it works <ArrowIcon />
            </Link>
          </div>
          <p className={styles.pair}>
            Pairs well with <Link href={`/services/${pair.slug}`}>{pair.title}</Link>: {p.why}.
          </p>
        </div>
      </div>
    </div>
  );
}
