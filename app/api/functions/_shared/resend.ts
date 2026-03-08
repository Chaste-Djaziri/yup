import { Resend } from "resend";

const truthy = new Set(["1", "true", "yes", "on"]);
const SENDER_DOMAIN = "support.yupinitiative.com";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type SenderKind = "contact" | "volunteer" | "partnerships" | "newsletter" | "no-reply";

export const isResendEnabled = () =>
  truthy.has((process.env.RESEND_ENABLED || "true").trim().toLowerCase()) && Boolean(process.env.RESEND_API_KEY);

const normalizedUuidOrEmpty = (value?: string) => {
  const trimmed = (value || "").trim();
  return UUID_REGEX.test(trimmed) ? trimmed : "";
};

export const getResend = () => {
  if (!isResendEnabled()) throw new Error("Resend is disabled by RESEND_ENABLED");
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is missing");
  return new Resend(apiKey);
};

export const getResendConfig = () => ({
  adminEmail: "contact.yupinitiative@gmail.com",
  communitySegmentId: normalizedUuidOrEmpty(process.env.RESEND_COMMUNITY_SEGMENT_ID),
  nonCommunitySegmentId: normalizedUuidOrEmpty(process.env.RESEND_NONE_COMMUNITY_SEGMENT_ID),
  audienceId: normalizedUuidOrEmpty(process.env.RESEND_AUDIENCE_ID),
});

export const senderFrom = (kind: SenderKind) => {
  const localPartByKind: Record<SenderKind, string> = {
    contact: "contact",
    volunteer: "volunteer",
    partnerships: "partnerships",
    newsletter: "newsletter",
    "no-reply": "no-reply",
  };

  const localPart = localPartByKind[kind] || "no-reply";
  return `Youth Uplift Initiative <${localPart}@${SENDER_DOMAIN}>`;
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function ensureAudienceContact(resend: Resend, audienceId: string, email: string, firstName?: string, lastName?: string) {
  if (!audienceId) return;

  const normalized = normalizeEmail(email);
  try {
    await resend.contacts.create({
      email: normalized,
      audienceId,
      firstName,
      lastName,
      unsubscribed: false,
    });
    return;
  } catch {
    await resend.contacts.update({
      email: normalized,
      audienceId,
      firstName,
      lastName,
      unsubscribed: false,
    });
  }
}

export async function addToSegmentSafe(resend: Resend, email: string, segmentId: string) {
  if (!segmentId) return;
  await resend.contacts.segments.add({ email: normalizeEmail(email), segmentId });
}

export async function runResendSafe<T>(run: () => Promise<T>) {
  try {
    const data = await run();
    return { ok: true as const, data };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Unknown resend error",
    };
  }
}
