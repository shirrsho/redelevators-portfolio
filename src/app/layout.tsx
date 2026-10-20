import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import Script from "next/script";
import { AssistantRoot } from "@/components/assistant/AssistantRoot";
import { Analytics } from "@/components/layout/Analytics";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/layout/JsonLd";
import { Nav } from "@/components/layout/Nav";
import { SiteEffects } from "@/components/layout/SiteEffects";
import { CurrencyProvider } from "@/lib/currency";
import { SITE, SITE_KEYWORDS, organizationLd, websiteLd } from "@/lib/seo";
import "./globals.css";

// Self-hosted Umami (analytics.redelevators.com). stats.js handles pageviews
// (including client-side route changes) and `data-umami-event` click events;
// recorder.js adds replays and heatmaps, with sample rates and masking set in
// the Umami dashboard. `data-domains` keeps localhost and previews out of the
// numbers — recorder.js only runs once stats.js has a session, so it inherits
// that filter. `data-performance` sends Core Web Vitals (the Performance
// report); `data-exclude-hash` stops /#contact and / counting as two pages.
// Custom events live in src/lib/analytics.ts and components/layout/Analytics.tsx.
//
// Privacy (20 Oct 2026): the chat panel carries `rr-block`, so replays show it as an empty box; the Pixel runs with
// autoConfig off, so it doesn't collect form fields or button text (also switch off Automatic Advanced Matching in
// Events Manager).
//
// recorder.js and the Meta Pixel stay until the owner decides on tracking vs
// the privacy page (docs/redesign/DECISIONS.md → still open, item 3). Don't
// remove them silently, and don't launch with them unless the privacy copy matches.
const UMAMI_HOST = "https://analytics.redelevators.com";
const UMAMI_WEBSITE_ID = "3b71a98c-fd86-4349-909c-3f4b26674a50";
const UMAMI_DOMAINS = "redelevators.com,www.redelevators.com";
const META_PIXEL_ID = "28272052369116581";

// Schibsted Grotesk (headings) + Hanken Grotesk (body) + JetBrains Mono (labels), variable
// weights, self-hosted by next/font. base.css maps them to --display / --sans / --mono.
const display = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.defaultTitle, template: SITE.titleTemplate },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: SITE_KEYWORDS,
  category: "business",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.defaultTitle,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b14",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="aurora" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Organization + WebSite structured data (src/lib/seo.ts). */}
        <JsonLd data={[organizationLd, websiteLd]} />
        {/* Without JS nothing reveals: show everything. */}
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}`}</style>
          {/* eslint-disable-next-line @next/next/no-img-element -- Meta Pixel no-JS fallback */}
          <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
        </noscript>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <CurrencyProvider>
          <Nav />
          {children}
          <Footer />
          {/* The website assistant: renders nothing unless NEXT_PUBLIC_ASSISTANT_URL is set at build time. */}
          <AssistantRoot />
        </CurrencyProvider>
        <SiteEffects />
        <Analytics />
        <Script
          src={`${UMAMI_HOST}/stats.js`}
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={UMAMI_DOMAINS}
          data-performance="true"
          data-exclude-hash="true"
          strategy="afterInteractive"
        />
        <Script src={`${UMAMI_HOST}/recorder.js`} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('set', 'autoConfig', false, '${META_PIXEL_ID}');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}
