"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/edge";
import type { EmailLog } from "@/types/backend";

export default function AdminLogsPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<EmailLog[]>([]);

  const load = async () => {
    try {
      setError("");
      const res = await invokeFunction<{ logs: EmailLog[] }>("admin-email-logs-list");
      setLogs(res.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load email logs");
    } finally {
      setLoading(false);
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return logs;
    return logs.filter((log) =>
      [log.event_type, log.status, log.subject || "", log.recipient_email || "", log.id].join(" ").toLowerCase().includes(value),
    );
  }, [logs, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl">Email Logs</h2>
        <div className="flex gap-2">
          <Link href="/admin/logs/new" className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            New Broadcast
          </Link>
          <Button variant="outline" onClick={() => { setBusy(true); void load(); }} disabled={busy}>Refresh</Button>
        </div>
      </div>

      <Input placeholder="Search logs" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error ? <p className="text-sm text-foreground/70">{error}</p> : null}
      {loading ? <p className="text-sm text-foreground/70">Loading logs...</p> : null}

      <div className="space-y-2">
        {filtered.map((log) => (
          <article key={log.id} className="bg-card p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p><strong>{log.event_type}</strong> • {log.status}</p>
                <p>{log.subject || "(no subject)"} • {log.recipient_email || "(no recipient)"}</p>
                <p className="text-xs text-foreground/70">{new Date(log.created_at).toLocaleString()}</p>
              </div>
              <Link href={`/admin/logs/${log.id}`} className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider">
                Open
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!loading && filtered.length === 0 ? <p className="text-sm text-foreground/70">No logs found.</p> : null}
    </section>
  );
}
