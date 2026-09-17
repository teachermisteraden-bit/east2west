"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { checkPassword, startSession, endSession, isSignedIn, isAdminConfigured } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabase, isStorageConfigured } from "@/lib/supabase";

export type LoginState = { error?: "wrong" | "rate-limit" | "unconfigured" };

/** Sign in. Rate limited, so the password cannot be guessed at speed. */
export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) return { error: "unconfigured" };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await checkRateLimit(`admin:${ip}`);
  if (!limit.allowed) return { error: "rate-limit" };

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "wrong" };

  await startSession();
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/** Every mutation re-checks the session: never trust the page that called it. */
async function assertSignedIn(): Promise<void> {
  if (!(await isSignedIn())) redirect("/admin/login");
}

export type SubmissionStatus = "new" | "contacted" | "accepted" | "declined";

export async function setStatus(id: string, status: SubmissionStatus): Promise<void> {
  await assertSignedIn();
  if (!isStorageConfigured()) return;

  const { error } = await getSupabase().from("submissions").update({ status }).eq("id", id);
  if (error) console.error("status update failed", error.message);
  revalidatePath("/admin");
}

export type OpportunityKind = "job" | "contract" | "referral" | "startup";

/**
 * The north-star metric, entered by hand.
 *
 * Opportunities created cannot be measured from web traffic — a job offer
 * happens in a room, not in a browser. So the owner records them, and the number
 * stays honest rather than becoming a proxy for clicks.
 */
export async function addOpportunity(formData: FormData): Promise<void> {
  await assertSignedIn();
  if (!isStorageConfigured()) return;

  const kind = String(formData.get("kind") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 500);
  const occurredOn = String(formData.get("occurred_on") ?? "");

  const kinds: OpportunityKind[] = ["job", "contract", "referral", "startup"];
  if (!kinds.includes(kind as OpportunityKind)) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurredOn)) return;

  const { error } = await getSupabase()
    .from("opportunities")
    .insert({ kind, note: note || null, occurred_on: occurredOn });

  if (error) console.error("opportunity insert failed", error.message);
  revalidatePath("/admin/opportunities");
}
