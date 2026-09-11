"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroVisual } from "./HeroVisual";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="aurora"
          style={{
            width: 480,
            height: 480,
            top: -120,
            right: -80,
            background:
              "radial-gradient(circle, rgba(255,45,59,0.28), transparent 60%)",
          }}
        />
        <div
          className="aurora"
          style={{
            width: 420,
            height: 420,
            top: 120,
            left: -140,
            background:
              "radial-gradient(circle, rgba(255,107,116,0.22), transparent 60%)",
            animationDelay: "-6s",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
            </span>
            <span className="font-mono-label !text-ink-soft">
              Automation Agency
            </span>
          </motion.div>

          <h1 className="mt-6 text-[clamp(2.6rem,6.2vw,4.6rem)] font-semibold leading-[0.98] tracking-tight">
            {["Your growth,", "running on"].map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease }}
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              className="block text-gradient"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease }}
            >
              autopilot.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-6 max-w-md text-lg text-muted"
          >
            Campaigns, workflows and the
            repetitive work, handled so your team doesn&apos;t have to.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
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

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
