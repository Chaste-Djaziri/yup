import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

type Body = {
  id?: string;
};

export async function POST(req: Request) {
  try {
    await requireAuth(req.headers.get("Authorization") || undefined);

    const body = (await req.json().catch(() => ({}))) as Body;
    const supabase = getServiceClient();

    let query = supabase
      .from("gallery_groups")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (body.id) query = query.eq("id", body.id);

    const { data: groups, error } = await query;
    if (error) throw error;

    if (!groups?.length) return json({ groups: [], photos: [] });

    const groupIds = groups.map((g) => g.id);
    const { data: allPhotos, error: photosError } = await supabase
      .from("gallery_group_photos")
      .select("*")
      .in("group_id", groupIds)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (photosError) throw photosError;

    const counts = new Map<string, number>();
    for (const photo of allPhotos || []) {
      counts.set(photo.group_id, (counts.get(photo.group_id) || 0) + 1);
    }

    return json({
      groups: groups.map((group) => ({ ...group, photo_count: counts.get(group.id) || 0 })),
      photos: allPhotos || [],
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
