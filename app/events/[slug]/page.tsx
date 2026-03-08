import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { resolvePublishedEventBySlug } from "@/lib/events-server";

const formatEventDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBD";
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Kigali",
  }).format(date);
};

const formatEventTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBD";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Kigali",
  }).format(date);
};

const formatEventTimeRange = (start: string, end: string | null) => {
  const startTime = formatEventTime(start);
  if (!end) return `${startTime} CAT`;
  const endTime = formatEventTime(end);
  if (endTime === "Time TBD") return `${startTime} CAT`;
  return `${startTime} - ${endTime} CAT`;
};

const parseRwfPrice = (...values: Array<string | null | undefined>) => {
  const source = values.filter(Boolean).join(" ");
  const match = source.match(/(\d[\d.,]*)\s*RWF/i);
  if (!match?.[1]) return null;
  return match[1].replace(/[,\s]/g, "");
};

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

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolvePublishedEventBySlug(slug);

  if (!resolved.event || !resolved.canonicalSlug) {
    notFound();
  }

  if (resolved.matchedAlias && resolved.canonicalSlug !== slug) {
    redirect(`/events/${resolved.canonicalSlug}`);
  }

  const event = resolved.event;
  const eventLocation = event.location || "Rwanda";
  const parsedPrice = parseRwfPrice(event.summary, event.description);
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary || event.description || "Youth Uplift Initiative event",
    startDate: event.event_start,
    endDate: event.event_end || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.location,
            addressCountry: "RW",
            addressRegion: "Kigali",
          },
        }
      : {
          "@type": "Place",
          name: "Rwanda",
          address: {
            "@type": "PostalAddress",
            addressCountry: "RW",
          },
        },
    image: event.image_url ? [event.image_url] : undefined,
    performer: {
      "@type": "Organization",
      name: "Youth Uplift Initiative",
      url: "https://yupinitiative.com",
    },
    offers: {
      "@type": "Offer",
      url: event.registration_url || `https://yupinitiative.com/events/${event.slug}`,
      availability: "https://schema.org/InStock",
      priceCurrency: "RWF",
      price: parsedPrice || "0",
      validFrom: event.created_at,
    },
    organizer: {
      "@type": "Organization",
      name: "Youth Uplift Initiative",
      url: "https://yupinitiative.com",
    },
    url: `https://yupinitiative.com/events/${event.slug}`,
    keywords: [eventLocation, "YUP", "Youth Uplift Initiative", "Rwanda"],
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <Navbar />

      <section className="relative flex min-h-[340px] items-end bg-black pt-20">
        <div className="container relative z-10 mx-auto px-4 pb-12 pt-24 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">{event.status}</p>
          <h1 className="mt-2 font-heading text-5xl text-primary-foreground">{event.title}</h1>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[2fr,1fr] lg:px-8">
          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">Event Overview</h2>
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="mt-4 h-auto max-w-full"
              />
            ) : null}
            {event.description ? renderFormattedText(event.description) : <p className="mt-4 text-foreground/80">No additional event description has been provided yet.</p>}
          </article>

          <aside className="bg-card p-8">
            <h3 className="font-heading text-2xl">Event Info</h3>
            <p className="mt-4 text-sm text-foreground/80">Date: {formatEventDate(event.event_start)}</p>
            <p className="mt-2 text-sm text-foreground/80">Time: {formatEventTimeRange(event.event_start, event.event_end)}</p>
            <p className="mt-2 text-sm text-foreground/80">Location: {event.location || "Location TBD"}</p>
            <div className="mt-5 space-y-3">
              {event.registration_url ? (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground"
                >
                  Register for Event
                </a>
              ) : (
                <Link href="/contact" className="block bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Contact Us
                </Link>
              )}
              <Link href="/events" className="block border border-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary">
                Back to Events
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
