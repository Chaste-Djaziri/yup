"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { DbGalleryImage } from "@/types/backend";

const defaultGalleryForm = {
  title: "",
  category: "events" as "events" | "programs" | "community",
  sort_order: 0,
  is_visible: true,
};

export default function AdminGalleryPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<DbGalleryImage[]>([]);
  const [galleryForm, setGalleryForm] = useState(defaultGalleryForm);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ images: DbGalleryImage[] }>("admin-gallery-list");
      setImages(res.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery images");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!galleryImageFile) {
      setError("Please select an image file for gallery upload.");
      return;
    }

    setBusy(true);
    try {
      setError("");
      const uploaded = await uploadImageToCloudinary(galleryImageFile);
      await invokeFunction("admin-gallery-create", {
        ...galleryForm,
        image_url: uploaded.secureUrl,
        cloudinary_public_id: uploaded.publicId,
      });
      setGalleryForm(defaultGalleryForm);
      setGalleryImageFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const updateVisibility = async (id: string, is_visible: boolean) => {
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-update", { id, is_visible });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
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
      <h2 className="font-heading text-3xl">Gallery</h2>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={create} className="bg-card p-6 space-y-4">
        <h3 className="font-heading text-2xl">Upload Gallery Image</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={galleryForm.title} onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Category
            <Select value={galleryForm.category} onValueChange={(value) => setGalleryForm((prev) => ({ ...prev, category: value as "events" | "programs" | "community" }))}>
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
          <Label>Sort Order<Input type="number" value={galleryForm.sort_order} onChange={(e) => setGalleryForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))} /></Label>
          <Label>Visibility
            <Select value={galleryForm.is_visible ? "visible" : "hidden"} onValueChange={(value) => setGalleryForm((prev) => ({ ...prev, is_visible: value === "visible" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">visible</SelectItem>
                <SelectItem value="hidden">hidden</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <Label>Image File<Input type="file" accept="image/*" onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)} required /></Label>
        <Button type="submit" disabled={busy}>{busy ? "Uploading..." : "Upload Gallery Image"}</Button>
      </form>

      <div className="space-y-3">
        {images.map((image) => (
          <article key={image.id} className="bg-card p-4">
            <div className="grid gap-4 md:grid-cols-[180px,1fr]">
              <img src={image.image_url} alt={image.title} className="h-32 w-full object-cover" />
              <div>
                <h3 className="font-semibold">{image.title}</h3>
                <p className="text-sm text-foreground/70">{image.category} • sort {image.sort_order}</p>
                <p className="text-xs uppercase tracking-wider text-foreground/70">{image.is_visible ? "visible" : "hidden"}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateVisibility(image.id, !image.is_visible)} disabled={busy}>
                    {image.is_visible ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(image.id)} disabled={busy}>Delete</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
