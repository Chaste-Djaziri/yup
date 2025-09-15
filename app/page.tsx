"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { MissionSection } from "@/components/mission-section"
import { ImpactSection } from "@/components/impact-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { UpcomingEvents } from "@/components/upcoming-events"
import { DonateSection } from "@/components/donate-section"
import { VideosSection } from "@/components/videos-section"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export default function Home() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <MissionSection />
      <ImpactSection />
      <VideosSection />
      <TestimonialSection />
      <UpcomingEvents />
      <DonateSection />

      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.home.community.title}</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.home.community.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/volunteer">
                <Button className="bg-primary hover:bg-primary/90">
                  {t.home.community.volunteerButton} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">{t.home.community.contactButton}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
