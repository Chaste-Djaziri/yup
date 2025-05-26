"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Shield, Users, Target, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { MomoIcon } from "@/components/payment-icons"
import { useMobile } from "@/hooks/use-mobile"

declare global {
  interface Window {
    PayPal: any
  }
}

export function DonateClient() {
  const { language } = useLanguage()
  const t = dictionaries[language] || dictionaries.en
  const isMobile = useMobile()

  const [donationAmount, setDonationAmount] = useState<string>("50")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const momoNumber = "+250 788 749 709"

  const handleDonationChange = (value: string) => {
    setDonationAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(momoNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  // Load PayPal script
  useEffect(() => {
    if (paymentMethod === "paypal") {
      const script = document.createElement("script")
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
      script.charset = "UTF-8"
      script.onload = () => {
        if (window.PayPal) {
          // Clear any existing PayPal button
          const container = document.getElementById("donate-button")
          if (container) {
            container.innerHTML = ""
          }

          window.PayPal.Donation.Button({
            env: "production",
            hosted_button_id: "LGLZ8EBKCFP9W",
            image: {
              src: "https://pics.paypal.com/00/s/OTJjZmE3OGYtNzE0OS00NGFlLTg4MjctYzA1NzkzMjAyZGNi/file.PNG",
              alt: "Donate with PayPal button",
              title: "PayPal - The safer, easier way to pay online!",
            },
          }).render("#donate-button")
        }
      }
      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [paymentMethod])

  if (isSubmitted) {
    return (
      <main className="flex flex-col min-h-screen">
        <PageHeader
          title={t.donate?.title || "Make a Donation"}
          description={t.donate?.description || "Your generosity helps us continue our mission."}
          backgroundImage="/assets/donate.jpg"
        />
        <section className="py-12 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <motion.div
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="rounded-full bg-green-100 p-8 mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heart className="h-16 w-16 text-green-600" fill="currentColor" />
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Thank You for Your Generosity!
              </motion.h2>
              <motion.p
                className="max-w-2xl text-gray-600 text-lg md:text-xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Your donation will make a real difference in the lives of young people in our community. We'll send you
                a confirmation email shortly.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  className="bg-primary hover:bg-primary/90 px-8 py-3"
                  onClick={() => (window.location.href = "/")}
                >
                  Return to Home
                </Button>
                <Button variant="outline" className="px-8 py-3" onClick={() => (window.location.href = "/programs")}>
                  Explore Our Programs
                </Button>
              </motion.div>
            </motion.div>
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
        backgroundImage="/assets/donate.jpg"
      />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Impact Section */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Your Impact Matters</h2>
                <p className="text-gray-600 text-lg">
                  Every donation directly supports our mission to empower young people and strengthen communities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { amount: "$25", description: "Provides school supplies for a student", icon: Target },
                  { amount: "$50", description: "Funds a month of after-school tutoring", icon: Users },
                  { amount: "$100", description: "Sponsors a student's school fees", icon: Shield },
                  { amount: "$250", description: "Supports a community development project", icon: Heart },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-3">
                      <item.icon className="h-6 w-6 text-primary mr-2" />
                      <div className="text-2xl font-bold text-primary">{item.amount}</div>
                    </div>
                    <div className="text-gray-600">{item.description}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  Tax Information
                </h3>
                <p className="text-gray-600">
                  All donations are tax-deductible to the extent allowed by law. You will receive a receipt for your
                  records.
                </p>
              </div>
            </motion.div>

            {/* Donation Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <h3 className="text-2xl font-bold mb-6 text-center">Make Your Donation</h3>

                {/* Amount Selection */}
                <div className="mb-6">
                  <Label className="text-base font-medium mb-3 block">Donation Amount</Label>
                  <RadioGroup defaultValue="50" onValueChange={handleDonationChange}>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { value: "25", label: "$25" },
                        { value: "50", label: "$50" },
                        { value: "100", label: "$100" },
                        { value: "250", label: "$250" },
                        { value: "500", label: "$500" },
                        { value: "custom", label: "Custom" },
                      ].map((option, index) => (
                        <motion.div
                          key={index}
                          className="relative"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RadioGroupItem value={option.value} id={`amount-${option.value}`} className="peer sr-only" />
                          <Label
                            htmlFor={`amount-${option.value}`}
                            className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50"
                          >
                            {option.label}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </RadioGroup>

                  {donationAmount === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4"
                    >
                      <Input
                        type="number"
                        placeholder="Enter amount ($)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                        className="text-lg p-3"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <Label className="text-base font-medium mb-3 block">Payment Method</Label>
                  <Tabs defaultValue="paypal" onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="paypal" className="flex items-center gap-2 py-3">
                        <Image src="/assets/logo/paypal-seeklogo.svg" alt="PayPal" width={20} height={20} />
                        PayPal
                      </TabsTrigger>
                      <TabsTrigger value="momo" className="flex items-center gap-2 py-3">
                        <MomoIcon className="h-5 w-5" />
                        MTN MoMo
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="paypal" className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Image src="/assets/logo/paypal-seeklogo.svg" alt="PayPal" width={24} height={24} />
                            <span className="font-semibold text-gray-800">Secure PayPal Donation</span>
                          </div>
                          <p className="text-sm text-gray-600">Pay securely with your PayPal account or credit card</p>
                        </div>
                        <div className="flex justify-center">
                          <div id="donate-button-container">
                            <div id="donate-button"></div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="momo" className="space-y-4">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <MomoIcon className="h-6 w-6" />
                            <span className="font-semibold text-gray-800">MTN Mobile Money</span>
                          </div>
                          <p className="text-sm text-gray-600">Send your donation via MTN Mobile Money</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-yellow-300">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Send your donation to:</p>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <span className="text-2xl font-bold text-gray-800">{momoNumber}</span>
                              <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
                                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            {copied && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-green-600 font-medium"
                              >
                                Number copied to clipboard!
                              </motion.p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 text-center">
                          <p className="text-xs text-gray-600">
                            1. Dial *182# on your MTN phone
                            <br />
                            2. Select "Send Money"
                            <br />
                            3. Enter the number above
                            <br />
                            4. Enter your donation amount
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Your donation is secure and encrypted. We never store your payment information.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Other Ways to Support Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Beyond monetary donations, there are many ways you can help us make a difference in our community.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
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
            ].map((way, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-3">{way.title}</h3>
                <p className="text-gray-600 mb-4">{way.description}</p>
                <Button variant="outline" className="w-full">
                  {way.button}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
