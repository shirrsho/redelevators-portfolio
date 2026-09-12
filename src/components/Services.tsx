import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { Stagger, StaggerItem } from "./Reveal";
import { ServiceCard } from "./ServiceCard";
import { services } from "@/lib/content";

export function Services() {
  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          label="What we do"
          title="If it's repetitive, it should run itself."
          intro="We embed with your team, map the manual work and the marketing that matters, then replace it with systems that run without you."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.slug}>
              <ServiceCard {...s} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            scroll={false}
            className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-cream"
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
