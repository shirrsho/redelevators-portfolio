"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { Wordmark } from "./Mark";
import { nav } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // The logo always goes home from anywhere on the site. On the home page
  // itself there's nowhere to navigate to, so it smooth-scrolls to top
  // instead — this used to be a bare `href="#top"`, which only worked on
  // the home page (the only place an element with id="top" exists) and
  // silently did nothing everywhere else. Fixed 12 Sep 2026.
  function handleLogoClick(e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <div
          className={`flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5 ${
            scrolled
              ? "border-line bg-white/80 shadow-soft backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link href="/" onClick={handleLogoClick} aria-label="Red Elevators home">
            <Wordmark size={17} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 sm:block"
            >
              Book a call
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink md:hidden"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-5 bg-ink transition-transform ${
                    open ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-ink transition-opacity ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-ink transition-transform ${
                    open ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2 px-6 pt-28">
              {nav.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-xl bg-red px-5 py-4 text-center text-base font-semibold text-white"
              >
                Book a free Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
