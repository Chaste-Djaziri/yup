import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";
import { ensure, toSlug } from "../_shared/utils";

type CreateProgramBody = {
  slug?: string;
  title: string;
  category: string;
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
    const body = (await req.json()) as CreateProgramBody;

    ensure(body.title, "Title is required");
    ensure(body.category, "Category is required");

    const payload = {
      slug: toSlug(body.slug || body.title),
      title: body.title,
      category: body.category,
      summary: body.summary ?? null,
      description: body.description ?? null,
      outcomes: (body.outcomes || []).map((item) => item.trim()).filter(Boolean),
      cover_image_url: body.cover_image_url ?? null,
      cover_cloudinary_public_id: body.cover_cloudinary_public_id ?? null,
      cta_label: body.cta_label || "Support This Program",
      sort_order: Number.isFinite(body.sort_order) ? Number(body.sort_order) : 0,
      status: body.status ?? "draft",
      created_by: user.id,
    };

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("programs").insert(payload).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "create",
      entity: "programs",
      entity_id: data.id,
      metadata: payload,
    });

    return json({ program: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
