import type { MetadataRoute } from "next";
import { services } from "@/lib/content";

// Build-time only, same reasoning as robots.ts: static route, resolved once
// per image build. Staging (NOINDEX=true) still emits a sitemap since it's
// harmless — robots.ts is what actually blocks crawling there.
const baseUrl = "https://redelevators.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/services", "/approach", "/systems", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    }),
  );

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes];
}
