"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { VolunteerApplication } from "@/types/backend";

export default function AdminVolunteersPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);

  const fetchVolunteers = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ volunteers: VolunteerApplication[] }>("admin-volunteers-list");
      setVolunteers(res.volunteers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return volunteers;
    return volunteers.filter((item) =>
      [item.first_name, item.last_name, item.email, item.country || "", item.opportunity || "", item.status].join(" ").toLowerCase().includes(value),
    );
  }, [volunteers, query]);

  const deleteVolunteer = async (id: string) => {
    if (!window.confirm("Delete this volunteer application permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-volunteers-delete", { id });
      await fetchVolunteers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Volunteers</h2>
        <Button variant="outline" onClick={fetchVolunteers} disabled={busy}>Refresh</Button>
      </div>
      <Input placeholder="Search volunteer applications" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading volunteers...</p> : null}
      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.first_name} {item.last_name}</h3>
                <p className="text-sm text-foreground/70">{item.email} • {item.country || "N/A"}</p>
                <p className="text-sm text-foreground/70">Opportunity: {item.opportunity || "N/A"}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{item.status}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/volunteers/${item.id}`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Open
                </Link>
                <Button size="sm" variant="outline" onClick={() => deleteVolunteer(item.id)} disabled={busy}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No volunteer applications found.</p> : null}
    </section>
  );
}
