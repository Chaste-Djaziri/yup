import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Webhook secret for verification (you should set this in your environment variables)
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || "your-webhook-secret"

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text()

    // Get the signature from headers
    const signature = request.headers.get("resend-signature")

    // Verify the webhook signature (optional but recommended for security)
    // You can implement signature verification here if needed

    // Parse the webhook payload
    const event = JSON.parse(body)

    console.log("Received webhook event:", event)

    // Handle different event types
    switch (event.type) {
      case "email.sent":
        await handleEmailSent(event.data)
        break
      case "email.delivered":
        await handleEmailDelivered(event.data)
        break
      case "email.delivery_delayed":
        await handleEmailDelayed(event.data)
        break
      case "email.complained":
        await handleEmailComplained(event.data)
        break
      case "email.bounced":
        await handleEmailBounced(event.data)
        break
      case "email.opened":
        await handleEmailOpened(event.data)
        break
      case "email.clicked":
        await handleEmailClicked(event.data)
        break
      default:
        console.log("Unhandled event type:", event.type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleEmailSent(data: any) {
  try {
    // Log email sent event
    await supabase.from("email_logs").insert([
      {
        email_id: data.email_id,
        to_email: data.to[0],
        subject: data.subject,
        status: "sent",
        event_type: "sent",
        created_at: new Date().toISOString(),
        metadata: data,
      },
    ])

    console.log("Email sent:", data.email_id)
  } catch (error) {
    console.error("Error logging email sent:", error)
  }
}

async function handleEmailDelivered(data: any) {
  try {
    // Update email status to delivered
    await supabase
      .from("email_logs")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("email_id", data.email_id)

    console.log("Email delivered:", data.email_id)
  } catch (error) {
    console.error("Error updating email delivered:", error)
  }
}

async function handleEmailDelayed(data: any) {
  try {
    // Update email status to delayed
    await supabase
      .from("email_logs")
      .update({
        status: "delayed",
        metadata: data,
      })
      .eq("email_id", data.email_id)

    console.log("Email delayed:", data.email_id)
  } catch (error) {
    console.error("Error updating email delayed:", error)
  }
}

async function handleEmailComplained(data: any) {
  try {
    // Update email status to complained (spam)
    await supabase
      .from("email_logs")
      .update({
        status: "complained",
        metadata: data,
      })
      .eq("email_id", data.email_id)

    console.log("Email complained:", data.email_id)
  } catch (error) {
    console.error("Error updating email complained:", error)
  }
}

async function handleEmailBounced(data: any) {
  try {
    // Update email status to bounced
    await supabase
      .from("email_logs")
      .update({
        status: "bounced",
        bounce_reason: data.reason,
        metadata: data,
      })
      .eq("email_id", data.email_id)

    console.log("Email bounced:", data.email_id)
  } catch (error) {
    console.error("Error updating email bounced:", error)
  }
}

async function handleEmailOpened(data: any) {
  try {
    // Log email opened event
    await supabase
      .from("email_logs")
      .update({
        opened_at: new Date().toISOString(),
        open_count: supabase.raw("COALESCE(open_count, 0) + 1"),
      })
      .eq("email_id", data.email_id)

    console.log("Email opened:", data.email_id)
  } catch (error) {
    console.error("Error updating email opened:", error)
  }
}

async function handleEmailClicked(data: any) {
  try {
    // Log email clicked event
    await supabase
      .from("email_logs")
      .update({
        clicked_at: new Date().toISOString(),
        click_count: supabase.raw("COALESCE(click_count, 0) + 1"),
        metadata: data,
      })
      .eq("email_id", data.email_id)

    console.log("Email clicked:", data.email_id)
  } catch (error) {
    console.error("Error updating email clicked:", error)
  }
}
