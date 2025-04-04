"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import Link from "next/link"

export function Acknowledgments() {
  const { language } = useLanguage()

  const acknowledgmentText = {
    en: {
      title: "Acknowledgments",
      byimana: "Special thanks to Chaste Djaziri for their invaluable support in developing our website.",
      developer: "Website developed by ",
      micorp: "Micorp",
      services: ", a professional software services company.",
    },
    fr: {
      title: "Remerciements",
      byimana: "Remerciements spéciaux à Chaste Djaziri pour leur soutien inestimable dans notre mission.",
      developer: "Site web développé par ",
      micorp: "Micorp",
      services: ", une entreprise de services logiciels professionnels.",
    },
    rw: {
      title: "Gushimira",
      byimana: "Turashimira Chaste Djaziri kubw'ubufasha yatanze mugutuma tugera aho turi.",
      developer: "Urubuga rwakozwe na ",
      micorp: "Micorp",
      services: ", isosiyete y'umwuga mu bijyanye na ikoranabuhanga.",
    },
  }

  const text = acknowledgmentText[language] || acknowledgmentText.en

  return (
    <motion.div
      className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h4 className="text-sm font-semibold mb-2">{text.title}</h4>
      <p className="text-sm mb-1">{text.byimana}</p>
      <p className="text-sm">
        {text.developer}
        <Link
          href="https://micorp.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline transition-colors"
        >
          {text.micorp}
        </Link>
        {text.services}
      </p>
    </motion.div>
  )
}

