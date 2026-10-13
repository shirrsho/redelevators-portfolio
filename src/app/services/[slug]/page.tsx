// Track A · /services/[slug] (mockup: redesign-mockups/r3/service.html). "How it runs" is
// Track B's SystemPlayer, fixed to this service.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { PILLAR_LABEL, SERVICES, SERVICE_SLUGS, getService } from "@/lib/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ServiceHero } from "@/components/devices/ServiceHero";
import { AssistantDemo } from "@/components/interactive/AssistantDemo";
import { BeforeAfter } from "@/components/interactive/BeforeAfter";
import { SystemPlayer } from "@/components/interactive/SystemPlayer";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Chip";
import { FAQ } from "@/components/ui/FAQ";
import { Icon } from "@/components/ui/Icon";
import { ToolPill } from "@/components/ui/ToolLogo";
import styles from "./service.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: `${s.outcome} ${s.desc}`, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const pillar = PILLAR_LABEL[s.p];
  const related = SERVICES.filter((x) => x.p === s.p && x.slug !== s.slug);
  const prev = SERVICES[(s.idx + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(s.idx + 1) % SERVICES.length];

  return (
    <>
      <PageBg tone="day" />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Services", path: "/services" },
            { name: s.title, path: `/services/${s.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.desc,
            serviceType: pillar,
            provider: { "@id": "https://redelevators.com/#organization" },
            areaServed: ["US", "AE"],
          },
        ]}
      />
      <main id="main" className="page">
        <PageHero visual={<ServiceHero kind={s.hero} />}>
          <div className="crumb">
            <Link href="/services">Services</Link>
            <span>/</span>
            <span>{pillar}</span>
          </div>
          <div className={styles.pick}>
            {SERVICES.map((x) => (
              <Link key={x.slug} href={`/services/${x.slug}`} className={x.slug === s.slug ? styles.on : undefined} aria-current={x.slug === s.slug ? "page" : undefined}>
                {x.title}
              </Link>
            ))}
          </div>
          <Tag pillar={s.p} />
          <h1 className="d1" style={{ marginTop: 16, fontSize: "clamp(40px,4.6vw,68px)" }}>
            {s.title}
          </h1>
          <p className="lead" style={{ fontSize: 20, color: "var(--ink)" }}>
            {s.outcome}
          </p>
          <p className="small" style={{ marginTop: 12, maxWidth: 460 }}>
            {s.desc}
          </p>
          <div className="ctas">
            <Button href="/contact" arrow event={EVENTS.bookCall} location="hero" data-umami-event-service={s.slug}>
              Book a free 30-min call
            </Button>
            <Button href="#how" variant="quiet">
              How it runs
            </Button>
          </div>
          <div className="meta-row">
            {[...new Set(s.chain[2].map((n) => n[2]))].map((t) => (
              <ToolPill key={t} name={t} />
            ))}
          </div>
        </PageHero>

        {(s.hero === "chat" || s.hero === "chat2") && (
          <section className="wrap section" style={{ paddingTop: 40 }}>
            <AssistantDemo />
          </section>
        )}

        <section className="wrap section" style={{ paddingTop: 40 }}>
          <BeforeAfter slug={s.slug} />
        </section>

        <section className="wrap section" id="how" style={{ paddingTop: 20 }}>
          <SectionHead
            eyebrow="How it runs"
            gap={14}
            title={
              <>
                Watch it work,
                <br />
                step by step.
              </>
            }
            note="Left: what your guest (or you) sees. Right: what the system does. A simulated run; the real one works inside your own accounts."
            noteMaxWidth={320}
          />
          <SystemPlayer service={s.slug} />
        </section>

        <section className="wrap section" style={{ paddingTop: 40 }}>
          <SectionHead eyebrow="What you get" title="Built, live and looked after." />
          <div className="gets">
            {s.gets.map(([icon, title, text], i) => (
              <div key={title} className={`rv d${i + 1}x`}>
                <div className="ico-tile">
                  <Icon name={icon} />
                </div>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="Asked on most calls." />
          <FAQ className="rv" items={s.faq} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Works well with" title={`More ${pillar.toLowerCase()} systems.`} />
          <div className={styles.rel}>
            {related.map((x) => (
              <ServiceCard key={x.slug} slug={x.slug} location="related" />
            ))}
          </div>
          <div className={styles.pnNav}>
            <Link href={`/services/${prev.slug}`}>
              <span className="mono">← Previous</span>
              <b>{prev.title}</b>
            </Link>
            <Link href={`/services/${next.slug}`}>
              <span className="mono">Next →</span>
              <b>{next.title}</b>
            </Link>
          </div>
        </section>

        <CTABand
          title={`Want ${s.title.split(" &")[0].toLowerCase()} off your plate?`}
          sub="A free 30-minute call. We’ll look at your setup and tell you if this is the right place to start."
          service={s.slug}
        />
      </main>
    </>
  );
}
