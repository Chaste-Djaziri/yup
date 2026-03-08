"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invokeFunction } from "@/lib/edge";
import type { ContactSubmission } from "@/types/backend";

export default function AdminContactDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState<ContactSubmission | null>(null);
  const [reply, setReply] = useState("");

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ contacts: ContactSubmission[] }>("admin-contacts-list");
      const found = (res.contacts || []).find((x) => x.id === params.id) || null;
      setItem(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const updateStatus = async (status: ContactSubmission["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-contacts-update-status", { id: params.id, status });
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
      await invokeFunction("admin-contacts-reply", { id: params.id, message: reply.trim() });
      setReply("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reply failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteItem = async () => {
    if (!window.confirm("Delete this contact submission permanently?")) return;
    setBusy(true);
    try {
      await invokeFunction("admin-contacts-delete", { id: params.id });
      router.push("/admin/contacts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground/70">Loading contact...</p>;
  if (!item) return <p className="text-sm text-foreground/70">Contact submission not found.</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Contact Submission</h2>
        <Link href="/admin/contacts" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back</Link>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      <article className="space-y-4 bg-card p-6">
        <p><strong>Name:</strong> {item.first_name} {item.last_name}</p>
        <p><strong>Email:</strong> {item.email}</p>
        <p><strong>Subject:</strong> {item.subject}</p>
        <p><strong>Message:</strong> {item.message}</p>
        <p><strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}</p>
        <div className="max-w-[220px]">
          <Select value={item.status} onValueChange={(value) => updateStatus(value as ContactSubmission["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_progress">in_progress</SelectItem>
              <SelectItem value="resolved">resolved</SelectItem>
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
