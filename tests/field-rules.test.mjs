/**
 * Keeps client-side rules and the Zod schemas honest about each other.
 *
 * Zod validates on the server and is the authority, but it is no longer shipped
 * to the browser — bundling it cost 105 KB gzipped and pushed /join to 255 KB,
 * past the budget. The browser therefore uses React Hook Form's own rules, and
 * the risk is that the two quietly disagree: a field the server insists on that
 * the form lets through, or an error the visitor never sees until submit.
 *
 * These tests compare them behaviourally rather than by inspection.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  graduateSchema,
  universitySchema,
  sponsorSchema,
  businessSchema,
  chapterSchema,
} from "../src/lib/schemas.ts";
import { fieldRules, requiredFields, EMAIL_PATTERN, PHONE_PATTERN, URL_PATTERN } from "../src/lib/field-rules.ts";
import { formSteps } from "../src/lib/form-steps.ts";

const complete = {
  graduate: {
    mode: "graduate",
    locale: "en",
    fullName: "Aisha Rahman",
    email: "aisha@example.com",
    mobile: "+966512345678",
    city: "Madinah",
    nationality: "Saudi",
    status: "graduate",
    university: "Taibah University",
    fieldOfStudy: "Computer Science",
    graduationYear: "2025",
    interests: ["mentorship"],
    consent: true,
  },
  university: {
    mode: "university",
    locale: "en",
    institution: "Taibah University",
    contactName: "Dr Noura",
    role: "Career centre",
    email: "noura@example.com",
    phone: "+966512345678",
    city: "Madinah",
    interest: ["campusChapter"],
    consent: true,
  },
  sponsor: {
    mode: "sponsor",
    locale: "en",
    company: "Example Co",
    contactName: "Khalid",
    role: "Director",
    email: "khalid@example.com",
    phone: "+966512345678",
    sector: "Logistics",
    options: ["programme"],
    consent: true,
  },
  business: {
    mode: "business",
    locale: "en",
    company: "Example Co",
    contactName: "Khalid",
    role: "Director",
    email: "khalid@example.com",
    phone: "+966512345678",
    sector: "Logistics",
    roles: ["networking"],
    consent: true,
  },
  chapter: {
    mode: "chapter",
    locale: "en",
    fullName: "Omar Said",
    email: "omar@example.com",
    mobile: "+966500000000",
    chapterCity: "Jeddah",
    coDirector: "yes",
    consent: true,
  },
};

const schemas = { graduate: graduateSchema, university: universitySchema, sponsor: sponsorSchema, business: businessSchema, chapter: chapterSchema };

test("each complete payload is accepted by its schema", () => {
  for (const [mode, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(complete[mode]);
    assert.ok(result.success, `${mode}: ${JSON.stringify(result.error?.issues)}`);
  }
});

test("every field the server requires is also required on the client", () => {
  const clientRequired = requiredFields();

  for (const [mode, schema] of Object.entries(schemas)) {
    const payload = complete[mode];
    const fieldsOnScreen = new Set(formSteps[mode].flat());

    for (const field of Object.keys(payload)) {
      if (field === "mode" || field === "locale") continue;
      if (!fieldsOnScreen.has(field)) continue;

      const without = { ...payload };
      delete without[field];
      const serverRejects = !schema.safeParse(without).success;

      if (serverRejects) {
        assert.ok(
          clientRequired.has(field),
          `${mode}.${field}: the server rejects it when missing, but the form would let it through. ` +
            `Add a rule for "${field}" in src/lib/field-rules.ts.`,
        );
      }
    }
  }
});

test("no field is required on the client that the server accepts as blank", () => {
  for (const [mode, schema] of Object.entries(schemas)) {
    const payload = complete[mode];
    const fieldsOnScreen = formSteps[mode].flat();

    for (const field of fieldsOnScreen) {
      const rule = fieldRules[field];
      const clientRequires = Boolean(rule?.required) || Boolean(rule?.validate);
      if (!clientRequires) continue;
      if (!(field in payload)) continue;

      const without = { ...payload };
      delete without[field];
      const serverAccepts = schema.safeParse(without).success;

      assert.ok(
        !serverAccepts,
        `${mode}.${field}: the form demands it but the server accepts it missing. ` +
          `That blocks people for no reason — relax the rule in src/lib/field-rules.ts.`,
      );
    }
  }
});

test("client patterns accept what the server accepts", () => {
  const cases = [
    [EMAIL_PATTERN, ["a@b.co", "aisha.rahman@example.com"], ["nope", "a@b", "@b.co"]],
    [PHONE_PATTERN, ["+966512345678", "0512345678", "+44 20 7946 0000"], ["!!", "12"]],
    [URL_PATTERN, ["https://linkedin.com/in/x", "http://example.org"], ["linkedin.com/in/x", "ftp://x"]],
  ];

  for (const [pattern, valid, invalid] of cases) {
    for (const value of valid) assert.ok(pattern.test(value), `${pattern} should accept "${value}"`);
    for (const value of invalid) assert.ok(!pattern.test(value), `${pattern} should reject "${value}"`);
  }
});

test("phone rules agree with the schema on real numbers", () => {
  for (const value of ["+966512345678", "0512345678", "+44 20 7946 0000"]) {
    const clientOk = PHONE_PATTERN.test(value);
    const serverOk = chapterSchema.safeParse({ ...complete.chapter, mobile: value }).success;
    assert.equal(clientOk, serverOk, `disagreement on "${value}": client ${clientOk}, server ${serverOk}`);
  }
});

test("every rule message is a key that exists in both locales", async () => {
  const { readFileSync } = await import("node:fs");
  const en = JSON.parse(readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"));
  const ar = JSON.parse(readFileSync(new URL("../messages/ar.json", import.meta.url), "utf8"));

  const collect = (rule) => {
    const out = [];
    if (typeof rule.required === "string") out.push(rule.required);
    for (const key of ["pattern", "maxLength", "minLength", "min", "max"]) {
      if (rule[key]?.message) out.push(rule[key].message);
    }
    if (rule.validate) out.push(...Object.keys(rule.validate));
    return out;
  };

  for (const [field, rule] of Object.entries(fieldRules)) {
    for (const key of collect(rule)) {
      assert.ok(en.join.errors[key], `${field}: en is missing join.errors.${key}`);
      assert.ok(ar.join.errors[key], `${field}: ar is missing join.errors.${key}`);
    }
  }
});
