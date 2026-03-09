import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";
import { ensure, toSlug } from "../_shared/utils";

type Body = {
  title: string;
  description?: string;
  slug?: string;
  cover_image_url: string;
  cover_cloudinary_public_id?: string;
  sort_order?: number;
  is_visible?: boolean;
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Body;

    ensure(body.title, "Title is required");
    ensure(body.cover_image_url, "cover_image_url is required");

    const slug = toSlug(body.slug || body.title);
    ensure(slug, "Valid slug is required");

    const supabase = getServiceClient();

    const { data: slugMatch, error: slugError } = await supabase
      .from("gallery_groups")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (slugError) throw slugError;
    if (slugMatch) throw new Error("Slug already exists for another gallery group");

    const payload = {
      slug,
      title: body.title,
      description: body.description || "",
      cover_image_url: body.cover_image_url,
      cover_cloudinary_public_id: body.cover_cloudinary_public_id ?? null,
      sort_order: Number.isFinite(body.sort_order) ? Number(body.sort_order) : 0,
      is_visible: body.is_visible ?? true,
      created_by: user.id,
    };

    const { data, error } = await supabase.from("gallery_groups").insert(payload).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "create",
      entity: "gallery_groups",
      entity_id: data.id,
      metadata: payload,
    });

    return json({ group: { ...data, photo_count: 0 } });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
