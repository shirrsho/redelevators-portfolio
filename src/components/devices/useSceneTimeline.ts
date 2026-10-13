"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * One-shot scene start: true `delay` ms after `ref` is first 30% in view (the mockups' "play
 * once" scenes: editor, frames, site, funnel). Reduced motion: true straight away.
 */
export function useSceneStart(ref: RefObject<Element | null>, delay = 0): boolean {
  const reduced = useReducedMotion();
  const seen = useInView(ref, { threshold: 0.3, once: true });
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!seen || reduced) return;
    const id = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(id);
  }, [seen, reduced, delay]);
  return reduced || go;
}

/**
 * A looping scene clock for the hero demos. Returns the time (ms) of the latest cue reached in
 * the current cycle, -1 before the first cue. Scenes derive everything from it
 * (`t >= 300 + i * 700` → row i is in), which is how the mockups' setTimeout chains read.
 *
 * - Runs only while `active` (gate it on visibility) and restarts the cycle every `period` ms.
 * - Reduced motion: returns Infinity, so every `t >= x` is true: the scene's final state.
 * - `cues` must be a module-level constant (sorted, ms).
 */
export function useSceneTimeline(cues: readonly number[], period: number, active: boolean): number {
  const reduced = useReducedMotion();
  const [t, setT] = useState(-1);

  useEffect(() => {
    if (reduced || !active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      timers.length = 0;
      timers.push(setTimeout(() => setT(-1), 0));
      cues.forEach((c) => timers.push(setTimeout(() => setT(c), Math.max(c, 1))));
      timers.push(setTimeout(cycle, period));
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [cues, period, active, reduced]);

  return reduced ? Infinity : t;
}

/** Sorted, de-duplicated cue list from loose numbers. */
export const cueList = (...times: number[]) => [...new Set(times)].sort((a, b) => a - b);
