"use client";

import { useRef } from "react";
import { ScreenCard } from "@/components/devices/ScreenCard";
import { useSceneStart } from "@/components/devices/useSceneTimeline";
import { ToolLogo } from "@/components/ui/ToolLogo";

// Hero · Direct Booking Website: the site with its booking bar; the "Paid" line appears at 1.4s.
// Ported from service.html → HERO.site.

export function ServiceHeroSite() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useSceneStart(ref, 1400);
  return (
    <ScreenCard ref={ref} chip="Commission-free, synced to your PMS">
      <div className="site">
        <div className="top">
          <span>Harbor Studio</span>
          <span style={{ fontWeight: 400, color: "#5f5f66" }}>Stay · Area · Book</span>
        </div>
        <div className="hero">
          <b>Wake up on the water.</b>
        </div>
        <div className="bk">
          <div>
            <small>Check in</small>Tue, Nov 18
          </div>
          <div>
            <small>Check out</small>Thu, Nov 20
          </div>
          <div>
            <small>Guests</small>2 adults
          </div>
          <span>Book direct · $340</span>
        </div>
        <div className={`paid${go ? " show" : ""}`}>
          <ToolLogo name="Stripe" size={16} /> <b>Paid</b> · calendars blocked on Airbnb and Booking.com · no commission
        </div>
      </div>
    </ScreenCard>
  );
}
