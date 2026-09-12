import type { ReactNode } from "react";

/**
 * The page-header pattern for every non-home page — workstream D, item 2.
 * Ported from the "Page header" proposal in docs/design-system.html: the same
 * mono-label + headline rhythm as the hero, without the chart, so a page
 * establishes itself in one clause for a cold arrival from search.
 *
 * Renders the page's one <h1> (The One Column Rule's sibling: exactly one h1
 * per page — see docs/brief-service-page.md). Server component: nothing here
 * needs to wait on hydration (audit finding F4's lesson applied up front).
 */
export function PageHeader({
  label,
  title,
  intro,
  actions,
}: {
  label: string;
  title: string;
  intro?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="max-w-2xl">
          <span className="font-mono-label">{label}</span>
          <h1 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
            {title}
          </h1>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
