import { ImageResponse } from "next/og";

// Site-wide social share image (1200×630). Next attaches it as og:image on
// every route automatically. Brand: white paper, Elevator Red #FF2D3B, the
// ascending-bars mark. No custom font is loaded — Satori's default sans keeps
// the build network-free and deterministic.
export const alt = "Red Elevators — Short-Term Rental Automation & Marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#FF2D3B";
const INK = "#17171B";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        {/* top red rule */}
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 12, background: RED }} />

        {/* mark: three ascending bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
          <div style={{ display: "flex", width: 26, height: 46, borderRadius: 8, background: RED }} />
          <div style={{ display: "flex", width: 26, height: 78, borderRadius: 8, background: RED }} />
          <div style={{ display: "flex", width: 26, height: 118, borderRadius: 8, background: RED }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: INK, letterSpacing: -2 }}>
            Red Elevators
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 40, fontWeight: 500, color: "#45454D", maxWidth: 900 }}>
            Short-term rental automation &amp; marketing
          </div>
        </div>

        {/* tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 8,
            color: RED,
            textTransform: "uppercase",
          }}
        >
          Growth on Autopilot
        </div>
      </div>
    ),
    { ...size }
  );
}
