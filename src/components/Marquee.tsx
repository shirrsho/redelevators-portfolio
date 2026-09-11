import { marquee } from "@/lib/content";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <section className="border-y border-line bg-cream/60 py-7">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-5 text-center font-mono-label text-muted">
          Wired into the tools your team already runs on
        </p>
        <div className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <div className="marquee-track gap-10 pr-10">
            {items.map((m, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-[family-name:var(--font-display)] text-xl font-medium text-ink/60 transition-colors hover:text-ink"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
