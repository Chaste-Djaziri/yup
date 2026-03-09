import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

type Body = {
  group_id: string;
  title?: string;
  image_url: string;
  cloudinary_public_id?: string;
  sort_order?: number;
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Body;

    ensure(body.group_id, "group_id is required");
    ensure(body.image_url, "image_url is required");

    const supabase = getServiceClient();

    const { data: group, error: groupError } = await supabase
      .from("gallery_groups")
      .select("id")
      .eq("id", body.group_id)
      .maybeSingle();

    if (groupError) throw groupError;
    if (!group) throw new Error("Gallery group not found");

    const payload = {
      group_id: body.group_id,
      title: body.title || null,
      image_url: body.image_url,
      cloudinary_public_id: body.cloudinary_public_id ?? null,
      sort_order: Number.isFinite(body.sort_order) ? Number(body.sort_order) : 0,
      created_by: user.id,
    };

    const { data, error } = await supabase.from("gallery_group_photos").insert(payload).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "create",
      entity: "gallery_group_photos",
      entity_id: data.id,
      metadata: payload,
    });

    return json({ photo: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
