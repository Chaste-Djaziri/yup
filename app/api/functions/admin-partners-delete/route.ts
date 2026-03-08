import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { id: string };
    if (!body.id) throw new Error("id is required");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("partner_submissions").delete().eq("id", body.id).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "delete",
      entity: "partner_submissions",
      entity_id: data.id,
      metadata: { email: data.email, organization_name: data.organization_name, partner_type: data.partner_type },
    });

    return json({ partner: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
