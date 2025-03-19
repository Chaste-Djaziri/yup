"use client"

import { Heart, Users, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export function MissionSection() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.home.mission.title}</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.home.mission.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-gray-50">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{t.home.mission.compassion.title}</h3>
            <p className="text-gray-500 text-center">{t.home.mission.compassion.description}</p>
          </div>
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-gray-50">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{t.home.mission.community.title}</h3>
            <p className="text-gray-500 text-center">{t.home.mission.community.description}</p>
          </div>
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-gray-50">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{t.home.mission.action.title}</h3>
            <p className="text-gray-500 text-center">{t.home.mission.action.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

