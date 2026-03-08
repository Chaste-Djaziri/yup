import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { siteData } from "@/content/siteData";

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = siteData.programs.find((item) => item.slug === params.slug);
  if (!program) return notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative flex min-h-[340px] items-end"><img src={program.image} alt={program.title} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/45 to-transparent" /><div className="container relative z-10 mx-auto px-4 pb-12 pt-24 lg:px-8"><p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">{program.category}</p><h1 className="mt-2 font-heading text-5xl text-primary-foreground">{program.title}</h1><p className="mt-3 max-w-2xl text-primary-foreground/90">{program.summary}</p></div></section>
      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[2fr,1fr] lg:px-8"><article className="bg-card p-8"><h2 className="font-heading text-3xl">Program Overview</h2><p className="mt-4 text-foreground/80">{program.description}</p><h3 className="mt-8 font-heading text-2xl">Outcomes</h3><ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/80">{program.outcomes.map((outcome) => (<li key={outcome}>{outcome}</li>))}</ul></article><aside className="bg-card p-8"><h3 className="font-heading text-2xl">Take Action</h3><p className="mt-3 text-foreground/80">Support this program through volunteering or donations.</p><div className="mt-5 space-y-3"><Link href="/volunteer" className="block bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">Volunteer</Link><Link href="/donate" className="block border border-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary">{program.ctaLabel}</Link></div><Link href="/programs" className="mt-6 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Back to Programs</Link></aside></div></section>
      <Footer />
    </div>
  );
}
