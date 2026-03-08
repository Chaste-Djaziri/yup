import type { Metadata } from "next";
import "./globals.css";
import { siteData } from "@/content/siteData";
import { SEO_BASE_URL, SEO_SITE_NAME, SEO_TWITTER, absoluteUrl, seoByRoute } from "@/seo/meta";
import LenisProvider from "@/components/LenisProvider";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: siteData.organization.name,
  alternateName: siteData.organization.shortName,
  url: SEO_BASE_URL,
  logo: absoluteUrl("/yup-assets/about-header.jpg"),
  sameAs: [
    "https://facebook.com/yupinitiative",
    "https://instagram.com/yupinitiative",
    "https://linkedin.com/company/yupinitiative",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+250-788-749-709",
    contactType: "customer support",
    email: siteData.organization.email,
    areaServed: "Rwanda",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kigali",
    addressCountry: "Rwanda",
  },
  description:
    "Youth Uplift Initiative empowers youth in Rwanda through education, leadership, and community-based development.",
};

export const metadata: Metadata = {
  metadataBase: new URL(SEO_BASE_URL),
  title: {
    default: seoByRoute.home.title,
    template: "%s",
  },
  description: seoByRoute.home.description,
  openGraph: {
    siteName: SEO_SITE_NAME,
    type: "website",
    images: [{ url: absoluteUrl("/yup-assets/about-header.jpg"), alt: SEO_SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: SEO_TWITTER,
    images: [absoluteUrl("/yup-assets/about-header.jpg")],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
