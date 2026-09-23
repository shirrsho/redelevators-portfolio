import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { SystemAnatomy } from "@/components/SystemAnatomy";
import { Marquee } from "@/components/Marquee";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { approachStages, systems } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Our Approach",
  path: "/approach",
  description:
    "How we work: audit, design, build, run. We map the manual work, architect each workflow, build inside the tools you already use, and hand it over documented.",
});

// The worked example below the four stages — "Workflow & CRM Automation" is
// the first, shortest chain (5 nodes), picked for legibility, not seniority.
const worked = systems[0];

export default function ApproachPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <JsonLd data={breadcrumbLd([{ name: "Approach", path: "/approach" }])} />
      <main>
        <PageHeader
          label="How we work"
          title="Audit, design, build, run."
          actions={
            <>
              <a
                href="#contact"
                className="rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white shadow-red transition-transform hover:scale-[1.03] active:scale-95"
              >
                Book a free Call
              </a>
              <a
                href="#worked-example"
                className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-cream"
              >
                See a system built this way
              </a>
            </>
          }
        />

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {approachStages.map((stage) => (
              <div
                key={stage.num}
                className="rounded-2xl border border-line bg-white p-6"
              >
                <span className="font-mono-label text-muted">{stage.num}</span>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                  {stage.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{stage.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="worked-example" className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <span className="font-mono-label">One system, shown in full</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
              {worked.title}
            </h2>
            <SystemAnatomy nodes={worked.nodes} />
          </div>
        </section>

        <Marquee />

        <CTA />
      </main>
      <Footer />
    </>
  );
}
