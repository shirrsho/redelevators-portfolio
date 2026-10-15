"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { CALC_FIELDS, CALC_TIME, DIRECT_SHARE, DIRECT_SYSTEMS, NET_COMMISSION, PORTFOLIO_FROM_UNITS, calcPicks, quote, type CalcKey } from "@/lib/pricing";
import { getService } from "@/lib/services";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";

export type SavingsCalculatorProps = {
  /** Show the currency switch in the YOUR BUSINESS header. Default true; /pricing has one switch
   *  in its hero for the whole page, so it passes false. */
  currencyToggle?: boolean;
};

/** Counts to `value` over 450ms (ease-out cubic) whenever it changes; jumps with reduced motion. */
function Anim({ value, format = (n) => n.toLocaleString("en-US") }: { value: number; format?: (n: number) => string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduced) return;
    const start = from.current;
    const t0 = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 450);
      const v = Math.round(start + (value - start) * (1 - Math.pow(1 - k, 3)));
      from.current = v;
      setShown(v);
      if (k < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value, reduced]);
  return <>{format(reduced ? value : shown)}</>;
}

const DEFAULTS = Object.fromEntries(CALC_FIELDS.map((f) => [f[0], f[4]])) as Record<CalcKey, number>;

/** "3×", "1.5×": how many times the monthly value covers the monthly fee. */
const times = (r: number) => (r >= 2 ? Math.round(r) : Math.round(r * 10) / 10) + "×";

/**
 * Six sliders → hours back each month, what that is worth (hours × your hourly value + commission
 * kept), and the recommended plan set against it (with the Portfolio service level from
 * PORTFOLIO_FROM_UNITS). Follows useCurrency(); shows its own CurrencyToggle unless told not to. Fires "Calculator used" once on the first slider input.
 * Root element is `.calc`. Used by Home ch.06 (Track D) and /pricing.
 * Mockup: site.js → mountCalc, sections.css .calc. Data and rules: src/lib/pricing.ts
 * (CALC_FIELDS, CALC_TIME, calcPicks, quote, FX).
 */
export function SavingsCalculator({ currencyToggle = true }: SavingsCalculatorProps) {
  const { cur, money, fx } = useCurrency();
  const onPricing = usePathname() === "/pricing";
  const [v, setV] = useState(DEFAULTS);
  const used = useRef(false);

  const set = (key: CalcKey, value: number) => {
    if (!used.current) {
      used.current = true;
      track(EVENTS.calculatorUsed);
    }
    setV((cur) => ({ ...cur, [key]: value }));
  };

  // Only time our systems take over: guest messages and inbox admin (CALC_TIME). Commission
  // kept counts only when a direct-booking system is recommended.
  const msgsPerMonth = v.units * v.msgs * 4.33;
  const now = (msgsPerMonth * CALC_TIME.minutesPerMessage) / 60 + v.units * CALC_TIME.adminHoursPerUnit;
  const back = Math.round(now * CALC_TIME.saved);
  const days = Math.max(1, Math.round(back / 8));
  const replies = Math.round(msgsPerMonth * CALC_TIME.autoReplies);
  const afterPct = Math.max(6, ((now - back) / Math.max(now, 1)) * 100);

  const picks = calcPicks(v);
  const portfolio = v.units >= PORTFOLIO_FROM_UNITS;
  const plan = quote(picks, v.units, cur, portfolio);
  const direct = picks.some((p) => DIRECT_SYSTEMS.includes(p));
  const kept = direct ? Math.round(v.units * v.nights * v.rate * fx * (v.ota / 100) * DIRECT_SHARE * NET_COMMISSION) : 0;
  const worth = Math.round(back * v.hourly * fx + kept);
  const ratio = worth / plan.monthly;
  const paybackMonths = worth > plan.monthly ? Math.ceil(plan.setup / (worth - plan.monthly)) : 0;
  const verdict =
    ratio >= 1.15
      ? `Pays for itself about ${times(ratio)} each month. Setup is paid back in about ${paybackMonths} month${paybackMonths > 1 ? "s" : ""}.`
      : ratio >= 0.9
        ? "Roughly pays for itself each month."
        : `Covers about ${Math.round(ratio * 100)}% of the monthly fee. Worth a call to see where else it saves you time.`;

  return (
    <div className="calc">
      <div className="cin">
        <div className="chead">
          <span className="mono">YOUR BUSINESS</span>
          {currencyToggle ? <CurrencyToggle /> : null}
        </div>
        {CALC_FIELDS.map(([key, label, min, max, , unit]) => (
          <label key={key} className="sl">
            <span>
              {label}
              <b>{unit === "cur" ? money(v[key] * fx) : v[key] + (unit === "%" ? "%" : "")}</b>
            </span>
            <input type="range" min={min} max={max} value={v[key]} onChange={(e) => set(key, +e.target.value)} />
          </label>
        ))}
      </div>
      <div className="cout">
        <div className="big">
          <span className="mono">HOURS BACK EACH MONTH</span>
          <b>
            <Anim value={back} />
          </b>
          <small>
            about {days} working day{days > 1 ? "s" : ""} · {replies.toLocaleString("en-US")} replies sent for you
          </small>
        </div>
        <div className="two2">
          <div>
            <span className="mono">WORTH TO YOU / MONTH</span>
            <b>
              <Anim value={worth} format={money} />
            </b>
            <small>time at {money(v.hourly * fx)}/hour{kept ? " + commission kept" : ""}</small>
          </div>
          <div>
            <span className="mono">COMMISSION KEPT / MONTH</span>
            <b>{direct ? <Anim value={kept} format={money} /> : "–"}</b>
            <small>{direct ? `${Math.round(DIRECT_SHARE * 100)}% of platform bookings moved direct` : "with a direct-booking system"}</small>
          </div>
        </div>
        <div className="week">
          <span className="mono">YOUR MONTH, IN HOURS OF ADMIN</span>
          <div className="wb">
            <i />
            <em>now</em>
          </div>
          <div className="wb">
            <i className="after" style={{ "--w": `${afterPct}%` } as CSSProperties} />
            <em>with the system</em>
          </div>
        </div>
        <div>
          <span className="mono">START WITH</span>
          <div className="recs">
            {picks.map((slug) => {
              const s = getService(slug)!;
              return (
                <Link key={slug} className="chip" href={`/services/${slug}`}>
                  <Icon name={s.icon} />
                  {s.title}
                </Link>
              );
            })}
          </div>
          <p className="small" style={{ marginTop: 10 }}>
            {portfolio ? "Portfolio plan" : picks.length > 1 ? `These ${picks.length} systems` : "This system"}: {money(plan.monthly)}/month +{" "}
            {money(plan.setup)} setup{plan.adMin ? ", plus ad spend" : ""}.
            {onPricing ? null : (
              <>
                {" "}
                <Link href="/pricing">See pricing</Link>
              </>
            )}
          </p>
          <p className={`verdict${ratio >= 0.9 ? " good" : ""}`} aria-live="polite">
            {verdict}
          </p>
        </div>
        <p className="mono" style={{ marginTop: 6 }}>
          Illustrative estimate. Your audit call gives real numbers.
        </p>
      </div>
    </div>
  );
}
