"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { invokeFunction } from "@/lib/edge";
import type { AdminBroadcastResult, AdminBroadcastTarget, EmailLog } from "@/types/backend";

export default function AdminLogsPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [broadcastTarget, setBroadcastTarget] = useState<AdminBroadcastTarget>("community");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastHtml, setBroadcastHtml] = useState("");
  const [broadcastResults, setBroadcastResults] = useState<AdminBroadcastResult[]>([]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ logs: EmailLog[] }>("admin-email-logs-list");
      setLogs(res.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load email logs");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSendBroadcast = async (e: FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastHtml) {
      setError("Broadcast subject and message are required.");
      return;
    }

    setBusy(true);
    try {
      setError("");
      const result = await invokeFunction<{ success: boolean; results: AdminBroadcastResult[] }>("admin-broadcast-send", {
        target: broadcastTarget,
        subject: broadcastSubject,
        html: broadcastHtml,
      });
      setBroadcastResults(result.results || []);
      setBroadcastSubject("");
      setBroadcastHtml("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Broadcast send failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-3xl">Email Logs & Broadcasts</h2>
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}

      <form onSubmit={handleSendBroadcast} className="space-y-4 bg-card p-6">
        <h3 className="font-heading text-2xl">Broadcast Email</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Label>
            Target Segment
            <Select value={broadcastTarget} onValueChange={(value) => setBroadcastTarget(value as AdminBroadcastTarget)}>
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
            <Input value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} required />
          </Label>
        </div>
        <Label>
          HTML Message
          <Textarea rows={8} value={broadcastHtml} onChange={(e) => setBroadcastHtml(e.target.value)} required />
        </Label>
        <Button type="submit" disabled={busy}>{busy ? "Sending..." : "Send Broadcast"}</Button>
        {broadcastResults.length > 0 ? (
          <div className="space-y-2">
            {broadcastResults.map((item) => (
              <p key={`${item.target}-${item.broadcastId || "none"}`} className="text-sm">
                {item.target}: {item.status} {item.broadcastId ? `(${item.broadcastId})` : ""} {item.error ? `- ${item.error}` : ""}
              </p>
            ))}
          </div>
        ) : null}
      </form>

      <div className="space-y-2">
        {logs.map((log) => (
          <article key={log.id} className="bg-card p-3 text-sm">
            <p><strong>{log.event_type}</strong> • {log.status}</p>
            <p>{log.subject || "(no subject)"} • {log.recipient_email || "(no recipient)"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
