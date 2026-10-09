import { Stagger, StaggerItem } from "./Reveal";

// Figures from real tracking/attribution work — see the marketing reference.
const proof = [
  { num: "+13%", label: "conversion lift" },
  { num: "338", label: "leads tracked end to end" },
  { num: "200+", label: "landing pages audited" },
  { num: "2–3 wk", label: "to a live build" },
];

export function Proof() {
  return (
    <section className="bg-[#0E0E10] text-[#EDEDF0]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Stagger className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {proof.map((p) => (
            <StaggerItem key={p.label}>
              <div className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[#FF4550] md:text-5xl">
                {p.num}
              </div>
              <p className="mt-2 text-sm text-[#A2A2AC]">{p.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
