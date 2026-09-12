import type { MetadataRoute } from "next";

// Build-time only (see Dockerfile / layout.tsx's `noindex`) — resolved once
// per image build, since this route is static like everything else on the
// site. The dev/staging build sets NOINDEX=true so dev.redelevators.com
// isn't crawled while it's an internal preview; production never sets it.
const noindex = process.env.NOINDEX === "true";

export default function robots(): MetadataRoute.Robots {
  if (noindex) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    host: "https://redelevators.com",
  };
}
