"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { invokeFunction } from "@/lib/edge";
import type { EmailLog } from "@/types/backend";

export default function AdminLogDetailPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [log, setLog] = useState<EmailLog | null>(null);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ logs: EmailLog[] }>("admin-email-logs-list");
      const found = (res.logs || []).find((item) => item.id === params.id) || null;
      setLog(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load email log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const prettyPayload = useMemo(() => {
    if (!log?.payload) return "No payload";
    try {
      return JSON.stringify(log.payload, null, 2);
    } catch {
      return String(log.payload);
    }
  }, [log]);

  if (loading) return <p className="text-sm text-foreground/70">Loading log...</p>;
  if (!log) return <p className="text-sm text-foreground/70">Log entry not found.</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Email Log Detail</h2>
        <Link href="/admin/logs" className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">Back to Logs</Link>
      </div>

      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}

      <article className="space-y-3 bg-card p-6 text-sm">
        <p><strong>ID:</strong> {log.id}</p>
        <p><strong>Event Type:</strong> {log.event_type}</p>
        <p><strong>Status:</strong> {log.status}</p>
        <p><strong>Recipient:</strong> {log.recipient_email || "(no recipient)"}</p>
        <p><strong>Subject:</strong> {log.subject || "(no subject)"}</p>
        <p><strong>Provider Message ID:</strong> {log.provider_message_id || "(none)"}</p>
        <p><strong>Created:</strong> {new Date(log.created_at).toLocaleString()}</p>
        <div>
          <p className="mb-2 font-semibold">Payload</p>
          <pre className="overflow-auto bg-background p-3 text-xs">{prettyPayload}</pre>
        </div>
      </article>
    </section>
  );
}
