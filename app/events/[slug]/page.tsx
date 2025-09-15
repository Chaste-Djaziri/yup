import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { dictionaries } from "@/dictionaries"
import { Button } from "@/components/ui/button"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const t = dictionaries.en
  const all = [...(t.events?.list || []), ...(t.home?.events?.events || [])]
  const event: any = all.find((e: any) => e.slug === params.slug)
  if (!event) return { title: "Event | Youth Uplift Initiative" }
  const url = `https://yupinitiative.com/events/${event.slug}`
  return {
    title: `${event.title} | Events`,
    description: event.description,
    alternates: { canonical: url },
    openGraph: {
      title: event.title,
      description: event.description,
      url,
      images: event.image ? [{ url: event.image, width: 1200, height: 630 }] : undefined,
      type: "article",
    },
  }
}

export default function EventDetailsPage({ params }: { params: { slug: string } }) {
  const t = dictionaries.en
  const all = [...(t.events?.list || []), ...(t.home?.events?.events || [])]
  const event: any = all.find((e: any) => e.slug === params.slug)

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
          <div className="aspect-video mb-6 rounded-lg overflow-hidden relative">
            <Image src={event.image || "/assets/event.jpg"} alt={event.title} fill className="object-cover" />
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
