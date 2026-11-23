import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

/** POST /api/admin/logout — clears the admin session cookie. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
