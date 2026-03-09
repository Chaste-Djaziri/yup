import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";
import { ensure, toSlug } from "../_shared/utils";

type Body = {
  id: string;
  title?: string;
  description?: string;
  slug?: string;
  cover_image_url?: string;
  cover_cloudinary_public_id?: string;
  sort_order?: number;
  is_visible?: boolean;
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Body;

    ensure(body.id, "Group id is required");

    const supabase = getServiceClient();
    const updatePayload: Record<string, unknown> = {
      title: body.title,
      description: body.description,
      cover_image_url: body.cover_image_url,
      cover_cloudinary_public_id: body.cover_cloudinary_public_id,
      sort_order: body.sort_order,
      is_visible: body.is_visible,
    };

    if (body.slug !== undefined) {
      const normalizedSlug = toSlug(body.slug);
      ensure(normalizedSlug, "Valid slug is required");

      const { data: slugMatch, error: slugError } = await supabase
        .from("gallery_groups")
        .select("id")
        .eq("slug", normalizedSlug)
        .maybeSingle();

      if (slugError) throw slugError;
      if (slugMatch && slugMatch.id !== body.id) throw new Error("Slug already exists for another gallery group");

      updatePayload.slug = normalizedSlug;
    }

    Object.keys(updatePayload).forEach((key) => updatePayload[key] === undefined && delete updatePayload[key]);

    const { data, error } = await supabase
      .from("gallery_groups")
      .update(updatePayload)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "update",
      entity: "gallery_groups",
      entity_id: data.id,
      metadata: updatePayload,
    });

    return json({ group: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
