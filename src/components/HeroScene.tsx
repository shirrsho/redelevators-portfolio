"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

// Each card links to its OWN anchor on the building — a sensor sitting on a
// specific balcony / window / rooftop — so the wiring is distributed across
// the whole property instead of converging on one hub. `card` is where the
// floating card sits; `anchor` is the point on the building it wires to.
type Link = {
  card: { x: number; y: number };
  anchor: { x: number; y: number };
  delay: number;
};

const NODES: Record<
  "flow" | "bookings" | "ai" | "revenue" | "status",
  Link
> = {
  flow: { card: { x: 47, y: 5 }, anchor: { x: 43, y: 25 }, delay: 0.34 },
  bookings: { card: { x: 22, y: 33 }, anchor: { x: 40, y: 38 }, delay: 0.48 },
  ai: { card: { x: 77, y: 29 }, anchor: { x: 64, y: 44 }, delay: 0.62 },
  revenue: { card: { x: 22, y: 71 }, anchor: { x: 40, y: 61 }, delay: 0.76 },
  status: { card: { x: 78, y: 66 }, anchor: { x: 63, y: 66 }, delay: 0.9 },
};

// Rounded-elbow wire: run out from the card, then turn into the building
// anchor — reads like a cable run rather than a straight diagonal.
function wirePath(l: Link) {
  return `M${l.card.x},${l.card.y} Q${l.anchor.x},${l.card.y} ${l.anchor.x},${l.anchor.y}`;
}

// Brand chip colours (Simple Icons palette).
const CHIP: Record<string, { bg: string; fg: string }> = {
  airbnb: { bg: "#ffffff", fg: "#FF385C" },
  bookingdotcom: { bg: "#003580", fg: "#ffffff" },
  whatsapp: { bg: "#25D366", fg: "#ffffff" },
  meta: { bg: "#ffffff", fg: "#0081FB" },
  n8n: { bg: "#ffffff", fg: "#EA4B71" },
  googlecalendar: { bg: "#ffffff", fg: "#4285F4" },
  gmail: { bg: "#ffffff", fg: "#111111" },
  googleads: { bg: "#ffffff", fg: "#111111" },
  googleanalytics: { bg: "#ffffff", fg: "#111111" },
};

function Chip({ id }: { id: keyof typeof CHIP }) {
  const c = CHIP[id];
  return (
    <span
      className="grid flex-none place-items-center rounded-[28%] ring-1 ring-black/[0.07]"
      style={{
        width: "clamp(21px,6.4cqi,44px)",
        height: "clamp(21px,6.4cqi,44px)",
        background: c.bg,
        color: c.fg,
        boxShadow:
          "0 3px 9px rgba(23,23,27,.2), inset 0 0 0 1px rgba(255,255,255,.5)",
      }}
    >
      <svg
        className="fill-current"
        style={{ width: "62%", height: "62%" }}
        aria-hidden
      >
        <use href={`#h-b-${id}`} />
      </svg>
    </span>
  );
}

function Ico({
  id,
  className,
  style,
}: {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      style={{
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...style,
      }}
    >
      <use href={`#h-${id}`} />
    </svg>
  );
}

function Card({
  pos,
  delay,
  reduce,
  children,
}: {
  pos: { x: number; y: number };
  delay: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2.5 backdrop-blur lg:gap-3 lg:rounded-[1.35rem] lg:px-4 lg:py-3"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        boxShadow:
          "0 1px 2px rgba(23,23,27,.06), 0 24px 46px -20px rgba(23,23,27,.42)",
      }}
      initial={reduce ? false : { opacity: 0, scale: 0.82, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  );
}

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(11px,3.2cqi,20px)",
  lineHeight: 1.2,
};
const statStyle: React.CSSProperties = { fontSize: "clamp(10px,2.9cqi,17px)" };

export function HeroScene() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      className="relative mx-auto w-full max-w-[680px]"
      style={{ aspectRatio: "1 / 0.98", containerType: "inline-size" }}
      aria-hidden
    >
      <Sprite />

      {/* No panel — the building melts straight into the hero section. A warm
          interior-light glow + a cool haze give it atmosphere, and a soft
          contact shadow plus a masked base let it dissolve into the ground. */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "104%",
          height: "98%",
          background:
            "radial-gradient(ellipse at 52% 66%, rgba(255,178,120,0.24), transparent 56%), radial-gradient(ellipse at 50% 40%, rgba(120,124,135,0.12), transparent 60%)",
          filter: "blur(10px)",
        }}
      />
      {/* soft contact shadow melting into the section floor */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          top: "88%",
          width: "62%",
          height: "8%",
          background:
            "radial-gradient(ellipse, rgba(23,23,27,0.26), transparent 72%)",
          filter: "blur(12px)",
        }}
      />

      {/* the property — base fades out so it dissolves into the section bg */}
      <motion.img
        src="/images/building.webp"
        alt=""
        width={1254}
        height={1254}
        className="absolute left-1/2 top-1/2 w-[102%] -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          maskImage: "linear-gradient(180deg, #000 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 85%, transparent 100%)",
          filter: "drop-shadow(0 30px 22px rgba(23,23,27,0.10))",
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
      />

      {/* wires — graphite cable runs (building palette) with a red data pulse,
          drawn over the building, one per anchor */}
      <svg
        className="absolute inset-0 z-[5] h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {Object.entries(NODES).map(([key, l]) => {
          const d = wirePath(l);
          return (
            <g key={key}>
              <motion.path
                d={d}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={0.42}
                strokeWidth={1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: l.delay + 0.16, duration: 0.55, ease }}
              />
              {!reduce && (
                <motion.path
                  d={d}
                  fill="none"
                  stroke="var(--color-red)"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  style={{ strokeDasharray: "0.07 0.93" }}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 1 }}
                  transition={{
                    delay: l.delay + 0.6,
                    duration: 2.6,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* anchor nodes on the building */}
      {Object.entries(NODES).map(([key, l]) => (
        <motion.span
          key={key}
          className="absolute z-[6] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${l.anchor.x}%`, top: `${l.anchor.y}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: l.delay + 0.1, duration: 0.4, ease }}
        >
          <span className="relative grid place-items-center">
            <span
              className="rounded-full bg-red/90 ring-2 ring-white/80"
              style={{ width: 7, height: 7 }}
            />
            {!reduce && (
              <motion.span
                className="absolute rounded-full border border-red"
                style={{ width: 7, height: 7 }}
                initial={{ opacity: 0.35, scale: 1 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{
                  duration: 2.8,
                  ease: "easeOut",
                  repeat: Infinity,
                  delay: l.delay + 0.5,
                }}
              />
            )}
          </span>
        </motion.span>
      ))}

      {/* flow pill */}
      <Card pos={NODES.flow.card} delay={NODES.flow.delay} reduce={reduce}>
        <Chip id="whatsapp" />
        <Ico id="i-arrow" className="text-red" style={{ width: "clamp(12px,2.8cqi,18px)", height: "clamp(12px,2.8cqi,18px)" }} />
        <Chip id="gmail" />
        <Ico id="i-arrow" className="text-red" style={{ width: "clamp(12px,2.8cqi,18px)", height: "clamp(12px,2.8cqi,18px)" }} />
        <Chip id="googlecalendar" />
      </Card>

      {/* bookings */}
      <Card pos={NODES.bookings.card} delay={NODES.bookings.delay} reduce={reduce}>
        <span className="flex flex-none gap-1.5">
          <Chip id="airbnb" />
          <Chip id="bookingdotcom" />
        </span>
        <span className="whitespace-nowrap">
          <span className="block font-medium text-ink" style={titleStyle}>
            Bookings
          </span>
          <span
            className="mt-0.5 flex items-center gap-1 font-medium text-[color:var(--color-red-text)]"
            style={statStyle}
          >
            <Ico id="i-up" style={{ width: "clamp(11px,2.7cqi,16px)", height: "clamp(11px,2.7cqi,16px)", strokeWidth: 2.4 }} />
            +132%
          </span>
        </span>
      </Card>

      {/* ai automation */}
      <Card pos={NODES.ai.card} delay={NODES.ai.delay} reduce={reduce}>
        <span className="flex flex-none gap-1.5">
          <Chip id="whatsapp" />
          <Chip id="gmail" />
          <Chip id="n8n" />
        </span>
        <span
          className="whitespace-nowrap font-medium text-ink"
          style={titleStyle}
        >
          AI Automation
        </span>
      </Card>

      {/* revenue */}
      <Card pos={NODES.revenue.card} delay={NODES.revenue.delay} reduce={reduce}>
        <Ico id="i-bars" className="flex-none text-red" style={{ width: "clamp(22px,5.2cqi,32px)", height: "clamp(22px,5.2cqi,32px)", strokeWidth: 1.7 }} />
        <span className="whitespace-nowrap">
          <span className="block font-medium text-ink" style={titleStyle}>
            Revenue
          </span>
          <span
            className="mt-0.5 flex items-center gap-1 font-medium text-[color:var(--color-red-text)]"
            style={statStyle}
          >
            <Ico id="i-up" style={{ width: "clamp(11px,2.7cqi,16px)", height: "clamp(11px,2.7cqi,16px)", strokeWidth: 2.4 }} />
            +32%
          </span>
        </span>
      </Card>

      {/* status checklist */}
      <motion.ul
        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1.5 rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2.5 backdrop-blur lg:gap-2.5 lg:rounded-[1.35rem] lg:px-4 lg:py-3.5"
        style={{
          left: `${NODES.status.card.x}%`,
          top: `${NODES.status.card.y}%`,
          boxShadow:
            "0 1px 2px rgba(23,23,27,.06), 0 24px 46px -20px rgba(23,23,27,.42)",
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.82, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: NODES.status.delay, duration: 0.6, ease }}
      >
        {[
          { chip: "airbnb", label: "Listing" },
          { chip: "meta", label: "Ads" },
          { chip: "whatsapp", label: "Messages" },
          { chip: "googlecalendar", label: "Bookings" },
        ].map((r) => (
          <li key={r.label} className="flex items-center gap-2 whitespace-nowrap">
            <Chip id={r.chip as keyof typeof CHIP} />
            <span className="mr-auto font-medium text-ink" style={titleStyle}>
              {r.label}
            </span>
            <span
              className="grid flex-none place-items-center rounded-full bg-red text-white"
              style={{ width: "clamp(15px,3.6cqi,21px)", height: "clamp(15px,3.6cqi,21px)" }}
            >
              <Ico id="i-check" style={{ width: "clamp(9px,2.2cqi,13px)", height: "clamp(9px,2.2cqi,13px)", strokeWidth: 2.4 }} />
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

/* Icon + brand-mark sprite (Simple Icons paths). Prefixed `h-` so the ids
   never collide with anything else on the page. */
function Sprite() {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden
      focusable="false"
    >
      <symbol id="h-b-airbnb" viewBox="0 0 24 24">
        <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
      </symbol>
      <symbol id="h-b-bookingdotcom" viewBox="0 0 24 24">
        <path d="M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z" />
      </symbol>
      <symbol id="h-b-gmail" viewBox="52 42 88 66">
        <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
        <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
        <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
        <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
        <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
      </symbol>
      <symbol id="h-b-googlecalendar" viewBox="0 0 24 24">
        <path d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z" />
      </symbol>
      <symbol id="h-b-meta" viewBox="0 0 24 24">
        <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
      </symbol>
      <symbol id="h-b-n8n" viewBox="0 0 24 24">
        <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632" />
      </symbol>
      <symbol id="h-b-whatsapp" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </symbol>
      <symbol id="h-i-arrow" viewBox="0 0 24 24">
        <path d="M4 12h16M14 6l6 6-6 6" />
      </symbol>
      <symbol id="h-i-up" viewBox="0 0 24 24">
        <path d="M12 20V5M6 11l6-6 6 6" />
      </symbol>
      <symbol id="h-i-bars" viewBox="0 0 24 24">
        <rect x="3" y="13" width="4" height="8" rx="1.2" />
        <rect x="10" y="9" width="4" height="12" rx="1.2" />
        <rect x="17" y="3.5" width="4" height="17.5" rx="1.2" />
      </symbol>
      <symbol id="h-i-check" viewBox="0 0 16 16">
        <path d="m4.8 8.3 2.2 2.1 4.2-4.6" />
      </symbol>
    </svg>
  );
}
