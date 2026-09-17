/**
 * Open Graph cards.
 *
 * Satori does not implement the Unicode bidirectional algorithm, so the card
 * layout places Arabic words itself with flexbox. That works for text in a
 * single script and cannot work for mixed text — a Latin word or a number
 * inside an Arabic line needs the real algorithm.
 *
 * These tests check every string that reaches a card, so the day someone adds
 * "East to West 2026" to an Arabic title it fails here rather than shipping a
 * scrambled share image nobody looks at until it is public.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { hasRtl, isMixedDirection, toWords } from "../src/lib/bidi.ts";

const load = (code) => JSON.parse(readFileSync(new URL(`../messages/${code}.json`, import.meta.url), "utf8"));
const ar = load("ar");
const en = load("en");

/** Exactly the strings renderOgImage is given, for every card we generate. */
const cardStrings = [
  ar.meta.tagline,
  ar.common.founded,
  ar.graduates.title,
  ar.universities.title,
  ar.sponsors.title,
  ar.businesses.title,
  "الشرق إلى الغرب",
];

test("Arabic is detected and Latin is not", () => {
  assert.ok(hasRtl(ar.meta.tagline));
  assert.ok(!hasRtl(en.meta.tagline));
});

test("no Arabic card string mixes scripts", () => {
  for (const text of cardStrings) {
    assert.ok(
      !isMixedDirection(text),
      `This string cannot be laid out correctly on a card: ${JSON.stringify(text)}`,
    );
  }
});

test("mixed text is rejected loudly rather than laid out wrongly", () => {
  assert.throws(() => toWords("انضم إلى East to West"), /mixed-direction/);
  assert.throws(() => toWords("الملتقى 2026"), /mixed-direction/);
});

test("words keep their letters in logical order, so shaping still works", () => {
  const words = toWords(ar.meta.tagline);
  // Reordering happens between words, never inside one.
  assert.ok(words.every((w) => ar.meta.tagline.includes(w)));
  assert.equal(words[0], "حيث");
  assert.ok(words.length > 3);
});

test("Latin strings pass through untouched", () => {
  assert.deepEqual(toWords("Your degree is the start."), ["Your", "degree", "is", "the", "start."]);
});
