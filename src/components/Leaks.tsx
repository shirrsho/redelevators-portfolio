import { Reveal, Stagger, StaggerItem } from "./Reveal";

const leaks = [
  {
    title: "Click-to-WhatsApp attribution",
    desc: "We capture the ad's click ID from the first WhatsApp message and carry it through to the closed deal.",
  },
  {
    title: "CRM to ad platform feedback",
    desc: "Qualified and viewing-booked stages sent back to Meta and Google as conversions, so they stop buying cheap leads.",
  },
  {
    title: "Speed-to-lead",
    desc: "Round-robin routing, a response timer and an instant WhatsApp acknowledgement, with escalation when nobody claims it.",
  },
  {
    title: "Permit-safe ad creative",
    desc: "Trakheesi and Madmoun checks built into your creative template, so ads don't get pulled mid-flight.",
  },
];

const also = [
  "GA4 & GTM rebuild",
  "Lead capture & CRM hygiene",
  "Landing page conversion",
  "Meta & Google media buying",
  "Database reactivation",
  "Reporting you can trust",
];

export function Leaks() {
  return (
    <section className="bg-[#0E0E10] text-[#EDEDF0]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <Reveal>
          <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
            Four leaks we fix first.
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
          {leaks.map((l) => (
            <StaggerItem key={l.title}>
              <article className="h-full rounded-2xl border border-[#2B2B31] bg-[#16161A] p-7 transition-colors hover:border-[#FF4550]">
                <h3 className="text-xl font-semibold text-[#EDEDF0]">
                  {l.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[#A2A2AC]">
                  {l.desc}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-14">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[#A2A2AC]">
            Also in the build
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {also.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#2B2B31] bg-[#16161A] px-3.5 py-1.5 text-sm text-[#EDEDF0]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
