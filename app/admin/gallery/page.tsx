"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { DbGalleryGroup } from "@/types/backend";

export default function AdminGalleryPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<DbGalleryGroup[]>([]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ groups: DbGalleryGroup[] }>("admin-gallery-groups-list");
      setGroups(res.groups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return groups;
    return groups.filter((item) => [item.title, item.slug, item.description, item.is_visible ? "visible" : "hidden"].join(" ").toLowerCase().includes(value));
  }, [groups, query]);

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-groups-update", { id, is_visible: !isVisible });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Visibility update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this gallery group and all group photos permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-groups-delete", { id });
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
        <h2 className="font-heading text-3xl">Gallery Groups</h2>
        <div className="flex gap-2">
          <Link href="/admin/gallery/new" className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Create Group</Link>
          <Button variant="outline" onClick={load} disabled={busy}>Refresh</Button>
        </div>
      </div>
      <Input placeholder="Search gallery groups" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading gallery groups...</p> : null}
      <div className="space-y-3">
        {filtered.map((group) => (
          <article key={group.id} className="bg-card p-4">
            <div className="grid gap-4 md:grid-cols-[220px,1fr]">
              <img src={group.cover_image_url} alt={group.title} className="h-36 w-full object-cover" />
              <div>
                <h3 className="font-semibold">{group.title}</h3>
                <p className="text-sm text-foreground/70">/{group.slug} • sort {group.sort_order} • {(group.photo_count || 0).toString()} photos</p>
                <p className="text-sm text-foreground/80">{group.description || "No description."}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-foreground/70">{group.is_visible ? "visible" : "hidden"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href={`/gallery/${group.slug}`} className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View Public</Link>
                  <Link href={`/admin/gallery/${group.id}/edit`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Edit Group</Link>
                  <Button size="sm" variant="outline" onClick={() => toggleVisibility(group.id, group.is_visible)} disabled={busy}>
                    {group.is_visible ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(group.id)} disabled={busy}>Delete</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No gallery groups found.</p> : null}
    </section>
  );
}
