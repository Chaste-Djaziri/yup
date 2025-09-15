// path: /app/layout.tsx
import type React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import type { Metadata } from "next";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PageTransition } from "@/components/page-transition";
import { SchemaOrg } from "@/components/schema-org";

export const metadata: Metadata = {
  title: {
    default: "Youth Uplift Initiative | Empowering Youth in Rwanda",
    template: "%s | Youth Uplift Initiative",
  },
  description:
    "Youth Uplift Initiative (YUP) is a charity-based community for helping those in need, based in Rwanda.",
  keywords: [
    "charity",
    "Rwanda",
    "youth empowerment",
    "education",
    "community development",
    "nonprofit",
    "volunteer",
    "donate",
    "aide humanitaire",
    "jeunesse",
    "éducation",
    "développement communautaire",
    "ONG",
    "bénévolat",
    "don",
    "entraide",
    "ubufasha",
    "urubyiruko",
    "kwigisha",
    "iterambere ry'umuryango",
    "gukorera bushake",
    "gutanga inkunga",
    "gufasha abandi",
    "assistance",
    "solidarité",
    "humanitarian aid",
    "development",
    "support",
    "impact social",
    "caring",
    "hope",
    "impuhwe",
    "ubwuzuzanye",
    "gushyigikira",
    "intego",
    "indashyikirwa",
  ],
  authors: [{ name: "Youth Uplift Initiative" }],
  creator: "Youth Uplift Initiative",
  publisher: "Youth Uplift Initiative",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://youthuplift.org"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
      rw: "/rw",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yupinitiative.com/",
    title: "Youth Uplift Initiative | Empowering Youth in Rwanda",
    description:
      "Youth Uplift Initiative (YUP) is a charity-based community for helping those in need, based in Rwanda.",
    siteName: "Youth Uplift Initiative",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-removebg-preview-JsE7Yc5tF2CGPGmcZ3pNodvDgCSIMH.png",
        width: 1200,
        height: 630,
        alt: "Youth Uplift Initiative Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Uplift Initiative | Empowering Youth in Rwanda",
    description:
      "Youth Uplift Initiative (YUP) is a charity-based community for helping those in need, based in Rwanda.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-removebg-preview-JsE7Yc5tF2CGPGmcZ3pNodvDgCSIMH.png",
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "v3pNA_S_M2JBWaKjHfRTJFp_FLXl_x9lVjE4Kz2oYRM",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        {/* Performance hints for third-party origins */}
        <link rel="preconnect" href="https://www.paypal.com" />
        <link rel="preconnect" href="https://www.paypalobjects.com" />
        <link rel="dns-prefetch" href="https://www.paypal.com" />
        <link rel="dns-prefetch" href="https://www.paypalobjects.com" />
        <meta
          name="google-site-verification"
          content="v3pNA_S_M2JBWaKjHfRTJFp_FLXl_x9lVjE4Kz2oYRM"
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7327796904513190"
          crossOrigin="anonymous"
        />

        <SchemaOrg />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <ScrollToTop />
              <Navbar />
              <div className="flex-1">
                <PageTransition>{children}</PageTransition>
              </div>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
