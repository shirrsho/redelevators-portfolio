"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const showcase = [
  {
    img: "/images/str-guest.jpg",
    alt: "A bright, furnished vacation-rental living room",
    cat: "Guest messaging",
    title: "Replies before you wake up",
    href: "/services",
  },
  {
    img: "/images/str-direct.jpg",
    alt: "A traveler taking a photo from a plane window",
    cat: "Direct bookings",
    title: "Fewer OTA fees, more direct",
    href: "/services",
  },
  {
    img: "/images/str-turnover.jpg",
    alt: "A freshly made bed in a clean rental bedroom",
    cat: "Turnovers & ops",
    title: "Cleanings that schedule themselves",
    href: "/systems",
  },
  {
    img: "/images/str-property.jpg",
    alt: "A modern short-term-rental property with a pool",
    cat: "Dynamic pricing",
    title: "Rates that move with demand",
    href: "/systems",
  },
];

export function Showcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showcase.map((s, i) => (
          <motion.a
            key={s.title}
            href={s.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
            className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-medium text-ink backdrop-blur">
                {s.cat}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-semibold leading-tight text-ink">
                {s.title}
              </span>
              <span className="shrink-0 text-red transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
