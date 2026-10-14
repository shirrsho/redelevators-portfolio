import Link from "next/link";
import { EVENTS } from "@/lib/analytics";
import { getService, type ServiceSlug } from "@/lib/services";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { ServiceViz } from "@/components/viz/ServiceViz";

/**
 * One row of the /services pillar lists: mini demo, title + one line, "Instead of" + the tools
 * in the chain, and the round arrow. Mockup: services.html → row(), sections.css .srow.
 */
export function ServiceRow({ slug }: { slug: ServiceSlug }) {
  const s = getService(slug)!;
  const tools = [...new Set(s.chain[2].map((n) => n[2]))];
  return (
    <Link
      href={`/services/${s.slug}`}
      className="srow rv"
      data-p={s.p}
      data-umami-event={EVENTS.serviceClick}
      data-umami-event-service={s.slug}
      data-umami-event-location="services"
    >
      <div className="viz">
        <ServiceViz kind={s.viz} />
      </div>
      <div>
        <h3>{s.title}</h3>
        <p>{s.short}</p>
      </div>
      <div className="was">
        <b>INSTEAD OF</b>
        <span>{s.before[0]}.</span>
        <div className="tools-row">
          {tools.map((t) => (
            <span key={t} className="logo-pill" style={{ padding: "6px 9px" }}>
              <ToolLogo name={t} size={14} />
            </span>
          ))}
        </div>
      </div>
      <span className="go">
        <Icon name="arrow" />
      </span>
    </Link>
  );
}
