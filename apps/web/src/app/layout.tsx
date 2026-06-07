import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: `${site.name} | Websites, Apps & Digital Media Agency`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  keywords: [
    "DURON",
    "duron media",
    "duron.media",
    "digital media agency",
    "development agency",
    "website development",
    "mobile app development",
    "ui ux design",
    "custom software",
    "business automation",
    "digital problem solving"
  ],
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/images/duron-logo-transparent.png",
    apple: "/images/duron-logo.png"
  },
  creator: site.name,
  publisher: site.name,
  openGraph: {
    title: `${site.name} | Websites, Apps & Digital Media Agency`,
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
    title: `${site.name} | Websites, Apps & Digital Media Agency`,
    description: site.description,
    images: ["/images/hero-command-center.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/images/duron-logo-transparent.png`,
        email: site.email,
        sameAs: site.sameAs,
        description: site.description
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: {
          "@id": `${site.url}/#organization`
        }
      }
    ]
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
