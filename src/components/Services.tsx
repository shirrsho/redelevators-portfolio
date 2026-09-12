"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SectionHead } from "./SectionHead";
import { Stagger, StaggerItem } from "./Reveal";
import { services, serviceDetails } from "@/lib/content";

export function Services() {
  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          label="What we do"
          title="If it's repetitive, it should run itself."
          intro="We embed with your team, map the manual work and the marketing that matters, then replace it with systems that run without you."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.num}>
              <Card {...s} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Card({
  num,
  slug,
  title,
  desc,
  tags,
}: {
  num: string;
  slug: string;
  title: string;
  desc: string;
  tags: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Only link once the service page actually exists — same completeness
  // check the page route itself gates on, so a card never points at a 404.
  const hasPage = !!serviceDetails[slug]?.manualChain?.length;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const card = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-7 transition-shadow hover:shadow-lift"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx) var(--my), rgba(255,45,59,0.10), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono-label">{num}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-red group-hover:bg-red group-hover:text-white">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
        <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2.5 text-[0.95rem] text-muted">{desc}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return hasPage ? (
    <Link href={`/services/${slug}`} className="contents">
      {card}
    </Link>
  ) : (
    card
  );
}
