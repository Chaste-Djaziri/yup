"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { submitVolunteerApplication } from "@/app/actions/volunteer-actions"

// Submit button with loading state
function SubmitButton({ text, loadingText }: { text: string; loadingText: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base h-10 sm:h-12"
      disabled={pending}
    >
      {pending ? loadingText : text}
    </Button>
  )
}

export function VolunteerForm() {
  const { language } = useLanguage()
  const t = dictionaries[language]
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [selectedOpportunityTitle, setSelectedOpportunityTitle] = useState<string | null>(null)

  const initialState = { success: false, message: "" }
  const [formState, formAction, isPending] = useActionState(submitVolunteerApplication, initialState)

  // Find selected opportunity details
  const selectedOpportunity = t.volunteer.opportunities.list.find(
    (opp) => opp.title === selectedOpportunityTitle
  )

  useEffect(() => {
    if (formState && formState.success) {
      setIsSubmitted(true)
    }
  }, [formState])

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-green-800 mb-2">{t.volunteer.form.success.title}</h3>
        <p className="text-green-600">{t.volunteer.form.success.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4 form-touch-friendly" id="volunteer-form">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-sm sm:text-base">
            {t.volunteer.form.firstName}
          </Label>
          <Input id="first-name" name="first-name" required className="text-sm sm:text-base h-10 sm:h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-sm sm:text-base">
            {t.volunteer.form.lastName}
          </Label>
          <Input id="last-name" name="last-name" required className="text-sm sm:text-base h-10 sm:h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          {t.volunteer.form.email}
        </Label>
        <Input id="email" name="email" type="email" required className="text-sm sm:text-base h-10 sm:h-11" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm sm:text-base">
          {t.volunteer.form.phone}
        </Label>
        <Input id="phone" name="phone" type="tel" className="text-sm sm:text-base h-10 sm:h-11" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">{t.volunteer.form.country}</Label>
        <Select name="country" required>
          <SelectTrigger id="country">
            <SelectValue placeholder={t.volunteer.form.selectCountry} />
          </SelectTrigger>
          <SelectContent>
            {t.volunteer.countries.map((country, index) => (
              <SelectItem key={index} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="opportunity">{t.volunteer.form.opportunity}</Label>
        <Select name="opportunity" onValueChange={(value) => setSelectedOpportunityTitle(value)}>
          <SelectTrigger id="opportunity">
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
        {selectedOpportunity && (
          <div className="bg-muted/40 border border-border text-muted-foreground rounded-md p-4 mt-2 text-sm space-y-2">
            <p><strong>Description:</strong> {selectedOpportunity.description}</p>
            <p><strong>Commitment:</strong> {selectedOpportunity.commitment}</p>
            <p><strong>Skills Needed:</strong> {selectedOpportunity.skills.join(", ")}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">{t.volunteer.form.availability}</Label>
        <Select name="availability">
          <SelectTrigger id="availability">
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
        <Textarea id="skills" name="skills" placeholder={t.volunteer.form.skillsPlaceholder} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">{t.volunteer.form.motivation}</Label>
        <Textarea id="motivation" name="motivation" placeholder={t.volunteer.form.motivationPlaceholder} required />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          name="terms"
          required
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          value="accepted"
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          {t.volunteer.form.terms}
        </Label>
      </div>

      {formState && !formState.success && formState.message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{formState.message}</div>
      )}

      <SubmitButton
        text={t.volunteer.form.submit}
        loadingText={isPending ? t.volunteer.form.submitting : t.volunteer.form.submit}
      />
    </form>
  )
}
