"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Share2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import Link from "next/link"
import { useState } from "react"

export default function DonationCompleted() {
  const { language } = useLanguage()
  const t = dictionaries[language]
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: "I just donated to Youth Uplift Initiative",
          text: "Join me in supporting this amazing cause!",
          url: window.location.origin,
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.origin)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.log("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-lg w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="rounded-full bg-green-100 dark:bg-green-900/20 p-6 mb-6 mx-auto w-fit"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t.donate?.completed?.title || "Thank You!"}
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t.donate?.completed?.subtitle || "Your donation has been successfully completed."}
          </motion.p>

          <motion.p
            className="text-lg text-gray-500 dark:text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t.donate?.completed?.description ||
              "Your generosity will make a real difference in the lives of young people in our community."}
          </motion.p>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t.donate?.completed?.impact?.title || "Your Impact"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {t.donate?.completed?.impact?.education || "Supporting education programs"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {t.donate?.completed?.impact?.community || "Building stronger communities"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {t.donate?.completed?.impact?.youth || "Empowering young leaders"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {t.donate?.completed?.impact?.future || "Creating lasting change"}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/programs">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  {t.donate?.completed?.seePrograms || "See Our Programs"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleShare} disabled={isSharing}>
                <Share2 className="mr-2 h-4 w-4" />
                {isSharing ? "Sharing..." : t.donate?.completed?.share || "Share"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  {t.donate?.completed?.backHome || "Back to Home"}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  {t.donate?.completed?.contact || "Contact Us"}
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                {t.donate?.completed?.receipt ||
                  "A receipt for your donation will be sent to your email address shortly."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
