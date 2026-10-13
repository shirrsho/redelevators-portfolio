"use client";

import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { EVENTS, track } from "@/lib/analytics";
import { CAL_BRAND, CAL_LINK, EMAIL } from "@/lib/site";
import styles from "./CalBooker.module.css";

// The real Cal.com inline embed (free plan: dark theme + brand colour, the Cal.com mark stays).
// Replaces the mockup's scripted booker (site.js → mountScheduler); the frame around it is the
// mockup's `.calbk` card.
//
// What the embed tells us (checked against app.cal.com/embed/embed.js, Oct 2026):
// - Cal never says WHICH date or time was picked. It fires a payload-free `__routeChanged` each
//   time the booker moves (a date picked, a time picked → the details form, "Back"…).
//   So "Booking step" is derived: the 1st route change = date, the 2nd = time. Later ones
//   (back and forth) are ignored; each step is reported once.
// - `bookingSuccessfulV2` (and the deprecated `bookingSuccessful`) carry the start time, which is
//   all the alive phone needs for its confirmation card.

export type BookingStep = "date" | "time";
/** The confirmed slot in the visitor's own time zone, e.g. { d: "Thu, Nov 12", t: "3:30 PM" }. */
export type BookedWhen = { d: string; t: string };

const NS = "booking";

function formatWhen(iso: unknown): BookedWhen | null {
  if (typeof iso !== "string") return null;
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return null;
  return {
    d: at.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    t: at.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export type CalBookerProps = {
  /** Where the booker sits (sent with the events): "home" or "contact". */
  location: string;
  /** A date, then a time, was picked inside the booker. */
  onStep?: (step: BookingStep) => void;
  /** The booking was confirmed; `when` is null if Cal sent no usable time. */
  onBooked?: (when: BookedWhen | null) => void;
};

export function CalBooker({ location, onStep, onBooked }: CalBookerProps) {
  const [failed, setFailed] = useState(false);
  // Latest callbacks, so the listeners below are registered once (the step count must survive re-renders).
  const cbs = useRef({ onStep, onBooked });
  useEffect(() => {
    cbs.current = { onStep, onBooked };
  });

  useEffect(() => {
    let disposed = false;
    let off: (() => void) | undefined;

    (async () => {
      const cal = await getCalApi({ namespace: NS });
      if (disposed) return;

      cal("ui", {
        theme: "dark",
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: { light: { "cal-brand": CAL_BRAND }, dark: { "cal-brand": CAL_BRAND } },
      });

      let routes = 0;
      let booked = false;

      const onRoute = () => {
        routes += 1;
        if (routes > 2 || booked) return;
        const step: BookingStep = routes === 1 ? "date" : "time";
        track(EVENTS.bookingStep, { step, location });
        cbs.current.onStep?.(step);
      };
      const onDone = (e: CustomEvent<{ data: Record<string, unknown> }>) => {
        if (booked) return; // V2 and the deprecated event both fire
        booked = true;
        const d = e.detail.data;
        track(EVENTS.bookingComplete, { location });
        cbs.current.onBooked?.(formatWhen(d.startTime ?? d.date));
      };
      const onFail = () => setFailed(true);
      const onReady = () => setFailed(false);

      cal("on", { action: "__routeChanged", callback: onRoute });
      cal("on", { action: "bookingSuccessfulV2", callback: onDone });
      cal("on", { action: "bookingSuccessful", callback: onDone });
      cal("on", { action: "linkFailed", callback: onFail });
      cal("on", { action: "linkReady", callback: onReady });

      off = () => {
        cal("off", { action: "__routeChanged", callback: onRoute });
        cal("off", { action: "bookingSuccessfulV2", callback: onDone });
        cal("off", { action: "bookingSuccessful", callback: onDone });
        cal("off", { action: "linkFailed", callback: onFail });
        cal("off", { action: "linkReady", callback: onReady });
      };
    })();

    return () => {
      disposed = true;
      off?.();
    };
  }, [location]);

  return (
    <div className={`calbk ${styles.frame}`}>
      <Cal
        namespace={NS}
        calLink={CAL_LINK}
        config={{ layout: "month_view", theme: "dark" }}
        style={{ width: "100%", height: "100%", overflow: "auto" }}
      />
      {failed ? (
        <div className={styles.fail} role="alert">
          <h4>Booking is unavailable right now.</h4>
          <p>
            Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we’ll set up a time.
          </p>
        </div>
      ) : null}
    </div>
  );
}
