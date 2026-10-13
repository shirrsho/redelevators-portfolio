import Link from "next/link";
import { EVENTS } from "@/lib/analytics";
import { servicesIn } from "@/lib/services";
import { FOOTER, LINKEDIN_URL } from "@/lib/site";
import { EmailLink } from "@/components/ui/EmailLink";
import { Lockup } from "./Logo";

/**
 * Lockup (34px), one-liner, email, the 4 + 4 services, company links, © + Privacy.
 * Column headings are h2 (styled like the mockup's h6) so the page outline stays in order.
 * Mockup: site.js → footHTML, sections.css footer / .fgrid.
 */
export function Footer() {
  const col = (title: string, p: "auto" | "mkt") => (
    <div>
      <h2>{title}</h2>
      {servicesIn(p).map((s) => (
        <Link key={s.slug} href={`/services/${s.slug}`} data-umami-event={EVENTS.serviceClick} data-umami-event-location="footer" data-umami-event-service={s.slug}>
          {s.title}
        </Link>
      ))}
    </div>
  );

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Lockup height={34} />
            <p className="small" style={{ marginTop: 16, maxWidth: 280 }}>
              {FOOTER.blurb}
            </p>
            <EmailLink location="footer" style={{ marginTop: 18 }} />
          </div>
          {col("AI Automation", "auto")}
          {col("Marketing", "mkt")}
          <div>
            <h2>Company</h2>
            {FOOTER.company.map((l) => (
              <Link key={l.href} href={l.href} data-umami-event={EVENTS.navClick} data-umami-event-location="footer" data-umami-event-label={l.label}>
                {l.label}
              </Link>
            ))}
            <a href={LINKEDIN_URL} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="fbot">
          <span>
            {FOOTER.copyright} · <Link href="/privacy">Privacy</Link>
          </span>
          <span>{FOOTER.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
