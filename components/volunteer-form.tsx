"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { startTransition } from "react" // Add this import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/dictionaries"
import { submitVolunteerApplication } from "@/app/actions/volunteer-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

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
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [selectedOpportunityTitle, setSelectedOpportunityTitle] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [submissionAttempt, setSubmissionAttempt] = useState(0)

  const initialState = { success: false, message: "", isSubmitting: false }
  const [formState, formAction, isPending] = useActionState(submitVolunteerApplication, initialState)

  // Find selected opportunity details
  const selectedOpportunity = t.volunteer.opportunities?.list?.find((opp) => opp.title === selectedOpportunityTitle)

  // Handle form submission result
  useEffect(() => {
    if (formState && formState.success) {
      setIsSubmitted(true)
      // Store submission data in localStorage to detect duplicates
      const submissionData = {
        email: formData.email,
        firstName: formData["first-name"],
        lastName: formData["last-name"],
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("lastVolunteerSubmission", JSON.stringify(submissionData))
    }
  }, [formState, formData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Collect form data
    const data = new FormData(e.currentTarget)
    const currentFormData: Record<string, string> = {}
    data.forEach((value, key) => {
      if (typeof value === "string") {
        currentFormData[key] = value
      }
    })
    setFormData(currentFormData)

    // Check for duplicate submission
    const lastSubmission = localStorage.getItem("lastVolunteerSubmission")
    if (lastSubmission) {
      const parsed = JSON.parse(lastSubmission)
      const isSameEmail = parsed.email === currentFormData.email
      const isSameName =
        parsed.firstName === currentFormData["first-name"] && parsed.lastName === currentFormData["last-name"]
      const isRecent = new Date().getTime() - new Date(parsed.timestamp).getTime() < 24 * 60 * 60 * 1000 // 24 hours

      if (isSameEmail && isSameName && isRecent) {
        setShowDuplicateDialog(true)
        return
      }
    }

    // If not a duplicate, submit the form
    setSubmissionAttempt((prev) => prev + 1)
    startTransition(() => {
      formAction(data)
    })
  }

  const handleConfirmResubmit = () => {
    setShowDuplicateDialog(false)
    if (formRef.current) {
      const data = new FormData(formRef.current)
      setSubmissionAttempt((prev) => prev + 1)
      startTransition(() => {
        formAction(data)
      })
    }
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
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 form-touch-friendly" id="volunteer-form">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-sm sm:text-base">
              {t.volunteer.form.firstName} <span className="text-red-500">*</span>
            </Label>
            <Input id="first-name" name="first-name" required className="text-sm sm:text-base h-10 sm:h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-sm sm:text-base">
              {t.volunteer.form.lastName} <span className="text-red-500">*</span>
            </Label>
            <Input id="last-name" name="last-name" required className="text-sm sm:text-base h-10 sm:h-11" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base">
            {t.volunteer.form.email} <span className="text-red-500">*</span>
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
          <Label htmlFor="country" className="text-sm sm:text-base">
            {t.volunteer.form.country || "Country"}
          </Label>
          <Select name="country">
            <SelectTrigger id="country">
              <SelectValue placeholder={t.volunteer.form.selectCountry || "Select a country"} />
            </SelectTrigger>
            <SelectContent>
              {t.volunteer.countries?.map((country, index) => (
                <SelectItem key={index} value={country}>
                  {country}
                </SelectItem>
              )) || (
                <>
                  <SelectItem value="Rwanda">Rwanda</SelectItem>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Tanzania">Tanzania</SelectItem>
                  <SelectItem value="Burundi">Burundi</SelectItem>
                  <SelectItem value="DRC">Democratic Republic of Congo</SelectItem>
                  <SelectItem value="South Sudan">South Sudan</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </>
              )}
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
              {t.volunteer.opportunities?.list?.map((opportunity, index) => (
                <SelectItem key={index} value={opportunity.title}>
                  {opportunity.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedOpportunity && (
            <div className="bg-muted/40 border border-border text-muted-foreground rounded-md p-4 mt-2 text-sm space-y-2">
              <p>
                <strong>Description:</strong> {selectedOpportunity.description}
              </p>
              <p>
                <strong>Commitment:</strong> {selectedOpportunity.commitment}
              </p>
              <p>
                <strong>Skills Needed:</strong> {selectedOpportunity.skills?.join(", ")}
              </p>
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
          <Label htmlFor="motivation">
            {t.volunteer.form.motivation} <span className="text-red-500">*</span>
          </Label>
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
            {t.volunteer.form.terms} <span className="text-red-500">*</span>
          </Label>
        </div>

        {formState && !formState.success && formState.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{formState.message}</div>
        )}

        <SubmitButton text={t.volunteer.form.submit} loadingText={t.volunteer.form.submitting || "Submitting..."} />

        {/* Hidden field to track submission attempts */}
        <input type="hidden" name="submissionAttempt" value={submissionAttempt} />
      </form>

      {/* Duplicate submission dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Duplicate Submission Detected
            </DialogTitle>
            <DialogDescription>
              It looks like you've already submitted an application recently with the same email address. Do you want to
              submit again?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmResubmit}>Submit Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
