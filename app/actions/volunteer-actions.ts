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

export async function submitVolunteerApplication(prevState: any, formData: FormData): Promise<SubmissionResult> {
  try {
    // Extract form data
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const opportunity = formData.get("opportunity") as string
    const availability = formData.get("availability") as string
    const skills = formData.get("skills") as string
    const motivation = formData.get("motivation") as string
    const terms = formData.has("terms")

    // Debug log
    console.log("Form data received:", {
      firstName,
      lastName,
      email,
      phone,
      opportunity,
      availability,
      skills,
      motivation,
      terms,
    })

    // Validate form data
    if (!firstName || !lastName || !email || !motivation) {
      return {
        success: false,
        message: `Required fields are missing: ${!firstName ? "First Name, " : ""}${!lastName ? "Last Name, " : ""}${!email ? "Email, " : ""}${!motivation ? "Motivation" : ""}`,
      }
    }

    if (!terms) {
      return {
        success: false,
        message: "You must agree to the terms",
      }
    }

    // Insert data into Supabase
    const { error } = await supabase.from("volunteer_applications").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        opportunity: opportunity || null,
        availability: availability || null,
        skills: skills || null,
        motivation,
        terms,
        status: "new",
      },
    ])

    if (error) {
      console.error("Error submitting volunteer application:", error)
      return {
        success: false,
        message: "Failed to submit application. Please try again later.",
      }
    }

    // Revalidate the volunteer page
    revalidatePath("/volunteer")

    return {
      success: true,
      message: "Your application has been submitted successfully!",
    }
  } catch (error) {
    console.error("Error in submitVolunteerApplication:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
