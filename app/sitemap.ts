import type { MetadataRoute } from "next";
import { siteData } from "@/content/siteData";
import { getPublishedEvents } from "@/lib/events-server";
import { absoluteUrl } from "@/seo/meta";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/about",
    "/programs",
    "/events",
    "/volunteer",
    "/gallery",
    "/contact",
    "/donate",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
  }));

  const programEntries: MetadataRoute.Sitemap = siteData.programs.map((program) => ({
    url: absoluteUrl(`/programs/${program.slug}`),
    lastModified: now,
  }));

  const events = await getPublishedEvents();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: event.updated_at || event.created_at || now.toISOString(),
  }));

  return [...staticEntries, ...programEntries, ...eventEntries];
}
