"use client"

import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

interface OpportunityCardProps {
  title: string
  description: string
  commitment: string
  skills: string[]
  location: string
  index: number
}

export function OpportunityCard({ title, description, commitment, skills, location, index }: OpportunityCardProps) {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="h-4 w-4 mr-1" />
          <span>{commitment}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-gray-500 mb-4">{description}</p>
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">{t.volunteer.opportunities.skills}</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <div key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {skill}
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90">{t.volunteer.opportunities.applyButton}</Button>
      </div>
    </motion.div>
  )
}

