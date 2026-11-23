-- ---------------------------------------------------------------------------
-- MIGRATION — Amity Music Group admin portal (v1)
--
-- Run this file in the Supabase SQL Editor BEFORE merging the PR that
-- adds the /admin portal. The admin code reads these tables; the site
-- will error on admin saves (and the public pages will keep showing
-- their static fallback) until this migration has run.
--
-- Tables: artists, companies, services, site_settings (public reads),
-- contact_submissions, newsletter_subscribers, email_log (server only).
-- All tables start EMPTY — nothing is seeded and nothing is invented.
-- The public pages keep showing their current static copy until rows
-- are added in /admin.
--
-- Project settings note: this project has "Grant API access to new
-- tables automatically" OFF, so this migration includes explicit
-- GRANTs — do not rely on automatic exposure. RLS is enabled
-- explicitly on every table ("Enable RLS on new tables automatically"
-- is ON, and this file enables it again so the intent is recorded).
-- Safe to re-run.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Artists & Releases (public read)
-- ---------------------------------------------------------------------------
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  genre text not null default '',
  status text not null default '',
  location text not null default '',
  image text not null default '',
  description text not null default '',
  bio text not null default '',
  website text,
  instagram text,
  spotify text,
  youtube text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Companies (public read)
-- ---------------------------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  category text not null default '',
  description text not null default '',
  website text,
  image text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Services (public read)
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  number text not null default '',
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  offerings jsonb not null default '[]'::jsonb,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Site settings (public read, single row id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  tagline text not null default 'Independent Culture. Major Sound.',
  hero_subcopy text not null default '',
  about_intro text not null default '',
  about_body text not null default '',
  about_page_intro text not null default '',
  about_page_body text not null default '',
  mission_title text not null default '',
  mission_body text not null default '',
  contact_intro text not null default '',
  footer_text text not null default '',
  email_general text not null default 'info@amitymusicgroup.com',
  instagram text not null default '',
  facebook text not null default '',
  tiktok text not null default '',
  youtube text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- ---------------------------------------------------------------------------
-- Contact submissions (server only — never public)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Newsletter subscribers (server only — never public)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'subscribed',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Email log (server only — records admin blasts)
-- ---------------------------------------------------------------------------
create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  subject text not null default '',
  recipient_count integer not null default 0,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — ON for every table, explicitly.
-- ---------------------------------------------------------------------------
alter table public.artists enable row level security;
alter table public.companies enable row level security;
alter table public.services enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.email_log enable row level security;

-- ---------------------------------------------------------------------------
-- Policies — public read ONLY on the four content tables, anon only.
-- contact_submissions, newsletter_subscribers and email_log have NO
-- policies on purpose: the anon key cannot read or write them at all.
-- Only the server, with the service-role key, touches those tables.
-- ---------------------------------------------------------------------------
drop policy if exists "Public read" on public.artists;
create policy "Public read" on public.artists
  for select to anon using (true);

drop policy if exists "Public read" on public.companies;
create policy "Public read" on public.companies
  for select to anon using (true);

drop policy if exists "Public read" on public.services;
create policy "Public read" on public.services
  for select to anon using (true);

drop policy if exists "Public read" on public.site_settings;
create policy "Public read" on public.site_settings
  for select to anon using (true);

-- ---------------------------------------------------------------------------
-- Grants — explicit, because automatic grants are OFF on this project.
-- anon: SELECT on the four public-read tables only.
-- service_role: ALL on every table (it bypasses RLS, but still needs
-- the table grant for Data API access).
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, service_role;

grant select on public.artists to anon;
grant select on public.companies to anon;
grant select on public.services to anon;
grant select on public.site_settings to anon;

grant all on public.artists to service_role;
grant all on public.companies to service_role;
grant all on public.services to service_role;
grant all on public.site_settings to service_role;
grant all on public.contact_submissions to service_role;
grant all on public.newsletter_subscribers to service_role;
grant all on public.email_log to service_role;
