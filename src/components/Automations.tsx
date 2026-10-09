import { Reveal, Stagger, StaggerItem } from "./Reveal";

const automations = [
  {
    num: "01",
    title: "AI Lead Qualification & CRM Intake",
    desc: "Scores, enriches and routes inbound leads straight to your CRM.",
  },
  {
    num: "02",
    title: "AI Customer Support Agent",
    desc: "A 24/7 WhatsApp & Telegram agent trained on your docs, escalates the hard ones.",
  },
  {
    num: "03",
    title: "Content Repurposing Pipeline",
    desc: "One video becomes LinkedIn posts, X threads and a newsletter, tuned per platform.",
  },
  {
    num: "04",
    title: "Cold Email Personalization Engine",
    desc: "Scrapes prospect profiles to write personalized icebreakers at scale.",
  },
  {
    num: "05",
    title: "Competitor & Market Research",
    desc: "Weekly executive briefs on competitor launches, pricing and news.",
  },
  {
    num: "06",
    title: "Invoice & Document Processing",
    desc: "Pulls line items and totals from PDFs and syncs them to your accounting.",
  },
  {
    num: "07",
    title: "Appointment Scheduling Agent",
    desc: "A voice or text bot that books, confirms and reschedules for you.",
  },
  {
    num: "08",
    title: "Meeting Summarizer & Action Items",
    desc: "Turns calls into structured summaries and task tickets automatically.",
  },
  {
    num: "09",
    title: "Multilingual Translation & Localization",
    desc: "Translates copy and docs while keeping brand voice and glossary.",
  },
  {
    num: "10",
    title: "E-commerce Description Generator",
    desc: "SEO titles and copy for thousands of SKUs in minutes.",
  },
];

export function Automations() {
  return (
    <section className="border-y border-line bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight text-ink">
            AI automation we build.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Systems that remove the manual work behind the deal.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {automations.map((a) => (
            <StaggerItem key={a.num}>
              <article className="h-full rounded-2xl border border-line bg-white p-6 transition-colors hover:border-red/50">
                <span className="font-mono-label text-muted">{a.num}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {a.desc}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
