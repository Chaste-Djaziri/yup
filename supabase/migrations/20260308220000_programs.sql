create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  category text not null,
  summary text,
  description text,
  outcomes text[] not null default '{}',
  cover_image_url text,
  cover_cloudinary_public_id text,
  cta_label text not null default 'Support This Program',
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programs_slug_unique unique (slug)
);

create index if not exists idx_programs_status_sort_created
  on public.programs(status, sort_order, created_at desc);

drop trigger if exists trg_programs_updated_at on public.programs;
create trigger trg_programs_updated_at
before update on public.programs
for each row execute function public.set_updated_at();

alter table public.programs enable row level security;

drop policy if exists "Public can read published programs" on public.programs;
create policy "Public can read published programs"
on public.programs
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated can read all programs" on public.programs;
create policy "Authenticated can read all programs"
on public.programs
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert programs" on public.programs;
create policy "Authenticated can insert programs"
on public.programs
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update programs" on public.programs;
create policy "Authenticated can update programs"
on public.programs
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete programs" on public.programs;
create policy "Authenticated can delete programs"
on public.programs
for delete
to authenticated
using (true);
