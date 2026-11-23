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
  visible: boolean;
  sortOrder: number;
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

export interface SiteSettings {
  tagline: string;
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
