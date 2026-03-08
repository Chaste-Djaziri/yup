create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('events', 'programs', 'community')),
  image_url text not null,
  cloudinary_public_id text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_images_visible_sort_created
  on public.gallery_images(is_visible, sort_order, created_at desc);

create index if not exists idx_gallery_images_category
  on public.gallery_images(category);

drop trigger if exists trg_gallery_images_updated_at on public.gallery_images;
create trigger trg_gallery_images_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

alter table public.gallery_images enable row level security;

drop policy if exists "Public can read visible gallery images" on public.gallery_images;
create policy "Public can read visible gallery images"
on public.gallery_images
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Authenticated can read all gallery images" on public.gallery_images;
create policy "Authenticated can read all gallery images"
on public.gallery_images
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert gallery images" on public.gallery_images;
create policy "Authenticated can insert gallery images"
on public.gallery_images
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update gallery images" on public.gallery_images;
create policy "Authenticated can update gallery images"
on public.gallery_images
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete gallery images" on public.gallery_images;
create policy "Authenticated can delete gallery images"
on public.gallery_images
for delete
to authenticated
using (true);
