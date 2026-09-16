/**
 * Guards bilingual parity.
 *
 * /en and /ar are equals (non-negotiable 3), so every key must exist in both,
 * with the same ICU placeholders. As the society expands beyond the Kingdom this
 * test covers each new language automatically — it reads the locale registry
 * rather than a hardcoded pair.
 *
 * Run with: npx tsx --test tests/messages.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { activeLocales, defaultLocale } from "../src/i18n/locales.ts";

const load = (code) => JSON.parse(readFileSync(new URL(`../messages/${code}.json`, import.meta.url), "utf8"));

/** Dotted paths to every leaf string. Arrays count as one leaf. */
function leaves(node, prefix = "") {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return [prefix];
  return Object.entries(node).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k));
}

const at = (obj, path) => path.split(".").reduce((a, k) => a?.[k], obj);
const placeholders = (v) =>
  [...JSON.stringify(v).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const base = load(defaultLocale);
const baseKeys = leaves(base);

for (const locale of activeLocales) {
  if (locale.code === defaultLocale) continue;
  const other = load(locale.code);
  const otherKeys = leaves(other);

  test(`${locale.code}: has every key the default locale has`, () => {
    const missing = baseKeys.filter((k) => !otherKeys.includes(k));
    assert.deepEqual(missing, [], `${locale.code} is missing: ${missing.join(", ")}`);
  });

  test(`${locale.code}: has no keys the default locale lacks`, () => {
    const extra = otherKeys.filter((k) => !baseKeys.includes(k));
    assert.deepEqual(extra, [], `${locale.code} has unexpected keys: ${extra.join(", ")}`);
  });

  test(`${locale.code}: ICU placeholders match`, () => {
    const mismatched = baseKeys
      .filter((k) => !k.endsWith("_draft"))
      .filter((k) => placeholders(at(base, k)) !== placeholders(at(other, k)))
      .map((k) => `${k} (${defaultLocale}: ${placeholders(at(base, k))} / ${locale.code}: ${placeholders(at(other, k))})`);
    assert.deepEqual(mismatched, [], `placeholder mismatch: ${mismatched.join("; ")}`);
  });

  test(`${locale.code}: array-valued keys have matching lengths`, () => {
    const mismatched = baseKeys
      .filter((k) => Array.isArray(at(base, k)))
      .filter((k) => at(base, k).length !== at(other, k)?.length)
      .map((k) => `${k} (${at(base, k).length} vs ${at(other, k)?.length})`);
    assert.deepEqual(mismatched, [], `list length mismatch: ${mismatched.join("; ")}`);
  });

  test(`${locale.code}: no untranslated strings copied from the default locale`, () => {
    // A string identical to English is usually an untranslated stub. Three kinds
    // of value are legitimately the same in every language:
    //   - the language switch label, which names the OTHER language
    //   - the short brand name, a proper noun
    //   - `.group` values, which are identifiers keying into home.programmes.groups
    const allowed = new Set(["common.languageSwitch", "meta.shortName"]);
    const isIdentifier = (k) => k.endsWith(".group");
    const identical = baseKeys
      .filter((k) => !k.endsWith("_draft") && !allowed.has(k) && !isIdentifier(k))
      .filter((k) => typeof at(base, k) === "string" && at(base, k) === at(other, k));
    assert.deepEqual(identical, [], `${locale.code} strings identical to ${defaultLocale}: ${identical.join(", ")}`);
  });
}

test("draft strings are flagged in every locale", () => {
  // A `_draft` marker must be present in all locales, so nothing awaiting review
  // silently ships in one language only.
  for (const locale of activeLocales) {
    const keys = leaves(load(locale.code)).filter((k) => k.endsWith("_draft"));
    const baseDrafts = baseKeys.filter((k) => k.endsWith("_draft"));
    assert.deepEqual(keys.sort(), baseDrafts.sort(), `${locale.code} draft markers differ from ${defaultLocale}`);
  }
});
