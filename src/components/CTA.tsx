"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section id="contact" className="px-4 py-16 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-red-panel px-6 py-20 text-white sm:px-16">
        {/* animated bars backdrop */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-3 pr-6 opacity-20">
          {[0.3, 0.5, 0.4, 0.7, 0.55, 0.85, 0.65, 1].map((h, i) => (
            <motion.span
              key={i}
              className="w-8 rounded-t-lg bg-white sm:w-12"
              initial={{ height: 0 }}
              whileInView={{ height: `${h * 100}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 20% 0%, rgba(255,255,255,0.18), transparent 60%)",
          }}
        />

        <div className="relative max-w-xl">
          <Reveal>
            <span className="font-mono-label text-white">
              Growth on Autopilot
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tight">
              Ready to stop doing the repetitive work yourself?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-lg text-white">
              Book a free 30-minute call. We&apos;ll tell you exactly what to
              automate first.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="https://calendly.com/redelevators/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-red transition-transform hover:scale-[1.03] active:scale-95"
              >
                Book a free Call
              </a>
              {/* Absolute path via Link, not a bare `#systems` anchor — CTA
                  renders on /services and /services/[slug] too, which have
                  no element with id="systems". A bare anchor silently did
                  nothing there. Fixed 12 Sep 2026. */}
              <Link
                href="/#systems"
                className="rounded-xl border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                See how it works
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
