"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { invokeFunction } from "@/lib/edge";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { ContactSubmission, DbEvent, EmailLog, VolunteerApplication } from "@/types/backend";

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

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [adminError, setAdminError] = useState("");

  const [replyMessage, setReplyMessage] = useState<Record<string, string>>({});
  const [eventForm, setEventForm] = useState(defaultEvent);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const allowSignup = process.env.NODE_ENV === "development";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setSessionReady(true);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      setAdminError("");
      const [contactsRes, volunteersRes, eventsRes, logsRes] = await Promise.all([
        invokeFunction<{ contacts: ContactSubmission[] }>("admin-contacts-list"),
        invokeFunction<{ volunteers: VolunteerApplication[] }>("admin-volunteers-list"),
        invokeFunction<{ events: DbEvent[] }>("admin-events-list"),
        invokeFunction<{ logs: EmailLog[] }>("admin-email-logs-list"),
      ]);

      setContacts(contactsRes.contacts || []);
      setVolunteers(volunteersRes.volunteers || []);
      setEvents(eventsRes.events || []);
      setLogs(logsRes.logs || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load admin data";
      setAdminError(message);
      if (message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("session")) {
        await supabase.auth.signOut();
      }
    }
  };

  useEffect(() => {
    if (sessionReady && isAuthenticated) {
      fetchAdminData();
    }
  }, [sessionReady, isAuthenticated]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    setAuthError("");
    if (!allowSignup) {
      setAuthError("Signup is disabled outside development.");
      return;
    }
    try {
      await invokeFunction("admin-signup", { email, password });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpdateContactStatus = async (id: string, status: ContactSubmission["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-contacts-update-status", { id, status });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleReplyContact = async (id: string) => {
    const message = replyMessage[id];
    if (!message) return;
    setBusy(true);
    try {
      await invokeFunction("admin-contacts-reply", { id, message });
      setReplyMessage((prev) => ({ ...prev, [id]: "" }));
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateVolunteerStatus = async (id: string, status: VolunteerApplication["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-volunteers-update-status", { id, status });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleReplyVolunteer = async (id: string) => {
    const message = replyMessage[id];
    if (!message) return;
    setBusy(true);
    try {
      await invokeFunction("admin-volunteers-reply", { id, message });
      setReplyMessage((prev) => ({ ...prev, [id]: "" }));
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
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

      setEventForm(defaultEvent);
      setEventImage(null);
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleEventStatus = async (event: DbEvent, status: DbEvent["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-events-update", {
        id: event.id,
        status,
      });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setBusy(true);
    try {
      await invokeFunction("admin-events-delete", { id });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const sortedContacts = useMemo(() => contacts, [contacts]);
  const sortedVolunteers = useMemo(() => volunteers, [volunteers]);

  if (!loading && !sessionReady) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted px-4 py-16">        <div className="mx-auto max-w-md bg-background p-8">
          <h1 className="font-heading text-3xl">Admin Login</h1>
          <p className="mt-2 text-sm text-foreground/70">Use your admin account to manage submissions and events.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Label>
              Email
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Label>
            <Label>
              Password
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Label>
            {authError && <p className="text-sm text-red-700">{authError}</p>}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Login</Button>
              {allowSignup && (
                <Button type="button" variant="outline" className="flex-1" onClick={handleSignup}>
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-4xl">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAdminData}>Refresh</Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {adminError && <p className="mb-4 text-sm text-red-700">{adminError}</p>}

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="logs">Email Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            {sortedContacts.map((item) => (
              <article key={item.id} className="bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.first_name} {item.last_name}</h3>
                    <p className="text-sm text-foreground/70">{item.email} • {item.subject}</p>
                  </div>
                  <Select value={item.status} onValueChange={(value) => handleUpdateContactStatus(item.id, value as ContactSubmission["status"])}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">new</SelectItem>
                      <SelectItem value="in_progress">in_progress</SelectItem>
                      <SelectItem value="resolved">resolved</SelectItem>
                      <SelectItem value="archived">archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-3 text-sm">{item.message}</p>
                <Textarea
                  className="mt-3"
                  rows={3}
                  placeholder="Reply message"
                  value={replyMessage[item.id] || ""}
                  onChange={(e) => setReplyMessage((prev) => ({ ...prev, [item.id]: e.target.value }))}
                />
                <Button className="mt-2" onClick={() => handleReplyContact(item.id)} disabled={busy}>Send Reply</Button>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-4">
            {sortedVolunteers.map((item) => (
              <article key={item.id} className="bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.first_name} {item.last_name}</h3>
                    <p className="text-sm text-foreground/70">{item.email} • {item.country || "N/A"} • {item.opportunity || "N/A"}</p>
                  </div>
                  <Select value={item.status} onValueChange={(value) => handleUpdateVolunteerStatus(item.id, value as VolunteerApplication["status"])}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">new</SelectItem>
                      <SelectItem value="in_review">in_review</SelectItem>
                      <SelectItem value="accepted">accepted</SelectItem>
                      <SelectItem value="rejected">rejected</SelectItem>
                      <SelectItem value="archived">archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-3 text-sm">{item.motivation}</p>
                <Textarea
                  className="mt-3"
                  rows={3}
                  placeholder="Reply message"
                  value={replyMessage[item.id] || ""}
                  onChange={(e) => setReplyMessage((prev) => ({ ...prev, [item.id]: e.target.value }))}
                />
                <Button className="mt-2" onClick={() => handleReplyVolunteer(item.id)} disabled={busy}>Send Reply</Button>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <form onSubmit={handleCreateEvent} className="bg-card p-6 space-y-4">
              <h2 className="font-heading text-3xl">Create Event</h2>
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

            <div className="space-y-3">
              {events.map((event) => (
                <article key={event.id} className="bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-foreground/70">{new Date(event.event_start).toLocaleString()} • {event.location || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEventStatus(event, "published")} disabled={busy}>Publish</Button>
                      <Button size="sm" variant="outline" onClick={() => handleEventStatus(event, "draft")} disabled={busy}>Draft</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)} disabled={busy}>Delete</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="space-y-2">
              {logs.map((log) => (
                <article key={log.id} className="bg-card p-3 text-sm">
                  <p><strong>{log.event_type}</strong> • {log.status}</p>
                  <p>{log.subject || "(no subject)"} • {log.recipient_email || "(no recipient)"}</p>
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const DateTimeInput = ({ value, onChange }: DateTimeInputProps) => {
  const normalized = value ? value.slice(0, 16) : "";
  return (
    <Input
      type="datetime-local"
      value={normalized}
      onChange={(e) => {
        if (!e.target.value) {
          onChange("");
          return;
        }
        onChange(new Date(e.target.value).toISOString());
      }}
    />
  );
};

export default AdminPage;
