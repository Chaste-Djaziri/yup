-- Core tables for events, contact, volunteer, newsletter, and logs

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  location text,
  event_start timestamptz not null,
  event_end timestamptz,
  image_url text,
  cloudinary_public_id text,
  registration_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_status_start on public.events(status, event_start);
create index if not exists idx_events_slug on public.events(slug);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_registrations_event_id on public.event_registrations(event_id);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_status_created on public.contact_submissions(status, created_at desc);
create index if not exists idx_contact_email on public.contact_submissions(email);

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  country text,
  opportunity text,
  motivation text not null,
  status text not null default 'new' check (status in ('new', 'in_review', 'accepted', 'rejected', 'archived')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_volunteer_status_created on public.volunteer_applications(status, created_at desc);
create index if not exists idx_volunteer_email on public.volunteer_applications(email);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'none_community' check (source in ('none_community', 'community', 'volunteer_accept')),
  linked_volunteer_id uuid references public.volunteer_applications(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_newsletter_source_created on public.newsletter_subscribers(source, created_at desc);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  recipient_email text,
  subject text,
  provider_message_id text,
  status text not null default 'queued',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_logs_created on public.email_logs(created_at desc);
create index if not exists idx_email_logs_event_type on public.email_logs(event_type);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_audit_created on public.admin_audit_logs(created_at desc);

-- triggers

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists trg_contact_updated_at on public.contact_submissions;
create trigger trg_contact_updated_at
before update on public.contact_submissions
for each row execute function public.set_updated_at();

drop trigger if exists trg_volunteer_updated_at on public.volunteer_applications;
create trigger trg_volunteer_updated_at
before update on public.volunteer_applications
for each row execute function public.set_updated_at();

drop trigger if exists trg_newsletter_updated_at on public.newsletter_subscribers;
create trigger trg_newsletter_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

-- RLS
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.volunteer_applications enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.email_logs enable row level security;
alter table public.admin_audit_logs enable row level security;

-- public reads only published events
drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (status = 'published');

-- allow authenticated admins to read any event from client if needed
drop policy if exists "Authenticated can read all events" on public.events;
create policy "Authenticated can read all events"
on public.events
for select
to authenticated
using (true);

-- event registrations can be created publicly (optional public registration capture)
drop policy if exists "Public can create event registrations" on public.event_registrations;
create policy "Public can create event registrations"
on public.event_registrations
for insert
to anon, authenticated
with check (true);

-- remaining tables: no direct anon access
drop policy if exists "Authenticated can read contacts" on public.contact_submissions;
create policy "Authenticated can read contacts"
on public.contact_submissions
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update contacts" on public.contact_submissions;
create policy "Authenticated can update contacts"
on public.contact_submissions
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can read volunteers" on public.volunteer_applications;
create policy "Authenticated can read volunteers"
on public.volunteer_applications
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update volunteers" on public.volunteer_applications;
create policy "Authenticated can update volunteers"
on public.volunteer_applications
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can read newsletter" on public.newsletter_subscribers;
create policy "Authenticated can read newsletter"
on public.newsletter_subscribers
for select
to authenticated
using (true);

drop policy if exists "Authenticated can read email logs" on public.email_logs;
create policy "Authenticated can read email logs"
on public.email_logs
for select
to authenticated
using (true);

drop policy if exists "Authenticated can read audit logs" on public.admin_audit_logs;
create policy "Authenticated can read audit logs"
on public.admin_audit_logs
for select
to authenticated
using (true);
