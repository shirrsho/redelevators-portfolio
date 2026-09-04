"use client";

import { motion } from "motion/react";
import { SectionHead } from "./SectionHead";
import { Stagger, StaggerItem } from "./Reveal";
import { work } from "@/lib/content";

export function Work() {
  return (
    <section id="work" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            label="Selected work"
            title="Built once. Runs forever."
            intro="A few of the systems we've shipped. Every one still runs today — quietly compounding while the team focuses elsewhere."
          />
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {work.map((w) => (
            <StaggerItem key={w.title}>
              <WorkCard {...w} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function WorkCard({
  tag,
  title,
  metric,
  metricLabel,
  desc,
  accent,
}: (typeof work)[number]) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-8 transition-shadow hover:shadow-lift"
    >
      {/* corner accent */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: accent }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-medium text-ink-soft">
            {tag}
          </span>
          <span className="translate-x-2 text-ink opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 13L13 1M13 1H4M13 1V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="mt-8">
          <div
            className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight sm:text-6xl"
            style={{ color: accent }}
          >
            {metric}
          </div>
          <div className="mt-1 text-sm text-muted">{metricLabel}</div>
        </div>

        <h3 className="mt-8 text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-[0.95rem] text-muted">{desc}</p>

        <div className="mt-6 h-px w-full origin-left scale-x-0 bg-line transition-transform duration-500 group-hover:scale-x-100" />
      </div>
    </motion.article>
  );
}
