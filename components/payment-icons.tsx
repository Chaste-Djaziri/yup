"use client"

import { CreditCard, Smartphone } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

export function PayPalIcon({ className = "h-5 w-5" }: { className?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image src={isDark ? "/paypal-icon-light.png" : "/paypal-icon.png"} alt="PayPal" width={20} height={20} />
    </div>
  )
}

export function StripeIcon({ className = "h-5 w-5" }: { className?: string }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image src={isDark ? "/stripe-icon-light.png" : "/stripe-icon.png"} alt="Stripe" width={20} height={20} />
    </div>
  )
}

export function CardIcon({ className = "h-5 w-5 text-primary" }: { className?: string }) {
  return <CreditCard className={className} />
}

export function MomoIcon({ className = "h-5 w-5 text-primary" }: { className?: string }) {
  return <Smartphone className={className} />
}

