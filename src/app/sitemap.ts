import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { services, serviceDetails } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/systems", changeFrequency: "monthly", priority: 0.8 },
    { path: "/approach", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  ];

  // Same filter as the service page's generateStaticParams — only slugs with a
  // real manual chain are live, so the sitemap can never list a 404.
  const serviceRoutes = services
    .filter((s) => serviceDetails[s.slug]?.manualChain?.length)
    .map((s) => ({
      path: `/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...serviceRoutes].map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
