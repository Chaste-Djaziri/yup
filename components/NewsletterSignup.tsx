"use client";

import { FormEvent, useState } from "react";
import { invokePublicFunction } from "@/lib/edge";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterSignupProps = {
  title?: string;
  className?: string;
};

const NewsletterSignup = ({ title = "Stay updated with YUP news and events", className = "section-beige py-16" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailRegex.test(email.trim())) {
      setSuccess(false);
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    invokePublicFunction("newsletter-subscribe", { email: email.trim() })
      .then(() => {
        setSuccess(true);
        setEmail("");
      })
      .catch((err) => {
        setSuccess(false);
        setError(err instanceof Error ? err.message : "Failed to subscribe.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <section className={className}>
      <div className="container mx-auto max-w-xl px-4 lg:px-8">
        <h2 className="mb-4 text-center font-heading text-3xl">{title}</h2>
        <p className="mb-6 text-center text-foreground/70">Subscribe for updates on programs, events, and community stories.</p>

        {success ? (
          <div className="border border-emerald-300 bg-emerald-50 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Subscribed</p>
            <h3 className="mt-2 font-heading text-2xl text-emerald-900">Welcome to YUP updates</h3>
            <p className="mt-3 text-sm text-emerald-800">You are on the list and will receive our latest news and events.</p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-5 bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
            >
              Add Another Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="font-body text-sm font-semibold">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </label>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
