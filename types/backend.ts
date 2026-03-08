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

export type EmailLog = {
  id: string;
  event_type: string;
  recipient_email: string | null;
  subject: string | null;
  status: string;
  created_at: string;
};
