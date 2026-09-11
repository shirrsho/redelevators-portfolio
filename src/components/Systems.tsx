import { SectionHead } from "./SectionHead";
import { Reveal } from "./Reveal";
import { SystemAnatomy } from "./SystemAnatomy";
import { systems } from "@/lib/content";

export function Systems() {
  return (
    <section id="systems" className="relative bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          label="How it works"
          title="Built once. Runs without you."
          intro="Three of the systems we build, drawn end to end. Every step names the tool it actually runs in — the wiring is the point."
        />

        <div className="mt-14 flex flex-col gap-4">
          {systems.map((s) => (
            <Reveal key={s.title}>
              <article className="rounded-3xl border border-line bg-white p-7 sm:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="max-w-xl text-xl font-semibold text-ink sm:text-2xl">
                    {s.title}
                  </h3>
                  <span className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-medium text-ink-soft">
                    {s.label}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-[0.95rem] text-muted">
                  {s.desc}
                </p>
                <SystemAnatomy nodes={s.nodes} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
