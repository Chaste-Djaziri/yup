export function SchemaOrg() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          name: "Youth Uplift Initiative",
          alternateName: "YUP",
          url: "https://youthuplift.org",
          logo: "https://youthuplift.org/logo.png",
          sameAs: [
            "https://facebook.com/youthuplift",
            "https://twitter.com/youthuplift",
            "https://instagram.com/youthuplift",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+250-123-456-789",
            contactType: "customer service",
            email: "info@youthuplift.org",
            areaServed: "Rwanda",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kigali",
            addressRegion: "Kigali",
            addressCountry: "Rwanda",
          },
          description:
            "Youth Uplift Initiative (YUP) is a charity-based community for helping those in need, based in Rwanda.",
        }),
      }}
    />
  )
}

