import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import BackToTop from "@/components/BackToTop";
import NavigationLoader from "@/components/NavigationLoader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Vanguard Freight | Global Freight & Package Tracking",
    template: "%s | Vanguard Freight"
  },
  description: "Global logistics, express air transit, ocean freight, and real-time package tracking. Fast, secure delivery with Vanguard Freight.",
  keywords: ["package tracking", "vanguardfreight shipping", "vanguardfreight", "shipping company", "express delivery", "global freight", "cargo tracking"],
  authors: [{ name: "Vanguard Freight Team" }],
  creator: "Vanguard Freight",
  publisher: "Vanguard Freight & Cargo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vanguardfreight.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vanguard Freight | Global Freight & Package Tracking",
    description: "Global logistics, express air transit, ocean freight, and real-time package tracking. Fast, secure delivery with Vanguard Freight.",
    url: "https://vanguardfreight.com",
    siteName: "Vanguard Freight & Cargo",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Vanguard Freight & Cargo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanguard Freight | Global Freight & Package Tracking",
    description: "Global logistics, express air transit, ocean freight, and real-time package tracking with Vanguard Freight.",
    images: ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LogisticsService",
  "name": "Vanguard Freight & Cargo",
  "url": "https://vanguardfreight.com",
  "logo": "https://vanguardfreight.com/favicon.ico",
  "description": "Global freight forwarding, air transit, and real-time package tracking portal.",
  "email": "support@vanguardfreight.com",
  "sameAs": [
    "https://vanguardfreight.com"
  ],
  "areaServed": "Worldwide"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground shrink-0">
        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
          <NavigationLoader />
          <Header />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
