import type { AnatomyNode } from "@/lib/content";

/**
 * The system's proof device: a workflow drawn end to end, each node naming the
 * tool it runs in. A red pulse travels the wire on a loop.
 *
 * Deliberately a server component — the nodes and wires are static markup, and
 * the pulse is pure CSS. Nothing here is invisible until JavaScript arrives.
 * The chain runs horizontally from `lg` and stacks vertically below it; it
 * never scrolls sideways.
 */
export function SystemAnatomy({ nodes }: { nodes: AnatomyNode[] }) {
  return (
    <ol className="mt-7 flex list-none flex-col lg:flex-row lg:items-stretch">
      {nodes.map((n, i) => (
        <li key={n.action} className="contents">
          {i > 0 && (
            <span
              aria-hidden
              className="relative flex shrink-0 items-center justify-center basis-[34px] lg:basis-10"
            >
              <span className="h-[26px] w-px bg-line lg:h-px lg:w-full" />
              <span
                className="anat-dot absolute h-[7px] w-[7px] rounded-full bg-red"
                style={{ "--i": i - 1 } as React.CSSProperties}
              />
            </span>
          )}
          <div
            className="anat-node flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl border border-line bg-white p-4"
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="font-mono-label text-[0.625rem] tracking-[0.16em] text-muted">
              {n.step}
            </span>
            <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-[-0.03em] text-ink">
              {n.action}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-ink-soft">
              {n.tool}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
