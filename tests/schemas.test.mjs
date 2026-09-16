/**
 * Guards the bilingual form errors.
 *
 * Every Zod issue must carry a message KEY that exists under join.errors.* in
 * both locale files — never a literal English sentence. Zod 3 and Zod 4 spell
 * the custom-message option differently, and getting it wrong fails silently:
 * the schema still validates, but the message becomes English prose that then
 * renders untranslated on the Arabic form.
 *
 * Run with: node --experimental-strip-types --test tests/schemas.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  graduateSchema,
  universitySchema,
  sponsorSchema,
  businessSchema,
  chapterSchema,
} from "../src/lib/schemas.ts";

const en = JSON.parse(readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"));
const ar = JSON.parse(readFileSync(new URL("../messages/ar.json", import.meta.url), "utf8"));

// `<key>_draft: true` markers flag strings awaiting owner review; they are
// bookkeeping, not messages, so they must not count as valid error keys.
const knownKeys = Object.keys(en.join.errors).filter((k) => !k.endsWith("_draft"));

const schemas = {
  graduate: graduateSchema,
  university: universitySchema,
  sponsor: sponsorSchema,
  business: businessSchema,
  chapter: chapterSchema,
};

test("every error key exists in both locales", () => {
  for (const key of knownKeys) {
    assert.ok(en.join.errors[key], `en is missing join.errors.${key}`);
    assert.ok(ar.join.errors[key], `ar is missing join.errors.${key}`);
  }
});

test("invalid input yields message keys, never English prose", () => {
  // Deliberately wrong in every field, so each schema reports as much as it can.
  const garbage = {
    mode: "",
    fullName: "",
    email: "not-an-email",
    mobile: "!!",
    city: "",
    nationality: "",
    status: "nope",
    university: "",
    fieldOfStudy: "",
    graduationYear: "not-a-year",
    interests: [],
    consent: false,
    locale: "en",
    institution: "",
    contactName: "",
    role: "",
    phone: "!!",
    interest: [],
    company: "",
    sector: "",
    options: [],
    roles: [],
    chapterCity: "",
    coDirector: "maybe",
  };

  for (const [mode, schema] of Object.entries(schemas)) {
    const result = schema.safeParse({ ...garbage, mode });
    assert.equal(result.success, false, `${mode} should have rejected the garbage payload`);

    for (const issue of result.error.issues) {
      assert.ok(
        knownKeys.includes(issue.message),
        `${mode}.${issue.path.join(".")} produced "${issue.message}" — expected one of: ${knownKeys.join(", ")}. ` +
          `This usually means a Zod custom-message option was spelled for the wrong major version.`,
      );
    }
  }
});

test("the two keys Zod 4 silently drops are still keys", () => {
  const result = graduateSchema.safeParse({
    mode: "graduate",
    fullName: "Aisha Rahman",
    email: "aisha@example.com",
    mobile: "+966512345678",
    city: "Madinah",
    nationality: "Saudi",
    status: "graduate",
    university: "Taibah University",
    fieldOfStudy: "Computer Science",
    graduationYear: "not-a-year",
    interests: ["mentorship"],
    consent: false,
    locale: "en",
  });

  assert.equal(result.success, false);
  const messages = result.error.issues.map((i) => i.message);
  assert.ok(messages.includes("graduationYear"), `expected "graduationYear", got ${JSON.stringify(messages)}`);
  assert.ok(messages.includes("consent"), `expected "consent", got ${JSON.stringify(messages)}`);
});

test("a complete, valid application passes", () => {
  const result = graduateSchema.safeParse({
    mode: "graduate",
    fullName: "Aisha Rahman",
    email: "aisha@example.com",
    mobile: "+966512345678",
    city: "Madinah",
    nationality: "Saudi",
    status: "graduate",
    university: "Taibah University",
    fieldOfStudy: "Computer Science",
    graduationYear: "2025",
    interests: ["mentorship", "careerReadiness"],
    consent: true,
    locale: "ar",
  });
  assert.ok(result.success, JSON.stringify(result.error?.issues));
  assert.equal(result.data.graduationYear, 2025);
});
