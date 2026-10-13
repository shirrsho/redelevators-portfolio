import type { NextConfig } from "next";
import { OLD_SERVICE_SLUGS } from "./src/lib/services";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server (.next/standalone) so the
  // production Docker image doesn't need to ship node_modules.
  output: "standalone",

  // Old service slugs → the redesign's (DECISIONS → URLs). `permanent: true`
  // sends 308, which search engines treat like 301.
  async redirects() {
    return Object.entries(OLD_SERVICE_SLUGS).map(([from, to]) => ({
      source: `/services/${from}`,
      destination: `/services/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
