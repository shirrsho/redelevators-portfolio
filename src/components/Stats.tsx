import { Counter } from "./Counter";
import { Stagger, StaggerItem } from "./Reveal";
import { stats } from "@/lib/content";

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div className="group h-full bg-white p-7 transition-colors hover:bg-cream">
              <div className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-red md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
