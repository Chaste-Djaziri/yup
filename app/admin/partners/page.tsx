"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { PartnerSubmission } from "@/types/backend";

export default function AdminPartnersPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [partners, setPartners] = useState<PartnerSubmission[]>([]);

  const fetchPartners = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ partners: PartnerSubmission[] }>("admin-partners-list");
      setPartners(res.partners || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return partners;
    return partners.filter((item) =>
      [item.full_name, item.email, item.organization_name, item.partner_type, item.status].join(" ").toLowerCase().includes(value),
    );
  }, [partners, query]);

  const deletePartner = async (id: string) => {
    if (!window.confirm("Delete this partner submission permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-partners-delete", { id });
      await fetchPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Partners</h2>
        <Button variant="outline" onClick={fetchPartners} disabled={busy}>Refresh</Button>
      </div>
      <Input placeholder="Search partner inquiries" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading partner inquiries...</p> : null}
      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.full_name}</h3>
                <p className="text-sm text-foreground/70">{item.email} • {item.organization_name}</p>
                <p className="text-sm text-foreground/70">{item.partner_type} • {item.partnership_goal}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{item.status}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/partners/${item.id}`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Open
                </Link>
                <Button size="sm" variant="outline" onClick={() => deletePartner(item.id)} disabled={busy}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No partner inquiries found.</p> : null}
    </section>
  );
}
