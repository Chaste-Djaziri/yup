"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { siteData } from "@/content/siteData";
import { invokePublicFunction } from "@/lib/edge";

type PartnerForm = {
  fullName: string;
  email: string;
  organizationName: string;
  partnerType: string;
  partnershipGoal: string;
  message: string;
  phone: string;
  website: string;
  country: string;
};

const initialForm: PartnerForm = {
  fullName: "",
  email: "",
  organizationName: "",
  partnerType: "",
  partnershipGoal: "",
  message: "",
  phone: "",
  website: "",
  country: "",
};

const partnerTypes = ["Company", "NGO", "School", "University", "Faith-Based Organization", "Community Group", "Government", "Other"];

export default function PartnerWithUsPage() {
  const [form, setForm] = useState<PartnerForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.organizationName || !form.partnerType || !form.partnershipGoal || !form.message) {
      setSuccess(false);
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await invokePublicFunction("submit-partner", form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : "Failed to submit partnership inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Partner With Us"
        subtitle="Collaborate with YUP to expand opportunities for youth in Rwanda through strategic partnerships."
        image="/yup-assets/contact-header.jpg"
      />
      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8">
          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">Partnership Inquiry Form</h2>
            <p className="mt-3 text-foreground/70">Tell us about your organization and partnership goals. Our team reviews each request from the admin dashboard.</p>
            {success ? (
              <div className="mt-6 border border-emerald-300 bg-emerald-50 p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Inquiry Sent</p>
                <h3 className="mt-2 font-heading text-2xl text-emerald-900">Thank you for your partnership interest</h3>
                <p className="mt-3 text-sm text-emerald-800">We have received your inquiry and will follow up soon.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-5 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Full Name*"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full border border-border px-4 py-3"
                  required
                />
                <input
                  type="email"
                  placeholder="Email*"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-border px-4 py-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Organization Name*"
                  value={form.organizationName}
                  onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                  className="w-full border border-border px-4 py-3"
                  required
                />
                <select
                  value={form.partnerType}
                  onChange={(e) => setForm({ ...form, partnerType: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3"
                  required
                >
                  <option value="">Partner Type*</option>
                  {partnerTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Partnership Goal*"
                  value={form.partnershipGoal}
                  onChange={(e) => setForm({ ...form, partnershipGoal: e.target.value })}
                  className="w-full border border-border px-4 py-3"
                  required
                />
                <textarea
                  rows={5}
                  placeholder="Tell us about your proposal*"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-border px-4 py-3"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-border px-4 py-3"
                  />
                  <input
                    type="text"
                    placeholder="Country (optional)"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-border px-4 py-3"
                  />
                </div>
                <input
                  type="url"
                  placeholder="Website (optional)"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full border border-border px-4 py-3"
                />
                {error && <p className="text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
                >
                  {submitting ? "Submitting..." : "Submit Partnership Inquiry"}
                </button>
              </form>
            )}
          </article>

          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">Why Partner with YUP?</h2>
            <p className="mt-4 text-foreground/80">
              We collaborate with organizations, institutions, and communities to scale youth-focused impact across education,
              leadership, and community development.
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-foreground/80">
              <li>Co-design meaningful projects with local relevance</li>
              <li>Support youth empowerment through practical initiatives</li>
              <li>Build sustainable long-term partnerships</li>
            </ul>

            <h3 className="mt-8 font-heading text-2xl">Direct Contact</h3>
            <div className="mt-4 space-y-2 text-foreground/80">
              <p><strong>Email:</strong> {siteData.organization.email}</p>
              <p><strong>Phone:</strong> {siteData.organization.phone}</p>
              <p><strong>Location:</strong> {siteData.organization.location}</p>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </div>
  );
}
