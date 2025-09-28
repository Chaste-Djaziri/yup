"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export function ImpactSection() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              {t.home.impact.title}
            </h2>
            <p className="max-w-[700px] text-gray-500 text-sm sm:text-base md:text-lg mx-auto">
              {t.home.impact.description}
            </p>
          </div>
        </motion.div>
        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex flex-col items-center justify-center space-y-2 bg-white p-6 rounded-lg shadow-sm"
            variants={itemVariants}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              {t.home.impact.students.count}
            </span>
            <h3 className="text-lg sm:text-xl font-medium">{t.home.impact.students.title}</h3>
            <p className="text-gray-500 text-center text-sm sm:text-base">
              {t.home.impact.students.description}
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center justify-center space-y-2 bg-white p-6 rounded-lg shadow-sm"
            variants={itemVariants}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              {t.home.impact.projects.count}
            </span>
            <h3 className="text-lg sm:text-xl font-medium">{t.home.impact.projects.title}</h3>
            <p className="text-gray-500 text-center text-sm sm:text-base">
              {t.home.impact.projects.description}
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center justify-center space-y-2 bg-white p-6 rounded-lg shadow-sm"
            variants={itemVariants}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              {t.home.impact.volunteers.count}
            </span>
            <h3 className="text-lg sm:text-xl font-medium">{t.home.impact.volunteers.title}</h3>
            <p className="text-gray-500 text-center text-sm sm:text-base">
              {t.home.impact.volunteers.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
