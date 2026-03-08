import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { getResend, getResendConfig, isResendEnabled, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { ensure, toSlug } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Record<string, any>;
    ensure(body.title, "Title is required");
    ensure(body.event_start, "event_start is required");

    const payload = {
      title: body.title,
      slug: body.slug || toSlug(body.title),
      summary: body.summary ?? null,
      description: body.description ?? null,
      location: body.location ?? null,
      event_start: body.event_start,
      event_end: body.event_end ?? null,
      image_url: body.image_url ?? null,
      cloudinary_public_id: body.cloudinary_public_id ?? null,
      registration_url: body.registration_url ?? null,
      status: body.status ?? "draft",
      created_by: user.id,
    };

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("events").insert(payload).select("*").single();
    if (error) throw error;
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "create", entity: "events", entity_id: data.id, metadata: payload });

    if (data.status === "published" && isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      if (cfg.communitySegmentId) {
        const broadcastResult = await runResendSafe(async () => {
          const broadcast = await resend.broadcasts.create({ segmentId: cfg.communitySegmentId, from: senderFrom("newsletter"), subject: `New YUP Event: ${data.title}`, html: renderEmailTemplate({ title: `New Event: ${data.title}`, subtitle: data.summary ?? "A new YUP event has been published.", bodyHtml: `<p>${data.description ?? ""}</p><p><strong>Location:</strong> ${data.location ?? "TBD"}</p>`, ctaLabel: "View Event", ctaUrl: data.registration_url ?? "https://yupinitiative.com/events" }) });
          if (!broadcast.data?.id) throw new Error("Broadcast id missing");
          await resend.broadcasts.send(broadcast.data.id, {});
          return broadcast.data.id;
        });

        await supabase.from("email_logs").insert({
          event_type: "event_broadcast",
          subject: `New YUP Event: ${data.title}`,
          status: broadcastResult.ok ? "sent" : "failed",
          provider_message_id: broadcastResult.ok ? broadcastResult.data : null,
          payload: { event_id: data.id, error: broadcastResult.ok ? null : broadcastResult.error },
        });
      }
    }

    return json({ event: data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
