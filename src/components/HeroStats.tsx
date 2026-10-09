"use client";

import { Counter } from "./Counter";
import { Stagger, StaggerItem } from "./Reveal";

const accents = ["#FF2D3B", "#17171B", "#FF2D3B", "#17171B", "#FF2D3B", "#17171B"];

const heroStats: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: 34, label: "Listings automated" },
  { value: 15, suffix: "+", label: "Hosts served" },
  { value: 2, suffix: " wk", label: "To go-live" },
  { value: 14, prefix: "~", suffix: " hrs", label: "Saved / week" },
  { value: 20, suffix: "+", label: "Tools we connect" },
  { value: 5, suffix: "+", label: "Markets served" },
];

export function HeroStats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {heroStats.map((s, i) => (
          <StaggerItem key={s.label}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white/90 p-5 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-lift">
              <span
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: accents[i % accents.length] }}
              />
              <div className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.4vw,2.2rem)] font-semibold leading-none tracking-tight text-red">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-2.5 text-xs leading-snug text-muted">
                {s.label}
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
