"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";
import { siteData } from "@/content/siteData";

export default function DonatePage() {
  const [amount, setAmount] = useState("50");
  const [frequency, setFrequency] = useState("one-time");
  const [method, setMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !amount) {
      setSuccess(false);
      setError("Please provide amount and email.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Make a Donation" subtitle="Your generosity helps us expand opportunities for youth across Rwanda." image="/yup-assets/donate-header.jpg" />
      <section className="bg-background py-16"><div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1.4fr,1fr] lg:px-8"><article className="bg-card p-8"><h2 className="font-heading text-3xl">Donation Form</h2><p className="mt-3 text-foreground/70">This is a static preview form. Payments are not processed in this version.</p>{success ? (<div className="mt-8 border border-border bg-muted p-6 text-center"><p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Donation Intent Captured</p><h3 className="mt-2 font-heading text-2xl text-foreground">Thank you for your support</h3><p className="mt-3 text-sm text-foreground/80">We appreciate your willingness to contribute to youth empowerment.</p><button type="button" onClick={() => setSuccess(false)} className="mt-5 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Make Another Donation</button></div>) : (<form onSubmit={handleSubmit} className="mt-6 space-y-5"><div><p className="text-sm font-semibold">Donation Frequency</p><div className="mt-2 flex gap-2">{[{ key: "one-time", label: "One-time" }, { key: "monthly", label: "Monthly" }].map((option) => (<button key={option.key} type="button" onClick={() => setFrequency(option.key)} className={["px-4 py-2 text-xs font-bold uppercase tracking-wider", frequency === option.key ? "bg-primary text-primary-foreground" : "border border-border bg-background"].join(" ")}>{option.label}</button>))}</div></div><div><p className="text-sm font-semibold">Amount (USD)</p><div className="mt-2 flex flex-wrap gap-2">{["20", "50", "100", "250"].map((value) => (<button key={value} type="button" onClick={() => setAmount(value)} className={["px-4 py-2 text-xs font-bold uppercase tracking-wider", amount === value ? "bg-primary text-primary-foreground" : "border border-border bg-background"].join(" ")}>${value}</button>))}<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32 border border-border px-3 py-2" /></div></div><div><p className="text-sm font-semibold">Payment Method</p><div className="mt-2 flex gap-2">{[{ key: "card", label: "Card" }, { key: "mobile-money", label: "Mobile Money" }, { key: "bank", label: "Bank Transfer" }].map((option) => (<button key={option.key} type="button" onClick={() => setMethod(option.key)} className={["px-4 py-2 text-xs font-bold uppercase tracking-wider", method === option.key ? "bg-primary text-primary-foreground" : "border border-border bg-background"].join(" ")}>{option.label}</button>))}</div></div><label className="block text-sm font-semibold">Email*<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-border px-4 py-3" required /></label>{error && <p className="text-sm text-foreground/70">{error}</p>}<button type="submit" className="w-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Confirm Donation</button></form>)}</article><article className="bg-card p-8"><h3 className="font-heading text-3xl">Why Your Donation Matters</h3><ul className="mt-5 list-disc space-y-2 pl-5 text-foreground/80"><li>Supports education and mentorship programs</li><li>Funds youth-led community initiatives</li><li>Improves access to digital learning opportunities</li><li>Strengthens long-term local impact</li></ul><h4 className="mt-8 font-heading text-2xl">Frequently Asked Questions</h4><div className="mt-4 space-y-3">{siteData.faqs.donate.map((faq) => (<article key={faq.question} className="border border-border bg-background p-4"><h5 className="font-semibold">{faq.question}</h5><p className="mt-2 text-sm text-foreground/70">{faq.answer}</p></article>))}</div></article></div></section>
      <Footer />
    </div>
  );
}
