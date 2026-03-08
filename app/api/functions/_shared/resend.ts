import { Resend } from "resend";

const truthy = new Set(["1", "true", "yes", "on"]);
const SENDER_DOMAIN = "support.yupinitiative.com";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RESEND_API_BASE_URL = "https://api.resend.com";
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_RESEND_RETRIES = 3;

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

const getResendApiKey = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is missing");
  return apiKey;
};

type ResendApiResult = {
  ok: boolean;
  status: number;
  body: any;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryDelayMs = (status: number, attempt: number) => {
  if (status === 429) return 1100 * attempt;
  return 350 * attempt;
};

const callResendApi = async (path: string, init: RequestInit): Promise<ResendApiResult> => {
  for (let attempt = 1; attempt <= MAX_RESEND_RETRIES; attempt += 1) {
    const response = await fetch(`${RESEND_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${getResendApiKey()}`,
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

    if (!response.ok && RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RESEND_RETRIES) {
      await wait(retryDelayMs(response.status, attempt));
      continue;
    }

    return { ok: response.ok, status: response.status, body };
  }

  return {
    ok: false,
    status: 599,
    body: { message: "Resend request failed after retries" },
  };
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

export async function createOrUpdateContactByEmail(email: string, firstName?: string, lastName?: string) {
  const normalizedEmail = normalizeEmail(email);
  const payload: Record<string, unknown> = {
    email: normalizedEmail,
    unsubscribed: false,
  };

  if (firstName) payload.first_name = firstName;
  if (lastName) payload.last_name = lastName;

  const created = await callResendApi("/contacts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (created.ok) return { status: "created" as const };
  if (created.status === 409) return { status: "existing" as const };

  const errorText = String(created.body?.message || created.body?.name || "");
  if (errorText.toLowerCase().includes("already exists")) {
    return { status: "existing" as const };
  }

  const updated = await callResendApi(`/contacts/${encodeURIComponent(normalizedEmail)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (updated.ok) return { status: "updated" as const };

  throw new Error(
    `Resend contact sync failed: ${created.body?.message || created.body?.name || created.status} / ${
      updated.body?.message || updated.body?.name || updated.status
    }`,
  );
}

export async function addContactEmailToSegment(email: string, segmentId: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!segmentId) {
    return { status: "skipped" as const, reason: "missing_segment_id" };
  }

  if (!UUID_REGEX.test(segmentId)) {
    return { status: "skipped" as const, reason: "invalid_segment_id" };
  }

  const added = await callResendApi(
    `/contacts/${encodeURIComponent(normalizedEmail)}/segments/${segmentId}`,
    { method: "POST" },
  );

  if (added.ok) return { status: "added" as const };

  throw new Error(`Resend segment add failed: ${added.body?.message || added.body?.name || added.status}`);
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
