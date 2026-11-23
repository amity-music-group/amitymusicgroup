This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin portal

The site has a password-gated admin portal at `/admin` where the
artists, companies, services, site copy, contact inbox and newsletter
are managed. Saves go live on the site within seconds — no redeploy.

### Setup (do this once, in this order)

1. **Run the migration.** In the Supabase SQL Editor, run
   `supabase/amity-admin-migration.sql`. It creates the seven admin
   tables (`artists`, `companies`, `services`, `site_settings`,
   `contact_submissions`, `newsletter_subscribers`, `email_log`) with
   Row Level Security on, public read only on the four content
   tables, and explicit grants (this project has automatic grants
   off, so the grants are in the file — do not rely on automatic
   exposure). The tables start empty; the public pages keep showing
   their current static copy until rows are added in `/admin`. The
   file is safe to re-run. **Run it before this code merges — admin
   saves will fail until the tables exist.**
2. **Set the environment variables in Vercel** (all environments,
   then redeploy):
   - `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase anon (public) key
   - `SUPABASE_SERVICE_ROLE_KEY` — the Supabase service-role key
     (server only, never `NEXT_PUBLIC_`)
   - `ADMIN_PASSWORD` — the admin password. **Set a real one.** Until
     it is set, the documented default `amity` works.
   - `RESEND_API_KEY` — already set (production). Needed for the
     contact form, the welcome email and newsletter blasts.
   - `UNSUBSCRIBE_SECRET` — optional. Signs the one-click
     unsubscribe links in admin emails; defaults to the admin
     password when unset.
   - `NEXT_PUBLIC_SITE_URL` — optional. Base URL used in email links;
     defaults to `https://amitymusicgroup.com`.
3. **Sign in** at `https://amitymusicgroup.com/admin` with the admin
   password.

### What the admin edits

- **Artists** — the Artists & Releases page (name, genre, status,
  location, image URL, description, bio, links, visible toggle).
- **Companies** — the Companies page.
- **Services** — the Services page cards. The homepage shows the
  first six visible services as its focus areas.
- **Site Settings** — tagline, homepage and About copy, mission,
  contact intro, contact email, social links.
- **Inbox** — every contact form submission (also emailed to the
  general contact address).
- **Newsletter** — subscribers from the footer signup form, and the
  email blast tool (Resend). Every blast includes a signed
  one-click unsubscribe link.

### Notes

- The public pages read Supabase when it is configured and fall back
  to the site's current static copy when it is not, a read fails, or
  a table is empty. Emptying a table in `/admin` never blanks a
  section.
- `POST /api/send-email` requires an admin session. It used to
  accept unauthenticated requests with an arbitrary recipient; the
  blast tool sends through `lib/email.ts` instead.
