import { getServiceClient } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) throw new Error("slug is required");

    const supabase = getServiceClient();

    const { data: group, error: groupError } = await supabase
      .from("gallery_groups")
      .select("*")
      .eq("slug", slug)
      .eq("is_visible", true)
      .maybeSingle();

    if (groupError) throw groupError;
    if (!group) return json({ error: "Gallery group not found" }, 404);

    const { data: photos, error: photosError } = await supabase
      .from("gallery_group_photos")
      .select("*")
      .eq("group_id", group.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (photosError) throw photosError;

    return json({ group: { ...group, photo_count: photos?.length || 0 }, photos: photos || [] });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
