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
import type { ContactSubmission, DbEvent, DbGalleryImage, DbProgram, EmailLog, PartnerSubmission, VolunteerApplication } from "@/types/backend";

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

const defaultGalleryForm = {
  title: "",
  category: "events" as "events" | "programs" | "community",
  sort_order: 0,
  is_visible: true,
};

const outcomesToLines = (outcomes: string[]) => outcomes.join("\n");
const linesToOutcomes = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [partners, setPartners] = useState<PartnerSubmission[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [programs, setPrograms] = useState<DbProgram[]>([]);
  const [galleryImages, setGalleryImages] = useState<DbGalleryImage[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [adminError, setAdminError] = useState("");

  const [replyMessage, setReplyMessage] = useState<Record<string, string>>({});
  const [eventForm, setEventForm] = useState(defaultEvent);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [programForm, setProgramForm] = useState(defaultProgramForm);
  const [programImageFile, setProgramImageFile] = useState<File | null>(null);
  const [programDrafts, setProgramDrafts] = useState<
    Record<
      string,
      {
        title: string;
        category: string;
        summary: string;
        description: string;
        outcomes: string;
        cta_label: string;
        sort_order: number;
        status: DbProgram["status"];
      }
    >
  >({});
  const [galleryForm, setGalleryForm] = useState(defaultGalleryForm);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryDrafts, setGalleryDrafts] = useState<
    Record<string, { title: string; category: "events" | "programs" | "community"; sort_order: number; is_visible: boolean }>
  >({});
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
      const [contactsRes, partnersRes, volunteersRes, eventsRes, programsRes, galleryRes, logsRes] = await Promise.all([
        invokeFunction<{ contacts: ContactSubmission[] }>("admin-contacts-list"),
        invokeFunction<{ partners: PartnerSubmission[] }>("admin-partners-list"),
        invokeFunction<{ volunteers: VolunteerApplication[] }>("admin-volunteers-list"),
        invokeFunction<{ events: DbEvent[] }>("admin-events-list"),
        invokeFunction<{ programs: DbProgram[] }>("admin-programs-list"),
        invokeFunction<{ images: DbGalleryImage[] }>("admin-gallery-list"),
        invokeFunction<{ logs: EmailLog[] }>("admin-email-logs-list"),
      ]);

      setContacts(contactsRes.contacts || []);
      setPartners(partnersRes.partners || []);
      setVolunteers(volunteersRes.volunteers || []);
      setEvents(eventsRes.events || []);
      setPrograms(programsRes.programs || []);
      setGalleryImages(galleryRes.images || []);
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

  const handleUpdatePartnerStatus = async (id: string, status: PartnerSubmission["status"]) => {
    setBusy(true);
    try {
      await invokeFunction("admin-partners-update-status", { id, status });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleReplyPartner = async (id: string) => {
    const message = replyMessage[id];
    if (!message) return;
    setBusy(true);
    try {
      await invokeFunction("admin-partners-reply", { id, message });
      setReplyMessage((prev) => ({ ...prev, [id]: "" }));
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

  const handleCreateProgram = async (e: FormEvent) => {
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
        title: programForm.title,
        category: programForm.category,
        summary: programForm.summary,
        description: programForm.description,
        outcomes: linesToOutcomes(programForm.outcomes),
        cta_label: programForm.cta_label,
        sort_order: programForm.sort_order,
        status: programForm.status,
        cover_image_url,
        cover_cloudinary_public_id,
      });

      setProgramForm(defaultProgramForm);
      setProgramImageFile(null);
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateProgram = async (id: string) => {
    const draft = programDrafts[id];
    if (!draft) return;

    setBusy(true);
    try {
      await invokeFunction("admin-programs-update", {
        id,
        title: draft.title,
        category: draft.category,
        summary: draft.summary,
        description: draft.description,
        outcomes: linesToOutcomes(draft.outcomes),
        cta_label: draft.cta_label,
        sort_order: draft.sort_order,
        status: draft.status,
      });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleReplaceProgramCover = async (id: string, file: File | null) => {
    if (!file) return;

    setBusy(true);
    try {
      const uploaded = await uploadImageToCloudinary(file);
      await invokeFunction("admin-programs-update", {
        id,
        cover_image_url: uploaded.secureUrl,
        cover_cloudinary_public_id: uploaded.publicId,
      });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    setBusy(true);
    try {
      await invokeFunction("admin-programs-delete", { id });
      setProgramDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleCreateGalleryImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!galleryImageFile) {
      setAdminError("Please select an image file for gallery upload.");
      return;
    }

    setBusy(true);
    try {
      setAdminError("");
      const uploaded = await uploadImageToCloudinary(galleryImageFile);
      await invokeFunction("admin-gallery-create", {
        ...galleryForm,
        image_url: uploaded.secureUrl,
        cloudinary_public_id: uploaded.publicId,
      });

      setGalleryForm(defaultGalleryForm);
      setGalleryImageFile(null);
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateGalleryImage = async (id: string) => {
    const draft = galleryDrafts[id];
    if (!draft) return;
    setBusy(true);
    try {
      setAdminError("");
      await invokeFunction("admin-gallery-update", {
        id,
        ...draft,
      });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    setBusy(true);
    try {
      setAdminError("");
      await invokeFunction("admin-gallery-delete", { id });
      setGalleryDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchAdminData();
    } finally {
      setBusy(false);
    }
  };

  const sortedContacts = useMemo(() => contacts, [contacts]);
  const sortedPartners = useMemo(() => partners, [partners]);
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
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
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

          <TabsContent value="partners" className="space-y-4">
            {sortedPartners.map((item) => (
              <article key={item.id} className="bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.full_name}</h3>
                    <p className="text-sm text-foreground/70">
                      {item.email} • {item.organization_name} • {item.partner_type}
                    </p>
                  </div>
                  <Select value={item.status} onValueChange={(value) => handleUpdatePartnerStatus(item.id, value as PartnerSubmission["status"])}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">new</SelectItem>
                      <SelectItem value="in_progress">in_progress</SelectItem>
                      <SelectItem value="resolved">resolved</SelectItem>
                      <SelectItem value="archived">archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-3 text-sm"><strong>Partnership Goal:</strong> {item.partnership_goal}</p>
                <p className="mt-2 text-sm"><strong>Message:</strong> {item.message}</p>
                <p className="mt-2 text-sm text-foreground/70">
                  Phone: {item.phone || "N/A"} • Website: {item.website || "N/A"} • Country: {item.country || "N/A"}
                </p>
                <Textarea
                  className="mt-3"
                  rows={3}
                  placeholder="Reply message"
                  value={replyMessage[item.id] || ""}
                  onChange={(e) => setReplyMessage((prev) => ({ ...prev, [item.id]: e.target.value }))}
                />
                <Button className="mt-2" onClick={() => handleReplyPartner(item.id)} disabled={busy}>Send Reply</Button>
              </article>
            ))}
            {sortedPartners.length === 0 && (
              <p className="text-sm text-foreground/70">No partner inquiries yet.</p>
            )}
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

          <TabsContent value="programs" className="space-y-6">
            <form onSubmit={handleCreateProgram} className="bg-card p-6 space-y-4">
              <h2 className="font-heading text-3xl">Create Program</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Label>
                  Title
                  <Input
                    value={programForm.title}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </Label>
                <Label>
                  Category
                  <Input
                    value={programForm.category}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </Label>
              </div>
              <Label>
                Summary
                <Textarea
                  value={programForm.summary}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, summary: e.target.value }))}
                />
              </Label>
              <Label>
                Description
                <Textarea
                  value={programForm.description}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </Label>
              <Label>
                Outcomes (one per line)
                <Textarea
                  rows={4}
                  value={programForm.outcomes}
                  onChange={(e) => setProgramForm((prev) => ({ ...prev, outcomes: e.target.value }))}
                />
              </Label>
              <div className="grid gap-4 md:grid-cols-3">
                <Label>
                  CTA Label
                  <Input
                    value={programForm.cta_label}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, cta_label: e.target.value }))}
                  />
                </Label>
                <Label>
                  Sort Order
                  <Input
                    type="number"
                    value={programForm.sort_order}
                    onChange={(e) => setProgramForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))}
                  />
                </Label>
                <Label>
                  Status
                  <Select
                    value={programForm.status}
                    onValueChange={(value) => setProgramForm((prev) => ({ ...prev, status: value as DbProgram["status"] }))}
                  >
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
                Cover Image
                <Input type="file" accept="image/*" onChange={(e) => setProgramImageFile(e.target.files?.[0] || null)} />
              </Label>
              <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Create Program"}</Button>
            </form>

            <div className="space-y-3">
              {programs.map((program) => {
                const draft = programDrafts[program.id] || {
                  title: program.title,
                  category: program.category,
                  summary: program.summary || "",
                  description: program.description || "",
                  outcomes: outcomesToLines(program.outcomes || []),
                  cta_label: program.cta_label,
                  sort_order: program.sort_order,
                  status: program.status,
                };

                return (
                  <article key={program.id} className="bg-card p-4">
                    <div className="grid gap-4 md:grid-cols-[180px,1fr]">
                      <img src={program.cover_image_url || "/yup-assets/programs-header.jpg"} alt={program.title} className="h-32 w-full object-cover" />
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-foreground/70">Slug: {program.slug}</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Label>
                            Title
                            <Input
                              value={draft.title}
                              onChange={(e) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, title: e.target.value },
                                }))
                              }
                            />
                          </Label>
                          <Label>
                            Category
                            <Input
                              value={draft.category}
                              onChange={(e) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, category: e.target.value },
                                }))
                              }
                            />
                          </Label>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Label>
                            Summary
                            <Textarea
                              value={draft.summary}
                              onChange={(e) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, summary: e.target.value },
                                }))
                              }
                            />
                          </Label>
                          <Label>
                            Description
                            <Textarea
                              value={draft.description}
                              onChange={(e) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, description: e.target.value },
                                }))
                              }
                            />
                          </Label>
                        </div>
                        <Label>
                          Outcomes (one per line)
                          <Textarea
                            rows={4}
                            value={draft.outcomes}
                            onChange={(e) =>
                              setProgramDrafts((prev) => ({
                                ...prev,
                                [program.id]: { ...draft, outcomes: e.target.value },
                              }))
                            }
                          />
                        </Label>
                        <div className="grid gap-3 md:grid-cols-3">
                          <Label>
                            CTA Label
                            <Input
                              value={draft.cta_label}
                              onChange={(e) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, cta_label: e.target.value },
                                }))
                              }
                            />
                          </Label>
                          <Label>
                            Sort Order
                            <Input
                              type="number"
                              value={draft.sort_order}
                              onChange={(e) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 },
                                }))
                              }
                            />
                          </Label>
                          <Label>
                            Status
                            <Select
                              value={draft.status}
                              onValueChange={(value) =>
                                setProgramDrafts((prev) => ({
                                  ...prev,
                                  [program.id]: { ...draft, status: value as DbProgram["status"] },
                                }))
                              }
                            >
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
                          Replace Cover Image
                          <Input type="file" accept="image/*" onChange={(e) => handleReplaceProgramCover(program.id, e.target.files?.[0] || null)} />
                        </Label>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateProgram(program.id)} disabled={busy}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteProgram(program.id)} disabled={busy}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
              {programs.length === 0 && (
                <p className="text-sm text-foreground/70">No programs yet. Create the first one above.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <form onSubmit={handleCreateGalleryImage} className="bg-card p-6 space-y-4">
              <h2 className="font-heading text-3xl">Upload Gallery Image</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Label>
                  Title
                  <Input
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </Label>
                <Label>
                  Category
                  <Select
                    value={galleryForm.category}
                    onValueChange={(value) =>
                      setGalleryForm((prev) => ({ ...prev, category: value as "events" | "programs" | "community" }))
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="events">events</SelectItem>
                      <SelectItem value="programs">programs</SelectItem>
                      <SelectItem value="community">community</SelectItem>
                    </SelectContent>
                  </Select>
                </Label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Label>
                  Sort Order
                  <Input
                    type="number"
                    value={galleryForm.sort_order}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 }))
                    }
                  />
                </Label>
                <Label>
                  Visibility
                  <Select
                    value={galleryForm.is_visible ? "visible" : "hidden"}
                    onValueChange={(value) => setGalleryForm((prev) => ({ ...prev, is_visible: value === "visible" }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visible">visible</SelectItem>
                      <SelectItem value="hidden">hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </Label>
              </div>
              <Label>
                Image File
                <Input type="file" accept="image/*" onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)} required />
              </Label>
              <Button type="submit" disabled={busy}>{busy ? "Uploading..." : "Upload Gallery Image"}</Button>
            </form>

            <div className="space-y-3">
              {galleryImages.map((image) => {
                const draft = galleryDrafts[image.id] || {
                  title: image.title,
                  category: image.category,
                  sort_order: image.sort_order,
                  is_visible: image.is_visible,
                };

                return (
                  <article key={image.id} className="bg-card p-4">
                    <div className="grid gap-4 md:grid-cols-[180px,1fr]">
                      <img src={image.image_url} alt={image.title} className="h-32 w-full object-cover" />
                      <div className="space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <Label>
                            Title
                            <Input
                              value={draft.title}
                              onChange={(e) =>
                                setGalleryDrafts((prev) => ({
                                  ...prev,
                                  [image.id]: { ...draft, title: e.target.value },
                                }))
                              }
                            />
                          </Label>
                          <Label>
                            Category
                            <Select
                              value={draft.category}
                              onValueChange={(value) =>
                                setGalleryDrafts((prev) => ({
                                  ...prev,
                                  [image.id]: { ...draft, category: value as "events" | "programs" | "community" },
                                }))
                              }
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="events">events</SelectItem>
                                <SelectItem value="programs">programs</SelectItem>
                                <SelectItem value="community">community</SelectItem>
                              </SelectContent>
                            </Select>
                          </Label>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Label>
                            Sort Order
                            <Input
                              type="number"
                              value={draft.sort_order}
                              onChange={(e) =>
                                setGalleryDrafts((prev) => ({
                                  ...prev,
                                  [image.id]: { ...draft, sort_order: Number.parseInt(e.target.value || "0", 10) || 0 },
                                }))
                              }
                            />
                          </Label>
                          <Label>
                            Visibility
                            <Select
                              value={draft.is_visible ? "visible" : "hidden"}
                              onValueChange={(value) =>
                                setGalleryDrafts((prev) => ({
                                  ...prev,
                                  [image.id]: { ...draft, is_visible: value === "visible" },
                                }))
                              }
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="visible">visible</SelectItem>
                                <SelectItem value="hidden">hidden</SelectItem>
                              </SelectContent>
                            </Select>
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateGalleryImage(image.id)} disabled={busy}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteGalleryImage(image.id)} disabled={busy}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
              {galleryImages.length === 0 && (
                <p className="text-sm text-foreground/70">No gallery images yet. Upload the first one above.</p>
              )}
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
