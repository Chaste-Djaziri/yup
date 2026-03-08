import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    await requireAuth(req.headers.get("Authorization") || undefined);
    const supabase = getServiceClient();
    const { data, error } = await supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw error;
    return json({ logs: data ?? [] });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
