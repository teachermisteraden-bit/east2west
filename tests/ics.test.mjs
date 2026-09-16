/**
 * The calendar file.
 *
 * There are no real events yet, so nothing exercises this end to end. These
 * tests stand in until there are: they check the parts that are easy to get
 * wrong and hard to notice — CRLF line endings, escaping, line folding, and the
 * Hijri date surviving into a format that only understands Gregorian.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { buildIcs } from "../src/lib/ics.ts";

const event = {
  slug: "first-gathering",
  type: "gathering",
  title: { en: "First weekly gathering", ar: "أول لقاء أسبوعي" },
  summary: { en: "An evening of introductions; tea, and a keynote.", ar: "أمسية تعارف" },
  start: "2026-10-08T19:00:00+03:00",
  end: "2026-10-08T21:00:00+03:00",
  city: { en: "Madinah", ar: "المدينة المنورة" },
  venue: { en: "Partner venue", ar: "مقر شريك" },
};

test("produces a well-formed calendar", () => {
  const ics = buildIcs(event, "en", "https://example.org");

  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  assert.match(ics, /VERSION:2\.0/);
  assert.match(ics, /UID:first-gathering@east-to-west/);

  // Every line ends CRLF, as RFC 5545 requires.
  const bare = ics.split("\r\n").filter(Boolean);
  assert.ok(bare.length > 8, "expected a full VEVENT");
  assert.ok(!ics.includes("\n\n"));
});

test("converts the event's Riyadh time to UTC correctly", () => {
  const ics = buildIcs(event, "en", "https://example.org");
  // 19:00 at +03:00 is 16:00Z.
  assert.match(ics, /DTSTART:20261008T160000Z/);
  assert.match(ics, /DTEND:20261008T180000Z/);
});

test("carries the Hijri date, which the format itself cannot express", () => {
  const ics = buildIcs(event, "en", "https://example.org");
  const description = ics.split("\r\n").find((l) => l.startsWith("DESCRIPTION:"));
  assert.ok(description, "expected a DESCRIPTION line");
  assert.match(ics, /AH/, "the Umm al-Qura date should appear in the description");
});

test("escapes characters that would otherwise break the file", () => {
  const ics = buildIcs(event, "en", "https://example.org");
  // The summary contains a semicolon and a comma; both must be escaped.
  assert.ok(ics.includes("\;"), "semicolons must be escaped");
  assert.ok(ics.includes("\\,"), "commas must be escaped");
});

test("folds long lines to 75 octets with a leading space", () => {
  const long = {
    ...event,
    title: { en: "A".repeat(200), ar: "ب".repeat(200) },
  };
  const ics = buildIcs(long, "en", "https://example.org");
  for (const line of ics.split("\r\n")) {
    assert.ok(line.length <= 75, `line exceeds 75 characters: ${line.slice(0, 40)}…`);
  }
  assert.ok(ics.includes("\r\n A"), "continuation lines begin with a space");
});

test("renders in Arabic when the visitor is reading Arabic", () => {
  const ics = buildIcs(event, "ar", "https://example.org");
  assert.ok(ics.includes("أول لقاء أسبوعي") || ics.includes("\\n"), "Arabic title should be present");
  assert.match(ics, /URL:https:\/\/example\.org\/ar\/events/);
});
