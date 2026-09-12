import type { ManualStep, SystemAnatomy as SystemAnatomyData } from "@/lib/content";
import { SystemAnatomy } from "./SystemAnatomy";

/**
 * "The Handover" — the service page's focal moment (docs/brief-service-page.md
 * §3). A comparison, not two unrelated diagrams: what happens today, stacked
 * directly above what happens after. Manual chain first, automated chain
 * second — the same order on mobile and desktop, so the argument reads the
 * same way at every width and never needs a side-by-side column that could
 * invite horizontal scroll.
 *
 * The manual chain carries no tool names and no red — grey and hairline, a
 * person marked at every step, per the brief's hard constraint against
 * smuggling in fabricated numbers as atmosphere. The automated chain is the
 * System Anatomy component, reused rather than reinvented, exactly as it
 * ships on the home page.
 *
 * Server component — nothing here depends on hydration.
 */
export function Handover({
  manual,
  automated,
}: {
  manual: ManualStep[];
  automated: SystemAnatomyData;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="font-mono-label text-muted">Today</span>
        <ManualChain steps={manual} />
      </div>
      <div>
        <span className="font-mono-label">{automated.label}</span>
        <p className="mt-2 max-w-lg text-[0.95rem] text-muted">{automated.desc}</p>
        <SystemAnatomy nodes={automated.nodes} />
      </div>
    </div>
  );
}

function ManualChain({ steps }: { steps: ManualStep[] }) {
  return (
    <ol className="mt-7 flex list-none flex-col lg:flex-row lg:items-stretch">
      {steps.map((s, i) => (
        <li key={i} className="contents">
          {i > 0 && (
            <span
              aria-hidden
              className="flex shrink-0 items-center justify-center basis-[34px] lg:basis-10"
            >
              <span className="h-[26px] w-px bg-line lg:h-px lg:w-full" />
            </span>
          )}
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-cream p-4">
            <PersonIcon />
            <span className="text-[0.9375rem] text-ink-soft">{s.note}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PersonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-muted"
    >
      <circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.5 14c0-2.8 2.5-4.6 5.5-4.6s5.5 1.8 5.5 4.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
