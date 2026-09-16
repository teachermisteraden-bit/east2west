/**
 * First-load JavaScript budget (master prompt §8): 200 KB gzipped or less,
 * excluding scenes that are lazily loaded on demand.
 *
 * Reads every prerendered HTML page, collects the scripts it actually requests
 * on first paint, and sums their gzipped size. That is what the visitor's phone
 * downloads, so it is measured rather than inferred from a manifest.
 *
 * Dynamic routes are never written to disk, so they are invisible to a purely
 * static scan — and /join, which carries the form, is exactly such a route and
 * the heaviest one. Set BUDGET_BASE_URL to a running server and those routes are
 * fetched and measured too.
 *
 * Run after `next build`.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, relative, resolve } from "node:path";

const BUDGET_KB = 200;
const appDir = resolve(".next/server/app");
const staticRoot = resolve(".next");

if (!existsSync(appDir)) {
  console.error("No build output found. Run `next build` first.");
  process.exit(1);
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return htmlFiles(path);
    return e.name.endsWith(".html") ? [path] : [];
  });
}

const gzipCache = new Map();
function gzippedKB(urlPath) {
  if (gzipCache.has(urlPath)) return gzipCache.get(urlPath);
  // /_next/static/... maps to .next/static/...
  const file = resolve(staticRoot, urlPath.replace(/^\/_next\//, ""));
  let size = 0;
  if (existsSync(file) && statSync(file).isFile()) {
    size = gzipSync(readFileSync(file)).length / 1024;
  }
  gzipCache.set(urlPath, size);
  return size;
}

/** Routes that render on demand, so `next build` leaves no HTML to inspect. */
const DYNAMIC_ROUTES = [
  "/en/join?type=graduate",
  "/ar/join?type=graduate",
  "/en/join?type=sponsor",
];

function measure(html) {
  const tags = [...html.matchAll(/<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g)];
  const scripts = [
    ...new Set(
      tags.filter(([, before, , after]) => !/nomodule/i.test(before + after)).map(([, , src]) => src),
    ),
  ].filter((s) => s.startsWith("/_next/"));
  return { kb: scripts.reduce((sum, s) => sum + gzippedKB(s), 0), count: scripts.length };
}

const rows = htmlFiles(appDir).map((file) => {
  const html = readFileSync(file, "utf8");
  // `nomodule` scripts are the legacy polyfill bundle. Browsers that support ES
  // modules — everything we target — never fetch them, so they are not first-load
  // cost and are excluded, as Next's own reporting does.
  const tags = [...html.matchAll(/<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g)];
  const scripts = [
    ...new Set(
      tags
        .filter(([, before, , after]) => !/nomodule/i.test(before + after))
        .map(([, , src]) => src),
    ),
  ].filter((s) => s.startsWith("/_next/"));
  const kb = scripts.reduce((sum, s) => sum + gzippedKB(s), 0);
  const route = "/" + relative(appDir, file).replace(/\.html$/, "").replace(/\/index$/, "");
  return { route, kb, count: scripts.length };
});

const base = process.env.BUDGET_BASE_URL;
if (base) {
  for (const route of DYNAMIC_ROUTES) {
    try {
      const response = await fetch(new URL(route, base));
      const html = await response.text();
      const { kb, count } = measure(html);
      rows.push({ route: `${route} (dynamic)`, kb, count });
    } catch (error) {
      console.error(`could not measure ${route}: ${error.message}`);
      process.exitCode = 1;
    }
  }
} else {
  console.log("BUDGET_BASE_URL is not set, so dynamic routes (including /join) were not measured.\n");
}

rows.sort((a, b) => b.kb - a.kb);

const width = Math.max(...rows.map((r) => r.route.length));
console.log(`First-load JS, gzipped (budget ${BUDGET_KB} KB per route)\n`);
for (const r of rows) {
  console.log(
    `  ${r.kb > BUDGET_KB ? "FAIL" : "ok  "}  ${r.route.padEnd(width)}  ${r.kb.toFixed(1).padStart(7)} KB  (${r.count} scripts)`,
  );
}

const worst = rows[0];
console.log(
  `\nLargest: ${worst.route} at ${worst.kb.toFixed(1)} KB — ${(BUDGET_KB - worst.kb).toFixed(1)} KB of headroom.`,
);

const failures = rows.filter((r) => r.kb > BUDGET_KB);
if (failures.length) {
  console.error(`\n${failures.length} route(s) over the ${BUDGET_KB} KB budget.`);
  process.exit(1);
}
