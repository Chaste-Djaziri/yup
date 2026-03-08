"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { DbGalleryImage } from "@/types/backend";

export default function AdminGalleryPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<DbGalleryImage[]>([]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ images: DbGalleryImage[] }>("admin-gallery-list");
      setImages(res.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return images;
    return images.filter((item) => [item.title, item.category, item.is_visible ? "visible" : "hidden"].join(" ").toLowerCase().includes(value));
  }, [images, query]);

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-update", { id, is_visible: !isVisible });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Visibility update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this gallery image permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-delete", { id });
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
        <h2 className="font-heading text-3xl">Gallery</h2>
        <div className="flex gap-2">
          <Link href="/admin/gallery/new" className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Upload Image</Link>
          <Button variant="outline" onClick={load} disabled={busy}>Refresh</Button>
        </div>
      </div>
      <Input placeholder="Search gallery images" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading gallery images...</p> : null}
      <div className="space-y-3">
        {filtered.map((image) => (
          <article key={image.id} className="bg-card p-4">
            <div className="grid gap-4 md:grid-cols-[180px,1fr]">
              <img src={image.image_url} alt={image.title} className="h-32 w-full object-cover" />
              <div>
                <h3 className="font-semibold">{image.title}</h3>
                <p className="text-sm text-foreground/70">{image.category} • sort {image.sort_order}</p>
                <p className="text-xs uppercase tracking-wider text-foreground/70">{image.is_visible ? "visible" : "hidden"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a href={image.image_url} target="_blank" rel="noreferrer" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View</a>
                  <Link href={`/admin/gallery/${image.id}/edit`} className="bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Edit</Link>
                  <Button size="sm" variant="outline" onClick={() => toggleVisibility(image.id, image.is_visible)} disabled={busy}>
                    {image.is_visible ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(image.id)} disabled={busy}>Delete</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No gallery images found.</p> : null}
    </section>
  );
}
