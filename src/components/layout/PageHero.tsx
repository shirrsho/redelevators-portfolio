import type { CSSProperties, ReactNode } from "react";

/**
 * Inner-page hero (the homepage uses the story instead).
 * - split: copy left, a live visual right, filling the first screen (min-height 100vh − 76px);
 *   the visual gets the Aurora glow behind it and drops below the copy under 900px.
 * - short: copy only (Pricing, Contact, Privacy), then the page’s tool starts. (Systems is a
 *   split hero with the control room.)
 * Exactly one H1 per page, inside `children`. Mockup: sections.css .phero.
 */
export function PageHero({
  variant = "split",
  visual,
  visualStyle,
  children,
  className,
  id,
}: {
  variant?: "split" | "short";
  /** Right-hand visual (split only). Client components are fine here. */
  visual?: ReactNode;
  /** Inline style on the visual column (Approach: `{ minHeight: "auto" }`). */
  visualStyle?: CSSProperties;
  /** The copy column: eyebrow / breadcrumb, H1, lead, CTAs. */
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`wrap phero${variant === "short" ? " short" : ""}${className ? ` ${className}` : ""}`}>
      <div className="rv">{children}</div>
      {variant === "split" && visual ? <div className="visual rv d2x" style={visualStyle}>{visual}</div> : null}
    </section>
  );
}
