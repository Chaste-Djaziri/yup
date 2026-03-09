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

const defaultGroupForm = {
  title: "",
  slug: "",
  description: "",
  sort_order: 0,
  is_visible: true,
};

export default function AdminNewGalleryPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [groupForm, setGroupForm] = useState(defaultGroupForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverFile) {
      setError("Please select a cover image file.");
      return;
    }

    setBusy(true);
    try {
      setError("");
      const uploaded = await uploadImageToCloudinary(coverFile);
      await invokeFunction("admin-gallery-groups-create", {
        ...groupForm,
        cover_image_url: uploaded.secureUrl,
        cover_cloudinary_public_id: uploaded.publicId,
      });
      router.push("/admin/gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create group failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Create Gallery Group</h2>
        <Link href="/admin/gallery" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Gallery</Link>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={create} className="bg-card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={groupForm.title} onChange={(e) => setGroupForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Slug (optional)<Input value={groupForm.slug} onChange={(e) => setGroupForm((prev) => ({ ...prev, slug: e.target.value }))} placeholder="auto-from-title" /></Label>
        </div>
        <Label>
          Description
          <textarea
            value={groupForm.description}
            onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))}
            className="mt-1 min-h-28 w-full border border-border bg-background px-3 py-2 text-sm"
          />
        </Label>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Sort Order<Input type="number" value={groupForm.sort_order} onChange={(e) => setGroupForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))} /></Label>
          <Label>Visibility
            <Select value={groupForm.is_visible ? "visible" : "hidden"} onValueChange={(value) => setGroupForm((prev) => ({ ...prev, is_visible: value === "visible" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">visible</SelectItem>
                <SelectItem value="hidden">hidden</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <Label>Cover Image File<Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} required /></Label>
        <Button type="submit" disabled={busy}>{busy ? "Creating..." : "Create Gallery Group"}</Button>
      </form>
    </section>
  );
}
