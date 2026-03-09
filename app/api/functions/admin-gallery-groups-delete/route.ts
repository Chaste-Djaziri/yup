import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { id: string };

    if (!body.id) throw new Error("Group id is required");

    const supabase = getServiceClient();
    const { error } = await supabase.from("gallery_groups").delete().eq("id", body.id);
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "delete",
      entity: "gallery_groups",
      entity_id: body.id,
      metadata: {},
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
