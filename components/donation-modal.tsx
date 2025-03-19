"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Modal } from "@/components/ui/modal"
import { Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation, getTranslationArray } from "@/utils/translation-utils"
import Image from "next/image"
import { motion } from "framer-motion"
import { PayPalIcon, StripeIcon, CardIcon, MomoIcon } from "@/components/payment-icons"
import { useTheme } from "next-themes"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const [donationAmount, setDonationAmount] = useState<string>("50")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isDark = theme === "dark"

  const handleDonationChange = (value: string) => {
    setDonationAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  // Default amount options if translations are missing
  const defaultAmountOptions = [
    { value: "25", label: "$25" },
    { value: "50", label: "$50" },
    { value: "100", label: "$100" },
    { value: "250", label: "$250" },
    { value: "500", label: "$500" },
    { value: "custom", label: "Custom" },
  ]

  const amountOptions = getTranslationArray(language, "donate.form.amountOptions", defaultAmountOptions)

  if (isSubmitted) {
    return (
      <Modal
        title={getTranslation(language, "donate.form.thankYou.title", "Thank You for Your Donation!")}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium">
            {getTranslation(language, "donate.form.thankYou.message", "Your donation makes a difference!")}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {getTranslation(language, "donate.form.thankYou.description", "Thank you for supporting our mission.")}
          </p>
          <Button onClick={onClose} className="mt-6">
            {getTranslation(language, "newsletter.thankYou.closeButton", "Close")}
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title={getTranslation(language, "donate.form.title", "Donate Now")}
      description={getTranslation(language, "donate.form.description", "Choose an amount to donate.")}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md sm:max-w-lg md:max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Select Donation Amount</Label>
          <RadioGroup defaultValue="50" onValueChange={handleDonationChange}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {amountOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`modal-r${index + 1}`} />
                  <Label htmlFor={`modal-r${index + 1}`} className="text-sm sm:text-base">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {donationAmount === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="modal-custom-amount">
              {getTranslation(language, "donate.form.customAmount", "Enter amount ($)")}
            </Label>
            <Input
              id="modal-custom-amount"
              type="number"
              placeholder={getTranslation(language, "donate.form.customAmount", "Enter amount ($)")}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min="1"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-y-2 sm:gap-y-0">
              <TabsTrigger value="card" className="flex flex-col items-center gap-1 py-2 sm:py-3">
                <CardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs">{getTranslation(language, "donate.form.payment.card", "Card")}</span>
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex flex-col items-center gap-1 py-2 sm:py-3">
                <PayPalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs">{getTranslation(language, "donate.form.payment.paypal", "PayPal")}</span>
              </TabsTrigger>
              <TabsTrigger value="stripe" className="flex flex-col items-center gap-1 py-2 sm:py-3">
                <StripeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs">{getTranslation(language, "donate.form.payment.stripe", "Stripe")}</span>
              </TabsTrigger>
              <TabsTrigger value="momo" className="flex flex-col items-center gap-1 py-2 sm:py-3">
                <MomoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs">{getTranslation(language, "donate.form.payment.momo", "MTN MoMo")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="modal-card-name" className="text-sm sm:text-base">
                  Name on Card
                </Label>
                <Input id="modal-card-name" placeholder="John Doe" required className="text-sm sm:text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-card-number" className="text-sm sm:text-base">
                  Card Number
                </Label>
                <Input
                  id="modal-card-number"
                  placeholder="1234 5678 9012 3456"
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-expiry" className="text-sm sm:text-base">
                    Expiry Date
                  </Label>
                  <Input id="modal-expiry" placeholder="MM/YY" required className="text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-cvc" className="text-sm sm:text-base">
                    CVC
                  </Label>
                  <Input id="modal-cvc" placeholder="123" required className="text-sm sm:text-base" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paypal" className="space-y-4 mt-4">
              <div className="flex justify-center p-4 border rounded-md">
                <Image
                  src={isDark ? "/paypal-button-dark.png" : "/paypal-button.png"}
                  alt="PayPal Checkout"
                  width={200}
                  height={50}
                />
              </div>
              <p className="text-sm text-center text-gray-500">
                You will be redirected to PayPal to complete your donation.
              </p>
            </TabsContent>

            <TabsContent value="stripe" className="space-y-4 mt-4">
              <div className="flex justify-center p-4 border rounded-md">
                <Image
                  src={isDark ? "/stripe-checkout-dark.png" : "/stripe-checkout.png"}
                  alt="Stripe Checkout"
                  width={200}
                  height={50}
                />
              </div>
              <p className="text-sm text-center text-gray-500">
                You will be redirected to Stripe to complete your donation.
              </p>
            </TabsContent>

            <TabsContent value="momo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="modal-phone-number">MTN Mobile Money Number</Label>
                <Input id="modal-phone-number" placeholder="+250 78 123 4567" required />
              </div>
              <p className="text-sm text-gray-500">You will receive a prompt on your phone to confirm the payment.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modal-email">{getTranslation(language, "donate.form.email", "Email")}</Label>
          <Input
            id="modal-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {getTranslation(language, "newsletter.cancelButton", "Cancel")}
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isSubmitting
                ? getTranslation(language, "donate.form.processingButton", "Processing...")
                : getTranslation(language, "donate.form.donateButton", "Donate Now")}{" "}
              <Heart className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {getTranslation(
            language,
            "donate.form.disclaimer",
            "This is a demo. In a real application, you would be redirected to a secure payment processor.",
          )}
        </p>
      </form>
    </Modal>
  )
}

