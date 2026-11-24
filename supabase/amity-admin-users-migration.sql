-- Admin allowlist for the Amity admin portal (Supabase Auth SSO).
--
-- The /admin sign-in is Supabase Auth, but being able to sign in is
-- not enough: only the email addresses in public.admin_users can
-- get into /admin. Admins manage that list from the /admin/admins
-- page in the portal itself — no Vercel env change, no redeploy.
--
-- How the check works:
-- - public.is_admin_email(email) is a SECURITY DEFINER function:
--   it reads the table for the caller, so the table itself needs no
--   public policy and the admin email list is not enumerable. The
--   proxy and the server session check call it with the anon key.
-- - ADMIN_EMAILS (Vercel env var) still counts as well, so the two
--   addresses already allowed keep working even before this file
--   runs, and as a fallback if the table is ever empty.
--
-- Run this in the Supabase SQL Editor, then the /admin/admins page
-- works. Safe to re-run.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- No policies on the table itself: only the service role (used by
-- the /admin/admins API route) can read and write it directly.
grant select, insert, update, delete on public.admin_users to service_role;

create or replace function public.is_admin_email(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(p_email)
  );
$$;

grant execute on function public.is_admin_email(text) to anon, authenticated, service_role;

-- Seed the two admins already allowed via ADMIN_EMAILS.
insert into public.admin_users (email) values
  ('amitymusicgroup@yahoo.com'),
  ('alx.dmrks@gmail.com')
on conflict (email) do nothing;
