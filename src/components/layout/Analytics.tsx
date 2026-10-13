"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

// Page-level Umami events that no single button owns. Mounted once in the
// root layout.
//
// - Scroll depth: "Scroll 50%" / "Scroll 75%" / "Scroll 100%", once each per
//   page view. Separate event names (not one event with a depth property)
//   so each can be picked directly as a Goal or Funnel step in Umami. Only
//   fires after a real scroll, so short pages don't log 100% on load.
// - Outbound links: any click on a link to another site that isn't already
//   tagged with data-umami-event (the booking and email links are).
const DEPTHS = [50, 75, 100];

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const fired = new Set<number>();
    let ticking = false;

    const check = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      // 98% counts as the bottom — footers rarely let you hit exactly 100.
      const pct = Math.min(100, (window.scrollY / scrollable) * 100 + 2);
      for (const d of DEPTHS) {
        if (pct >= d && !fired.has(d)) {
          fired.add(d);
          track(`Scroll ${d}%`);
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.dataset.umamiEvent) return;
      if (!a.protocol.startsWith("http") || a.host === window.location.host) return;
      track("Outbound link", { url: a.href, domain: a.hostname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

/** Fires one event when mounted — e.g. the 404 page logging the bad URL. */
export function TrackOnMount({ name }: { name: string }) {
  useEffect(() => {
    track(name, {
      path: window.location.pathname,
      referrer: document.referrer || "direct",
    });
  }, [name]);
  return null;
}
