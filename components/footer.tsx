"use client";

import Link from "next/link";
import { ArrowUp, Instagram } from "lucide-react";
import { siteData } from "@/content/siteData";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Link href="/" className="font-heading text-xl leading-tight">
              <span className="font-bold">YOUTH UPLIFT</span>
              <br />
              <span className="text-sm">INITIATIVE</span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/80">{siteData.organization.mission}</p>
          </div>
          <Link href="/donate" className="bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90">
            Donate
          </Link>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {siteData.footerColumns.map((column) => (
              <div key={column.heading}>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em]">{column.heading}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em]">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/yupinitiative/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteData.organization.name}. Reach us at {siteData.organization.email}.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"
            aria-label="Back to top"
          >
            <ArrowUp size={16} className="text-primary-foreground" />
          </button>
        </div>

        <div className="mt-6 border-t border-primary-foreground/10 pt-4 text-center text-primary-foreground/70">
          <h4 className="text-sm font-semibold">Acknowledgments</h4>
          <p className="mt-2 text-sm">Special thanks to Chaste Djaziri for invaluable support in developing our website.</p>
          <p className="mt-1 text-sm">
            Website developed by{" "}
            <a href="https://micorp.pro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Micorp
            </a>
            , a professional software services company.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
