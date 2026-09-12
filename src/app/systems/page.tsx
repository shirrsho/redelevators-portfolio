import Link from "next/link";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { SystemAnatomy } from "@/components/SystemAnatomy";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { systems, services, serviceDetails } from "@/lib/content";

// The full catalog — Systems.tsx on the home page shows a curated 3-item
// slice of the same `systems` data; this page is where all 8 live. Workstream
// E, item 4: "anonymized, mechanism-led, honest" case-study substitutes. No
// client name, no metric — only the real chain each system runs on.
export default function SystemsPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <PageHeader
          label="Systems"
          title="Every system, end to end."
          intro="No client name, no metric — just the real chain, tool by tool. This is the mechanism behind all 8 services, shown in full."
        />

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-4">
            {systems.map((s) => {
              const service = services.find((sv) => sv.title === s.label);
              const hasPage = !!(service && serviceDetails[service.slug]?.manualChain?.length);

              return (
                <article
                  key={s.label}
                  className="rounded-3xl border border-line bg-white p-7 sm:p-9"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="max-w-xl text-xl font-semibold text-ink sm:text-2xl">
                      {s.title}
                    </h2>
                    <span className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-medium text-ink-soft">
                      {s.label}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-[0.95rem] text-muted">{s.desc}</p>
                  <SystemAnatomy nodes={s.nodes} />
                  {hasPage && service && (
                    <div className="mt-6">
                      <Link
                        href={`/services/${service.slug}`}
                        scroll={false}
                        className="text-sm font-medium text-ink underline underline-offset-2 hover:text-red"
                      >
                        See this service →
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
