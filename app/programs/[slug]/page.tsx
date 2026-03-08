import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { buildMetadata, seoByRoute } from "@/seo/meta";
import { getPublishedProgramBySlug } from "@/lib/programs-server";

export const revalidate = 300;

const renderFormattedText = (value: string) => {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, paragraphIndex) => {
    const lines = paragraph.split("\n");
    return (
      <p key={`p-${paragraphIndex}`} className="mt-4 text-foreground/80">
        {lines.map((line, lineIndex) => {
          const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
          return (
            <span key={`l-${paragraphIndex}-${lineIndex}`}>
              {parts.map((part, partIndex) => {
                const isBold = part.startsWith("**") && part.endsWith("**");
                const content = isBold ? part.slice(2, -2) : part;
                return isBold ? <strong key={`b-${partIndex}`}>{content}</strong> : <span key={`t-${partIndex}`}>{content}</span>;
              })}
              {lineIndex < lines.length - 1 ? <br /> : null}
            </span>
          );
        })}
      </p>
    );
  });
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = await getPublishedProgramBySlug(slug);
  if (!program) {
    return buildMetadata(seoByRoute.programs);
  }

  return buildMetadata(
    {
      title: `${program.title} | Youth Uplift Initiative`,
      description: program.summary || seoByRoute.programs.description,
      path: `/programs/${program.slug}`,
      image: program.cover_image_url || undefined,
    },
    "article",
  );
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getPublishedProgramBySlug(slug);
  if (!program) return notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <section
        className="relative flex min-h-[340px] items-end bg-black bg-cover bg-center pt-20"
        style={program.cover_image_url ? { backgroundImage: `url(${program.cover_image_url})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="container relative z-10 mx-auto px-4 pb-12 pt-24 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">{program.category}</p>
          <h1 className="mt-2 font-heading text-5xl text-primary-foreground">{program.title}</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/90">{program.summary || "No summary available."}</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[2fr,1fr] lg:px-8">
          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">Program Overview</h2>
            {program.cover_image_url ? <img src={program.cover_image_url} alt={program.title} className="mt-4 h-auto max-w-full" /> : null}
            {program.description ? renderFormattedText(program.description) : <p className="mt-4 text-foreground/80">No description available yet.</p>}
            <h3 className="mt-8 font-heading text-2xl">Outcomes</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/80">
              {program.outcomes.length > 0 ? program.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>) : <li>Outcomes will be shared soon.</li>}
            </ul>
          </article>
          <aside className="bg-card p-8">
            <h3 className="font-heading text-2xl">Program Info</h3>
            <p className="mt-4 text-sm text-foreground/80">Category: {program.category}</p>
            <p className="mt-2 text-sm text-foreground/80">Status: {program.status}</p>
            <div className="mt-5 space-y-3">
              <Link href="/volunteer" className="block bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">
                Volunteer
              </Link>
              <Link href="/donate" className="block border border-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary">
                {program.cta_label || "Support This Program"}
              </Link>
              <Link href="/programs" className="block border border-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary">
                Back to Programs
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
