"use client";

import {
  animate,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const dp = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => setDisplay(value),
    });
    // Safety net: if rAF is throttled (e.g. backgrounded tab), snap to the
    // final value so the number is never left frozen mid-count.
    const safety = setTimeout(() => setDisplay(value), 2200);
    return () => {
      controls.stop();
      clearTimeout(safety);
    };
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(dp)}
      {suffix}
    </span>
  );
}
