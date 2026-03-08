import { getServiceClient } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { getResend, getResendConfig, isResendEnabled, normalizeEmail, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

type SubmitPartnerBody = {
  fullName: string;
  email: string;
  organizationName: string;
  partnerType: string;
  partnershipGoal: string;
  message: string;
  phone?: string;
  website?: string;
  country?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitPartnerBody;
    ensure(
      body.fullName && body.email && body.organizationName && body.partnerType && body.partnershipGoal && body.message,
      "Missing required fields",
    );

    const supabase = getServiceClient();
    const payload = {
      full_name: body.fullName,
      email: body.email,
      organization_name: body.organizationName,
      partner_type: body.partnerType,
      partnership_goal: body.partnershipGoal,
      message: body.message,
      phone: body.phone ?? null,
      website: body.website ?? null,
      country: body.country ?? null,
      status: "new",
    };

    const { data, error } = await supabase.from("partner_submissions").insert(payload).select("id").single();
    if (error) throw error;

    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const subject = `New partnership inquiry: ${body.organizationName}`;
      const emailResult = await runResendSafe(() =>
        resend.emails.send({
          from: senderFrom("partnerships"),
          to: cfg.adminEmail,
          subject,
          html: renderEmailTemplate({
            title: "New Partnership Inquiry",
            subtitle: "A new partnership request was submitted from the website.",
            bodyHtml: `<p><strong>Name:</strong> ${body.fullName}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Organization:</strong> ${body.organizationName}</p><p><strong>Partner type:</strong> ${body.partnerType}</p><p><strong>Goal:</strong> ${body.partnershipGoal}</p><p><strong>Phone:</strong> ${body.phone ?? "N/A"}</p><p><strong>Website:</strong> ${body.website ?? "N/A"}</p><p><strong>Country:</strong> ${body.country ?? "N/A"}</p><p><strong>Message:</strong><br/>${body.message}</p>`,
          }),
        }),
      );

      await supabase.from("email_logs").insert({
        event_type: "new_partner_notification",
        recipient_email: cfg.adminEmail,
        subject,
        provider_message_id: emailResult.ok ? (emailResult.data as any)?.data?.id ?? null : null,
        status: emailResult.ok ? "sent" : "failed",
        payload: { partner_submission_id: data.id, from_email: normalizeEmail(body.email), error: emailResult.ok ? null : emailResult.error },
      });
    }

    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
