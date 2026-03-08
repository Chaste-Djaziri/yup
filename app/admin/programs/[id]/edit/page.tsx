"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { DbProgram } from "@/types/backend";

const outcomesToLines = (outcomes: string[]) => outcomes.join("\n");
const linesToOutcomes = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

export default function AdminEditProgramPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [programImageFile, setProgramImageFile] = useState<File | null>(null);
  const [programItem, setProgramItem] = useState<DbProgram | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    summary: "",
    description: "",
    outcomes: "",
    cta_label: "Support This Program",
    sort_order: 0,
    status: "draft" as DbProgram["status"],
  });

  const selectedImagePreview = useMemo(() => (programImageFile ? URL.createObjectURL(programImageFile) : null), [programImageFile]);

  useEffect(() => {
    return () => {
      if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
    };
  }, [selectedImagePreview]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ programs: DbProgram[] }>("admin-programs-list");
      const found = (res.programs || []).find((x) => x.id === params.id) || null;
      setProgramItem(found);
      if (found) {
        setForm({
          title: found.title,
          slug: found.slug,
          category: found.category,
          summary: found.summary || "",
          description: found.description || "",
          outcomes: outcomesToLines(found.outcomes || []),
          cta_label: found.cta_label || "Support This Program",
          sort_order: found.sort_order || 0,
          status: found.status,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load program");
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
      let cover_image_url: string | undefined;
      let cover_cloudinary_public_id: string | undefined;
      if (programImageFile) {
        const uploaded = await uploadImageToCloudinary(programImageFile);
        cover_image_url = uploaded.secureUrl;
        cover_cloudinary_public_id = uploaded.publicId;
      }

      await invokeFunction("admin-programs-update", {
        id: params.id,
        ...form,
        outcomes: linesToOutcomes(form.outcomes),
        cover_image_url,
        cover_cloudinary_public_id,
      });

      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Program update failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteProgram = async () => {
    if (!window.confirm("Delete this program permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-programs-delete", { id: params.id });
      router.push("/admin/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground/70">Loading program...</p>;
  if (!programItem) return <p className="text-sm text-foreground/70">Program not found.</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Edit Program</h2>
        <div className="flex gap-2">
          <Link href={`/programs/${programItem.slug}`} target="_blank" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View Public Page</Link>
          <Link href="/admin/programs" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Programs</Link>
        </div>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={save} className="bg-card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Slug<Input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} required /></Label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Category<Input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required /></Label>
          <Label>CTA Label<Input value={form.cta_label} onChange={(e) => setForm((prev) => ({ ...prev, cta_label: e.target.value }))} /></Label>
        </div>
        <Label>Summary<Textarea value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} /></Label>
        <Label>Description<Textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} /></Label>
        <Label>Outcomes (one per line)<Textarea rows={6} value={form.outcomes} onChange={(e) => setForm((prev) => ({ ...prev, outcomes: e.target.value }))} /></Label>
        <div className="grid gap-4 md:grid-cols-3">
          <Label>Sort Order<Input type="number" value={form.sort_order} onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))} /></Label>
          <Label>Status
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as DbProgram["status"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="published">published</SelectItem>
                <SelectItem value="archived">archived</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <Label>
          Replace Cover Image
          <Input type="file" accept="image/*" onChange={(e) => setProgramImageFile(e.target.files?.[0] || null)} />
        </Label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">Current Cover</p>
            <img src={programItem.cover_image_url || "/yup-assets/programs-header.jpg"} alt={`${programItem.title} cover`} className="h-auto max-w-full" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">New Cover Preview</p>
            {selectedImagePreview ? (
              <img src={selectedImagePreview} alt="Selected replacement preview" className="h-auto max-w-full" />
            ) : (
              <div className="flex h-48 items-center justify-center border border-border text-sm text-foreground/70">Select a file to preview replacement</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Program"}</Button>
          <Button type="button" variant="outline" onClick={deleteProgram} disabled={busy}>Delete Program</Button>
        </div>
      </form>
    </section>
  );
}
