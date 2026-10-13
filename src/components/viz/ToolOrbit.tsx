"use client";

import { useRef, type CSSProperties } from "react";
import { ORBIT } from "@/lib/home";
import { useInView } from "@/lib/hooks/useInView";
import { MarkFull } from "@/components/layout/Logo";
import { ToolLogo } from "@/components/ui/ToolLogo";
import styles from "./ToolOrbit.module.css";

// Home ch.08: two counter-rotating rings of official tool marks (inner 60s, outer 90s reversed)
// around the full Red Elevators mark. Port of home.js ring() + #orbit; styles in sections.css
// (.orbit, .ring, .lg, .core; --k scales it to .64 on phones). The spin is CSS; it pauses while
// the orbit is off screen, and base.css stops it under reduced motion.

type Ring = (typeof ORBIT)["inner" | "outer"];

function ring({ tools, radius: r, duration }: Ring, cls: "r1" | "r2") {
  return (
    <div className={`ring ${cls}`} style={{ width: `calc(${r * 2}px * var(--k))`, height: `calc(${r * 2}px * var(--k))`, "--dur": `${duration}s` } as CSSProperties}>
      {tools.map((l, i) => (
        <div key={l} className="lg" style={{ "--a": `${(360 / tools.length) * i}deg`, "--r": `calc(${r}px * var(--k))` } as CSSProperties} title={l}>
          <span>
            <ToolLogo name={l} size={24} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ToolOrbit({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const all = [...ORBIT.inner.tools, ...ORBIT.outer.tools];
  return (
    <div
      ref={ref}
      className={`orbit ${styles.orbit}${className ? ` ${className}` : ""}`}
      data-paused={inView ? undefined : ""}
      role="img"
      aria-label={`Works with ${all.join(", ")}`}
    >
      {ring(ORBIT.outer, "r2")}
      {ring(ORBIT.inner, "r1")}
      <div className="core">
        <MarkFull />
      </div>
    </div>
  );
}
