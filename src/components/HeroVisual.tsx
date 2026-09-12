"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

// rising line path
const LINE = "M8 132 L52 118 L96 124 L140 92 L184 100 L228 58 L272 66 L312 22";
const AREA =
  "M8 132 L52 118 L96 124 L140 92 L184 100 L228 58 L272 66 L312 22 L312 152 L8 152 Z";

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* floating nodes */}
      <FloatNode
        className="-left-6 -top-6"
        label="New lead"
        dot="#FF2D3B"
        delay={1.1}
        float={!!reduce}
      />
      <FloatNode
        className="-right-4 top-28"
        label="Auto-qualified"
        dot="#17171B"
        delay={1.35}
        float={!!reduce}
      />
      <FloatNode
        className="-left-2 -bottom-6"
        label="CRM updated"
        dot="#FF6B74"
        delay={1.6}
        float={!!reduce}
      />

      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-3xl border border-line bg-white/90 p-5 shadow-lift backdrop-blur-xl"
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
            </span>
            <span className="font-mono-label text-muted">Speed-to-lead · live</span>
          </div>
          <span className="rounded-full bg-red/10 px-2.5 py-1 font-mono-label">
            6 steps
          </span>
        </div>

        {/* chart */}
        <div className="relative mt-4">
          <svg viewBox="0 0 320 160" className="w-full">
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF2D3B" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#FF2D3B" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[152, 114, 76, 38].map((y) => (
              <line
                key={y}
                x1="8"
                x2="312"
                y1={y}
                y2={y}
                stroke="#17171B"
                strokeOpacity="0.06"
              />
            ))}
            <motion.path
              d={AREA}
              fill="url(#fill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            <motion.path
              d={LINE}
              fill="none"
              stroke="#FF2D3B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.7, ease }}
            />
            <motion.circle
              cx="312"
              cy="22"
              r="5"
              fill="#FF2D3B"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.2, type: "spring", stiffness: 300 }}
            />
            <motion.circle
              cx="312"
              cy="22"
              r={5}
              fill="#FF2D3B"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={
                reduce
                  ? { scale: 1, opacity: 0 }
                  : { scale: [1, 2.6], opacity: [0.5, 0] }
              }
              transition={{ duration: 1.8, repeat: Infinity, delay: 2.4 }}
            />
          </svg>
        </div>

        {/* mini stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { k: "Captured", v: "Webflow" },
            { k: "Qualified", v: "OpenAI" },
            { k: "Routed", v: "HubSpot" },
          ].map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.12, ease }}
              className="rounded-xl bg-cream px-3 py-2.5"
            >
              <div className="font-[family-name:var(--font-display)] text-sm font-semibold text-ink">
                {s.v}
              </div>
              <div className="font-mono-label text-[0.6rem] text-muted">
                {s.k}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FloatNode({
  className,
  label,
  dot,
  delay,
  float,
}: {
  className: string;
  label: string;
  dot: string;
  delay: number;
  float?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      // Hidden below `lg` — these float just outside the card's edges,
      // which only works once the hero's two-column layout gives them room.
      // Below that breakpoint the card runs edge-to-edge, so the same
      // negative offsets land the badge on top of the card's own content
      // instead of beside it. Confirmed via screenshot: "New lead" covered
      // the live label, "CRM updated" covered the Captured/Webflow tile.
      // Fixed 12 Sep 2026 — user-reported.
      className={`absolute z-20 hidden lg:block ${className}`}
    >
      <motion.div
        animate={float ? undefined : { y: [0, -8, 0] }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-2 rounded-xl border border-line bg-white/95 px-3 py-2 text-xs font-medium text-ink shadow-soft backdrop-blur"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: dot }}
        />
        {label}
      </motion.div>
    </motion.div>
  );
}
