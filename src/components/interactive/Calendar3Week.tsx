"use client";

import { useEffect, useRef, useState } from "react";
import { CAL_HINT, CAL_NEEDS_YOU, CAL_PLAN, CAL_RUN_LINE, CAL_TIP, CAL_WEEKDAYS, CAL_YOU, PHASE, PHASE_SUMMARY, type Phase } from "@/lib/calendar";
import { useInView } from "@/lib/hooks/useInView";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Icon } from "@/components/ui/Icon";

export type Calendar3WeekProps = {
  /** Show the phase legend under the calendar. Default true. */
  legend?: boolean;
  /**
   * id of an element elsewhere on the page whose `[data-phase]` descendants are linked to the
   * calendar: they get `.on` when their phase is highlighted, and hovering them highlights the
   * phase (Home ch.07: the four `.wk` steps in `<ol class="weeks" id="time">`).
   * Same as the mockup's `link` option; toggles classes on server-rendered markup.
   */
  linkId?: string;
  /**
   * Clicking a day scrolls to that phase's row on the page: `#ph-audit`, `#ph-design`,
   * `#ph-build`, and `#ph-run` for "live" (Approach). Mockup: approach.html → onPick.
   */
  pickScroll?: boolean;
};

type Hl = { p: Phase; k?: string } | null;

const WORKDAYS = CAL_WEEKDAYS.slice(0, 5);

/**
 * The interactive 3-week calendar: hover or tap a day → detail line, phase highlight, linked
 * steps light up; cells fade in once in view. Root element is `.cal3`.
 * Used by Home ch.07 (Track D) and the /approach hero. Mockup: site.js → mountCal3,
 * sections.css .cal3. Data: src/lib/calendar.ts.
 */
export function Calendar3Week({ legend = true, linkId, pickScroll = false }: Calendar3WeekProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { threshold: 0.3, once: true });
  const [hl, setHl] = useState<Hl>(null);
  // The detail line keeps showing the last thing hovered after the pointer leaves (mockup).
  const [detail, setDetail] = useState<Hl>(null);

  const highlight = (next: Hl) => {
    setHl(next);
    if (next) setDetail(next);
  };

  // Linked steps elsewhere on the page (server-rendered markup): light up with the phase and
  // highlight the phase on hover.
  useEffect(() => {
    if (!linkId) return;
    const host = document.getElementById(linkId);
    if (!host) return;
    const linked = [...host.querySelectorAll<HTMLElement>("[data-phase]")];
    const cleanups = linked.map((l) => {
      const enter = () => {
        const next = { p: l.dataset.phase as Phase };
        setHl(next);
        setDetail(next);
      };
      const leave = () => setHl(null);
      l.addEventListener("mouseenter", enter);
      l.addEventListener("mouseleave", leave);
      return () => {
        l.removeEventListener("mouseenter", enter);
        l.removeEventListener("mouseleave", leave);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, [linkId]);

  useEffect(() => {
    if (!linkId) return;
    document.getElementById(linkId)?.querySelectorAll<HTMLElement>("[data-phase]").forEach((l) => l.classList.toggle("on", l.dataset.phase === hl?.p));
  }, [linkId, hl]);

  let n = 0;
  const dp = detail?.p;
  const detailText = detail ? (detail.k ? CAL_TIP[detail.k] : PHASE_SUMMARY[detail.p]) : CAL_HINT;
  const detailLabel = (() => {
    if (!detail || !dp) return "";
    if (!detail.k) return PHASE[dp][0];
    const [w, d] = detail.k.split("-").map(Number);
    return `${PHASE[dp][0]} · Week ${w + 1}, ${WORKDAYS[d]}`;
  })();

  return (
    <div
      ref={ref}
      className={["cal3", "interactive", seen || reduced ? "in" : "", hl ? "hl" : "", detail ? "has-detail" : ""].filter(Boolean).join(" ")}
      onMouseLeave={() => highlight(null)}
    >
      <div className="wd">
        <span />
        {CAL_WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      {CAL_PLAN.map((week, wi) => (
        <div className="wk3" key={wi}>
          <span>Week {wi + 1}</span>
          {week.map((p, di) => {
            const k = `${wi}-${di}`;
            const idx = n++;
            return (
              <button
                key={k}
                type="button"
                className={["d", hl && hl.p !== p ? "dim" : "", hl?.k === k ? "cur" : ""].filter(Boolean).join(" ")}
                data-p={p}
                data-k={k}
                style={{ "--c": PHASE[p][1], "--dl": `${idx * 0.06}s` } as React.CSSProperties}
                aria-label={`Week ${wi + 1} ${WORKDAYS[di]}: ${CAL_TIP[k]}`}
                onMouseEnter={() => highlight({ p, k })}
                onFocus={() => highlight({ p, k })}
                onClick={() => {
                  highlight({ p, k });
                  if (pickScroll) document.getElementById(`ph-${p === "live" ? "run" : p}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
                }}
              >
                {CAL_YOU[k] ? <span className="you" /> : null}
              </button>
            );
          })}
          <div className="d we" />
          <div className="d we" />
        </div>
      ))}
      <div className="run" data-p="live">
        <Icon name="run" /> {CAL_RUN_LINE}
      </div>
      <div className="cal-detail">
        <span className="cd-ph" style={dp ? ({ "--c": PHASE[dp][1] } as React.CSSProperties) : undefined}>
          {detailLabel}
        </span>
        <span className="cd-tx">{detailText}</span>
      </div>
      {legend ? (
        <div className="leg">
          {(Object.entries(PHASE) as [Phase, (typeof PHASE)[Phase]][]).map(([k, v]) => (
            <span key={k} data-p={k}>
              <i style={{ background: v[1] }} />
              {v[0]}
            </span>
          ))}
          <span>
            <i style={{ background: "#fff", borderRadius: "50%" }} />
            {CAL_NEEDS_YOU}
          </span>
        </div>
      ) : null}
    </div>
  );
}
