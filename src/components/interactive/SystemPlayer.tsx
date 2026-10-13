// STUB: owned by track B
import type { ServiceSlug } from "@/lib/services";
import { StubBox } from "@/components/ui/StubBox";

export type SystemPlayerProps = {
  /**
   * Fixed to one system (service pages: no tabs, link "See all eight systems →", analytics
   * source "service-page"). Without `tabs` it is the only system shown; with `tabs` it is the
   * starting tab. Default: the first service.
   */
  service?: ServiceSlug;
  /** Show the 8 named tabs (role=tablist, arrow keys; sticky chips under 860px). Systems page. */
  tabs?: boolean;
  /** Keep `#<slug>` in the URL in sync, and select from it on load and on hashchange. Systems page. */
  hash?: boolean;
};

/**
 * "Watch one run": the device scene on the left (what the guest or owner sees), the steps on
 * the right with timecodes, tool logos and the four part labels, a legend, the result strip.
 * Plays when ≥35% visible (steps 1.3s then 1.5s), Replay; fixed min-height so switching never
 * jumps. Fires "System play" { system, source }.
 * Used by /systems (Track B: tabs + hash) and every /services/[slug] page (Track A: `service`).
 * Mockup: player.js → mountPlayer, sections.css (player). Data: src/lib/runs.ts.
 */
export function SystemPlayer({ service, tabs = false, hash = false }: SystemPlayerProps) {
  return <StubBox name="SystemPlayer" track="B" minHeight={700} note={[service && `service="${service}"`, tabs && "tabs", hash && "hash"].filter(Boolean).join(" · ") || undefined} />;
}
