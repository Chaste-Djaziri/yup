import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/events-server";
import { getPublishedPrograms } from "@/lib/programs-server";
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

  const programs = await getPublishedPrograms();
  const programEntries: MetadataRoute.Sitemap = programs.map((program) => ({
    url: absoluteUrl(`/programs/${program.slug}`),
    lastModified: program.updated_at || program.created_at || now.toISOString(),
  }));

  const events = await getPublishedEvents();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: event.updated_at || event.created_at || now.toISOString(),
  }));

  return [...staticEntries, ...programEntries, ...eventEntries];
}
