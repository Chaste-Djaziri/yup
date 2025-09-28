"use client"

import { CreditCard, Smartphone } from "lucide-react"
import Image from "next/image"

export function PayPalIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image src="/paypal-icon.png" alt="PayPal" width={20} height={20} />
    </div>
  )
}

export function StripeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image src="/stripe-icon.png" alt="Stripe" width={20} height={20} />
    </div>
  )
}

export function CardIcon({ className = "h-5 w-5 text-primary" }: { className?: string }) {
  return <CreditCard className={className} />
}

export function MomoIcon({ className = "h-5 w-5 text-primary" }: { className?: string }) {
  return <Smartphone className={className} />
}
