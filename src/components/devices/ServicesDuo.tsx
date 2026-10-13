"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks/useReducedMotion";
import { servicesIn } from "@/lib/services";
import { ConBar } from "@/components/devices/ScreenCard";
import { LaptopShell, PhoneShell } from "@/components/devices/PhoneShell";
import { Icon } from "@/components/ui/Icon";
import styles from "./servicesDuo.module.css";

// The /services hero: Marketing (a phone ad) brings a guest in, AI Automation (the laptop) looks
// after them. A 12.6s loop: three story-style creatives → a tap on "Book now" → "You're booked,
// Sofia." → a pulse travels to the laptop → the rows work in turn, counters ticking.
// Ported from redesign-mockups/r3/services.html (markup, fit(), travel(), cycle(), timings).
//
// The markup is static React; the loop drives it imperatively (classes, a measured SVG path,
// a rAF pulse), like the mockup, because it is built on live getBoundingClientRect() reads.
// It never re-renders, so React and the loop don't fight over the DOM. Starts when 25% in view,
// stops out of view; reduced motion shows the final state (booked, every row done).
// Under 900px it stacks: the phone, then the screen card (CSS in servicesDuo.module.css).

const AUTO = servicesIn("auto");
const CREATIVES: readonly (readonly [lines: readonly [string, string], gradient: string])[] = [
  [["Midweek escape.", "Book direct, save 10%."], "linear-gradient(160deg,#3d2c2a 0%,#7b4636 45%,#2b2e46 100%)"],
  [["Wake up on", "the water."], "linear-gradient(170deg,#1d3346 0%,#2f5d6e 45%,#1a1d2e 100%)"],
  [["Stay a week,", "pay for five."], "linear-gradient(160deg,#2b2140 0%,#5b3b5e 50%,#2a1f24 100%)"],
];
const IDLE = ["running", "running", "running", "running"];
const WORK = ["Matching guest…", "Reading message…", "Recording payment…", "Syncing calendars…"];
const DONE = ["Welcome sent to Sofia", "Answered “Is parking free?”", "Booked direct · $340 · no fee", "Blocked on Airbnb + Booking.com"];
const ORDER = [2, 0, 1, 3]; // direct booking first, then messaging, assistant, calendars
const START = { m: 6, b: 1, t: 1 };

export function ServicesDuo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duo = ref.current;
    if (!duo) return;
    const one = <T extends Element>(sel: string) => duo.querySelector<T>(sel)!;
    const all = <T extends Element>(sel: string) => [...duo.querySelectorAll<T>(sel)];

    const ph = one<HTMLElement>(".ph");
    const bars = all<HTMLElement>(".stories i");
    const crs = all<HTMLElement>(".cr");
    const rows = all<HTMLElement>(".modules .card[data-m]");
    const chipA = one<HTMLElement>(".hero-chip.a");
    const chipB = one<HTMLElement>(".hero-chip.b");
    const tap = one<HTMLElement>(".tap");
    const bn = one<HTMLElement>(".bn");
    const path = one<SVGPathElement>(".dwire path");
    const dot = one<SVGCircleElement>(".dwire circle");
    const mods = one<HTMLElement>(".modules");
    const adwrap = one<HTMLElement>(".adwrap");
    const C = { ...START };

    const bump = (k: keyof typeof C, by = 1) => {
      C[k] += by;
      const el = duo.querySelector<HTMLElement>(`[data-c="${k}"]`)!;
      el.textContent = String(C[k]);
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 500);
    };
    const setRow = (i: number, st?: "work" | "did") => {
      const r = rows[i];
      r.classList.remove("work", "did", "inbound");
      if (st) r.classList.add(st);
      r.querySelector("em")!.textContent = st === "work" ? WORK[i] : st === "did" ? DONE[i] : IDLE[i];
    };
    const rel = (el: Element) => {
      const a = el.getBoundingClientRect(), d = duo.getBoundingClientRect();
      return { x: a.left - d.left, y: a.top - d.top, w: a.width, h: a.height };
    };

    // Size the laptop to the column and pad the row content clear of the phone.
    const fit = () => {
      if (innerWidth <= 900) {
        duo.style.setProperty("--ls", "1");
        mods.style.paddingRight = "16px"; // stacked screen card on phones/tablets
        return;
      }
      const ls = Math.max(0.3, Math.min(0.72, (duo.clientWidth * 0.98) / 760));
      duo.style.setProperty("--ls", String(ls));
      const visible = (rel(ph).x - 14) / ls; // laptop pixels left of the phone
      mods.style.paddingRight = Math.max(16, 732 - visible) + "px";
    };
    const ro = new ResizeObserver(fit);
    ro.observe(duo);
    fit();

    let T: ReturnType<typeof setTimeout>[] = [];
    let running = false;
    let raf = 0;
    const at = (ms: number, fn: () => void) => T.push(setTimeout(fn, ms));
    const stop = () => {
      T.forEach(clearTimeout);
      T = [];
      cancelAnimationFrame(raf);
    };

    // A pulse from the phone's button to the laptop's booking row.
    const travel = (ms: number) => {
      const a = rel(bn), b = rel(rows[2]);
      const ax = a.x, ay = a.y + a.h / 2, bx = b.x + b.w * 0.55, by = b.y + b.h / 2;
      path.setAttribute("d", `M${ax} ${ay} C ${ax - 90} ${ay - 10}, ${bx + 60} ${by + 120}, ${bx} ${by}`);
      const len = path.getTotalLength(), t0 = performance.now();
      duo.classList.add("wiring");
      const go = (now: number) => {
        const f = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - f, 3), q = path.getPointAtLength(len * e);
        dot.setAttribute("cx", String(q.x));
        dot.setAttribute("cy", String(q.y));
        if (f < 1) raf = requestAnimationFrame(go);
      };
      raf = requestAnimationFrame(go);
    };

    const cycle = () => {
      stop();
      ph.classList.remove("is-booked");
      duo.classList.remove("wiring");
      Object.assign(C, START);
      duo.querySelectorAll<HTMLElement>("[data-c]").forEach((el) => {
        el.textContent = String(C[el.dataset.c as keyof typeof C]);
      });
      rows.forEach((_, i) => setRow(i));
      chipB.classList.add("hot");
      chipA.classList.remove("hot");
      bars.forEach((b) => {
        b.style.transition = "none";
        b.style.setProperty("--f", "0");
      });
      // 1 · three creatives, story-style
      CREATIVES.forEach((_, i) =>
        at(i * 1700, () => {
          crs.forEach((c, k) => c.classList.toggle("on", k === i));
          bars.forEach((b, k) => {
            if (k < i) {
              b.style.transition = "none";
              b.style.setProperty("--f", "1");
            }
          });
          requestAnimationFrame(() => {
            bars[i].style.transition = "transform 1.7s linear";
            bars[i].style.setProperty("--f", "1");
          });
        }),
      );
      // 2 · a guest taps "Book now"
      at(4900, () => {
        const r = rel(bn), pr = rel(adwrap), k = adwrap.offsetWidth / pr.w;
        tap.style.left = (r.x - pr.x + r.w / 2) * k + "px";
        tap.style.top = (r.y - pr.y + r.h / 2) * k + "px";
        tap.classList.remove("go");
        void tap.offsetWidth;
        tap.classList.add("go");
        bn.classList.add("press");
      });
      at(5150, () => bn.classList.remove("press"));
      // 3 · the booking travels to the system
      at(5300, () => {
        travel(900);
        chipB.classList.remove("hot");
      });
      at(5650, () => ph.classList.add("is-booked"));
      at(6200, () => {
        chipA.classList.add("hot");
        rows[2].classList.add("inbound");
      });
      // 4 · each part of the system does its job
      ORDER.forEach((m, k) => {
        at(6300 + k * 900, () => setRow(m, "work"));
        at(6300 + k * 900 + 750, () => {
          setRow(m, "did");
          if (m === 2) bump("b");
          if (m === 0 || m === 1) bump("m");
        });
      });
      at(7000, () => duo.classList.remove("wiring"));
      at(11800, () => chipA.classList.remove("hot"));
      at(12600, cycle);
    };

    if (prefersReducedMotion()) {
      crs[0].classList.add("on");
      ph.classList.add("is-booked");
      rows.forEach((_, i) => setRow(i, "did"));
      return () => ro.disconnect();
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          cycle();
        } else if (!e.isIntersecting && running) {
          running = false;
          stop();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(duo);
    return () => {
      io.disconnect();
      ro.disconnect();
      stop();
    };
  }, []);

  return (
    <div ref={ref} className={styles.duo}>
      <span className="chip hero-chip a">
        <i style={{ background: "#b9c3ff" }} />
        AI Automation runs here
      </span>
      <div className="lap">
        <LaptopShell>
          <div className="con" style={{ gridTemplateColumns: "1fr" }}>
            <ConBar title="Your system" status="All running" />
            <div className="modules">
              {AUTO.map((s, i) => (
                <div key={s.slug} className="card" data-m={i}>
                  <Icon name={s.icon} />
                  <span>{s.title}</span>
                  <em>running</em>
                </div>
              ))}
              <div className="card feed">
                <Icon name="sun" />
                <span>
                  Today: <b data-c="m">6</b> messages · <b data-c="b">1</b> direct bookings · <b data-c="t">1</b> turnover
                </span>
              </div>
            </div>
          </div>
        </LaptopShell>
      </div>
      <div className="ph">
        <PhoneShell>
          <div className="adwrap">
            <div className="stories">
              {CREATIVES.map((c) => (
                <i key={c[1]} />
              ))}
            </div>
            <div className="adcard">
              <div className="h">
                <i />
                <div>
                  <b>Harbor Studio</b>
                  <small>Sponsored</small>
                </div>
              </div>
              <div className="img">
                {CREATIVES.map(([lines, g]) => (
                  <div key={g} className="cr" style={{ "--g": g } as React.CSSProperties}>
                    <b>
                      {lines[0]}
                      <br />
                      {lines[1]}
                    </b>
                  </div>
                ))}
              </div>
              <div className="cta">
                <span style={{ background: "none", color: "var(--sub)", padding: 0, fontWeight: 400 }}>harborstudio.com</span>
                <span className="bn">Book now</span>
              </div>
            </div>
            <div className="booked">
              <div className="ok">✓</div>
              <h6>You’re booked, Sofia.</h6>
              <div className="r">
                <span>Harbor Studio</span>
                <b>Oct 18–20 · 2 nights</b>
              </div>
              <div className="r">
                <span>Paid</span>
                <b>$340</b>
              </div>
              <div className="tagz">
                <span>Booked direct</span>
                <span>No platform fee</span>
              </div>
            </div>
            <span className="tap" />
          </div>
        </PhoneShell>
      </div>
      <span className="chip hero-chip b">
        <i style={{ background: "var(--red)" }} />
        Marketing brings guests here
      </span>
      <svg className="dwire" aria-hidden="true">
        <path />
        <circle r="4" />
      </svg>
    </div>
  );
}
