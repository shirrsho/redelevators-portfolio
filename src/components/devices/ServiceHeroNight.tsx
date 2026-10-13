"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cueList, useSceneTimeline } from "@/components/devices/useSceneTimeline";
import { Icon } from "@/components/ui/Icon";

// Hero · AI Guest Assistant: last night's shift. Questions through the night, answered from the
// house guide. Ported from service.html → HERO.chat2 (timings unchanged), 11.5s loop.

/** [time, question, answered from, handed to the owner (1) or not (0)] */
const Q = [
  ["22:40", "Wifi password?", "House guide", 0],
  ["23:15", "Parking for a van?", "House rules", 0],
  ["00:30", "Pharmacy open now?", "Local tips", 0],
  ["01:05", "Can I get a refund for tonight?", "Handed to you", 1],
  ["06:20", "Late checkout?", "Checkout policy", 0],
] as const;
const SOURCES = ["House guide", "House rules", "Local tips", "Checkout policy"];
const HOURS = ["22", "00", "02", "04", "07"];

/** 22:00 → 07:00 as a 0–1 position. */
const frac = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return (((a < 12 ? a + 24 : a) - 22) * 60 + b) / 540;
};
const AT = (i: number) => 600 + i * 1700;
const MOVE_AT = 40;
const CUES = cueList(MOVE_AT, ...Q.map((_, i) => AT(i)));

export function ServiceHeroNight() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { threshold: 0.2 });
  const reduced = useReducedMotion();
  const t = useSceneTimeline(CUES, 11500, active);

  const done = Q.filter((_, i) => t >= AT(i));
  const answered = done.filter((q) => !q[3]).length;
  const handed = done.filter((q) => q[3]).length;
  const upsell = done.some((q) => q[1].startsWith("Late")) ? 25 : 0;
  const lit = done.length ? done[done.length - 1][2] : null;
  // Newest first, four at most.
  const feed = done.slice(-4).reverse();
  const moving = t >= MOVE_AT;

  return (
    <div ref={ref} className="ngt">
      <div className="hd">
        <span className="av">
          <Icon name="assistant" />
        </span>
        <div>
          <b>Loft 2B Assistant</b>
          <small>Last night. You slept through all of it.</small>
        </div>
        <span className="mono">22:00 → 07:00</span>
      </div>
      <div className="tlx">
        <span
          className="now"
          style={{ left: moving ? "calc(100% - 14px)" : "12px", transition: moving && !reduced ? "left 9s linear" : "none" }}
        />
        {Q.map((q, i) => (
          <i key={q[0]} className={[q[3] ? "amb" : "", t >= AT(i) ? "on" : ""].filter(Boolean).join(" ")} style={{ left: `calc(12px + (100% - 24px) * ${frac(q[0]).toFixed(3)})` } as CSSProperties} />
        ))}
        <div className="hrs">
          {HOURS.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>
      <div className="src">
        <span className="mono">ANSWERS FROM</span>
        {SOURCES.map((x) => (
          <span key={x} className={lit === x ? "lit" : undefined}>
            {x}
          </span>
        ))}
      </div>
      <div className="feed">
        {feed.map((q) => (
          <div key={q[0]} className={`q${q[3] ? " amb" : ""}`}>
            <span className="mono">{q[0]}</span>
            <div>
              <b>{q[1]}</b>
            </div>
            <em>{q[3] ? "Handed to you" : `✓ ${q[2]}`}</em>
          </div>
        ))}
      </div>
      <div className="tot">
        <div>
          <b>{answered}</b>
          <span>answered</span>
        </div>
        <div className="amb">
          <b>{handed}</b>
          <span>handed to you</span>
        </div>
        <div>
          <b>${upsell}</b>
          <span>upsells</span>
        </div>
      </div>
    </div>
  );
}
