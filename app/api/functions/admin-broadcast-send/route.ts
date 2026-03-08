import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { getResendConfig, isResendEnabled, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";

type BroadcastTarget = "community" | "non_community" | "both";

type BroadcastResult = { target: string; broadcastId: string | null; status: "sent" | "failed"; error?: string | null };

const RESEND_API_BASE = "https://api.resend.com";
const MAX_RETRIES = 3;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const resendRequest = async (path: string, init: RequestInit) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is missing");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(`${RESEND_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });

    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
      await wait(response.status === 429 ? 1100 * attempt : 350 * attempt);
      continue;
    }

    if (!response.ok) {
      throw new Error(body?.message || body?.name || `Resend request failed (${response.status})`);
    }

    return body;
  }

  throw new Error("Resend request failed after retries");
};

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

    const results: BroadcastResult[] = [];

    for (const segment of segments) {
      try {
        const created = await resendRequest("/broadcasts", {
          method: "POST",
          body: JSON.stringify({
            segment_id: segment.segmentId,
            from: senderFrom("newsletter"),
            subject: body.subject,
            html: renderEmailTemplate({
              title: body.subject,
              subtitle: "Community update from Youth Uplift Initiative",
              bodyHtml: body.html,
            }),
          }),
        });

        const broadcastId = created?.id as string | undefined;
        if (!broadcastId) throw new Error("Broadcast id missing from Resend response");

        await resendRequest(`/broadcasts/${broadcastId}/send`, {
          method: "POST",
          body: JSON.stringify({}),
        });

        const record: BroadcastResult = {
          target: segment.key,
          broadcastId,
          status: "sent",
          error: null,
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
            error: null,
          },
        });
      } catch (error) {
        const record: BroadcastResult = {
          target: segment.key,
          broadcastId: null,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown broadcast error",
        };
        results.push(record);

        await supabase.from("email_logs").insert({
          event_type: "admin_broadcast",
          subject: body.subject,
          status: record.status,
          provider_message_id: null,
          payload: {
            target: record.target,
            segment_id: segment.segmentId,
            error: record.error,
          },
        });
      }
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
