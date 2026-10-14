"use client";

import { useRef } from "react";
import { useSceneStart } from "@/components/devices/useSceneTimeline";

// Hero · Listing Photo & Ad Creative: three formats from one shoot, approved once.
// The frames rise in turn (300ms + 350ms each) once in view. Ported from service.html → HERO.frames.

/** [image height, frame width, headline lines, format label] */
const FRAMES = [
  [210, 210, ["Harbor", "Studio"], "Feed · 1:1"],
  [225, 180, ["Midweek", "escape"], "Portrait · 4:5"],
  [300, 168, ["Book", "direct"], "Story · 9:16"],
] as const;

export function ServiceHeroFrames() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useSceneStart(ref, 0);
  return (
    <>
      <div ref={ref} className="frames3">
        {FRAMES.map(([h, w, title, label], i) => (
          <div key={label} className={`fr${go ? " show" : ""}`} style={{ width: w, transitionDelay: go ? `${0.3 + i * 0.35}s` : undefined }}>
            <div className="img" style={{ height: h }}>
              <b>
                {title[0]}
                <br />
                {title[1]}
              </b>
            </div>
            <div className="lbl">{label}</div>
          </div>
        ))}
      </div>
      <span className="chip handled hero-chip r" style={{ top: "6%" }}>
        <i />
        Approved once · sent to Meta
      </span>
    </>
  );
}
