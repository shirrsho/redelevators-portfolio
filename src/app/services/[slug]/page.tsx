// SKELETON (Stage 1). Owned by Track A: build per docs/redesign/ROUTES-AND-CONTENT.md →
// /services/[slug] (mockup: redesign-mockups/r3/service.html). "How it runs" is Track B's
// SystemPlayer, fixed to this service.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { PILLAR_LABEL, SERVICES, SERVICE_SLUGS, getService } from "@/lib/services";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { SystemPlayer } from "@/components/interactive/SystemPlayer";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Chip";
import { FAQ } from "@/components/ui/FAQ";
import { StubBox } from "@/components/ui/StubBox";
import { ToolPill } from "@/components/ui/ToolLogo";

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
        <PageHero visual={<StubBox name={`ServiceHero ${s.hero}`} track="A" minHeight={480} style={{ width: "100%" }} />}>
          <div className="crumb">
            <Link href="/services">Services</Link>
            <span>/</span>
            <span>{pillar}</span>
          </div>
          <div className="pick">
            {SERVICES.map((x) => (
              <Link key={x.slug} href={`/services/${x.slug}`} className={x.slug === s.slug ? "on" : undefined} aria-current={x.slug === s.slug ? "page" : undefined}>
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
            <StubBox name="AssistantDemo" track="A" minHeight={420} />
          </section>
        )}

        <section className="wrap section" style={{ paddingTop: 40 }}>
          <SectionHead eyebrow="What changes" title="Same work. Nobody doing it by hand." aside={<span />} />
          <StubBox name="BeforeAfter" track="A" minHeight={280} />
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
          <StubBox name="GetsCard ×4" track="A" minHeight={180} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="Asked on most calls." />
          <FAQ className="rv" items={s.faq} />
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Works well with" title={`More ${pillar.toLowerCase()} systems.`} />
          <StubBox name="Related services + prev/next" track="A" minHeight={200} />
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
