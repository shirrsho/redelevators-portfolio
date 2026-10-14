import type { CSSProperties, ReactNode } from "react";
import { PILLAR_LABEL, type Pillar } from "@/lib/services";

/**
 * State chip with a dot: problem = amber, handled = green, brand = red, plain = grey.
 * Chips carry state; tags carry the pillar. Mockup: base.css .chip.
 */
export function Chip({ tone, children, className }: { tone?: "problem" | "handled" | "brand"; children: ReactNode; className?: string }) {
  return (
    <span className={["chip", tone, className].filter(Boolean).join(" ")}>
      <i />
      {children}
    </span>
  );
}

/** Pillar tag (mono): auto = indigo, mkt = coral. Label defaults to the pillar name. Mockup: base.css .tag. */
export function Tag({ pillar, children, className }: { pillar?: Pillar; children?: ReactNode; className?: string }) {
  return <span className={["tag", pillar, className].filter(Boolean).join(" ")}>{children ?? (pillar ? PILLAR_LABEL[pillar] : null)}</span>;
}

/** Small mono label above a heading, with the gradient dot. `center` for centred heads. Mockup: .eyebrow. */
export function Eyebrow({ children, center, className, style }: { children: ReactNode; center?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <div className={`eyebrow${className ? ` ${className}` : ""}`} style={center ? { justifyContent: "center", ...style } : style}>
      <i />
      {children}
    </div>
  );
}
