import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/events-server";
import { getPublishedPrograms } from "@/lib/programs-server";
import { getServiceClient } from "@/lib/supabase-server";
import { absoluteUrl } from "@/seo/meta";
import { faqSections } from "@/content/faqData";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/about",
    "/programs",
    "/events",
    "/volunteer",
    "/partner-with-us",
    "/gallery",
    "/contact",
    "/donate",
    "/faq",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
  }));

  const faqEntries: MetadataRoute.Sitemap = faqSections.map((section) => ({
    url: absoluteUrl(`/faq/${section.slug}`),
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

  const supabase = getServiceClient();
  const { data: galleryGroupsData, error: galleryError } = await supabase
    .from("gallery_groups")
    .select("slug,updated_at,created_at")
    .eq("is_visible", true);

  const galleryGroups = galleryError ? [] : galleryGroupsData ?? [];

  const galleryEntries: MetadataRoute.Sitemap = galleryGroups.map((group) => ({
    url: absoluteUrl(`/gallery/${group.slug}`),
    lastModified: group.updated_at || group.created_at || now.toISOString(),
  }));

  return [...staticEntries, ...faqEntries, ...programEntries, ...eventEntries, ...galleryEntries];
}
