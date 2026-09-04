import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <section id="results" className="relative bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead label="Results" title="What it feels like on the other side." />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-8 shadow-soft">
                <svg
                  width="34"
                  height="28"
                  viewBox="0 0 34 28"
                  fill="none"
                  className="text-red"
                  aria-hidden
                >
                  <path
                    d="M0 28V16.8C0 11.2 1.3 6.9 3.9 4.1 6.5 1.4 10.2 0 15 0v5.6c-2.5.2-4.4 1-5.6 2.4-1.2 1.4-1.8 3.3-1.8 5.7H14V28H0Zm20 0V16.8c0-5.6 1.3-9.9 3.9-12.7C26.5 1.4 30.2 0 35 0v5.6c-2.5.2-4.4 1-5.6 2.4-1.2 1.4-1.8 3.3-1.8 5.7H34V28H20Z"
                    fill="currentColor"
                    opacity="0.9"
                    transform="translate(-1)"
                  />
                </svg>
                <blockquote className="mt-6 font-[family-name:var(--font-display)] text-2xl font-medium leading-snug tracking-tight text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {t.name}
                    </div>
                    <div className="text-sm text-muted">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
