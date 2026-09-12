import { notFound } from "next/navigation";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Handover } from "@/components/Handover";
import { Process } from "@/components/Process";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { services, systems, serviceDetails } from "@/lib/content";

// Only slugs with complete content generate a page — docs/brief-service-page.md
// is explicit that a service page "cannot ship... until that chain exists".
// An empty list here means no service page is live yet, and that is the
// correct, honest state until the manual chain is supplied per service.
export function generateStaticParams() {
  return services
    .filter((s) => serviceDetails[s.slug]?.manualChain?.length)
    .map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const detail = serviceDetails[slug];
  const automated = systems.find((sys) => sys.label === service?.title);

  if (!service || !detail?.manualChain?.length || !automated) {
    notFound();
  }

  const related = services.filter((s) => s.slug !== slug);
  const tools = Array.from(new Set(automated.nodes.map((n) => n.tool)));

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <PageHeader
          label={`Services · ${service.num} of 06`}
          title={service.title}
          intro={service.desc}
          actions={
            <>
              <a
                href="#contact"
                className="rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white shadow-red transition-transform hover:scale-[1.03] active:scale-95"
              >
                Book a free Call
              </a>
              <a
                href="#handover"
                className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-cream"
              >
                See how it works
              </a>
            </>
          }
        />

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-2xl space-y-2 text-lg text-muted">
            {detail.feltCost.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>

        <section id="handover" className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <span className="font-mono-label">The handover</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
              What changes.
            </h2>
            <Handover manual={detail.manualChain} automated={automated} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono-label">Where a human still checks in</span>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{detail.humanCheckpoint}</p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <span className="font-mono-label">Where it runs</span>
          <div className="mt-5 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        <Process />

        <section className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono-label">Related services</span>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
            Stay inside the six.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((s) => (
              <div
                key={s.slug}
                className="rounded-2xl border border-line bg-white p-6"
              >
                <span className="font-mono-label">{s.num}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
