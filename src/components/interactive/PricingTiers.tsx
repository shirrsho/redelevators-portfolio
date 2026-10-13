// STUB: owned by track A
import { StubBox } from "@/components/ui/StubBox";

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
  return <StubBox name="PricingTiers" track="A" minHeight={compact ? 260 : 420} note={compact ? "compact" : "full"} />;
}
