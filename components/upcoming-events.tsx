"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation, getTranslationArray } from "@/utils/translation-utils"

export function UpcomingEvents() {
  const { language } = useLanguage()

  // Default events if translations are missing
  const defaultEvents = [
    {
      title: "Youth Leadership Workshop",
      date: "June 15, 2025",
      location: "YUP Community Center, Kigali",
      description: "A day-long workshop focused on developing leadership skills among high school students in Kigali.",
    },
    {
      title: "Community Clean-up Day",
      date: "July 8, 2025",
      location: "Nyamirambo District, Kigali",
      description:
        "Join us in cleaning up local parks and streets while fostering community spirit and environmental awareness.",
    },
    {
      title: "Annual Fundraising Gala",
      date: "August 22, 2025",
      location: "Kigali Marriott Hotel",
      description:
        "Our biggest fundraising event of the year, featuring dinner, entertainment, and inspiring stories from our beneficiaries.",
    },
  ]

  const events = getTranslationArray(language, "home.events.events", defaultEvents)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              {getTranslation(language, "home.events.title", "Upcoming Events")}
            </h2>
            <p className="max-w-[700px] text-gray-500 text-sm sm:text-base md:text-lg mx-auto">
              {getTranslation(
                language,
                "home.events.description",
                "Join us at our upcoming events and be part of the change.",
              )}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-8 md:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <div key={index} className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <div className="p-1 bg-primary text-white text-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline-block mr-1" />
                <span className="text-xs sm:text-sm">{event.date}</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold">{event.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">{event.description}</p>
                <div className="mt-4">
                  <Link href={`/events/${(event.slug || event.title.toLowerCase().replace(/\s+/g, "-")).toString()}`}>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      {getTranslation(language, "events.eventDetails.learnMoreButton", "Learn More")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/events">
            <Button variant="outline">
              {getTranslation(language, "home.events.viewAllButton", "View All Events")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
