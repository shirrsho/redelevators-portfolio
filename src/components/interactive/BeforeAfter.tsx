"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { getService, type ServiceSlug } from "@/lib/services";
import { SectionHead } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import styles from "./beforeAfter.module.css";

/**
 * "What changes": the manual way vs the system, with a toggle. Starts on "Without", flips to
 * "With it" 1.6s after it is half in view, unless the visitor has touched the toggle. Both
 * lists are in the HTML. Reduced motion shows "With it" straight away.
 * Mockup: service.html → #ba, #baT, baSet; sections.css .ba.
 */
export function BeforeAfter({ slug }: { slug: ServiceSlug }) {
  const s = getService(slug)!;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { threshold: 0.5, once: true });
  const [pick, setPick] = useState<"without" | "with" | null>(null);

  // Plays itself once: the manual way first, then the system takes over.
  useEffect(() => {
    if (!seen || pick) return;
    const t = setTimeout(() => setPick((cur) => cur ?? "with"), 1600);
    return () => clearTimeout(t);
  }, [seen, pick]);

  const withIt = pick ? pick === "with" : reduced;

  return (
    <>
      <SectionHead
        eyebrow="What changes"
        title="Same work. Nobody doing it by hand."
        aside={
          <div className="ba-toggle rv" role="group" aria-label="Compare">
            <button type="button" className={withIt ? undefined : "on"} aria-pressed={!withIt} onClick={() => setPick("without")}>
              Without the system
            </button>
            <button type="button" className={withIt ? "on" : undefined} aria-pressed={withIt} onClick={() => setPick("with")}>
              With it
            </button>
          </div>
        }
      />
      <div ref={ref} className={`ba ${styles.cols}${withIt ? ` ${styles.flipped}` : ""}`}>
        <div className={`col before${withIt ? " off" : ""}`}>
          <h4>
            <span style={{ color: "var(--amber)" }}>
              <Icon name="alert" />
            </span>
            Without the system
          </h4>
          <ol>
            {s.before.map((b) => (
              <li key={b}>
                <span>
                  <Icon name="clock" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={`col after${withIt ? "" : " off"}`}>
          <h4>
            <span style={{ color: "var(--green)" }}>
              <Icon name="check" />
            </span>
            With it
          </h4>
          <ol>
            {s.chain[2].map((n) => (
              <li key={n[0] + n[1]}>
                <span>
                  <Icon name="check" />
                </span>
                <span>
                  <b>{n[1]}</b> · {n[2]}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
