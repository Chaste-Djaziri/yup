"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invokeFunction } from "@/lib/edge";
import type { VolunteerApplication } from "@/types/backend";

export default function AdminVolunteerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState<VolunteerApplication | null>(null);
  const [reply, setReply] = useState("");

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ volunteers: VolunteerApplication[] }>("admin-volunteers-list");
      const found = (res.volunteers || []).find((x) => x.id === params.id) || null;
      setItem(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load volunteer application");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const updateStatus = async (status: VolunteerApplication["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-volunteers-update-status", { id: params.id, status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setBusy(true);
    try {
      await invokeFunction("admin-volunteers-reply", { id: params.id, message: reply.trim() });
      setReply("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reply failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteItem = async () => {
    if (!window.confirm("Delete this volunteer application permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-volunteers-delete", { id: params.id });
      router.push("/admin/volunteers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground/70">Loading volunteer application...</p>;
  if (!item) return <p className="text-sm text-foreground/70">Volunteer application not found.</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Volunteer Application</h2>
        <Link href="/admin/volunteers" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back</Link>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <article className="space-y-4 bg-card p-6">
        <p><strong>Name:</strong> {item.first_name} {item.last_name}</p>
        <p><strong>Email:</strong> {item.email}</p>
        <p><strong>Phone:</strong> {item.phone || "N/A"}</p>
        <p><strong>Country:</strong> {item.country || "N/A"}</p>
        <p><strong>Preferred Opportunity:</strong> {item.opportunity || "N/A"}</p>
        <p><strong>Motivation:</strong> {item.motivation}</p>
        <p><strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}</p>
        <div className="max-w-[220px]">
          <Select value={item.status} onValueChange={(value) => updateStatus(value as VolunteerApplication["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_review">in_review</SelectItem>
              <SelectItem value="accepted">accepted</SelectItem>
              <SelectItem value="rejected">rejected</SelectItem>
              <SelectItem value="archived">archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Textarea rows={5} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply message" />
          <div className="flex gap-2">
            <Button onClick={sendReply} disabled={busy}>Send Reply</Button>
            <Button variant="outline" onClick={deleteItem} disabled={busy}>Delete</Button>
          </div>
        </div>
      </article>
    </section>
  );
}
