import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { faqSections } from "@/content/faqData";
import { SEO_SITE_NAME, absoluteUrl } from "@/seo/meta";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  ),
  publisher: {
    "@type": "Organization",
    name: SEO_SITE_NAME,
    url: absoluteUrl("/"),
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Choose a section below to view detailed Q&A in collapsible format."
        image="/yup-assets/about-header.jpg"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faqSections.map((section) => (
              <article key={section.slug} className="bg-card p-6">
                <h2 className="font-heading text-2xl text-primary">{section.title}</h2>
                <p className="mt-2 text-sm text-foreground/80">{section.description}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-foreground/60">{section.items.length} questions</p>
                <Link
                  href={`/faq/${section.slug}`}
                  className="mt-5 inline-block bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
                >
                  Open Section
                </Link>
              </article>
            ))}
          </div>

          <article className="mt-10 bg-card p-8 text-center">
            <h2 className="font-heading text-3xl">Still Need Help?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-foreground/80">
              If your question is not listed, use the contact form or email us directly and we will assist you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                Contact Us
              </Link>
              <a
                href="mailto:contact.yupinitiative@gmail.com"
                className="border border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary"
              >
                Email Support
              </a>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
