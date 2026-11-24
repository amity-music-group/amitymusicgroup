/**
 * Content types for Amity Music Group.
 *
 * These mirror the Supabase tables created by
 * supabase/amity-admin-migration.sql (snake_case there, camelCase
 * here — see lib/supabase.ts for the mapping).
 */

export interface Artist {
  id: string;
  slug: string;
  name: string;
  genre: string;
  status: string;
  location: string;
  image: string;
  description: string;
  bio: string;
  website?: string;
  instagram?: string;
  spotify?: string;
  youtube?: string;
  visible: boolean;
  sortOrder: number;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  website?: string;
  image?: string;
  foundedYear: number | null;
  location: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  visible: boolean;
  sortOrder: number;
}

export interface StripItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  /** Logo height in px on desktop (about 71% of this on phones). */
  heightPx: number;
  visible: boolean;
  sortOrder: number;
}

export interface Release {
  id: string;
  artistId: string;
  title: string;
  type: string;
  releaseDate: string;
  link: string;
  visible: boolean;
  sortOrder: number;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  recordType: string;
  recordId: string;
  detail: string;
  createdAt: string;
}

export interface MediaFile {
  name: string;
  path: string;
  size: number;
  updatedAt: string;
  url: string;
}

export interface AdminStats {
  artists: number;
  companies: number;
  services: number;
  territories: number;
  releases: number;
  subscribers: number;
  unreadMessages: number;
  emailSends: number;
}

export interface RecentActivityItem {
  id: string;
  kind: "edit" | "message" | "subscriber";
  label: string;
  detail: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  offerings: string[];
  visible: boolean;
  sortOrder: number;
}

export interface Territory {
  id: string;
  slug: string;
  name: string;
  region: string;
  website?: string;
  visible: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  tagline: string;
  heroImage: string;
  heroSubcopy: string;
  aboutIntro: string;
  aboutBody: string;
  aboutPageIntro: string;
  aboutPageBody: string;
  missionTitle: string;
  missionBody: string;
  contactIntro: string;
  footerText: string;
  emailGeneral: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  seoTitle: string;
  seoDescription: string;
  /** Speed of the /labels logo strip in px per second (default 67). */
  stripSpeedPxPerSec: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  unsubscribedAt?: string;
}

export interface EmailLogEntry {
  id: string;
  kind: string;
  subject: string;
  recipientCount: number;
  status: string;
  createdAt: string;
}
