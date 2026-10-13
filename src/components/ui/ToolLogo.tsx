import { getLogo, logoFill } from "@/lib/logos";

type Props = {
  /** Tool name as it appears in the copy ("Airbnb", "Meta Ads", "Guesty"…). */
  name: string;
  /** Square size in px. */
  size?: number;
  /** Draw in currentColor (on a brand-coloured tile). */
  mono?: boolean;
  /**
   * Mark missing from the set (Guesty, PriceLabs…): "monogram" shows the name as small text
   * (mockup toolMark: never under 11px), "none" renders nothing.
   */
  fallback?: "monogram" | "none";
  className?: string;
};

/**
 * Official tool mark (simple-icons paths, src/lib/toolLogos.ts). Near-black brands render
 * light on dark. Mockup: icons.js → logo(), site.js → toolMark().
 */
export function ToolLogo({ name, size = 16, mono = false, fallback = "monogram", className }: Props) {
  const l = getLogo(name);
  if (!l) {
    if (fallback === "none") return null;
    return (
      <span className={`lp-txt${className ? ` ${className}` : ""}`} style={{ fontSize: Math.max(11, Math.round(size * 0.42)) }}>
        {name}
      </span>
    );
  }
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={l.title}>
      <path fill={logoFill(l, mono)} d={l.path} />
    </svg>
  );
}

/** Logo + name in a pill (mockup: toolPill / .logo-pill). Text-only when there is no mark. */
export function ToolPill({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <span className="logo-pill">
      <ToolLogo name={name} size={size} fallback="none" />
      <span>{name}</span>
    </span>
  );
}
