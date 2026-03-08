import { getServiceClient } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { getResend, getResendConfig, isResendEnabled, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { firstName: string; lastName: string; email: string; subject: string; message: string };
    ensure(body.firstName && body.lastName && body.email && body.subject && body.message, "Missing required fields");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("contact_submissions").insert({ first_name: body.firstName, last_name: body.lastName, email: body.email, subject: body.subject, message: body.message, status: "new" }).select("id").single();
    if (error) throw error;

    const subject = `New contact submission: ${body.subject}`;
    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const emailResult = await runResendSafe(() =>
        resend.emails.send({
          from: senderFrom("contact"),
          to: cfg.adminEmail,
          subject,
          html: renderEmailTemplate({
            title: "New Contact Submission",
            subtitle: "A new message was submitted from the website contact form.",
            bodyHtml: `<p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Subject:</strong> ${body.subject}</p><p><strong>Message:</strong><br/>${body.message}</p>`,
          }),
        }),
      );
      await supabase.from("email_logs").insert({
        event_type: "new_contact_notification",
        recipient_email: cfg.adminEmail,
        subject,
        provider_message_id: emailResult.ok ? (emailResult.data as any)?.data?.id ?? null : null,
        status: emailResult.ok ? "sent" : "failed",
        payload: { contact_submission_id: data.id, from_email: body.email, error: emailResult.ok ? null : emailResult.error },
      });
    }

    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
