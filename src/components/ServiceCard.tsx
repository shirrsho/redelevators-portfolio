"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { serviceDetails } from "@/lib/content";

/**
 * The service card — shared by the home page's Services section and the
 * `/services` index page, so both read as one system rather than two
 * templates. Image-led: a photo, the title and its tags — the mechanism and
 * the felt cost live on the service page, not the card.
 */
export function ServiceCard({
  slug,
  title,
  img,
  tags,
}: {
  slug: string;
  title: string;
  img: string;
  tags: string[];
}) {
  // Only link once the service page actually exists — same completeness
  // check the page route itself gates on, so a card never points at a 404.
  const hasPage = !!serviceDetails[slug]?.manualChain?.length;

  const card = (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors duration-300 group-hover:bg-red group-hover:text-white">
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
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
    <Link href={`/services/${slug}`} scroll={false} className="contents">
      {card}
    </Link>
  ) : (
    card
  );
}
