import { Reveal } from "./Reveal";

const rows = [
  {
    say: "The leads are rubbish.",
    why: "Meta and Google never learn which leads were good, so they buy the cheapest form fill.",
    fix: "CRM feedback loop",
  },
  {
    say: "We get conversations but no sales.",
    why: "The click ID that ties a WhatsApp chat back to its ad is never captured.",
    fix: "Click-to-WhatsApp attribution",
  },
  {
    say: "Our conversions doubled but revenue didn’t.",
    why: "The browser and the server both report the same lead, and nothing de-duplicates them.",
    fix: "Pixel and CAPI cleanup",
  },
  {
    say: "Our agents respond immediately.",
    why: "Submit a test enquiry at 9pm on a Saturday and time the first reply. Leads sit unowned.",
    fix: "Speed-to-lead routing",
  },
  {
    say: "Our ads keep getting rejected.",
    why: "A missing permit number, or claims the platform won’t allow. Each takedown resets learning.",
    fix: "Permit-safe creative",
  },
  {
    say: "We can’t tell which channel works.",
    why: "The CRM has no source field and no real lead stages, so credit can’t be assigned.",
    fix: "CRM and stage rebuild",
  },
];

export function LanguageMap() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <Reveal>
        <h2 className="max-w-[20ch] text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight text-ink">
          What you say. What’s usually going on.
        </h2>
      </Reveal>

      <div className="mt-10 border-t border-line">
        {rows.map((r) => (
          <div
            key={r.say}
            className="grid grid-cols-1 gap-2 border-b border-line py-6 transition-colors hover:bg-cream/60 md:grid-cols-[1.1fr_1.4fr_auto] md:items-baseline md:gap-8"
          >
            <p className="font-[family-name:var(--font-display)] text-lg font-medium leading-snug text-ink md:text-xl">
              <span className="text-red">“</span>
              {r.say}
              <span className="text-red">”</span>
            </p>
            <p className="text-muted">{r.why}</p>
            <span className="justify-self-start whitespace-nowrap rounded-full border border-red/40 px-3 py-1 text-xs font-semibold text-red md:justify-self-end">
              {r.fix}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
