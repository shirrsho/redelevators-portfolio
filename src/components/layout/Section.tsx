import type { CSSProperties, ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Chip";

/**
 * A page section: 140px vertical padding (96px under 900px), content in the 1240px column.
 * Mockup: base.css .section + .wrap. Pages that need the mockup's tighter variants pass a style
 * (e.g. `style={{ paddingTop: 20 }}`), as the mockup does inline.
 */
export function Section({
  id,
  className,
  style,
  children,
  wrapClassName,
}: {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Extra classes on the inner .wrap. */
  wrapClassName?: string;
}) {
  return (
    <section id={id} className={`section${className ? ` ${className}` : ""}`} style={style}>
      <div className={`wrap${wrapClassName ? ` ${wrapClassName}` : ""}`}>{children}</div>
    </section>
  );
}

/**
 * Section head: eyebrow + H2 on the left, optional small note (or a control, `aside`) on the
 * right; stacks under 900px. Title is ReactNode so it can carry <br/> and <em>.
 * Mockup: base.css .head; the eyebrow→title gap is 18px (14px in a few places: `gap={14}`).
 */
export function SectionHead({
  eyebrow,
  title,
  note,
  noteMaxWidth = 300,
  aside,
  gap = 18,
  as: H = "h2",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  note?: ReactNode;
  noteMaxWidth?: number;
  /** Replaces the note, e.g. the pillar filter tabs. */
  aside?: ReactNode;
  gap?: 14 | 18;
  as?: "h1" | "h2";
}) {
  return (
    <div className="head">
      <div className="left rv">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H className="d2" style={{ marginTop: gap }}>
          {title}
        </H>
      </div>
      {aside ??
        (note ? (
          <p className="small rv d1x" style={{ maxWidth: noteMaxWidth }}>
            {note}
          </p>
        ) : null)}
    </div>
  );
}
