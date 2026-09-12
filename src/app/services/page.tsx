import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { services, type Service } from "@/lib/content";

const CATEGORIES: { name: Service["category"]; intro: string }[] = [
  {
    name: "Marketing",
    intro:
      "Paid social, creative and full-funnel campaigns — built to sell, not just to look good.",
  },
  {
    name: "AI Automation",
    intro:
      "Workflows, assistants and outreach systems that run quietly in the background, day and night.",
  },
];

export default function ServicesIndex() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <PageHeader
          label="Services"
          title="Two ways we remove the repetitive work."
          intro="Marketing that runs itself, and automation that runs everything else. Every service below lands inside the tools you already use."
        />

        {CATEGORIES.map((cat) => {
          const group = services.filter((s) => s.category === cat.name);
          return (
            <section key={cat.name} className="mx-auto max-w-6xl px-6 py-14">
              <span className="font-mono-label">{cat.name}</span>
              <p className="mt-3 max-w-2xl text-lg text-muted">{cat.intro}</p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((s) => (
                  <ServiceCard key={s.slug} {...s} />
                ))}
              </div>
            </section>
          );
        })}

        <CTA />
      </main>
      <Footer />
    </>
  );
}
