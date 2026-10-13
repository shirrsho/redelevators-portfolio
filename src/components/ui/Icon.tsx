import type { CSSProperties } from "react";
import { ICONS, type IconName } from "@/lib/icons";

/**
 * Line icon (24px grid, 1.6px stroke). Decorative: always aria-hidden; label the control
 * around it instead. Default class `ico` = 22px (base.css); pass a className to resize.
 * Mockup: icons.js → ico(name, cls).
 */
export function Icon({ name, className = "ico", style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

/** The 16×11 arrow used inside primary buttons (mockup: ARROW). */
export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M0 5.5H14.6M10.3 1.2L14.9 5.5L10.3 9.8" />
    </svg>
  );
}
