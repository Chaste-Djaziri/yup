"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { motion } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const { language } = useLanguage()
  const t = dictionaries[language]
  const isDark = theme === "dark"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container flex h-14 md:h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-removebg-preview-croped-unK5yhZb4hLauZH2m77TqPQkjz8hH4.png"
            alt={t.siteName}
            width={32}
            height={32}
            className={`md:w-10 md:h-10 ${isDark ? "invert" : ""}`}
          />
          <span className="text-base md:text-lg font-bold dark:text-white">{t.siteNameShort}</span>
        </Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.home}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/about"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.about}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/programs"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.programs}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/events"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.events}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/volunteer"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.volunteer}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/gallery"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.gallery}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
            >
              {t.nav.contact}
            </Link>
          </motion.div>
        </nav>
        <div className="ml-auto md:ml-4 flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/donate">
              <Button className="bg-primary hover:bg-primary/90 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg">
                {t.nav.donate}
              </Button>
            </Link>
          </motion.div>
          <LanguageSelector />
          <ThemeToggle />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="ml-2 md:hidden">
            <Button variant="outline" size="icon" className="h-9 w-9 dark:border-gray-700">
              <Menu className="h-5 w-5 dark:text-white" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[75vw] sm:w-[350px] dark:bg-gray-900 dark:border-gray-800">
            <div className="flex flex-col gap-5 pt-6">
              <Link
                href="/"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/about"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.about}
              </Link>
              <Link
                href="/programs"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.programs}
              </Link>
              <Link
                href="/events"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.events}
              </Link>
              <Link
                href="/volunteer"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.volunteer}
              </Link>
              <Link
                href="/gallery"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.gallery}
              </Link>
              <Link
                href="/contact"
                className="text-base md:text-lg font-medium dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.contact}
              </Link>
              <Link href="/donate" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-2 text-base">
                  {t.nav.donate}
                </Button>
              </Link>
              <div className="flex gap-3 justify-center mt-4">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

