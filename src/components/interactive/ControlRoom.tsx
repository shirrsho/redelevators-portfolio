"use client";

import { useEffect, useRef, useState } from "react";
import { CR, CR_TICK_MS } from "@/lib/controlRoom";
import { SHORT, servicesIn, type Pillar } from "@/lib/services";
import { prefersReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useInView } from "@/lib/hooks/useInView";
import { ArrowIcon, Icon } from "@/components/ui/Icon";
import { selectSystem } from "./SystemPlayer";
import styles from "./ControlRoom.module.css";

const GROUPS: readonly [Pillar, string][] = [
  ["auto", "AI AUTOMATION"],
  ["mkt", "MARKETING"],
];
const LIVE = CR.flatMap((c, i) => (c[2] ? [i] : []));

/**
 * The Systems hero's live control room: 8 rows grouped by pillar, counters that tick every 2.6s
 * with a green flash, a feed line that swaps. A row click selects that system in the player and
 * scrolls to it (`#player`). Numbers are illustrative and labelled so.
 * Mockup: systems.html (CR, crRow, the ticker). Ticks start after mount (no randomness while
 * rendering, so no hydration mismatch) and only while the room is on screen. Reduced motion:
 * the counters stay still.
 */
export function ControlRoom() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [values, setValues] = useState(() => CR.map((c) => c[0]));
  const [feed, setFeed] = useState(CR[0][3]);
  const [swap, setSwap] = useState(false);
  const [ticked, setTicked] = useState(-1);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };
    const id = setInterval(() => {
      const i = LIVE[Math.floor(Math.random() * LIVE.length)];
      setValues((v) => v.map((x, k) => (k === i ? (x as number) + 1 : x)));
      setTicked(i);
      later(() => setTicked((t) => (t === i ? -1 : t)), 900);
      setSwap(true);
      later(() => {
        setFeed(CR[i][3]);
        setSwap(false);
      }, 350);
    }, CR_TICK_MS);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
      // the cancelled timers would have ended the flash and the feed swap: end them now
      setTicked(-1);
      setSwap(false);
    };
  }, [inView]);

  const pick = (slug: string) => {
    selectSystem(slug, "control-room");
    const target = document.getElementById("player");
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div ref={ref} className={styles.cr} role="group" aria-label="Your systems today (illustrative)">
      <div className={styles.top}>
        <b>Your systems</b>
        <span className="mono" style={{ fontSize: 11 }}>
          TODAY
        </span>
        <span className={styles.ok}>
          <i />
          All 8 running
        </span>
      </div>
      {GROUPS.map(([p, label]) => (
        <div key={p} className={styles.grp}>
          <span className="mono">{label}</span>
          {servicesIn(p).map((s) => (
            <button key={s.slug} type="button" className={`${styles.row}${ticked === s.idx ? ` ${styles.tick}` : ""}`} data-p={s.p} onClick={() => pick(s.slug)}>
              <span className={styles.ic}>
                <Icon name={s.icon} />
              </span>
              <span className={styles.nm}>{SHORT[s.idx]}</span>
              <span className={styles.mt}>
                <b>{values[s.idx]}</b> {CR[s.idx][1]}
              </span>
              <span className={styles.go}>
                <ArrowIcon />
              </span>
            </button>
          ))}
        </div>
      ))}
      <div className={styles.feed}>
        <i className={styles.dot} />
        <span className={swap ? styles.swap : undefined}>{feed}</span>
        <span className="mono">ILLUSTRATIVE</span>
      </div>
    </div>
  );
}
