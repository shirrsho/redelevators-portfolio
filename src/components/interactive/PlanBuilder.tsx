"use client";

import { useEffect, useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import {
  FOUNDING,
  INCLUDED_UNITS,
  PORTFOLIO_FROM_UNITS,
  PORTFOLIO_SERVICE,
  RATES,
  guaranteeFor,
  parsePlan,
  planHref,
  planTier,
  quote,
  replyTime,
  tierName,
  tierPlan,
  type TierKey,
  type TierPlan,
} from "@/lib/pricing";
import { SERVICES, getService, type ServiceSlug } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import styles from "./planBuilder.module.css";

/** The builder root's id: the tier cards' "Customize this plan" links and scrolls to it. */
export const BUILDER_ID = "builder";
const PLAN_EVENT = "re:builder-plan";

/** Load a tier's "from" plan into the builder on this page and scroll to it (PricingTiers). */
export function loadBuilderPlan(tier: TierKey) {
  window.dispatchEvent(new CustomEvent<TierKey>(PLAN_EVENT, { detail: tier }));
}

/** The two pillars, as groups of checkboxes. */
const GROUPS = [
  { p: "auto", label: "AI Automation", note: `Priced for ${INCLUDED_UNITS} units` },
  { p: "mkt", label: "Marketing", note: "Flat, any size" },
] as const;

/**
 * Plan builder: tick systems by pillar, set your units and, optionally, the Portfolio service
 * level → setup + monthly from the rate card (quote() in src/lib/pricing.ts: unit fees, 10% / 15%
 * bundle saving, service level), with a line-by-line breakdown and the tier it matches. Follows
 * the page currency (the toggle sits in the page hero). "Get a fixed quote" carries the plan to
 * /contact (planHref), where it is attached to the booking. Loads a plan from `?tier=` or
 * `?systems=&units=&portfolio=` on mount, or from the tier cards (loadBuilderPlan). Fires
 * "Plan builder used" on the first change. Mockup: site.js → mountBuilder, sections.css .builder.
 * The checkboxes stay in the tab order (planBuilder.module.css); the mockup hides them with
 * display:none.
 */
export function PlanBuilder() {
  const { cur, money } = useCurrency();
  const [slugs, setSlugs] = useState<readonly ServiceSlug[]>(["guest-messaging"]);
  const [units, setUnits] = useState(INCLUDED_UNITS);
  const [portfolio, setPortfolio] = useState(false);
  const used = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  const markUsed = () => {
    if (!used.current) {
      used.current = true;
      track(EVENTS.planBuilderUsed);
    }
  };

  // A plan from the URL (a tier card on another page) or from a tier card on this page. Applying
  // the URL's plan after mount is the intended one-off sync (the server renders the default plan).
  useEffect(() => {
    const show = () =>
      root.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    const load = (p: TierPlan) => {
      setSlugs(p.slugs);
      setUnits(Math.min(p.units, 60));
      setPortfolio(p.portfolio);
    };
    const link = parsePlan(location.search);
    const fromUrl = link.tier
      ? tierPlan(link.tier)
      : link.slugs
        ? { slugs: link.slugs, units: link.units ?? INCLUDED_UNITS, portfolio: !!link.portfolio }
        : null;
    if (fromUrl) {
      load(fromUrl);
      requestAnimationFrame(show);
    }
    const onPlan = (e: Event) => {
      load(tierPlan((e as CustomEvent<TierKey>).detail));
      show();
    };
    window.addEventListener(PLAN_EVENT, onPlan);
    return () => window.removeEventListener(PLAN_EVENT, onPlan);
  }, []);

  const toggle = (slug: ServiceSlug) => {
    markUsed();
    setSlugs((cur) => (cur.includes(slug) ? cur.filter((x) => x !== slug) : SERVICES.map((s) => s.slug).filter((s) => s === slug || cur.includes(s))));
  };

  const q = quote(slugs, units, cur, portfolio);
  const n = slugs.length;
  const tier = planTier(slugs, portfolio);
  const marketing = slugs.some((s) => !RATES[s].perUnit);
  const label = n ? (tier ? `${tierName(tier)} plan${marketing && tier !== "portfolio" ? " + marketing" : ""}` : "Custom plan") : "No systems yet";

  // Breakdown rows: [label, setup, monthly]; a negative amount is a saving.
  const rows: [string, number | null, number | null][] = slugs.map((s) => [getService(s)!.title, RATES[s].setup[cur], RATES[s].monthly[cur]]);
  if (q.units) rows.push([`${units - INCLUDED_UNITS} units above ${INCLUDED_UNITS}`, null, q.units]);
  if (q.discount) rows.push([`Bundle saving, ${Math.round(q.discount * 100)}%`, q.setup - q.rawSetup, q.monthly - q.service - q.rawMonthly]);
  if (q.service) rows.push(["Portfolio service level", null, q.service]);
  const amount = (v: number | null) => (v === null ? "" : v < 0 ? `–${money(-v)}` : money(v));

  const notes: string[] = [];
  if (n === 2) notes.push("Add one more system for 10% off.");
  if (n === 4) notes.push("Add one more system for 15% off.");
  if (q.adMin) notes.push(`Plus ad spend of at least ${money(q.adMin)} a month, paid to Meta or Google directly. Ads run for 3 months minimum.`);
  if (slugs.includes("photo-ad-creative")) notes.push("Photo setup is per property; the local photographer is billed at cost.");

  return (
    <div className={`builder ${styles.root}`} id={BUILDER_ID} ref={root}>
      <div className={styles.groups}>
        {GROUPS.map((g) => (
          <fieldset key={g.p} className={styles.group}>
            <legend className={styles.legend}>
              <span className={`${styles.dot} ${styles[g.p]}`} aria-hidden="true" />
              {g.label}
              <small>{g.note}</small>
            </legend>
            <div className="picks">
              {SERVICES.filter((s) => s.p === g.p).map((s) => (
                <label key={s.slug} className={`pk ${styles.row}`}>
                  <input type="checkbox" className={styles.input} checked={slugs.includes(s.slug)} onChange={() => toggle(s.slug)} />
                  <span className="box">
                    <Icon name="check" />
                  </span>
                  <Icon name={s.icon} />
                  <span className={styles.name}>
                    {s.title}
                    <small>
                      {money(RATES[s.slug].monthly[cur])}/mo · {money(RATES[s.slug].setup[cur])} setup
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="est">
        <div className="chead">
          <span className="mono">YOUR ESTIMATE</span>
          <span className={`${styles.tier}${tier ? ` ${styles.match}` : ""}`} aria-live="polite">
            {label}
          </span>
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
        <label className={`${styles.service}${!portfolio && units >= PORTFOLIO_FROM_UNITS ? ` ${styles.suggest}` : ""}`}>
          <input
            type="checkbox"
            checked={portfolio}
            onChange={(e) => {
              markUsed();
              setPortfolio(e.target.checked);
            }}
          />
          <span className={styles.switch} aria-hidden="true" />
          <span>
            <b>
              Portfolio service level <em>+{money(PORTFOLIO_SERVICE[cur])}/mo</em>
            </b>
            <small>
              A dedicated build lead, team training, support replies the {replyTime("portfolio")}.
              {!portfolio && units >= PORTFOLIO_FROM_UNITS ? ` Suggested for ${PORTFOLIO_FROM_UNITS}+ units.` : ""}
            </small>
          </span>
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
        {n ? (
          <table className={styles.breakdown}>
            <caption className="sr-only">How the estimate adds up</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Item</span>
                </th>
                <th scope="col">Setup</th>
                <th scope="col">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, setup, monthly]) => (
                <tr key={name} className={(setup ?? monthly ?? 0) < 0 ? styles.saving : undefined}>
                  <th scope="row">{name}</th>
                  <td>{amount(setup)}</td>
                  <td>{amount(monthly)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <div className={`small ${styles.notes}`} aria-live="polite">
          {n ? notes.map((t) => <p key={t}>{t}</p>) : <p>Pick at least one system.</p>}
        </div>
        {n && FOUNDING.open ? (
          <p className={styles.offer}>
            <Icon name="check" /> Founding client? Your setup would be {money(q.foundingSetup)}.
          </p>
        ) : null}
        <Button href={n ? planHref("/contact", { slugs, units, portfolio, cur }) : "/contact"} event={EVENTS.bookCall} location="pricing">
          Get a fixed quote
        </Button>
        <p className="mono">
          Live in {guaranteeFor(slugs)} days or your first month is free. Prices exclude applicable taxes.
        </p>
      </div>
    </div>
  );
}
