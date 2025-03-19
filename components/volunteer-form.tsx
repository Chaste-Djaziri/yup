"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"

export function VolunteerForm() {
  const { language } = useLanguage()
  const t = dictionaries[language]

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-green-800 mb-2">{t.volunteer.form.success.title}</h3>
        <p className="text-green-600">{t.volunteer.form.success.message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 form-touch-friendly" id="volunteer-form">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-sm sm:text-base">
            {t.volunteer.form.firstName}
          </Label>
          <Input id="first-name" required className="text-sm sm:text-base h-10 sm:h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-sm sm:text-base">
            {t.volunteer.form.lastName}
          </Label>
          <Input id="last-name" required className="text-sm sm:text-base h-10 sm:h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          {t.volunteer.form.email}
        </Label>
        <Input id="email" type="email" required className="text-sm sm:text-base h-10 sm:h-11" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm sm:text-base">
          {t.volunteer.form.phone}
        </Label>
        <Input id="phone" type="tel" className="text-sm sm:text-base h-10 sm:h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="opportunity">{t.volunteer.form.opportunity}</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={t.volunteer.form.selectOpportunity} />
          </SelectTrigger>
          <SelectContent>
            {t.volunteer.opportunities.list.map((opportunity, index) => (
              <SelectItem key={index} value={opportunity.title}>
                {opportunity.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="availability">{t.volunteer.form.availability}</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={t.volunteer.form.selectAvailability} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekdays">{t.volunteer.form.availabilityOptions.weekdays}</SelectItem>
            <SelectItem value="evenings">{t.volunteer.form.availabilityOptions.evenings}</SelectItem>
            <SelectItem value="weekends">{t.volunteer.form.availabilityOptions.weekends}</SelectItem>
            <SelectItem value="flexible">{t.volunteer.form.availabilityOptions.flexible}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">{t.volunteer.form.skills}</Label>
        <Textarea id="skills" placeholder={t.volunteer.form.skillsPlaceholder} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="motivation">{t.volunteer.form.motivation}</Label>
        <Textarea id="motivation" placeholder={t.volunteer.form.motivationPlaceholder} required />
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm font-normal">
          {t.volunteer.form.terms}
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base h-10 sm:h-12"
        disabled={isSubmitting}
      >
        {isSubmitting ? t.volunteer.form.submitting : t.volunteer.form.submit}
      </Button>
    </form>
  )
}

