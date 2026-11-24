import { NextResponse } from "next/server";
import { signOutServer } from "@/lib/supabase-auth";

/** POST /api/admin/logout — signs the admin out of Supabase Auth. */
export async function POST() {
  await signOutServer();
  return NextResponse.json({ ok: true });
}
