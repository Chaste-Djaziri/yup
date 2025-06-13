import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// Export a default function for easier imports
export default function defaultCreateClient() {
  return createServerSupabaseClient()
}
