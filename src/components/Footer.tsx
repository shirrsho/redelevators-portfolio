import { Wordmark } from "./Mark";
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
              <div className="font-mono-label !text-muted">Explore</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      className="text-ink-soft transition-colors hover:text-red"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono-label !text-muted">Contact</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:hello@redelevators.com"
                    className="text-ink-soft transition-colors hover:text-red"
                  >
                    hello@redelevators.com
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
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
          <span className="font-mono-label !text-muted !tracking-[0.18em]">
            © 2026 Red Elevators
          </span>
          <span className="font-mono-label !text-muted !tracking-[0.18em]">
            Growth on Autopilot
          </span>
        </div>
      </div>
    </footer>
  );
}
