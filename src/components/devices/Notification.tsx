import type { CSSProperties, ReactNode, Ref } from "react";
import { MarkSolid } from "@/components/layout/Logo";

// A lock-screen notification (.n in src/styles/devices.css). Shared (Stage 1, frozen): the story
// phone (D), the alive phone (C), the assistant handoff and the 404 phone (A) all use this markup.
//
// States are classes: "focus" (amber ring), "dim", "lifted" (left the phone: dashed amber ghost
// slot), "done" (handled: green, `landed` flash), plus the alive phone's "quiet", "nudge", "ghost"
// and "in". The story positions cards with inline transforms; pass them via `style` or the ref.

export type NotificationProps = {
  /** Tile content: <Icon/>, <ToolLogo mono/>… Ignored when `mark` is set. */
  icon?: ReactNode;
  /** Tile background (brand colour of the app). */
  iconBg?: string;
  /** Red Elevators tile: the bars-only mark on #111. */
  mark?: boolean;
  /** Header left (app name, "✓ Handled for you") and right ("now", "6m ago"). Shown uppercase. */
  app: ReactNode;
  ago: ReactNode;
  title: ReactNode;
  /** Body, clamped to 2 lines (may contain <mark> for the highlighted phrase). */
  body: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Renders an <a> (the alive phone's nudge). External links open in a new tab. */
  href?: string;
  ref?: Ref<HTMLDivElement & HTMLAnchorElement>;
};

export function Notification({ icon, iconBg, mark, app, ago, title, body, className, style, href, ref }: NotificationProps) {
  const cls = `n${className ? ` ${className}` : ""}`;
  const inner = (
    <>
      <div className={`ic${mark ? " mark" : ""}`} style={{ background: mark ? (iconBg ?? "#111") : iconBg }}>
        {mark ? <MarkSolid /> : icon}
      </div>
      <div className="hd">
        <span>{app}</span>
        <span>{ago}</span>
      </div>
      <div className="tt">{title}</div>
      <div className="bd">{body}</div>
    </>
  );
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a ref={ref} href={href} className={cls} style={style} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <div ref={ref} className={cls} style={style}>
      {inner}
    </div>
  );
}
