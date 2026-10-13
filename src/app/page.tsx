// SKELETON (Stage 1). Owned by Track D: replace the story placeholder with <StoryStage/> and
// build chapters 04–09 per docs/redesign/ROUTES-AND-CONTENT.md → "/". Cross-track pieces come
// in through their stubs (Journey: B, ServiceCard/SavingsCalculator/PricingTiers/Calendar3Week: A,
// BookingStage: C).
import type { Metadata } from "next";
import { EVENTS } from "@/lib/analytics";
import { ALSO_WORKS_WITH, PROMISES, WEEKS, WEEK_PHASES } from "@/lib/home";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";
import { REASSURE } from "@/lib/story";
import { PageBg } from "@/components/layout/PageBg";
import { SectionHead } from "@/components/layout/Section";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { BookingStage } from "@/components/interactive/BookingStage";
import { Calendar3Week } from "@/components/interactive/Calendar3Week";
import { Journey } from "@/components/interactive/Journey";
import { PricingTiers } from "@/components/interactive/PricingTiers";
import { SavingsCalculator } from "@/components/interactive/SavingsCalculator";
import { Button, TextLink } from "@/components/ui/Button";
import { Chip, Eyebrow } from "@/components/ui/Chip";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { Icon } from "@/components/ui/Icon";
import { StubBox } from "@/components/ui/StubBox";

export const metadata: Metadata = pageMetadata({
  description:
    "Your rentals, running on autopilot. We build and run the automation and marketing behind short-term rentals, so the night shift runs itself. Book a free 30-minute call.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <PageBg tone="night" />
      <main id="main">
        {/* ===== 01–03 + morning: the story (Track D: StoryStage) ===== */}
        <section className="wrap phero" id="story">
          <div className="rv">
            <Eyebrow>For short-term rental hosts &amp; property managers</Eyebrow>
            <h1 className="d1" style={{ marginTop: 22 }}>
              Your rentals,
              <br />
              running on <em>autopilot.</em>
            </h1>
            <p className="lead">We build and run the automation and marketing behind short-term rentals, so the night shift runs itself.</p>
            <div className="ctas">
              <Button href="#calm" arrow event={EVENTS.jumpToBooking} location="hero">
                Book a free 30-min call
              </Button>
              <Button href="#journey-sec" variant="quiet" event={EVENTS.seeHowItWorks} location="hero">
                See how it works
              </Button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 26, fontSize: 13, color: "var(--dim)" }}>
              {REASSURE.map((t) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="check" className="ico" style={{ width: 15, height: 15, color: "var(--green)" }} />
                  {t}
                </span>
              ))}
            </div>
            <TextLink href="#build" style={{ marginTop: 22 }} event={EVENTS.storySkip} location="hero">
              Skip the story →
            </TextLink>
          </div>
          <div className="visual">
            <StubBox name="StoryStage" track="D" minHeight={540} note="Phone + laptop, 820vh scroll story" style={{ width: "100%" }} />
          </div>
        </section>

        {/* ===== 04 · One booking (pinned journey, Track B component) ===== */}
        <section className="section" id="journey-sec">
          <div className="jpin">
            <div className="wrap">
              <SectionHead
                eyebrow="Chapter 04 · One booking"
                title={
                  <>
                    Start to finish,
                    <br />
                    without you lifting a finger.
                  </>
                }
                note="Keep scrolling: one guest, from first message to booking again. Top: what they see. Bottom: what the system does."
              />
              <Journey pinned />
              <p className="mono" style={{ marginTop: 12 }}>
                Illustrative example
              </p>
            </div>
          </div>
        </section>

        {/* ===== 05 · What we build ===== */}
        <section className="section" id="build">
          <div className="wrap">
            <SectionHead
              eyebrow="Chapter 05 · What we build"
              title={
                <>
                  Eight systems.
                  <br />
                  Two pillars.
                </>
              }
              aside={
                <div className="tabs rv d1x">
                  <button type="button" className="on">
                    All
                  </button>
                  <button type="button">AI Automation</button>
                  <button type="button">Marketing</button>
                </div>
              }
            />
            <div className="grid8">
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.slug} slug={s.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} location="home" />
              ))}
            </div>
          </div>
        </section>

        {/* ===== 06 · Your numbers ===== */}
        <section className="section" id="calc">
          <div className="wrap">
            <SectionHead
              eyebrow="Chapter 06 · Your numbers"
              title={
                <>
                  What you get back.
                  <br />
                  What it costs.
                </>
              }
              note="Move the sliders to match your business. Prices below are starting points."
            />
            <div className="rv">
              <SavingsCalculator />
            </div>
            <div className="cost-head rv">
              <h3 className="d3">And what it costs</h3>
              <div className="cost-r">
                <CurrencyToggle />
                <TextLink href="/pricing">Full pricing and plan builder →</TextLink>
              </div>
            </div>
            <div className="rv">
              <PricingTiers compact />
            </div>
          </div>
        </section>

        {/* ===== 07 · How we work ===== */}
        <section className="section" id="how">
          <div className="wrap">
            <SectionHead
              eyebrow="Chapter 07 · How we work"
              title={
                <>
                  Live in three weeks.
                  <br />
                  Then we run it.
                </>
              }
              note={
                <>
                  Your total time: about two hours, spread over three weeks. <TextLink href="/approach">The full approach →</TextLink>
                </>
              }
            />
            <div className="rv" style={{ marginBottom: 56 }}>
              <Calendar3Week linkId="time" />
            </div>
            <div className="weeks linked" id="time">
              <div className="line">
                <i />
              </div>
              {WEEKS.map(([icon, when, title, text, you], i) => (
                <div key={title} className={`wk rv d${i + 1}x`} data-phase={WEEK_PHASES[i]}>
                  <div className="ico-tile">
                    <Icon name={icon} />
                  </div>
                  <span className="mono">{when}</span>
                  <h4>{title}</h4>
                  <p>{text}</p>
                  <Chip>{you}</Chip>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 08 · Your tools, our promises ===== */}
        <section className="section" id="tools">
          <div className="wrap tools">
            <div className="rv">
              <Eyebrow>Chapter 08 · Your tools, our promises</Eyebrow>
              <h2 className="d2" style={{ marginTop: 18 }}>
                Built inside what
                <br />
                you already use.
              </h2>
              <div className="points">
                {PROMISES.map(([icon, title, text]) => (
                  <div key={title}>
                    <div className="ico-tile">
                      <Icon name={icon} />
                    </div>
                    <div>
                      <h5>{title}</h5>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="also">
                {ALSO_WORKS_WITH.map((t) => (
                  <span key={t} className="logo-pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <StubBox name="ToolOrbit" track="D" minHeight={420} />
          </div>
        </section>

        {/* ===== 09 · Your calm 2am (Track C component) ===== */}
        <section className="section" id="calm">
          <div className="wrap">
            <div className="bhead rv">
              <Eyebrow center>Chapter 09 · Your calm 2am</Eyebrow>
              <h2 className="d2" style={{ marginTop: 18 }}>
                It&apos;s 2:14am. <em>Nothing</em> needs you.
              </h2>
              <p className="lead">Book a free 30-minute call. We&apos;ll map your setup and show you what to automate first.</p>
            </div>
            <BookingStage variant="home" />
          </div>
        </section>
      </main>
    </>
  );
}
