import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled } from "../_shared/resend";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { id: string; message: string; subject?: string };
    if (!body.id || !body.message) throw new Error("id and message are required");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("volunteer_applications").select("*").eq("id", body.id).single();
    if (error) throw error;

    const subject = body.subject || "Reply from Youth Uplift Initiative";
    await supabase.from("volunteer_applications").update({ admin_reply: body.message, replied_at: new Date().toISOString() }).eq("id", body.id);

    if (isResendEnabled()) {
      const cfg = getResendConfig();
      const resend = getResend();
      const sent = await resend.emails.send({ from: cfg.from, to: data.email, subject, html: `<p>Hello ${data.first_name},</p><p>${body.message}</p>` });
      await supabase.from("email_logs").insert({ event_type: "volunteer_reply_email", recipient_email: data.email, subject, provider_message_id: sent.data?.id ?? null, status: sent.error ? "failed" : "sent", payload: { volunteer_id: data.id } });
    }

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "reply", entity: "volunteer_applications", entity_id: data.id, metadata: { subject } });
    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
