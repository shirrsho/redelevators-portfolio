"use client";

import { useEffect } from "react";

// Site-wide micro-interactions, ported from redesign-mockups/r3/theme.js and site.js → reveal().
// Mounted once in the root layout; works on server-rendered markup by class name, including
// content that appears after a client-side navigation.
//
// - Reveal: `.rv` (and `.weeks`) get `.in` when 15% visible: fade + 24px rise, staggered with
//   .d1x…d4x. If a client component later rewrites that element's className (React drops
//   `.in`), it is put back, so `rv` is safe on stateful elements too.
// - Spotlight: a 280px glow follows the cursor on Aurora cards (`.spot`, --mx/--my).
// - Magnetic primary buttons: `.btn.primary` leans a few px toward the cursor.
// - Count-up: <b data-count="412" data-pre="$" data-suf="%">0</b> counts up once in view.
// Reduced motion: reveals are shown at once (base.css), no magnet, counts jump to the end.

/** Cards that get the cursor spotlight (themes.css + theme.js SPOT list). */
const SPOT = ".svc,.pc,.gets>div,.sysstage,.srow,.loop .node,.fstep,.phase .vis,.band,.tier,.calc,.try,.c";
const REVEAL = ".rv:not(.in), .weeks:not(.in)";

export function SiteEffects() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- reveal on scroll
    // Once revealed, keep `.in` even if React re-renders the className.
    const keep = new MutationObserver((rs) =>
      rs.forEach((r) => {
        const el = r.target as Element;
        if (!el.classList.contains("in") && el.matches(".rv, .weeks")) el.classList.add("in");
      }),
    );
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
            keep.observe(e.target, { attributes: true, attributeFilter: ["class"] });
          }
        }),
      { threshold: 0.15 },
    );

    // ---- count-up numbers
    const counter = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          counter.unobserve(e.target);
          const el = e.target as HTMLElement;
          const end = +(el.dataset.count ?? 0), pre = el.dataset.pre ?? "", suf = el.dataset.suf ?? "";
          const show = (v: number) => (el.textContent = pre + v.toLocaleString("en-US") + suf);
          if (reduce) return void show(end);
          const t0 = performance.now();
          const tick = (now: number) => {
            const k = Math.min(1, (now - t0) / 1200);
            show(Math.round(end * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      { threshold: 0.4 },
    );

    const watched = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(REVEAL).forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
      document.querySelectorAll("[data-count]").forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        counter.observe(el);
      });
    };
    scan();
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // ---- spotlight + magnetic buttons
    const onMove = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const card = t?.closest?.(SPOT) as HTMLElement | null;
      if (card) {
        card.classList.add("spot");
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (reduce) return;
      document.querySelectorAll<HTMLElement>(".btn.primary").forEach((b) => {
        const r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + 30 && Math.abs(dy) < r.height / 2 + 30;
        b.style.translate = near ? `${dx * 0.08}px ${dy * 0.12}px` : "";
      });
    };
    addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      keep.disconnect();
      counter.disconnect();
      mo.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
