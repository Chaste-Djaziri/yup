"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { ContactSubmission } from "@/types/backend";

export default function AdminContactsPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  const fetchContacts = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ contacts: ContactSubmission[] }>("admin-contacts-list");
      setContacts(res.contacts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return contacts;
    return contacts.filter((item) =>
      [item.first_name, item.last_name, item.email, item.subject, item.status].join(" ").toLowerCase().includes(value),
    );
  }, [contacts, query]);

  const deleteContact = async (id: string) => {
    if (!window.confirm("Delete this contact submission permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-contacts-delete", { id });
      await fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Contacts</h2>
        <Button variant="outline" onClick={fetchContacts} disabled={busy}>Refresh</Button>
      </div>
      <Input placeholder="Search contacts" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading contacts...</p> : null}
      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.first_name} {item.last_name}</h3>
                <p className="text-sm text-foreground/70">{item.email} • {item.subject}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{item.status}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/contacts/${item.id}`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Open
                </Link>
                <Button size="sm" variant="outline" onClick={() => deleteContact(item.id)} disabled={busy}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No contact submissions found.</p> : null}
    </section>
  );
}
