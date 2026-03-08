import { getServiceClient } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) throw new Error("slug is required");

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return json({ program: data ?? null });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
