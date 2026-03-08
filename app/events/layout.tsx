import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/events-server";
import { SEO_DEFAULT_IMAGE, SEO_SITE_NAME, SEO_TWITTER, absoluteUrl, seoByRoute } from "@/seo/meta";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Kigali",
  }).format(date);
};

export async function generateMetadata(): Promise<Metadata> {
  const events = await getPublishedEvents();
  const now = new Date();
  const upcoming = events.find((event) => new Date(event.event_start) >= now) || events[0] || null;

  if (!upcoming) {
    return {
      title: seoByRoute.events.title,
      description: seoByRoute.events.description,
      alternates: { canonical: seoByRoute.events.path },
      openGraph: {
        type: "website",
        title: seoByRoute.events.title,
        description: seoByRoute.events.description,
        url: absoluteUrl(seoByRoute.events.path),
        siteName: SEO_SITE_NAME,
        images: [{ url: SEO_DEFAULT_IMAGE, alt: SEO_SITE_NAME }],
      },
      twitter: {
        card: "summary_large_image",
        title: seoByRoute.events.title,
        description: seoByRoute.events.description,
        images: [SEO_DEFAULT_IMAGE],
        site: SEO_TWITTER,
      },
    };
  }

  const dateText = formatDate(upcoming.event_start);
  const description =
    upcoming.summary ||
    `${upcoming.title}${dateText ? ` on ${dateText}` : ""}${upcoming.location ? ` at ${upcoming.location}` : ""}. Join Youth Uplift Initiative events and activities.`;
  const image = upcoming.image_url || SEO_DEFAULT_IMAGE;

  return {
    title: seoByRoute.events.title,
    description,
    alternates: { canonical: seoByRoute.events.path },
    openGraph: {
      type: "website",
      title: seoByRoute.events.title,
      description,
      url: absoluteUrl(seoByRoute.events.path),
      siteName: SEO_SITE_NAME,
      images: [{ url: image.startsWith("http") ? image : absoluteUrl(image), alt: upcoming.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoByRoute.events.title,
      description,
      images: [image.startsWith("http") ? image : absoluteUrl(image)],
      site: SEO_TWITTER,
    },
  };
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
