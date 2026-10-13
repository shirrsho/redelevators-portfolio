"use client";

import { useState } from "react";
import { SERVICES, type Pillar } from "@/lib/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHead } from "@/components/layout/Section";

// Home ch.05 · What we build: the eight service cards with the pillar filter (All / AI
// Automation / Marketing). Filtered-out cards fade (`.svc.off` via ServiceCard `dimmed`).
// Port of home.html #build + home.js #tabs.

const TABS: readonly (readonly [Pillar | "all", string])[] = [
  ["all", "All"],
  ["auto", "AI Automation"],
  ["mkt", "Marketing"],
];

export function HomeServices() {
  const [f, setF] = useState<Pillar | "all">("all");
  return (
    <>
      <SectionHead
        eyebrow="Chapter 05 · What we build"
        title={
          <>
            Eight systems.
            <br />
            Two pillars.
          </>
        }
        aside={
          <div className="tabs rv d1x" role="group" aria-label="Filter by pillar">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" className={f === k ? "on" : undefined} aria-pressed={f === k} onClick={() => setF(k)}>
                {label}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid8">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.slug} slug={s.slug} dimmed={f !== "all" && s.p !== f} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} location="home" />
        ))}
      </div>
    </>
  );
}
