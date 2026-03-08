import { getServiceClient } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { firstName: string; lastName: string; email: string; phone?: string; country?: string; opportunity?: string; motivation: string };
    ensure(body.firstName && body.lastName && body.email && body.motivation, "Missing required fields");

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("volunteer_applications").insert({ first_name: body.firstName, last_name: body.lastName, email: body.email, phone: body.phone ?? null, country: body.country ?? null, opportunity: body.opportunity ?? null, motivation: body.motivation, status: "new" }).select("id").single();
    if (error) throw error;

    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      const emailResult = await resend.emails.send({ from: cfg.from, to: cfg.adminEmail, subject: `New volunteer application: ${body.firstName} ${body.lastName}`, html: `<h2>New volunteer application</h2><p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Phone:</strong> ${body.phone ?? "N/A"}</p><p><strong>Country:</strong> ${body.country ?? "N/A"}</p><p><strong>Opportunity:</strong> ${body.opportunity ?? "N/A"}</p><p><strong>Motivation:</strong><br/>${body.motivation}</p>` });
      await supabase.from("email_logs").insert({ event_type: "new_volunteer_notification", recipient_email: cfg.adminEmail, subject: `New volunteer application: ${body.firstName} ${body.lastName}`, provider_message_id: emailResult.data?.id ?? null, status: emailResult.error ? "failed" : "sent", payload: { volunteer_application_id: data.id, from_email: body.email } });
    }

    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
