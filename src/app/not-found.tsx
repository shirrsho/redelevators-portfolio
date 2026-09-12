import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * The 404 — workstream D, item 5. First of the still-undesigned states to
 * ship; kept deliberately plain rather than inventing a fuller "error state
 * system" ahead of the brief that gap still needs (see DESIGN.md → Planned
 * system extensions). Reuses Nav/Footer so a wrong turn still feels like
 * this site, not a framework default.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[70vh] items-center">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <span className="font-mono-label">404</span>
          <h1 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
            This page took a different route.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted">
            Whatever you were looking for isn&apos;t here. It might not be built yet.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white shadow-red transition-transform hover:scale-[1.03] active:scale-95"
            >
              Back home
            </Link>
            <Link
              href="/#services"
              className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-cream"
            >
              See what we do
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
