"use client";

import { FormEvent, useEffect, useState } from "react";
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
  category: "",
  summary: "",
  description: "",
  outcomes: "",
  cta_label: "Support This Program",
  sort_order: 0,
  status: "draft" as DbProgram["status"],
};

export default function AdminProgramsPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<DbProgram[]>([]);
  const [programForm, setProgramForm] = useState(defaultProgramForm);
  const [programImageFile, setProgramImageFile] = useState<File | null>(null);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ programs: DbProgram[] }>("admin-programs-list");
      setPrograms(res.programs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programs");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
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

      setProgramForm(defaultProgramForm);
      setProgramImageFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create program failed");
    } finally {
      setBusy(false);
    }
  };

  const quickStatus = async (id: string, status: DbProgram["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-programs-update", { id, status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this program permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-programs-delete", { id });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-3xl">Programs</h2>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={create} className="bg-card p-6 space-y-4">
        <h3 className="font-heading text-2xl">Create Program</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={programForm.title} onChange={(e) => setProgramForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Category<Input value={programForm.category} onChange={(e) => setProgramForm((prev) => ({ ...prev, category: e.target.value }))} required /></Label>
        </div>
        <Label>Summary<Textarea value={programForm.summary} onChange={(e) => setProgramForm((prev) => ({ ...prev, summary: e.target.value }))} /></Label>
        <Label>Description<Textarea value={programForm.description} onChange={(e) => setProgramForm((prev) => ({ ...prev, description: e.target.value }))} /></Label>
        <Label>Outcomes (one per line)<Textarea rows={4} value={programForm.outcomes} onChange={(e) => setProgramForm((prev) => ({ ...prev, outcomes: e.target.value }))} /></Label>
        <div className="grid gap-4 md:grid-cols-3">
          <Label>CTA Label<Input value={programForm.cta_label} onChange={(e) => setProgramForm((prev) => ({ ...prev, cta_label: e.target.value }))} /></Label>
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

      <div className="space-y-3">
        {programs.map((program) => (
          <article key={program.id} className="bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{program.title}</h3>
                <p className="text-sm text-foreground/70">/{program.slug} • {program.category}</p>
                <p className="text-xs uppercase tracking-wider text-foreground/70">{program.status}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => quickStatus(program.id, "published")} disabled={busy}>Publish</Button>
                <Button size="sm" variant="outline" onClick={() => quickStatus(program.id, "draft")} disabled={busy}>Draft</Button>
                <Button size="sm" variant="outline" onClick={() => quickStatus(program.id, "archived")} disabled={busy}>Archive</Button>
                <Button size="sm" variant="outline" onClick={() => remove(program.id)} disabled={busy}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
