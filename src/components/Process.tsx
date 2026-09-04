"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "./Reveal";
import { steps } from "@/lib/content";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 65%"],
  });
  const height = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="process" className="relative overflow-hidden bg-ink py-24 text-white">
      <div className="pointer-events-none absolute inset-0 dot-bg opacity-[0.15]" />
      <div
        className="aurora"
        style={{
          width: 460,
          height: 460,
          bottom: -160,
          right: -120,
          background: "radial-gradient(circle, rgba(255,45,59,0.35), transparent 60%)",
          opacity: 0.4,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="font-mono-label">How we work</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-tight">
              From manual to automated in four steps.
            </h2>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16 pl-10 sm:pl-14">
          {/* rail */}
          <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/15 sm:left-[21px]" />
          <motion.div
            style={{ scaleY: height }}
            className="absolute left-[13px] top-2 bottom-2 w-px origin-top bg-red sm:left-[21px]"
          />

          <div className="space-y-12">
            {steps.map((s) => (
              <Reveal key={s.num} y={30}>
                <div className="group relative">
                  <span className="absolute -left-10 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-ink font-mono-label !text-[0.6rem] !text-white transition-colors group-hover:border-red group-hover:bg-red sm:-left-14 sm:h-9 sm:w-9 sm:!text-xs">
                    {s.num}
                  </span>
                  <h3 className="text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-2 max-w-lg text-white/60">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
