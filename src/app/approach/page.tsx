// Track A · /approach (mockup: redesign-mockups/r3/approach.html).
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { Calendar3Week } from "@/components/interactive/Calendar3Week";
import { CTABand } from "@/components/layout/CTABand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Chip";
import { FAQ } from "@/components/ui/FAQ";
import { Icon } from "@/components/ui/Icon";
import { AFTER_LAUNCH, APPROACH_FAQ, PHASES } from "./phases";
import styles from "./approach.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Approach",
  description:
    "Live in three weeks, then we run it. Four steps and about two hours of your time in total. You approve everything that matters.",
  path: "/approach",
});

export default function ApproachPage() {
  return (
    <>
      <PageBg tone="day" />
      <JsonLd data={breadcrumbLd([{ name: "Approach", path: "/approach" }])} />
      <main id="main" className="page">
        <PageHero
          visualStyle={{ minHeight: "auto" }}
          visual={
            <div style={{ width: "100%" }}>
              <Calendar3Week pickScroll />
            </div>
          }
        >
          <Eyebrow>Approach</Eyebrow>
          <h1 className="d1" style={{ marginTop: 22 }}>
            Live in three weeks.
            <br />
            Then we run it.
          </h1>
          <p className="lead">Four steps. About two hours of your time in total. You approve everything that matters.</p>
          <div className="ctas">
            <Button href="/contact" arrow event={EVENTS.bookCall} location="hero">
              Start with the audit call
            </Button>
          </div>
        </PageHero>

        <section className={`wrap ${styles.phases}`} id="phases">
          <h2 className="sr-only">The four steps, from audit to live</h2>
          {PHASES.map((p) => (
            <div key={p.n} className="phase" id={`ph-${p.t.toLowerCase()}`}>
              <div className="rv">
                <span className="num">{p.n}</span>
                <span className="mono" style={{ marginLeft: 14 }}>
                  {p.when}
                </span>
                <h3>{p.t}</h3>
                <p className="lead">{p.sum}</p>
                <div className="who">
                  <div>
                    <span className="mono">YOU</span>
                    <p>{p.you}</p>
                  </div>
                  <div>
                    <span className="mono">US</span>
                    <p>{p.we}</p>
                  </div>
                </div>
                <span className="chip handled out">
                  <i />
                  You get: {p.out}
                </span>
              </div>
              <div className="vis rv d2x">{p.vis}</div>
            </div>
          ))}
        </section>

        <section className="wrap section">
          <SectionHead eyebrow="After launch" title="Every month, we keep it sharp." />
          <div className="gets">
            {AFTER_LAUNCH.map(([icon, title, text], i) => (
              <div key={title} className={`rv d${i + 1}x`}>
                <div className="ico-tile">
                  <Icon name={icon} />
                </div>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" style={{ paddingTop: 20 }}>
          <SectionHead eyebrow="Questions" title="Before you book." />
          <FAQ className="rv" items={APPROACH_FAQ} />
        </section>

        <CTABand title="Step one is a 30-minute call." sub="We’ll map your setup and tell you what to fix first. No commitment." />
      </main>
    </>
  );
}
