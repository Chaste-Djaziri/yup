import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";
import { toSlug } from "../_shared/utils";

type UpdateProgramBody = {
  id: string;
  slug?: string;
  title?: string;
  category?: string;
  summary?: string;
  description?: string;
  outcomes?: string[];
  cover_image_url?: string;
  cover_cloudinary_public_id?: string;
  cta_label?: string;
  sort_order?: number;
  status?: "draft" | "published" | "archived";
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as UpdateProgramBody;

    if (!body.id) throw new Error("Program id is required");

    const supabase = getServiceClient();

    let normalizedSlug: string | undefined;
    if (body.slug !== undefined) {
      normalizedSlug = toSlug(body.slug);
      if (!normalizedSlug) throw new Error("Valid slug is required");

      const { data: slugMatch, error: slugError } = await supabase
        .from("programs")
        .select("id")
        .eq("slug", normalizedSlug)
        .maybeSingle();
      if (slugError) throw slugError;
      if (slugMatch && slugMatch.id !== body.id) throw new Error("Slug already exists for another program");
    }

    const updatePayload: Record<string, unknown> = {
      slug: normalizedSlug,
      title: body.title,
      category: body.category,
      summary: body.summary,
      description: body.description,
      outcomes: body.outcomes ? body.outcomes.map((item) => item.trim()).filter(Boolean) : undefined,
      cover_image_url: body.cover_image_url,
      cover_cloudinary_public_id: body.cover_cloudinary_public_id,
      cta_label: body.cta_label,
      sort_order: body.sort_order,
      status: body.status,
    };

    Object.keys(updatePayload).forEach((key) => updatePayload[key] === undefined && delete updatePayload[key]);

    const { data, error } = await supabase.from("programs").update(updatePayload).eq("id", body.id).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "update",
      entity: "programs",
      entity_id: data.id,
      metadata: updatePayload,
    });

    return json({ program: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
