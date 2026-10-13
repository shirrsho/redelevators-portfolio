"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AlivePhone, type AlivePhoneStage } from "@/components/devices/AlivePhone";
import { CalBooker, type BookedWhen } from "./CalBooker";
import { BOOKER_NOTE } from "@/lib/booking";

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
  const [stage, setStage] = useState<AlivePhoneStage>("idle");
  const [when, setWhen] = useState<BookedWhen | null>(null);
  const note = BOOKER_NOTE[variant];

  const onStart = useCallback(() => setStage((cur) => (cur === "booked" ? cur : "started")), []);
  const onBooked = useCallback((w: BookedWhen | null) => {
    setWhen(w);
    setStage("booked");
  }, []);

  return (
    <div className="bstage">
      <div className="rv">
        <CalBooker location={variant} onStart={onStart} onBooked={onBooked} />
        <p className="mono tz">
          {note.text}
          {note.link ? (
            <>
              {" "}
              <Link className="link" href={note.link.href}>
                {note.link.label}
              </Link>
            </>
          ) : null}
        </p>
      </div>
      <AlivePhone className="rv d2x" stage={stage} when={when} nudge={variant === "contact" ? "wa" : "ask"} />
    </div>
  );
}
