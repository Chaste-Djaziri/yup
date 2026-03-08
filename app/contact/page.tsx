"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { siteData } from "@/content/siteData";
import { invokePublicFunction } from "@/lib/edge";

type ContactForm = { firstName: string; lastName: string; email: string; subject: string; message: string };
const initialForm: ContactForm = { firstName: "", lastName: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.subject || !form.message) {
      setSuccess(false);
      setError("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await invokePublicFunction("submit-contact", form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : "Failed to submit contact form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Contact Us" subtitle="Reach out and we will respond as soon as possible." image="/yup-assets/contact-header.jpg" />
      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8"><article className="bg-card p-8"><h2 className="font-heading text-3xl">Send Us a Message</h2><p className="mt-3 text-foreground/70">Submit your message and our team will review it from the admin inbox.</p>{success ? (<div className="mt-6 border border-border bg-muted p-6 text-center"><p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Message Sent</p><h3 className="mt-2 font-heading text-2xl text-foreground">Thank you for contacting YUP</h3><p className="mt-3 text-sm text-foreground/80">Our team has received your message and will respond shortly.</p><button type="button" onClick={() => setSuccess(false)} className="mt-5 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Send Another Message</button></div>) : (<form onSubmit={handleSubmit} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><input type="text" placeholder="First name*" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border border-border px-4 py-3" required /><input type="text" placeholder="Last name*" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border border-border px-4 py-3" required /></div><input type="email" placeholder="Email*" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border px-4 py-3" required /><input type="text" placeholder="Subject*" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-border px-4 py-3" required /><textarea rows={5} placeholder="Your message*" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-border px-4 py-3" required />{error && <p className="text-sm text-foreground/70">{error}</p>}<button type="submit" disabled={submitting} className="w-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">{submitting ? "Sending..." : "Send Message"}</button></form>)}</article><article className="bg-card p-8"><h2 className="font-heading text-3xl">Contact Information</h2><div className="mt-6 space-y-5 text-foreground/80"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Address</p><p>{siteData.organization.location}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Email</p><p>{siteData.organization.email}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Phone</p><p>{siteData.organization.phone}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Office Hours</p><p>Monday-Friday: 8:30 AM - 5:00 PM</p><p>Saturday: 9:00 AM - 1:00 PM (By appointment)</p></div></div></article></div></section>
      <Footer />
    </div>
  );
}
