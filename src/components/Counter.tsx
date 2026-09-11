"use client";

import { animate, useReducedMotion } from "motion/react";
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
  const reduce = useReducedMotion();
  const dp = decimals ?? (Number.isInteger(value) ? 0 : 1);

  // The true value is what renders on the server and in the first paint, so the
  // number is correct with no JavaScript, before hydration, and for crawlers.
  // The count-up only takes over once we've confirmed the element is off-screen,
  // which means nobody ever watches a real figure reset itself to zero.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyOnScreen = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyOnScreen) return;

    setDisplay(0);

    let controls: ReturnType<typeof animate> | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;

    // Having reset to zero, we now owe the reader the real number no matter what
    // happens next. If the observer never fires at all — a suspended tab, a
    // browser that never paints this element — this deadline restores the truth.
    let deadline: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => setDisplay(value),
      4000,
    );

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        clearTimeout(deadline);
        deadline = undefined;
        controls = animate(0, value, {
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => setDisplay(v),
          onComplete: () => setDisplay(value),
        });
        // Safety net: if rAF is throttled (e.g. backgrounded tab), snap to the
        // final value so the number is never left frozen mid-count.
        safety = setTimeout(() => setDisplay(value), 2200);
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      controls?.stop();
      if (safety) clearTimeout(safety);
      if (deadline) clearTimeout(deadline);
    };
  }, [value, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(dp)}
      {suffix}
    </span>
  );
}
