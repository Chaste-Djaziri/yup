// path: /app/utils/email.ts
"use server";

import { Resend } from "resend";
import { createEmailLog } from "@/app/actions/admin-actions";

const resend = new Resend(process.env.RESEND_API_KEY);

type VolunteerEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  status: string;
  opportunity: string;
  country?: string;
  missingFields?: string;
};

export async function sendVolunteerEmail({
  to,
  firstName,
  lastName,
  status,
  opportunity,
  missingFields,
  country,
}: VolunteerEmailParams) {
  try {
    let subject = "";
    let htmlContent = "";

    if (status === "info-request") {
      subject = "Additional Information Needed for Your Volunteer Application";
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${firstName} ${lastName},</h2>
          <p>Thank you for your interest in volunteering with Youth Uplift Initiative.</p>
          <p>We're reviewing your application for the <strong>${opportunity}</strong> position, but we need some additional information to complete your application:</p>
          <ul>
            ${missingFields
              ?.split(", ")
              .map(
                (field) =>
                  `<li>${field.charAt(0).toUpperCase() + field.slice(1)}</li>`
              )
              .join("")}
          </ul>
          <p>Please reply to this email with the requested information at your earliest convenience.</p>
          <p>Thank you for your cooperation!</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `;
    } else if (status === "accepted") {
      const currencyConversions: Record<
        string,
        { currency: string; symbol: string; rate: number }
      > = {
        Rwanda: { currency: "RWF", symbol: "RWF", rate: 1 },
        Uganda: { currency: "UGX", symbol: "UGX", rate: 25 },
        Kenya: { currency: "KES", symbol: "KSh", rate: 8 },
        Tanzania: { currency: "TZS", symbol: "TSh", rate: 16 },
        Burundi: { currency: "BIF", symbol: "BIF", rate: 14 },
        "Democratic Republic of Congo": {
          currency: "CDF",
          symbol: "FC",
          rate: 140,
        },
        "South Sudan": { currency: "SSP", symbol: "SSP", rate: 9 },
        "United States": { currency: "USD", symbol: "$", rate: 0.0085 },
        "United Kingdom": { currency: "GBP", symbol: "£", rate: 0.0067 },
        Canada: { currency: "CAD", symbol: "C$", rate: 0.012 },
        France: { currency: "EUR", symbol: "€", rate: 0.0078 },
        Germany: { currency: "EUR", symbol: "€", rate: 0.0078 },
      };

      const countryInfo = currencyConversions[country || ""] || {
        currency: "USD",
        symbol: "$",
        rate: 0.0085,
      };

      const rwfAmount = 12000;
      const localAmount = Math.round(rwfAmount * countryInfo.rate);
      const formattedLocalAmount = localAmount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const formattedRwfAmount = rwfAmount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      subject = "Congratulations! Your Volunteer Application Has Been Accepted";
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${firstName} ${lastName},</h2>
          <p>We are pleased to inform you that your application to volunteer with Youth Uplift Initiative has been <strong>accepted</strong>!</p>
          <p>We're excited to have you join our team for the <strong>${opportunity}</strong> position.</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #4c1d95; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4c1d95;">Next Steps</h3>
            <p>As part of joining our team, all members receive a YUP t-shirt. There is a membership fee of <strong>${formattedRwfAmount} RWF</strong> (approximately <strong>${countryInfo.symbol}${formattedLocalAmount} ${countryInfo.currency}</strong> in your local currency) to cover the cost of the t-shirt and membership materials.</p>
            <p>Payment details will be provided by our volunteer coordinator during your orientation.</p>
          </div>

          <p>To stay updated and connect with fellow volunteers, please join our official WhatsApp group here: 
            <a href="https://chat.whatsapp.com/HTLozMKdQCmC1H5fJ3INK7?mode=ac_t" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: bold;">
              Join WhatsApp Group
            </a>
          </p>
          
          <p>Our volunteer coordinator will be in touch with you shortly to discuss next steps and provide you with more information about orientation and your volunteer schedule.</p>
          <p>Thank you for your willingness to contribute to our mission of empowering youth in Rwanda.</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `;
    } else if (status === "rejected") {
      subject = "Update on Your Volunteer Application";
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${firstName} ${lastName},</h2>
          <p>Thank you for your interest in volunteering with Youth Uplift Initiative and for taking the time to apply for the <strong>${opportunity}</strong> position.</p>
          <p>After careful consideration, we regret to inform you that we are unable to accept your application at this time.</p>
          <p>We encourage you to apply for future volunteer opportunities that match your skills and interests.</p>
          <p>Thank you again for your interest in supporting our mission.</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `;
    } else {
      subject = "Update on Your Volunteer Application";
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${firstName} ${lastName},</h2>
          <p>Thank you for your interest in volunteering with Youth Uplift Initiative.</p>
          <p>This is an update regarding your application for the <strong>${opportunity}</strong> position.</p>
          <p>Your application status has been updated to: <strong>${status}</strong>.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Youth Uplift Initiative Team</p>
        </div>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: "Youth Uplift Initiative <noreply@yupinitiative.com>",
      to: [to],
      subject,
      html: htmlContent,
    });

    await createEmailLog({
      recipient: to,
      subject,
      status: error ? "failed" : "sent",
      error: error ? JSON.stringify(error) : null,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendVolunteerEmail:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function sendContactEmail(
  to: string,
  subject: string,
  message: string
) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${to}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Youth Uplift Initiative <noreply@yupinitiative.com>",
      to: ["chastedjaziri@gmail.com"],
      replyTo: to,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });

    await createEmailLog({
      recipient: "chastedjaziri@gmail.com",
      subject: `Contact Form: ${subject}`,
      status: error ? "failed" : "sent",
      error: error ? JSON.stringify(error) : null,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendContactEmail:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function sendDailyCountdownEmail() {
  try {
    const today = new Date();
    const targetDate = new Date("2026-01-01T00:00:00");
    const timeRemaining = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center; padding: 20px;">
        <h2>Youth Uplift Initiative - Daily Countdown</h2>
        <div style="font-size: 24px; font-weight: bold; margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <p>Days remaining until 2026:</p>
          <p style="font-size: 48px; color: #2563eb;">${daysRemaining}</p>
        </div>
        <p>This is your daily reminder of the countdown to 2026.</p>
        <p>Keep up the great work with Youth Uplift Initiative!</p>
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Youth Uplift Initiative <noreply@yupinitiative.com>",
      to: ["chastedjaziri@gmail.com"],
      subject: `Daily Countdown: ${daysRemaining} Days Until 2026`,
      html: htmlContent,
    });

    await createEmailLog({
      recipient: "chastedjaziri@gmail.com",
      subject: `Daily Countdown: ${daysRemaining} Days Until 2026`,
      status: error ? "failed" : "sent",
      error: error ? JSON.stringify(error) : null,
    });

    if (error) {
      console.error("Error sending countdown email:", error);
      return { success: false, error: "Failed to send countdown email" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendDailyCountdownEmail:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
