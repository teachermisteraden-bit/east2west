import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { getSupabase, isStorageConfigured } from "./supabase";

/**
 * Rate limiting for form submissions.
 *
 * Keyed on a salted hash of the caller's IP. The salt lives only in the
 * environment, the raw address is never written down, and the counter row holds
 * nothing but a hash, a window and a count — it cannot be joined back to a
 * submission or to a person. That keeps abuse protection compatible with
 * collecting the minimum (non-negotiable 7).
 *
 * Falls back to an in-process counter when storage is not configured. That is
 * per-instance and therefore weak on serverless, so it is a development
 * convenience, not the production control.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const memory = new Map<string, { count: number; expires: number }>();

/** Generated per boot if unset, so a missing salt never means an unsalted hash. */
const SALT = process.env.RATE_LIMIT_SALT ?? randomBytes(16).toString("hex");

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds?: number };

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const key = hashIp(ip);
  const now = Date.now();

  if (!isStorageConfigured()) {
    const entry = memory.get(key);
    if (!entry || entry.expires < now) {
      memory.set(key, { count: 1, expires: now + WINDOW_MS });
      return { allowed: true };
    }
    entry.count += 1;
    if (entry.count > MAX_PER_WINDOW) {
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.expires - now) / 1000) };
    }
    return { allowed: true };
  }

  const windowStart = new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS).toISOString();
  const supabase = getSupabase();

  const { data, error } = await supabase
    .rpc("bump_rate_limit", { p_key: key, p_window_start: windowStart })
    .single<{ count: number }>();

  if (error) {
    // Never block a genuine applicant because the limiter itself failed.
    console.error("rate limit check failed, allowing request", error.message);
    return { allowed: true };
  }

  if ((data?.count ?? 0) > MAX_PER_WINDOW) {
    return { allowed: false, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }
  return { allowed: true };
}
