import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
