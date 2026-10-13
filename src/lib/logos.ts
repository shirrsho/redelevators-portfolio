import { toolLogos, type ToolLogo } from "./toolLogos";

// Tool marks, as the mockup's logos.js / icons.js `logo()` helper draws them.
// The paths live in toolLogos.ts (identical to redesign-mockups/r3/logos.js).

const BY_TITLE: Record<string, ToolLogo> = Object.fromEntries(toolLogos.map((l) => [l.title, l]));

/** Names used in the copy that map to a differently named mark. */
export const LOGO_ALIAS: Record<string, string> = { "Meta Ads": "Meta" };

export function getLogo(name: string): ToolLogo | undefined {
  return BY_TITLE[LOGO_ALIAS[name] ?? name];
}

/** Brand fill for a dark UI: near-black brands render light, `mono` uses currentColor. */
export function logoFill(logo: ToolLogo, mono = false): string {
  if (mono) return "currentColor";
  const h = parseInt(logo.hex, 16);
  const lum = (0.2126 * (h >> 16) + 0.7152 * ((h >> 8) & 255) + 0.0722 * (h & 255)) / 255;
  return lum < 0.18 ? "#ededed" : `#${logo.hex}`;
}

/**
 * The same SVG as a string, for static scene markup that is stored as HTML
 * (src/lib/runs.ts). Components should use <ToolLogo> instead.
 */
export function logoSvg(name: string, size = 16, mono = false): string {
  const l = getLogo(name);
  if (!l) return `<span class="lp-txt">${name}</span>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-label="${l.title}" role="img"><path fill="${logoFill(l, mono)}" d="${l.path}"/></svg>`;
}
