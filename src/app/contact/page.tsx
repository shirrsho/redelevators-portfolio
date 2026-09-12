import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { EmailLink } from "@/components/EmailLink";
import { Footer } from "@/components/Footer";
import { steps } from "@/lib/content";

// Deliberately form-free. The design system has form controls (Form.tsx,
// workstream D item 1), but a submitted form needs somewhere to go, and no
// email API or form backend exists yet — owner's call, 12 Sep 2026: ship the
// page on the two conversion paths that are real today (Calendly + email) and
// add a form once a provider is chosen. An unwired form that silently drops
// leads would be worse than no form.
const CALENDLY = "https://calendly.com/redelevators/30min";
const EMAIL = "contact@redelevators.com";

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <PageHeader
          label="Contact"
          title="One call. Thirty minutes."
          intro="Book a free 30-minute call and we'll tell you exactly what to automate first — or email us if that's easier."
        />

        {/* id="contact" is load-bearing: Nav's "Book a call" is a bare
            `#contact` anchor, which every other page satisfies by rendering
            <CTA/>. This page deliberately doesn't (a Book-a-call panel on the
            Book-a-call page is noise), so it carries the id itself — the
            anchor lands on the booking card, which is the right target. */}
        <section id="contact" className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-line bg-white p-7 sm:p-9">
              <span className="font-mono-label">The fastest route</span>
              <h2 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
                Book the call
              </h2>
              <p className="mt-3 text-[0.95rem] text-muted">
                Thirty minutes, free, no deck. We walk your current process and
                tell you which part is worth automating first — whether or not
                you work with us.
              </p>
              <div className="mt-7">
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white shadow-red transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Book a free Call
                </a>
              </div>
            </article>

            <article className="flex flex-col rounded-3xl border border-line bg-white p-7 sm:p-9">
              <span className="font-mono-label">Prefer to write first</span>
              <h2 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
                Email us
              </h2>
              <p className="mt-3 text-[0.95rem] text-muted">
                Tell us what keeps getting done by hand. The more specific the
                task, the more useful our first reply will be.
              </p>
              {/* pb-8 leaves room for EmailLink's "Copied to clipboard"
                  tooltip, which renders below the address — same fix the
                  footer needed on 12 Sep 2026. */}
              <div className="mt-7 pb-8">
                <EmailLink
                  email={EMAIL}
                  className="text-lg font-medium text-ink underline underline-offset-4 transition-colors hover:text-red"
                />
              </div>
            </article>
          </div>
        </section>

        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <span className="font-mono-label">What happens next</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
              The same four stages, every time.
            </h2>
            <ol className="mt-10 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <li
                  key={s.num}
                  className="rounded-2xl border border-line bg-white p-6"
                >
                  <span className="font-mono-label text-muted">{s.num}</span>
                  <h3 className="mt-2 text-lg font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
