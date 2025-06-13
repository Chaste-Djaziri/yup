"use server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { isEmailBlocked } from "./admin-actions"
import { sendContactEmail } from "./email-actions"

export type SubmissionResult = {
  success: boolean
  message: string
}

export async function submitContactForm(prevState: any, formData: FormData): Promise<SubmissionResult> {
  try {
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return {
        success: false,
        message: "All fields are required.",
      }
    }

    // Check if email is blocked
    const blockedCheck = await isEmailBlocked(email)
    if (blockedCheck.isBlocked) {
      return {
        success: false,
        message: "This email address has been blocked from submitting forms.",
      }
    }

    // Insert data into Supabase
    const supabase = createServerSupabaseClient()
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

    // Send notification email to admin
    await sendContactEmail(email, subject, message)

    // Revalidate the contact page
    revalidatePath("/contact")

    return {
      success: true,
      message: "Your message has been sent successfully! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
