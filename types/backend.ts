export type DbEvent = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  event_start: string;
  event_end: string | null;
  image_url: string | null;
  cloudinary_public_id: string | null;
  registration_url: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  admin_reply?: string | null;
  created_at: string;
};

export type VolunteerApplication = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  opportunity?: string | null;
  motivation: string;
  status: "new" | "in_review" | "accepted" | "rejected" | "archived";
  admin_reply?: string | null;
  created_at: string;
};

export type PartnerSubmission = {
  id: string;
  full_name: string;
  email: string;
  organization_name: string;
  partner_type: string;
  partnership_goal: string;
  message: string;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  status: "new" | "in_progress" | "resolved" | "archived";
  admin_reply?: string | null;
  replied_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailLog = {
  id: string;
  event_type: string;
  recipient_email: string | null;
  subject: string | null;
  status: string;
  provider_message_id?: string | null;
  payload?: Record<string, unknown> | null;
  created_at: string;
};

export type AdminBroadcastTarget = "community" | "non_community" | "both";

export type AdminBroadcastResult = {
  target: "community" | "non_community";
  broadcastId: string | null;
  status: "sent" | "failed";
  error?: string | null;
};

export type DbGalleryImage = {
  id: string;
  title: string;
  category: "events" | "programs" | "community";
  image_url: string;
  cloudinary_public_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type DbGalleryGroup = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string;
  cover_cloudinary_public_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  photo_count?: number;
};

export type DbGalleryGroupPhoto = {
  id: string;
  group_id: string;
  title: string | null;
  image_url: string;
  cloudinary_public_id: string | null;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type DbProgram = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  description: string | null;
  outcomes: string[];
  cover_image_url: string | null;
  cover_cloudinary_public_id: string | null;
  cta_label: string;
  sort_order: number;
  status: "draft" | "published" | "archived";
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
