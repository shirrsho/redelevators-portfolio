"use client";

import { useRef } from "react";
import { ConBar, ScreenCard } from "@/components/devices/ScreenCard";
import { useSceneStart } from "@/components/devices/useSceneTimeline";

// Hero · Listing & Content Engine: the editor writes, the checks tick off. Plays once, 0.5s
// after it is in view. Ported from service.html → HERO.editor.

const LINES = [96, 88, 92, 60, 0, 94, 82, 70];
const CHECKS = ["Tone matches your guide", "Search terms included", "Facts checked vs. PMS", "Website · published", "Airbnb · ready to paste"];

export function ServiceHeroEditor() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useSceneStart(ref, 500);
  return (
    <ScreenCard ref={ref} chip="Written, checked, published">
      <div className="con" style={{ gridTemplateColumns: "1fr" }}>
        <ConBar title="Listing engine" status="Writing" />
        <div className={`ed${go ? " in" : ""}`}>
          <div className="doc">
            <h6>Garden Suite · 2 bed, sleeps 4 · Canal District</h6>
            {LINES.map((w, i) => (w ? <i key={i} style={{ width: `${w}%`, transitionDelay: `${i * 0.25}s` }} /> : <br key={i} />))}
          </div>
          <div className="chk">
            {CHECKS.map((c, i) => (
              <div key={c} style={{ transitionDelay: `${1.8 + i * 0.35}s` }}>
                {c}
                <em>✓</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenCard>
  );
}
