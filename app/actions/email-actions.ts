"use server"

import { Resend } from "resend"

// Initialize Resend with your API key
const resend = new Resend("re_2gZ9zAcP_K84t1o17rCjxjzLHTYQBAy5u")

type EmailParams = {
  to: string
  firstName: string
  lastName: string
  status: string
  opportunity: string
}

export async function sendVolunteerEmail(params: EmailParams) {
  try {
    const { to, firstName, lastName, status, opportunity } = params

    // Determine email subject and content based on status
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

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Youth Uplift Initiative <noreply@youthupliftinitiative.com>",
      to: [to],
      subject: subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in sendVolunteerEmail:", error)
    return { success: false, error: "An unexpected error occurred while sending the email" }
  }
}
