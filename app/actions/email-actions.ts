// app/actions/email-actions.ts

"use server"

import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

// Initialize Resend with your API key
const resend = new Resend("re_2gZ9zAcP_K84t1o17rCjxjzLHTYQBAy5u")

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

type EmailParams = {
  applicationId: string // add applicationId for tracking
  to: string
  firstName: string
  lastName: string
  status: string
  opportunity: string
}

export async function sendVolunteerEmail(params: EmailParams) {
  try {
    const { applicationId, to, firstName, lastName, status, opportunity } = params

    // 1. Check if email already sent for this applicationId
    const { data: existingEmails, error: checkError } = await supabase
      .from("email_logs")
      .select("*")
      .eq("application_id", applicationId)
      .eq("status", "sent")

    if (checkError) {
      console.error("Error checking existing emails:", checkError)
      // You can decide to continue or stop here depending on your policy
    }

    if (existingEmails && existingEmails.length > 0) {
      console.log("Email already sent for this application. Skipping send.")
      return { success: false, message: "Email already sent for this application." }
    }

    // 2. Insert a pending email log to prevent duplicates in concurrent requests
    const { error: insertError } = await supabase.from("email_logs").insert([
      {
        application_id: applicationId,
        to_email: to,
        subject: "", // can fill later after composing email
        status: "pending",
        event_type: "pending",
        created_at: new Date().toISOString(),
      },
    ])

    if (insertError) {
      console.error("Failed to insert pending email log:", insertError)
      return { success: false, error: insertError.message }
    }

    // 3. Compose subject and HTML content based on status
    let subject = ""
    let htmlContent = ""

    if (status === "accepted") {
      subject = "Your Volunteer Application Has Been Accepted"
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Application Accepted</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>We are pleased to inform you that your application to volunteer for <strong>${opportunity}</strong> has been accepted!</p>
          <p>We appreciate your interest in contributing to our mission and look forward to working with you.</p>
          <p>Our team will be in touch shortly with more details about the next steps.</p>
          <p>Thank you for your commitment to making a difference.</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `
    } else if (status === "rejected") {
      subject = "Update on Your Volunteer Application"
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F44336;">Application Status Update</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for your interest in volunteering with us for <strong>${opportunity}</strong>.</p>
          <p>After careful consideration, we regret to inform you that we are unable to move forward with your application at this time.</p>
          <p>We encourage you to apply for future opportunities that match your skills and interests.</p>
          <p>We appreciate your understanding and wish you the best in your future endeavors.</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `
    } else {
      subject = "Update on Your Volunteer Application"
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2196F3;">Application Status Update</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for your application to volunteer for <strong>${opportunity}</strong>.</p>
          <p>Your application status has been updated to: <strong>${status}</strong>.</p>
          <p>We appreciate your interest in our organization and will keep you updated on any further developments.</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `
    }

    // 4. Update the pending email log with subject before sending
    await supabase
      .from("email_logs")
      .update({ subject })
      .eq("application_id", applicationId)
      .eq("status", "pending")

    // 5. Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Youth Uplift Initiative <noreply@youthupliftinitiative.com>",
      to: [to],
      subject: subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML tags for plain text
    })

    if (error) {
      console.error("Error sending email:", error)
      // Update email_logs to failed
      await supabase
        .from("email_logs")
        .update({ status: "failed" })
        .eq("application_id", applicationId)
      return { success: false, error: error.message }
    }

    // 6. Update email_logs record to sent with email_id from Resend response
    await supabase
      .from("email_logs")
      .update({ status: "sent", email_id: data.id, sent_at: new Date().toISOString() })
      .eq("application_id", applicationId)

    return { success: true, data }
  } catch (error) {
    console.error("Error in sendVolunteerEmail:", error)
    return { success: false, error: "An unexpected error occurred while sending the email" }
  }
}
