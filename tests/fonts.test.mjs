/**
 * Guards the Arabic display face's subset.
 *
 * Amiri ships 5,429 glyphs, most of them precomposed Quranic ligatures this site
 * never sets, and it is preloaded on every Arabic page. scripts/subset-fonts.mjs
 * cuts it to the ranges real copy uses. The risk that creates is silent: add a
 * character outside those ranges and it does not break, it just renders in
 * whatever font the browser falls back to, in the middle of a headline.
 *
 * A first pass at the ranges dropped U+2713, the tick in the confirmation card's
 * "Join ✓" that the acceptance checklist names by hand. This test exists so the
 * next one is caught before it ships rather than after.
 *
 * Run with: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/** Kept by scripts/subset-fonts.mjs. Change both or neither. */
const SUBSET_RANGES = [
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Arabic Extended-A
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
  [0x0020, 0x007e], // Latin basic
  [0x00a0, 0x00ff], // Latin-1 punctuation and accents
  [0x2000, 0x206f], // General punctuation
  [0x2190, 0x21ff], // Arrows
  [0x2713, 0x2714], // The confirmation card's tick
];

const covered = (cp) => SUBSET_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi);

const strings = (value, path = "") => {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
};

for (const locale of ["ar", "en"]) {
  test(`every character in messages/${locale}.json is inside the font subset`, () => {
    const catalogue = JSON.parse(
      readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"),
    );
    const escapes = [];
    for (const [key, value] of strings(catalogue)) {
      for (const char of value) {
        const cp = char.codePointAt(0);
        if (!covered(cp)) {
          escapes.push(`${key}: U+${cp.toString(16).toUpperCase().padStart(4, "0")} (${char})`);
        }
      }
    }
    assert.deepEqual(
      escapes,
      [],
      "these characters would fall back to another font mid-sentence — " +
        "add their range to scripts/subset-fonts.mjs AND to SUBSET_RANGES here, " +
        "then re-run the script:\n  " + escapes.join("\n  "),
    );
  });
}
