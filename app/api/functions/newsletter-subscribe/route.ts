import { getServiceClient } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email: string };
    ensure(body.email, "Email is required");

    const supabase = getServiceClient();
    const { error } = await supabase.from("newsletter_subscribers").upsert({ email: body.email.toLowerCase(), source: "none_community" }, { onConflict: "email" });
    if (error) throw error;

    if (isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      if (cfg.audienceId) await resend.contacts.create({ email: body.email.toLowerCase(), audienceId: cfg.audienceId, unsubscribed: false }).catch(() => null);
      if (cfg.nonCommunitySegmentId) await resend.contacts.segments.add({ email: body.email.toLowerCase(), segmentId: cfg.nonCommunitySegmentId }).catch(() => null);
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
