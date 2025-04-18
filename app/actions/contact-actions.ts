"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type SubmissionResult = {
  success: boolean
  message: string
}

export async function submitContactForm(prevState: any, formData: FormData): Promise<SubmissionResult> {
  try {
    // Extract form data
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate form data
    if (!firstName || !lastName || !email || !subject || !message) {
      return {
        success: false,
        message: "All fields are required",
      }
    }

    // Insert data into Supabase
    const { error } = await supabase.from("contact_submissions").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        subject,
        message,
        status: "new",
      },
    ])

    if (error) {
      console.error("Error submitting contact form:", error)
      return {
        success: false,
        message: "Failed to submit form. Please try again later.",
      }
    }

    // Revalidate the contact page
    revalidatePath("/contact")

    return {
      success: true,
      message: "Your message has been sent successfully!",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
