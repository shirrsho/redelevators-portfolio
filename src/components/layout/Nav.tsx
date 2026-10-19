"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { NavAsk } from "@/components/assistant/Entry";
import { EVENTS } from "@/lib/analytics";
import { NAV_LINKS, bookHref, isCurrentPath as isCurrent } from "@/lib/site";
import { Lockup } from "./Logo";
import { MobileSheet } from "./MobileSheet";

/**
 * Floating glass bar: logo · centred links · "Book a call". Darker once scrolled (> 10px).
 * Current page: soft pill + red dot (aria-current). Under 900px: logo, Book and a burger that
 * opens the full-screen MobileSheet. Mockup: site.js → navHTML, base.css "Nav".
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const book = bookHref(pathname);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  // Close the sheet on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <Link className="logo" href="/" aria-label="Red Elevators, home">
          <Lockup height={30} cssSized />
        </Link>
        <nav className="links" aria-label="Main">
          {NAV_LINKS.map((l) => {
            const on = isCurrent(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={on ? "on" : undefined}
                aria-current={on ? "page" : undefined}
                data-umami-event={EVENTS.navClick}
                data-umami-event-location="header"
                data-umami-event-label={l.label}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="nav-r">
          <NavAsk />
          <a className="book" href={book} data-umami-event={EVENTS.bookCall} data-umami-event-location="nav-desktop">
            Book a call
          </a>
          <button
            type="button"
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="msheet"
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>
      <MobileSheet open={open} onClose={close} pathname={pathname} />
    </>
  );
}
