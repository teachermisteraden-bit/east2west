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

export const site = {
  url: process.env.SITE_URL ?? "http://localhost:3000",
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
