"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description: string
  backgroundImage: string
}

export function PageHeader({
  title = "Youth Uplift Initiative",
  description = "Empowering youth in Rwanda",
  backgroundImage = "/donate-header.jpg",
}: PageHeaderProps) {
  return (
    <section
      className="w-full py-8 sm:py-12 md:py-16 lg:py-24 pt-24 relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center">
          <motion.div
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none font-bold tracking-tighter text-white">
              {title}
            </h1>
            <p className="max-w-[700px] text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">{description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
