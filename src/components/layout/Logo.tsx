/* eslint-disable @next/next/no-img-element -- static SVG lockups: next/image would only pass them through */
import type { CSSProperties } from "react";

// Logo rules (DESIGN-SYSTEM → Logo):
// - Lockup without tagline in the nav (30px, 26px on phones; base.css sets the size) and footer (34px).
// - Light lockup on paper (documents, call summary) at 22px+.
// - Full mark (bars + particles) at 32px and up; bars-only below 32px (avatars, tiles, favicon).
// - Never stretch it (scale by height only), recolour the bars, or put it on busy colour.

const LOCKUP_RATIO = 321.76 / 70.6;

/**
 * The rebuilt lockup as an <img>. Height in px; width follows. `cssSized` leaves the size to
 * the stylesheet (the nav: 30px, 26px under 900px), keeping width/height only for layout.
 */
export function Lockup({
  height,
  tone = "dark",
  cssSized = false,
  className,
  style,
}: {
  height: number;
  tone?: "dark" | "light";
  cssSized?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={`/brand/logo-lockup-${tone}.svg`}
      alt="Red Elevators"
      width={Math.round(height * LOCKUP_RATIO)}
      height={height}
      className={className}
      style={cssSized ? style : { height, width: "auto", ...style }}
    />
  );
}

/** Bars-only mark (under 32px: notification tiles, avatars). Decorative. Mockup: MARK. */
export function MarkSolid({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="2 44 52 48" aria-hidden="true" className={className} style={style}>
      <rect x="4" y="74" width="12" height="16" rx="4" fill="#FF2D3B" />
      <rect x="22" y="64" width="12" height="26" rx="4" fill="#FF2D3B" />
      <rect x="40" y="46" width="12" height="44" rx="4" fill="#FF2D3B" />
    </svg>
  );
}

/** Full mark with the rising particles (32px and up: orbit centre, large tiles). Decorative. Mockup: MARK_FULL. */
export function MarkFull({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="4 19.4 53.2 70.6" aria-hidden="true" className={className} style={style}>
      <rect x="4" y="74" width="12" height="16" rx="4" fill="#FF2D3B" />
      <rect x="22" y="64" width="12" height="26" rx="4" fill="#FF2D3B" />
      <rect x="40" y="46" width="12" height="44" rx="4" fill="#FF2D3B" />
      <circle cx="46" cy="38" r="4" fill="#FF2D3B" opacity=".85" />
      <circle cx="54" cy="30" r="3.2" fill="#FF2D3B" opacity=".55" />
      <circle cx="44" cy="22" r="2.6" fill="#FF0000" />
    </svg>
  );
}
