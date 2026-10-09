"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { HeroTower } from "./HeroTower";
import { bookingUrl } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

// The rotating sub-headline — "We run {service} for {audience}."
const rotator = [
  { service: "guest messaging", audience: "Airbnb hosts" },
  { service: "direct bookings", audience: "property managers" },
  { service: "paid ads & creative", audience: "rental operators" },
  { service: "dynamic pricing", audience: "multi-unit portfolios" },
  { service: "the whole stack", audience: "your rentals" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % rotator.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0E0E10] text-[#EDEDF0]"
    >
      {/* backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute"
          style={{
            width: 700,
            height: 700,
            top: -160,
            right: -160,
            background:
              "radial-gradient(circle, rgba(255,69,80,0.16), transparent 62%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-28 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* left */}
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="text-[clamp(2.6rem,5.6vw,4.6rem)] font-semibold leading-[1.03] tracking-tight text-white"
            >
              Rental process,
              <br />
              <span className="text-[#FF4550]">running on autopilot.</span>
            </motion.h1>

            {/* rotating sub-line */}
            <div className="mt-6 h-8 text-lg text-[#A2A2AC]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                >
                  We run{" "}
                  <span className="font-semibold text-white">
                    {rotator[i].service}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-[#FF4550]">
                    {rotator[i].audience}
                  </span>
                  .
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="Book a call"
                data-umami-event-location="hero"
                className="rounded-xl bg-[#FF4550] px-6 py-3.5 text-sm font-semibold text-[#0E0E10] transition-transform hover:scale-[1.03] active:scale-95"
              >
                Book a free Call
              </a>
              <a
                href="#systems"
                className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
              >
                See how it works
              </a>
            </motion.div>
          </div>

          {/* right: animated tower */}
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <HeroTower index={i} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
