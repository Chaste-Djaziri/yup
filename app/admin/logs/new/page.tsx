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
import type { AdminBroadcastResult, AdminBroadcastTarget } from "@/types/backend";

export default function AdminNewBroadcastPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<AdminBroadcastTarget>("community");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [results, setResults] = useState<AdminBroadcastResult[]>([]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !html) {
      setError("Broadcast subject and message are required.");
      return;
    }

    setBusy(true);
    try {
      setError("");
      const result = await invokeFunction<{ success: boolean; results: AdminBroadcastResult[] }>("admin-broadcast-send", {
        target,
        subject,
        html,
      });
      setResults(result.results || []);
      setSubject("");
      setHtml("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Broadcast send failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">New Broadcast</h2>
        <div className="flex gap-2">
          <Link href="/admin/logs" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Logs</Link>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/logs")}>Done</Button>
        </div>
      </div>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}

      <form onSubmit={handleSend} className="space-y-4 bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Label>
            Target Segment
            <Select value={target} onValueChange={(value) => setTarget(value as AdminBroadcastTarget)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="community">community</SelectItem>
                <SelectItem value="non_community">non_community</SelectItem>
                <SelectItem value="both">both</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Label>
            Subject
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </Label>
        </div>
        <Label>
          HTML Message
          <Textarea rows={10} value={html} onChange={(e) => setHtml(e.target.value)} required />
        </Label>
        <Button type="submit" disabled={busy}>{busy ? "Sending..." : "Send Broadcast"}</Button>

        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((item) => (
              <p key={`${item.target}-${item.broadcastId || "none"}`} className="text-sm">
                {item.target}: {item.status} {item.broadcastId ? `(${item.broadcastId})` : ""} {item.error ? `- ${item.error}` : ""}
              </p>
            ))}
          </div>
        ) : null}
      </form>
    </section>
  );
}
