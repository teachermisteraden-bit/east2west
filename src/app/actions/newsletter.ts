"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

import { getSupabase, isStorageConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import { isEmailConfigured } from "@/lib/email";
import { site } from "@/config/site";
import { locales } from "@/i18n/locales";

const subscribeSchema = z.object({
  email: z.string().trim().email({ message: "email" }),
  locale: z.enum(locales as [string, ...string[]], { error: "required" }),
  website: z.string().max(0).optional(),
});

export type NewsletterResult = { ok: true } | { ok: false; error: "email" | "storage" | "rate-limit" };

/**
 * Double opt-in (04): subscribing only records an intent. Nothing is sent until
 * the visitor clicks the link in the confirmation email, so a mistyped or
 * malicious address never receives our updates.
 *
 * Lists are separated by language — `unique (email, locale)` in the schema —
 * so someone can subscribe in Arabic without also receiving English.
 */
export async function subscribe(raw: unknown): Promise<NewsletterResult> {
  const input = (raw ?? {}) as Record<string, unknown>;

  // Honeypot first, as on the join form.
  if (typeof input.website === "string" && input.website.trim().length > 0) {
    return { ok: true };
  }

  const parsed = subscribeSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "email" };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await checkRateLimit(ip);
  if (!limit.allowed) return { ok: false, error: "rate-limit" };

  if (!isStorageConfigured()) {
    console.error("newsletter signup received but Supabase is not configured");
    return { ok: false, error: "storage" };
  }

  const token = randomBytes(24).toString("hex");
  const { email, locale } = parsed.data;

  try {
    // Re-subscribing before confirming simply refreshes the token; an already
    // confirmed subscriber is left untouched.
    const { error } = await getSupabase()
      .from("newsletter")
      .upsert({ email, locale, token }, { onConflict: "email,locale", ignoreDuplicates: false });

    if (error) {
      console.error("newsletter upsert failed", error.message);
      return { ok: false, error: "storage" };
    }
  } catch (error) {
    console.error("newsletter upsert threw", error);
    return { ok: false, error: "storage" };
  }

  if (isEmailConfigured()) {
    try {
      const t = await getTranslations({ locale, namespace: "footer" });
      const tc = await getTranslations({ locale, namespace: "common" });
      const confirmUrl = `${site.url}/${locale}/newsletter/confirm?token=${token}`;

      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.NOTIFY_EMAIL!,
        to: email,
        subject: t("newsletter"),
        text: `${t("newsletterNote")}\n\n${confirmUrl}\n\n${tc("contactLine")}`,
      });
    } catch (error) {
      console.error("newsletter confirmation email failed", error);
    }
  }

  return { ok: true };
}

export type ConfirmOutcome = "confirmed" | "already" | "invalid";

/** Completes the double opt-in. Called by the confirmation page, not the client. */
export async function confirmSubscription(token: string): Promise<ConfirmOutcome> {
  if (!token || !isStorageConfigured()) return "invalid";

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("newsletter")
      .select("id, confirmed_at, token_expires_at")
      .eq("token", token)
      .maybeSingle();

    if (error || !data) return "invalid";
    if (data.confirmed_at) return "already";
    if (data.token_expires_at && new Date(data.token_expires_at).getTime() < Date.now()) return "invalid";

    const { error: updateError } = await supabase
      .from("newsletter")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("id", data.id);

    if (updateError) return "invalid";
    return "confirmed";
  } catch (error) {
    console.error("newsletter confirmation failed", error);
    return "invalid";
  }
}
