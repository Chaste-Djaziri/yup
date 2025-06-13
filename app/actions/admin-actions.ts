"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Initialize Supabase client (server-side) with service role key
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Blocked emails table
export async function createBlockedEmailsTable() {
  const { error } = await supabase.rpc("create_blocked_emails_table_if_not_exists")
  return { success: !error, error: error?.message }
}

// Contact submissions actions
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

export async function updateContactStatus(id: string, status: string) {
  try {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating contact status:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in updateContactStatus:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    console.log("Attempting to delete contact submission with ID:", id)
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting contact submission:", error)
      return { success: false, error: error.message }
    }

    console.log("Successfully deleted contact submission with ID:", id)
    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteContactSubmission:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Volunteer applications actions
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

export async function getAcceptedMembers() {
  try {
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select("*")
      .eq("status", "accepted")
      .order("last_name", { ascending: true })

    if (error) {
      console.error("Error fetching accepted members:", error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in getAcceptedMembers:", error)
    return { success: false, data: [], error: "An unexpected error occurred" }
  }
}

export async function updateVolunteerStatus(id: string, status: string) {
  try {
    const { error } = await supabase.from("volunteer_applications").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating volunteer status:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in updateVolunteerStatus:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// New function to update volunteer application fields
export async function updateVolunteerFields(id: string, fields: {
  country?: string;
  phone?: string;
  skills?: string;
  opportunity?: string;
  availability?: string;
  [key: string]: any;
}) {
  try {
    console.log("Updating volunteer application fields for ID:", id, "Fields:", fields)
    
    // Filter out undefined values
    const filteredFields = Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => value !== undefined)
    )
    
    if (Object.keys(filteredFields).length === 0) {
      return { success: false, error: "No fields to update" }
    }
    
    // Add updated_at timestamp
    filteredFields.updated_at = new Date().toISOString()
    
    const { error } = await supabase
      .from("volunteer_applications")
      .update(filteredFields)
      .eq("id", id)

    if (error) {
      console.error("Error updating volunteer fields:", error)
      return { success: false, error: error.message }
    }

    console.log("Successfully updated volunteer application fields for ID:", id)
    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in updateVolunteerFields:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteVolunteerApplication(id: string) {
  try {
    console.log("Attempting to delete volunteer application with ID:", id)
    const { error } = await supabase.from("volunteer_applications").delete().eq("id", id)

    if (error) {
      console.error("Error deleting volunteer application:", error)
      return { success: false, error: error.message }
    }

    console.log("Successfully deleted volunteer application with ID:", id)
    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteVolunteerApplication:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Email logs actions
export async function createEmailLog({
  recipient,
  subject,
  status,
  error,
}: {
  recipient: string
  subject: string
  status: string
  error: string | null
}) {
  try {
    const { error: dbError } = await supabase.from("email_logs").insert([
      {
        recipient,
        subject,
        status,
        error,
        sent_at: new Date().toISOString(),
      },
    ])

    if (dbError) {
      console.error("Error creating email log:", dbError)
      return { success: false, error: dbError.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in createEmailLog:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getEmailLogs() {
  try {
    const { data, error } = await supabase.from("email_logs").select("*").order("sent_at", { ascending: false })

    if (error) {
      console.error("Error fetching email logs:", error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in getEmailLogs:", error)
    return { success: false, data: [], error: "An unexpected error occurred" }
  }
}

// Blocked emails actions
export async function getBlockedEmails() {
  try {
    // First, create the table if it doesn't exist
    await createBlockedEmailsTable()

    const { data, error } = await supabase.from("blocked_emails").select("*").order("blocked_at", { ascending: false })

    if (error) {
      console.error("Error fetching blocked emails:", error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in getBlockedEmails:", error)
    return { success: false, data: [], error: "An unexpected error occurred" }
  }
}

export async function blockEmail(email: string, reason: string) {
  try {
    // First, create the table if it doesn't exist
    await createBlockedEmailsTable()

    const { error } = await supabase.from("blocked_emails").insert([
      {
        email: email.toLowerCase(),
        reason,
        blocked_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error blocking email:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in blockEmail:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function unblockEmail(id: string) {
  try {
    const { error } = await supabase.from("blocked_emails").delete().eq("id", id)

    if (error) {
      console.error("Error unblocking email:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin-dashboard-x7z9q5")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in unblockEmail:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function isEmailBlocked(email: string) {
  try {
    const { data, error } = await supabase.from("blocked_emails").select("*").eq("email", email.toLowerCase()).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking if email is blocked:", error)
      return { success: false, isBlocked: false, error: error.message }
    }

    return { success: true, isBlocked: !!data, error: null }
  } catch (error) {
    console.error("Error in isEmailBlocked:", error)
    return { success: false, isBlocked: false, error: "An unexpected error occurred" }
  }
}

// Admin authentication - we'll keep these for the login/logout functionality
// but they won't be used for the actual admin actions
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string

  // Check if password matches the environment variable
  if (password === process.env.ADMIN_PASSWORD) {
    // Set a cookie to indicate the user is authenticated
    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    redirect("/admin-dashboard-x7z9q5")
  }

  return { error: "Invalid password" }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_authenticated")
  redirect("/")
}
