"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export type SubmissionResult = {
  success: boolean
  message: string
  isSubmitting?: boolean
}

export async function submitVolunteerApplication(prevState: any, formData: FormData): Promise<SubmissionResult> {
  try {
    // Set isSubmitting state immediately
    if (prevState && !prevState.isSubmitting) {
      return { ...prevState, isSubmitting: true }
    }

    // Extract form data
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const country = formData.get("country") as string
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
      country,
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
        isSubmitting: false,
      }
    }

    if (!terms) {
      return {
        success: false,
        message: "You must agree to the terms",
        isSubmitting: false,
      }
    }

    const supabase = createServerSupabaseClient()

    // Check if this email has already submitted an application recently
    const { data: existingApplications, error: checkError } = await supabase
      .from("volunteer_applications")
      .select("id, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)

    if (checkError) {
      console.error("Error checking for existing applications:", checkError)
    } else if (existingApplications && existingApplications.length > 0) {
      // Check if the most recent application is less than 24 hours old
      const lastApplication = new Date(existingApplications[0].created_at)
      const now = new Date()
      const hoursSinceLastApplication = (now.getTime() - lastApplication.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastApplication < 24) {
        console.log(`Duplicate submission detected for ${email}, but proceeding as requested`)
      }
    }

    // Insert data into Supabase
    const { error } = await supabase.from("volunteer_applications").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        country: country || null,
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
        isSubmitting: false,
      }
    }

    // Revalidate the volunteer page
    revalidatePath("/volunteer")

    return {
      success: true,
      message: "Your application has been submitted successfully!",
      isSubmitting: false,
    }
  } catch (error) {
    console.error("Error in submitVolunteerApplication:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      isSubmitting: false,
    }
  }
}
