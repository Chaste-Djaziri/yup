"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import NewsletterSignup from "@/components/NewsletterSignup";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import type { DbEvent } from "@/types/backend";

const formatEventDate = (event: DbEvent) => {
  const date = new Date(event.event_start);
  if (Number.isNaN(date.getTime())) return "Date TBD";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const formatEventTime = (event: DbEvent) => {
  const date = new Date(event.event_start);
  if (Number.isNaN(date.getTime())) return "Time TBD";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function EventsPage() {
  const { data: events = [], isLoading } = usePublicEvents();
  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.event_start) >= now);
  const pastEvents = events.filter((event) => new Date(event.event_start) < now);
  const featuredEvent = upcomingEvents[0] || events[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Events & Activities" subtitle="Join our events to support youth empowerment and connect with the YUP community." image="/yup-assets/event-header.jpg" />
      <section className="bg-background py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="font-heading text-4xl text-primary">Upcoming Events</h2><div className="mt-6 grid gap-6 md:grid-cols-2">{isLoading && <p className="text-sm text-foreground/70">Loading events...</p>}{!isLoading && upcomingEvents.length === 0 && <p className="text-sm text-foreground/70">No upcoming events right now.</p>}{upcomingEvents.map((event) => (<article key={event.slug} className="overflow-hidden bg-card"><img src={event.image_url || "/yup-assets/event.jpg"} alt={event.title} className="h-44 w-full object-cover" /><div className="p-6"><h3 className="font-heading text-2xl">{event.title}</h3><p className="mt-2 text-sm text-foreground/80">{event.summary || "No summary available."}</p><p className="mt-3 text-xs uppercase tracking-wider text-primary">{formatEventDate(event)} | {formatEventTime(event)}</p><p className="text-sm text-foreground/70">{event.location || "Location TBD"}</p><Link href={`/events/${event.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Learn More</Link>{event.registration_url && (<a href={event.registration_url} target="_blank" rel="noreferrer" className="ml-4 mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Register</a>)}</div></article>))}</div></div></section>
      <section className="section-beige py-16"><div className="container mx-auto px-4 lg:px-8"><h2 className="font-heading text-4xl text-primary">Past Events</h2><div className="mt-6 grid gap-6 md:grid-cols-2">{!isLoading && pastEvents.length === 0 && <p className="text-sm text-foreground/70">No past events yet.</p>}{pastEvents.map((event) => (<article key={event.slug} className="bg-background p-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">Past Event</p><h3 className="mt-2 font-heading text-2xl">{event.title}</h3><p className="mt-2 text-foreground/80">{event.summary || "No summary available."}</p><p className="mt-2 text-sm text-foreground/70">{formatEventDate(event)}</p><Link href={`/events/${event.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">View Details</Link></article>))}</div></div></section>
      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8"><article className="bg-card p-8"><h3 className="font-heading text-3xl">Host an Event</h3><p className="mt-4 text-foreground/80">Interested in hosting an event for Youth Uplift Initiative? We support community-led fundraising and awareness events.</p><ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/80"><li>Engage your school, workplace, or local network</li><li>Raise awareness about youth opportunities in Rwanda</li><li>Co-design a meaningful community impact experience</li></ul><Link href="/contact" className="mt-6 inline-block bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Contact Us to Get Started</Link></article><article className="bg-card p-8"><h3 className="font-heading text-3xl">Featured Event</h3>{featuredEvent ? (<><p className="mt-4 text-foreground/80">{featuredEvent.title}</p><p className="mt-2 text-sm text-foreground/70">{formatEventDate(featuredEvent)} | {formatEventTime(featuredEvent)}</p><p className="mt-2 text-sm text-foreground/70">{featuredEvent.location || "Location TBD"}</p><Link href={`/events/${featuredEvent.slug}`} className="mt-6 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Learn More</Link></>) : (<p className="mt-4 text-sm text-foreground/70">No featured event available yet.</p>)}</article></div></section>
      <NewsletterSignup title="Stay updated on upcoming YUP events" className="section-beige py-16" />
      <Footer />
    </div>
  );
}
