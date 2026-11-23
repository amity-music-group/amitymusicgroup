-- ---------------------------------------------------------------------------
-- PRELOAD — Companies under Amity Music Group (100)
--
-- Run this file in the Supabase SQL Editor. It adds the Amity Music
-- Group subsidiaries that are not in the companies table yet, so they
-- show as tiles on /labels.
--
-- Under Amity Music Group (from the corporate directory):
--   150 – Amity Music Records
--   200 – Amity Music Publishing
--   250 – Melted Mindz Records (already in the table, not touched)
--   300 – Melted Mindz Publishing
--   350 – M3A International
--   900 – DIAL Distribution (application-only distribution platform,
--          owned by DIAL Recordings America)
--   901 – DIAL Recordings America LLC (already in the table as
--          Dial Recordings America, not touched; it is under Amity
--          Music Group and is the parent company of DIAL Distribution)
--
-- NOT included here: Iron Stage Touring, Arden Row and Amity Christian
-- Music Group — they are not under Amity Music Group (Iron Stage is a
-- strategic partner, Arden Row is 550, Amity Christian is 400).
--
-- Taglines and descriptions are left blank on purpose — nothing is
-- invented. Fill them in in /admin when ready. Companies with no logo
-- yet show their name as a text tile.
-- Safe to re-run: rows are only inserted when their slug is missing.
-- ---------------------------------------------------------------------------

insert into public.companies
  (slug, name, tagline, category, description, website, image,
   founded_year, location, instagram, facebook, tiktok, youtube,
   visible, sort_order)
values
  ('amity-music-records', 'Amity Music Records', '', 'Record Label',
   '', null, null,
   null, '', null, null, null, null,
   true, 0),
  ('amity-music-publishing', 'Amity Music Publishing', '', 'Music Publishing',
   '', null, null,
   null, '', null, null, null, null,
   true, 1),
  ('melted-mindz-publishing', 'Melted Mindz Publishing', '', 'Music Publishing',
   '', null, null,
   null, '', null, null, null, null,
   true, 2),
  ('m3a-international', 'M3A International', '', 'International Music',
   '', null, null,
   null, '', null, null, null, null,
   true, 3),
  ('dial-distribution', 'DIAL Distribution', '', 'Distribution',
   '', null, null,
   null, '', null, null, null, null,
   true, 4)
on conflict (slug) do nothing;
