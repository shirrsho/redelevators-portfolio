"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JOURNEY } from "@/lib/journey";
import { prefersReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";

export type JourneyProps = {
  /**
   * Home ch.04: the section holds while vertical scroll moves the 7 cards sideways (section
   * height = viewport + travel × 1.1 + 25vh), the current card highlighted, arrows scroll the
   * page. Place it inside `<section className="section"><div className="jpin"><div className="wrap">…`:
   * Journey pins its closest <section> (adds `.jpinned`, sets its height), as mountJourney({pin})
   * does. Reduced motion falls back to the swipe version.
   * Default false: swipe version (scroll-snap, arrows, progress) used on /systems.
   */
  pinned?: boolean;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const LAST = JOURNEY.length - 1;

/**
 * One booking, start to finish: 7 cards (guest sees / system does), progress bar, arrows and
 * "n / 7". Root element is `.journey`. Used by Home ch.04 (Track D, pinned) and /systems.
 * Mockup: site.js → mountJourney, sections.css .journey / .fstep / pinned journey.
 * Data: src/lib/journey.ts.
 *
 * The server renders the swipe version with card 1 current. The pinned mode is switched on after
 * mount (it needs the closest <section> and the viewport height), as the mockup does.
 */
export function Journey({ pinned = false }: JourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  // mockup show(f): progress bar (never under 8%), the "n / 7" counter, `.on` up to the current card
  const show = useCallback((f: number) => {
    if (barRef.current) barRef.current.style.width = `${Math.max(8, f * 100)}%`;
    setIdx(Math.round(f * LAST));
  }, []);

  // ---- pinned: the section holds still and vertical scroll drives the cards sideways
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const sec = root?.closest("section");
    if (!pinned || !root || !track || !sec || prefersReducedMotion()) return;

    // apply the pinned styles before measuring (phones size the cards at 80vw only when pinned);
    // React renders the same class from `isPinned`
    root.classList.add("pinned");
    setIsPinned(true);
    sec.classList.add("jpinned");
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".fstep"));
    let max = 0;
    const travel = () => sec.offsetHeight - innerHeight;
    const progress = () => clamp(-sec.getBoundingClientRect().top / Math.max(1, travel()));
    const update = () => {
      const f = progress();
      track.style.transform = `translateX(${-f * max}px)`;
      show(f);
    };
    let sizedW = 0;
    const size = () => {
      sizedW = innerWidth;
      const last = cards[cards.length - 1];
      max = Math.max(0, last.offsetLeft + last.offsetWidth - track.clientWidth);
      sec.style.height = `${innerHeight + max * 1.1 + innerHeight * 0.25}px`;
      update();
    };
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLElement>(".jb");
      if (!b) return;
      const i = clamp(Math.round(progress() * LAST) + Number(b.dataset.d), 0, LAST);
      scrollTo({ top: sec.getBoundingClientRect().top + scrollY + (i / LAST) * travel(), behavior: "smooth" });
    };
    addEventListener("scroll", update, { passive: true });
    // phone browsers resize the viewport when their toolbars slide in and out while you scroll;
    // re-sizing the section then would jump the page, so only a width change counts
    const onResize = () => innerWidth !== sizedW && size();
    addEventListener("resize", onResize);
    root.addEventListener("click", onClick);
    size();
    const late = setTimeout(size, 600);
    return () => {
      clearTimeout(late);
      removeEventListener("scroll", update);
      removeEventListener("resize", onResize);
      root.removeEventListener("click", onClick);
      root.classList.remove("pinned");
      sec.classList.remove("jpinned");
      sec.style.height = "";
      track.style.transform = "";
      setIsPinned(false);
    };
  }, [pinned, show]);

  // ---- swipe: scroll-snap track, arrows, progress
  const onScroll = () => {
    const t = trackRef.current;
    if (!t || isPinned) return;
    const max = t.scrollWidth - t.clientWidth;
    show(max > 0 ? t.scrollLeft / max : 0);
  };
  const step = (d: number) => {
    const t = trackRef.current;
    if (!t || isPinned) return; // pinned arrows are handled by the effect above
    const card = t.querySelector<HTMLElement>(".fstep");
    t.scrollBy({ left: d * ((card?.offsetWidth ?? 360) + 20), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div ref={rootRef} className={`journey${isPinned ? " pinned" : ""}`}>
      <div
        ref={trackRef}
        className="jtrack"
        onScroll={onScroll}
        {...(isPinned ? {} : { tabIndex: 0, role: "region", "aria-label": "The seven steps of one booking. Scroll sideways." })}
      >
        {JOURNEY.map(([icon, title, when, guest, tools, does], i) => (
          <div key={title} className={`fstep${i <= idx ? " on" : ""}${i === idx ? " cur" : ""}`} data-i={i}>
            <div className="top">
              <div className="ico-tile">
                <Icon name={icon} />
              </div>
              <h4>{title}</h4>
              <span className="mono">{when}</span>
            </div>
            <div className="lane">
              <span className="mono">Guest sees</span>
              <div style={{ display: "grid", gap: 6 }}>
                {guest.map(([dir, text]) => (
                  <div key={text} className={`bub ${dir}`}>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="lane">
              <span className="mono">System does</span>
              <div className="sys">
                <span className="lg">
                  {tools.map((t) => (
                    <ToolLogo key={t} name={t} size={16} />
                  ))}
                </span>
                <span>{does}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="jctl">
        <button className="jb" data-d="-1" aria-label="Previous step" onClick={() => step(-1)}>
          <Icon name="arrow" />
        </button>
        <div className="progress" style={{ margin: 0, flex: 1 }}>
          <i ref={barRef} style={{ width: "8%" }} />
        </div>
        <button className="jb" data-d="1" aria-label="Next step" onClick={() => step(1)}>
          <Icon name="arrow" />
        </button>
        <span className="mono jc" aria-live="off">
          {idx + 1} / {JOURNEY.length}
        </span>
      </div>
    </div>
  );
}
