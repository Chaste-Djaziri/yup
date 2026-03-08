"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="max-w-lg bg-background p-8 text-center">
        <h1 className="mb-3 font-heading text-5xl text-primary">404</h1>
        <p className="mb-2 text-xl">Page not found</p>
        <p className="mb-6 text-sm text-muted-foreground">
          No route matches: <code>{pathname}</code>
        </p>
        <Link href="/" className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          Return Home
        </Link>
      </div>
    </div>
  );
}
