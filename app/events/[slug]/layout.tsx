import type { Metadata } from "next";
import { buildMetadata, seoByRoute } from "@/seo/meta";
import { resolvePublishedEventBySlug } from "@/lib/events-server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolvePublishedEventBySlug(slug);

  if (!resolved.event) {
    return buildMetadata(seoByRoute.events);
  }

  return buildMetadata(
    {
      title: `${resolved.event.title} | Youth Uplift Initiative`,
      description: resolved.event.summary || resolved.event.description || seoByRoute.events.description,
      path: `/events/${resolved.event.slug}`,
      image: resolved.event.image_url || undefined,
    },
    "article",
  );
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
