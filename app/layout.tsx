import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import { WebVitals } from "@/components/WebVitals";
import { Analytics } from "@vercel/analytics/react"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves FCP (First Contentful Paint)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Scam Protector",
    default: "Scam Protector - Detect and Avoid Online Scams",
  },
  description:
    "Advanced technology to protect you from online scams, phishing attacks, and fraudulent websites in real-time.",
  keywords: [
    "scam detector",
    "online protection",
    "phishing detection",
    "website security check",
    "scam prevention",
    "fraud detection",
  ],
  authors: [{ name: "Scam Protector Team" }],
  creator: "Scam Protector",
  publisher: "Scam Protector",
  formatDetection: {
    telephone: false,
  },
  category: "Security",
  metadataBase: new URL("https://scam-protector.com"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Scam Protector - Detect and Avoid Online Scams",
    description:
      "Advanced technology to protect you from online scams, phishing attacks, and fraudulent websites in real-time.",
    url: "https://scam-protector.com",
    siteName: "Scam Protector",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Scam Protector - Online Scam Detection Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scam Protector - Detect and Avoid Online Scams",
    description:
      "Advanced technology to protect you from online scams and phishing attacks in real-time.",
    images: ["/twitter-image.png"], // You'll need to create this image
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
  verification: {
    // Add verification tokens for search consoles when you have them
    google: "google-site-verification-token",
    // yandex: "yandex-verification-token",
    // bing: "bing-verification-token",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
      {
        rel: "manifest",
        url: "/manifest.json",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Additional SEO link tags */}
        <link rel="robots" href="/robots.txt" />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/feed.xml"
          title="Scam Protector Blog"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          {/* Web Vitals tracking */}
          <WebVitals />

          <Header />
          <main className="container mx-auto px-4">{children}</main>
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
