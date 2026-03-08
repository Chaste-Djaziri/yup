import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { faqSections, findFaqSection } from "@/content/faqData";
import { SEO_SITE_NAME, absoluteUrl } from "@/seo/meta";

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

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: SEO_SITE_NAME,
      images: [{ url: absoluteUrl("/yup-assets/about-header.jpg"), alt: section.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/yup-assets/about-header.jpg")],
    },
  };
}

export default async function FaqSectionPage({ params }: { params: Promise<Params> }) {
  const { section: slug } = await params;
  const section = findFaqSection(slug);

  if (!section) notFound();

  return (
    <div className="min-h-screen">
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
