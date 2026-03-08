import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    await requireAuth(req.headers.get("Authorization") || undefined);
    const supabase = getServiceClient();
    const { data, error } = await supabase.from("partner_submissions").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return json({ partners: data ?? [] });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
