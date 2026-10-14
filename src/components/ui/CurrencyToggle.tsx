"use client";

import { useCurrency } from "@/lib/currency";
import { CURRENCIES, CURRENCY_LABEL } from "@/lib/pricing";

/**
 * USD / AED / EUR switch. Every price on the page follows (useCurrency), and the choice is
 * remembered per visitor. Mockup: site.js → curToggle, sections.css .curtoggle.
 */
export function CurrencyToggle({ className }: { className?: string }) {
  const { cur, setCur } = useCurrency();
  return (
    <div className={`curtoggle${className ? ` ${className}` : ""}`} role="group" aria-label="Currency">
      {CURRENCIES.map((c) => (
        <button key={c} type="button" className={c === cur ? "on" : undefined} aria-pressed={c === cur} onClick={() => setCur(c)}>
          {CURRENCY_LABEL[c]}
        </button>
      ))}
    </div>
  );
}
