create table if not exists public.event_slug_aliases (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  alias_slug text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_slug_aliases_alias_slug on public.event_slug_aliases(alias_slug);
create index if not exists idx_event_slug_aliases_event_id on public.event_slug_aliases(event_id);

alter table public.event_slug_aliases enable row level security;

drop policy if exists "Public can read event slug aliases" on public.event_slug_aliases;
create policy "Public can read event slug aliases"
on public.event_slug_aliases
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can write event slug aliases" on public.event_slug_aliases;
create policy "Authenticated can write event slug aliases"
on public.event_slug_aliases
for all
to authenticated
using (true)
with check (true);
