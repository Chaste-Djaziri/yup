import { getServiceClient } from "@/lib/supabase-server";
import type { DbProgram } from "@/types/backend";

const PROGRAM_SELECT =
  "id,slug,title,category,summary,description,outcomes,cover_image_url,cover_cloudinary_public_id,cta_label,sort_order,status,created_by,created_at,updated_at";

export async function getPublishedPrograms(): Promise<DbProgram[]> {
  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("programs")
      .select(PROGRAM_SELECT)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    return (data || []) as DbProgram[];
  } catch {
    return [];
  }
}

export async function getPublishedProgramBySlug(slug: string): Promise<DbProgram | null> {
  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("programs")
      .select(PROGRAM_SELECT)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    return (data as DbProgram | null) ?? null;
  } catch {
    return null;
  }
}
