// STUB: owned by track A
import { StubBox } from "@/components/ui/StubBox";

/** No props: it reads the currency from context. */
export type SavingsCalculatorProps = Record<string, never>;

/**
 * Six sliders → hours back each month, commission kept, replies sent, and "Start with" service
 * chips. Has its own CurrencyToggle (YOUR BUSINESS header) and follows useCurrency().
 * Fires "Calculator used" once on the first slider input. Root element is `.calc`.
 * Used by Home ch.06 (Track D) and /pricing. Mockup: site.js → mountCalc, sections.css .calc.
 * Data: src/lib/pricing.ts (CALC_FIELDS, CALC_RECOMMEND, FX).
 */
export function SavingsCalculator() {
  return <StubBox name="SavingsCalculator" track="A" minHeight={460} note="Sliders → hours back, commission kept, where to start" />;
}
