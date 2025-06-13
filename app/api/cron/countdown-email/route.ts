import { NextResponse } from 'next/server'
import { sendDailyCountdownEmail } from '@/app/actions/email-actions'

// This endpoint will be triggered by a cron job daily
export async function GET() {
  try {
    const result = await sendDailyCountdownEmail()
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Daily countdown email sent successfully' })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send countdown email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in countdown email cron job:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
