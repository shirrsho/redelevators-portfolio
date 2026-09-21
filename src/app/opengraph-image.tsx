import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Red Elevators — Growth on Autopilot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same lockup used in the site header/footer (see src/components/Mark.tsx) —
// white wordmark variant, since this card sits on the site's own hero
// gradient (src/app/globals.css, "linear-gradient(120deg, ink 30%, red)").
const logoSvg = await readFile(
  join(process.cwd(), "public/brand/red-elevators-logo-dark.svg"),
  "utf-8",
);
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
          background: "linear-gradient(120deg, #17171b 30%, #ff2d3b)",
        }}
      >
        <img src={logoSrc} width={660} height={187} alt="" />
      </div>
    ),
    { ...size },
  );
}
