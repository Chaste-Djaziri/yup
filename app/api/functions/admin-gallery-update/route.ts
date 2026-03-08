import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

type UpdateGalleryBody = {
  id: string;
  title?: string;
  category?: "events" | "programs" | "community";
  sort_order?: number;
  is_visible?: boolean;
  image_url?: string;
  cloudinary_public_id?: string;
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as UpdateGalleryBody;

    if (!body.id) throw new Error("Image id is required");

    const updatePayload: Record<string, unknown> = {
      title: body.title,
      category: body.category,
      sort_order: body.sort_order,
      is_visible: body.is_visible,
      image_url: body.image_url,
      cloudinary_public_id: body.cloudinary_public_id,
    };

    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .update(updatePayload)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "update",
      entity: "gallery_images",
      entity_id: data.id,
      metadata: updatePayload,
    });

    return json({ image: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
