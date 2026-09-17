/**
 * Every value that is not yet known comes from the environment. Empty values hide
 * their UI cleanly rather than rendering a placeholder that looks like a claim.
 * Adapted from starters/src/config/site.ts.
 */
import { defaultLocale, type LocaleCode } from "@/i18n/locales";

/** A string the owner has not filled in yet. */
export const isSet = (v: string | undefined | null): v is string => typeof v === "string" && v.trim().length > 0;

type Localised = Partial<Record<LocaleCode, string>> & { [k: string]: string | undefined };

/** Reads a localised config value, falling back to the default locale. */
export function pick(value: Localised, locale: LocaleCode): string {
  return value[locale] ?? value[defaultLocale] ?? "";
}

/**
 * The origin every absolute URL is built from: canonical links, hreflang
 * alternates, the sitemap, OG image URLs and the invite links in confirmation
 * emails.
 *
 * Falling straight back to localhost was dangerous in a way that is silent and
 * expensive. Deploy without SITE_URL and the site tells Google that every
 * canonical URL, every hreflang alternate and every sitemap entry lives on
 * http://localhost:3000 — which can stop the site being indexed at all, and
 * nothing about the page looks wrong while it happens. It became strictly worse
 * once the proxy stopped emitting request-derived `Link:` headers (see
 * i18n/routing.ts), because those were the last signal carrying a real origin.
 *
 * So the platform's own values are used before giving up:
 *   VERCEL_PROJECT_PRODUCTION_URL  the stable production domain, set in every
 *                                  environment, so a preview still points its
 *                                  canonical at production rather than
 *                                  competing with it for the same content
 *   VERCEL_URL                     this specific deployment, better than a lie
 *
 * SITE_URL still wins, and is still what you set once a custom domain exists.
 * localhost is now only reachable when nothing else is, which is to say locally.
 */
const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const siteUrl = isSet(process.env.SITE_URL)
  ? process.env.SITE_URL.replace(/\/$/, "")
  : isSet(vercelHost)
    ? `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
    : "http://localhost:3000";

export const site = {
  url: siteUrl,
  contactName: { en: "Muhsin Aden", ar: "محسن آدن" } as Localised,
  contactRole: { en: "founding coordinator", ar: "المنسّق المؤسِّس" } as Localised,
  email: process.env.CONTACT_EMAIL ?? "",
  phone: process.env.CONTACT_PHONE ?? "",
  whatsappCommunity: process.env.WHATSAPP_COMMUNITY_URL ?? "",
  social: {
    linkedin: process.env.SOCIAL_LINKEDIN ?? "",
    instagram: process.env.SOCIAL_INSTAGRAM ?? "",
    x: process.env.SOCIAL_X ?? "",
    snapchat: process.env.SOCIAL_SNAPCHAT ?? "",
  },
  responseTime: {
    en: process.env.RESPONSE_TIME_EN ?? "3 working days",
    ar: process.env.RESPONSE_TIME_AR ?? "3 أيام عمل",
  } as Localised,
  membershipCost: {
    en: process.env.MEMBERSHIP_COST_EN ?? "Membership fees will be announced soon",
    ar: process.env.MEMBERSHIP_COST_AR ?? "سيُعلن عن رسوم العضوية قريبًا",
  } as Localised,
  campaigns: ["general", "graduates", "universities", "sponsors", "business"] as const,
} as const;

export type Campaign = (typeof site.campaigns)[number];
