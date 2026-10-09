"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// One floating card pair per rotating-headline topic, in the same order as the
// rotator in Hero.tsx — kept in sync by the `index` prop.
const cards = [
  { top: ["New guest message", "Auto-replied · 28s"], bot: ["28s", "avg. reply"] },
  { top: ["Direct booking", "No OTA commission"], bot: ["direct", "0% fee"] },
  { top: ["Campaign live", "Filling the calendar"], bot: ["▲", "more bookings"] },
  { top: ["Rate updated", "Tonight’s demand"], bot: ["$151", "/ night"] },
  { top: ["All systems live", "Messaging · Pricing · Ads"], bot: ["4/4", "running"] },
];

const COLS = [142, 164, 186, 208];
const ROWS = Array.from({ length: 11 }, (_, r) => 112 + r * 20);
const lit = (c: number, r: number) => (c * 2 + r * 3) % 5 < 2;

export function HeroTower({ index }: { index: number }) {
  const reduce = useReducedMotion();
  const c = cards[index % cards.length];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <svg viewBox="0 0 360 400" className="h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="re-glow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#FF4550" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF4550" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="re-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1C1C22" />
            <stop offset="100%" stopColor="#121216" />
          </linearGradient>
        </defs>

        {/* ambient glow */}
        <circle cx="180" cy="180" r="170" fill="url(#re-glow)" />

        {/* ground shadow */}
        <ellipse cx="180" cy="340" rx="110" ry="22" fill="#000" opacity="0.5" />

        {/* orbit ring + travelling dot (dot passes behind the tower at the back) */}
        <path
          id="re-orbit"
          d="M40,338 a140,34 0 1,1 280,0 a140,34 0 1,1 -280,0"
          fill="none"
          stroke="#FF4550"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <g>
          <circle r="11" fill="#FF4550" opacity="0.25" />
          <circle r="4.5" fill="#FF4550" />
          {!reduce && (
            <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
              <mpath href="#re-orbit" />
            </animateMotion>
          )}
        </g>

        {/* tower: top face, right face, front face */}
        <polygon points="130,100 230,100 248,86 148,86" fill="#26262E" />
        <polygon points="230,100 248,86 248,316 230,330" fill="#0C0C0F" />
        <rect
          x="130"
          y="100"
          width="100"
          height="230"
          rx="3"
          fill="url(#re-face)"
          stroke="#2B2B31"
          strokeWidth="1"
        />

        {/* windows */}
        {ROWS.map((y, r) =>
          COLS.map((x, col) => {
            const on = lit(col, r);
            const twinkle = on && (col + r) % 6 === 0;
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="12"
                height="13"
                rx="1.5"
                fill={on ? "#FFB65C" : "#26262E"}
                opacity={on ? 0.95 : 0.6}
              >
                {twinkle && !reduce && (
                  <animate
                    attributeName="opacity"
                    values="0.95;0.3;0.95"
                    dur="3.2s"
                    begin={`${(col + r) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                )}
              </rect>
            );
          })
        )}

        {/* roof beacon */}
        <circle cx="180" cy="86" r="3.2" fill="#FF4550">
          {!reduce && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.8s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>

      {/* floating cards, synced to the active topic */}
      <FloatCard className="right-0 top-6 sm:top-10" delay={0}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF4550]" />
              <span className="text-sm font-semibold text-[#EDEDF0]">
                {c.top[0]}
              </span>
            </div>
            <div className="mt-1 text-xs text-[#A2A2AC]">{c.top[1]}</div>
          </motion.div>
        </AnimatePresence>
      </FloatCard>

      <FloatCard className="bottom-8 left-0 sm:bottom-12" delay={1.2}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="flex items-baseline gap-1.5"
          >
            <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#FF4550]">
              {c.bot[0]}
            </span>
            <span className="text-xs text-[#A2A2AC]">{c.bot[1]}</span>
          </motion.div>
        </AnimatePresence>
      </FloatCard>
    </div>
  );
}

function FloatCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute z-10 rounded-xl border border-[#2B2B31] bg-[#16161A]/90 px-3.5 py-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur ${className}`}
    >
      {children}
    </motion.div>
  );
}
