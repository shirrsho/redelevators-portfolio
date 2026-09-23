"use client";

import { motion } from "motion/react";
import { Counter } from "./Counter";
import { bookingUrl } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

const accents = ["#FF2D3B", "#17171B", "#FF2D3B", "#17171B"];

const heroStats: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: 34, label: "Listings automated" },
  { value: 15, suffix: "+", label: "Hosts served" },
  { value: 2, suffix: " wk", label: "To go-live" },
  { value: 14, prefix: "~", suffix: " hrs", label: "Saved / week" },
  { value: 20, suffix: "+", label: "Tools we connect" },
  { value: 5, suffix: "+", label: "Markets served" },
];

const headline = ["Rental process,", "running on"] as const;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="aurora"
          style={{
            width: 620,
            height: 620,
            top: -220,
            left: "50%",
            marginLeft: -310,
            background:
              "radial-gradient(circle, rgba(255,45,59,0.26), transparent 60%)",
          }}
        />
        <div
          className="aurora"
          style={{
            width: 420,
            height: 420,
            top: 60,
            left: -160,
            background:
              "radial-gradient(circle, rgba(255,107,116,0.18), transparent 60%)",
            animationDelay: "-6s",
          }}
        />
        <div
          className="aurora"
          style={{
            width: 420,
            height: 420,
            top: 40,
            right: -160,
            background:
              "radial-gradient(circle, rgba(255,45,59,0.14), transparent 60%)",
            animationDelay: "-10s",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* kicker */}
        {/* <motion.div
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 shadow-soft backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
          </span>
          <span className="font-mono-label text-ink-soft">
            Short-Stay Automation
          </span>
        </motion.div> */}

        {/* headline */}
        <h1 className="mx-auto mt-7 max-w-[16ch] text-[clamp(2.9rem,8vw,5.4rem)] font-semibold leading-[0.95] tracking-tight">
          {headline.map((line, i) => (
            <motion.span
              key={i}
              className="block"
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease }}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="block text-gradient"
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            autopilot.
          </motion.span>
        </h1>

        {/* subhead */}
        {/* <motion.p
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted"
        >
          Campaigns, workflows and the repetitive work, handled so your team
          doesn&apos;t have to.
        </motion.p> */}

        {/* CTA */}
        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white shadow-red transition-transform hover:scale-[1.03] active:scale-95"
          >
            <span className="relative z-10">Book a free Call</span>
            <span className="absolute inset-0 -translate-x-full bg-red-hover transition-transform duration-300 group-hover:translate-x-0" />
            <span className="pointer-events-none absolute inset-0 z-10 flex items-center px-6 text-sm font-semibold text-white opacity-0 group-hover:opacity-100">
              <span className="ml-[7rem]">→</span>
            </span>
          </a>
          <a
            href="#systems"
            className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-cream"
          >
            See how it works
          </a>
        </motion.div>
      </div>

      {/* stats */}
      <div className="mx-auto mt-16 max-w-6xl px-6 sm:mt-20">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ y: 28 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 + i * 0.07, ease }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white/90 p-5 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-lift"
            >
              <span
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: accents[i % accents.length] }}
              />
              <div className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.4vw,2.2rem)] font-semibold leading-none tracking-tight text-red">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-2.5 text-xs leading-snug text-muted">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
