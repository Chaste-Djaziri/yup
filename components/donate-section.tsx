// components/donate-section.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { DonationModal } from "@/components/donation-modal"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/utils/translation-utils"
import { motion } from "framer-motion"

export function DonateSection() {
  const { language } = useLanguage()
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            className="space-y-4 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
              {getTranslation(language, "home.donate.title", "Make a Difference Today")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-[800px] mx-auto">
              {getTranslation(
                language,
                "home.donate.description",
                "Your donation helps us continue our mission of uplifting youth in Rwanda.",
              )}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base py-2.5 px-5"
                onClick={() => setIsDonationModalOpen(true)}
              >
                {getTranslation(language, "donate.form.donateButton", "Donate Now")} <Heart className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
    </section>
  )
}

