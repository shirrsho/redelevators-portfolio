// STUB: owned by track B
import { StubBox } from "@/components/ui/StubBox";

export type JourneyProps = {
  /**
   * Home ch.04: the section holds while vertical scroll moves the 7 cards sideways (section
   * height = viewport + travel × 1.1 + 25vh), the current card highlighted, arrows scroll the
   * page. Place it inside `<section className="section"><div className="jpin"><div className="wrap">…`:
   * Journey pins its closest <section> (adds `.jpinned`, sets its height), as mountJourney({pin})
   * does. Reduced motion falls back to the swipe version.
   * Default false: swipe version (scroll-snap, arrows, progress) used on /systems.
   */
  pinned?: boolean;
};

/**
 * One booking, start to finish: 7 cards (guest sees / system does), progress bar, arrows and
 * "n / 7". Root element is `.journey`. Used by Home ch.04 (Track D, pinned) and /systems.
 * Mockup: site.js → mountJourney, sections.css .journey / .fstep / pinned journey.
 * Data: src/lib/journey.ts.
 */
export function Journey({ pinned = false }: JourneyProps) {
  return <StubBox name="Journey" track="B" minHeight={360} note={pinned ? "pinned" : "swipe"} />;
}
