"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export function HeroSection() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none font-bold tracking-tighter">
                {t.home.hero.title}
              </h1>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl">
                {t.home.hero.subtitle}
              </p>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/donate">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 text-sm md:text-base">
                  {t.home.hero.donateButton} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto transition-all duration-200 hover:scale-105 mt-2 sm:mt-0 text-sm md:text-base"
                >
                  {t.home.hero.learnMoreButton}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px]">
              <Image
                src="/assets/logo.png"
                alt="Youth Uplift Initiative Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

