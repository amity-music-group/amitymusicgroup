-- ---------------------------------------------------------------------------
-- PRELOAD — Amity Music Group companies: Iron Stage Touring, Arden Row,
-- Amity Christian Music Group
--
-- Run this file in the Supabase SQL Editor. It adds the three companies
-- that appear in the /labels logo strip but are not in the companies
-- table yet, so they show as tiles on /labels as well as in the strip.
-- Melted Mindz Records and Dial Recordings America are already in the
-- table and are NOT touched here.
--
-- Iron Stage Touring is a strategic partner, so its category is set
-- to "Strategic Partner". Arden Row and Amity Christian Music Group
-- are preloaded with a blank category — choose one for each in
-- /admin (Companies), where Category is now a drop-down.
-- Taglines and descriptions are left blank on purpose — nothing is
-- invented. Fill them in in /admin when ready.
--
-- Images use the black transparent logos already on the site
-- (/logos/*.png), which render on the pale-grey tiles.
-- Safe to re-run: rows are only inserted when their slug is missing.
-- ---------------------------------------------------------------------------

insert into public.companies
  (slug, name, tagline, category, description, website, image,
   founded_year, location, instagram, facebook, tiktok, youtube,
   visible, sort_order)
values
  ('iron-stage-touring', 'Iron Stage Touring', '', 'Strategic Partner',
   '', null, '/logos/is-logo.png',
   null, '', null, null, null, null,
   true, 0),
  ('arden-row', 'Arden Row', '', '',
   '', null, '/logos/ar-logo.png',
   null, '', null, null, null, null,
   true, 1),
  ('amity-christian-music-group', 'Amity Christian Music Group', '', '',
   '', null, '/logos/a-cross-logo.png',
   null, '', null, null, null, null,
   true, 2)
on conflict (slug) do nothing;
