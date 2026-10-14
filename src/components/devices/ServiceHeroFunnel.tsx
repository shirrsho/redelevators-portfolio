"use client";

import { useRef, type CSSProperties } from "react";
import { ConBar, ScreenCard } from "@/components/devices/ScreenCard";
import { useSceneStart } from "@/components/devices/useSceneTimeline";
import { ToolLogo } from "@/components/ui/ToolLogo";

// Hero · Full-Funnel Booking Campaigns: the funnel bars grow, a drop-off is flagged. Plays once.
// Numbers are illustrative (the bar says so). Ported from service.html → HERO.funnel.

const STEPS = [["Saw an ad or search", "12,400", 1], ["Visited your site", "1,180", 0.62], ["Started a booking", "140", 0.34], ["Booked a stay", "31", 0.16]] as const;

export function ServiceHeroFunnel() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useSceneStart(ref, 500);
  return (
    <ScreenCard ref={ref} chip="Every channel, measured in bookings">
      <div className="con" style={{ gridTemplateColumns: "1fr" }}>
        <ConBar plain title="Funnel · last 30 days" status="illustrative" />
        <div className={`fn${go ? " in" : ""}`}>
          {STEPS.map((r) => (
            <div key={r[0]} className="st">
              <span>{r[0]}</span>
              <i style={{ "--w": r[2] } as CSSProperties} />
              <b>{r[1]}</b>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["Meta", "Google Ads", "MailChimp"].map((l) => (
              <span key={l} className="logo-pill" style={{ padding: "6px 9px" }}>
                <ToolLogo name={l} size={14} fallback="none" />
                {l}
              </span>
            ))}
          </div>
          <div className="card" style={{ fontSize: 12, color: "var(--amber)" }}>
            ⚑ Drop-off flagged: 38% leave at the dates step. Fix suggested.
          </div>
        </div>
      </div>
    </ScreenCard>
  );
}
