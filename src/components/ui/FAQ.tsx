import type { ReactNode } from "react";

/**
 * Accordion on native <details> (keyboard and screen readers for free), first item open.
 * Server component: the answers are in the HTML. Mockup: sections.css .faq.
 */
export function FAQ({ items, className }: { items: readonly (readonly [question: ReactNode, answer: ReactNode])[]; className?: string }) {
  return (
    <div className={`faq${className ? ` ${className}` : ""}`}>
      {items.map(([q, a], i) => (
        <details key={i} open={i === 0}>
          <summary>
            {q}
            <i aria-hidden="true">+</i>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
