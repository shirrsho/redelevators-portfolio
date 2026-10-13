import type { Metadata } from "next";

// Single source of truth for site-wide SEO. Titles follow the redesign
// (redesign-mockups/build-site.py → TITLES: "<Page> · Red Elevators");
// descriptions carry the keywords the business ranks for: short-term rental,
// Airbnb, vacation rental, direct bookings, guest messaging.
export const SITE = {
  name: "Red Elevators",
  url: "https://redelevators.com",
  tagline: "Growth on Autopilot",
  // Home <title> (build-site.py TITLES.home).
  defaultTitle: "Red Elevators · Automation & marketing for short-term rentals",
  titleTemplate: "%s · Red Elevators",
  description:
    "We build and run the automation and marketing behind short-term rentals: guest messaging, direct bookings and listings that run on autopilot. Book a free 30-minute call.",
  email: "contact@redelevators.com",
  locale: "en_US",
} as const;

export const SITE_KEYWORDS = [
  "short-term rental automation",
  "Airbnb automation",
  "vacation rental marketing",
  "short-term rental marketing agency",
  "direct booking system",
  "guest messaging automation",
  "Airbnb marketing agency",
  "STR automation",
  "vacation rental automation",
  "property management automation",
];

type PageMetaInput = {
  /** Page title fed through the "%s · Red Elevators" template. Omit for the
   *  home page, which uses SITE.defaultTitle. */
  title?: string;
  description: string;
  /** Root-relative path, e.g. "/services". Used for the canonical URL. */
  path: string;
  keywords?: string[];
};

/**
 * Builds a page's Metadata with a canonical URL plus matching Open Graph and
 * Twitter cards. The site-wide OG image (src/app/opengraph-image.tsx) is
 * attached automatically by Next's file convention, so we never set images
 * here — that keeps one branded share image across every route.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;
  const ogTitle = title ? `${title} · ${SITE.name}` : SITE.defaultTitle;

  return {
    ...(title ? { title } : {}),
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: ogTitle,
      description,
      url,
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

/** Organization node — no address/phone/socials are invented; only what's
 *  verifiable (name, url, logo, email, what we do). */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  legalName: SITE.name,
  slogan: SITE.tagline,
  description: SITE.description,
  logo: `${SITE.url}/brand/logo-lockup-light.svg`,
  email: SITE.email,
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE.email,
    contactType: "sales",
    availableLanguage: ["English"],
    areaServed: ["US", "AE"],
  },
  knowsAbout: [
    "Short-term rental automation",
    "Airbnb automation",
    "Vacation rental marketing",
    "Direct bookings",
    "Guest messaging automation",
    "AI workflow automation",
  ],
} as const;

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "en",
  publisher: { "@id": `${SITE.url}/#organization` },
} as const;

/** Breadcrumb trail for a subpage. Home is always the first crumb. */
export function breadcrumbLd(
  crumbs: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map(
      (c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.path === "/" ? SITE.url : `${SITE.url}${c.path}`,
      })
    ),
  };
}
