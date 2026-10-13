// STUB: owned by track A
import Link from "next/link";
import { EVENTS } from "@/lib/analytics";
import { getService, type ServiceSlug } from "@/lib/services";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Chip";
import { StubBox } from "@/components/ui/StubBox";

export type ServiceCardProps = {
  slug: ServiceSlug;
  /** Faded out by the pillar filter on Home ch.05 (`.svc.off`). */
  dimmed?: boolean;
  /** Reveal stagger: .d1x…d4x (Home uses (index % 4) + 1). */
  delay?: 1 | 2 | 3 | 4;
  /** data-umami-event-location for "Service click" (home, related…). */
  location?: string;
};

/**
 * Service card: looping mini demo (VIZ), icon, pillar tag, title, one line; links to the
 * service page. Used by Home ch.05 (Track D) and "Works well with" on service pages.
 * Mockup: home.js → #grid8, site.js → VIZ, sections.css .svc / mini visuals.
 * Stub renders the real copy with a placeholder where the demo goes.
 */
export function ServiceCard({ slug, dimmed = false, delay, location = "home" }: ServiceCardProps) {
  const s = getService(slug)!;
  return (
    <Link
      href={`/services/${s.slug}`}
      className={`svc rv${delay ? ` d${delay}x` : ""}${dimmed ? " off" : ""}`}
      data-p={s.p}
      data-umami-event={EVENTS.serviceClick}
      data-umami-event-service={s.slug}
      data-umami-event-location={location}
    >
      <div className="viz">
        <StubBox name="ServiceCard viz" track="A" minHeight={150} style={{ border: 0, borderRadius: 0 }} />
      </div>
      <div className="body">
        <div className="row">
          <div className="ico-tile" style={{ width: 38, height: 38 }}>
            <Icon name={s.icon} />
          </div>
          <Tag pillar={s.p} />
        </div>
        <h4>{s.title}</h4>
        <p>{s.short}</p>
      </div>
    </Link>
  );
}
