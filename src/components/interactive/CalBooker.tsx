"use client";

import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { EVENTS, track } from "@/lib/analytics";
import { useInView } from "@/lib/hooks/useInView";
import { CAL_BRAND, CAL_LINK, EMAIL } from "@/lib/site";
import styles from "./CalBooker.module.css";

// The real Cal.com inline embed (free plan: dark theme + brand colour, the Cal.com mark stays).
// Replaces the mockup's scripted booker (site.js → mountScheduler); the frame around it is the
// mockup's `.calbk` card.
//
// What the embed tells us (checked against app.cal.com/embed/embed.js, Oct 2026):
// - Nothing about which date or time was picked. Its only in-booker signal is a payload-free
//   `__routeChanged`, which also fires for month navigation (and when Cal skips a full month on
//   load), so it can't tell a date pick from browsing. "Booking step" is therefore one step,
//   "started": the first time the visitor clicks or tabs into the booker.
// - `bookingSuccessfulV2` (and the deprecated `bookingSuccessful`) carry the start time, which is
//   all the alive phone needs for its confirmation card.

/** The confirmed slot in the visitor's own time zone, e.g. { d: "Thu, Nov 12", t: "3:30 PM" }. */
export type BookedWhen = { d: string; t: string };

const NS = "booking";
/** No word from the embed after this long (on screen) → assume it's blocked and show the email fallback. */
const NO_LOAD_MS = 15000;
/** Load the embed (~40 requests, ~1MB from app.cal.com) only once the booker is this close to the
 *  viewport: immediately on Contact, near ch.09 on Home (it was the biggest cost of the Home LCP). */
const LOAD_MARGIN = "800px 0px";

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
  /** The visitor started using the booker (first click or tab into it). */
  onStart?: () => void;
  /** The booking was confirmed; `when` is null if Cal sent no usable time. */
  onBooked?: (when: BookedWhen | null) => void;
};

export function CalBooker({ location, onStart, onBooked }: CalBookerProps) {
  const frame = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const near = useInView(frame, { rootMargin: LOAD_MARGIN, once: true });
  // Latest callbacks, so the listeners below are registered once (their state must survive re-renders).
  const cbs = useRef({ onStart, onBooked });
  useEffect(() => {
    cbs.current = { onStart, onBooked };
  });

  // No scrollbar on the iframe. Cal sizes the iframe to its content, so it never needs to scroll,
  // but before the first resize it overflows. With classic (always-shown) scrollbars, e.g. Safari
  // with a mouse, that scrollbar takes ~15px off the 778px frame. Cal then sees less than 768px,
  // switches to its tall stacked layout, and the scrollbar stays. Set it as soon as Cal inserts the iframe.
  useEffect(() => {
    const el = frame.current;
    if (!near || !el) return;
    const noScroll = () => el.querySelector("iframe:not([scrolling])")?.setAttribute("scrolling", "no");
    const mo = new MutationObserver(noScroll);
    mo.observe(el, { childList: true, subtree: true });
    noScroll();
    return () => mo.disconnect();
  }, [near]);

  // "Booking step": focus moving into the booker's iframe blurs this window. Once per page view.
  useEffect(() => {
    let started = false;
    let t: ReturnType<typeof setTimeout> | undefined;
    const onBlur = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const iframe = frame.current?.querySelector("iframe");
        if (started || !iframe || document.activeElement !== iframe) return;
        started = true;
        track(EVENTS.bookingStep, { step: "started", location });
        cbs.current.onStart?.();
      }, 0);
    };
    window.addEventListener("blur", onBlur);
    return () => {
      clearTimeout(t);
      window.removeEventListener("blur", onBlur);
    };
  }, [location]);

  useEffect(() => {
    if (!near) return;
    let disposed = false;
    let off: (() => void) | undefined;
    let heard = false;

    // If neither the script nor the iframe ever answers (blocked by an extension, CSP, network),
    // show the fallback. Only count time on screen: a background tab doesn't load the booker.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      clearTimeout(timer);
      if (heard) return;
      timer = setTimeout(() => {
        if (!heard && !document.hidden) setFailed(true);
      }, NO_LOAD_MS);
    };
    const onVisible = () => {
      if (!document.hidden) arm();
    };
    arm();
    document.addEventListener("visibilitychange", onVisible);

    (async () => {
      const cal = await getCalApi({ namespace: NS });
      if (disposed) return;

      cal("ui", {
        theme: "dark",
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: { light: { "cal-brand": CAL_BRAND }, dark: { "cal-brand": CAL_BRAND } },
      });

      let booked = false;

      // Any event at all means the embed is alive (linkReady itself can be slow).
      const onAny = () => {
        heard = true;
        clearTimeout(timer);
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

      cal("on", { action: "*", callback: onAny });
      cal("on", { action: "bookingSuccessfulV2", callback: onDone });
      cal("on", { action: "bookingSuccessful", callback: onDone });
      cal("on", { action: "linkFailed", callback: onFail });
      cal("on", { action: "linkReady", callback: onReady });

      off = () => {
        cal("off", { action: "*", callback: onAny });
        cal("off", { action: "bookingSuccessfulV2", callback: onDone });
        cal("off", { action: "bookingSuccessful", callback: onDone });
        cal("off", { action: "linkFailed", callback: onFail });
        cal("off", { action: "linkReady", callback: onReady });
      };
    })();

    return () => {
      disposed = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      off?.();
    };
  }, [location, near]);

  return (
    <div ref={frame} className={`calbk ${styles.frame}`}>
      {near ? (
        <Cal
          namespace={NS}
          calLink={CAL_LINK}
          config={{ layout: "month_view", theme: "dark", useSlotsViewOnSmallScreen: "true" }}
          style={{ width: "100%" }}
          // keep a failed (404) booker out of the tab order behind the notice
          inert={failed}
        />
      ) : null}
      {failed ? (
        <div className={styles.fail} role="alert">
          <p>
            <strong>Booking is unavailable right now.</strong>
          </p>
          <p>
            Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we’ll set up a
            time.
          </p>
        </div>
      ) : null}
    </div>
  );
}
