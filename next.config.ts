import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Emit a minimal, self-contained server (.next/standalone) so the
  // production Docker image doesn't need to ship node_modules.
  output: "standalone",
};

export default nextConfig;
