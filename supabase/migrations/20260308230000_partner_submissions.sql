create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.partner_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  organization_name text not null,
  partner_type text not null,
  partnership_goal text not null,
  message text not null,
  phone text,
  website text,
  country text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_submissions_status_created
  on public.partner_submissions(status, created_at desc);

drop trigger if exists trg_partner_submissions_updated_at on public.partner_submissions;
create trigger trg_partner_submissions_updated_at
before update on public.partner_submissions
for each row execute function public.set_updated_at();

alter table public.partner_submissions enable row level security;

drop policy if exists "Public can submit partner inquiries" on public.partner_submissions;
create policy "Public can submit partner inquiries"
on public.partner_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can read partner submissions" on public.partner_submissions;
create policy "Authenticated can read partner submissions"
on public.partner_submissions
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update partner submissions" on public.partner_submissions;
create policy "Authenticated can update partner submissions"
on public.partner_submissions
for update
to authenticated
using (true)
with check (true);
