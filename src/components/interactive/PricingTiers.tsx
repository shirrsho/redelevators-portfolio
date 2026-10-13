"use client";

import { useCurrency } from "@/lib/currency";
import { PRICE, TIERS } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { EVENTS } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";

export type PricingTiersProps = {
  /** Home ch.06: no feature lists. Default false (the full tiers on /pricing). */
  compact?: boolean;
};

/**
 * Starter / Growth (Recommended) / Portfolio with "from $X/month + setup", prices from
 * PRICE[cur] via useCurrency(). Placeholder prices: the page shows the placeholder flag.
 * Root element is `.tiers`. Used by Home ch.06 (Track D, compact) and /pricing.
 * Mockup: site.js → mountPricing, sections.css .tiers / .tier. Data: src/lib/pricing.ts.
 */
export function PricingTiers({ compact = false }: PricingTiersProps) {
  const { cur, money } = useCurrency();
  const P = PRICE[cur];
  return (
    <div className="tiers">
      {TIERS.map((t) => (
        <div key={t.n} className={`tier${t.pop ? " pop" : ""}`}>
          {t.pop ? <span className="badge">Recommended</span> : null}
          <span className="mono">{t.for.toUpperCase()}</span>
          <h4>{t.n}</h4>
          <p className="ln">{t.line}</p>
          <div className="pr">
            {t.i !== null ? (
              <>
                <span className="from">from</span>
                <b>{money(P.m[t.i])}</b>
                <span>/month</span>
              </>
            ) : (
              <b>Custom</b>
            )}
          </div>
          <p className="setup">{t.i !== null ? `+ ${money(P.s[t.i])} one-time setup` : "Scoped after the audit call"}</p>
          {compact ? null : (
            <ul>
              {t.items.map((item) => (
                <li key={item}>
                  <Icon name="check" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          <Button href="/contact" variant={t.pop ? "primary" : "quiet"} event={EVENTS.bookCall} location="pricing">
            {t.i !== null ? "Start with a call" : "Talk to us"}
          </Button>
        </div>
      ))}
    </div>
  );
}
