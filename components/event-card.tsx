"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import Image from "next/image"

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
  link: string
  index: number
  isPast?: boolean
}

export function EventCard({
  title,
  date,
  time,
  location,
  description,
  image,
  link,
  index,
  isPast = false,
}: EventCardProps) {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <motion.div
      className={`bg-white rounded-lg overflow-hidden shadow-sm ${isPast ? "opacity-75" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isPast ? 0.75 : 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="aspect-video relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover ${isPast ? "grayscale" : ""}`}
          loading="lazy"
        />
        {isPast && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {t.events.pastLabel}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="h-4 w-4 mr-1" />
          <span>{time}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-gray-500 mb-4">{description}</p>
        <Link href={link}>
          <Button variant="outline" className="w-full">
            {isPast ? t.events.viewDetailsButton : t.events.registerButton} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
