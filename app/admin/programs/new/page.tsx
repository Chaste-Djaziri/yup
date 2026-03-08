"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { DbProgram } from "@/types/backend";

const defaultProgramForm = {
  title: "",
  slug: "",
  category: "",
  summary: "",
  description: "",
  outcomes: "",
  cta_label: "Support This Program",
  sort_order: 0,
  status: "draft" as DbProgram["status"],
};

export default function AdminNewProgramPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [programForm, setProgramForm] = useState(defaultProgramForm);
  const [programImageFile, setProgramImageFile] = useState<File | null>(null);

  const create = async (e: FormEvent) => {
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

      await invokeFunction("admin-programs-create", {
        ...programForm,
        outcomes: programForm.outcomes.split("\n").map((x) => x.trim()).filter(Boolean),
        cover_image_url,
        cover_cloudinary_public_id,
      });

      router.push("/admin/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create program failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Create Program</h2>
        <Link href="/admin/programs" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Programs</Link>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={create} className="bg-card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={programForm.title} onChange={(e) => setProgramForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Slug (optional)<Input value={programForm.slug} onChange={(e) => setProgramForm((prev) => ({ ...prev, slug: e.target.value }))} /></Label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Category<Input value={programForm.category} onChange={(e) => setProgramForm((prev) => ({ ...prev, category: e.target.value }))} required /></Label>
          <Label>CTA Label<Input value={programForm.cta_label} onChange={(e) => setProgramForm((prev) => ({ ...prev, cta_label: e.target.value }))} /></Label>
        </div>
        <Label>Summary<Textarea value={programForm.summary} onChange={(e) => setProgramForm((prev) => ({ ...prev, summary: e.target.value }))} /></Label>
        <Label>Description<Textarea value={programForm.description} onChange={(e) => setProgramForm((prev) => ({ ...prev, description: e.target.value }))} /></Label>
        <Label>Outcomes (one per line)<Textarea rows={4} value={programForm.outcomes} onChange={(e) => setProgramForm((prev) => ({ ...prev, outcomes: e.target.value }))} /></Label>
        <div className="grid gap-4 md:grid-cols-3">
          <Label>Sort Order<Input type="number" value={programForm.sort_order} onChange={(e) => setProgramForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))} /></Label>
          <Label>Status
            <Select value={programForm.status} onValueChange={(value) => setProgramForm((prev) => ({ ...prev, status: value as DbProgram["status"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="published">published</SelectItem>
                <SelectItem value="archived">archived</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <Label>Cover Image<Input type="file" accept="image/*" onChange={(e) => setProgramImageFile(e.target.files?.[0] || null)} /></Label>
        <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Create Program"}</Button>
      </form>
    </section>
  );
}
