// Zod schemas for the five /join modes. Error messages are message keys resolved
// by next-intl (join.errors.*), never user-facing English.
//
// Adapted from starters/src/lib/schemas.ts. Two options were ported from Zod 3 to
// Zod 4 (`errorMap`/`invalid_type_error` -> `error`): under Zod 4 the old names are
// ignored, so the consent and graduationYear keys were being replaced by English
// defaults and would have leaked into the Arabic form. See docs/step-0-review.md B4.
// tests/schemas.test.mjs asserts every issue message stays a known message key.
import { z } from "zod";
import { locales } from "@/i18n/locales";

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{8,20}$/, { message: "phone" }); // Saudi (+966 5X...) and international allowed

const consent = z.literal(true, { error: "consent" });

const tracking = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  campaign: z.string().optional(), // from /go/[campaign]
  ref: z.string().max(32).optional(), // referral code
  locale: z.enum(locales as [string, ...string[]], { error: "required" }),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export const programmeKeys = [
  "businessEnglish", "workplaceArabic", "financialLiteracy", "careerReadiness",
  "networking", "mentorship", "startupClinic", "talentDirectory", "hiringEvents",
] as const;

export const sponsorshipOptions = [
  "programme", "hiringEvent", "chapterPatron", "scholarship", "keynoteSeries", "summit",
] as const;

export const graduateSchema = tracking.extend({
  mode: z.literal("graduate"),
  fullName: z.string().trim().min(2, { message: "required" }),
  email: z.string().trim().email({ message: "email" }),
  mobile: phone,
  city: z.string().trim().min(2, { message: "required" }),
  nationality: z.string().trim().min(2, { message: "required" }),
  status: z.enum(["graduate", "student"], { error: "required" }),
  university: z.string().trim().min(2, { message: "required" }),
  fieldOfStudy: z.string().trim().min(2, { message: "required" }),
  graduationYear: z.coerce.number({ error: "graduationYear" }).int().min(1970).max(2035, { message: "tooLong" }),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.enum(programmeKeys, { error: "required" })).min(1, { message: "required" }),
  womensCircle: z.boolean().optional(), // private; never displayed publicly
  linkedin: z.string().url({ message: "url" }).optional().or(z.literal("")),
  contribute: z.string().max(600, { message: "tooLong" }).optional(),
  consent,
});

export const universitySchema = tracking.extend({
  mode: z.literal("university"),
  institution: z.string().trim().min(2, { message: "required" }),
  contactName: z.string().trim().min(2, { message: "required" }),
  role: z.string().trim().min(2, { message: "required" }),
  email: z.string().trim().email({ message: "email" }),
  phone,
  city: z.string().trim().min(2, { message: "required" }),
  interest: z
    .array(z.enum(["campusChapter", "training", "hiringEvent", "challengeCycle"], { error: "required" }))
    .min(1, { message: "required" }),
  semester: z.string().optional(),
  message: z.string().max(1500, { message: "tooLong" }).optional(),
  consent,
});

export const sponsorSchema = tracking.extend({
  mode: z.literal("sponsor"),
  company: z.string().trim().min(2, { message: "required" }),
  contactName: z.string().trim().min(2, { message: "required" }),
  role: z.string().trim().min(2, { message: "required" }),
  email: z.string().trim().email({ message: "email" }),
  phone,
  sector: z.string().trim().min(2, { message: "required" }),
  options: z.array(z.enum(sponsorshipOptions, { error: "required" })).min(1, { message: "required" }),
  budget: z.string().default("discuss"),
  message: z.string().max(1500, { message: "tooLong" }).optional(),
  consent,
});

export const businessSchema = tracking.extend({
  mode: z.literal("business"),
  company: z.string().trim().min(2, { message: "required" }),
  contactName: z.string().trim().min(2, { message: "required" }),
  role: z.string().trim().min(2, { message: "required" }),
  email: z.string().trim().email({ message: "email" }),
  phone,
  sector: z.string().trim().min(2, { message: "required" }),
  roles: z
    .array(z.enum(["networking", "keynote", "hiring", "challenge"], { error: "required" }))
    .min(1, { message: "required" }),
  hiringNeeds: z.string().max(1000, { message: "tooLong" }).optional(),
  message: z.string().max(1500, { message: "tooLong" }).optional(),
  consent,
});

export const chapterSchema = tracking.extend({
  mode: z.literal("chapter"),
  fullName: z.string().trim().min(2, { message: "required" }),
  email: z.string().trim().email({ message: "email" }),
  mobile: phone,
  chapterCity: z.string().trim().min(2, { message: "required" }),
  coDirector: z.enum(["yes", "no", "notYet"], { error: "required" }),
  message: z.string().max(1500, { message: "tooLong" }).optional(),
  consent,
});

export const joinSchema = z.discriminatedUnion("mode", [
  graduateSchema, universitySchema, sponsorSchema, businessSchema, chapterSchema,
]);
export type JoinInput = z.infer<typeof joinSchema>;
