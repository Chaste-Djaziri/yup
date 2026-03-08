import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled } from "../_shared/resend";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { id: string; status: "new" | "in_review" | "accepted" | "rejected" | "archived" };
    if (!body.id || !body.status) throw new Error("id and status are required");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("volunteer_applications").update({ status: body.status }).eq("id", body.id).select("*").single();
    if (error) throw error;

    let subject = "Volunteer application update";
    let html = `<p>Hello ${data.first_name}, your volunteer application status is now <strong>${body.status}</strong>.</p>`;

    if (body.status === "accepted") {
      subject = "Your volunteer application has been accepted";
      html = `<p>Hello ${data.first_name},</p><p>Great news! Your volunteer application has been accepted.</p><p>We will contact you with next steps shortly.</p>`;

      await supabase.from("newsletter_subscribers").upsert({ email: data.email.toLowerCase(), source: "volunteer_accept", linked_volunteer_id: data.id }, { onConflict: "email" });

      if (isResendEnabled()) {
        const resend = getResend();
        const cfg = getResendConfig();
        if (cfg.audienceId) await resend.contacts.create({ email: data.email.toLowerCase(), audienceId: cfg.audienceId, unsubscribed: false }).catch(() => null);
        if (cfg.communitySegmentId) await resend.contacts.segments.add({ email: data.email.toLowerCase(), segmentId: cfg.communitySegmentId }).catch(() => null);
      }
    }

    if (body.status === "rejected") {
      subject = "Your volunteer application update";
      html = `<p>Hello ${data.first_name},</p><p>Thank you for applying. At this time your application was not accepted.</p><p>We encourage you to apply again in the future.</p>`;
    }

    if ((body.status === "accepted" || body.status === "rejected") && isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const sent = await resend.emails.send({ from: cfg.from, to: data.email, subject, html });
      await supabase.from("email_logs").insert({ event_type: "volunteer_status_email", recipient_email: data.email, subject, provider_message_id: sent.data?.id ?? null, status: sent.error ? "failed" : "sent", payload: { volunteer_id: data.id, status: body.status } });
    }

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "update_status", entity: "volunteer_applications", entity_id: data.id, metadata: { status: body.status } });
    return json({ volunteer: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
