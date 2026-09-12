import Link from "next/link";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { SystemAnatomy } from "@/components/SystemAnatomy";
import { Marquee } from "@/components/Marquee";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { approachStages, systems } from "@/lib/content";

// The worked example below the four stages — "Workflow & CRM Automation" is
// the first, shortest chain (5 nodes), picked for legibility, not seniority.
const worked = systems[0];

export default function ApproachPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <PageHeader
          label="How we work"
          title="Audit, design, build, run."
          intro="Every engagement follows the same four stages, in the same order — whether the last mile is a chatbot or a paid social campaign. It's how a project gets scoped honestly before either of us signs anything."
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
          <div className="space-y-12">
            {approachStages.map((stage) => (
              <div
                key={stage.num}
                className="grid grid-cols-1 gap-6 border-t border-line pt-10 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,220px)_1fr]"
              >
                <div>
                  <span className="font-mono-label text-muted">{stage.num}</span>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    {stage.title}
                  </h2>
                </div>
                <div className="max-w-2xl space-y-4">
                  <p className="text-lg text-ink-soft">{stage.summary}</p>
                  {stage.detail.map((p, i) => (
                    <p key={i} className="text-muted">
                      {p}
                    </p>
                  ))}
                  <p className="text-sm text-ink">
                    <span className="font-mono-label text-muted">After this stage — </span>
                    {stage.output}
                  </p>
                </div>
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
            <p className="mt-3 max-w-2xl text-lg text-muted">{worked.desc}</p>
            <SystemAnatomy nodes={worked.nodes} />
            <p className="mt-6 max-w-2xl text-sm text-muted">
              This is one of eight systems we build — see the full list on{" "}
              <Link
                href="/services"
                scroll={false}
                className="font-medium text-ink underline underline-offset-2 hover:text-red"
              >
                Services
              </Link>
              .
            </p>
          </div>
        </section>

        <Marquee />

        <CTA />
      </main>
      <Footer />
    </>
  );
}
