import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * The single seam for admin authentication.
 *
 * Today this is a password gate over a signed, httpOnly session cookie. That is
 * deliberately the only place the check lives, so moving to Supabase Auth with
 * an email allowlist means changing this file and nothing else.
 *
 * A shared password is weak protection for personal data under Saudi Arabia's
 * PDPL. The recommendation in docs/decisions.md stands: move before real
 * submissions arrive.
 */
const COOKIE = "e2w_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (value && value.length >= 16) return value;
  // Without a configured secret, sessions are signed with a per-boot key: they
  // still cannot be forged, they simply do not survive a restart.
  return (globalThis as { __e2wAdminFallback?: string }).__e2wAdminFallback ??= randomBytes(32).toString("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Constant-time comparison, so a wrong password reveals nothing by timing. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    // Still compare something of equal length, to keep the timing flat.
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export async function startSession(): Promise<void> {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  // Must match the path the cookie was set with, or the delete is a no-op and
  // the session survives signing out.
  jar.delete({ name: COOKIE, path: "/admin" });
}

export async function isSignedIn(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}
