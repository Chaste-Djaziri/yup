"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminDashboardSkeleton } from "@/components/skeletons/content-loading";
import { supabase } from "@/lib/supabase";
import { invokePublicFunction } from "@/lib/edge";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/volunteers", label: "Volunteers" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/logs", label: "Email Logs" },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const allowSignup = process.env.NODE_ENV === "development";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setSessionReady(true);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const activeHref = useMemo(() => {
    const matched = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
    return matched?.href;
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    setAuthError("");
    if (!allowSignup) {
      setAuthError("Signup is disabled outside development.");
      return;
    }
    try {
      await invokePublicFunction("admin-signup", { email, password });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!loading && !sessionReady) return null;
  if (loading || !sessionReady) return <AdminDashboardSkeleton />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted px-4 py-16">
        <div className="mx-auto max-w-md bg-background p-8">
          <h1 className="font-heading text-3xl">Admin Login</h1>
          <p className="mt-2 text-sm text-foreground/70">Use your admin account to manage submissions and content.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Label>
              Email
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Label>
            <Label>
              Password
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Label>
            {authError && <p className="text-sm text-foreground/70">{authError}</p>}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Login</Button>
              {allowSignup ? (
                <Button type="button" variant="outline" className="flex-1" onClick={handleSignup}>
                  Create Account
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-4xl">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-semibold ${activeHref === item.href ? "bg-primary text-primary-foreground" : "border border-border text-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
