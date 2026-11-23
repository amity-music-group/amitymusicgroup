import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  createSharedAdminSessionToken,
  passwordMatches,
  SESSION_TTL_SECONDS,
} from "@/lib/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
  secure: process.env.NODE_ENV === "production",
};

/**
 * POST /api/admin/login — sign in with the shared admin password
 * (ADMIN_PASSWORD env var, default "amity" — see README). Issues a
 * signed session token in an httpOnly cookie for 7 days.
 */
export async function POST(request: NextRequest) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json(
      { error: "Enter the admin password." },
      { status: 400 },
    );
  }

  if (!passwordMatches(password)) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, shared: true });
  response.cookies.set(
    ADMIN_COOKIE,
    createSharedAdminSessionToken(),
    COOKIE_OPTIONS,
  );
  return response;
}
