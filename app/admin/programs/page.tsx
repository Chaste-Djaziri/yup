"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { DbProgram } from "@/types/backend";

export default function AdminProgramsPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [programs, setPrograms] = useState<DbProgram[]>([]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ programs: DbProgram[] }>("admin-programs-list");
      setPrograms(res.programs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return programs;
    return programs.filter((item) =>
      [item.title, item.slug, item.category, item.status].join(" ").toLowerCase().includes(value),
    );
  }, [programs, query]);

  const quickStatus = async (id: string, status: DbProgram["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-programs-update", { id, status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this program permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-programs-delete", { id });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Programs</h2>
        <div className="flex gap-2">
          <Link href="/admin/programs/new" className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            New Program
          </Link>
          <Button variant="outline" onClick={load} disabled={busy}>Refresh</Button>
        </div>
      </div>
      <Input placeholder="Search programs" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading programs...</p> : null}
      <div className="space-y-3">
        {filtered.map((program) => (
          <article key={program.id} className="bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{program.title}</h3>
                <p className="text-sm text-foreground/70">/{program.slug} • {program.category}</p>
                <p className="text-xs uppercase tracking-wider text-foreground/70">{program.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/programs/${program.slug}`} target="_blank" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">
                  View
                </Link>
                <Link href={`/admin/programs/${program.id}/edit`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Edit
                </Link>
                <Button size="sm" variant="outline" onClick={() => quickStatus(program.id, "published")} disabled={busy}>Publish</Button>
                <Button size="sm" variant="outline" onClick={() => quickStatus(program.id, "draft")} disabled={busy}>Draft</Button>
                <Button size="sm" variant="outline" onClick={() => quickStatus(program.id, "archived")} disabled={busy}>Archive</Button>
                <Button size="sm" variant="outline" onClick={() => remove(program.id)} disabled={busy}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No programs found.</p> : null}
    </section>
  );
}
