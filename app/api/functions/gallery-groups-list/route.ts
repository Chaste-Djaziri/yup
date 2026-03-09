import { getServiceClient } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data: groups, error } = await supabase
      .from("gallery_groups")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!groups?.length) return json({ groups: [] });

    const groupIds = groups.map((g) => g.id);
    const { data: photos, error: photosError } = await supabase
      .from("gallery_group_photos")
      .select("group_id")
      .in("group_id", groupIds);

    if (photosError) throw photosError;

    const counts = new Map<string, number>();
    for (const photo of photos || []) {
      counts.set(photo.group_id, (counts.get(photo.group_id) || 0) + 1);
    }

    return json({ groups: groups.map((group) => ({ ...group, photo_count: counts.get(group.id) || 0 })) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
