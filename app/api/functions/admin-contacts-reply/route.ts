import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { plainTextToHtml, renderEmailTemplate } from "../_shared/email-template";
import { getResend, isResendEnabled, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { id: string; message: string; subject?: string };
    if (!body.id || !body.message) throw new Error("id and message are required");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("contact_submissions").select("*").eq("id", body.id).single();
    if (error) throw error;

    const subject = body.subject || `Reply: ${data.subject}`;
    await supabase.from("contact_submissions").update({ admin_reply: body.message, replied_at: new Date().toISOString() }).eq("id", body.id);

    if (isResendEnabled()) {
      const resend = getResend();
      const sent = await runResendSafe(() =>
        resend.emails.send({
          from: senderFrom("contact"),
          to: data.email,
          subject,
          html: renderEmailTemplate({
            title: "Response From Youth Uplift Initiative",
            subtitle: "We reviewed your message and sent a reply below.",
            bodyHtml: `<p>Hello ${data.first_name},</p><p>${plainTextToHtml(body.message)}</p>`,
          }),
        }),
      );
      await supabase.from("email_logs").insert({
        event_type: "contact_reply_email",
        recipient_email: data.email,
        subject,
        provider_message_id: sent.ok ? (sent.data as any)?.data?.id ?? null : null,
        status: sent.ok ? "sent" : "failed",
        payload: { contact_id: data.id, error: sent.ok ? null : sent.error },
      });
    }

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "reply", entity: "contact_submissions", entity_id: data.id, metadata: { subject } });
    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
