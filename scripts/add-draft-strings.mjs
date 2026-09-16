/**
 * Adds strings that the approved copy does not yet cover, to every locale file,
 * each marked with a `<key>_draft: true` sibling so it shows up for owner review.
 *
 * Usage: node scripts/add-draft-strings.mjs drafts/<name>.json
 * The input is { "<locale>": { "<dotted.path>": "<value>" } }.
 *
 * Existing keys are never overwritten — this only fills gaps.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const input = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
const report = [];

for (const [locale, entries] of Object.entries(input)) {
  const file = resolve(`messages/${locale}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));

  for (const [path, value] of Object.entries(entries)) {
    const parts = path.split(".");
    const leaf = parts.pop();
    let node = json;
    for (const part of parts) {
      if (typeof node[part] !== "object" || node[part] === null) node[part] = {};
      node = node[part];
    }
    if (Object.prototype.hasOwnProperty.call(node, leaf)) {
      report.push(`  skip (exists) ${locale}: ${path}`);
      continue;
    }
    node[leaf] = value;
    node[`${leaf}_draft`] = true;
    report.push(`  added ${locale}: ${path}`);
  }

  writeFileSync(file, JSON.stringify(json, null, 2) + "\n", "utf8");
}

console.log(report.join("\n"));
