-- ---------------------------------------------------------------------------
-- MIGRATION — Amity Music Group admin: beefy admin portal
--
-- Run this file in the Supabase SQL Editor BEFORE merging the PR that
-- adds the beefy admin features (dashboard stats, media library,
-- richer editors, email history, activity log, fuller site settings).
-- The admin code reads and writes the new columns and tables; until
-- this migration has run, saving companies/settings/releases will fail
-- and the activity log stays empty.
--
-- New columns on companies (founded year, location, social links) and
-- site_settings (SEO defaults). Two new tables: releases (per-artist
-- releases, admin-side detail for now — the public Artists page does
-- NOT render them yet) and admin_activity_log (admin action history).
--
-- All tables start EMPTY — nothing is seeded and nothing is invented.
--
-- Project settings note: this project has "Grant API access to new
-- tables automatically" OFF, so this migration includes explicit
-- GRANTs — do not rely on automatic exposure. RLS is enabled
-- explicitly on every new table. Safe to re-run.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Companies: founded year, location, social links
-- ---------------------------------------------------------------------------
alter table public.companies
  add column if not exists founded_year integer;
alter table public.companies
  add column if not exists location text not null default '';
alter table public.companies
  add column if not exists instagram text;
alter table public.companies
  add column if not exists facebook text;
alter table public.companies
  add column if not exists tiktok text;
alter table public.companies
  add column if not exists youtube text;

-- ---------------------------------------------------------------------------
-- Site settings: SEO defaults
-- ---------------------------------------------------------------------------
alter table public.site_settings
  add column if not exists seo_title text not null default '';
alter table public.site_settings
  add column if not exists seo_description text not null default '';

-- ---------------------------------------------------------------------------
-- Releases (admin-side detail for now — no public read policy on
-- purpose; the public Artists page does not render releases yet)
-- ---------------------------------------------------------------------------
create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null,
  title text not null,
  type text not null default '',
  release_date date,
  link text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- NOTE: no foreign key to artists(id) on purpose. The artists editor
-- bulk-replaces the artists table (delete all + re-insert with the
-- same ids); a foreign key with ON DELETE CASCADE would wipe every
-- release on every artists save. artist_id is validated in the
-- releases API route instead (the artist must exist before its
-- releases are saved).
create index if not exists releases_artist_id_idx
  on public.releases (artist_id);

-- ---------------------------------------------------------------------------
-- Activity log (server only — never public)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  record_type text not null,
  record_id text not null default '',
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_log_created_at_idx
  on public.admin_activity_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security — ON for every new table, explicitly.
-- ---------------------------------------------------------------------------
alter table public.releases enable row level security;
alter table public.admin_activity_log enable row level security;

-- ---------------------------------------------------------------------------
-- Policies — neither new table has a public policy on purpose.
-- releases is admin-side detail for now; admin_activity_log is
-- server-only. Only the server, with the service-role key, touches
-- them. (The anon key cannot read or write either table at all.)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Grants — explicit, because automatic grants are OFF on this project.
-- service_role only (it bypasses RLS, but still needs the table
-- grant for Data API access). No anon grant on either table.
-- ---------------------------------------------------------------------------
grant all on public.releases to service_role;
grant all on public.admin_activity_log to service_role;
