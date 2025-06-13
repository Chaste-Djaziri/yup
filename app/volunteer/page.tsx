"use client"

import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { PageHeader } from "@/components/page-header"
import { VolunteerForm } from "@/components/volunteer-form"
import { OpportunityCard } from "@/components/opportunity-card"

export const metadata: Metadata = {
  title: "Volunteer With Us | Youth Uplift Initiative",
  description:
    "Join our team of dedicated volunteers and make a meaningful impact in the lives of youth in Rwanda.",
}

export default function VolunteerPage() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader
        title={t.volunteer.title}
        description={t.volunteer.description}
        backgroundImage="/assets/donate.jpg"
      />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t.volunteer.why.title}</h2>
              <p className="text-gray-500 md:text-lg">{t.volunteer.why.description}</p>
              <ul className="space-y-2">
                {t.volunteer.why.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span className="text-gray-500">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="relative h-[400px] overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src="/assets/donate.jpg"
                alt="Volunteers making a difference"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t.volunteer.opportunities.title}
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.volunteer.opportunities.description}
              </p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* {t.volunteer.opportunities.list.map((opportunity, index) => (
              <OpportunityCard
                key={index}
                title={opportunity.title}
                description={opportunity.description}
                commitment={opportunity.commitment}
                skills={opportunity.skills}
                location={opportunity.location}
                index={index}
              />
            ))} */}
          </div>
          <p className="text-gray-500 font-bold text-center text-xl">We will put the opportunities here soon</p>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t.volunteer.form.title}</h2>
              <p className="text-gray-500 md:text-lg">{t.volunteer.form.description}</p>
              <VolunteerForm />
            </motion.div>
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">{t.volunteer.testimonials.title}</h3>
                <div className="space-y-6">
                  {/* {t.volunteer.testimonials.list.map((testimonial, index) => (
                    <div key={index} className="space-y-2">
                      <p className="italic text-gray-500">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                        <div>
                          <p className="font-medium text-sm">{testimonial.name}</p>
                          <p className="text-xs text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))} */}
                  <p className="text-gray-500 font-bold">Testimonials will be posted here soon</p>
                </div>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">{t.volunteer.faq.title}</h3>
                <div className="space-y-4">
                  {t.volunteer.faq.list.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium">{item.question}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      {t.volunteer.faq.contactButton}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.volunteer.cta.title}</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.volunteer.cta.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#volunteer-form">
                <Button className="bg-primary hover:bg-primary/90">
                  {t.volunteer.cta.applyButton} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">{t.volunteer.cta.contactButton}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

