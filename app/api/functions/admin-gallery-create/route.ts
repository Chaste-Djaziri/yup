import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

type CreateGalleryBody = {
  title: string;
  category: "events" | "programs" | "community";
  image_url: string;
  cloudinary_public_id?: string;
  sort_order?: number;
  is_visible?: boolean;
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as CreateGalleryBody;

    ensure(body.title, "Title is required");
    ensure(body.category, "Category is required");
    ensure(body.image_url, "image_url is required");

    const supabase = getServiceClient();
    const payload = {
      title: body.title,
      category: body.category,
      image_url: body.image_url,
      cloudinary_public_id: body.cloudinary_public_id ?? null,
      sort_order: Number.isFinite(body.sort_order) ? Number(body.sort_order) : 0,
      is_visible: body.is_visible ?? true,
      created_by: user.id,
    };

    const { data, error } = await supabase.from("gallery_images").insert(payload).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "create",
      entity: "gallery_images",
      entity_id: data.id,
      metadata: payload,
    });

    return json({ image: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
