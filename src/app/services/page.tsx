import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { services, type Service } from "@/lib/content";

const CATEGORIES: Service["category"][] = ["AI Automation", "Marketing"];

export default function ServicesIndex() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <PageHeader label="Services" title="Two ways we remove the busywork." />

        {CATEGORIES.map((cat) => (
          <section key={cat} className="mx-auto max-w-6xl px-6 py-12">
            <span className="font-mono-label">{cat}</span>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((s) => s.category === cat)
                .map((s) => (
                  <ServiceCard key={s.slug} {...s} />
                ))}
            </div>
          </section>
        ))}

        <CTA />
      </main>
      <Footer />
    </>
  );
}
