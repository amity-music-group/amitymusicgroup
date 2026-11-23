-- ---------------------------------------------------------------------------
-- MIGRATION — Amity Music Group admin: picture management (hero image)
--
-- Run this file in the Supabase SQL Editor BEFORE merging the PR that
-- adds image uploads / the homepage hero image. The admin code reads
-- and writes site_settings.hero_image; until this migration has run,
-- saving settings will fail on the missing column.
--
-- The `site-images` Storage bucket already exists (created 2026-11-23,
-- public: true) — there is NO bucket step in this migration and no
-- bucket to create. Safe to re-run.
-- ---------------------------------------------------------------------------

alter table public.site_settings add column if not exists hero_image text not null default '';
