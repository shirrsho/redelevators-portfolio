import type { ServiceHeroKind } from "@/lib/services";
import { ServiceHeroAd } from "./ServiceHeroAd";
import { ServiceHeroEditor } from "./ServiceHeroEditor";
import { ServiceHeroEmail } from "./ServiceHeroEmail";
import { ServiceHeroFrames } from "./ServiceHeroFrames";
import { ServiceHeroFunnel } from "./ServiceHeroFunnel";
import { ServiceHeroInbox } from "./ServiceHeroInbox";
import { ServiceHeroNight } from "./ServiceHeroNight";
import { ServiceHeroSite } from "./ServiceHeroSite";
import styles from "./serviceHero.module.css";

const SCENES: Record<ServiceHeroKind, () => React.JSX.Element> = {
  chat: ServiceHeroInbox,
  chat2: ServiceHeroNight,
  email: ServiceHeroEmail,
  editor: ServiceHeroEditor,
  ad: ServiceHeroAd,
  frames: ServiceHeroFrames,
  site: ServiceHeroSite,
  funnel: ServiceHeroFunnel,
};

/**
 * The hero scene of a service page, one per service (service.html → HERO map). Goes in the
 * `visual` slot of PageHero. The wrapper is `display: contents`, so the scene's laptop / phone /
 * chip are direct layout children of `.phero .visual`, as in the mockup; it only carries the
 * scoped scene CSS (serviceHero.module.css). Under 900px the laptops become screen cards.
 * Loops start in view and pause out of view; reduced motion shows the final state.
 */
export function ServiceHero({ kind }: { kind: ServiceHeroKind }) {
  const Scene = SCENES[kind];
  return (
    <div className={styles.scene}>
      <Scene />
    </div>
  );
}
