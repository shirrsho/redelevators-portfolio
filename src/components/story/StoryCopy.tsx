import type { MouseEventHandler } from "react";
import { EVENTS } from "@/lib/analytics";
import { REASSURE, TIME_OF_DAY } from "@/lib/story";
import { Button, TextLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import styles from "./story.module.css";

// Copy shared by the animated story and its static (reduced-motion) version.

/** Chapter 01, the night: eyebrow, the page's H1, lead, CTAs, reassurances, "Skip the story". */
export function HeroCopy({ onSeeHow }: { onSeeHow?: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <>
      <Eyebrow>For short-term rental hosts &amp; property managers</Eyebrow>
      <h1 className="d1">
        Your rentals,
        <br />
        running on <em>autopilot.</em>
      </h1>
      <p className="lead">We build and run the automation and marketing behind short-term rentals, so the night shift runs itself.</p>
      <div className={styles.ctas}>
        <Button href="#calm" arrow event={EVENTS.jumpToBooking} location="hero">
          Book a free 30-min call
        </Button>
        <Button href="#story" variant="quiet" event={EVENTS.seeHowItWorks} location="hero" onClick={onSeeHow}>
          See how it works
        </Button>
      </div>
      <div className={styles.reassure}>
        {REASSURE.map((t) => (
          <span key={t}>
            <Icon name="check" />
            {t}
          </span>
        ))}
      </div>
      <TextLink href="#build" className={styles.skip} event={EVENTS.storySkip} location="hero">
        Skip the story →
      </TextLink>
    </>
  );
}

/** Morning: 7:30am, "Good morning. Nothing needs you." */
export function MorningCopy() {
  return (
    <>
      <div className={`${styles.kick} ${styles.green}`}>
        <Icon name="sun" />
        7:30am
      </div>
      <h2 className="d2" style={{ marginTop: 14 }}>
        Good morning.
        <br />
        Nothing needs you.
      </h2>
      <p className="lead">That&apos;s the system. Next: how one booking moves through it, start to finish.</p>
      <div className={styles.ctas}>
        <Button href="#calm" arrow event={EVENTS.jumpToBooking} location="story">
          Book a free 30-min call
        </Button>
        <Button href="#journey-sec" variant="quiet">
          Follow a booking ↓
        </Button>
      </div>
    </>
  );
}

// ---- Background colour follows the time of day (home.js paintBg) ---------------------------
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: readonly number[], b: readonly number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const { night: NIGHT, dawn: DAWN, day: DAY } = TIME_OF_DAY;
const top = (el: Element) => el.getBoundingClientRect().top + scrollY;

let painted = "";

/**
 * Paints <html>'s background colour: night through the story's first half, night → dawn through
 * the turn, dawn → day into chapter 04, day until the booking chapter, then back to night.
 * Writes the colour directly instead of animating --bg: a custom property on <html> restyles
 * the whole page on every scroll event. `fade` (the stage's readability gradient, drawn in
 * currentColor) gets the same colour so it keeps blending into the page.
 */
export function paintBg(story: HTMLElement, fade?: HTMLElement | null) {
  const y = scrollY, H = innerHeight;
  const flow = document.getElementById("journey-sec"), calm = document.getElementById("calm");
  if (!flow || !calm) return;
  const span = story.offsetHeight - H, storyTop = top(story);
  const turnStart = storyTop + 0.5 * span, storyEnd = storyTop + span;
  const flowTop = top(flow), calmTop = top(calm);
  let c: readonly number[];
  if (y < turnStart) c = NIGHT;
  else if (y < storyEnd) c = mix(NIGHT, DAWN, clamp((y - turnStart) / (storyEnd - turnStart)));
  else if (y < flowTop + H) c = mix(DAWN, DAY, clamp((y - storyEnd) / (flowTop + H - storyEnd)));
  else if (y < calmTop - H * 0.9) c = DAY;
  else c = mix(DAY, NIGHT, clamp((y - (calmTop - H * 0.9)) / (H * 0.7)));
  const v = `rgb(${c})`;
  if (v === painted) return;
  painted = v;
  document.documentElement.style.backgroundColor = v;
  if (fade) fade.style.color = v;
}

/** Other pages fix --bg with <PageBg>; don't leave the story's last colour behind. */
export function clearBg() {
  painted = "";
  document.documentElement.style.removeProperty("background-color");
}
