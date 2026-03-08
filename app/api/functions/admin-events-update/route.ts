import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { getResend, getResendConfig, isResendEnabled, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { toSlug } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Record<string, any>;
    if (!body.id) throw new Error("Event id is required");

    const updatePayload: Record<string, unknown> = {
      title: body.title,
      slug: body.slug || (body.title ? toSlug(body.title) : undefined),
      summary: body.summary,
      description: body.description,
      location: body.location,
      event_start: body.event_start,
      event_end: body.event_end,
      image_url: body.image_url,
      cloudinary_public_id: body.cloudinary_public_id,
      registration_url: body.registration_url,
      status: body.status,
    };

    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    const supabase = getServiceClient();
    const { data, error } = await supabase.from("events").update(updatePayload).eq("id", body.id).select("*").single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "update", entity: "events", entity_id: data.id, metadata: updatePayload });

    if (data.status === "published" && isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      if (cfg.communitySegmentId) {
        const broadcastResult = await runResendSafe(async () => {
          const broadcast = await resend.broadcasts.create({ segmentId: cfg.communitySegmentId, from: senderFrom("newsletter"), subject: `Event Update: ${data.title}`, html: `<h2>${data.title}</h2><p>${data.summary ?? ""}</p><p>${data.description ?? ""}</p><p><a href="${data.registration_url ?? "https://yupinitiative.com/events"}">Register</a></p>` });
          if (!broadcast.data?.id) throw new Error("Broadcast id missing");
          await resend.broadcasts.send(broadcast.data.id, {});
          return broadcast.data.id;
        });

        await supabase.from("email_logs").insert({
          event_type: "event_broadcast",
          subject: `Event Update: ${data.title}`,
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
