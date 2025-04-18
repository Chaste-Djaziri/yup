"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function getContactSubmissions() {
  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contact submissions:", error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in getContactSubmissions:", error)
    return { success: false, data: [], error: "An unexpected error occurred" }
  }
}

export async function getVolunteerApplications() {
  try {
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching volunteer applications:", error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in getVolunteerApplications:", error)
    return { success: false, data: [], error: "An unexpected error occurred" }
  }
}

export async function updateContactStatus(id: string, status: string) {
  try {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating contact status:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in updateContactStatus:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateVolunteerStatus(id: string, status: string) {
  try {
    const { error } = await supabase.from("volunteer_applications").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating volunteer status:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in updateVolunteerStatus:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
