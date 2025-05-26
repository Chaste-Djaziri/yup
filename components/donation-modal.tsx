"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, X, Shield, Sparkles, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MomoIcon } from "@/components/payment-icons"

declare global {
  interface Window {
    PayPal: any
  }
}

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
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

  // Load PayPal script when modal opens and PayPal is selected
  useEffect(() => {
    if (isOpen && paymentMethod === "paypal") {
      const script = document.createElement("script")
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
      script.charset = "UTF-8"
      script.onload = () => {
        if (window.PayPal) {
          const container = document.getElementById("modal-donate-button")
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
          }).render("#modal-donate-button")
        }
      }
      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [isOpen, paymentMethod])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false)
      setDonationAmount("50")
      setCustomAmount("")
      setCopied(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 text-center"
            >
              <motion.div
                className="rounded-full bg-green-100 p-6 mx-auto mb-6 w-fit"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Heart className="h-12 w-12 text-green-600" fill="currentColor" />
              </motion.div>
              <motion.h3
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Thank You for Your Generosity!
              </motion.h3>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Your donation will make a real difference. We'll send you a confirmation email shortly.
              </motion.p>
              <motion.div
                className="flex gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                  Close
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/programs")}>
                  View Programs
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">Make a Donation</DialogTitle>
                    <p className="text-white/90">Support our mission to empower youth</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick Impact */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium">Your Impact</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    $50 can provide a month of after-school tutoring for a student in need.
                  </p>
                </div>

                {/* Amount Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Amount</Label>
                  <RadioGroup defaultValue="50" onValueChange={handleDonationChange}>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { value: "25", label: "$25" },
                        { value: "50", label: "$50" },
                        { value: "100", label: "$100" },
                        { value: "250", label: "$250" },
                        { value: "500", label: "$500" },
                        { value: "custom", label: "Other" },
                      ].map((option) => (
                        <div key={option.value} className="relative">
                          <RadioGroupItem value={option.value} id={`modal-${option.value}`} className="peer sr-only" />
                          <Label
                            htmlFor={`modal-${option.value}`}
                            className="flex items-center justify-center p-2 text-sm border-2 rounded-lg cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {donationAmount === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3"
                    >
                      <Input
                        type="number"
                        placeholder="Enter amount ($)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                        className="text-base"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Payment Methods */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                  <Tabs defaultValue="paypal" onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="paypal" className="flex items-center gap-2">
                        <Image src="/assets/logo/paypal-seeklogo.svg" alt="PayPal" width={16} height={16} />
                        PayPal
                      </TabsTrigger>
                      <TabsTrigger value="momo" className="flex items-center gap-2">
                        <MomoIcon className="h-4 w-4" />
                        MoMo
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="paypal" className="space-y-3">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Image src="/assets/logo/paypal-seeklogo.svg" alt="PayPal" width={20} height={20} />
                            <span className="font-medium text-sm">Secure PayPal Payment</span>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div id="modal-donate-button"></div>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">Pay with PayPal account or credit card</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="momo" className="space-y-3">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <MomoIcon className="h-5 w-5" />
                            <span className="font-medium text-sm">MTN Mobile Money</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-yellow-300">
                          <p className="text-xs text-gray-600 text-center mb-2">Send your donation to:</p>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-800">{momoNumber}</span>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-6 w-6 p-0">
                              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                          {copied && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-green-600 font-medium text-center"
                            >
                              Copied!
                            </motion.p>
                          )}
                        </div>

                        <div className="mt-3 text-center">
                          <p className="text-xs text-gray-600">Dial *182# → Send Money → Enter number above</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Shield className="h-4 w-4" />
                  <span>Your donation is secure and encrypted. We never store payment information.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
