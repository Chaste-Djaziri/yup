import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { faqSections, findFaqSection } from "@/content/faqData";
import { SEO_SITE_NAME, SEO_TWITTER, absoluteUrl } from "@/seo/meta";

type Params = { section: string };

export function generateStaticParams() {
  return faqSections.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { section: slug } = await params;
  const section = findFaqSection(slug);

  if (!section) {
    return {
      title: `FAQ | ${SEO_SITE_NAME}`,
      description: "Frequently asked questions for Youth Uplift Initiative.",
      alternates: { canonical: "/faq" },
    };
  }

  const title = `${section.title} FAQ | ${SEO_SITE_NAME}`;
  const description = section.description;
  const path = `/faq/${section.slug}`;
  const image = absoluteUrl("/yup-assets/about-header.jpg");
  const keywords = [
    "faq",
    "youth uplift initiative",
    "rwanda youth programs",
    section.title.toLowerCase(),
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: SEO_SITE_NAME,
      images: [{ url: image, alt: section.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: SEO_TWITTER,
    },
  };
}

export default async function FaqSectionPage({ params }: { params: Promise<Params> }) {
  const { section: slug } = await params;
  const section = findFaqSection(slug);

  if (!section) notFound();

  const sectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    publisher: {
      "@type": "Organization",
      name: SEO_SITE_NAME,
      url: absoluteUrl("/"),
    },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sectionJsonLd) }} />
      <Navbar />
      <PageHero title={section.title} subtitle={section.description} image="/yup-assets/about-header.jpg" />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href="/faq" className="border border-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary">
              Back To FAQ Sections
            </Link>
            <Link href="/contact" className="bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Ask A New Question
            </Link>
          </div>

          <article className="bg-card p-6 lg:p-8">
            <FaqAccordion items={section.items} />
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
