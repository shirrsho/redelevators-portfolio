"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useCurrency } from "@/lib/currency";
import { PORTFOLIO_SERVICE, TIERS, UNIT_FEES, planHref, tierFrom, type TierKey } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { EVENTS } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { BUILDER_ID, loadBuilderPlan } from "./PlanBuilder";

export type PricingTiersProps = {
  /** Home ch.06: no feature lists. Default false (the full tiers on /pricing). */
  compact?: boolean;
};

/**
 * Starter / Growth (Recommended) / Portfolio. Each "from" price is one real plan, quoted from the
 * rate card (tierPlan / tierFrom in src/lib/pricing.ts), so the tiers can never disagree with the
 * plan builder. "Customize" opens that plan in the builder (on /pricing without leaving the page).
 * Root element is `.tiers`. Used by Home ch.06 (Track D, compact) and /pricing.
 * Mockup: site.js → mountPricing, sections.css .tiers / .tier.
 */
export function PricingTiers({ compact = false }: PricingTiersProps) {
  const { cur, money } = useCurrency();

  // On /pricing the builder is on the page: load the plan and scroll to it instead of navigating.
  const customize = (e: MouseEvent<HTMLAnchorElement>, tier: TierKey) => {
    if (!document.getElementById(BUILDER_ID)) return;
    e.preventDefault();
    loadBuilderPlan(tier);
  };

  return (
    <div className="tiers">
      {TIERS.map((t) => {
        const from = tierFrom(t.key, cur);
        return (
          <div key={t.n} className={`tier${t.pop ? " pop" : ""}`}>
            {t.pop ? <span className="badge">Recommended</span> : null}
            <span className="mono">{t.for.toUpperCase()}</span>
            <h4>{t.n}</h4>
            <p className="ln">{t.line}</p>
            <div className="pr">
              <span className="from">from</span>
              <b>
                <Price n={from.monthly} />
              </b>
              <span>/month</span>
            </div>
            <p className="setup">+ one-time setup from {money(from.setup)}</p>
            {compact ? null : (
              <ul>
                {t.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    {item.replace("{unit}", money(UNIT_FEES.upTo30[cur])).replace("{service}", money(PORTFOLIO_SERVICE[cur]))}
                  </li>
                ))}
              </ul>
            )}
            <Button
              href={planHref("/contact", { tier: t.key, cur })}
              variant={t.pop ? "primary" : "quiet"}
              event={EVENTS.bookCall}
              location={compact ? "home" : "pricing"}
            >
              {t.key === "portfolio" ? "Talk to us" : "Start with a call"}
            </Button>
            <Link className="tier-custom" scroll={false} href={`${planHref("/pricing", { tier: t.key })}#${BUILDER_ID}`} onClick={(e) => customize(e, t.key)}>
              Customize this plan
            </Link>
          </div>
        );
      })}
    </div>
  );
}
