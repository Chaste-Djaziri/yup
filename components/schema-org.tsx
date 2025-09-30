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
          url: "https://yupinitiative.com",
          logo: "https://yupinitiative.com/assets/logo.png",
          sameAs: [
            "https://facebook.com/yupinitiative",
            "https://twitter.com/yupinitiative",
            "https://instagram.com/yupinitiative",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+250-788-749-709",
            contactType: "customer service",
            email: "contact.yupinitiative@gmail.com",
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
