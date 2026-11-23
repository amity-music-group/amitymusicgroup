import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "amg-admin";

/** scrypt-free shared-password gate. v1 has one admin password; the
 * env var is the source of truth and the documented default below
 * applies until it is set in Vercel. */

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "amity";
}

// ---------------------------------------------------------------------------
// Sessions (signed tokens in httpOnly cookies)
// ---------------------------------------------------------------------------

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminSession {
  sub: "shared";
  role: "shared";
  name: string;
  email: string;
  exp: number;
}

function b64urlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function b64urlDecode(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function signToken(payload: AdminSession, secret: string): string {
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token: string, secret: string): AdminSession | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest();
  const actual = Buffer.from(sig, "base64url");
  if (actual.length !== expected.length) return null;
  if (!timingSafeEqual(actual, expected)) return null;
  const json = b64urlDecode(body);
  if (!json) return null;
  try {
    const payload = JSON.parse(json) as AdminSession;
    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 < Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function createSharedAdminSessionToken(): string {
  return signToken(
    {
      sub: "shared",
      role: "shared",
      name: "Staff",
      email: "",
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
    adminPassword(),
  );
}

export function getAdminSession(
  token: string | undefined | null,
): AdminSession | null {
  if (!token) return null;
  const signed = verifyToken(token, adminPassword());
  return signed && signed.role === "shared" ? signed : null;
}

export async function isValidSession(
  token: string | undefined | null,
): Promise<boolean> {
  return getAdminSession(token) !== null;
}

/** Constant-time password comparison (avoids leaking the password
 * length or contents through timing). */
export function passwordMatches(candidate: string): boolean {
  const expected = Buffer.from(adminPassword());
  const actual = Buffer.from(candidate);
  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}
