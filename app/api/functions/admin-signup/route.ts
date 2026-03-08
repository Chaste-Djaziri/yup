import { getServiceClient } from "@/lib/supabase-server";
import { json } from "../_shared/response";

export async function POST(req: Request) {
  try {
    const allowSignup = (process.env.ALLOW_ADMIN_SIGNUP || "false").toLowerCase() === "true";
    if (!allowSignup) return json({ error: "Signup is disabled" }, 403);

    const body = (await req.json()) as { email: string; password: string };
    if (!body.email || !body.password) throw new Error("email and password are required");

    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.createUser({ email: body.email, password: body.password, email_confirm: true });
    if (error) throw error;
    return json({ user: data.user });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
  }
}
