"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Notification } from "@/components/devices/Notification";
import { PhoneShell } from "@/components/devices/PhoneShell";

// Hero · Paid Social for Bookings: a sponsored post, and a booking notification that drops in
// and out (first at 1.2s, then every 2.6s). Ported from service.html → HERO.ad.

export function ServiceHeroAd() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { threshold: 0.2 });
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced || !active) return;
    const first = setTimeout(() => setShow(true), 1200);
    const loop = setInterval(() => setShow((s) => !s), 2600);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [active, reduced]);

  return (
    <>
      <PhoneShell ref={ref}>
        <div className="adcard">
          <div className="h">
            <i />
            <div>
              <b>Harbor Studio</b>
              <small>Sponsored</small>
            </div>
          </div>
          <div className="img">
            <b>
              Tue–Thu escape.
              <br />
              Book direct, save 10%.
            </b>
          </div>
          <div className="cta">
            <span>harborstudio.com</span>
            <span>Book now</span>
          </div>
        </div>
        <div className={`drop${show || reduced ? " show" : ""}`}>
          <Notification mark app="New booking · direct" ago="now" title="Harbor Studio · Tue–Thu" body="From your Instagram ad · 2 nights · no commission" />
        </div>
      </PhoneShell>
      <span className="chip problem hero-chip l">
        <i />
        Ad targets your empty nights
      </span>
    </>
  );
}
