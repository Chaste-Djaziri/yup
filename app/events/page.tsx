"use client"

import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import { EventCard } from "@/components/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Events & Activities | Youth Uplift Initiative",
  description:
    "Join us at our upcoming events and activities to support our cause and connect with our community.",
}

export default function EventsPage() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  // Get current date for filtering
  const currentDate = new Date()

  // Filter events into upcoming and past
  const upcomingEvents = t.events.list.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate >= currentDate
  })

  const pastEvents = t.events.list
    .filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate < currentDate
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader title={t.events.title} description={t.events.description} backgroundImage="/assets/event-header.jpg" />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">{t.events.tabs.upcoming}</TabsTrigger>
              <TabsTrigger value="past">{t.events.tabs.past}</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event, index) => (
                    <EventCard
                      key={index}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      description={event.description}
                      image={event.image}
                      link={`/events/${event.slug}`}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">{t.events.noUpcoming.title}</h3>
                  <p className="text-gray-500 mb-6">{t.events.noUpcoming.description}</p>
                  <Link href="/contact">
                    <Button variant="outline">{t.events.noUpcoming.contactButton}</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event, index) => (
                    <EventCard
                      key={index}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      description={event.description}
                      image={event.image}
                      link={`/events/${event.slug}`}
                      index={index}
                      isPast
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">{t.events.noPast}</h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t.events.host.title}</h2>
              <p className="text-gray-500 md:text-lg">{t.events.host.description}</p>
              <ul className="space-y-2 text-gray-500">
                {t.events.host.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90">
                    {t.events.host.contactButton} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">{t.events.featured.title}</h3>
                {t.events.featured.event ? (
                  <div>
                    <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                      <img
                        src={t.events.featured.event.image || "/placeholder.svg"}
                        alt={t.events.featured.event.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h4 className="text-lg font-bold">{t.events.featured.event.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{t.events.featured.event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{t.events.featured.event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{t.events.featured.event.location}</span>
                    </div>
                    <p className="text-gray-500 mb-4">{t.events.featured.event.description}</p>
                    <Link href={`/events/${t.events.featured.event.slug}`}>
                      <Button variant="outline" size="sm">
                        {t.events.featured.learnMoreButton}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500">{t.events.featured.noEvent}</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t.events.subscribe.title}
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.events.subscribe.description}
              </p>
            </div>
            <div className="flex flex-col w-full max-w-sm gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={t.events.subscribe.placeholder}
                  className="px-4 py-2 border rounded-md flex-1"
                />
                <Button className="bg-primary hover:bg-primary/90">{t.events.subscribe.button}</Button>
              </div>
              <p className="text-xs text-gray-500">{t.events.subscribe.privacy}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

