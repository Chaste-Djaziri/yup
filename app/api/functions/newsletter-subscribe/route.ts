import { getServiceClient } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { addContactEmailToSegment, createOrUpdateContactByEmail, getResend, getResendConfig, isResendEnabled, normalizeEmail, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email: string };
    ensure(body.email, "Email is required");

    const supabase = getServiceClient();
    const email = normalizeEmail(body.email);
    const { error } = await supabase.from("newsletter_subscribers").upsert({ email, source: "none_community" }, { onConflict: "email" });
    if (error) throw error;

    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const notification = await runResendSafe(() =>
        resend.emails.send({
          from: senderFrom("newsletter"),
          to: cfg.adminEmail,
          subject: "New newsletter subscription",
          html: renderEmailTemplate({
            title: "New Newsletter Subscriber",
            subtitle: "A visitor joined the newsletter from the website.",
            bodyHtml: `<p><strong>Email:</strong> ${email}</p>`,
          }),
        }),
      );
      await supabase.from("email_logs").insert({
        event_type: "newsletter_admin_notification",
        recipient_email: cfg.adminEmail,
        subject: "New newsletter subscription",
        provider_message_id: notification.ok ? (notification.data as any)?.data?.id ?? null : null,
        status: notification.ok ? "sent" : "failed",
        payload: { email, error: notification.ok ? null : notification.error },
      });

      const syncResult = await runResendSafe(async () => {
        const contact = await createOrUpdateContactByEmail(email);
        const segment = await addContactEmailToSegment(email, cfg.nonCommunitySegmentId);
        return { contact, segment };
      });

      await supabase.from("email_logs").insert({
        event_type: "newsletter_resend_sync",
        recipient_email: email,
        subject: "Newsletter segment sync",
        status: syncResult.ok ? "sent" : "failed",
        payload: {
          contact_sync: syncResult.ok ? syncResult.data.contact : null,
          segment_sync: syncResult.ok ? syncResult.data.segment : null,
          segment_id: cfg.nonCommunitySegmentId || null,
          error: syncResult.ok ? null : syncResult.error,
        },
      });
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
