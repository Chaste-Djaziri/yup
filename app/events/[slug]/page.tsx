"use client"

import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EventDetailsPage() {
  const params = useParams()
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string)
  const { language } = useLanguage()
  const t = dictionaries[language]

  const event = t.events.list.find((e: any) => e.slug === slug) ||
    t.home?.events?.events?.find?.((e: any) => e.slug === slug)

  if (!event) {
    return (
      <main className="flex flex-col min-h-screen">
        <PageHeader title="Event Not Found" description="The event you are looking for does not exist." backgroundImage="/assets/event-header.jpg" />
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Link href="/events"><Button variant="outline">Back to Events</Button></Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader title={event.title} description={event.description} backgroundImage={event.image || "/assets/event-header.jpg"} />
      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="aspect-video mb-6 rounded-lg overflow-hidden">
            <img src={event.image || "/assets/event.jpg"} alt={event.title} className="object-cover w-full h-full" />
          </div>
          <div className="grid gap-2 text-gray-700">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{event.date}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{event.time}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>
          </div>
          <p className="mt-6 text-gray-600">{event.description}</p>
          <div className="mt-8">
            <Link href="/contact"><Button className="bg-primary hover:bg-primary/90">Contact to Join</Button></Link>
          </div>
        </div>
      </section>
    </main>
  )
}

