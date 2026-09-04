"use client";

import { motion, useReducedMotion } from "motion/react";

export function Mark({
  size = 32,
  animate = true,
}: {
  size?: number;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const on = animate && !reduce;

  const bars = [
    { x: 4, y: 74, h: 16 },
    { x: 22, y: 64, h: 26 },
    { x: 40, y: 46, h: 44 },
  ];

  return (
    <svg
      width={size}
      height={(size * 78) / 56}
      viewBox="2 16 56 78"
      fill="none"
      role="img"
      aria-label="Red Elevators"
    >
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          width={12}
          rx={4}
          fill="#FF2D3B"
          initial={on ? { height: 0, y: 90 } : false}
          animate={on ? { height: b.h, y: b.y } : { height: b.h, y: b.y }}
          transition={{
            duration: 0.7,
            delay: 0.1 * i,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
      {/* rising particles */}
      {[
        { cx: 46, cy: 38, r: 4, o: 0.85, d: 0 },
        { cx: 54, cy: 30, r: 3.2, o: 0.55, d: 0.5 },
        { cx: 44, cy: 22, r: 2.6, o: 1, d: 1 },
      ].map((p, i) =>
        on ? (
          <motion.circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={i === 2 ? "#FF0000" : "#FF2D3B"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, p.o, 0], y: [6, -14] }}
            transition={{
              duration: 2.2,
              delay: 0.6 + p.d,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeOut",
            }}
          />
        ) : (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={i === 2 ? "#FF0000" : "#FF2D3B"}
            opacity={p.o}
          />
        )
      )}
    </svg>
  );
}

export function Wordmark({
  size = 20,
  tagline = true,
}: {
  size?: number;
  tagline?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Mark size={size + 10} />
      <span className="flex flex-col leading-none">
        <span
          className="font-[family-name:var(--font-display)] font-bold tracking-tight text-ink"
          style={{ fontSize: size }}
        >
          Red Elevators
        </span>
        {tagline && (
          <span
            className="leading-3 -mb-3 font-[family-name:var(--font-mono)] font-medium uppercase text-muted"
            style={{
              fontSize: Math.max(7.5, size * 0.42),
              letterSpacing: "0.18em",
            }}
          >
            Growth on Autopilot
          </span>
        )}
      </span>
    </div>
  );
}
