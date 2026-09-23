import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { services, type Service } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  path: "/services",
  description:
    "AI automation and marketing for short-term rentals — guest messaging, direct booking engines, listing content, paid social and commission-free booking websites.",
});

const CATEGORIES: Service["category"][] = ["AI Automation", "Marketing"];

export default function ServicesIndex() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <JsonLd data={breadcrumbLd([{ name: "Services", path: "/services" }])} />
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
