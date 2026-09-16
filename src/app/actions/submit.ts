"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

import { joinSchema, type JoinInput } from "@/lib/schemas";
import { getSupabase, isStorageConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendAcknowledgement, notifyOwner } from "@/lib/email";
import { formatDual } from "@/lib/dates";
import { site, pick } from "@/config/site";

export type SubmitResult =
  | {
      ok: true;
      name: string;
      gregorian: string;
      hijri: string;
      referralCode: string | null;
      /** Built here, not in the browser: SITE_URL is server-only. */
      inviteUrl: string | null;
      emailSent: boolean;
    }
  | { ok: false; error: "validation" | "rate-limit" | "storage" | "unknown"; fieldErrors?: Record<string, string> };

/** A short, unambiguous invite code. Avoids characters that look alike when read aloud. */
function makeReferralCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function callerIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

/**
 * Handles a /join submission.
 *
 * Order matters: validate, then rate limit, then store, then email. Storage is
 * the only step allowed to fail the submission — if the acknowledgement cannot
 * be sent, the application is still safely recorded and the visitor is still
 * told it arrived. Losing an application because an email provider was down
 * would be the worst outcome here.
 */
export async function submitJoin(raw: unknown): Promise<SubmitResult> {
  const input = (raw ?? {}) as Record<string, unknown>;

  // The honeypot is checked first. A real visitor cannot fill this field, so
  // anything in it means a bot: nothing is stored, and the response is
  // success-shaped so the bot learns nothing about how it was caught.
  const trap = input.website;
  if (typeof trap === "string" && trap.trim().length > 0) {
    const locale = input.locale === "ar" ? "ar" : "en";
    const { gregorian, hijri } = formatDual(new Date(), locale);
    return { ok: true, name: "", gregorian, hijri, referralCode: null, inviteUrl: null, emailSent: false };
  }

  // Validated again on the server, whatever the client believed.
  const parsed = joinSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "validation", fieldErrors };
  }

  const data: JoinInput = parsed.data;

  const headerList = await headers();
  const limit = await checkRateLimit(callerIp(headerList));
  if (!limit.allowed) return { ok: false, error: "rate-limit" };

  const now = new Date();
  const { gregorian, hijri } = formatDual(now, data.locale === "ar" ? "ar" : "en");

  // Graduates get a personal invite link; the other modes do not need one.
  const referralCode = data.mode === "graduate" ? makeReferralCode() : null;

  // The applicant's own name for the confirmation card, whichever field holds it.
  const name = "fullName" in data ? data.fullName : "contactName" in data ? data.contactName : "";

  if (!isStorageConfigured()) {
    // Nothing is silently dropped: the owner sees this in the logs, and the
    // visitor is not told their application arrived when it did not.
    console.error("submission received but Supabase is not configured");
    return { ok: false, error: "storage" };
  }

  // The consent text itself is not duplicated into the row — the version the
  // visitor agreed to lives on the Privacy page. We record that they agreed and when.
  const { website: _honeypot, consent: _consent, ...payload } = data as Record<string, unknown> & {
    website?: unknown;
    consent?: unknown;
  };

  try {
    const { error } = await getSupabase()
      .from("submissions")
      .insert({
        mode: data.mode,
        locale: data.locale,
        payload,
        consent_at: now.toISOString(),
        utm_source: data.utm_source ?? null,
        utm_medium: data.utm_medium ?? null,
        utm_campaign: data.utm_campaign ?? null,
        campaign: data.campaign ?? null,
        ref: data.ref ?? null,
        referral_code: referralCode,
        status: "new",
      });

    if (error) {
      console.error("submission insert failed", error.message);
      return { ok: false, error: "storage" };
    }
  } catch (error) {
    console.error("submission insert threw", error);
    return { ok: false, error: "storage" };
  }

  // Everything below is best effort. The application is already safe.
  const locale = data.locale === "ar" ? "ar" : "en";
  let emailSent = false;

  try {
    const t = await getTranslations({ locale, namespace: "email" });
    const tj = await getTranslations({ locale, namespace: "join" });
    const tc = await getTranslations({ locale, namespace: "common" });
    const tconf = await getTranslations({ locale, namespace: "confirmation" });

    const typeNoun = tj(`typeNoun.${data.mode}`);
    const responseTime = pick(site.responseTime, locale);

    const result = await sendAcknowledgement({
      to: data.email,
      locale,
      name,
      typeNoun,
      responseTime,
      strings: {
        subject: t("subject", { type: typeNoun }),
        greeting: t("greeting", { name }),
        body: tconf("body", { name, type: typeNoun, responseTime }),
        dateLine: tconf("date", { gregorian, hijri }),
        next: tconf("next"),
        signoff: t("signoff"),
        contactLine: tc("contactLine"),
        founded: tc("founded"),
      },
    });
    emailSent = result.sent;

    await notifyOwner(data.mode, locale, now);
  } catch (error) {
    console.error("post-submission messaging failed", error);
  }

  const inviteUrl = referralCode ? `${site.url}/${locale}?ref=${referralCode}` : null;

  return { ok: true, name, gregorian, hijri, referralCode, inviteUrl, emailSent };
}
