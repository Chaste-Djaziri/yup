import { getServiceClient } from "@/lib/supabase-server";
import type { DbEvent } from "@/types/backend";

const EVENT_SELECT =
  "id,title,slug,summary,description,location,event_start,event_end,image_url,cloudinary_public_id,registration_url,status,created_at,updated_at";

export async function getPublishedEvents(): Promise<DbEvent[]> {
  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published")
      .order("event_start", { ascending: true });

    return (data || []) as DbEvent[];
  } catch {
    return [];
  }
}

export async function getPublishedEventBySlug(slug: string): Promise<DbEvent | null> {
  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    return (data as DbEvent | null) ?? null;
  } catch {
    return null;
  }
}

export async function resolvePublishedEventBySlug(
  slug: string,
): Promise<{ event: DbEvent | null; canonicalSlug: string | null; matchedAlias: boolean }> {
  try {
    const supabase = getServiceClient();
    const { data: direct } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (direct) {
      const event = direct as DbEvent;
      return { event, canonicalSlug: event.slug, matchedAlias: false };
    }

    const { data: alias } = await supabase
      .from("event_slug_aliases")
      .select("event_id")
      .eq("alias_slug", slug)
      .maybeSingle();

    if (!alias?.event_id) return { event: null, canonicalSlug: null, matchedAlias: false };

    const { data: resolved } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("id", alias.event_id)
      .eq("status", "published")
      .maybeSingle();

    if (!resolved) return { event: null, canonicalSlug: null, matchedAlias: false };
    const event = resolved as DbEvent;
    return { event, canonicalSlug: event.slug, matchedAlias: true };
  } catch {
    return { event: null, canonicalSlug: null, matchedAlias: false };
  }
}
