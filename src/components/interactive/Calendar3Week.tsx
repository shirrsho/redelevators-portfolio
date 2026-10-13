// STUB: owned by track A
import { StubBox } from "@/components/ui/StubBox";

export type Calendar3WeekProps = {
  /** Show the phase legend under the calendar. Default true. */
  legend?: boolean;
  /**
   * id of an element elsewhere on the page whose `[data-phase]` descendants are linked to the
   * calendar: they get `.on` when their phase is highlighted, and hovering them highlights the
   * phase (Home ch.07: the four `.wk` steps in `<div class="weeks linked" id="time">`).
   * Same as the mockup's `link` option; toggles classes on server-rendered markup.
   */
  linkId?: string;
  /**
   * Clicking a day scrolls to that phase's row on the page: `#ph-audit`, `#ph-design`,
   * `#ph-build`, and `#ph-run` for "live" (Approach). Mockup: approach.html → onPick.
   */
  pickScroll?: boolean;
};

/**
 * The interactive 3-week calendar: hover or tap a day → detail line, phase highlight, linked
 * steps light up; cells fade in once in view. Root element is `.cal3`.
 * Used by Home ch.07 (Track D) and the /approach hero. Mockup: site.js → mountCal3,
 * sections.css .cal3. Data: src/lib/calendar.ts.
 */
export function Calendar3Week({ legend = true, linkId, pickScroll = false }: Calendar3WeekProps) {
  return <StubBox name="Calendar3Week" track="A" minHeight={300} note={[legend && "legend", linkId && `linkId="${linkId}"`, pickScroll && "pickScroll"].filter(Boolean).join(" · ") || undefined} />;
}
