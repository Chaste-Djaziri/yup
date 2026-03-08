"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { siteData } from "@/content/siteData";
import { invokePublicFunction } from "@/lib/edge";
import { BulletListSkeleton } from "@/components/skeletons/content-loading";
import type { DbProgram } from "@/types/backend";

type VolunteerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  opportunity: string;
  motivation: string;
};

const initialForm: VolunteerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  opportunity: "",
  motivation: "",
};

const countryOptions = ["Rwanda", "United States", "United Kingdom", "Kenya", "Uganda", "Tanzania", "Canada", "Germany", "France", "Australia"];

export default function VolunteerPage() {
  const [form, setForm] = useState<VolunteerForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/functions/programs-list")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load opportunities");
        return (data.programs || []) as DbProgram[];
      })
      .then((programs) => {
        if (!active) return;
        setOpportunities(programs.map((program) => program.title));
      })
      .catch(() => {
        if (!active) return;
        setOpportunities([]);
      })
      .finally(() => {
        if (!active) return;
        setLoadingOpportunities(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const hasOpportunities = useMemo(() => opportunities.length > 0, [opportunities]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.country || !form.opportunity || !form.motivation) {
      setSuccess(false);
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await invokePublicFunction("submit-volunteer", form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : "Failed to submit volunteer application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Volunteer With Us"
        subtitle="Join a community of volunteers creating meaningful change for youth in Rwanda."
        image="/yup-assets/volunteer-header.jpg"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8">
          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">Why Volunteer With YUP?</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-foreground/80">
              {siteData.volunteerBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>

          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">Available Program Opportunities</h2>
            <ul className="mt-5 grid gap-2 text-foreground/80 sm:grid-cols-2">
              {loadingOpportunities && <BulletListSkeleton rows={8} />}
              {!loadingOpportunities && opportunities.map((opportunity) => <li key={opportunity}>• {opportunity}</li>)}
              {!loadingOpportunities && opportunities.length === 0 && <li>No published programs yet.</li>}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-beige py-16" id="volunteer-form">
        <div className="container mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center font-heading text-4xl text-primary">Volunteer Application</h2>
          <p className="mt-3 text-center text-foreground/70">Applications are sent to our admin team for review and response.</p>

          {success ? (
            <div className="mt-8 border border-border bg-muted p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Application Submitted</p>
              <h3 className="mt-2 font-heading text-3xl text-foreground">Thank you for volunteering</h3>
              <p className="mt-3 text-sm text-foreground/80">Your application is in our review queue. We will contact you with the next steps.</p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-5 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 bg-background p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  First Name*
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="mt-1 w-full border border-border px-4 py-3"
                    required
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Last Name*
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="mt-1 w-full border border-border px-4 py-3"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold">
                Email*
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full border border-border px-4 py-3"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Phone Number*
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full border border-border px-4 py-3"
                    required
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Country of Residence*
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="mt-1 w-full border border-border bg-background px-4 py-3"
                    required
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm font-semibold">
                Preferred Opportunity*
                <select
                  value={form.opportunity}
                  onChange={(e) => setForm({ ...form, opportunity: e.target.value })}
                  className="mt-1 w-full border border-border bg-background px-4 py-3"
                  required
                  disabled={!hasOpportunities || loadingOpportunities}
                >
                  <option value="">
                    {loadingOpportunities ? "Loading opportunities..." : hasOpportunities ? "Select opportunity" : "No opportunities available"}
                  </option>
                  {opportunities.map((opportunity) => (
                    <option key={opportunity} value={opportunity}>
                      {opportunity}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold">
                Motivation*
                <textarea
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  className="mt-1 w-full border border-border px-4 py-3"
                  rows={5}
                  required
                />
              </label>

              {error && <p className="text-sm text-foreground/70">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !hasOpportunities || loadingOpportunities}
                className="w-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
