import { getServiceClient } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { getResend, getResendConfig, isResendEnabled, normalizeEmail, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { firstName: string; lastName: string; email: string; phone?: string; country?: string; opportunity?: string; motivation: string };
    ensure(body.firstName && body.lastName && body.email && body.opportunity && body.motivation, "Missing required fields");

    const supabase = getServiceClient();
    if (body.opportunity) {
      const { data: program, error: programError } = await supabase
        .from("programs")
        .select("id")
        .eq("status", "published")
        .eq("title", body.opportunity.trim())
        .maybeSingle();

      if (programError) throw programError;
      if (!program) throw new Error("Selected opportunity is no longer available.");
    }

    const { data, error } = await supabase.from("volunteer_applications").insert({ first_name: body.firstName, last_name: body.lastName, email: body.email, phone: body.phone ?? null, country: body.country ?? null, opportunity: body.opportunity ?? null, motivation: body.motivation, status: "new" }).select("id").single();
    if (error) throw error;

    const subject = `New volunteer application: ${body.firstName} ${body.lastName}`;
    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const emailResult = await runResendSafe(() =>
        resend.emails.send({
          from: senderFrom("volunteer"),
          to: cfg.adminEmail,
          subject,
          html: renderEmailTemplate({
            title: "New Volunteer Application",
            subtitle: "A new volunteer application was submitted.",
            bodyHtml: `<p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Phone:</strong> ${body.phone ?? "N/A"}</p><p><strong>Country:</strong> ${body.country ?? "N/A"}</p><p><strong>Opportunity:</strong> ${body.opportunity ?? "N/A"}</p><p><strong>Motivation:</strong><br/>${body.motivation}</p>`,
          }),
        }),
      );
      await supabase.from("email_logs").insert({
        event_type: "new_volunteer_notification",
        recipient_email: cfg.adminEmail,
        subject,
        provider_message_id: emailResult.ok ? (emailResult.data as any)?.data?.id ?? null : null,
        status: emailResult.ok ? "sent" : "failed",
        payload: { volunteer_application_id: data.id, from_email: normalizeEmail(body.email), error: emailResult.ok ? null : emailResult.error },
      });
    }

    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
