import { getServiceClient } from "@/lib/supabase-server";
import { isResendEnabled } from "../_shared/resend";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    if (!isResendEnabled()) return json({ received: true, skipped: "resend_disabled" });

    const expected = process.env.RESEND_WEBHOOK_SECRET || "";
    const provided = req.headers.get("authorization")?.replace("Bearer ", "") || req.headers.get("x-webhook-secret") || "";
    if (expected && provided !== expected) return json({ error: "Invalid webhook secret" }, 401);

    const payload = await req.json();
    const supabase = getServiceClient();
    await supabase.from("email_logs").insert({
      event_type: "resend_webhook",
      recipient_email: payload?.data?.to?.[0] ?? null,
      subject: payload?.data?.subject ?? null,
      provider_message_id: payload?.data?.id ?? payload?.data?.broadcast_id ?? null,
      status: payload?.type ?? "webhook",
      payload,
    });

    return json({ received: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
