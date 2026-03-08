import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { id: string; status: "new" | "in_progress" | "resolved" | "archived" };
    if (!body.id || !body.status) throw new Error("id and status are required");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("contact_submissions").update({ status: body.status }).eq("id", body.id).select("*").single();
    if (error) throw error;
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "update_status", entity: "contact_submissions", entity_id: data.id, metadata: { status: body.status } });
    return json({ contact: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
