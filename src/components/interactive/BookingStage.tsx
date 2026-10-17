"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/lib/currency";
import { parsePlan, planSummary } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { AlivePhone, type AlivePhoneStage } from "@/components/devices/AlivePhone";
import { CalBooker, type BookedWhen } from "./CalBooker";
import { BOOKER_NOTE } from "@/lib/booking";
import styles from "./planNote.module.css";

export type BookingStageProps = {
  /**
   * home: Home ch.09; the alive phone sits beside the booker, and the note links "other ways to reach us".
   * contact: /contact; the booker stands alone, centred, and the note says when calls can be booked.
   * (src/lib/booking.ts → BOOKER_NOTE.)
   */
  variant: "home" | "contact";
};

/**
 * The booking stage: the Cal.com inline booker (max 760px) with the time-zone note. On Home ch.09
 * the AlivePhone (300px) sits beside it, reacting to the booking (hidden under 1100px); on /contact
 * the booker stands alone (`.bstage.solo`). Root element is `.bstage`; the page supplies the heading
 * above it. Fires "Booking step" and "Booking complete".
 * On /contact, a plan from the pricing page (?tier= or ?systems=…, src/lib/pricing.ts → planHref)
 * is shown above the booker and prefilled into the booking's notes.
 * Mockup: sections.css .bstage, site.js → mountScheduler + mountCalmPhone.
 */
export function BookingStage({ variant }: BookingStageProps) {
  const [stage, setStage] = useState<AlivePhoneStage>("idle");
  const [when, setWhen] = useState<BookedWhen | null>(null);
  const note = BOOKER_NOTE[variant];
  const { cur } = useCurrency();
  const [search, setSearch] = useState("");
  useEffect(() => {
    // Reading the plan from the URL after mount is the intended one-off sync (static page).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (variant === "contact") setSearch(location.search);
  }, [variant]);
  const plan = search ? planSummary(parsePlan(search), cur) : null;

  const onStart = useCallback(() => setStage((cur) => (cur === "booked" ? cur : "started")), []);
  const onBooked = useCallback((w: BookedWhen | null) => {
    setWhen(w);
    setStage("booked");
  }, []);

  return (
    <div className={variant === "contact" ? "bstage solo" : "bstage"}>
      <div className="rv">
        {plan ? (
          <p className={styles.note}>
            <Icon name="check" />
            <span>
              <b>{plan.title}</b> is attached to your booking. <span className={styles.detail}>{plan.detail}</span>
            </span>
          </p>
        ) : null}
        <CalBooker location={variant} onStart={onStart} onBooked={onBooked} notes={plan?.notes} />
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
      {variant === "home" ? <AlivePhone className="rv d2x" stage={stage} when={when} /> : null}
    </div>
  );
}
