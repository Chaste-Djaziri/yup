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
          url: "https://youthuplift.com",
          logo: "https://youthuplift.com/assets/logo.png",
          sameAs: [
            "https://facebook.com/youthuplift",
            "https://twitter.com/youthuplift",
            "https://instagram.com/youthuplift",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+250-794-578-640",
            contactType: "customer service",
            email: "info@youthuplift.com",
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

