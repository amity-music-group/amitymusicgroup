-- ---------------------------------------------------------------------------
-- MIGRATION — Amity Music Group admin: Global Territories
--
-- Run this file in the Supabase SQL Editor BEFORE merging the PR that
-- adds the Global Territories section to the Companies page and the
-- Territories editor in /admin. The admin code reads and writes the
-- territories table, and the public Companies page reads it; until
-- this migration has run, saving territories will fail and the
-- section stays hidden.
--
-- The table starts EMPTY — nothing is seeded and nothing is invented.
-- The Global Territories section stays hidden on the public site
-- until the first territory is added in /admin.
--
-- Project settings note: this project has "Grant API access to new
-- tables automatically" OFF, so this migration includes explicit
-- GRANTs — do not rely on automatic exposure. RLS is enabled
-- explicitly on the table ("Enable RLS on new tables automatically"
-- is ON, and this file enables it again so the intent is recorded).
-- Safe to re-run.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Territories (public read)
-- ---------------------------------------------------------------------------
create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text not null default '',
  website text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — ON, explicitly.
-- ---------------------------------------------------------------------------
alter table public.territories enable row level security;

-- ---------------------------------------------------------------------------
-- Policies — public read ONLY, anon only. Writes go through the
-- service-role key from the /admin save route.
-- ---------------------------------------------------------------------------
drop policy if exists "Public read" on public.territories;
create policy "Public read" on public.territories
  for select to anon using (true);

-- ---------------------------------------------------------------------------
-- Grants — explicit, because automatic grants are OFF on this project.
-- ---------------------------------------------------------------------------
grant select on public.territories to anon;
grant all on public.territories to service_role;
