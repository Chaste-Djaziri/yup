"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteData } from "@/content/siteData";

const navItemClass = (active: boolean) =>
  [
    "font-body text-sm font-semibold uppercase tracking-wider transition-opacity",
    active ? "text-foreground underline underline-offset-4" : "text-foreground hover:opacity-80",
  ].join(" ");

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-border/70 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-5 lg:px-8">
        <Link href="/" className="font-heading text-xl leading-tight text-foreground">
          <span className="font-bold">YOUTH UPLIFT</span>
          <br />
          <span className="text-sm">INITIATIVE</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {siteData.nav.map((item) => (
            <Link key={item.label} href={item.href} className={navItemClass(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
          <Link href="/donate" className="bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
            Donate
          </Link>
        </div>

        <button className="text-foreground md:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="bg-white px-6 pb-6 md:hidden">
          {siteData.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-border/70 py-3 text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-block bg-primary px-6 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
          >
            Donate
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
