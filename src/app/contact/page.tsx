// /contact (mockup: redesign-mockups/r3/contact.html). WhatsApp appears on this page only, as a
// wa.me button (src/lib/site.ts → whatsappUrl); the number is never printed.
import type { Metadata } from "next";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { EMAIL, whatsappUrl } from "@/lib/site";
import { EVENTS } from "@/lib/analytics";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { Lockup } from "@/components/layout/Logo";
import { SectionHead } from "@/components/layout/Section";
import { BookingStage } from "@/components/interactive/BookingStage";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Chip";
import { EmailLink } from "@/components/ui/EmailLink";
import { FAQ } from "@/components/ui/FAQ";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { DOC, FAQ_ITEMS, STEPS } from "./content";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Book a call",
  description:
    "Book a free 30-minute call. We map your setup and show you what to automate first. No pitch deck, no commitment, and you keep the written summary.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageBg tone="night" />
      <JsonLd data={breadcrumbLd([{ name: "Contact", path: "/contact" }])} />
      <main id="main" className="page">
        <section className={`wrap ${styles.intro}`}>
          <div className="rv">
            <Eyebrow center>Contact</Eyebrow>
            <h1 className="d1" style={{ marginTop: 20 }}>
              Book a free 30-minute call.
            </h1>
            <p className="lead">We map your setup and show you what to automate first. No pitch deck, no commitment, and you keep the written summary.</p>
          </div>
          <h2 className="sr-only">How the call works</h2>
          <ol className={`${styles.steps} rv d1x`}>
            {STEPS.map((title, i) => (
              <li key={title}>
                <b>0{i + 1}</b>
                {title}
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap" data-night>
          <BookingStage variant="contact" />
        </section>

        <section className="wrap section" id="chat" style={{ paddingTop: 90 }}>
          <div className="head" style={{ justifyContent: "center", textAlign: "center" }}>
            <div className="left rv" style={{ maxWidth: "none" }}>
              <Eyebrow center>Not ready to book?</Eyebrow>
              <h2 className="d2" style={{ marginTop: 18 }}>
                Ask us anything first.
              </h2>
            </div>
          </div>
          <div className={styles.ways}>
            <div className={`${styles.way} ${styles.wa} rv`}>
              <div className={styles.wi} style={{ background: "#25D366", color: "#06290f" }}>
                <ToolLogo name="WhatsApp" size={26} mono />
              </div>
              <div>
                <h3>WhatsApp</h3>
                <p>Quickest. A real person replies.</p>
              </div>
              <Button href={whatsappUrl()} variant="wa" event={EVENTS.whatsappClick} location="contact">
                <ToolLogo name="WhatsApp" size={18} mono /> Chat on WhatsApp
              </Button>
            </div>
            <div className={`${styles.way} rv d1x`}>
              <div className={`${styles.wi} ico-tile`} style={{ width: 52, height: 52 }}>
                <Icon name="mail" />
              </div>
              <div>
                <h3>Email</h3>
                <p>{EMAIL}</p>
              </div>
              <EmailLink location="contact" className="btn quiet">
                Send an email
              </EmailLink>
            </div>
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 40 }}>
          <div className={styles.take}>
            <div className="rv">
              <Eyebrow>What you take away</Eyebrow>
              <h2 className="d2" style={{ marginTop: 18 }}>
                A written plan, whether we work together or not.
              </h2>
              <p className="lead" style={{ marginTop: 16 }}>
                Within a day of the call you get a one-page summary: what to fix first, what can wait, and what it would take.
              </p>
              <p className="mono" style={{ marginTop: 16 }}>
                Example summary · illustrative
              </p>
            </div>
            <div className={`${styles.doc} rv d2x`}>
              <div className={styles.dh}>
                <Lockup tone="light" height={22} />
                <span>{DOC.stamp}</span>
              </div>
              <h3>{DOC.title}</h3>
              <p className={styles.sub}>{DOC.sub}</p>
              <ol>
                {DOC.rows.map(([tone, badge, text, delay]) => (
                  <li key={badge + text} style={{ "--dl": `${delay}s` } as React.CSSProperties}>
                    <b className={styles[tone]}>{badge}</b>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
              <div className={styles.sig}>
                <span>{DOC.sig[0]}</span>
                <span>{DOC.sig[1]}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="About the call." />
          <FAQ items={FAQ_ITEMS} className="rv" />
        </section>
      </main>
    </>
  );
}
