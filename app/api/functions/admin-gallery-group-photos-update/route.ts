import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

type Body = {
  id: string;
  title?: string;
  sort_order?: number;
  image_url?: string;
  cloudinary_public_id?: string;
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Body;

    if (!body.id) throw new Error("Photo id is required");

    const updatePayload: Record<string, unknown> = {
      title: body.title,
      sort_order: body.sort_order,
      image_url: body.image_url,
      cloudinary_public_id: body.cloudinary_public_id,
    };

    Object.keys(updatePayload).forEach((key) => updatePayload[key] === undefined && delete updatePayload[key]);

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("gallery_group_photos")
      .update(updatePayload)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "update",
      entity: "gallery_group_photos",
      entity_id: data.id,
      metadata: updatePayload,
    });

    return json({ photo: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
