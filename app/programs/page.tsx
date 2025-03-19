"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import { ProgramCard } from "@/components/program-card"

export default function ProgramsPage() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader
        title={t.programs.title}
        description={t.programs.description}
        backgroundImage="/programs-header.jpg"
      />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.programs.list.map((program, index) => (
              <ProgramCard
                key={index}
                title={program.title}
                description={program.description}
                image={program.image}
                link={`/programs/${program.slug}`}
                index={index}
              />
            ))}
          </div>
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
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t.programs.approach.title}</h2>
              <p className="text-gray-500 md:text-lg">{t.programs.approach.description}</p>
              <ul className="space-y-2 text-gray-500">
                {t.programs.approach.points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t.programs.outcomes.title}</h2>
              <p className="text-gray-500 md:text-lg">{t.programs.outcomes.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">{t.programs.outcomes.stats.graduates}</div>
                  <div className="text-sm text-gray-500">{t.programs.outcomes.stats.graduatesLabel}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">{t.programs.outcomes.stats.employment}</div>
                  <div className="text-sm text-gray-500">{t.programs.outcomes.stats.employmentLabel}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">{t.programs.outcomes.stats.communities}</div>
                  <div className="text-sm text-gray-500">{t.programs.outcomes.stats.communitiesLabel}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">{t.programs.outcomes.stats.satisfaction}</div>
                  <div className="text-sm text-gray-500">{t.programs.outcomes.stats.satisfactionLabel}</div>
                </div>
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
                {t.programs.support.title}
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.programs.support.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/donate">
                <Button className="bg-primary hover:bg-primary/90">
                  {t.programs.support.donateButton} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button variant="outline">{t.programs.support.volunteerButton}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

