import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/PageHero";

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Make a Donation"
        subtitle="Support Youth Uplift Initiative through MTN Mobile Money."
        image="/yup-assets/donate-header.jpg"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1.4fr,1fr] lg:px-8">
          <article className="bg-card p-8">
            <h2 className="font-heading text-3xl">MTN Mobile Money</h2>
            <p className="mt-3 text-foreground/80">Send your donation via MTN Mobile Money.</p>

            <div className="mt-6 border border-border bg-background p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">Send your donation to:</p>
              <p className="mt-2 font-heading text-3xl text-primary">+250 788 749 709</p>
            </div>

            <ol className="mt-6 space-y-2 text-foreground/80">
              <li>1. Dial *182# on your MTN phone</li>
              <li>2. Select "Send Money"</li>
              <li>3. Enter the number above</li>
              <li>4. Enter your donation amount</li>
            </ol>
          </article>

          <article className="bg-card p-8">
            <h3 className="font-heading text-3xl">No Mobile Money?</h3>
            <p className="mt-4 text-foreground/80">
              If you do not have MTN Mobile Money, contact us by email or use the contact form and we will guide you on
              other ways to support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:contact.yupinitiative@gmail.com"
                className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
              >
                Email Us
              </a>
              <Link
                href="/contact"
                className="border border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary"
              >
                Contact Form
              </Link>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
