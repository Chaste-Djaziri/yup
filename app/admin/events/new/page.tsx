"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateTimeInput from "@/components/admin/DateTimeInput";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const defaultEvent = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  location: "",
  event_start: "",
  event_end: "",
  registration_url: "",
  status: "draft",
};

export default function AdminNewEventPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventForm, setEventForm] = useState(defaultEvent);

  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      setError("");
      let image_url: string | undefined;
      let cloudinary_public_id: string | undefined;

      if (eventImage) {
        const uploaded = await uploadImageToCloudinary(eventImage);
        image_url = uploaded.secureUrl;
        cloudinary_public_id = uploaded.publicId;
      }

      await invokeFunction("admin-events-create", {
        ...eventForm,
        image_url,
        cloudinary_public_id,
      });

      router.push("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create event failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Create Event</h2>
        <Link href="/admin/events" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Events</Link>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <form onSubmit={handleCreateEvent} className="bg-card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={eventForm.title} onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Slug (optional)<Input value={eventForm.slug} onChange={(e) => setEventForm((prev) => ({ ...prev, slug: e.target.value }))} /></Label>
        </div>
        <Label>Summary<Textarea value={eventForm.summary} onChange={(e) => setEventForm((prev) => ({ ...prev, summary: e.target.value }))} /></Label>
        <Label>Description<Textarea value={eventForm.description} onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))} /></Label>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Location<Input value={eventForm.location} onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))} /></Label>
          <Label>Registration URL<Input value={eventForm.registration_url} onChange={(e) => setEventForm((prev) => ({ ...prev, registration_url: e.target.value }))} /></Label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Label>Start<DateTimeInput value={eventForm.event_start} onChange={(value) => setEventForm((prev) => ({ ...prev, event_start: value }))} /></Label>
          <Label>End<DateTimeInput value={eventForm.event_end} onChange={(value) => setEventForm((prev) => ({ ...prev, event_end: value }))} /></Label>
          <Label>Status
            <Select value={eventForm.status} onValueChange={(value) => setEventForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="published">published</SelectItem>
                <SelectItem value="archived">archived</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
        <Label>Image<Input type="file" accept="image/*" onChange={(e) => setEventImage(e.target.files?.[0] || null)} /></Label>
        <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Create Event"}</Button>
      </form>
    </section>
  );
}
