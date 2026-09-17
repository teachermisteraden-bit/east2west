/**
 * Laying out right-to-left text for Satori (next/og).
 *
 * Satori shapes Arabic letters correctly but does not run the Unicode
 * bidirectional algorithm, so a right-to-left line comes out with its words in
 * left-to-right order.
 *
 * Reversing the string is not the answer twice over: it would break the
 * contextual joining that makes Arabic legible, and it only ever works for text
 * that fits on one line — once the line wraps, the words land on the wrong rows.
 *
 * So the words are handed to flexbox as separate items in a `row-reverse`,
 * wrapping container. Each word keeps its letters in logical order, so shaping
 * is untouched, and flexbox places the words right-to-left and wraps them
 * correctly line by line.
 *
 * This is needed only for images. The browser does the real thing for the site.
 */
const RTL_RANGE = /[֐-ࣿיִ-﷿ﹰ-﻿]/;

export const hasRtl = (text: string): boolean => RTL_RANGE.test(text);

/**
 * True when the string mixes scripts, which a word-order flip cannot place
 * correctly — a Latin word or a number inside Arabic needs the full algorithm.
 */
export function isMixedDirection(text: string): boolean {
  if (!hasRtl(text)) return false;
  return /[A-Za-z0-9]/.test(text);
}

/**
 * Splits a line into words for flex layout.
 *
 * Throws on mixed-direction text rather than silently producing something
 * wrong. tests/og.test.mjs checks every string that reaches a card.
 */
export function toWords(text: string): string[] {
  if (isMixedDirection(text)) {
    throw new Error(
      `Cannot lay out mixed-direction text for an image: ${JSON.stringify(text)}. ` +
        `Satori does not implement the bidi algorithm, so card strings must stay in one script.`,
    );
  }
  return text.split(/\s+/).filter(Boolean);
}
