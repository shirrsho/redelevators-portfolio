"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `frame(timeMs)` on every animation frame while `active` is true, and stops the loop
 * when it turns false (gate it on visibility: `useRafLoop(step, inView)`).
 * The latest `frame` is always used, so it may close over fresh state without restarting.
 */
export function useRafLoop(frame: (now: number) => void, active = true) {
  const ref = useRef(frame);
  useEffect(() => {
    ref.current = frame;
  });

  useEffect(() => {
    if (!active) return;
    let id = requestAnimationFrame(function loop(now) {
      ref.current(now);
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, [active]);
}
