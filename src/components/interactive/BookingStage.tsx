"use client";

import { useCallback, useEffect, useState } from "react";
import { useCurrency } from "@/lib/currency";
import { parsePlan, planSummary } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { EmailLink } from "@/components/ui/EmailLink";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { HomeAsk } from "@/components/assistant/Entry";
import { EVENTS } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/site";
import { AlivePhone, type AlivePhoneStage } from "@/components/devices/AlivePhone";
import { CalBooker, type BookedWhen } from "./CalBooker";
import { BOOKER_NOTE } from "@/lib/booking";
import styles from "./planNote.module.css";

export type BookingStageProps = {
  /**
   * home: Home ch.09; the alive phone sits beside the booker, and a "Not ready for a call?" row under it
   *   offers WhatsApp and email (tracked as location "home").
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
        <p className="mono tz">{BOOKER_NOTE}</p>
        {variant === "home" ? (
          <div className="bk-alt">
            <span>Not ready for a call?</span>
            <Button href={whatsappUrl()} variant="wa" event={EVENTS.whatsappClick} location="home">
              <ToolLogo name="WhatsApp" size={16} mono /> Ask on WhatsApp
            </Button>
            <EmailLink location="home" className="btn quiet">
              <Icon name="mail" /> Email us
            </EmailLink>
            <HomeAsk />
          </div>
        ) : null}
      </div>
      {variant === "home" ? <AlivePhone className="rv d2x" stage={stage} when={when} /> : null}
    </div>
  );
}
