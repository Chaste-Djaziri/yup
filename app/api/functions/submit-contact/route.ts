import { getServiceClient } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { firstName: string; lastName: string; email: string; subject: string; message: string };
    ensure(body.firstName && body.lastName && body.email && body.subject && body.message, "Missing required fields");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("contact_submissions").insert({ first_name: body.firstName, last_name: body.lastName, email: body.email, subject: body.subject, message: body.message, status: "new" }).select("id").single();
    if (error) throw error;

    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const emailResult = await resend.emails.send({ from: cfg.from, to: cfg.adminEmail, subject: `New contact submission: ${body.subject}`, html: `<h2>New contact submission</h2><p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Subject:</strong> ${body.subject}</p><p><strong>Message:</strong><br/>${body.message}</p>` });
      await supabase.from("email_logs").insert({ event_type: "new_contact_notification", recipient_email: cfg.adminEmail, subject: `New contact submission: ${body.subject}`, provider_message_id: emailResult.data?.id ?? null, status: emailResult.error ? "failed" : "sent", payload: { contact_submission_id: data.id, from_email: body.email } });
    }

    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
