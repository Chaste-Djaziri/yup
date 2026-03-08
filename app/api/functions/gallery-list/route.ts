import { getServiceClient } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function GET() {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return json({ images: data ?? [] });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
