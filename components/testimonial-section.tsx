"use client"

import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export function TestimonialSection() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              {t.home.testimonials.title}
            </h2>
            <p className="max-w-[700px] text-gray-500 text-sm sm:text-base md:text-lg mx-auto">
              {t.home.testimonials.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-8 md:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.testimonials.testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col p-5 sm:p-6 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold">{testimonial.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="mt-3 sm:mt-4 text-gray-500 text-sm sm:text-base">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
