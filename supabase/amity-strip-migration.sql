-- ---------------------------------------------------------------------------
-- AMITY ADMIN — LOGO STRIP MIGRATION
--
-- Run this file in the Supabase SQL Editor. It adds the table that
-- powers the moving logo strip on /labels, seeds it with the five
-- logos that are on the strip today, and adds the strip speed
-- setting (pixels per second, default 67 — UMG's strip runs at
-- about 44).
--
-- What it adds:
--   * public.strip_items — one row per logo in the strip
--     (id, slug, name, image, height_px, visible, sort_order)
--   * site_settings.strip_speed_px_per_sec — the speed control
--
-- The public site reads strip_items with the anon key, like the
-- companies table, so it needs the same "Public read" policy and
-- select grant. Writes go through the service-role key only, from
-- the /admin/strip save routes.
--
-- Safe to re-run: the table is created only if missing, the column
-- is added only if missing, and the seed rows are inserted only
-- when their slug is not already there — running it twice changes
-- nothing the second time.
-- ---------------------------------------------------------------------------

create table if not exists public.strip_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  image text not null default '',
  height_px integer not null default 90,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.strip_items enable row level security;

drop policy if exists "Public read" on public.strip_items;
create policy "Public read" on public.strip_items
  for select to anon using (true);

grant usage on schema public to anon, service_role;
grant select on public.strip_items to anon;
grant all on public.strip_items to service_role;

-- The five logos on the strip today, in today's order and at
-- today's heights (Dial is the wide, short wordmark at 60 px).
insert into public.strip_items (slug, name, image, height_px, visible, sort_order)
values
  ('iron-stage-touring', 'Iron Stage Touring', '/logos/is-logo.png', 90, true, 0),
  ('arden-row', 'Arden Row', '/logos/ar-logo.png', 70, true, 1),
  ('amity-christian-music-group', 'Amity Christian Music Group', '/logos/a-cross-logo.png', 90, true, 2),
  ('dial-recordings-america', 'Dial Recordings America', '/logos/dial-recordings-america.png', 60, true, 3),
  ('melted-mindz-records', 'Melted Mindz Records', '/logos/melted-mindz-records.png', 90, true, 4)
on conflict (slug) do nothing;

-- Strip speed: pixels per second. 67 is the speed the strip runs
-- at today; 44 is about UMG's speed.
alter table public.site_settings
  add column if not exists strip_speed_px_per_sec integer not null default 67;
