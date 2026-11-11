import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Marcellus } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { officialSite, seo } from "@/data/site-content";
import "./globals.css";

const display = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-family",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(officialSite),
  title: {
    default: seo.home.title,
    template: "%s | Red Sea International",
  },
  description: seo.home.description,
  applicationName: "Red Sea International",
  openGraph: {
    type: "website",
    siteName: "Red Sea International",
    title: seo.home.title,
    description: seo.home.description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: seo.home.title,
    description: seo.home.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#161616",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-body text-charcoal">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
