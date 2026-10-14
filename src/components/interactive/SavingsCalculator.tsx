"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { CALC_FIELDS, CALC_RECOMMEND, DIRECT_SHARE, NET_COMMISSION, quote, type CalcKey } from "@/lib/pricing";
import { getService } from "@/lib/services";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";

/** No props: it reads the currency from context. */
export type SavingsCalculatorProps = Record<string, never>;

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

/**
 * Six sliders → hours back each month, commission kept, replies sent, and "Start with" service
 * chips. Has its own CurrencyToggle (YOUR BUSINESS header) and follows useCurrency().
 * Fires "Calculator used" once on the first slider input. Root element is `.calc`.
 * Used by Home ch.06 (Track D) and /pricing. Mockup: site.js → mountCalc, sections.css .calc.
 * Data: src/lib/pricing.ts (CALC_FIELDS, CALC_RECOMMEND, FX).
 */
export function SavingsCalculator() {
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

  // Hours of admin per month and replies sent as in the mockup. Commission kept: the share of
  // platform bookings moved direct × the net commission saved on each (src/lib/pricing.ts).
  const now = v.units * ((v.msgs * 4.33 * 4) / 60 + (v.turn * 25) / 60 + 3);
  const back = Math.round(now * 0.7);
  const kept = Math.round(v.units * v.nights * v.rate * fx * (v.ota / 100) * DIRECT_SHARE * NET_COMMISSION);
  const replies = Math.round(v.units * v.msgs * 4.33 * 0.8);
  const afterPct = Math.max(6, ((now - back) / Math.max(now, 1)) * 100);

  const rec = [
    ...(v.msgs >= 12 ? CALC_RECOMMEND.msgs : []),
    ...(v.ota >= 60 ? CALC_RECOMMEND.ota : []),
    ...(v.nights <= 18 ? CALC_RECOMMEND.nights : []),
  ];
  const picks = [...new Set(rec.length ? rec : CALC_RECOMMEND.fallback)].slice(0, 3);
  const plan = quote(picks, v.units, cur);

  return (
    <div className="calc">
      <div className="cin">
        <div className="chead">
          <span className="mono">YOUR BUSINESS</span>
          <CurrencyToggle />
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
          <small>about {Math.max(1, Math.round(back / 8))} working days</small>
        </div>
        <div className="two2">
          <div>
            <span className="mono">COMMISSION KEPT / MONTH</span>
            <b>
              <Anim value={kept} format={money} />
            </b>
          </div>
          <div>
            <span className="mono">REPLIES SENT FOR YOU</span>
            <b>
              <Anim value={replies} />
            </b>
          </div>
        </div>
        <div className="week">
          <span className="mono">YOUR MONTH, IN HOURS OF ADMIN</span>
          <div className="wb">
            <i style={{ width: "100%" }} />
            <em>now</em>
          </div>
          <div className="wb">
            <i className="after" style={{ width: `${afterPct}%` }} />
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
            These {picks.length > 1 ? `${picks.length} systems` : "system"}: {money(plan.monthly)}/month + {money(plan.setup)} setup
            {plan.adMin ? ", plus ad spend" : ""}.
            {onPricing ? null : (
              <>
                {" "}
                <Link href="/pricing">See pricing</Link>
              </>
            )}
          </p>
        </div>
        <p className="mono" style={{ marginTop: 6 }}>
          Illustrative estimate. Your audit call gives real numbers.
        </p>
      </div>
    </div>
  );
}
