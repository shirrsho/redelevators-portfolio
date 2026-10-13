"use client";

import { useEffect, useRef, type RefObject } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * How far a tall pinned section has been scrolled through: 0 when its top reaches the top of
 * the viewport, 1 when its bottom reaches the bottom. Same formula as the mockup
 * (home.js measure(), site.js mountJourney): clamp(-rect.top / (height - innerHeight)).
 */
export function scrollProgress(el: Element): number {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
}

/**
 * Calls `onProgress(p)` on scroll and resize (passive) and once on mount. It does not cause
 * re-renders: drive styles from the callback, or read `scrollProgress()` inside a rAF loop.
 */
export function useScrollProgress<T extends Element>(ref: RefObject<T | null>, onProgress: (p: number) => void) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => cb.current(scrollProgress(el));
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [ref]);
}
