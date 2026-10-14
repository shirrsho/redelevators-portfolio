"use client";

import { useCurrency } from "@/lib/currency";

/**
 * A headline price in the page currency: "$190", "€169", or a small "AED" before the number, so
 * three-letter currencies fit the same space as "$". Used for the big figures in the tiers and
 * the plan builder; sections.css → `.cur`.
 */
export function Price({ n }: { n: number }) {
  const { cur } = useCurrency();
  const amount = Math.round(n).toLocaleString("en-US");
  if (cur === "aed")
    return (
      <>
        <span className="cur">AED</span>
        {amount}
      </>
    );
  return <>{(cur === "eur" ? "€" : "$") + amount}</>;
}
