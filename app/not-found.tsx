"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Home, Search, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export default function NotFound() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Large 404 Text */}
          <motion.h1
            className="text-8xl md:text-9xl font-bold text-primary/20 mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            404
          </motion.h1>

          {/* Main Message */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t.notFound?.title || "Page Not Found"}
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {t.notFound?.description ||
              "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL."}
          </motion.p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
            <div className="absolute inset-4 bg-primary/20 rounded-full"></div>
            <div className="absolute inset-8 bg-primary/30 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3">
              <Home className="w-4 h-4 mr-2" />
              {t.notFound?.homeButton || "Go Home"}
            </Button>
          </Link>

          <Link href="/contact">
            <Button variant="outline" className="px-6 py-3">
              <Mail className="w-4 h-4 mr-2" />
              {t.notFound?.contactButton || "Contact Us"}
            </Button>
          </Link>

          <Button variant="ghost" onClick={() => window.history.back()} className="px-6 py-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.notFound?.backButton || "Go Back"}
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t.notFound?.helpfulLinksTitle || "You might be looking for:"}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about" className="text-primary hover:text-primary/80 underline">
              {t.nav?.about || "About Us"}
            </Link>
            <Link href="/programs" className="text-primary hover:text-primary/80 underline">
              {t.nav?.programs || "Programs"}
            </Link>
            <Link href="/events" className="text-primary hover:text-primary/80 underline">
              {t.nav?.events || "Events"}
            </Link>
            <Link href="/volunteer" className="text-primary hover:text-primary/80 underline">
              {t.nav?.volunteer || "Volunteer"}
            </Link>
            <Link href="/donate" className="text-primary hover:text-primary/80 underline">
              {t.nav?.donate || "Donate"}
            </Link>
            <Link href="/gallery" className="text-primary hover:text-primary/80 underline">
              {t.nav?.gallery || "Gallery"}
            </Link>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <p>{t.notFound?.footerMessage || "If you believe this is an error, please contact our support team."}</p>
        </motion.div>
      </div>
    </div>
  )
}
