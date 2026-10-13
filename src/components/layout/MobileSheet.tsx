"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { EVENTS } from "@/lib/analytics";
import { NAV_LINKS, bookHref, isCurrentPath as isCurrent } from "@/lib/site";
import { EmailLink } from "@/components/ui/EmailLink";

/**
 * Full-screen menu under 900px: 34px links with a one-line hint each (staggered in), then
 * Book + email. Closes on a link click and on Escape, locks page scroll while open
 * (body.menu-open, which also turns the burger into an X). Mockup: site.js burger, base.css .msheet.
 */
export function MobileSheet({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onClose();
      document.querySelector<HTMLButtonElement>(".burger")?.focus();
    };
    addEventListener("keydown", onKey);
    // Move focus into the sheet so keyboard users land on the first link (after the visibility
    // transition has started; a still-hidden element can't take focus).
    const t = setTimeout(() => ref.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true }), 60);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open, onClose]);

  const book = bookHref(pathname);

  return (
    <div
      ref={ref}
      className="msheet"
      id="msheet"
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => {
        if ((e.target as Element).closest("a")) onClose();
      }}
    >
      <nav aria-label="Mobile">
        {NAV_LINKS.map((l, i) => {
          const on = isCurrent(pathname, l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{ "--i": i } as CSSProperties}
              className={on ? "on" : undefined}
              aria-current={on ? "page" : undefined}
              data-umami-event={EVENTS.navClick}
              data-umami-event-location="mobile"
              data-umami-event-label={l.label}
            >
              <span>{l.label}</span>
              <small>{l.hint}</small>
            </Link>
          );
        })}
      </nav>
      <div className="ms-foot" style={{ "--i": 5 } as CSSProperties}>
        <a className="btn primary" href={book} data-umami-event={EVENTS.bookCall} data-umami-event-location="nav-mobile">
          Book a free 30-min call
        </a>
        <EmailLink location="mobile" />
      </div>
    </div>
  );
}
