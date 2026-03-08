"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateTimeInput from "@/components/admin/DateTimeInput";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { DbEvent } from "@/types/backend";

export default function AdminEditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventItem, setEventItem] = useState<DbEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    location: "",
    event_start: "",
    event_end: "",
    registration_url: "",
    status: "draft",
  });

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ events: DbEvent[] }>("admin-events-list");
      const found = (res.events || []).find((x) => x.id === params.id) || null;
      setEventItem(found);
      if (found) {
        setEventForm({
          title: found.title,
          slug: found.slug,
          summary: found.summary || "",
          description: found.description || "",
          location: found.location || "",
          event_start: found.event_start,
          event_end: found.event_end || "",
          registration_url: found.registration_url || "",
          status: found.status,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
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

      if (eventImage) {
        const uploaded = await uploadImageToCloudinary(eventImage);
        image_url = uploaded.secureUrl;
        cloudinary_public_id = uploaded.publicId;
      }

      await invokeFunction("admin-events-update", {
        id: params.id,
        ...eventForm,
        image_url,
        cloudinary_public_id,
      });

      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Event update failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm("Delete this event permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-events-delete", { id: params.id });
      router.push("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground/70">Loading event...</p>;
  if (!eventItem) return <p className="text-sm text-foreground/70">Event not found.</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Edit Event</h2>
        <div className="flex gap-2">
          <Link href={`/events/${eventItem.slug}`} target="_blank" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">View Public Page</Link>
          <Link href="/admin/events" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Events</Link>
        </div>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}

      <form onSubmit={save} className="bg-card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>Title<Input value={eventForm.title} onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))} required /></Label>
          <Label>Slug<Input value={eventForm.slug} onChange={(e) => setEventForm((prev) => ({ ...prev, slug: e.target.value }))} required /></Label>
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
        <Label>
          Replace Image
          <Input type="file" accept="image/*" onChange={(e) => setEventImage(e.target.files?.[0] || null)} />
        </Label>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Event"}</Button>
          <Button type="button" variant="outline" onClick={deleteEvent} disabled={busy}>Delete Event</Button>
        </div>
      </form>
    </section>
  );
}
