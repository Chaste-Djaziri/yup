"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { DbEvent } from "@/types/backend";

export default function AdminEventsPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<DbEvent[]>([]);

  const fetchEvents = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ events: DbEvent[] }>("admin-events-list");
      setEvents(res.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return events;
    return events.filter((item) =>
      [item.title, item.slug, item.location || "", item.status].join(" ").toLowerCase().includes(value),
    );
  }, [events, query]);

  const quickStatus = async (id: string, status: DbEvent["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-events-update", { id, status });
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-events-delete", { id });
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Events</h2>
        <div className="flex gap-2">
          <Link href="/admin/events/new" className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            New Event
          </Link>
          <Button variant="outline" onClick={fetchEvents} disabled={busy}>Refresh</Button>
        </div>
      </div>
      <Input placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading events...</p> : null}
      <div className="space-y-3">
        {filtered.map((event) => (
          <article key={event.id} className="bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-foreground/70">/{event.slug}</p>
                <p className="text-sm text-foreground/70">{new Date(event.event_start).toLocaleString()} • {event.location || "N/A"}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{event.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/events/${event.slug}`} target="_blank" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">
                  View
                </Link>
                <Link href={`/admin/events/${event.id}/edit`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Edit
                </Link>
                <Button size="sm" variant="outline" onClick={() => quickStatus(event.id, "published")} disabled={busy}>Publish</Button>
                <Button size="sm" variant="outline" onClick={() => quickStatus(event.id, "draft")} disabled={busy}>Draft</Button>
                <Button size="sm" variant="outline" onClick={() => quickStatus(event.id, "archived")} disabled={busy}>Archive</Button>
                <Button size="sm" variant="outline" onClick={() => deleteEvent(event.id)} disabled={busy}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No events found.</p> : null}
    </section>
  );
}
