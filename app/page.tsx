import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { siteData } from "@/content/siteData";
import type { DbEvent, DbProgram } from "@/types/backend";
import { buildMetadata, seoByRoute } from "@/seo/meta";
import { getPublishedEvents } from "@/lib/events-server";
import { getPublishedPrograms } from "@/lib/programs-server";

export const metadata = buildMetadata(seoByRoute.home);

export const revalidate = 300;

const formatEventDate = (event: DbEvent) => {
  const date = new Date(event.event_start);
  if (Number.isNaN(date.getTime())) return "Date TBD";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const programImage = (program: DbProgram) => program.cover_image_url || "/yup-assets/programs-header.jpg";

export default async function HomePage() {
  const now = new Date();
  const publishedEvents = await getPublishedEvents();
  const publishedPrograms = await getPublishedPrograms();
  const upcomingEvents = publishedEvents
    .filter((event) => new Date(event.event_start) >= now)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <img src="/yup-assets/about-header.jpg" alt="Youth community gathering" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="container relative z-10 mx-auto px-4 py-32 lg:px-8">
          <h1 className="max-w-3xl font-heading text-5xl leading-[1.1] text-primary-foreground md:text-7xl">Youth Uplift Initiative</h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/90">{siteData.organization.mission}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/programs" className="bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Explore Programs</Link>
            <Link href="/volunteer" className="border border-primary-foreground/40 px-7 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Become a Volunteer</Link>
          </div>
        </div>
      </section>

      <section className="bg-background py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="text-center font-heading text-4xl text-primary">Our Core Values</h2><div className="mt-8 grid gap-6 md:grid-cols-3">{siteData.values.map((value) => (<article key={value.title} className="bg-card p-6"><h3 className="font-heading text-2xl">{value.title}</h3><p className="mt-3 text-foreground/80">{value.description}</p></article>))}</div></div></section>

      <section className="section-beige py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="text-center font-heading text-4xl text-primary">Our Programs</h2><div className="mt-8 grid gap-6 md:grid-cols-3">{publishedPrograms.map((program) => (<article key={program.slug} className="overflow-hidden bg-background"><img src={programImage(program)} alt={program.title} className="h-48 w-full object-cover" /><div className="p-5"><h3 className="font-heading text-2xl">{program.title}</h3><p className="mt-2 text-sm text-foreground/80">{program.summary || "No summary available."}</p><Link href={`/programs/${program.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Learn More</Link></div></article>))}{publishedPrograms.length === 0 && <p className="text-sm text-foreground/70">Programs will appear here once they are published.</p>}</div></div></section>

      <section className="bg-background py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="text-center font-heading text-4xl text-primary">Upcoming Events</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{upcomingEvents.length === 0 && <p className="text-sm text-foreground/70">No upcoming events right now.</p>}{upcomingEvents.map((event) => (<article key={event.slug} className="bg-card p-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">{formatEventDate(event)}</p><h3 className="mt-2 font-heading text-2xl">{event.title}</h3><p className="mt-2 text-foreground/80">{event.summary || "No summary available."}</p><p className="mt-2 text-sm text-foreground/60">{event.location || "Location TBD"}</p><Link href={`/events/${event.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Event Details</Link></article>))}</div><div className="mt-8 text-center"><Link href="/events" className="bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">View All Events</Link></div></div></section>

      <section className="section-beige py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="text-center font-heading text-4xl text-primary">Impact Snapshot</h2><div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{siteData.impactStats.map((stat) => (<div key={stat.label} className="bg-background p-6 text-center"><p className="font-heading text-4xl text-primary">{stat.value}</p><p className="mt-2 text-sm uppercase tracking-wider text-foreground/70">{stat.label}</p></div>))}</div></div></section>

      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8"><article className="bg-card p-8"><h3 className="font-heading text-3xl">Stories & Voices</h3><p className="mt-4 text-foreground/80">New story highlights and testimonials will appear here as youth and volunteers share their experience.</p></article><article className="bg-card p-8"><h3 className="font-heading text-3xl">Get Involved</h3><p className="mt-4 text-foreground/80">Volunteer, partner, or donate to expand opportunities for young people.</p><div className="mt-6 flex gap-3"><Link href="/volunteer" className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Volunteer</Link><Link href="/donate" className="border border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary">Donate</Link></div></article></div></section>

      <NewsletterSignup />
      <Footer />
    </div>
  );
}
