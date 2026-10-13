// STUB: owned by track C
import { StubBox } from "@/components/ui/StubBox";

export type BookingStageProps = {
  /**
   * home: Home ch.09; the alive phone's idle nudge asks "Questions before you book?" → /contact#chat,
   *   and the note under the booker links "other ways to reach us".
   * contact: /contact; the nudge offers WhatsApp, and the note says "US and UAE clients welcome".
   * (src/lib/booking.ts → BOOKER_NOTE, NUDGE.)
   */
  variant: "home" | "contact";
};

/**
 * The booking stage: the Cal.com inline booker (max 760px) with the time-zone note, and the
 * AlivePhone (300px) beside it reacting to the booking; the phone hides under 1100px. Root
 * element is `.bstage`; the page supplies the heading above it. Fires "Booking step" and
 * "Booking complete". Identical on Home ch.09 (Track D) and /contact.
 * Mockup: sections.css .bstage, site.js → mountScheduler + mountCalmPhone.
 */
export function BookingStage({ variant }: BookingStageProps) {
  return (
    <div className="bstage">
      <StubBox name="BookingStage · CalBooker" track="C" minHeight={520} note={`variant="${variant}"`} />
      <StubBox name="BookingStage · AlivePhone" track="C" minHeight={520} style={{ width: 300 }} />
    </div>
  );
}
