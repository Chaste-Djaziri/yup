"use client"

import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import Link from "next/link"

export default function DonationCancelled() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="rounded-full bg-orange-100 p-6 mb-6 mx-auto w-fit"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <XCircle className="h-12 w-12 text-orange-500" />
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t.donate?.cancelled?.title || "Donation Cancelled"}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t.donate?.cancelled?.description ||
              "You have cancelled your donation. No charges have been made to your account."}
          </motion.p>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/donate">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Heart className="mr-2 h-4 w-4" />
                  {t.donate?.cancelled?.tryAgain || "Try Again"}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.donate?.cancelled?.backHome || "Back to Home"}
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {t.donate?.cancelled?.otherWays?.title || "Other Ways to Help"}
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                {t.donate?.cancelled?.otherWays?.description ||
                  "Even if you can't donate right now, there are other ways to support our mission:"}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/volunteer">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">
                    {t.donate?.cancelled?.otherWays?.volunteer || "Volunteer"}
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">
                    {t.donate?.cancelled?.otherWays?.learn || "Learn More"}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
