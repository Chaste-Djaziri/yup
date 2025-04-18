"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import { ContactMap } from "@/components/contact-map"
import { submitContactForm } from "../actions/contact-actions"
import { toast } from "@/components/ui/use-toast"

// Submit button with loading state
function SubmitButton({ text, loadingText }: { text: string; loadingText: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={pending}>
      {pending ? loadingText : text}
    </Button>
  )
}

export default function ContactPage() {
  const { language } = useLanguage()
  const t = dictionaries[language]
  const [isSubmitted, setIsSubmitted] = useState(false)

  const initialState = { success: false, message: "" }
  const [formState, formAction, isPending] = useActionState(submitContactForm, initialState)

  // Handle form submission result
  useEffect(() => {
    if (formState && formState.message) {
      if (formState.success) {
        setIsSubmitted(true)
      } else {
        toast({
          title: "Error",
          description: formState.message,
          variant: "destructive",
        })
      }
    }
  }, [formState])

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader title={t.contact.title} description={t.contact.description} backgroundImage="/assets/donation1.jpg" />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t.contact.form.title}</h2>
              <p className="text-gray-500 md:text-lg">{t.contact.form.description}</p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    {t.contact.form.successTitle || "Message Sent!"}
                  </h3>
                  <p className="text-green-600">{formState.message}</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm sm:text-base">
                        {t.contact.form.firstName}
                      </Label>
                      <Input id="first-name" name="first-name" required className="text-sm sm:text-base h-10 sm:h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm sm:text-base">
                        {t.contact.form.lastName}
                      </Label>
                      <Input id="last-name" name="last-name" required className="text-sm sm:text-base h-10 sm:h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.contact.form.email}</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t.contact.form.subject}</Label>
                    <Input id="subject" name="subject" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t.contact.form.message}</Label>
                    <Textarea id="message" name="message" rows={5} required />
                  </div>

                  {formState && !formState.success && formState.message && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                      {formState.message}
                    </div>
                  )}

                  <SubmitButton
                    text={t.contact.form.submitButton}
                    loadingText={t.contact.form.submittingButton || "Submitting..."}
                  />
                </form>
              )}
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <h3 className="text-xl font-bold mb-4">{t.contact.info.title}</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t.contact.info.address.title}</h4>
                      <p className="text-gray-500">{t.contact.info.address.line1}</p>
                      <p className="text-gray-500">{t.contact.info.address.line2}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t.contact.info.email.title}</h4>
                      <p className="text-gray-500">{t.contact.info.email.general}</p>
                      <p className="text-gray-500">{t.contact.info.email.support}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t.contact.info.phone.title}</h4>
                      <p className="text-gray-500">{t.contact.info.phone.office}</p>
                      <p className="text-gray-500">{t.contact.info.phone.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t.contact.info.hours.title}</h4>
                      <p className="text-gray-500">{t.contact.info.hours.weekdays}</p>
                      <p className="text-gray-500">{t.contact.info.hours.weekends}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <ContactMap />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.contact.faq.title}</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.contact.faq.description}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
              {t.contact.faq.questions.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-500 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

