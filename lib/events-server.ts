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
