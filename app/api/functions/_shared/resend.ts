import { Resend } from "resend";

const truthy = new Set(["1", "true", "yes", "on"]);

export const isResendEnabled = () =>
  truthy.has((process.env.RESEND_ENABLED || "true").trim().toLowerCase()) && Boolean(process.env.RESEND_API_KEY);

export const getResend = () => {
  if (!isResendEnabled()) throw new Error("Resend is disabled by RESEND_ENABLED");
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is missing");
  return new Resend(apiKey);
};

export const getResendConfig = () => ({
  from: process.env.RESEND_FROM_EMAIL || "YUP Initiative <noreply@yupinitiative.com>",
  adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "contact.yupinitiative@gmail.com",
  communitySegmentId: process.env.RESEND_COMMUNITY_SEGMENT_ID || "",
  nonCommunitySegmentId: process.env.RESEND_NONE_COMMUNITY_SEGMENT_ID || "",
  audienceId: process.env.RESEND_AUDIENCE_ID || "",
});
