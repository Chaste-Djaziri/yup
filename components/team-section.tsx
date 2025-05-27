"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { Facebook, Linkedin, Instagram } from "lucide-react"

export function TeamSection() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-12 md:py-24 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.about.team.title}</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.about.team.description}
            </p>
          </div>
        </div>
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {t.about.team.members.map((member, index) => (
            <motion.div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm" variants={itemVariants}>
              <div className="aspect-[4/3] relative">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                <p className="text-gray-500 mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href={member.social.instagram} className="text-gray-400 hover:text-primary">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

