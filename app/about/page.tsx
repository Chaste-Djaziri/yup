import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { siteData } from "@/content/siteData";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="About Youth Uplift Initiative" subtitle={siteData.organization.vision} image="/yup-assets/about-header.jpg" />
      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8"><article className="bg-card p-8"><h2 className="font-heading text-3xl">Our Mission</h2><p className="mt-4 text-foreground/80">{siteData.organization.mission}</p></article><article className="bg-card p-8"><h2 className="font-heading text-3xl">Our Vision</h2><p className="mt-4 text-foreground/80">{siteData.organization.vision}</p></article></div></section>
      <section className="section-beige py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="text-center font-heading text-4xl text-primary">What Guides Us</h2><div className="mt-8 grid gap-6 md:grid-cols-3">{siteData.values.map((value) => (<article key={value.title} className="bg-background p-6"><h3 className="font-heading text-2xl">{value.title}</h3><p className="mt-3 text-foreground/80">{value.description}</p></article>))}</div></div></section>
      <section className="bg-background py-16"><div className="container mx-auto px-4 lg:px-8"><div className="mx-auto max-w-4xl bg-card p-8"><h2 className="font-heading text-4xl">Our Journey</h2><p className="mt-4 text-foreground/80">Youth Uplift Initiative was created to bridge gaps in mentorship, practical education, and community support. We started with local youth gatherings and have continued expanding programs that build confidence, skills, and opportunity.</p></div></div></section>
      <section className="section-beige py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="text-center font-heading text-4xl text-primary">Team</h2><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{siteData.teamMembers.map((member) => (<article key={member.name} className="bg-background p-6 text-center"><img src={member.image} alt={member.name} className="mx-auto h-16 w-16 rounded-full object-cover" /><h3 className="mt-4 font-heading text-2xl">{member.name}</h3><p className="mt-2 text-sm text-foreground/70">{member.role}</p></article>))}</div><div className="mt-10 text-center"><Link href="/volunteer" className="bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Join Our Mission</Link></div></div></section>
      <Footer />
    </div>
  );
}
