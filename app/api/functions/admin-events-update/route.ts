import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { renderEmailTemplate } from "../_shared/email-template";
import { getResend, getResendConfig, isResendEnabled, runResendSafe, senderFrom } from "../_shared/resend";
import { json } from "../_shared/response";
import { toSlug } from "../_shared/utils";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req.headers.get("Authorization") || undefined);
    const body = (await req.json()) as Record<string, any>;
    if (!body.id) throw new Error("Event id is required");

    const supabase = getServiceClient();

    const { data: existingEvent, error: existingEventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", body.id)
      .single();
    if (existingEventError) throw existingEventError;

    const requestedSlug = typeof body.slug === "string" ? body.slug : existingEvent.slug;
    const normalizedSlug = toSlug(requestedSlug);
    if (!normalizedSlug) throw new Error("Valid slug is required");

    const { data: slugEventMatch, error: slugEventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", normalizedSlug)
      .maybeSingle();
    if (slugEventError) throw slugEventError;
    if (slugEventMatch && slugEventMatch.id !== body.id) throw new Error("Slug already exists for another event");

    const { data: slugAliasMatch, error: slugAliasError } = await supabase
      .from("event_slug_aliases")
      .select("event_id")
      .eq("alias_slug", normalizedSlug)
      .maybeSingle();
    if (slugAliasError) throw slugAliasError;
    if (slugAliasMatch && slugAliasMatch.event_id !== body.id) throw new Error("Slug is reserved by a legacy event URL");

    const updatePayload: Record<string, unknown> = {
      title: body.title,
      slug: normalizedSlug,
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

    const { data, error } = await supabase.from("events").update(updatePayload).eq("id", body.id).select("*").single();
    if (error) throw error;

    if (existingEvent.slug !== data.slug) {
      const { error: aliasInsertError } = await supabase
        .from("event_slug_aliases")
        .upsert({ event_id: data.id, alias_slug: existingEvent.slug }, { onConflict: "alias_slug" });
      if (aliasInsertError) throw aliasInsertError;
    }

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: "update", entity: "events", entity_id: data.id, metadata: updatePayload });

    if (data.status === "published" && isResendEnabled()) {
      const resend = getResend();
      const cfg = getResendConfig();
      if (cfg.communitySegmentId) {
        const broadcastResult = await runResendSafe(async () => {
          const broadcast = await resend.broadcasts.create({ segmentId: cfg.communitySegmentId, from: senderFrom("newsletter"), subject: `Event Update: ${data.title}`, html: renderEmailTemplate({ title: `Event Update: ${data.title}`, subtitle: data.summary ?? "There is an update to a YUP event.", bodyHtml: `<p>${data.description ?? ""}</p>`, ctaLabel: "View Event", ctaUrl: data.registration_url ?? "https://yupinitiative.com/events" }) });
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
