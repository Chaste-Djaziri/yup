"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { DbGalleryImage } from "@/types/backend";

export default function AdminEditGalleryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [item, setItem] = useState<DbGalleryImage | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "events" as "events" | "programs" | "community",
    sort_order: 0,
    is_visible: true,
  });

  const selectedImagePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);

  useEffect(() => {
    return () => {
      if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
    };
  }, [selectedImagePreview]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ images: DbGalleryImage[] }>("admin-gallery-list");
      const found = (res.images || []).find((x) => x.id === params.id) || null;
      setItem(found);
      if (found) {
        setForm({
          title: found.title,
          category: found.category,
          sort_order: found.sort_order,
          is_visible: found.is_visible,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      setError("");
      let image_url: string | undefined;
      let cloudinary_public_id: string | undefined;

      if (imageFile) {
        const uploaded = await uploadImageToCloudinary(imageFile);
        image_url = uploaded.secureUrl;
        cloudinary_public_id = uploaded.publicId;
      }

      await invokeFunction("admin-gallery-update", {
        id: params.id,
        ...form,
        image_url,
        cloudinary_public_id,
      });

      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this gallery image permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-delete", { id: params.id });
      router.push("/admin/gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground/70">Loading gallery image...</p>;
  if (!item) return <p className="text-sm text-foreground/70">Gallery image not found.</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Edit Gallery Image</h2>
        <div className="flex gap-2">
          <a href={item.image_url} target="_blank" rel="noreferrer" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View Original</a>
          <Link href="/admin/gallery" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Gallery</Link>
        </div>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={save} className="bg-card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Category
            <Select value={form.category} onValueChange={(value) => setForm((prev) => ({ ...prev, category: value as "events" | "programs" | "community" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="events">events</SelectItem>
                <SelectItem value="programs">programs</SelectItem>
                <SelectItem value="community">community</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Sort Order<Input type="number" value={form.sort_order} onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))} /></Label>
          <Label>Visibility
            <Select value={form.is_visible ? "visible" : "hidden"} onValueChange={(value) => setForm((prev) => ({ ...prev, is_visible: value === "visible" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">visible</SelectItem>
                <SelectItem value="hidden">hidden</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <Label>
          Replace Image
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </Label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">Current Image</p>
            <img src={item.image_url} alt={item.title} className="h-auto max-w-full" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">New Image Preview</p>
            {selectedImagePreview ? (
              <img src={selectedImagePreview} alt="Selected replacement preview" className="h-auto max-w-full" />
            ) : (
              <div className="flex h-48 items-center justify-center border border-border text-sm text-foreground/70">Select a file to preview replacement</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Image"}</Button>
          <Button type="button" variant="outline" onClick={remove} disabled={busy}>Delete Image</Button>
        </div>
      </form>
    </section>
  );
}
