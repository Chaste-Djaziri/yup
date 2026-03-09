create extension if not exists pgcrypto;

create table if not exists public.gallery_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  description text not null default '',
  cover_image_url text not null,
  cover_cloudinary_public_id text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_gallery_groups_slug on public.gallery_groups(slug);
create index if not exists idx_gallery_groups_visible_sort_created
  on public.gallery_groups(is_visible, sort_order, created_at desc);

create table if not exists public.gallery_group_photos (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.gallery_groups(id) on delete cascade,
  title text,
  image_url text not null,
  cloudinary_public_id text,
  sort_order integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_group_photos_group_sort_created
  on public.gallery_group_photos(group_id, sort_order, created_at desc);

create index if not exists idx_gallery_group_photos_group_id
  on public.gallery_group_photos(group_id);

drop trigger if exists trg_gallery_groups_updated_at on public.gallery_groups;
create trigger trg_gallery_groups_updated_at
before update on public.gallery_groups
for each row execute function public.set_updated_at();

drop trigger if exists trg_gallery_group_photos_updated_at on public.gallery_group_photos;
create trigger trg_gallery_group_photos_updated_at
before update on public.gallery_group_photos
for each row execute function public.set_updated_at();

alter table public.gallery_groups enable row level security;
alter table public.gallery_group_photos enable row level security;

drop policy if exists "Public can read visible gallery groups" on public.gallery_groups;
create policy "Public can read visible gallery groups"
on public.gallery_groups
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Authenticated can read all gallery groups" on public.gallery_groups;
create policy "Authenticated can read all gallery groups"
on public.gallery_groups
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert gallery groups" on public.gallery_groups;
create policy "Authenticated can insert gallery groups"
on public.gallery_groups
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update gallery groups" on public.gallery_groups;
create policy "Authenticated can update gallery groups"
on public.gallery_groups
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete gallery groups" on public.gallery_groups;
create policy "Authenticated can delete gallery groups"
on public.gallery_groups
for delete
to authenticated
using (true);

drop policy if exists "Public can read photos from visible groups" on public.gallery_group_photos;
create policy "Public can read photos from visible groups"
on public.gallery_group_photos
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.gallery_groups g
    where g.id = gallery_group_photos.group_id
      and g.is_visible = true
  )
);

drop policy if exists "Authenticated can read all gallery group photos" on public.gallery_group_photos;
create policy "Authenticated can read all gallery group photos"
on public.gallery_group_photos
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert gallery group photos" on public.gallery_group_photos;
create policy "Authenticated can insert gallery group photos"
on public.gallery_group_photos
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update gallery group photos" on public.gallery_group_photos;
create policy "Authenticated can update gallery group photos"
on public.gallery_group_photos
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete gallery group photos" on public.gallery_group_photos;
create policy "Authenticated can delete gallery group photos"
on public.gallery_group_photos
for delete
to authenticated
using (true);

insert into public.gallery_groups (
  slug,
  title,
  description,
  cover_image_url,
  cover_cloudinary_public_id,
  sort_order,
  is_visible
)
select
  'legacy-gallery',
  'Legacy Gallery',
  'Migrated photos from the previous gallery setup.',
  first_image.image_url,
  first_image.cloudinary_public_id,
  0,
  true
from (
  select image_url, cloudinary_public_id
  from public.gallery_images
  order by sort_order asc, created_at desc
  limit 1
) as first_image
on conflict (slug) do nothing;

insert into public.gallery_group_photos (
  group_id,
  title,
  image_url,
  cloudinary_public_id,
  sort_order,
  created_by,
  created_at,
  updated_at
)
select
  g.id,
  i.title,
  i.image_url,
  i.cloudinary_public_id,
  i.sort_order,
  i.created_by,
  i.created_at,
  i.updated_at
from public.gallery_images i
join public.gallery_groups g on g.slug = 'legacy-gallery'
where not exists (
  select 1
  from public.gallery_group_photos p
  where p.group_id = g.id
    and p.image_url = i.image_url
    and coalesce(p.title, '') = coalesce(i.title, '')
);
