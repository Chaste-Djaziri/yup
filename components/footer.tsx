"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
// Import the Acknowledgments component
import { Acknowledgments } from "@/components/acknowledgments"

export function Footer() {
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)
  const { theme } = useTheme()
  const { language } = useLanguage()
  const t = dictionaries[language]
  const isDark = theme === "dark"

  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-removebg-preview-croped-unK5yhZb4hLauZH2m77TqPQkjz8hH4.png"
                alt={t.siteName}
                width={40}
                height={40}
                className="invert"
              />
              <span className="text-lg font-bold">{t.siteNameShort}</span>
            </div>
            <p className="text-gray-400">{t.footer.description}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-white">
                  {t.nav.programs}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white">
                  {t.nav.events}
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-gray-400 hover:text-white">
                  {t.nav.volunteer}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-400 hover:text-white">
                  {t.nav.donate}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t.footer.contactUs}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">info@youthuplift.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+250 123 456 789</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t.footer.newsletter.title}</h3>
            <p className="text-gray-400">{t.footer.newsletter.description}</p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder={t.footer.newsletter.placeholder}
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 text-sm md:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setIsNewsletterModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 hover:scale-105 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm md:text-base"
              >
                {t.footer.newsletter.button}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} {t.siteName}. {t.footer.rights}
          </p>
        </div>
        {/* Add the Acknowledgments component before the closing div tag of the footer */}
        <Acknowledgments />
      </div>
      <NewsletterSignup isOpen={isNewsletterModalOpen} onClose={() => setIsNewsletterModalOpen(false)} />
    </footer>
  )
}

