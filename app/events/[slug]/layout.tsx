import type { Metadata } from "next";
import { getPublishedEventBySlug } from "@/lib/events-server";
import { buildMetadata, seoByRoute } from "@/seo/meta";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getPublishedEventBySlug(params.slug);

  if (!event) {
    return buildMetadata(seoByRoute.events);
  }

  return buildMetadata(
    {
      title: `${event.title} | Youth Uplift Initiative`,
      description: event.summary || event.description || seoByRoute.events.description,
      path: `/events/${event.slug}`,
      image: event.image_url || undefined,
    },
    "article",
  );
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
