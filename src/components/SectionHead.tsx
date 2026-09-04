import { Reveal } from "./Reveal";

export function SectionHead({
  label,
  title,
  intro,
  align = "left",
}: {
  label: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <Reveal>
        <span className="font-mono-label">{label}</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
