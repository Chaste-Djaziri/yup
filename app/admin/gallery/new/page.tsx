"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const defaultGalleryForm = {
  title: "",
  category: "events" as "events" | "programs" | "community",
  sort_order: 0,
  is_visible: true,
};

export default function AdminNewGalleryPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [galleryForm, setGalleryForm] = useState(defaultGalleryForm);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);

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
      router.push("/admin/gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Upload Gallery Image</h2>
        <Link href="/admin/gallery" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Gallery</Link>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={create} className="bg-card p-6 space-y-4">
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
    </section>
  );
}
