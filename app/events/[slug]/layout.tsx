import type { Metadata } from "next";
import { SEO_DEFAULT_IMAGE, SEO_SITE_NAME, SEO_TWITTER, absoluteUrl, seoByRoute } from "@/seo/meta";
import { resolvePublishedEventBySlug } from "@/lib/events-server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolvePublishedEventBySlug(slug);

  if (!resolved.event) {
    return buildMetadata(seoByRoute.events);
  }

  const event = resolved.event;
  const canonicalPath = `/events/${event.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const image = event.image_url || SEO_DEFAULT_IMAGE;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const startIso = event.event_start ? new Date(event.event_start).toISOString() : undefined;
  const endIso = event.event_end ? new Date(event.event_end).toISOString() : undefined;
  const description =
    event.summary ||
    event.description ||
    `${event.title}${event.location ? ` at ${event.location}` : ""}. ${seoByRoute.events.description}`;

  return {
    title: `${event.title} | Youth Uplift Initiative`,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: `${event.title} | Youth Uplift Initiative`,
      description,
      url: canonicalUrl,
      siteName: SEO_SITE_NAME,
      images: [{ url: imageUrl, alt: event.title }],
      publishedTime: startIso,
      modifiedTime: event.updated_at ? new Date(event.updated_at).toISOString() : undefined,
      authors: ["Youth Uplift Initiative"],
      tags: [event.location || "Rwanda", "Youth Uplift Initiative", "Events"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | Youth Uplift Initiative`,
      description,
      images: [imageUrl],
      site: SEO_TWITTER,
    },
    other: {
      "event:start_time": startIso || "",
      "event:end_time": endIso || "",
      "event:location": event.location || "",
    },
  };
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
