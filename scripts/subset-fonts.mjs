/**
 * Subsets the Arabic display face.
 *
 * Amiri ships 5,429 glyphs and 1,247 mapped codepoints, 611 of which are in
 * Arabic Presentation Forms-A (U+FB50–FDFF) — the precomposed Quranic ligature
 * block the face is celebrated for and that this site never uses. At 106 KB it
 * was three times the weight of every other font on the site combined, and it
 * is preloaded at high priority on every Arabic page, where it competes with the
 * document for bandwidth and pushes the headline's paint out.
 *
 * What is kept, and why none of it is optional:
 *   U+0600–06FF   Arabic, the block real text is written in
 *   U+0750–077F   Arabic Supplement
 *   U+08A0–08FF   Arabic Extended-A
 *   U+FE70–FEFF   Presentation Forms-B, still used by some older renderers
 *   Latin basic + punctuation, for numerals and any Latin inside a headline
 *
 * `--layout-features='*'` is load-bearing: Arabic is a joining script, and the
 * initial/medial/final forms and the lam-alef ligature live in GSUB. Dropping
 * layout features to save bytes would render Arabic as disconnected letters,
 * which is not a smaller font, it is a broken one.
 *
 *   node scripts/subset-fonts.mjs
 */
import { execFileSync } from "node:child_process";
import { statSync, copyFileSync, renameSync } from "node:fs";

const UNICODES = [
  "U+0600-06FF",
  "U+0750-077F",
  "U+08A0-08FF",
  "U+FE70-FEFF",
  "U+0020-007E",
  "U+00A0-00FF",
  "U+2000-206F",
  "U+2190-21FF",
  // The confirmation card's "Join ✓". The acceptance checklist names that tick
  // by hand, and a first pass at these ranges dropped it: it fell out of the
  // subset silently and would have rendered in whatever font the browser
  // reached for next. tests/fonts.test.mjs now fails if any string in either
  // catalogue uses a character these ranges do not cover.
  "U+2713-2714",
].join(",");

// Always subset from the package copy, never from the file already in public/.
// Subsetting a subset would compound silently and there would be no way back
// without a reinstall.
const source = "node_modules/@fontsource/amiri/files/amiri-arabic-400-normal.woff2";
const target = "public/fonts/amiri-400.woff2";
const before = statSync(source).size;

execFileSync(
  "pyftsubset",
  [
    source,
    `--unicodes=${UNICODES}`,
    "--layout-features=*",
    "--flavor=woff2",
    "--output-file=public/fonts/amiri-400.subset.woff2",
  ],
  { stdio: "inherit" },
);

renameSync("public/fonts/amiri-400.subset.woff2", target);
const after = statSync(target).size;
console.log(
  `amiri-400.woff2  ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB ` +
    `(${Math.round((1 - after / before) * 100)}% smaller)`,
);
