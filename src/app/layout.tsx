import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-N3H7PRZ203";
const META_PIXEL_ID = "28272052369116581";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

// NOINDEX is a build-time-only var (see Dockerfile) — every route here is
// static/SSG, so this resolves once per image build, not per request. Unset
// on production; the dev/staging deploy workflow passes it in so
// dev.redelevators.com never gets crawled or indexed while it's an internal
// preview. See also src/app/robots.ts, which reads the same var.
const noindex = process.env.NOINDEX === "true";

export const metadata: Metadata = {
  metadataBase: new URL("https://redelevators.com"),
  title: "Red Elevators — Growth on Autopilot",
  description:
    "Red Elevators is a marketing & automation agency. We build AI systems and marketing engines that turn repetitive work into compounding growth.",
  openGraph: {
    title: "Red Elevators — Growth on Autopilot",
    description:
      "Marketing & automation systems that run without you. Growth on autopilot.",
    type: "website",
  },
  icons: {
    icon: "/brand/red-elevators-mark-light.svg",
  },
  ...(noindex && {
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        {!noindex && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        {children}
      </body>
      {!noindex && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
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
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}
    </html>
  );
}
