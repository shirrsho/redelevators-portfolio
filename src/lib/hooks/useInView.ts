"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  /** Fraction of the element that must be visible (mockup values: .15–.4). */
  threshold?: number;
  rootMargin?: string;
  /** Stay true after the first time it enters (reveals, "play once"). Default false. */
  once?: boolean;
};

/**
 * Whether `ref` is on screen. Use it to start time-driven demos when they enter the viewport
 * and pause them when they leave (DESIGN-SYSTEM → Motion principles).
 */
export function useInView<T extends Element>(ref: RefObject<T | null>, { threshold = 0, rootMargin, once = false }: Options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (once && e.isIntersecting) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return inView;
}
