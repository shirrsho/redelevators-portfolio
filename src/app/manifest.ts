import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff2d3b",
    icons: [
      {
        src: "/brand/red-elevators-mark-light.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
