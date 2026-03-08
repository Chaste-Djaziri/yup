"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { usePublicEventBySlug } from "@/hooks/usePublicEvents";

const formatEventDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBD";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const formatEventTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBD";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data: event, isLoading } = usePublicEventBySlug(params.slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-4 py-16 lg:px-8"><p className="text-sm text-foreground/70">Loading event details...</p></section>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-4 py-16 lg:px-8">
          <p className="text-sm text-foreground/70">Event not found.</p>
          <Link href="/events" className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            Back to Events
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative flex min-h-[340px] items-end"><img src={event.image_url || "/yup-assets/event-header.jpg"} alt={event.title} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/45 to-transparent" /><div className="container relative z-10 mx-auto px-4 pb-12 pt-24 lg:px-8"><p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">{event.status}</p><h1 className="mt-2 font-heading text-5xl text-primary-foreground">{event.title}</h1></div></section>
      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[2fr,1fr] lg:px-8"><article className="bg-card p-8"><h2 className="font-heading text-3xl">Event Overview</h2><p className="mt-4 text-foreground/80">{event.description || "No additional event description has been provided yet."}</p></article><aside className="bg-card p-8"><h3 className="font-heading text-2xl">Event Info</h3><p className="mt-4 text-sm text-foreground/80">Date: {formatEventDate(event.event_start)}</p><p className="mt-2 text-sm text-foreground/80">Time: {formatEventTime(event.event_start)}</p><p className="mt-2 text-sm text-foreground/80">Location: {event.location || "Location TBD"}</p><div className="mt-5 space-y-3">{event.registration_url ? (<a href={event.registration_url} target="_blank" rel="noreferrer" className="block bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">Register for Event</a>) : (<Link href="/contact" className="block bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">Contact Us</Link>)}<Link href="/events" className="block border border-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary">Back to Events</Link></div></aside></div></section>
      <Footer />
    </div>
  );
}
