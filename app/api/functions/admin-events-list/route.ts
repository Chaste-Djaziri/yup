import { getServiceClient, requireAuth } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function GET() {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.from("events").select("*").eq("status", "published").order("event_start", { ascending: true });
    if (error) throw error;
    return json({ events: data ?? [] });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(req.headers.get("Authorization") || undefined);
    const supabase = getServiceClient();
    const { data, error } = await supabase.from("events").select("*").order("event_start", { ascending: true });
    if (error) throw error;
    return json({ events: data ?? [] });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
