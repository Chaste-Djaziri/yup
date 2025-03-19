"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/utils/translation-utils"

interface NewsletterSignupProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterSignup({ isOpen, onClose }: NewsletterSignupProps) {
  const { language } = useLanguage()

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <Modal
        title={getTranslation(language, "newsletter.thankYou.title", "Thank You for Subscribing!")}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium">
            {getTranslation(language, "newsletter.thankYou.message", "You're now subscribed!")}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {getTranslation(
              language,
              "newsletter.thankYou.description",
              "You'll receive updates on our work and upcoming events.",
            )}
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
      title={getTranslation(language, "newsletter.title", "Subscribe to Our Newsletter")}
      description={getTranslation(
        language,
        "newsletter.description",
        "Stay up-to-date with our latest news, events, and impact stories.",
      )}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder={getTranslation(language, "newsletter.placeholder", "your@email.com")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {getTranslation(language, "newsletter.cancelButton", "Cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? getTranslation(language, "newsletter.subscribingButton", "Subscribing...")
              : getTranslation(language, "newsletter.subscribeButton", "Subscribe")}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

