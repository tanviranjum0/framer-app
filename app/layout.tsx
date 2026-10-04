import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { MotionProvider } from "@/components/providers/motion-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

/* Self-hosted at build time by next/font — no render-blocking request to
   fonts.googleapis.com, and no layout shift from a late swap. The previous
   build pulled four families in via @import inside a CSS file, which blocks
   first paint. */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const SITE = {
  name: "Motion Lab",
  title: "Motion Lab — production-ready animation patterns for React",
  description:
    "Twelve scroll-driven, drag-physics and spring-based interaction patterns built with Motion for React and Next.js. Every effect is compositor-only, adapts to touch, and respects reduced-motion.",
  url: "https://motion-lab.vercel.app",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Tanvir Anjum" }],
  creator: "Tanvir Anjum",
  keywords: [
    "Motion for React",
    "Framer Motion",
    "Next.js animation",
    "scroll-driven animation",
    "drag physics",
    "spring animation",
    "React interaction design",
  ],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04090a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Left zoomable on purpose: locking scale is an accessibility failure.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ink text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-mint focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ToastProvider>{children}</ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
