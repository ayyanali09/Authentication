import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Professional Development Agency`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  keywords: [
    "development agency",
    "website development",
    "mobile app development",
    "ui ux design",
    "custom software",
    "business automation",
    "digital problem solving"
  ],
  openGraph: {
    title: `${site.name} | Professional Development Agency`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: "/images/hero-command-center.png",
        width: 1600,
        height: 900,
        alt: "DURON development agency workspace"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/hero-command-center.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
