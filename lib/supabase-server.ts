import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anon = process.env.SUPABASE_ANON_KEY!;

export const getServiceClient = () =>
  createClient(supabaseUrl, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

export const getAnonClient = (authHeader?: string) =>
  createClient(supabaseUrl, anon, {
    global: authHeader
      ? {
          headers: { Authorization: authHeader },
        }
      : undefined,
    auth: { autoRefreshToken: false, persistSession: false },
  });

export async function requireAuth(authHeader?: string) {
  if (!authHeader) throw new Error("Missing Authorization header");
  const client = getAnonClient(authHeader);
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error("Unauthorized");
  return data.user;
}
