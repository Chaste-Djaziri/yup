import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";

type BroadcastTarget = "community" | "non_community" | "both";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as { subject: string; html: string; target: BroadcastTarget };

    if (!body.subject || !body.html || !body.target) {
      throw new Error("subject, html, and target are required");
    }

    if (!isResendEnabled()) {
      throw new Error("Resend is disabled. Enable RESEND_ENABLED=true to send broadcasts.");
    }

    const cfg = getResendConfig();
    const resend = getResend();
    const supabase = getServiceClient();

    const segments: { key: "community" | "non_community"; segmentId: string }[] =
      body.target === "community"
        ? [{ key: "community", segmentId: cfg.communitySegmentId }]
        : body.target === "non_community"
          ? [{ key: "non_community", segmentId: cfg.nonCommunitySegmentId }]
          : [
              { key: "community", segmentId: cfg.communitySegmentId },
              { key: "non_community", segmentId: cfg.nonCommunitySegmentId },
            ];

    const missing = segments.filter((item) => !item.segmentId);
    if (missing.length > 0) {
      throw new Error(`Missing segment id for: ${missing.map((item) => item.key).join(", ")}`);
    }

    const results: Array<{ target: string; broadcastId: string | null; status: "sent" | "failed"; error?: string | null }> = [];

    for (const segment of segments) {
      const result = await runResendSafe(async () => {
        const created = await resend.broadcasts.create({
          segmentId: segment.segmentId,
          from: senderFrom("newsletter"),
          subject: body.subject,
          html: body.html,
        });

        const broadcastId = created.data?.id;
        if (!broadcastId) throw new Error("Broadcast id missing from Resend response");

        await resend.broadcasts.send(broadcastId, {});
        return broadcastId;
      });

      const record = {
        target: segment.key,
        broadcastId: result.ok ? result.data : null,
        status: result.ok ? "sent" : "failed",
        error: result.ok ? null : result.error,
      };

      results.push(record);

      await supabase.from("email_logs").insert({
        event_type: "admin_broadcast",
        subject: body.subject,
        status: record.status,
        provider_message_id: record.broadcastId,
        payload: {
          target: record.target,
          segment_id: segment.segmentId,
          error: record.error,
        },
      });
    }

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "broadcast_send",
      entity: "resend_broadcast",
      entity_id: null,
      metadata: { target: body.target, subject: body.subject, results },
    });

    return json({ success: true, results });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
