import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Site-wide social share image (1200×630). Next attaches it as og:image on
// every route automatically. Aurora: night base with the indigo and red light
// fields, and the rebuilt lockup (no tagline). The headline font is still to
// do (Stage 3: load Schibsted Grotesk into ImageResponse if text is added).
export const alt = "Red Elevators · Automation & marketing for short-term rentals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoSvg = await readFile(join(process.cwd(), "public/brand/logo-lockup-dark.svg"), "utf-8");
const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0b14",
          backgroundImage:
            "radial-gradient(40% 50% at 10% 6%, rgba(124,134,255,.38), transparent 70%), radial-gradient(40% 50% at 94% 92%, rgba(255,60,70,.32), transparent 70%)",
        }}
      >
        <img src={logoSrc} width={640} height={140} alt="" />
      </div>
    ),
    { ...size },
  );
}
