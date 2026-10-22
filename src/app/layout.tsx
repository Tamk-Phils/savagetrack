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
    default: "Transworld Logistics | Global Freight & Package Tracking",
    template: "%s | Transworld Logistics"
  },
  description: "Global logistics, express air transit, ocean freight, and real-time package tracking. Fast, secure delivery with Transworld Logistics.",
  keywords: ["package tracking", "transworldlogistics shipping", "transworldlogistics", "shipping company", "express delivery", "global freight", "cargo tracking"],
  authors: [{ name: "Transworld Logistics Team" }],
  creator: "Transworld Logistics",
  publisher: "Transworld Logistics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://transworldlogististics.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Transworld Logistics | Global Freight & Package Tracking",
    description: "Global logistics, express air transit, ocean freight, and real-time package tracking. Fast, secure delivery with Transworld Logistics.",
    url: "https://transworldlogististics.org",
    siteName: "Transworld Logistics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Transworld Logistics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transworld Logistics | Global Freight & Package Tracking",
    description: "Global logistics, express air transit, ocean freight, and real-time package tracking with Transworld Logistics.",
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
  "name": "Transworld Logistics",
  "url": "https://transworldlogististics.org",
  "logo": "https://transworldlogististics.org/favicon.ico",
  "description": "Global freight forwarding, air transit, and real-time package tracking portal.",
  "email": "supportdesk@transworldlogististics.org",
  "sameAs": [
    "https://transworldlogististics.org"
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
