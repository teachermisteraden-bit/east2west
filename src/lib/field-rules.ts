/**
 * Client-side validation rules for React Hook Form.
 *
 * Zod stays the authority and still validates every submission on the server.
 * It is simply not shipped to the browser: bundling it cost 105 KB gzipped and
 * pushed /join to 255 KB, well past the 200 KB budget. These rules give the same
 * immediate, kind feedback while the visitor types, using the browser's own
 * constraint primitives.
 *
 * Every message here is a KEY resolved against join.errors.*, exactly as the Zod
 * schemas emit. tests/field-rules.test.mjs asserts that these rules and the
 * schemas agree about which fields are required, so the two cannot drift.
 */
import type { FieldValues, RegisterOptions } from "react-hook-form";

/**
 * React Hook Form's own option type, so combinations it forbids (a pattern
 * alongside valueAsNumber, for instance) fail to compile here rather than
 * silently doing nothing at runtime.
 */
export type Rule = RegisterOptions<FieldValues>;

// Matches the shape the Zod schemas accept, not a stricter or looser one.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^\+?[0-9\s-]{8,20}$/;
export const URL_PATTERN = /^https?:\/\/\S+$/;

const required = (): Rule => ({ required: "required" });

/** At least one box ticked, for multi-selects. */
const atLeastOne: Rule = {
  validate: {
    required: (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value)) || "required",
  },
};

export const fieldRules: Record<string, Rule> = {
  // Identity
  fullName: required(),
  contactName: required(),
  institution: required(),
  company: required(),
  role: required(),
  city: required(),
  nationality: required(),
  sector: required(),
  chapterCity: required(),

  email: { required: "required", pattern: { value: EMAIL_PATTERN, message: "email" } },
  mobile: { required: "required", pattern: { value: PHONE_PATTERN, message: "phone" } },
  phone: { required: "required", pattern: { value: PHONE_PATTERN, message: "phone" } },

  // Study
  status: required(),
  university: required(),
  fieldOfStudy: required(),
  graduationYear: {
    required: "graduationYear",
    valueAsNumber: true,
    min: { value: 1970, message: "graduationYear" },
    max: { value: 2035, message: "graduationYear" },
    validate: {
      graduationYear: (value) => (typeof value === "number" && Number.isFinite(value)) || "graduationYear",
    },
  },

  // Choices
  interests: atLeastOne,
  interest: atLeastOne,
  options: atLeastOne,
  roles: atLeastOne,
  coDirector: required(),

  // Optional free text
  linkedin: { pattern: { value: URL_PATTERN, message: "url" } },
  contribute: { maxLength: { value: 600, message: "tooLong" } },
  hiringNeeds: { maxLength: { value: 1000, message: "tooLong" } },
  message: { maxLength: { value: 1500, message: "tooLong" } },

  // Consent is required and never pre-ticked.
  consent: {
    validate: { consent: (value) => value === true || "consent" },
  },
};

/** Fields that must be filled in, derived from the rules above. */
export function requiredFields(): Set<string> {
  const names = new Set<string>();
  for (const [field, rule] of Object.entries(fieldRules)) {
    if (rule.required) names.add(field);
    else if (rule.validate && Object.keys(rule.validate).length > 0) names.add(field);
  }
  return names;
}

export const ruleFor = (field: string): Rule => fieldRules[field] ?? {};
