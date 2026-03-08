import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { addContactEmailToSegment, createOrUpdateContactByEmail, getResend, getResendConfig, isResendEnabled, normalizeEmail, runResendSafe, senderFrom } from "../_shared/resend";
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
    let html = renderEmailTemplate({
      title: "Volunteer Application Update",
      subtitle: "Status update from Youth Uplift Initiative",
      bodyHtml: `<p>Hello ${data.first_name}, your volunteer application status is now <strong>${body.status}</strong>.</p>`,
    });

    if (body.status === "accepted") {
      subject = "Your volunteer application has been accepted";
      html = renderEmailTemplate({
        title: "Volunteer Application Accepted",
        subtitle: "Welcome to the YUP volunteer community",
        bodyHtml: `<p>Hello ${data.first_name},</p><p>Great news! Your volunteer application has been accepted.</p><p>Please join our WhatsApp group to receive onboarding updates and coordination details:</p><p><a href=\"https://chat.whatsapp.com/FtXWp0oMLhVCw2RLx9TuXR?mode=gi_t\" target=\"_blank\" rel=\"noreferrer\">Join the YUP Volunteer WhatsApp Group</a></p><p>We will contact you with next steps shortly.</p>`,
      });

      const normalizedEmail = normalizeEmail(data.email);
      await supabase.from("newsletter_subscribers").upsert({ email: normalizedEmail, source: "volunteer_accept", linked_volunteer_id: data.id }, { onConflict: "email" });

      if (isResendEnabled()) {
        const cfg = getResendConfig();
        const syncResult = await runResendSafe(async () => {
          const contact = await createOrUpdateContactByEmail(normalizedEmail, data.first_name, data.last_name);
          const segment = await addContactEmailToSegment(normalizedEmail, cfg.communitySegmentId);
          return { contact, segment };
        });
        await supabase.from("email_logs").insert({
          event_type: "volunteer_community_segment_sync",
          recipient_email: normalizedEmail,
          subject: "Volunteer community segment sync",
          status: syncResult.ok ? "sent" : "failed",
          payload: {
            volunteer_id: data.id,
            contact_sync: syncResult.ok ? syncResult.data.contact : null,
            segment_sync: syncResult.ok ? syncResult.data.segment : null,
            segment_id: cfg.communitySegmentId || null,
            error: syncResult.ok ? null : syncResult.error,
          },
        });
      }
    }

    if (body.status === "rejected") {
      subject = "Your volunteer application update";
      html = renderEmailTemplate({
        title: "Volunteer Application Update",
        subtitle: "Thank you for applying to volunteer with YUP",
        bodyHtml: `<p>Hello ${data.first_name},</p><p>Thank you for applying. At this time your application was not accepted.</p><p>We encourage you to apply again in the future.</p>`,
      });
    }

    if ((body.status === "accepted" || body.status === "rejected") && isResendEnabled()) {
      const resend = getResend();
      const sent = await runResendSafe(() =>
        resend.emails.send({ from: senderFrom("volunteer"), to: data.email, subject, html }),
      );
      await supabase.from("email_logs").insert({
        event_type: "volunteer_status_email",
        recipient_email: data.email,
        subject,
        provider_message_id: sent.ok ? (sent.data as any)?.data?.id ?? null : null,
        status: sent.ok ? "sent" : "failed",
        payload: { volunteer_id: data.id, status: body.status, error: sent.ok ? null : sent.error },
      });
    }

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "update_status", entity: "volunteer_applications", entity_id: data.id, metadata: { status: body.status } });
    return json({ volunteer: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
