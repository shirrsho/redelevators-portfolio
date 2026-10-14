"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { GAP, LIFT, N, PAINS, TURNS, VISIBLE } from "@/lib/story";
import { LaptopConsole } from "@/components/devices/LaptopConsole";
import { PhoneMockup } from "@/components/devices/PhoneMockup";
import { Chip, Tag } from "@/components/ui/Chip";
import { HeroCopy, MorningCopy, clearBg, paintBg } from "./StoryCopy";
import { MorningNote, StoryNote } from "./notes";
import styles from "./story.module.css";

// The story for prefers-reduced-motion: the four chapters as stacked sections, each showing
// its final state. No pinning, no scroll-driven movement. Same copy and headings as the
// animated stage (one H1, chapter lines as H2s).

const HL: Record<number, string> = Object.fromEntries(LIFT.map((L) => [L.n, L.hl]));

/** The night's lock screen once everything has arrived: newest first, 3 visible, the rest folded (home.js step()). */
function nightStyle(i: number) {
  const idx = N.length - 1 - i, VIS = VISIBLE.desktop;
  if (idx < VIS) return { opacity: 1, transform: `translateY(${idx * GAP}px)`, zIndex: 20 - idx };
  const k = idx - VIS;
  return { opacity: k < 2 ? 0.45 - k * 0.2 : 0, transform: `translateY(${(VIS - 1) * GAP + 14 + k * 9}px) scale(${0.94 - k * 0.04})`, zIndex: 5 - k };
}

export function StoryStatic() {
  const ref = useRef<HTMLElement>(null);

  // the background still follows the time of day (a colour change, not motion)
  useEffect(() => {
    const story = ref.current!;
    const bg = () => paintBg(story);
    bg();
    addEventListener("scroll", bg, { passive: true });
    addEventListener("resize", bg);
    return () => {
      removeEventListener("scroll", bg);
      removeEventListener("resize", bg);
      clearBg();
    };
  }, []);

  const seeHow = (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("story-familiar");
    if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY });
  };
  const hidden = N.length - VISIBLE.desktop;

  return (
    <section className={styles.storyStatic} id="story" ref={ref} aria-label="The night shift, in four chapters">
      <div className="wrap">
        <div className={`${styles.sRow} ${styles.sHero}`}>
          <div>
            <HeroCopy onSeeHow={seeHow} />
          </div>
          <div className={styles.sPhone} aria-hidden="true">
            <PhoneMockup time="2:14">
              {N.map((n, i) => (
                <StoryNote key={i} n={n} hl={HL[i]} style={nightStyle(i)} className={N.length - 1 - i >= VISIBLE.desktop ? "peek" : undefined} />
              ))}
              <div className="more" style={{ top: VISIBLE.desktop * GAP + 26 }}>
                {hidden} more
              </div>
            </PhoneMockup>
          </div>
        </div>

        <div className={styles.sChap} id="story-familiar">
          <div className={`${styles.kick} ${styles.amber}`}>Sound familiar?</div>
          <div className={styles.sGrid}>
            {PAINS.map((p, i) => {
              const L = LIFT[i];
              return (
                <div key={p[0]} className={styles.sItem}>
                  <h2 className="d2">{p[0]}</h2>
                  <p>{p[1]}</p>
                  <div className={`${styles.lift} ${styles.scan} ${styles.still}`} aria-hidden="true">
                    <Chip tone="problem">{L.chip}</Chip>
                    <StoryNote n={N[L.n]} hl={L.hl} />
                    <div className={styles.big}>
                      {L.big}
                      <small>{L.small}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.sChap}>
          <div className={`${styles.kick} ${styles.green}`}>Then it runs itself</div>
          <div className={styles.sGrid}>
              {TURNS.map((t, i) => {
                let last = -1;
                N.forEach((n, j) => n.fix === i && (last = j));
                return (
                  <div key={t[0]} className={styles.sItem}>
                    <h2 className="d2">{t[0]}</h2>
                    <p>{t[1]}</p>
                    <Tag pillar={t[2] === "both" ? undefined : t[2]}>{t[3]}</Tag>
                    <div className={`${styles.retn} ${styles.still}`} aria-hidden="true">
                      <StoryNote n={N[last]} done className="done" />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.sLaptop} aria-hidden="true">
            <LaptopConsole allOn view={4} />
          </div>
        </div>

        <div className={`${styles.sRow} ${styles.sChap}`}>
          <div>
            <MorningCopy />
          </div>
          <div className={styles.sPhone} aria-hidden="true">
            <PhoneMockup time="7:30" className="day">
              <MorningNote className={styles.summary} />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
