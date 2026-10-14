"use client";

import { useCurrency } from "@/lib/currency";
import { TIERS, UNIT_FEES, tierFrom } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { EVENTS } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";

export type PricingTiersProps = {
  /** Home ch.06: no feature lists. Default false (the full tiers on /pricing). */
  compact?: boolean;
};

/**
 * Starter / Growth (Recommended) / Portfolio. Each "from" price is computed from the rate card
 * (tierFrom in src/lib/pricing.ts), so the tiers can never disagree with the plan builder.
 * Root element is `.tiers`. Used by Home ch.06 (Track D, compact) and /pricing.
 * Mockup: site.js → mountPricing, sections.css .tiers / .tier.
 */
export function PricingTiers({ compact = false }: PricingTiersProps) {
  const { cur, money } = useCurrency();
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
            <p className="setup">
              {from.setup !== null ? `+ one-time setup from ${money(from.setup)}` : "Monthly minimum. Scoped after the audit call."}
            </p>
            {compact ? null : (
              <ul>
                {t.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    {item.replace("{unit}", money(UNIT_FEES.upTo30[cur]))}
                  </li>
                ))}
              </ul>
            )}
            <Button href="/contact" variant={t.pop ? "primary" : "quiet"} event={EVENTS.bookCall} location={compact ? "home" : "pricing"}>
              {t.key === "portfolio" ? "Talk to us" : "Start with a call"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
