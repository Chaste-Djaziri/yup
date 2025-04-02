"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { PayPalIcon, StripeIcon, CardIcon, MomoIcon } from "@/components/payment-icons"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

export function DonateClient() {
  const { language } = useLanguage()
  const t = dictionaries[language] || dictionaries.en // Fallback to English if language context isn't ready
  const isMobile = useMobile()

  const [donationAmount, setDonationAmount] = useState<string>("50")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [isMonthly, setIsMonthly] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { theme } = useTheme()
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

  if (isSubmitted) {
    return (
      <main className="flex flex-col min-h-screen">
        <PageHeader
          title={t.donates?.title || "Make a Donation"}
          description={t.donates?.description || "Your generosity helps us continue our mission."}
          backgroundImage="/donate-header.jpg"
        />
        <section className="py-12 md:py-24 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-green-100 p-6 mb-6 dark:bg-green-900/20">
                <Heart className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mb-4">
                {t.donates?.thankYou?.title || "Thank You for Your Donation!"}
              </h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl mb-8">
                {t.donates?.thankYou?.description || "Your generosity makes our work possible."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  onClick={() => (window.location.href = "/")}
                >
                  {t.donates?.thankYou?.homeButton || "Return to Home"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => (window.location.href = "/programs")}
                >
                  {t.donates?.thankYou?.programsButton || "Explore Our Programs"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader
        title={t.donate?.title || "Make a Donation"}
        description={t.donate?.description || "Your generosity helps us continue our mission."}
        backgroundImage="/donate-header.jpg"
      />

      <section className="py-8 md:py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                {t.donate?.impact?.title || "Your Impact"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                {t.donate?.impact?.description || "Every donation makes a meaningful difference."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  t.donate?.impact?.items || [
                    { amount: "$25", description: "Provides school supplies for a student" },
                    { amount: "$50", description: "Funds a month of after-school tutoring" },
                    { amount: "$100", description: "Sponsors a student's school fees" },
                    { amount: "$250", description: "Supports a community development project" },
                  ]
                ).map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-primary">{item.amount}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{item.description}</div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <h3 className="text-lg md:text-xl font-bold mb-2">{t.donate?.taxInfo?.title || "Tax Information"}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  {t.donate?.taxInfo?.description || "All donations are tax-deductible to the extent allowed by law."}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">{t.donate?.form?.title || "Donation Form"}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t.donate?.form?.frequency?.label || "Donation Frequency"}</Label>
                    <div className="flex rounded-md overflow-hidden">
                      <button
                        type="button"
                        className={`flex-1 py-2 px-3 md:px-4 text-center text-sm md:text-base ${
                          !isMonthly
                            ? "bg-primary text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        onClick={() => setIsMonthly(false)}
                      >
                        {t.donate?.form?.frequency?.oneTime || "One-time"}
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-3 md:px-4 text-center text-sm md:text-base ${
                          isMonthly
                            ? "bg-primary text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        onClick={() => setIsMonthly(true)}
                      >
                        {t.donate?.form?.frequency?.monthly || "Monthly"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.donate?.form?.amount?.label || "Donation Amount"}</Label>
                    <RadioGroup defaultValue="50" onValueChange={handleDonationChange}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(
                          t.donate?.form?.amount?.options || [
                            { value: "25", label: "$25" },
                            { value: "50", label: "$50" },
                            { value: "100", label: "$100" },
                            { value: "250", label: "$250" },
                            { value: "500", label: "$500" },
                            { value: "custom", label: "Custom" },
                          ]
                        ).map((option, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                          >
                            <RadioGroupItem value={option.value} id={`r${index + 1}`} />
                            <Label htmlFor={`r${index + 1}`} className="text-sm md:text-base">
                              {option.label}
                            </Label>
                          </motion.div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {donationAmount === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="custom-amount" className="text-sm md:text-base">
                        {t.donate?.form?.amount?.custom || "Custom Amount"}
                      </Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder={t.donate?.form?.amount?.customPlaceholder || "Enter amount ($)"}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                        required
                        className="text-base"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="payment-method" className="text-sm md:text-base">
                      {t.donate?.form?.payment?.label || "Payment Method"}
                    </Label>
                    <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                      <TabsList className={`grid w-full ${isMobile ? "grid-cols-2 gap-y-2" : "grid-cols-4"}`}>
                        <TabsTrigger value="card" className="flex flex-col items-center gap-1 py-2 md:py-3">
                          <CardIcon className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">{t.donate?.form?.payment?.card || "Card"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="paypal" className="flex flex-col items-center gap-1 py-2 md:py-3">
                          <PayPalIcon className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">{t.donate?.form?.payment?.paypal || "PayPal"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="stripe" className="flex flex-col items-center gap-1 py-2 md:py-3">
                          <StripeIcon className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">{t.donate?.form?.payment?.stripe || "Stripe"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="momo" className="flex flex-col items-center gap-1 py-2 md:py-3">
                          <MomoIcon className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">{t.donate?.form?.payment?.momo || "MTN MoMo"}</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="card" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-name" className="text-sm md:text-base">
                            {t.donate?.form?.payment?.card_name || "Name on Card"}
                          </Label>
                          <Input id="card-name" placeholder="John Doe" required className="text-sm md:text-base" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-number" className="text-sm md:text-base">
                            {t.donate?.form?.payment?.card_number || "Card Number"}
                          </Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            required
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-sm md:text-base">
                              {t.donate?.form?.payment?.expiry || "Expiry Date"}
                            </Label>
                            <Input id="expiry" placeholder="MM/YY" required className="text-sm md:text-base" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc" className="text-sm md:text-base">
                              {t.donate?.form?.payment?.cvc || "CVC"}
                            </Label>
                            <Input id="cvc" placeholder="123" required className="text-sm md:text-base" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip" className="text-sm md:text-base">
                              {t.donate?.form?.payment?.zip || "Zip Code"}
                            </Label>
                            <Input id="zip" placeholder="12345" required className="text-sm md:text-base" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="paypal" className="space-y-4 mt-4">
                        <div className="flex justify-center p-4 border dark:border-gray-700 rounded-md">
                          <Image
                            src={isDark ? "/paypal-button-dark.png" : "/paypal-button.png"}
                            alt="PayPal Checkout"
                            width={isMobile ? 150 : 200}
                            height={isMobile ? 38 : 50}
                          />
                        </div>
                        <p className="text-xs md:text-sm text-center text-gray-500 dark:text-gray-400">
                          {t.donate?.form?.payment?.paypal_info ||
                            "You will be redirected to PayPal to complete your donation."}
                        </p>
                      </TabsContent>

                      <TabsContent value="stripe" className="space-y-4 mt-4">
                        <div className="flex justify-center p-4 border dark:border-gray-700 rounded-md">
                          <Image
                            src={isDark ? "/stripe-checkout-dark.png" : "/stripe-checkout.png"}
                            alt="Stripe Checkout"
                            width={isMobile ? 150 : 200}
                            height={isMobile ? 38 : 50}
                          />
                        </div>
                        <p className="text-xs md:text-sm text-center text-gray-500 dark:text-gray-400">
                          {t.donate?.form?.payment?.stripe_info ||
                            "You will be redirected to Stripe to complete your donation."}
                        </p>
                      </TabsContent>

                      <TabsContent value="momo" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone-number" className="text-sm md:text-base">
                            {t.donate?.form?.payment?.phone || "MTN Mobile Money Number"}
                          </Label>
                          <Input
                            id="phone-number"
                            placeholder="+250 78 123 4567"
                            required
                            className="text-sm md:text-base"
                          />
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          {t.donate?.form?.payment?.momo_info ||
                            "You will receive a prompt on your phone to confirm the payment."}
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm md:text-base">
                      {t.donate?.form?.contact?.email || "Email Address"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="text-sm md:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm md:text-base">
                      {t.donate?.form?.contact?.name || "Full Name"}
                    </Label>
                    <Input id="name" placeholder="John Doe" required className="text-sm md:text-base" />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base py-5 md:py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t.donate?.form?.processing || "Processing..."
                        : t.donate?.form?.submit || "Donate Now"}
                      <Heart className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    {t.donate?.form?.disclaimer ||
                      "This is a secure transaction. Your information is encrypted and will not be shared."}
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 lg:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
                {t.donate?.other?.title || "Other Ways to Give"}
              </h2>
              <p className="max-w-[700px] text-gray-500 dark:text-gray-400 text-sm md:text-base lg:text-lg">
                {t.donate?.other?.description ||
                  "Beyond one-time or monthly donations, there are many other ways you can support our mission."}
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(
              t.donate?.other?.ways || [
                {
                  title: "Corporate Matching",
                  description: "Many employers match charitable donations made by their employees.",
                  button: "Learn More",
                },
                {
                  title: "Legacy Giving",
                  description: "Include Youth Uplift Initiative in your estate planning.",
                  button: "Learn More",
                },
                {
                  title: "In-Kind Donations",
                  description: "Donate goods, services, or equipment that can support our programs.",
                  button: "Contact Us",
                },
              ]
            ).map((way, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-5 md:p-6 rounded-lg shadow-sm">
                <h3 className="text-lg md:text-xl font-bold mb-2">{way.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-4">{way.description}</p>
                <Button variant="outline" className="w-full text-sm md:text-base">
                  {way.button}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                {t.donate?.faq?.title || "Donation FAQs"}
              </h2>
              <div className="space-y-4 md:space-y-6">
                {(
                  t.donate?.faq?.questions || [
                    {
                      question: "Is my donation secure?",
                      answer: "Yes, we use industry-standard encryption and secure payment processors.",
                    },
                    {
                      question: "Can I donate if I'm outside the United States?",
                      answer:
                        "Yes, we accept international donations through credit card, PayPal, and other payment methods.",
                    },
                    {
                      question: "How is my donation used?",
                      answer:
                        "Your donation directly supports our programs, including scholarships, after-school activities, and community development.",
                    },
                    {
                      question: "Can I specify how my donation is used?",
                      answer:
                        "Yes, you can designate your donation for a specific program or purpose. Contact us for more information.",
                    },
                  ]
                ).map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-base md:text-lg font-medium">{faq.question}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                {t.donate?.transparency?.title || "Financial Transparency"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                {t.donate?.transparency?.description ||
                  "We're committed to transparency and accountability. Here's how we allocate the funds we receive:"}
              </p>
              <div className="aspect-video relative rounded-md overflow-hidden">
                <img src="/donation-chart.jpg" alt="Donation allocation chart" className="object-cover w-full h-full" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {(
                  t.donate?.transparency?.stats || [
                    { value: "85%", label: "Programs & Services" },
                    { value: "10%", label: "Administration" },
                    { value: "5%", label: "Fundraising" },
                    { value: "100%", label: "Impact" },
                  ]
                ).map((stat, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 md:p-4 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

