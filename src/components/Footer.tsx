import Link from "next/link";
import { Wordmark } from "./Mark";
import { EmailLink } from "./EmailLink";
import { nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Wordmark size={18} />
            <p className="mt-4 text-sm text-muted">
              A marketing &amp; automation agency building the systems behind
              your growth. Growth on autopilot.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <div className="font-mono-label text-muted">Explore</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {/* Link, not <a> — every nav entry is a real route now (the
                    last `/#anchor` went on 12 Sep 2026), and a bare <a> would
                    full-reload the site on every footer click. scroll={false}
                    for the same reason every other Link carries it: Nav.tsx
                    owns scroll positioning (see CLAUDE.md, "Known traps"). */}
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      scroll={false}
                      className="text-ink-soft transition-colors hover:text-red"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono-label text-muted">Contact</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {/* pb-4, not the list's own space-y-2.5, makes room for the
                    "Copied to clipboard" tooltip EmailLink shows on click —
                    that gap alone (10px) let the tooltip land on top of
                    "Book a call" right below it. Fixed 12 Sep 2026. */}
                <li className="pb-6">
                  <EmailLink
                    email="contact@redelevators.com"
                    className="text-ink-soft transition-colors hover:text-red"
                  />
                </li>
                <li>
                  <a
                    href="https://calendly.com/redelevators/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft transition-colors hover:text-red"
                  >
                    Book a call
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-8 sm:flex-row sm:items-center">
          <span className="font-mono-label text-muted tracking-[0.18em]">
            © 2026 Red Elevators
          </span>
          <span className="font-mono-label text-muted tracking-[0.18em]">
            Growth on Autopilot
          </span>
        </div>
      </div>
    </footer>
  );
}
