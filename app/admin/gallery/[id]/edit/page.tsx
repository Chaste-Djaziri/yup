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
import type { DbGalleryGroup, DbGalleryGroupPhoto } from "@/types/backend";

export default function AdminEditGalleryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [group, setGroup] = useState<DbGalleryGroup | null>(null);
  const [photos, setPhotos] = useState<DbGalleryGroupPhoto[]>([]);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);

  const [groupForm, setGroupForm] = useState({
    title: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_visible: true,
  });

  const [newPhotoForm, setNewPhotoForm] = useState({
    title: "",
    sort_order: 0,
  });

  const [photoDrafts, setPhotoDrafts] = useState<Record<string, { title: string; sort_order: number }>>({});

  const coverPreview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile]);
  const newPhotoPreview = useMemo(() => (newPhotoFile ? URL.createObjectURL(newPhotoFile) : null), [newPhotoFile]);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      if (newPhotoPreview) URL.revokeObjectURL(newPhotoPreview);
    };
  }, [coverPreview, newPhotoPreview]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ groups: DbGalleryGroup[]; photos: DbGalleryGroupPhoto[] }>("admin-gallery-groups-list", { id: params.id });
      const found = (res.groups || [])[0] || null;
      if (!found) {
        setGroup(null);
        setPhotos([]);
        return;
      }

      setGroup(found);
      setPhotos(res.photos || []);
      setGroupForm({
        title: found.title,
        slug: found.slug,
        description: found.description || "",
        sort_order: found.sort_order,
        is_visible: found.is_visible,
      });

      const draftMap: Record<string, { title: string; sort_order: number }> = {};
      for (const photo of res.photos || []) {
        draftMap[photo.id] = { title: photo.title || "", sort_order: photo.sort_order };
      }
      setPhotoDrafts(draftMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery group");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const saveGroup = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      setError("");
      let cover_image_url: string | undefined;
      let cover_cloudinary_public_id: string | undefined;

      if (coverFile) {
        const uploaded = await uploadImageToCloudinary(coverFile);
        cover_image_url = uploaded.secureUrl;
        cover_cloudinary_public_id = uploaded.publicId;
      }

      await invokeFunction("admin-gallery-groups-update", {
        id: params.id,
        ...groupForm,
        cover_image_url,
        cover_cloudinary_public_id,
      });

      await load();
      setCoverFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Group update failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteGroup = async () => {
    if (!window.confirm("Delete this gallery group and all photos permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-gallery-groups-delete", { id: params.id });
      router.push("/admin/gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Group delete failed");
      setBusy(false);
    }
  };

  const addPhoto = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPhotoFile || !group) {
      setError("Please choose a photo file to upload.");
      return;
    }

    setBusy(true);
    try {
      setError("");
      const uploaded = await uploadImageToCloudinary(newPhotoFile);
      await invokeFunction("admin-gallery-group-photos-create", {
        group_id: group.id,
        title: newPhotoForm.title,
        sort_order: newPhotoForm.sort_order,
        image_url: uploaded.secureUrl,
        cloudinary_public_id: uploaded.publicId,
      });

      setNewPhotoForm({ title: "", sort_order: 0 });
      setNewPhotoFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setBusy(false);
    }
  };

  const savePhoto = async (id: string) => {
    const draft = photoDrafts[id];
    if (!draft) return;

    setBusy(true);
    try {
      setError("");
      await invokeFunction("admin-gallery-group-photos-update", {
        id,
        title: draft.title,
        sort_order: draft.sort_order,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo update failed");
    } finally {
      setBusy(false);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!window.confirm("Delete this photo permanently?")) return;

    setBusy(true);
    try {
      setError("");
      await invokeFunction("admin-gallery-group-photos-delete", { id });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo delete failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground/70">Loading gallery group...</p>;
  if (!group) return <p className="text-sm text-foreground/70">Gallery group not found.</p>;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Edit Gallery Group</h2>
        <div className="flex gap-2">
          <Link href={`/gallery/${group.slug}`} className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View Public</Link>
          <Link href="/admin/gallery" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Gallery</Link>
        </div>
      </div>

      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}

      <form onSubmit={saveGroup} className="bg-card p-6 space-y-4">
        <h3 className="font-heading text-2xl">Group Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={groupForm.title} onChange={(e) => setGroupForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Slug<Input value={groupForm.slug} onChange={(e) => setGroupForm((prev) => ({ ...prev, slug: e.target.value }))} required /></Label>
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

        <Label>Replace Cover Image<Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} /></Label>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">Current Cover</p>
            <img src={group.cover_image_url} alt={group.title} className="h-52 w-full object-cover" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">New Cover Preview</p>
            {coverPreview ? (
              <img src={coverPreview} alt="Selected cover preview" className="h-52 w-full object-cover" />
            ) : (
              <div className="flex h-52 items-center justify-center border border-border text-sm text-foreground/70">Select a file to preview replacement</div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Group"}</Button>
          <Button type="button" variant="outline" onClick={deleteGroup} disabled={busy}>Delete Group</Button>
        </div>
      </form>

      <form onSubmit={addPhoto} className="bg-card p-6 space-y-4">
        <h3 className="font-heading text-2xl">Add Photo</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Photo Title (optional)<Input value={newPhotoForm.title} onChange={(e) => setNewPhotoForm((prev) => ({ ...prev, title: e.target.value }))} /></Label>
          <Label>Sort Order<Input type="number" value={newPhotoForm.sort_order} onChange={(e) => setNewPhotoForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))} /></Label>
        </div>
        <Label>Photo File<Input type="file" accept="image/*" onChange={(e) => setNewPhotoFile(e.target.files?.[0] || null)} required /></Label>
        {newPhotoPreview ? <img src={newPhotoPreview} alt="New photo preview" className="h-52 w-full object-cover" /> : null}
        <Button type="submit" disabled={busy}>{busy ? "Uploading..." : "Upload Photo"}</Button>
      </form>

      <section className="space-y-3">
        <h3 className="font-heading text-2xl">Group Photos</h3>
        {photos.map((photo) => (
          <article key={photo.id} className="bg-card p-4">
            <div className="grid gap-4 md:grid-cols-[220px,1fr]">
              <img src={photo.image_url} alt={photo.title || "Gallery photo"} className="h-40 w-full object-cover" />
              <div className="space-y-3">
                <Label>
                  Title
                  <Input
                    value={photoDrafts[photo.id]?.title || ""}
                    onChange={(e) =>
                      setPhotoDrafts((prev) => ({
                        ...prev,
                        [photo.id]: {
                          title: e.target.value,
                          sort_order: prev[photo.id]?.sort_order ?? photo.sort_order,
                        },
                      }))
                    }
                  />
                </Label>
                <Label>
                  Sort Order
                  <Input
                    type="number"
                    value={photoDrafts[photo.id]?.sort_order ?? 0}
                    onChange={(e) =>
                      setPhotoDrafts((prev) => ({
                        ...prev,
                        [photo.id]: {
                          title: prev[photo.id]?.title ?? photo.title ?? "",
                          sort_order: Number.parseInt(e.target.value || "0", 10) || 0,
                        },
                      }))
                    }
                  />
                </Label>
                <div className="flex flex-wrap gap-2">
                  <a href={photo.image_url} target="_blank" rel="noreferrer" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View</a>
                  <Button type="button" variant="outline" onClick={() => savePhoto(photo.id)} disabled={busy}>Save Photo</Button>
                  <Button type="button" variant="outline" onClick={() => deletePhoto(photo.id)} disabled={busy}>Delete Photo</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {photos.length === 0 ? <p className="text-sm text-foreground/70">No photos in this group yet.</p> : null}
      </section>
    </section>
  );
}
