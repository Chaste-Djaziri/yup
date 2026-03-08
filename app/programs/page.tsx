import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { siteData } from "@/content/siteData";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export const metadata: Metadata = buildMetadata(seoByRoute.programs);

export default function ProgramsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Our Programs" subtitle="Discover the initiatives we use to empower youth and strengthen communities in Rwanda." image="/yup-assets/programs-header.jpg" />
      <section className="bg-background py-16"><div className="container mx-auto px-4 lg:px-8"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{siteData.programs.map((program) => (<article key={program.slug} className="overflow-hidden bg-card"><img src={program.image} alt={program.title} className="h-52 w-full object-cover" /><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">{program.category}</p><h2 className="mt-2 font-heading text-2xl">{program.title}</h2><p className="mt-3 text-sm text-foreground/80">{program.summary}</p><Link href={`/programs/${program.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Learn More</Link></div></article>))}</div></div></section>
      <section className="section-beige py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8"><article className="bg-background p-8"><h3 className="font-heading text-3xl">Our Approach</h3><p className="mt-4 text-foreground/80">We use community-driven, youth-centered, and sustainable methods that respond to local realities and build long-term outcomes.</p><ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/80"><li>Community involvement and local ownership</li><li>Holistic support across education, leadership, and life skills</li><li>Partnerships that strengthen delivery and impact</li></ul></article><article className="bg-background p-8"><h3 className="font-heading text-3xl">Program Outcomes</h3><div className="mt-4 grid grid-cols-2 gap-4">{siteData.impactStats.map((stat) => (<div key={stat.label} className="border border-border p-4"><p className="font-heading text-3xl text-primary">{stat.value}</p><p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{stat.label}</p></div>))}</div></article></div></section>
      <section className="bg-background py-16"><div className="container mx-auto px-4 text-center lg:px-8"><h3 className="font-heading text-3xl">SDG Alignment</h3><div className="mt-6 flex flex-wrap justify-center gap-3">{siteData.sdgAlignment.map((item) => (<span key={item} className="bg-card px-4 py-2 text-sm">{item}</span>))}</div><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/donate" className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Donate</Link><Link href="/volunteer" className="border border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary">Volunteer</Link></div></div></section>
      <Footer />
    </div>
  );
}
