// Zod schemas for the five /join modes. Error messages are message keys resolved
// by next-intl (join.errors.*), never user-facing English.
//
// Adapted from starters/src/lib/schemas.ts. Two options were ported from Zod 3 to
// Zod 4 (`errorMap`/`invalid_type_error` -> `error`): under Zod 4 the old names are
// ignored, so the consent and graduationYear keys were being replaced by English
// defaults and would have leaked into the Arabic form. See docs/step-0-review.md B4.
// tests/schemas.test.mjs asserts every issue message stays a known message key.
import { z } from "zod";
import { programmes } from "@/content/programmes";
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

/**
 * Derived from the programme list rather than restated here.
 *
 * These two were separate lists until Launchpad Labs was added to the content
 * and not to this enum: the join form renders a checkbox per programme, so the
 * tenth box appeared, the visitor could tick it, and the server then rejected
 * the whole application -- a dead-end form, which the brief forbids outright.
 * Deriving it means adding a programme cannot produce an option the server
 * refuses. Cast for the same reason `locale` above is cast: z.enum wants a
 * non-empty tuple, and a mapped array is not one.
 */
export const programmeKeys = programmes.map((p) => p.key) as [string, ...string[]];

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
  // Free text on screen ("Arabic, English, Somali"), a list in storage.
  // Accepts either shape so the client resolver and the server agree.
  languages: z
    .preprocess(
      (value) =>
        typeof value === "string"
          ? value
              .split(/[,\u060C]/)
              .map((part) => part.trim())
              .filter(Boolean)
          : value,
      z.array(z.string()),
    )
    .default([]),
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
